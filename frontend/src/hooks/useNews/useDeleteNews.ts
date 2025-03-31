import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { deleteNews } from "../../api/news/news";
import { queryClient } from "../../App";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

export const useDeleteNews = () => {
  const randomId = generateRandomString(20);

  return useMutation((newsId: number) => deleteNews(newsId), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(randomId, i18n.t("News deleted succesfully!"), true);
      queryClient.invalidateQueries(["useNews"]);
    },
    onError: () => {
      endNotification(randomId, i18n.t("News failed to delete!"), false);
    },
  });
};
