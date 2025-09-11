import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect, } from 'react';
import { getUserStats } from './userStats';
import { getSubscription } from './subscription';
// Use a module-level variable to ensure a single instance of AuthContext
// This is a workaround for potential duplicate context instances in monorepos
let globalAuthContext;
if (typeof window !== 'undefined') {
    // In browser, use a global property to ensure single instance across hot reloads
    if (!window.__ZOROASTER_AUTH_CONTEXT__) {
        window.__ZOROASTER_AUTH_CONTEXT__ = createContext(undefined);
    }
    globalAuthContext = window.__ZOROASTER_AUTH_CONTEXT__;
}
else {
    // For server-side rendering or non-browser environments
    globalAuthContext = createContext(undefined);
}
// Use the globalAuthContext instead of a local const
const AuthContext = globalAuthContext;
export const AuthProvider = ({ children, supabaseClient, }) => {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [subscription, setSubscription] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const supabase = supabaseClient; // Use the passed supabaseClient
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        });
        const { data: { subscription }, } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        });
        return () => subscription.unsubscribe();
    }, []);
    useEffect(() => {
        if (user) {
            fetchUserProfileAndSubscription(user.id);
        }
        else {
            setProfile(null);
            setSubscription(null);
            setIsLoading(false);
        }
    }, [user]);
    const fetchUserProfileAndSubscription = async (userId) => {
        console.log('AuthContext: fetchUserProfileAndSubscription START for user:', userId);
        setIsLoading(true);
        try {
            // Fetch profile
            console.log('AuthContext: Fetching profile...');
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userId)
                .single();
            if (profileError) {
                throw profileError;
            }
            setProfile(profileData);
            // Fetch user stats
            const userStats = await getUserStats(userId);
            // console.log('AuthContext: User Stats:', userStats); // Log user stats
            setProfile((prev) => ({ ...prev, user_stats: userStats })); // Assuming user_stats is part of profile
            // Fetch subscription
            const userSubscription = await getSubscription(userId);
            // console.log('AuthContext: User Subscription:', userSubscription); // Log user subscription
            setSubscription(userSubscription);
        }
        catch (error) {
            console.log('AuthContext: Error fetching profile:', error);
            // Handle error, maybe set an error state
            setProfile(null);
            setSubscription(null);
        }
        finally {
            console.log('AuthContext: Setting isLoading(false) - ERROR PATH');
            setIsLoading(false);
        }
    };
    return (_jsx(AuthContext.Provider, { value: { session, user, profile, subscription, isLoading, supabase }, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    // Remove the console.log from here, as it's now handled by the global check
    // console.log('useAuth trying to use context:', AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
//# sourceMappingURL=AuthContext.js.map