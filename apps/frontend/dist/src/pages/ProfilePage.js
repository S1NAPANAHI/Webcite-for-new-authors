import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared';
import { useNavigate } from 'react-router-dom';
// Import sub-components for tabs (will be created later)
// import OverviewTab from '../../components/profile/OverviewTab';
// import ProfileTab from '../../components/profile/ProfileTab';
import { ReadingTab } from '@zoroaster/ui';
// import AchievementsTab from '../../components/profile/AchievementsTab';
// import PreferencesTab from '../../components/profile/PreferencesTab';
// import SecurityTab from '../../components/profile/SecurityTab';
const ProfilePage = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();
    useEffect(() => {
        const fetchUserProfile = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                navigate('/login'); // Redirect to login if not authenticated
                return;
            }
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();
            if (error) {
                console.error('Error fetching user profile:', error.message);
                // Handle case where profile might not exist yet for a new user
                if (error.code === 'PGRST116') { // No rows found
                    setUserProfile({
                        id: user.id,
                        username: user.email, // Default to email if username not set
                        display_name: user.user_metadata?.full_name || '',
                        bio: '',
                        location: '',
                        favorite_genre: '',
                        reading_goal: 0,
                        books_read: 0,
                        currently_reading: 0,
                        reading_hours: 0,
                        achievements_count: 0,
                    });
                }
                else {
                    // Handle other errors
                    alert('Failed to load profile.');
                }
            }
            else {
                setUserProfile(data);
            }
            setLoading(false);
        };
        fetchUserProfile();
    }, [navigate]);
    if (loading) {
        return _jsx("div", { className: "flex justify-center items-center min-h-screen text-text-light", children: "Loading profile..." });
    }
    if (!userProfile) {
        return _jsx("div", { className: "flex justify-center items-center min-h-screen text-text-light", children: "No profile data found." });
    }
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    return (_jsx("div", { className: "bg-background-dark min-h-screen text-text-light py-8", children: _jsxs("div", { className: "container mx-auto p-4 grid grid-cols-1 md:grid-cols-4 gap-8", children: [_jsxs("aside", { className: "md:col-span-1 bg-background-light rounded-lg shadow-lg p-6 sticky top-8 h-fit", children: [_jsxs("div", { className: "profile-avatar w-32 h-32 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-5xl text-background-dark mx-auto mb-4 relative cursor-pointer transition-transform duration-300 hover:scale-105", children: [userProfile.display_name ? userProfile.display_name.charAt(0).toUpperCase() : userProfile.username.charAt(0).toUpperCase(), _jsx("div", { className: "avatar-upload absolute bottom-0 right-0 bg-secondary w-8 h-8 rounded-full flex items-center justify-center text-xs text-background-dark cursor-pointer", children: "\uD83D\uDCF7" })] }), _jsx("div", { className: "username text-center text-2xl font-semibold text-secondary mb-1", children: userProfile.display_name || userProfile.username }), _jsx("div", { className: "user-title text-center text-sm text-primary-light italic mb-8", children: userProfile.role || 'User' }), _jsxs("ul", { className: "sidebar-nav space-y-2", children: [_jsx("li", { children: _jsx("a", { href: "#", onClick: () => handleTabClick('overview'), className: `flex items-center gap-2 p-3 rounded-md transition-all duration-300 ${activeTab === 'overview' ? 'bg-primary-dark text-text-light' : 'hover:bg-primary-dark/20 text-text-light'}`, children: "\uD83D\uDCCA Overview" }) }), _jsx("li", { children: _jsx("a", { href: "#", onClick: () => handleTabClick('profile'), className: `flex items-center gap-2 p-3 rounded-md transition-all duration-300 ${activeTab === 'profile' ? 'bg-primary-dark text-text-light' : 'hover:bg-primary-dark/20 text-text-light'}`, children: "\uD83D\uDC64 Profile" }) }), _jsx("li", { children: _jsx("a", { href: "#", onClick: () => handleTabClick('reading'), className: `flex items-center gap-2 p-3 rounded-md transition-all duration-300 ${activeTab === 'reading' ? 'bg-primary-dark text-text-light' : 'hover:bg-primary-dark/20 text-text-light'}`, children: "\uD83D\uDCDA Reading" }) }), _jsx("li", { children: _jsx("a", { href: "#", onClick: () => handleTabClick('achievements'), className: `flex items-center gap-2 p-3 rounded-md transition-all duration-300 ${activeTab === 'achievements' ? 'bg-primary-dark text-text-light' : 'hover:bg-primary-dark/20 text-text-light'}`, children: "\uD83C\uDFC6 Achievements" }) }), _jsx("li", { children: _jsx("a", { href: "#", onClick: () => handleTabClick('preferences'), className: `flex items-center gap-2 p-3 rounded-md transition-all duration-300 ${activeTab === 'preferences' ? 'bg-primary-dark text-text-light' : 'hover:bg-primary-dark/20 text-text-light'}`, children: "\u2699\uFE0F Preferences" }) }), _jsx("li", { children: _jsx("a", { href: "#", onClick: () => handleTabClick('security'), className: `flex items-center gap-2 p-3 rounded-md transition-all duration-300 ${activeTab === 'security' ? 'bg-primary-dark text-text-light' : 'hover:bg-primary-dark/20 text-text-light'}`, children: "\uD83D\uDD12 Security" }) })] })] }), _jsxs("main", { className: "md:col-span-3 bg-background-light rounded-lg shadow-lg p-6", children: [activeTab === 'overview' && _jsx("div", { children: "Overview Content (Coming Soon)" }), activeTab === 'profile' && _jsx("div", { children: "Profile Content (Coming Soon)" }), activeTab === 'reading' && _jsx(ReadingTab, { userProfile: userProfile }), activeTab === 'achievements' && _jsx("div", { children: "Achievements Content (Coming Soon)" }), activeTab === 'preferences' && _jsx("div", { children: "Preferences Content (Coming Soon)" }), activeTab === 'security' && _jsx("div", { children: "Security Content (Coming Soon)" })] })] }) }));
};
export default ProfilePage;
//# sourceMappingURL=ProfilePage.js.map