import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { updateCategories } from "../../api/categories/categories";
import { queryClient } from "../../App";
import { Categories } from "../../types/categories/categories";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

export const useUpdateCategories = () => {
  const randomId = generateRandomString(20);

  return useMutation((payload: Categories) => updateCategories(payload), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(randomId, i18n.t("Category updated successfully!"), true);
      queryClient.invalidateQueries(["useCategories"]);
    },
    onError: () => {
      endNotification(randomId, i18n.t("Category failed to update!"), false);
    },
  });
};
