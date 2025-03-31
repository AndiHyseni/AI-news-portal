import { useMutation } from "@tanstack/react-query";
import { editUser } from "../../api/administration/administration";
import { queryClient } from "../../App";
import { EditAdmin } from "../../types/administration/administration";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import i18n from "i18next";

export const useEditUser = () => {
  const randomId = generateRandomString(20);

  return useMutation((payload: EditAdmin) => editUser(payload), {
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
