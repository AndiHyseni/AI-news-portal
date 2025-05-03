import { useMutation } from "@tanstack/react-query";
import i18n from "i18next";
import { useContext } from "react";
import { login } from "../../api/auth/login";
import { UserContext } from "../../contexts/UserContext";
import { LoginRequest } from "../../types/auth/login";
import { endNotification, startNotification } from "../../utils/notifications";
import { generateRandomString } from "../../utils/randomString";
import jwtDecode from "jwt-decode";

interface JwtPayload {
  id: string;
  roles: string[];
  username: string;
  email: string;
  exp: number;
}

export const useLogin = () => {
  const [, setUserContext] = useContext(UserContext);
  const randomId = generateRandomString(20);

  return useMutation((payload: LoginRequest) => login(payload), {
    onMutate: () => {
      startNotification(randomId);
    },
    onSuccess: (data) => {
      endNotification(randomId, i18n.t("Successed"), true);

      try {
        // Validate token exists and is not "undefined" or "null" string
        if (
          !data ||
          !data.token ||
          data.token === "undefined" ||
          data.token === "null"
        ) {
          console.error(
            "Invalid or missing token in response. Full response:",
            data
          );
          setUserContext({
            isAuthenticated: false,
            token: null,
          });
          return;
        }

        // Save token to localStorage
        localStorage.setItem("jwt", data.token);

        // Decode the token to get user data
        const decoded = jwtDecode<JwtPayload>(data.token);

        // Set the user context with information from token
        const contextData = {
          isAuthenticated: true,
          token: data.token,
          userId: decoded.id || data.userId,
          username: decoded.username || data.username,
          email: decoded.email || data.email,
          roles: decoded.roles || data.roles || [],
        };

        setUserContext(contextData);
      } catch (error) {
        console.error("Error decoding token:", error);
        console.error("Token that failed:", data?.token);

        // Set minimal context if decoding fails
        setUserContext({
          isAuthenticated: false,
          token: null,
        });
      }
    },
    onError: (error) => {
      console.error("Login mutation error:", error);
      endNotification(randomId, i18n.t("Something went wrong!"), false);
    },
  });
};
