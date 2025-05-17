import { useMutation } from "@tanstack/react-query";
import { deleteSavedNews } from "../../api/news/news";
import i18n from "i18next";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import { queryClient } from "../../App";

interface DeleteSavedNewsPayload {
  news_id: string;
  user_id: string;
}

export const useDeleteSavedNews = () => {
  const randomId = generateRandomString(20);

  return useMutation(
    (payload: DeleteSavedNewsPayload | string) => {
      // Pass the full payload object to the API call
      return deleteSavedNews(payload);
    },
    {
      onMutate: () => {
        startNotification(randomId);
      },
      onSuccess: () => {
        endNotification(
          randomId,
          i18n.t("Saved news deleted successfully!"),
          true
        );
        // We no longer invalidate queries here since we're using local state updates
      },
      onError: () => {
        endNotification(
          randomId,
          i18n.t("Saved news failed to delete!"),
          false
        );
      },
    }
  );
};
