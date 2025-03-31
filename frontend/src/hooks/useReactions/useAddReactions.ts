import { useMutation } from "@tanstack/react-query";
import { addReaction } from "../../api/administration/administration";
import { AddReaction } from "../../types/administration/administration";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import i18n from "i18next";
import { queryClient } from "../../App";

export const useAddReaction = () => {
  const randomId = generateRandomString(20);

  return useMutation((payload: AddReaction) => addReaction(payload), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(
        randomId,
        i18n.t("Chapters:notifications.createSuccess"),
        true
      );
      queryClient.invalidateQueries(["useAddReaction"]);
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
