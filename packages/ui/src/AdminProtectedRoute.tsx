import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '@zoroaster/shared/supabaseClient';

export const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [authState, setAuthState] = useState<{
    isAuthenticated: boolean;
    isAdmin: boolean;
    user?: any;
  }>({ isAuthenticated: false, isAdmin: false });
  const location = useLocation();

  useEffect(() => {
    const checkAdminStatus = async () => {
      console.log('⏳ [AdminProtectedRoute] Checking session and admin status...');
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        console.log('🔒 [AdminProtectedRoute] No authenticated session found.');
        setAuthState({ isAuthenticated: false, isAdmin: false });
        setLoading(false);
        return;
      }

      console.log('✅ [AdminProtectedRoute] Session found. User:', session.user.email);

      // Ask Supabase directly if the user is an admin by calling the RPC function
      const { data, error: rpcError } = await supabase.rpc('is_admin');

      if (rpcError) {
        console.error('❌ [AdminProtectedRoute] Error calling is_admin RPC:', rpcError);
      }

      const isAdmin = data === true;
      const newAuthState = {
        isAuthenticated: true,
        isAdmin,
        user: session.user,
      };

      console.log('✅ [AdminProtectedRoute] Final auth state:', newAuthState);
      setAuthState(newAuthState);
      setLoading(false);
    };

    checkAdminStatus();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto"></div>
          <p className="mt-4">Verifying Admin Privileges...</p>
        </div>
      </div>
    );
  }

  if (!authState.isAuthenticated) {
    console.log('🛑 [AdminProtectedRoute] Not authenticated, redirecting to login.');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authState.isAdmin) {
    console.log('❌ [AdminProtectedRoute] Access Denied. User is not an admin.');
    return (
        <div className="min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white">
            <div className="max-w-4xl mx-auto">
                <div className="bg-gray-800 shadow-lg rounded-lg overflow-hidden">
                    <div className="bg-red-600 p-6">
                        <h1 className="text-2xl font-bold">Access Denied</h1>
                        <p className="text-red-100">You do not have the necessary permissions to view this page.</p>
                    </div>
                    <div className="p-6 space-y-4">
                        <p>The page you are trying to access is restricted to administrators only.</p>
                        <div>
                            <h2 className="text-lg font-medium text-gray-300 mb-2">Your Account Details</h2>
                            <dl className="bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">User ID</dt>
                                    <dd className="font-mono">{authState.user?.id || 'N/A'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Email</dt>
                                    <dd>{authState.user?.email || 'N/A'}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-gray-400">Admin Status</dt>
                                    <dd className="font-semibold text-red-400">Not an Admin</dd>
                                </div>
                            </dl>
                        </div>
                        <p>If you believe this is an error, please contact support.</p>
                        <div className="pt-4">
                            <a href="/" className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700">
                                Go to Homepage
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
  }

  return <>{children}</>;
};