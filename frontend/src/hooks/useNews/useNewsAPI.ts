import { useQuery, useMutation } from "@tanstack/react-query";
import {
  searchNewsAPI,
  getTopHeadlines,
  importNewsFromAPI,
  generateSummariesWithNewsAPI,
} from "../../api/news/news";
import { queryClient } from "../../App";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import { ImportNewsAPIPayload } from "../../types/news/newsapi";

// Hook to search for news using NewsAPI
export const useSearchNewsAPI = (query: string) => {
  return useQuery(["newsapi", "search", query], () => searchNewsAPI(query), {
    enabled: !!query, // Only run the query if there's a search query
    refetchOnWindowFocus: false,
  });
};

// Hook to get top headlines from NewsAPI
export const useTopHeadlines = (category?: string, country: string = "us") => {
  return useQuery(
    ["newsapi", "headlines", category, country],
    () => getTopHeadlines(category, country),
    {
      refetchOnWindowFocus: false,
    }
  );
};

// Hook to import news from NewsAPI
export const useImportNewsFromAPI = () => {
  const randomId = generateRandomString(20);

  return useMutation(
    (payload: ImportNewsAPIPayload) => importNewsFromAPI(payload),
    {
      onMutate: () => {
        startNotification(randomId);
      },
      onSuccess: () => {
        endNotification(randomId, "News imported successfully!", true);
        // Invalidate news queries to refresh the data
        queryClient.invalidateQueries(["news"]);
      },
      onError: () => {
        endNotification(randomId, "Failed to import news", false);
      },
    }
  );
};

// Hook to generate summaries using NewsAPI
export const useGenerateSummariesWithNewsAPI = () => {
  const randomId = generateRandomString(20);

  return useMutation(() => generateSummariesWithNewsAPI(), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(
        randomId,
        "Summaries generated successfully using NewsAPI!",
        true
      );
      // Invalidate news queries to refresh data
      queryClient.invalidateQueries(["news"]);
    },
    onError: () => {
      endNotification(
        randomId,
        "Failed to generate summaries using NewsAPI",
        false
      );
    },
  });
};
