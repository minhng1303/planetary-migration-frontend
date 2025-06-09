import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export default function ProtectedRoute({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles?: string[];
}) {
  const { isAuthenticated, hasRole, loading } = useAuth();

  if (loading) {
    // You can show a spinner or loading indicator here
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.some((role) => hasRole(role))) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
