import React from "react";
import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  roles,
}) => {
  // const { isAuthenticated, hasRole } = useAuth();

  // if (!isAuthenticated) {
  return <Navigate to="/login" replace />;
  // }

  // if (roles && !roles.some(role => hasRole(role))) {
  //   return <Navigate to="/" replace />;
  // }

  return <>{children}</>;
};
