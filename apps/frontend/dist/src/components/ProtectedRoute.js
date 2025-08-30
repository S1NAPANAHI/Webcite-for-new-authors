import { jsx as _jsx } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { supabase } from '@zoroaster/shared';
import { Navigate, Outlet } from 'react-router-dom';
const ProtectedRoute = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('role')
                    .eq('id', user.id)
                    .single();
                if (error) {
                    console.error('Error fetching user profile:', error);
                }
                else if (data && data.role === 'admin') {
                    setIsAdmin(true);
                }
            }
            setLoading(false);
        };
        checkUser();
    }, []);
    if (loading) {
        return _jsx("div", { children: "Loading..." });
    }
    return isAdmin ? _jsx(Outlet, {}) : _jsx(Navigate, { to: "/login" });
};
export default ProtectedRoute;
//# sourceMappingURL=ProtectedRoute.js.map