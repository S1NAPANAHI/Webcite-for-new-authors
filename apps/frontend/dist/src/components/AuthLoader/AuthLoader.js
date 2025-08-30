import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared'; // Assuming supabase is exported from here
const AuthLoader = ({ children }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const loadSession = async () => {
            // This will attempt to retrieve the session from localStorage and refresh it if needed
            await supabase.auth.getSession();
            setLoading(false);
        };
        loadSession();
    }, []);
    if (loading) {
        // You can render a loading spinner or a blank page here
        return _jsx("div", { children: "Loading authentication..." });
    }
    return _jsx(_Fragment, { children: children });
};
export default AuthLoader;
//# sourceMappingURL=AuthLoader.js.map