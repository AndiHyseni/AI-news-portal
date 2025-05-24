import { useMutation } from "@tanstack/react-query";
import { generateSummaries } from "../../api/news/news";
import { queryClient } from "../../App";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

export const useGenerateSummaries = () => {
  const randomId = generateRandomString(20);

  return useMutation(() => generateSummaries(), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(randomId, "Summaries generated successfully!", true);
      // Invalidate news queries to refresh data
      queryClient.invalidateQueries(["news"]);
    },
    onError: () => {
      endNotification(randomId, "Failed to generate summaries", false);
    },
  });
};
