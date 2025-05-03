import { createContext } from "react";
import { UserContext as UserContextType } from "../types/auth/login";

export const defaultLoginResponse: UserContextType = {
  isAuthenticated: false,
  token: null,
};

export const UserContext = createContext<
  [UserContextType, (userContext: UserContextType) => void]
>([defaultLoginResponse, () => null]);
