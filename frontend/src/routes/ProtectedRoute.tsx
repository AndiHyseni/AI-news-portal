import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexes/UserContext";
import { useToken } from "../hooks/useAuth/useToken";
import { LoginResponse } from "../types/auth/login";

interface ProtectedRouteProps {
  requiredRoles?: LoginResponse;
}

export const ProtectedRoute = (props: ProtectedRouteProps) => {
  const [userContext] = useContext(UserContext);

  const { isLoading, error } = useToken(localStorage.getItem("jwt"));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Navigate to="/login" />;
  }

  if (props.requiredRoles?.userRole) {
    if ((userContext.userRole, props.requiredRoles)) {
      return <Outlet />;
    }

    return <Navigate to="/denied" />;
  }

  return <Outlet />;
};
