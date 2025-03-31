import { useMutation } from "@tanstack/react-query";
import { deleteSavedNews } from "../../api/news/news";
import i18n from "i18next";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import { queryClient } from "../../App";

export const useDeleteSavedNews = () => {
  const randomId = generateRandomString(20);

  return useMutation((newsId: number) => deleteSavedNews(newsId), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(
        randomId,
        i18n.t("Saved news deleted succesfully!"),
        true
      );
      queryClient.invalidateQueries(["useDeleteSavedNews"]);
    },
    onError: () => {
      endNotification(randomId, i18n.t("Saved news failed to delete!"), false);
    },
  });
};
