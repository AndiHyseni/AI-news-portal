import * as natural from "natural";
import * as stopword from "stopword";
import { SummarizerManager } from "node-summarizer";

export const NLPService = {
  /**
   * Extracts keywords from text using TF-IDF
   *
   * @param title - The article title
   * @param content - The article content
   * @param maxTags - Maximum number of tags to extract
   * @returns A comma-separated list of tags
   */
  extractTags: (
    title: string,
    content: string,
    maxTags: number = 5
  ): string => {
    try {
      // Combine title and content, but give more weight to the title
      const fullText = `${title} ${title} ${content}`;

      // Convert to lowercase
      const text = fullText.toLowerCase();

      // Tokenization
      const tokenizer = new natural.WordTokenizer();
      const tokens = tokenizer.tokenize(text) || [];

      // Remove stopwords and short words
      const filteredTokens = stopword
        .removeStopwords(tokens)
        .filter((word) => word.length > 3 && !/^\d+$/.test(word));

      // Count word frequencies
      const wordCounts: Record<string, number> = {};
      filteredTokens.forEach((word) => {
        wordCounts[word] = (wordCounts[word] || 0) + 1;
      });

      // Sort by frequency
      const sortedWords = Object.entries(wordCounts)
        .sort((a, b) => b[1] - a[1])
        .map((entry) => entry[0]);

      // Take top N tags
      const tags = sortedWords.slice(0, maxTags);

      return tags.join(", ");
    } catch (error) {
      console.error("Error extracting tags:", error);
      return "";
    }
  },

  /**
   * Generates a summary using node-summarizer library
   *
   * @param title - The article title
   * @param content - The article content
   * @param maxLength - Maximum length of summary in characters
   * @returns A summary of the article
   */
  generateSummary: async (
    title: string,
    content: string,
    maxLength: number = 250
  ): Promise<string> => {
    try {
      // If content is empty, return empty string
      if (!content || content.trim() === "") {
        return "";
      }

      // Include title in the content if available
      let fullText = content;
      if (title && title.trim()) {
        fullText = `${title}. ${content}`;
      }

      // Set number of sentences for the summary
      const numSentences = 3;

      // Use the node-summarizer library
      try {
        const summarizer = new SummarizerManager(fullText, numSentences);
        const summaryResult = await summarizer.getSummaryByRank();

        // Handle case where the result is an object rather than a string
        let summaryText = "";

        if (typeof summaryResult === "string") {
          summaryText = summaryResult;
        } else {
          // If it's an object, try to extract the summary text
          if (
            summaryResult.summary &&
            typeof summaryResult.summary === "string"
          ) {
            summaryText = summaryResult.summary;
          } else {
            // Fallback: Join sentence_list if available
            if (Array.isArray(summaryResult.sentence_list)) {
              summaryText = summaryResult.sentence_list.join(" ");
            } else {
              console.log(
                "Unexpected summary format:",
                JSON.stringify(summaryResult)
              );
              return fallbackSummarize(title, content, maxLength);
            }
          }
        }

        // Clean up the summary - remove any XML/HTML tags and excessive whitespace
        summaryText = summaryText
          .replace(/<[^>]*>/g, "") // Remove HTML tags
          .replace(/\s+/g, " ") // Replace multiple spaces with a single space
          .trim(); // Trim whitespace

        // Truncate if too long
        if (summaryText.length > maxLength) {
          return summaryText.substring(0, maxLength) + "...";
        }
        return summaryText;
      } catch (summarizerError) {
        console.error("Error using node-summarizer:", summarizerError);

        // Fallback to our simple approach if the library fails
        return fallbackSummarize(title, content, maxLength);
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      return "";
    }
  },
};

/**
 * Simple fallback summarization method when node-summarizer fails
 */
function fallbackSummarize(
  title: string,
  content: string,
  maxLength: number = 150
): string {
  try {
    // Include title in the summary if available
    let fullText = content;
    if (title && title.trim()) {
      fullText = `${title}. ${content}`;
    }

    // Use a simple regex approach to split into sentences
    const sentences = fullText
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
      .split("|")
      .filter((s) => s.trim().length > 0);

    if (sentences.length === 0) {
      return "";
    }

    // Take the first 2-3 sentences as a summary
    const numSentences = Math.min(sentences.length, 3);
    let summaryText = sentences.slice(0, numSentences).join(" ");

    // Truncate if too long
    if (summaryText.length > maxLength) {
      summaryText = summaryText.substring(0, maxLength) + "...";
    }

    return summaryText;
  } catch (error) {
    console.error("Error in fallback summarization:", error);
    return "";
  }
}
