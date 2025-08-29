import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
export const AdminProtectedRoute = ({ children }) => {
    const [loading, setLoading] = useState(true);
    const [authState, setAuthState] = useState({ isAuthenticated: false, isAdmin: false });
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
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-gray-900 text-white", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto" }), _jsx("p", { className: "mt-4", children: "Verifying Admin Privileges..." })] }) }));
    }
    if (!authState.isAuthenticated) {
        console.log('🛑 [AdminProtectedRoute] Not authenticated, redirecting to login.');
        return _jsx(Navigate, { to: "/login", state: { from: location }, replace: true });
    }
    if (!authState.isAdmin) {
        console.log('❌ [AdminProtectedRoute] Access Denied. User is not an admin.');
        return (_jsx("div", { className: "min-h-screen bg-gray-900 py-12 px-4 sm:px-6 lg:px-8 text-white", children: _jsx("div", { className: "max-w-4xl mx-auto", children: _jsxs("div", { className: "bg-gray-800 shadow-lg rounded-lg overflow-hidden", children: [_jsxs("div", { className: "bg-red-600 p-6", children: [_jsx("h1", { className: "text-2xl font-bold", children: "Access Denied" }), _jsx("p", { className: "text-red-100", children: "You do not have the necessary permissions to view this page." })] }), _jsxs("div", { className: "p-6 space-y-4", children: [_jsx("p", { children: "The page you are trying to access is restricted to administrators only." }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-medium text-gray-300 mb-2", children: "Your Account Details" }), _jsxs("dl", { className: "bg-gray-700/50 rounded-lg p-4 space-y-2 text-sm", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-400", children: "User ID" }), _jsx("dd", { className: "font-mono", children: authState.user?.id || 'N/A' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-400", children: "Email" }), _jsx("dd", { children: authState.user?.email || 'N/A' })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("dt", { className: "text-gray-400", children: "Admin Status" }), _jsx("dd", { className: "font-semibold text-red-400", children: "Not an Admin" })] })] })] }), _jsx("p", { children: "If you believe this is an error, please contact support." }), _jsx("div", { className: "pt-4", children: _jsx("a", { href: "/", className: "px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700", children: "Go to Homepage" }) })] })] }) }) }));
    }
    return _jsx(_Fragment, { children: children });
};
//# sourceMappingURL=AdminProtectedRoute.js.map