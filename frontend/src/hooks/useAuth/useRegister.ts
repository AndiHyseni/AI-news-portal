import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { useContext } from "react";
import { register } from "../../api/auth/register";
import { UserContext } from "../../contexts/UserContext";
import { RegisterRequest } from "../../types/auth/login";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";

export const useRegister = () => {
  // const [, setUserContext] = useContext(UserContext);
  const randomId = generateRandomString(20);

  return useMutation((payload: RegisterRequest) => register(payload), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: (data) => {
      endNotification(
        randomId,
        i18n.t("Registration successful! Please log in."),
        true
      );

      // Remove automatic authentication after registration
      // Let the user explicitly log in after registration
      // setUserContext({
      //   isAuthenticated: true,
      //   token: data.token,
      // });
    },
    onError: () => {
      endNotification(
        randomId,
        i18n.t("Registration failed. Please try again."),
        false
      );
    },
  });
};
