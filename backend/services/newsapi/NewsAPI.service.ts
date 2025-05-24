import axios from "axios";

// Define types for NewsAPI responses
export interface NewsAPIArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string | null;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string;
}

export interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

export const NewsAPIService = {
  /**
   * Fetches news from NewsAPI based on a query
   *
   * @param query - The search query
   * @returns The articles from NewsAPI
   */
  fetchNews: async (query: string): Promise<NewsAPIArticle[]> => {
    try {
      const apiKey = process.env.NEWSAPI_KEY;

      if (!apiKey) {
        throw new Error("NewsAPI key not found in environment variables");
      }

      const response = await axios.get<NewsAPIResponse>(
        `https://newsapi.org/v2/everything`,
        {
          params: {
            q: query,
            apiKey,
            language: "en",
            sortBy: "publishedAt",
            pageSize: 20,
          },
        }
      );

      return response.data.articles;
    } catch (error) {
      console.error("Error fetching news from NewsAPI:", error);
      return [];
    }
  },

  /**
   * Fetches top headlines from NewsAPI
   *
   * @param category - Optional category to filter headlines
   * @param country - Optional country code to filter headlines
   * @returns The top headlines from NewsAPI
   */
  fetchTopHeadlines: async (
    category?: string,
    country: string = "us"
  ): Promise<NewsAPIArticle[]> => {
    try {
      const apiKey = process.env.NEWSAPI_KEY;

      if (!apiKey) {
        throw new Error("NewsAPI key not found in environment variables");
      }

      const params: Record<string, string> = {
        apiKey,
        country,
        pageSize: "10",
      };

      if (category) {
        params.category = category;
      }

      const response = await axios.get<NewsAPIResponse>(
        `https://newsapi.org/v2/top-headlines`,
        { params }
      );

      return response.data.articles;
    } catch (error) {
      console.error("Error fetching top headlines from NewsAPI:", error);
      return [];
    }
  },

  /**
   * Generates a summary from the article's description
   *
   * @param article - The article to summarize
   * @returns The summary
   */
  generateSummary: (article: NewsAPIArticle): string => {
    // Use the description as the summary since NewsAPI already provides a concise description
    return article.description || "No summary available.";
  },
};
