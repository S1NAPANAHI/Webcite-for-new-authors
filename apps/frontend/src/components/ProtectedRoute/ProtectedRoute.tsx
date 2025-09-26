import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@zoroaster/shared';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  requireSubscription?: boolean;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requireSubscription = false, 
  requiredRole 
}) => {
  const { isAuthenticated, isSubscribed, isLoading, role, userProfile } = useAuth();

  // Enhanced logging for debugging
  console.log('🔐 ProtectedRoute check:', {
    isLoading,
    isAuthenticated,
    currentRole: role,
    requiredRole,
    userProfile: !!userProfile,
    requireSubscription,
    isSubscribed
  });

  // Show loading while auth state is being determined
  if (isLoading) {
    console.log('⏳ ProtectedRoute: Still loading auth state');
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // Check authentication first
  if (!isAuthenticated) {
    console.log('❌ ProtectedRoute: User not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check subscription requirement
  if (requireSubscription && !isSubscribed) {
    console.log('💳 ProtectedRoute: Subscription required but not subscribed');
    return <Navigate to="/subscriptions" replace />;
  }

  // FIXED: Improved role checking logic
  if (requiredRole) {
    const currentUserRole = role || userProfile?.role || 'user';
    
    console.log('🔍 ProtectedRoute: Role check details:', {
      requiredRole,
      currentUserRole,
      roleFromContext: role,
      roleFromProfile: userProfile?.role
    });

    // Allow super_admin to access everything
    if (currentUserRole === 'super_admin') {
      console.log('✅ ProtectedRoute: Super admin access granted');
    }
    // Check exact role match
    else if (currentUserRole === requiredRole) {
      console.log('✅ ProtectedRoute: Role match - access granted');
    }
    // FIXED: Also allow admin to access admin routes even if role isn't exactly "admin"
    else if (requiredRole === 'admin' && (currentUserRole === 'admin' || currentUserRole === 'super_admin')) {
      console.log('✅ ProtectedRoute: Admin access granted');
    }
    // Deny access
    else {
      console.log('❌ ProtectedRoute: Insufficient role permissions', {
        required: requiredRole,
        current: currentUserRole,
        redirectingTo: '/unauthorized'
      });
      
      // TEMPORARY: Additional debug info
      console.log('🐛 DEBUG: Full auth context:', {
        isAuthenticated,
        role,
        userProfile,
        profileRole: userProfile?.role,
        profileEmail: userProfile?.email
      });
      
      return <Navigate to="/unauthorized" replace />;
    }
  }

  console.log('✅ ProtectedRoute: All checks passed, rendering content');
  return children ? <>{children}</> : <Outlet />;
};

export { ProtectedRoute };