import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    useEffect(() => {
        const fetchSessionAndProfile = async () => {
            setIsLoading(true);
            const { data: { session }, error: sessionError } = await supabase.auth.getSession();
            if (sessionError) {
                console.error("Error getting session:", sessionError);
                setUser(null);
                setUserProfile(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
                setIsLoading(false);
                return;
            }
            if (session) {
                setUser(session.user);
                setIsAuthenticated(true);
                try {
                    console.log('🔍 [useAuth] Fetching user profile for ID:', session.user.id);
                    const { data: profile, error: profileError } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', session.user.id)
                        .single();
                    if (profileError) {
                        console.error('❌ [useAuth] Error fetching user profile:', profileError);
                        setUserProfile(null);
                        setIsAdmin(false);
                    }
                    else if (profile) {
                        console.log('✅ [useAuth] Retrieved profile:', profile);
                        setUserProfile(profile);
                        const adminRoles = ['admin', 'super_admin'];
                        const userRole = profile.role?.toLowerCase();
                        const isUserAdmin = Boolean(userRole && adminRoles.includes(userRole));
                        setIsAdmin(isUserAdmin);
                        console.log('🔑 [useAuth] Role check:', {
                            userId: profile.id,
                            role: userRole,
                            isAdmin: isUserAdmin,
                        });
                    }
                    else {
                        console.error('❌ [useAuth] No profile data returned for user ID:', session.user.id);
                        setUserProfile(null);
                        setIsAdmin(false);
                    }
                }
                catch (e) {
                    console.error("Catastrophic error fetching profile:", e);
                    setUserProfile(null);
                    setIsAdmin(false);
                }
            }
            else {
                setUser(null);
                setUserProfile(null);
                setIsAuthenticated(false);
                setIsAdmin(false);
            }
            setIsLoading(false);
        };
        fetchSessionAndProfile();
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, _session) => {
            console.log('🔄 [useAuth] Auth state changed, event:', _event);
            fetchSessionAndProfile();
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    return {
        user,
        userProfile,
        isAuthenticated,
        isAdmin,
        isLoading,
    };
};
//# sourceMappingURL=useAuth.js.map