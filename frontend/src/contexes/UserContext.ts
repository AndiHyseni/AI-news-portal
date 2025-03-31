import { createContext } from "react";
import { LoginResponse } from "../types/auth/login";

export const defaultLoginResponse: LoginResponse = {
  expiresAt: "",
  refreshToken: "",
  token: "",
  userEmail: "",
  userRole: undefined,
  username: "",
};

export const UserContext = createContext<
  [LoginResponse, (loginResponse: LoginResponse) => void]
>([defaultLoginResponse, () => null]);
