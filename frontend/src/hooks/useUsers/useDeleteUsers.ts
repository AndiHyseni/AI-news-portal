import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { deleteUsers } from "../../api/administration/administration";
import { queryClient } from "../../App";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

export const useDeleteUsers = () => {
  const randomId = generateRandomString(20);

  return useMutation((userId: string) => deleteUsers(userId), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: () => {
      endNotification(randomId, i18n.t("User deleted succesfully!"), true);
      queryClient.invalidateQueries(["useUsers"]);
    },
    onError: () => {
      endNotification(randomId, i18n.t("User failed to delete!"), false);
    },
  });
};
