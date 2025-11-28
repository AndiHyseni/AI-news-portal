import OpenAI from "openai";
import { NewsAPIService } from "../newsapi/NewsAPI.service";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const OpenAIService = {
  /**
   * Generates a concise 2-3 sentence summary for the given article content.
   *
   * @param title - The title of the article
   * @param content - The full content of the article to summarize
   * @returns The generated summary or null if generation fails
   */
  generateSummary: async (
    title: string,
    content: string
  ): Promise<string | null> => {
    try {
      // Truncate content if it's very long to avoid token limits
      const truncatedContent =
        content.length > 15000 ? content.substring(0, 15000) + "..." : content;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content:
              "You are an AI specialized in creating concise news summaries. Create a 2-3 sentence summary that captures the essential information from the article. The summary should be scannable, informative, and highlight the key points.",
          },
          {
            role: "user",
            content: `Title: ${title}\n\nArticle: ${truncatedContent}\n\nPlease generate a 2-3 sentence summary.`,
          },
        ],
        temperature: 0.5,
        max_tokens: 100,
      });

      const summary = response.choices[0]?.message?.content?.trim() || null;
      return summary;
    } catch (error) {
      console.error("Error generating summary:", error);
      return null;
    }
  },

  /**
   * Generates news content based on a title by searching the web and using AI.
   * First searches NewsAPI for related articles, then uses OpenAI to generate comprehensive content.
   *
   * @param title - The title of the news article
   * @param categoryId - Optional category ID for context
   * @returns The generated content or null if generation fails
   */
  generateContentFromTitle: async (
    title: string,
    categoryId?: string
  ): Promise<{
    content: string;
    subtitle?: string;
    summary?: string;
  } | null> => {
    try {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error("OpenAI API key not found in environment variables");
      }

      // Step 1: Search for related articles using NewsAPI
      const relatedArticles = await NewsAPIService.fetchNews(title);

      // Step 2: Extract key information from found articles
      let webSearchContext = "";
      if (relatedArticles.length > 0) {
        // Take top 3-5 most relevant articles
        const topArticles = relatedArticles.slice(0, 5);
        webSearchContext = topArticles
          .map((article, index) => {
            return `Article ${index + 1}:
Title: ${article.title}
Source: ${article.source.name}
Description: ${article.description || "N/A"}
Content: ${article.content ? article.content.substring(0, 500) : "N/A"}
Published: ${article.publishedAt}
URL: ${article.url}`;
          })
          .join("\n\n");
      } else {
        webSearchContext =
          "No specific articles found, but please write a comprehensive news article based on the title.";
      }

      // Step 3: Use OpenAI to generate comprehensive article content
      const prompt = `You are a professional news journalist. Based on the following title and the information gathered from web sources, write a comprehensive, well-structured news article.

Title: ${title}

Information from web sources:
${webSearchContext}

Please write a complete news article that:
1. Is informative and well-researched
2. Has a clear structure with introduction, body paragraphs, and conclusion
3. Is approximately 500-800 words
4. Includes relevant facts, context, and details
5. Is written in a professional journalistic style
6. Is accurate and based on the information provided

Generate the article content now:`;

      const response = await openai.chat.completions.create({
        model: "gpt-4.1-nano",
        messages: [
          {
            role: "system",
            content:
              "You are an experienced news journalist who writes accurate, well-structured, and engaging news articles. Always base your articles on factual information and maintain journalistic integrity.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const generatedContent = response.choices[0]?.message?.content?.trim();

      if (!generatedContent) {
        return null;
      }

      // Step 4: Generate subtitle and summary from the generated content
      let subtitle: string | undefined;
      let summary: string | undefined;

      try {
        // Generate subtitle
        const subtitleResponse = await openai.chat.completions.create({
          model: "gpt-4.1-nano",
          messages: [
            {
              role: "system",
              content:
                "You are an expert at creating engaging news subtitles. Create a concise, attention-grabbing subtitle that summarizes the key point of the article.",
            },
            {
              role: "user",
              content: `Title: ${title}\n\nArticle Content: ${generatedContent.substring(
                0,
                1000
              )}\n\nGenerate a compelling subtitle (1 sentence, max 150 characters):`,
            },
          ],
          temperature: 0.7,
          max_tokens: 50,
        });

        subtitle = subtitleResponse.choices[0]?.message?.content?.trim();

        // Generate summary
        const generatedSummary = await OpenAIService.generateSummary(
          title,
          generatedContent
        );
        summary = generatedSummary ?? undefined;
      } catch (error) {
        console.error("Error generating subtitle/summary:", error);
        // Continue without subtitle/summary if generation fails
      }

      return {
        content: generatedContent,
        subtitle: subtitle,
        summary: summary ?? undefined,
      };
    } catch (error) {
      console.error("Error generating content from title:", error);
      return null;
    }
  },
};
