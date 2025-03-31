import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { useContext } from "react";
import { login } from "../../api/auth/login";
import { UserContext } from "../../contexes/UserContext";
import { LoginPayload } from "../../types/auth/login";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

export const useLogin = () => {
  const [, setUserContext] = useContext(UserContext);
  const randomId = generateRandomString(20);

  return useMutation((payload: LoginPayload) => login(payload), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: (data) => {
      endNotification(randomId, i18n.t("Successed"), true);
      localStorage.setItem("jwt", data.token);

      setUserContext(data);
    },
    onError: () => {
      endNotification(randomId, i18n.t("Something went wrong!"), false);
    },
  });
};
