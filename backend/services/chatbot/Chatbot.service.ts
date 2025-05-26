import { StatusCodeEnums } from "../../interfaces/enums";
import { failure, ok } from "../../utils";
import NewsDbModel from "../../models/News.model";

interface ChatbotRequest {
  message: string;
}

export const ChatbotService = {
  async processMessage(data: ChatbotRequest) {
    try {
      const { message } = data;

      // Basic validation
      if (!message || typeof message !== "string") {
        return failure(
          { error: "Invalid message format" },
          StatusCodeEnums.UNPROCESSABLE_ENTITY
        );
      }

      // For demonstration, we'll implement a simple pattern matching approach
      // In a production system, this would likely use a more sophisticated NLP approach
      // or connect to an external AI service like OpenAI
      const response = await generateResponse(message);

      return ok({ response });
    } catch (error) {
      console.error("Error in chatbot service:", error);
      return failure(
        { error: "Failed to process chatbot request" },
        StatusCodeEnums.UNPROCESSABLE_ENTITY
      );
    }
  },
};

// Simple response generator function
async function generateResponse(message: string): Promise<string> {
  const lowercaseMessage = message.toLowerCase();

  // Check for greetings
  if (containsAny(lowercaseMessage, ["hello", "hi", "hey", "greetings"])) {
    return "Hello! How can I help you with news today?";
  }

  // Check for questions about categories
  if (
    containsAny(lowercaseMessage, [
      "category",
      "categories",
      "topics",
      "sections",
    ])
  ) {
    return "Our news portal covers various categories including Politics, Technology, Health, Sports, and more. Which category are you interested in?";
  }

  // Check for search intent
  if (
    containsAny(lowercaseMessage, [
      "find",
      "search",
      "looking for",
      "article about",
    ])
  ) {
    // Extract potential search terms
    const searchTerms = extractSearchTerms(lowercaseMessage);
    if (searchTerms) {
      // Try to find relevant articles
      const articles = await findRelevantArticles(searchTerms);
      if (articles.length > 0) {
        return `I found some articles that might interest you about "${searchTerms}":\n\n${formatArticleResults(
          articles
        )}`;
      } else {
        return `I couldn't find specific articles about "${searchTerms}". Would you like to browse our latest news instead?`;
      }
    }
    return "What topic would you like me to search for? You can ask about specific news events, topics, or categories.";
  }

  // Check for specific category requests
  if (containsAny(lowercaseMessage, ["politics", "political"])) {
    return "Our Politics section covers local and international political news, elections, policy changes, and government affairs. Would you like to see the latest political headlines?";
  }

  if (
    containsAny(lowercaseMessage, [
      "tech",
      "technology",
      "digital",
      "software",
      "hardware",
    ])
  ) {
    return "Our Technology section features the latest tech innovations, product launches, digital trends, and industry news. What specific technology topics are you interested in?";
  }

  if (
    containsAny(lowercaseMessage, [
      "health",
      "medical",
      "wellness",
      "healthcare",
    ])
  ) {
    return "Our Health section provides information on medical breakthroughs, wellness tips, healthcare policies, and health-related research. Any specific health topic you'd like to know more about?";
  }

  if (
    containsAny(lowercaseMessage, [
      "sports",
      "sport",
      "game",
      "match",
      "tournament",
    ])
  ) {
    return "Our Sports section covers major leagues, tournaments, athlete updates, and sports analysis. Which sport or team are you following?";
  }

  // Help requests
  if (containsAny(lowercaseMessage, ["help", "how to", "guide", "explain"])) {
    return "I can help you find news articles, browse by category, get information about trending topics, or learn about our news portal features. What would you like assistance with?";
  }

  // Latest news
  if (
    containsAny(lowercaseMessage, [
      "latest",
      "recent",
      "new",
      "trending",
      "today",
    ])
  ) {
    return "Would you like to see the most recent headlines across all categories, or are you interested in a specific topic?";
  }

  // Fallback response
  return "I understand you're asking about that. To help you better, could you specify if you're looking for a particular news category or topic? You can ask about Politics, Technology, Health, Sports, or the latest trending news.";
}

// Helper function to check if a string contains any of the target phrases
function containsAny(text: string, targets: string[]): boolean {
  return targets.some((target) => text.includes(target));
}

// Extract potential search terms from a message
function extractSearchTerms(message: string): string {
  // Simple extraction - could be more sophisticated with NLP
  const searchPhrases = [
    "about",
    "on",
    "regarding",
    "related to",
    "find",
    "search",
  ];

  for (const phrase of searchPhrases) {
    const index = message.indexOf(phrase);
    if (index !== -1) {
      return message.substring(index + phrase.length).trim();
    }
  }

  // If no search phrase found, just use the message itself (excluding common words)
  const words = message
    .split(" ")
    .filter(
      (word) =>
        word.length > 3 &&
        ![
          "what",
          "when",
          "where",
          "which",
          "news",
          "article",
          "find",
          "get",
          "show",
        ].includes(word)
    );

  return words.join(" ");
}

// Find relevant articles based on search terms
async function findRelevantArticles(
  searchTerms: string,
  limit: number = 3
): Promise<any[]> {
  try {
    // Search in title, content, and tags
    const articles = await NewsDbModel.query()
      .where("title", "like", `%${searchTerms}%`)
      .orWhere("content", "like", `%${searchTerms}%`)
      .orWhere("tags", "like", `%${searchTerms}%`)
      .where({ is_deleted: false })
      .orderBy("created_at", "desc")
      .limit(limit);

    return articles;
  } catch (error) {
    console.error("Error searching for articles:", error);
    return [];
  }
}

// Format article results for display
function formatArticleResults(articles: any[]): string {
  return articles
    .map(
      (article, index) =>
        `${index + 1}. ${article.title}${
          article.subtitle ? ` - ${article.subtitle}` : ""
        }`
    )
    .join("\n\n");
}
