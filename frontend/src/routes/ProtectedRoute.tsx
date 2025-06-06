import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { useToken } from "../hooks/useAuth/useToken";

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRoles,
}) => {
  const [userContext] = useContext(UserContext);
  const { isLoading, error } = useToken(localStorage.getItem("jwt"));

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <Navigate to="/login" />;
  }

  // If not authenticated, redirect to login
  if (!userContext.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If specific roles are required, check if user has them
  if (requiredRoles && requiredRoles.length > 0) {
    const userRoles = userContext.roles || [];
    const hasRequiredRole = requiredRoles.some((role) =>
      userRoles.includes(role)
    );

    if (!hasRequiredRole) {
      return <Navigate to="/denied" />;
    }
  }

  // If authenticated and has required roles, render the child routes
  return <Outlet />;
};
