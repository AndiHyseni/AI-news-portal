import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import NewsDbModel from "../../models/News.model";
import * as natural from "natural";
import OpenAI from "openai";

interface ChatbotRequest {
  message: string;
}

interface ChatContext {
  recentMessages: string[];
  currentTopic?: string;
  lastInteractionTime: number;
  awaitingCategorySelection?: boolean;
  lastQuestion?: string;
}

interface NewsResponse {
  type: "news";
  message: string;
  articles: Array<{
    id: string;
    title: string;
    subtitle?: string;
    imageUrl?: string;
  }>;
}

interface TextResponse {
  type: "text";
  message: string;
}

type ChatbotResponse = NewsResponse | TextResponse;

// Enhanced intent patterns with more variations and context
const intentPatterns = {
  greeting: [
    "hello",
    "hi",
    "hey",
    "greetings",
    "good morning",
    "good afternoon",
    "good evening",
    "howdy",
    "what's up",
    "hi there",
    "hello there",
  ],
  category: [
    "category",
    "categories",
    "topics",
    "sections",
    "show me categories",
    "what categories",
    "news categories",
    "available categories",
    "news sections",
    "browse categories",
    "list categories",
  ],
  search: [
    "find",
    "search",
    "looking for",
    "article about",
    "news on",
    "articles about",
    "tell me about",
    "what happened",
    "show me news about",
    "any news on",
    "do you have news about",
    "what's new in",
    "latest updates on",
    "recent news about",
    "information about",
    "coverage on",
  ],
  help: [
    "help",
    "how to",
    "guide",
    "explain",
    "what can you do",
    "instructions",
    "how do you work",
    "what are your features",
    "how to use",
    "capabilities",
    "what do you know",
    "how can you help",
  ],
  latest: [
    "latest",
    "recent",
    "new",
    "trending",
    "today",
    "headlines",
    "breaking",
    "current",
    "fresh",
    "just in",
    "newest",
    "top stories",
    "whats new",
    "breaking news",
    "hot news",
  ],
  politics: [
    "politics",
    "political",
    "government",
    "election",
    "parliament",
    "policy",
    "politician",
    "democratic",
    "republican",
    "campaign",
    "voting",
    "legislation",
    "congress",
    "senate",
    "political news",
    "government news",
    "election news",
    "political updates",
  ],
  technology: [
    "tech",
    "technology",
    "digital",
    "software",
    "hardware",
    "gadgets",
    "innovation",
    "ai",
    "artificial intelligence",
    "cyber",
    "internet",
    "computing",
    "it news",
    "tech news",
    "digital transformation",
    "technological",
    "smart devices",
    "tech industry",
  ],
  health: [
    "health",
    "medical",
    "wellness",
    "healthcare",
    "disease",
    "treatment",
    "medicine",
    "doctors",
    "hospital",
    "clinic",
    "pandemic",
    "virus",
    "medical news",
    "health updates",
    "healthcare system",
    "public health",
    "medical research",
  ],
  sports: [
    "sports",
    "sport",
    "game",
    "match",
    "tournament",
    "team",
    "player",
    "championship",
    "league",
    "athletics",
    "football",
    "soccer",
    "basketball",
    "sports news",
    "game results",
    "sports updates",
    "competition",
  ],
  confirmation: [
    "yes",
    "yeah",
    "sure",
    "okay",
    "ok",
    "yep",
    "please",
    "correct",
    "right",
    "exactly",
    "absolutely",
    "definitely",
    "of course",
  ],
};

// Enhanced context tracking
interface EnhancedChatContext extends ChatContext {
  categoryPreferences?: string[];
  lastTopics?: string[];
  interactionCount: number;
  commonQueries?: Map<string, number>;
}

// Initialize enhanced user sessions
const enhancedUserSessions: Map<string, EnhancedChatContext> = new Map();

// Initialize NLP components
const tokenizer = new natural.WordTokenizer();

// Function to analyze user message for better context
function analyzeMessage(message: string, context: EnhancedChatContext): void {
  const lowercaseMessage = message.toLowerCase();

  // Track interaction count
  context.interactionCount = (context.interactionCount || 0) + 1;

  // Initialize arrays if they don't exist
  context.categoryPreferences = context.categoryPreferences || [];
  context.lastTopics = context.lastTopics || [];
  context.commonQueries = context.commonQueries || new Map();

  // Detect categories in message
  Object.entries(intentPatterns).forEach(([intent, patterns]) => {
    if (patterns.some((pattern) => lowercaseMessage.includes(pattern))) {
      if (["politics", "technology", "health", "sports"].includes(intent)) {
        // Add to category preferences if not already present
        if (!context.categoryPreferences?.includes(intent)) {
          context.categoryPreferences?.push(intent);
        }
        // Keep only last 3 topics
        if (context.lastTopics) {
          context.lastTopics.unshift(intent);
          context.lastTopics = context.lastTopics.slice(0, 3);
        }
      }
    }
  });

  // Track common queries
  context.commonQueries?.set(
    message,
    (context.commonQueries?.get(message) || 0) + 1
  );
}

// Enhanced response generation based on context
async function generateEnhancedResponse(
  message: string,
  context: EnhancedChatContext
): Promise<ChatbotResponse> {
  const lowercaseMessage = message.toLowerCase();

  // Update context with message analysis
  analyzeMessage(message, context);

  // Check for category-specific queries first
  for (const [category, patterns] of Object.entries(intentPatterns)) {
    if (patterns.some((pattern) => lowercaseMessage.includes(pattern))) {
      if (["politics", "technology", "health", "sports"].includes(category)) {
        return await getNewsForCategory(category);
      }
    }
  }

  // Handle latest news request
  if (
    intentPatterns.latest.some((pattern) => lowercaseMessage.includes(pattern))
  ) {
    return await getLatestNews();
  }

  // Handle greetings with context-aware response
  if (
    intentPatterns.greeting.some((pattern) =>
      lowercaseMessage.includes(pattern)
    )
  ) {
    if (context.interactionCount > 1) {
      return {
        type: "text",
        message: `Welcome back! Would you like to see news about ${
          context.lastTopics?.[0] || "any particular topic"
        }?`,
      };
    }
    return {
      type: "text",
      message:
        "Hello! I can help you find news about politics, technology, health, sports, or show you the latest headlines. What interests you?",
    };
  }

  // Handle help requests
  if (
    intentPatterns.help.some((pattern) => lowercaseMessage.includes(pattern))
  ) {
    return {
      type: "text",
      message:
        "I can help you find news articles by category (politics, technology, health, sports), show you the latest headlines, or search for specific topics. Just tell me what you're interested in!",
    };
  }

  // Handle category browsing
  if (
    intentPatterns.category.some((pattern) =>
      lowercaseMessage.includes(pattern)
    )
  ) {
    return {
      type: "text",
      message:
        "I can show you news from these categories: Politics, Technology, Health, and Sports. Which one would you like to explore?",
    };
  }

  // If no specific intent is matched, try to extract search terms
  const searchTerms = extractSearchTerms(
    message,
    tokenizer.tokenize(message) || []
  );
  if (searchTerms) {
    const articles = await findRelevantArticles(searchTerms);
    if (articles.length > 0) {
      return {
        type: "news",
        message: `Here are some articles related to "${searchTerms}":`,
        articles: articles.map((article) => ({
          id: article.id,
          title: article.title,
          subtitle: article.subtitle || undefined,
          imageUrl: article.image || undefined,
        })),
      };
    }
  }

  // Fallback response using context
  if (context.categoryPreferences?.length) {
    const preferredCategory = context.categoryPreferences[0];
    return await getNewsForCategory(preferredCategory);
  }

  // Default fallback
  return {
    type: "text",
    message:
      "I can help you find news articles. Try asking about a specific topic like politics, technology, health, or sports, or say 'latest news' to see recent headlines.",
  };
}

// Update the main processMessage function to use enhanced features
export const ChatbotService = {
  async processMessage(data: ChatbotRequest, userId: string = "anonymous") {
    try {
      const { message } = data;

      if (!message || typeof message !== "string") {
        return failure(
          {
            response: {
              type: "text",
              message: "Invalid message format",
            },
          },
          StatusCodeEnums.UNPROCESSABLE_ENTITY
        );
      }

      // Get or create enhanced user session
      let userContext = enhancedUserSessions.get(userId) as EnhancedChatContext;
      if (!userContext) {
        userContext = {
          recentMessages: [],
          lastInteractionTime: Date.now(),
          interactionCount: 0,
          categoryPreferences: [],
          lastTopics: [],
          commonQueries: new Map(),
        };
        enhancedUserSessions.set(userId, userContext);
      }

      // Update context
      userContext.lastInteractionTime = Date.now();
      if (userContext.recentMessages.length >= 5) {
        userContext.recentMessages.shift();
      }
      userContext.recentMessages.push(message);

      // Try OpenAI first if available
      const openAiResponse = await tryOpenAIResponse(message, userContext);
      if (openAiResponse) {
        return ok({
          response: {
            type: "text",
            message: openAiResponse,
          },
        });
      }

      // Use enhanced response generation
      const response = await generateEnhancedResponse(message, userContext);
      return ok({ response });
    } catch (error) {
      console.error("Error in chatbot service:", error);
      return failure(
        {
          response: {
            type: "text",
            message: "Failed to process chatbot request",
          },
        },
        StatusCodeEnums.UNPROCESSABLE_ENTITY
      );
    }
  },
};

// Try to use OpenAI for response generation if API key is available
async function tryOpenAIResponse(
  message: string,
  context: ChatContext
): Promise<string | null> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      return null;
    }

    // Construct a simple conversation history to provide context
    const conversationContext =
      context.recentMessages.length > 0
        ? "Previous messages: " + context.recentMessages.join(" | ") + "\n\n"
        : "";

    // Use OpenAI directly since our OpenAIService is specialized for article summaries
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful news assistant chatbot. Provide concise, informative responses about news topics, categories, and help users find relevant articles. Keep responses friendly but brief (1-3 sentences).",
        },
        {
          role: "user",
          content: `${conversationContext}User message: ${message}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    return response.choices[0]?.message?.content?.trim() || null;
  } catch (error) {
    console.error("Error using OpenAI for chatbot:", error);
    return null;
  }
}

// Format article results with clickable links and images
function formatArticleResultsWithLinks(articles: any[]): string {
  return articles
    .map((article) => ({
      id: article.id,
      title: article.title,
      subtitle: article.subtitle || undefined,
      imageUrl: article.image || undefined,
    }))
    .map((article) => {
      const link = `${process.env.FRONTEND_URL}/news/${article.id}`;
      return `[${article.title}](${link}) - ${article.subtitle || ""}`;
    })
    .join("\n");
}

// Function to get news for a specific category
async function getNewsForCategory(category: string): Promise<ChatbotResponse> {
  try {
    const articles = await NewsDbModel.query()
      .select(
        "news.id",
        "news.title",
        "news.subtitle",
        "news.created_at",
        "news.image",
        "category.name as category_name"
      )
      .join("category", "news.category_id", "category.id")
      .whereRaw("LOWER(category.name) LIKE ?", [`%${category.toLowerCase()}%`])
      .where("news.is_deleted", false)
      .orderBy("news.created_at", "desc")
      .limit(5);

    if (articles.length > 0) {
      const response = formatArticleResultsWithLinks(articles);
      return {
        type: "news",
        message: `Here are the latest ${category} news:`,
        articles: articles.map((article) => ({
          id: article.id,
          title: article.title,
          subtitle: article.subtitle || undefined,
          imageUrl: article.image || undefined,
        })),
      };
    } else {
      return {
        type: "text",
        message: `I don't have any recent news in the ${category} category. Would you like to see news from another category?`,
      };
    }
  } catch (error) {
    console.error(`Error fetching ${category} news:`, error);
    return {
      type: "text",
      message: `Sorry, I couldn't fetch the latest ${category} news. Would you like to try another category?`,
    };
  }
}

// Function to get latest news across all categories
async function getLatestNews(): Promise<ChatbotResponse> {
  try {
    const articles = await NewsDbModel.query()
      .select(
        "news.id",
        "news.title",
        "news.subtitle",
        "news.created_at",
        "news.image",
        "category.name as category_name"
      )
      .join("category", "news.category_id", "category.id")
      .where("news.is_deleted", false)
      .orderBy("news.created_at", "desc")
      .limit(5);

    if (articles.length > 0) {
      const response = formatArticleResultsWithLinks(articles);
      return {
        type: "news",
        message: "Here are today's top headlines:",
        articles: articles.map((article) => ({
          id: article.id,
          title: article.title,
          subtitle: article.subtitle || undefined,
          imageUrl: article.image || undefined,
        })),
      };
    } else {
      return {
        type: "text",
        message:
          "I don't have any recent news to show. Would you like to browse by category instead?",
      };
    }
  } catch (error) {
    console.error("Error fetching latest news:", error);
    return {
      type: "text",
      message:
        "Sorry, I couldn't fetch the latest news. Would you like to try browsing by category instead?",
    };
  }
}

// Improved intent detection using both full message and tokens
function detectIntent(message: string, tokens: string[]): string {
  // First try exact phrase matching
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    for (const pattern of patterns) {
      if (message.includes(pattern)) {
        return intent;
      }
    }
  }

  // If no exact match, try token-based matching
  const tokenMatches: Record<string, number> = {};

  // For each intent, count how many tokens match its patterns
  for (const [intent, patterns] of Object.entries(intentPatterns)) {
    tokenMatches[intent] = 0;

    // Split each pattern into tokens for comparison
    const patternTokenSets = patterns.map((pattern) =>
      pattern.split(" ").map((word) => word.toLowerCase())
    );

    // Count matches for each token
    for (const token of tokens) {
      for (const patternTokens of patternTokenSets) {
        if (patternTokens.includes(token.toLowerCase())) {
          tokenMatches[intent]++;
          break; // Count each token match only once per intent
        }
      }
    }
  }

  // Find the intent with the most token matches
  const bestMatch = Object.entries(tokenMatches).reduce(
    (best, [intent, matches]) =>
      matches > best.matches ? { intent, matches } : best,
    { intent: "unknown", matches: 0 }
  );

  // Return the best matching intent if it has at least one match
  return bestMatch.matches > 0 ? bestMatch.intent : "unknown";
}

// Improved search term extraction using tokens
function extractSearchTerms(message: string, tokens: string[]): string {
  // First try phrase-based extraction
  const searchPhrases = [
    "about",
    "on",
    "regarding",
    "related to",
    "find",
    "search",
    "news on",
    "articles about",
    "information on",
    "stories about",
  ];

  for (const phrase of searchPhrases) {
    const index = message.indexOf(phrase);
    if (index !== -1) {
      const extractedPhrase = message.substring(index + phrase.length).trim();
      if (extractedPhrase) {
        return extractedPhrase;
      }
    }
  }

  // If no phrase match, use the cleaned tokens
  // Filter out common words and short tokens
  const searchTokens = tokens.filter(
    (token) =>
      token.length > 3 &&
      ![
        "what",
        "when",
        "where",
        "which",
        "who",
        "how",
        "news",
        "article",
        "find",
        "get",
        "show",
        "me",
        "please",
        "would",
        "could",
        "should",
        "want",
        "like",
        "need",
        "tell",
        "give",
        "the",
        "and",
        "for",
      ].includes(token.toLowerCase())
  );

  return searchTokens.join(" ");
}

// Find relevant articles based on search terms
async function findRelevantArticles(
  searchTerms: string,
  limit: number = 3
): Promise<any[]> {
  try {
    const searchTermLower = searchTerms.toLowerCase();
    // Search in title, content, and tags
    const articles = await NewsDbModel.query()
      .select(
        "news.id",
        "news.title",
        "news.subtitle",
        "news.created_at",
        "news.image",
        "category.name as category_name"
      )
      .join("category", "news.category_id", "category.id")
      .where(function () {
        this.whereRaw("LOWER(news.title) LIKE ?", [`%${searchTermLower}%`])
          .orWhereRaw("LOWER(news.content) LIKE ?", [`%${searchTermLower}%`])
          .orWhereRaw("LOWER(news.tags) LIKE ?", [`%${searchTermLower}%`]);
      })
      .where("news.is_deleted", false)
      .orderBy("news.created_at", "desc")
      .limit(limit);

    return articles;
  } catch (error) {
    console.error("Error searching for articles:", error);
    return [];
  }
}
