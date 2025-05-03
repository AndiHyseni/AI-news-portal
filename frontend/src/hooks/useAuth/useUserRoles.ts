import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { getUserRoles } from "../../api/auth/getUserRoles";
import { UserContext } from "../../contexts/UserContext";
import jwtDecode from "jwt-decode";

interface JwtPayload {
  id: string;
  exp: number;
}

export const useUserRoles = () => {
  const [userContext] = useContext(UserContext);

  // Get user ID from token
  const getUserId = (): string | null => {
    if (!userContext.token) return null;

    try {
      const decoded = jwtDecode<JwtPayload>(userContext.token);
      return decoded.id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const userId = getUserId();

  return useQuery(["userRoles", userId], () => getUserRoles(userId as string), {
    enabled: !!userId && userContext.isAuthenticated,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    refetchOnWindowFocus: false,
  });
};
