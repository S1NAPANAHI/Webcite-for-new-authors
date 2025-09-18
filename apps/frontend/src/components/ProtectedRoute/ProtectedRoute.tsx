import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@zoroaster/shared';

interface ProtectedRouteProps {
  children?: React.ReactNode; // Add children prop
  requireSubscription?: boolean;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requireSubscription = false, requiredRole }) => {
  const { isAuthenticated, isSubscribed, isLoading, role } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireSubscription && !isSubscribed) {
    return <Navigate to="/subscriptions" />;
  }

  if (requiredRole && role !== requiredRole && role !== 'super_admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export { ProtectedRoute };