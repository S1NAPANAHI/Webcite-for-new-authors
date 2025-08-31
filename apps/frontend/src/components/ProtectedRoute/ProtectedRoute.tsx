import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@zoroaster/shared/AuthContext';


interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth(); // Use the centralized auth state

  if (isLoading) {
    // Still checking auth status, render a loading indicator
    return <div>Loading...</div>; 
  }

  if (!user) {
    // Not authenticated, redirect to login page
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
