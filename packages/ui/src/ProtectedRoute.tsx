import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  const betaApplicationStatus = localStorage.getItem('betaApplicationStatus') || 'none';

  if (!isAuthenticated) {
    // Not authenticated, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Authenticated, now check beta application status
  if (betaApplicationStatus === 'none') {
    // Not applied, redirect to application page
    return <Navigate to="/beta/application" replace />;
  } else if (betaApplicationStatus === 'pending' || betaApplicationStatus === 'rejected') {
    // Applied but not accepted, or rejected, redirect to status page
    return <Navigate to="/beta/status" replace />;
  } else if (betaApplicationStatus === 'accepted') {
    // Accepted, allow access to children (Beta Portal)
    return children;
  }

  // Fallback, should not happen with defined statuses
  return <Navigate to="/" replace />;
};

