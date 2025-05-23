import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { refreshToken } from "../../api/auth/refreshToken";
import { UserContext } from "../../contexts/UserContext";
import { LoginResponse } from "../../types/auth/login";

export const useToken = (token: string | null) => {
  const [, setUserContext] = useContext(UserContext);

  return useQuery(["validateToken", token], () => refreshToken(token), {
    onSuccess: (data: LoginResponse) => {
      setUserContext({
        isAuthenticated: true,
        token: data.token,
      });
    },
    retry: false,
  });
};
