import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@zoroaster/shared';

interface ProtectedRouteProps {
  requireSubscription?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requireSubscription = false }) => {
  const { isAuthenticated, isSubscribed, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>; // Or a loading spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (requireSubscription && !isSubscribed) {
    return <Navigate to="/subscriptions" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;