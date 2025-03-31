import { useMutation } from "@tanstack/react-query";
import { addUser } from "../../api/administration/administration";
import { queryClient } from "../../App";
import { AddAdmin } from "../../types/administration/administration";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import i18n from "i18next";

export const useAddUser = () => {
  const randomId = generateRandomString(20);

  return useMutation((payload: AddAdmin) => addUser(payload), {
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
