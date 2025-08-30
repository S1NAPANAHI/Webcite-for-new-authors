"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = exports.AuthProvider = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const supabaseClient_1 = require("./supabaseClient"); // Assuming supabase is exported from here
const AuthContext = (0, react_1.createContext)(undefined);
const AuthProvider = ({ children }) => {
    const [user, setUser] = (0, react_1.useState)(null);
    const [session, setSession] = (0, react_1.useState)(null);
    const [userProfile, setUserProfile] = (0, react_1.useState)(null);
    const [isAdmin, setIsAdmin] = (0, react_1.useState)(false);
    const [isAuthenticated, setIsAuthenticated] = (0, react_1.useState)(false);
    const [isLoading, setIsLoading] = (0, react_1.useState)(true);
    (0, react_1.useEffect)(() => {
        const { data: authListener } = supabaseClient_1.supabase.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        });
        // Initial session check
        supabaseClient_1.supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    // Fetch user profile when user changes
    (0, react_1.useEffect)(() => {
        const fetchUserProfile = async (userId) => {
            try {
                const { data: profile, error } = await supabaseClient_1.supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .single();
                if (error)
                    throw error;
                setUserProfile(profile);
                setIsAdmin(!!(profile?.role === 'admin' || profile?.role === 'super_admin'));
            }
            catch (error) {
                console.error('Error fetching user profile:', error);
                setUserProfile(null);
                setIsAdmin(false);
            }
        };
        if (user?.id) {
            fetchUserProfile(user.id);
            setIsAuthenticated(true);
        }
        else {
            setUserProfile(null);
            setIsAdmin(false);
            setIsAuthenticated(false);
        }
    }, [user]);
    return ((0, jsx_runtime_1.jsx)(AuthContext.Provider, { value: {
            user,
            session,
            userProfile,
            isAdmin,
            isAuthenticated,
            isLoading
        }, children: children }));
};
exports.AuthProvider = AuthProvider;
const useAuth = () => {
    const context = (0, react_1.useContext)(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
exports.useAuth = useAuth;
