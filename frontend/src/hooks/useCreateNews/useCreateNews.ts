import { useMutation } from "@tanstack/react-query";
import { createNews } from "../../api/news/news";
import { queryClient } from "../../App";
import { CreateNewsPayload } from "../../types/news/news";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import i18n from "i18next";

export const useCreateNews = () => {
  const randomId = generateRandomString(20);

  return useMutation((payload: CreateNewsPayload) => createNews(payload), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(
        randomId,
        i18n.t("Chapters:notifications.createSuccess"),
        true
      );
      queryClient.invalidateQueries(["chapters"]);
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
