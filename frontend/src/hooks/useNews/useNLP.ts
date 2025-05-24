import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  generateSummariesWithNLP,
  generateTagsWithNLP,
  generateSummaryForArticle,
  generateTagsForArticle,
} from "../../api/news/news";
import { queryClient } from "../../App";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

// Hook to generate summaries using NLP
export const useGenerateSummariesWithNLP = (
  options?: UseMutationOptions<any, unknown, void, unknown>
) => {
  const randomId = generateRandomString(20);

  return useMutation(() => generateSummariesWithNLP(), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: (data, variables, context) => {
      endNotification(
        randomId,
        "Summaries generated successfully using NLP!",
        true
      );
      // Invalidate news queries to refresh data
      queryClient.invalidateQueries(["news"]);

      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      endNotification(
        randomId,
        "Failed to generate summaries using NLP",
        false
      );

      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};

// Hook to generate tags using NLP
export const useGenerateTagsWithNLP = (
  options?: UseMutationOptions<any, unknown, void, unknown>
) => {
  const randomId = generateRandomString(20);

  return useMutation(() => generateTagsWithNLP(), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: (data, variables, context) => {
      endNotification(randomId, "Tags generated successfully using NLP!", true);
      // Invalidate news queries to refresh data
      queryClient.invalidateQueries(["news"]);

      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      endNotification(randomId, "Failed to generate tags using NLP", false);

      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};

// Hook to generate summary for a single article using NLP
export const useGenerateSummaryForArticle = (
  options?: UseMutationOptions<any, unknown, string, unknown>
) => {
  const randomId = generateRandomString(20);

  return useMutation((newsId: string) => generateSummaryForArticle(newsId), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: (data, variables, context) => {
      endNotification(
        randomId,
        "Summary generated successfully using NLP!",
        true
      );
      // Invalidate the specific news query to refresh data
      queryClient.invalidateQueries(["news"]);

      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      endNotification(randomId, "Failed to generate summary using NLP", false);

      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};

// Hook to generate tags for a single article using NLP
export const useGenerateTagsForArticle = (
  options?: UseMutationOptions<any, unknown, string, unknown>
) => {
  const randomId = generateRandomString(20);

  return useMutation((newsId: string) => generateTagsForArticle(newsId), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: (data, variables, context) => {
      endNotification(randomId, "Tags generated successfully using NLP!", true);
      // Invalidate the specific news query to refresh data
      queryClient.invalidateQueries(["news"]);

      // Call custom onSuccess if provided
      if (options?.onSuccess) {
        options.onSuccess(data, variables, context);
      }
    },
    onError: (error, variables, context) => {
      endNotification(randomId, "Failed to generate tags using NLP", false);

      // Call custom onError if provided
      if (options?.onError) {
        options.onError(error, variables, context);
      }
    },
  });
};
