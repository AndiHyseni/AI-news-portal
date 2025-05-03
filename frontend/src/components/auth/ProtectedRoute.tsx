import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../../contexts/UserContext";

interface ProtectedRouteProps {
  requiredRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRoles }) => {
  const [userContext] = useContext(UserContext);

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
      return <Navigate to="/unauthorized" />;
    }
  }

  // If authenticated and has required roles, render the child routes
  return <Outlet />;
};

export default ProtectedRoute;
