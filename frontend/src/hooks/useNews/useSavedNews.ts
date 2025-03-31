import { useMutation } from "@tanstack/react-query";
import { savedNews } from "../../api/news/news";
import { queryClient } from "../../App";
import { SavedNewsPayload } from "../../types/news/news";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import i18n from "i18next";

export const useSavedNews = () => {
  const randomId = generateRandomString(20);

  return useMutation((payload: SavedNewsPayload) => savedNews(payload), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(
        randomId,
        i18n.t("Chapters:notifications.createSuccess"),
        true
      );
      queryClient.invalidateQueries(["useSavedNews"]);
    },
    onError: () => {
      endNotification(
        randomId,
        i18n.t("Chapters:notifications.createError"),
        false
      );
    },
  });
};
