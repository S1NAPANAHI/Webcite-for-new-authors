import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useState, useEffect, useContext } from 'react';
const AuthContext = createContext(undefined);
export const AuthProvider = ({ children, supabaseClient }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [userStats, setUserStats] = useState({
        user_id: '',
        books_read: 0,
        reading_hours: 0,
        achievements: 0,
        currently_reading: 'None'
    });
    const [error, setError] = useState(null);
    useEffect(() => {
        const { data: authListener } = supabaseClient.auth.onAuthStateChange(async (_event, session) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        });
        // Initial session check
        supabaseClient.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user || null);
            setIsLoading(false);
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, [supabaseClient]);
    // Function to safely fetch subscription with minimal assumptions about the table structure
    const fetchUserSubscription = async (userId) => {
        try {
            // Try a minimal query to check if the table exists and is accessible
            const { data: subscription, error } = await supabaseClient
                .from('subscriptions')
                .select('id') // Only request the ID to minimize data transfer
                .eq('user_id', userId)
                .maybeSingle()
                .then(({ data, error }) => {
                // Handle common error cases
                if (error) {
                    // No rows found - not an error, just no subscription
                    if (error.code === 'PGRST116') {
                        return { data: null, error: null };
                    }
                    // Table or column doesn't exist
                    if (error.code === '42P01' || error.code === '42703') {
                        console.warn('Subscription table issue:', error.message);
                        return { data: null, error: null };
                    }
                    // For other errors, return them to be handled below
                    return { data: null, error };
                }
                return { data, error: null };
            });
            // If we got an error in the .then() handler, log it
            if (error) {
                console.error('Error checking subscription:', error);
                return null;
            }
            // If we got here, the table exists and we have a subscription
            if (subscription) {
                // Now fetch the full subscription data
                const { data: fullSubscription, error: fetchError } = await supabaseClient
                    .from('subscriptions')
                    .select('*')
                    .eq('user_id', userId)
                    .in('status', ['active', 'trialing', 'past_due', 'unpaid'])
                    .maybeSingle();
                if (fetchError) {
                    console.error('Error fetching full subscription:', fetchError);
                    return null;
                }
                return fullSubscription;
            }
            return null;
        }
        catch (error) {
            console.error('Exception when fetching subscription:', error);
            return null;
        }
    };
    // Fetch user profile and subscription when user changes
    useEffect(() => {
        const fetchUserProfileAndSubscription = async (userId) => {
            try {
                setIsLoading(true);
                // Fetch user profile
                const { data: profile, error: profileError } = await supabaseClient
                    .from('profiles')
                    .select('*')
                    .eq('id', userId)
                    .maybeSingle();
                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    throw new Error('Failed to load user profile');
                }
                if (!profile) {
                    console.warn('No profile found for user:', userId);
                    setUserProfile(null);
                }
                else {
                    setUserProfile(profile);
                }
                // Fetch subscription using the safe function
                const subscription = await fetchUserSubscription(userId);
                setIsSubscribed(!!subscription);
                // Get user stats with proper error handling
                try {
                    const { data: stats } = await supabaseClient
                        .from('user_stats')
                        .select('*')
                        .eq('user_id', userId)
                        .maybeSingle();
                    const fullName = stats ? stats['full_name'] : undefined;
                    setUserStats({
                        user_id: userId,
                        books_read: stats?.books_read ?? 0,
                        reading_hours: stats?.reading_hours ?? 0,
                        achievements: stats?.achievements ?? 0,
                        currently_reading: stats?.currently_reading ?? 'None',
                        ...(stats || {}), // Safely spread stats if it exists
                        ...(fullName && { full_name: fullName }) // Handle full_name specially
                    });
                }
                catch (error) {
                    console.error('Error fetching user stats:', error);
                    // Set default stats on error
                    setUserStats({
                        user_id: userId,
                        books_read: 0,
                        reading_hours: 0,
                        achievements: 0,
                        currently_reading: 'None'
                    });
                }
            }
            catch (error) {
                console.error('Error in fetchUserProfileAndSubscription:', error);
                setError(error instanceof Error ? error.message : 'Failed to load user data');
                setIsLoading(false);
            }
        };
        // Function to create user profile if it doesn't exist
        // This is intentionally left unimplemented as it's not part of the current scope
        // and would require additional database setup and error handling
        const createUserProfile = async (_userId) => {
            try {
                const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
                if (userError || !user) {
                    console.error('Error getting user info for profile creation:', userError);
                    return;
                }
                const { data: newProfile, error: createError } = await supabaseClient
                    .from('profiles')
                    .insert({
                    id: userId,
                    username: user.email?.split('@')[0] || null,
                    display_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
                    email: user.email,
                    role: 'user',
                    subscription_status: 'inactive',
                    beta_reader_status: 'none'
                })
                    .select()
                    .single();
                if (createError) {
                    console.error('Error creating user profile:', createError);
                    setUserProfile(null);
                    setIsAdmin(false);
                }
                else {
                    setUserProfile(newProfile);
                    setIsAdmin(!!(newProfile?.role === 'admin' || newProfile?.role === 'super_admin'));
                }
            }
            catch (error) {
                console.error('Error in createUserProfile:', error);
                setUserProfile(null);
                setIsAdmin(false);
            }
        };
        if (user?.id) {
            fetchUserProfileAndSubscription(user.id);
            setIsAuthenticated(true);
        }
        else {
            setUserProfile(null);
            setIsAdmin(false);
            setIsSubscribed(false);
            setIsAuthenticated(false);
        }
    }, [user, supabaseClient]);
    // Update isAuthenticated based on session
    useEffect(() => {
        setIsAuthenticated(!!session);
        if (session?.user) {
            // Check if user is admin
            const appMetadata = session.user.app_metadata;
            const userMetadata = session.user.user_metadata;
            const isUserAdmin = appMetadata?.role === 'admin' ||
                userMetadata?.role === 'admin';
            setIsAdmin(isUserAdmin);
        }
    }, [session]);
    // Create the context value
    const contextValue = {
        user,
        session,
        userProfile,
        isAdmin,
        isAuthenticated,
        isLoading,
        isSubscribed,
        error,
        supabaseClient,
        setUserProfile,
        setIsSubscribed,
        setError
    };
    return (_jsx(AuthContext.Provider, { value: contextValue, children: children }));
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
//# sourceMappingURL=AuthContext.js.map