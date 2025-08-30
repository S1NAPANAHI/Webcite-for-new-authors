import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from '@zoroaster/shared'; // Import useAuth from the shared AuthContext
const ProtectedRoute = ({ children }) => {
    const { user, isLoading } = useAuth(); // Use the centralized auth state
    if (isLoading) {
        // Still checking auth status, render a loading indicator
        return _jsx("div", { children: "Loading..." });
    }
    if (!user) {
        // Not authenticated, redirect to login page
        return _jsx(Navigate, { to: "/login", replace: true });
    }
    return _jsx(_Fragment, { children: children });
};
export default ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map