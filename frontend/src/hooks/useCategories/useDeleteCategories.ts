import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { deleteCategories } from "../../api/categories/categories";
import { queryClient } from "../../App";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

export const useDeleteCategories = () => {
  const randomId = generateRandomString(20);

  return useMutation((categoryId: number) => deleteCategories(categoryId), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(randomId, i18n.t("Category deleted succesfully!"), true);
      queryClient.invalidateQueries(["useCategories"]);
    },
    onError: () => {
      endNotification(randomId, i18n.t("Category failed to delete!"), false);
    },
  });
};
