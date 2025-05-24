import { useQuery } from "@tanstack/react-query";
import { getRelatedNews } from "../../api/news/news";

/**
 * Hook to fetch related news for a specific article
 *
 * @param newsId - The ID of the news article to find related articles for
 * @param limit - Maximum number of related articles to return (default: 4)
 * @param options - Additional options for the query
 * @returns Query result with related news articles
 */
export const useRelatedNews = (
  newsId: string,
  limit: number = 4,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery(
    ["news", "related", newsId, limit],
    () => getRelatedNews(newsId, limit),
    {
      enabled: newsId !== undefined && options?.enabled !== false,
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      ...options,
    }
  );
};
