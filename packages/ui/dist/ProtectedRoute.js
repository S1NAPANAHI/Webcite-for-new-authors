import { jsx as _jsx } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
export const ProtectedRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const betaApplicationStatus = localStorage.getItem('betaApplicationStatus') || 'none';
    if (!isAuthenticated) {
        // Not authenticated, redirect to login
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    // Authenticated, now check beta application status
    if (betaApplicationStatus === 'none') {
        // Not applied, redirect to application page
        return _jsx(Navigate, { to: "/beta/application", replace: true });
    }
    else if (betaApplicationStatus === 'pending' || betaApplicationStatus === 'rejected') {
        // Applied but not accepted, or rejected, redirect to status page
        return _jsx(Navigate, { to: "/beta/status", replace: true });
    }
    else if (betaApplicationStatus === 'accepted') {
        // Accepted, allow access to children (Beta Portal)
        return children;
    }
    // Fallback, should not happen with defined statuses
    return _jsx(Navigate, { to: "/", replace: true });
};
//# sourceMappingURL=ProtectedRoute.js.map