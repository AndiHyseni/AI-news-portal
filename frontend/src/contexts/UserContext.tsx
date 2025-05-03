import React, { createContext, useState, useEffect, ReactNode } from "react";
import { UserContext as UserContextType } from "../types/auth/login";
import jwtDecode from "jwt-decode";

interface JwtPayload {
  id: string;
  roles: string[];
  username: string;
  email: string;
  exp: number;
}

const defaultUserContext: UserContextType = {
  isAuthenticated: false,
  token: null,
};

export const UserContext = createContext<
  [UserContextType, React.Dispatch<React.SetStateAction<UserContextType>>]
>([defaultUserContext, () => {}]);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userContext, setUserContext] = useState<UserContextType>(() => {
    const token = localStorage.getItem("jwt");

    if (token && token !== "undefined" && token !== "null") {
      try {
        const decoded = jwtDecode<JwtPayload>(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem("jwt");
          return defaultUserContext;
        }

        return {
          isAuthenticated: true,
          token,
          userId: decoded.id,
          username: decoded.username,
          email: decoded.email,
          roles: decoded.roles || [],
        };
      } catch (error) {
        console.error("Error decoding token on init:", error);
        localStorage.removeItem("jwt");
        return defaultUserContext;
      }
    }

    return defaultUserContext;
  });

  useEffect(() => {
    if (userContext.token) {
      localStorage.setItem("jwt", userContext.token);
    }
  }, [userContext.token]);

  return (
    <UserContext.Provider value={[userContext, setUserContext]}>
      {children}
    </UserContext.Provider>
  );
};
