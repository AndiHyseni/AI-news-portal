import OpenAI from "openai";

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
        model: "gpt-3.5-turbo",
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
};
