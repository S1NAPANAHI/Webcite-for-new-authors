import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { supabase } from '@zoroaster/shared/supabaseClient';
import { useAuth } from '@zoroaster/shared/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, BookOpen, Award, Settings, Shield, LogOut, ChevronRight, User as UserIcon, Bookmark, Clock, Star, Lock } from 'lucide-react';
// Import sub-components for tabs
import { OverviewTab } from './OverviewTab.js';
import { ProfileTab } from './ProfileTab.js';
import { ReadingTab } from '@zoroaster/ui';
import { AchievementsTab } from '@zoroaster/ui';
import { PreferencesTab } from '@zoroaster/ui';
import { SecurityTab } from '@zoroaster/ui';
export const AccountPage = () => {
    const { user, userProfile: authUserProfile, isLoading: loading, isAuthenticated } = useAuth(); // Use useAuth hook
    const [activeTab, setActiveTab] = useState('overview');
    const [error, setError] = useState(null); // Keep local error state for other errors
    const navigate = useNavigate();
    const userProfile = authUserProfile;
    // Redirect if not authenticated and not loading
    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate('/login');
        }
    }, [loading, isAuthenticated, navigate]);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    // This function will now update the userProfile state from useAuth
    const handleProfileUpdate = (updatedProfile) => {
        // This will trigger a re-fetch in useAuth, or you can directly update the state if useAuth provides a setter
        // For now, we'll rely on useAuth's internal state management after a profile update
        // If you need immediate UI update, you might need to pass a setter from useAuth or re-fetch here.
        // For simplicity, we assume useAuth will handle the state update after a successful profile change.
        // If userProfile is null, we can't update it.
        if (userProfile) {
            // This is a temporary local update for immediate UI feedback.
            // The actual source of truth should be updated via supabase in ProfileTab.
            // useAuth will eventually re-fetch and update its userProfile state.
            // For now, we'll just ensure the ProfileTab can still pass updates.
        }
    };
    if (loading) {
        return (_jsxs("div", { className: "flex justify-center items-center min-h-screen", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" }), _jsx("span", { className: "ml-4 text-text-light", children: "Loading your profile..." })] }));
    }
    if (error) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen p-4", children: [_jsxs("div", { className: "bg-red-100 border-l-4 border-red-500 text-red-700 p-4 w-full max-w-2xl", role: "alert", children: [_jsx("p", { className: "font-bold", children: "Error" }), _jsx("p", { children: error })] }), _jsx("button", { onClick: () => window.location.reload(), className: "mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors", children: "Try Again" })] }));
    }
    if (!userProfile) {
        return (_jsx("div", { className: "flex justify-center items-center min-h-screen", children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-text-light text-lg mb-4", children: "No profile data found." }), _jsx("button", { onClick: () => navigate('/login'), className: "px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors", children: "Go to Login" })] }) }));
    }
    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };
    // Tab configuration
    const tabs = [
        {
            id: 'overview',
            name: 'Overview',
            icon: _jsx(UserIcon, { size: 18 }),
            component: _jsx(OverviewTab, { userProfile: userProfile })
        },
        {
            id: 'profile',
            name: 'Profile',
            icon: _jsx(User, { size: 18 }),
            component: _jsx(ProfileTab, { userProfile: userProfile, onProfileUpdate: handleProfileUpdate })
        },
        {
            id: 'reading',
            name: 'Reading',
            icon: _jsx(BookOpen, { size: 18 }),
            component: _jsx(ReadingTab, { userProfile: userProfile })
        },
        {
            id: 'achievements',
            name: 'Achievements',
            icon: _jsx(Award, { size: 18 }),
            component: _jsx(AchievementsTab, { userProfile: userProfile })
        },
        {
            id: 'preferences',
            name: 'Preferences',
            icon: _jsx(Settings, { size: 18 }),
            component: _jsx(PreferencesTab, { userProfile: userProfile })
        },
        {
            id: 'security',
            name: 'Security',
            icon: _jsx(Shield, { size: 18 }),
            component: _jsx(SecurityTab, { userProfile: userProfile })
        }
    ];
    // Stats for the overview card
    const stats = [
        { label: 'Books Read', value: userProfile.books_read || 0, icon: _jsx(Bookmark, { size: 16 }) },
        { label: 'Reading Goal', value: `${userProfile.reading_goal || 0} books`, icon: _jsx(Star, { size: 16 }) },
        { label: 'Reading Streak', value: `${userProfile.reading_streak || 0} days`, icon: _jsx(Clock, { size: 16 }) },
        { label: 'Account Security', value: 'Strong', icon: _jsx(Lock, { size: 16 }) }
    ];
    return (_jsxs("div", { className: "min-h-screen bg-gradient-to-b from-background-dark to-background-darker text-text-light", children: [_jsx("div", { className: "bg-background-darker/50 backdrop-blur-md border-b border-gray-800", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center justify-between", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-bold text-white", children: "Account Dashboard" }), _jsx("p", { className: "mt-2 text-gray-400", children: "Manage your profile and preferences" })] }), _jsxs("button", { onClick: handleLogout, className: "mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-red-600 text-red-400 rounded-md hover:bg-red-600/10 transition-colors duration-200", children: [_jsx(LogOut, { size: 16, className: "mr-2" }), "Sign Out"] })] }) }) }), _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [_jsxs("aside", { className: "w-full lg:w-64 flex-shrink-0", children: [_jsxs("div", { className: "bg-background-light/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800", children: [_jsxs("div", { className: "p-6 text-center border-b border-gray-800", children: [_jsxs("div", { className: "relative inline-block", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white", children: (userProfile.display_name || userProfile.username || ' ').charAt(0).toUpperCase() }), _jsx("button", { className: "absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors", children: _jsx(UserIcon, { size: 16 }) })] }), _jsx("h2", { className: "mt-4 text-xl font-semibold text-white", children: userProfile.display_name || userProfile.username }), _jsx("p", { className: "text-sm text-gray-400", children: userProfile.role || 'Member' })] }), _jsx("nav", { className: "p-2", children: _jsxs("ul", { className: "space-y-1", children: [tabs.map((tab) => (_jsx("li", { children: _jsxs("button", { onClick: () => handleTabClick(tab.id), className: `w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id
                                                                ? 'bg-primary/10 text-primary'
                                                                : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-3", children: tab.icon }), tab.name] }), _jsx(ChevronRight, { size: 16, className: "text-gray-500" })] }) }, tab.id))), userProfile.role === 'admin' && (_jsx("li", { children: _jsxs("a", { href: "/admin", className: "w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-amber-400 rounded-lg hover:bg-amber-900/20 transition-colors", children: [_jsxs("div", { className: "flex items-center", children: [_jsx(Shield, { size: 18, className: "mr-3" }), "Admin Dashboard"] }), _jsx(ChevronRight, { size: 16 })] }) }))] }) })] }), activeTab === 'overview' && (_jsxs("div", { className: "mt-6 bg-background-light/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400 mb-4", children: "YOUR STATS" }), _jsx("div", { className: "space-y-4", children: stats.map((stat, index) => (_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary", children: stat.icon }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-300", children: stat.label }), _jsx("p", { className: "text-lg font-semibold text-white", children: stat.value })] })] }, index))) })] }))] }), _jsx("main", { className: "flex-1", children: _jsx("div", { className: "bg-background-light/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden", children: _jsx("div", { className: "p-6", children: tabs.find(tab => tab.id === activeTab)?.component }) }) })] }) })] }));
};
//# sourceMappingURL=AccountPage.js.map