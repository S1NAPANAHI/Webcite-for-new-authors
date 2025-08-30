import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useMemo } from 'react';
import { NavLink, useNavigate, Outlet, Routes, Route, useLocation, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase, getUserStats, getSubscription, useAuth } from '@zoroaster/shared';
import { BookOpen, Clock, Shield, Settings, Award, Home, LogOut, ChevronRight, User as UserIcon, Bookmark as BookmarkIcon, Crown, CheckCircle } from 'lucide-react';
export const OverviewContent = ({ userId, isSubscribed, subscriptionTier = 'free', betaReaderStatus, subscriptionEndDate, booksRead, readingHours, currentlyReading, achievements, username, onSignOut }) => {
    // Fetch user activities
    const { data: activities, isLoading: isLoadingActivities, isError: isErrorActivities } = useQuery({
        queryKey: ['userActivities', userId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('user_activities')
                .select('*')
                .eq('user_id', userId)
                .order('timestamp', { ascending: false })
                .limit(5);
            if (error)
                throw error;
            return data;
        },
        enabled: !!userId,
    });
    if (isLoadingActivities) {
        return _jsx("div", { className: "text-gray-100", children: "Loading activities..." });
    }
    if (isErrorActivities) {
        return _jsx("div", { className: "text-red-400", children: "Error loading activities." });
    }
    // Stats for the overview card
    const stats = [
        { label: 'Books Read', value: booksRead, icon: _jsx(BookOpen, { size: 20, className: "text-indigo-400" }) },
        { label: 'Reading Hours', value: `${readingHours}h`, icon: _jsx(Clock, { size: 20, className: "text-green-400" }) },
        { label: 'Currently Reading', value: currentlyReading || 'None', icon: _jsx(BookmarkIcon, { size: 20, className: "text-blue-400" }) },
        { label: 'Achievements', value: achievements, icon: _jsx(Award, { size: 20, className: "text-yellow-400" }) }
    ];
    // Format subscription end date if exists
    const formattedEndDate = subscriptionEndDate
        ? new Date(subscriptionEndDate).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : null;
    // Get subscription tier display name and color
    const getSubscriptionTierInfo = (tier) => {
        switch (tier) {
            case 'premium':
                return { name: 'Premium', color: 'bg-blue-500' };
            case 'patron':
                return { name: 'Patron', color: 'bg-purple-500' };
            default:
                return { name: 'Free', color: 'bg-gray-500' };
        }
    };
    const subscriptionInfo = getSubscriptionTierInfo(subscriptionTier);
    // Get beta reader status display info
    const getBetaReaderStatusInfo = (status) => {
        switch (status) {
            case 'approved':
                return { text: 'Beta Reader', color: 'bg-green-500', icon: _jsx(CheckCircle, { size: 16 }) };
            case 'pending':
                return { text: 'Application Pending', color: 'bg-yellow-500', icon: _jsx(Clock, { size: 16 }) };
            case 'rejected':
                return { text: 'Application Rejected', color: 'bg-red-500', icon: _jsx(Shield, { size: 16 }) };
            default:
                return { text: 'Not Applied', color: 'bg-gray-500', icon: _jsx(UserIcon, { size: 16 }) };
        }
    };
    const betaReaderInfo = getBetaReaderStatusInfo(betaReaderStatus);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Account Dashboard" }), _jsxs("p", { className: "text-gray-400", children: ["Welcome back, ", username || 'User'] })] }), _jsxs("button", { onClick: onSignOut, className: "flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors", children: [_jsx(LogOut, { size: 16 }), "Sign Out"] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsxs("div", { className: "bg-gray-800/50 rounded-xl p-6 border border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Subscription Status" }), _jsxs("div", { className: "flex items-center mt-2", children: [_jsx("span", { className: `w-3 h-3 rounded-full mr-2 ${subscriptionInfo.color}` }), _jsxs("span", { className: "text-white", children: [subscriptionInfo.name, " Tier"] })] }), isSubscribed && subscriptionEndDate && (_jsxs("p", { className: "text-sm text-gray-400 mt-1", children: ["Renews on ", formattedEndDate] }))] }), _jsx("div", { className: "p-3 rounded-lg bg-primary/10", children: _jsx(Crown, { size: 24, className: "text-yellow-400" }) })] }), !isSubscribed && (_jsx("button", { className: "mt-4 w-full py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium", children: "Upgrade Plan" }))] }), _jsxs("div", { className: "bg-gray-800/50 rounded-xl p-6 border border-gray-700", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Beta Reader Program" }), _jsxs("div", { className: "flex items-center mt-2", children: [_jsx("span", { className: `w-3 h-3 rounded-full mr-2 ${betaReaderInfo.color}` }), _jsx("span", { className: "text-white", children: betaReaderInfo.text })] }), betaReaderStatus === 'not_applied' && (_jsx("p", { className: "text-sm text-gray-400 mt-1", children: "Apply to get early access to new content" })), betaReaderStatus === 'pending' && (_jsx("p", { className: "text-sm text-yellow-400 mt-1", children: "We'll review your application soon" }))] }), _jsx("div", { className: "p-3 rounded-lg bg-primary/10", children: betaReaderInfo.icon })] }), betaReaderStatus === 'approved' ? (_jsxs(Link, { to: "/beta/portal", className: "mt-4 w-full py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium flex items-center justify-center gap-2", children: [_jsx(BookOpen, { size: 16 }), "Go to Beta Portal"] })) : (_jsx(Link, { to: betaReaderStatus === 'not_applied' ? '/beta/application' : '/beta/status', className: "mt-4 w-full block text-center py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors text-sm font-medium", children: betaReaderStatus === 'not_applied' ? 'Apply Now' : 'View Application Status' }))] })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: stats.map((stat, index) => (_jsx("div", { className: "bg-background-light/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold text-white", children: stat.value }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: stat.label })] }), _jsx("div", { className: "p-2 rounded-lg bg-primary/10", children: stat.icon })] }) }, index))) }), _jsx("div", { className: "bg-background-light/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("h2", { className: "text-xl font-semibold text-white mb-6", children: "Recent Activity" }), _jsx("div", { className: "space-y-4", children: activities && activities.length > 0 ? (activities.map((activity) => (_jsxs("div", { className: "flex items-center justify-between p-4 hover:bg-gray-800/50 rounded-lg transition-colors", children: [_jsxs("div", { className: "flex items-center gap-4", children: [activity.cover_image_url ? (_jsx("img", { src: activity.cover_image_url, alt: activity.item_title, className: "w-12 h-12 object-cover rounded-lg" })) : (_jsx("div", { className: `w-12 h-12 rounded-lg flex items-center justify-center ${activity.status === 'completed' ? 'bg-green-600/20' : 'bg-indigo-600/20'}`, children: activity.status === 'completed' ? (_jsx(CheckCircle, { className: "w-6 h-6 text-green-400" })) : (_jsx(BookOpen, { className: "w-6 h-6 text-indigo-400" })) })), _jsxs("div", { children: [_jsx("h3", { className: "font-medium text-white", children: activity.item_title }), _jsx("p", { className: "text-sm text-gray-400", children: activity.status === 'completed' ? 'Completed' : 'In Progress' })] })] }), activity.status !== 'completed' && (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-32 bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-indigo-500 h-2 rounded-full", style: { width: `${(activity.progress / (activity.total_progress || 100)) * 100}%` } }) }), _jsx("button", { className: "text-sm text-indigo-400 hover:text-indigo-300 transition-colors", children: "Resume" })] }))] }, activity.id)))) : (_jsx("p", { className: "text-gray-400 text-center py-8", children: "No recent activity" })) })] }) })] }));
};
export const ProfileContent = () => {
    const [formData, setFormData] = useState({
        fullName: '',
        bio: '',
        location: '',
        website: ''
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
        console.log('Profile updated:', formData);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "pb-4 border-b border-gray-700", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Profile Settings" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Manage your personal information and account settings." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { className: "bg-gray-800/50 rounded-xl p-6 space-y-6", children: [_jsxs("div", { className: "flex items-center space-x-6", children: [_jsxs("div", { className: "relative group", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden", children: _jsx(UserIcon, { className: "w-12 h-12 text-gray-400" }) }), _jsx("button", { type: "button", className: "absolute bottom-0 right-0 bg-primary rounded-full p-2 shadow-lg transform translate-y-1/3 group-hover:translate-y-0 transition-transform duration-200", children: _jsxs("svg", { className: "w-4 h-4 text-white", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: [_jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" }), _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15 13a3 3 0 11-6 0 3 3 0 016 0z" })] }) })] }), _jsxs("div", { children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Profile Photo" }), _jsx("p", { className: "text-sm text-gray-400", children: "JPG, GIF or PNG. Max size of 2MB" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-6", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "fullName", className: "block text-sm font-medium text-gray-300 mb-1", children: "Full Name" }), _jsx("input", { type: "text", id: "fullName", name: "fullName", value: formData.fullName, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "Enter your full name" })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "location", className: "block text-sm font-medium text-gray-300 mb-1", children: "Location" }), _jsx("input", { type: "text", id: "location", name: "location", value: formData.location, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "Your location" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { htmlFor: "website", className: "block text-sm font-medium text-gray-300 mb-1", children: "Website" }), _jsx("input", { type: "url", id: "website", name: "website", value: formData.website, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "https://yourwebsite.com" })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { htmlFor: "bio", className: "block text-sm font-medium text-gray-300 mb-1", children: "Bio" }), _jsx("textarea", { id: "bio", name: "bio", rows: 4, value: formData.bio, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent", placeholder: "Tell us about yourself..." })] })] })] }), _jsxs("div", { className: "flex justify-end space-x-3 pt-4", children: [_jsx("button", { type: "button", className: "px-4 py-2 border border-gray-600 rounded-lg text-white hover:bg-gray-700 transition-colors duration-200", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium", children: "Save Changes" })] })] })] }));
};
// Mock data for reading history
const readingHistory = [
    {
        id: 1,
        title: "The Gathas of Zarathushtra",
        author: "Zarathushtra",
        cover: "/covers/gathas.jpg",
        progress: 75,
        lastRead: "2 days ago",
        totalPages: 320,
        currentPage: 240,
        category: "Religious Text"
    },
    {
        id: 2,
        title: "The Denkard",
        author: "Various Authors",
        cover: "/covers/denkard.jpg",
        progress: 30,
        lastRead: "1 week ago",
        totalPages: 450,
        currentPage: 135,
        category: "Religious Text"
    },
    {
        id: 3,
        title: "Zoroastrianism: An Introduction",
        author: "Jenny Rose",
        cover: "/covers/zoroastrianism-intro.jpg",
        progress: 100,
        lastRead: "3 weeks ago",
        totalPages: 280,
        currentPage: 280,
        category: "Non-Fiction"
    }
];
export const ReadingContent = () => {
    const [activeTab, setActiveTab] = useState('all');
    const filteredBooks = readingHistory.filter(book => {
        if (activeTab === 'all')
            return true;
        if (activeTab === 'reading')
            return book.progress < 100;
        return book.progress === 100;
    });
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "pb-4 border-b border-gray-700", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Reading History" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Track your reading progress and history." })] }), _jsx("div", { className: "flex space-x-2 mb-6 p-1 bg-gray-800/50 rounded-lg", children: [
                    { id: 'all', label: 'All Books' },
                    { id: 'reading', label: 'Currently Reading' },
                    { id: 'completed', label: 'Completed' }
                ].map(tab => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700/50'}`, children: tab.label }, tab.id))) }), _jsx("div", { className: "space-y-6", children: filteredBooks.length > 0 ? (filteredBooks.map(book => (_jsx("div", { className: "bg-gray-800/50 rounded-xl overflow-hidden", children: _jsx("div", { className: "p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row gap-6", children: [_jsx("div", { className: "w-full md:w-32 flex-shrink-0", children: _jsx("div", { className: "aspect-[2/3] bg-gray-700 rounded-lg overflow-hidden", children: _jsx("img", { src: book.cover, alt: book.title, className: "w-full h-full object-cover", onError: (e) => {
                                                const target = e.target;
                                                target.src = 'https://via.placeholder.com/150x225?text=No+Cover';
                                            } }) }) }), _jsx("div", { className: "flex-1", children: _jsxs("div", { className: "flex flex-col h-full", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-xl font-semibold text-white", children: book.title }), _jsx("p", { className: "text-gray-400", children: book.author })] }), _jsx("span", { className: "px-3 py-1 text-xs bg-gray-700 text-gray-300 rounded-full", children: book.category })] }), _jsxs("div", { className: "mt-4", children: [_jsxs("div", { className: "flex justify-between text-sm text-gray-400 mb-1", children: [_jsxs("span", { children: ["Progress: ", book.progress, "%"] }), _jsxs("span", { children: ["Page ", book.currentPage, " of ", book.totalPages] })] }), _jsx("div", { className: "w-full bg-gray-700 rounded-full h-2", children: _jsx("div", { className: "bg-primary h-2 rounded-full transition-all duration-500", style: { width: `${book.progress}%` } }) })] })] }), _jsxs("div", { className: "mt-4 pt-4 border-t border-gray-700 flex items-center justify-between", children: [_jsxs("span", { className: "text-sm text-gray-400", children: ["Last read ", book.lastRead] }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("button", { className: "px-4 py-2 text-sm font-medium text-white bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors", children: book.progress < 100 ? 'Continue Reading' : 'Read Again' }), _jsx("button", { className: "p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors", children: _jsx("svg", { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor", children: _jsx("path", { d: "M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" }) }) })] })] })] }) })] }) }) }, book.id)))) : (_jsxs("div", { className: "text-center py-12 bg-gray-800/30 rounded-xl", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4", children: _jsx(BookOpen, { className: "w-8 h-8 text-gray-500" }) }), _jsx("h3", { className: "text-lg font-medium text-white mb-1", children: "No books found" }), _jsx("p", { className: "text-gray-400 max-w-md mx-auto", children: activeTab === 'all'
                                ? "You haven't added any books to your library yet."
                                : activeTab === 'reading'
                                    ? "You don't have any books in progress."
                                    : "You haven't completed any books yet." }), _jsx("button", { className: "mt-4 px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors", children: "Browse Library" })] })) })] }));
};
// Mock data for achievements
const achievements = [
    {
        id: 1,
        title: 'First Steps',
        description: 'Complete your first reading session',
        icon: '🏆',
        progress: 100,
        unlocked: true,
        date: '2023-10-15',
        rarity: 'common'
    },
    {
        id: 2,
        title: 'Book Worm',
        description: 'Read for 10 hours',
        icon: '📚',
        progress: 75,
        unlocked: false,
        date: null,
        rarity: 'uncommon'
    },
    {
        id: 3,
        title: 'Zoroastrian Scholar',
        description: 'Read all core Zoroastrian texts',
        icon: '📜',
        progress: 30,
        unlocked: false,
        date: null,
        rarity: 'rare'
    },
    {
        id: 4,
        title: 'Daily Devotee',
        description: 'Read for 7 days in a row',
        icon: '🔥',
        progress: 42,
        unlocked: false,
        date: null,
        rarity: 'uncommon'
    },
    {
        id: 5,
        title: 'Knowledge Seeker',
        description: 'Complete 50 reading sessions',
        icon: '🔍',
        progress: 100,
        unlocked: true,
        date: '2023-11-02',
        rarity: 'rare'
    },
    {
        id: 6,
        title: 'Wisdom Keeper',
        description: 'Achieve 100% completion on any text',
        icon: '🧠',
        progress: 0,
        unlocked: false,
        date: null,
        rarity: 'epic'
    }
];
const getRarityColor = (rarity) => {
    switch (rarity) {
        case 'common': return 'bg-gray-500/20 border-gray-500';
        case 'uncommon': return 'bg-emerald-500/20 border-emerald-500';
        case 'rare': return 'bg-blue-500/20 border-blue-500';
        case 'epic': return 'bg-purple-500/20 border-purple-500';
        case 'legendary': return 'bg-amber-500/20 border-amber-500';
        default: return 'bg-gray-500/20 border-gray-500';
    }
};
export const AchievementsContent = () => {
    const [activeTab, setActiveTab] = useState('all');
    const filteredAchievements = achievements.filter(achievement => {
        if (activeTab === 'all')
            return true;
        if (activeTab === 'unlocked')
            return achievement.unlocked;
        return !achievement.unlocked;
    });
    const unlockedCount = achievements.filter(a => a.unlocked).length;
    const totalAchievements = achievements.length;
    const completionPercentage = Math.round((unlockedCount / totalAchievements) * 100);
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "pb-4 border-b border-gray-700", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Achievements" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Track your progress and unlock new milestones." })] }), _jsx("div", { className: "bg-gray-800/50 rounded-xl p-6", children: _jsxs("div", { className: "flex flex-col md:flex-row md:items-center md:justify-between gap-4", children: [_jsxs("div", { className: "space-y-1", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: "Achievement Progress" }), _jsxs("p", { className: "text-gray-400", children: [unlockedCount, " of ", totalAchievements, " achievements unlocked"] })] }), _jsxs("div", { className: "w-full md:w-64", children: [_jsx("div", { className: "h-3 bg-gray-700 rounded-full overflow-hidden", children: _jsx("div", { className: "h-full bg-gradient-to-r from-primary to-primary/70 rounded-full transition-all duration-1000", style: { width: `${completionPercentage}%` } }) }), _jsxs("p", { className: "text-sm text-right text-gray-400 mt-1", children: [completionPercentage, "% Complete"] })] })] }) }), _jsx("div", { className: "flex space-x-2 p-1 bg-gray-800/50 rounded-lg", children: [
                    { id: 'all', label: 'All Achievements' },
                    { id: 'unlocked', label: 'Unlocked' },
                    { id: 'locked', label: 'Locked' }
                ].map(tab => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700/50'}`, children: tab.label }, tab.id))) }), filteredAchievements.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredAchievements.map(achievement => (_jsxs("div", { className: `relative p-5 rounded-xl border-2 transition-all duration-200 ${achievement.unlocked
                        ? getRarityColor(achievement.rarity)
                        : 'bg-gray-800/30 border-gray-700 opacity-60'}`, children: [_jsxs("div", { className: "flex items-start space-x-4", children: [_jsx("div", { className: "flex-shrink-0 w-14 h-14 rounded-full bg-gray-700 flex items-center justify-center text-2xl", children: achievement.icon }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: `text-lg font-semibold ${achievement.unlocked ? 'text-white' : 'text-gray-400'}`, children: achievement.title }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: achievement.description }), !achievement.unlocked && (_jsxs("div", { className: "mt-2", children: [_jsx("div", { className: "w-full bg-gray-700 rounded-full h-1.5", children: _jsx("div", { className: "bg-primary h-1.5 rounded-full", style: { width: `${achievement.progress}%` } }) }), _jsxs("p", { className: "text-xs text-gray-400 mt-1 text-right", children: [achievement.progress, "% complete"] })] }))] })] }), achievement.unlocked && achievement.date && (_jsx("div", { className: "mt-3 pt-3 border-t border-gray-700", children: _jsxs("p", { className: "text-xs text-gray-400", children: ["Unlocked on ", new Date(achievement.date).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })] }) })), achievement.unlocked && (_jsx("div", { className: "absolute top-3 right-3", children: _jsx("svg", { className: "w-5 h-5 text-yellow-400", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) }) }))] }, achievement.id))) })) : (_jsxs("div", { className: "text-center py-12 bg-gray-800/30 rounded-xl", children: [_jsx("div", { className: "mx-auto w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mb-4", children: _jsx(Award, { className: "w-8 h-8 text-gray-500" }) }), _jsx("h3", { className: "text-lg font-medium text-white mb-1", children: activeTab === 'unlocked'
                            ? "You haven't unlocked any achievements yet"
                            : "No locked achievements found" }), _jsx("p", { className: "text-gray-400 max-w-md mx-auto", children: activeTab === 'unlocked'
                            ? "Start reading and completing texts to unlock achievements!"
                            : "You've unlocked all available achievements! More coming soon." })] }))] }));
};
export const PreferencesContent = () => {
    const [settings, setSettings] = useState({
        theme: 'dark',
        fontSize: 'medium',
        notifications: true,
        emailNotifications: true,
        language: 'en',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        readingMode: 'paginated',
        autoSave: true,
        showProgress: true,
        showWordCount: true
    });
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        const checked = e.target.checked;
        setSettings(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        // Save settings to server
        console.log('Saving settings:', settings);
    };
    const resetToDefaults = () => {
        if (window.confirm('Are you sure you want to reset all preferences to default?')) {
            setSettings({
                theme: 'dark',
                fontSize: 'medium',
                notifications: true,
                emailNotifications: true,
                language: 'en',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                readingMode: 'paginated',
                autoSave: true,
                showProgress: true,
                showWordCount: true
            });
        }
    };
    const SettingSection = ({ title, children }) => (_jsxs("div", { className: "space-y-4", children: [_jsx("h3", { className: "text-lg font-medium text-white", children: title }), _jsx("div", { className: "space-y-4 pl-4 border-l-2 border-gray-700", children: children })] }));
    const SettingRow = ({ label, description, children }) => (_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-3 border-b border-gray-700/50 last:border-0", children: [_jsxs("div", { className: "flex-1", children: [_jsx("label", { className: "text-sm font-medium text-white", children: label }), description && _jsx("p", { className: "text-xs text-gray-400 mt-1", children: description })] }), _jsx("div", { className: "sm:w-48", children: children })] }));
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "pb-4 border-b border-gray-700", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Preferences" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Customize your experience on our platform." })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-8", children: [_jsxs(SettingSection, { title: "Appearance", children: [_jsx(SettingRow, { label: "Theme", description: "Choose between light and dark themes", children: _jsxs("select", { name: "theme", value: settings.theme, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "light", children: "Light" }), _jsx("option", { value: "dark", children: "Dark" }), _jsx("option", { value: "system", children: "System Default" })] }) }), _jsx(SettingRow, { label: "Font Size", description: "Adjust the text size across the application", children: _jsxs("select", { name: "fontSize", value: settings.fontSize, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "small", children: "Small" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "large", children: "Large" })] }) })] }), _jsxs(SettingSection, { title: "Notifications", children: [_jsx(SettingRow, { label: "Enable Notifications", description: "Receive browser notifications", children: _jsxs("div", { className: "relative inline-block w-10 mr-2 align-middle select-none", children: [_jsx("input", { type: "checkbox", name: "notifications", id: "notifications", checked: settings.notifications, onChange: handleChange, className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" }), _jsx("label", { htmlFor: "notifications", className: `toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.notifications ? 'bg-primary' : 'bg-gray-600'}` })] }) }), _jsx(SettingRow, { label: "Email Notifications", description: "Receive notifications via email", children: _jsxs("div", { className: "relative inline-block w-10 mr-2 align-middle select-none", children: [_jsx("input", { type: "checkbox", name: "emailNotifications", id: "emailNotifications", checked: settings.emailNotifications, onChange: handleChange, className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" }), _jsx("label", { htmlFor: "emailNotifications", className: `toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.emailNotifications ? 'bg-primary' : 'bg-gray-600'}` })] }) })] }), _jsxs(SettingSection, { title: "Reading", children: [_jsx(SettingRow, { label: "Reading Mode", description: "Choose how content is displayed", children: _jsxs("select", { name: "readingMode", value: settings.readingMode, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "paginated", children: "Paginated" }), _jsx("option", { value: "scrolling", children: "Scrolling" })] }) }), _jsx(SettingRow, { label: "Auto-save Progress", description: "Automatically save your reading progress", children: _jsxs("div", { className: "relative inline-block w-10 mr-2 align-middle select-none", children: [_jsx("input", { type: "checkbox", name: "autoSave", id: "autoSave", checked: settings.autoSave, onChange: handleChange, className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" }), _jsx("label", { htmlFor: "autoSave", className: `toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.autoSave ? 'bg-primary' : 'bg-gray-600'}` })] }) }), _jsx(SettingRow, { label: "Show Reading Progress", description: "Display progress indicators while reading", children: _jsxs("div", { className: "relative inline-block w-10 mr-2 align-middle select-none", children: [_jsx("input", { type: "checkbox", name: "showProgress", id: "showProgress", checked: settings.showProgress, onChange: handleChange, className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" }), _jsx("label", { htmlFor: "showProgress", className: `toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.showProgress ? 'bg-primary' : 'bg-gray-600'}` })] }) }), _jsx(SettingRow, { label: "Show Word Count", description: "Display word count for texts", children: _jsxs("div", { className: "relative inline-block w-10 mr-2 align-middle select-none", children: [_jsx("input", { type: "checkbox", name: "showWordCount", id: "showWordCount", checked: settings.showWordCount, onChange: handleChange, className: "toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer" }), _jsx("label", { htmlFor: "showWordCount", className: `toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${settings.showWordCount ? 'bg-primary' : 'bg-gray-600'}` })] }) })] }), _jsxs(SettingSection, { title: "Language & Region", children: [_jsx(SettingRow, { label: "Language", description: "Select your preferred language", children: _jsxs("select", { name: "language", value: settings.language, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "en", children: "English" }), _jsx("option", { value: "es", children: "Espa\u00F1ol" }), _jsx("option", { value: "fr", children: "Fran\u00E7ais" }), _jsx("option", { value: "de", children: "Deutsch" }), _jsx("option", { value: "fa", children: "\u0641\u0627\u0631\u0633\u06CC" }), _jsx("option", { value: "gu", children: "\u0A97\u0AC1\u0A9C\u0AB0\u0ABE\u0AA4\u0AC0" })] }) }), _jsx(SettingRow, { label: "Time Zone", description: "Set your local time zone", children: _jsxs("select", { name: "timezone", value: settings.timezone, onChange: handleChange, className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm focus:ring-2 focus:ring-primary focus:border-transparent", children: [_jsx("option", { value: "America/New_York", children: "Eastern Time (ET)" }), _jsx("option", { value: "America/Chicago", children: "Central Time (CT)" }), _jsx("option", { value: "America/Denver", children: "Mountain Time (MT)" }), _jsx("option", { value: "America/Los_Angeles", children: "Pacific Time (PT)" }), _jsx("option", { value: "Europe/London", children: "London (GMT)" }), _jsx("option", { value: "Europe/Paris", children: "Paris (CET)" }), _jsx("option", { value: "Asia/Tehran", children: "Tehran (IRST)" }), _jsx("option", { value: "Asia/Kolkata", children: "Mumbai (IST)" })] }) })] }), _jsxs("div", { className: "flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-700", children: [_jsx("button", { type: "button", onClick: resetToDefaults, className: "px-4 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors", children: "Reset to Defaults" }), _jsxs("div", { className: "flex space-x-3", children: [_jsx("button", { type: "button", className: "px-4 py-2 text-sm font-medium border border-gray-600 text-gray-300 hover:bg-gray-700/50 rounded-lg transition-colors", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-6 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors", children: "Save Changes" })] })] })] }), _jsx("style", { children: `
        .toggle-checkbox:checked {
          right: 0;
          border-color: #68D391;
        }
        .toggle-checkbox:checked + .toggle-label {
          background-color: #68D391;
        }
      ` })] }));
};
export const SecurityContent = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
    const [backupCodes, setBackupCodes] = useState([]);
    const [showBackupCodes, setShowBackupCodes] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    // Mock data for active sessions
    const activeSessions = [
        {
            id: '1',
            device: 'Windows 10, Chrome',
            location: 'New York, US',
            ip: '192.168.1.1',
            lastActive: '2 hours ago',
            current: true
        },
        {
            id: '2',
            device: 'iPhone 13, Safari',
            location: 'San Francisco, US',
            ip: '203.0.113.1',
            lastActive: '1 week ago',
            current: false
        },
        {
            id: '3',
            device: 'MacBook Pro, Safari',
            location: 'London, UK',
            ip: '198.51.100.1',
            lastActive: '2 weeks ago',
            current: false
        }
    ];
    // Mock security events
    const securityEvents = [
        {
            id: '1',
            type: 'login',
            description: 'Successful login from New York, US',
            device: 'Windows 10, Chrome',
            ip: '192.168.1.1',
            timestamp: '2023-11-15T14:30:00Z',
            status: 'success'
        },
        {
            id: '2',
            type: 'password_change',
            description: 'Password changed',
            device: 'iPhone 13, Safari',
            ip: '203.0.113.1',
            timestamp: '2023-11-10T09:15:00Z',
            status: 'info'
        },
        {
            id: '3',
            type: 'failed_login',
            description: 'Failed login attempt',
            device: 'Unknown',
            ip: '198.51.100.1',
            timestamp: '2023-11-05T18:45:00Z',
            status: 'warning'
        }
    ];
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match');
            return;
        }
        if (newPassword.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }
        setIsLoading(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            setSuccess('Password changed successfully');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        }
        catch (err) {
            setError('Failed to change password. Please try again.');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleEnable2FA = async () => {
        setIsLoading(true);
        try {
            // Simulate 2FA setup
            await new Promise(resolve => setTimeout(resolve, 1000));
            setTwoFactorEnabled(true);
            // Generate backup codes
            const codes = Array.from({ length: 10 }, () => Math.random().toString(36).substring(2, 8).toUpperCase());
            setBackupCodes(codes);
            setShowBackupCodes(true);
            setSuccess('Two-factor authentication has been enabled');
        }
        catch (err) {
            setError('Failed to enable two-factor authentication');
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleDisable2FA = async () => {
        if (window.confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));
                setTwoFactorEnabled(false);
                setBackupCodes([]);
                setSuccess('Two-factor authentication has been disabled');
            }
            catch (err) {
                setError('Failed to disable two-factor authentication');
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    const revokeSession = async () => {
        if (window.confirm('Are you sure you want to revoke this session?')) {
            setIsLoading(true);
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 800));
                setSuccess('Session has been revoked');
            }
            catch (err) {
                setError('Failed to revoke session');
            }
            finally {
                setIsLoading(false);
            }
        }
    };
    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    return (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "pb-4 border-b border-gray-700", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "Security Settings" }), _jsx("p", { className: "text-gray-400 mt-1", children: "Manage your account security and privacy settings." })] }), _jsx("div", { className: "flex space-x-2 p-1 bg-gray-800/50 rounded-lg", children: [
                    { id: 'overview', label: 'Overview' },
                    { id: 'sessions', label: 'Active Sessions' },
                    { id: 'activity', label: 'Security Activity' }
                ].map(tab => (_jsx("button", { onClick: () => setActiveTab(tab.id), className: `px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === tab.id
                        ? 'bg-primary text-white'
                        : 'text-gray-300 hover:bg-gray-700/50'}`, children: tab.label }, tab.id))) }), error && (_jsx("div", { className: "p-4 bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg", children: error })), success && (_jsx("div", { className: "p-4 bg-green-500/10 border border-green-500/30 text-green-300 rounded-lg", children: success })), showBackupCodes && (_jsx("div", { className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4", children: _jsxs("div", { className: "bg-gray-800 rounded-xl p-6 max-w-md w-full", children: [_jsxs("div", { className: "flex justify-between items-center mb-4", children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Save Your Backup Codes" }), _jsx("button", { onClick: () => setShowBackupCodes(false), className: "text-gray-400 hover:text-white", children: "\u2715" })] }), _jsx("p", { className: "text-sm text-gray-300 mb-4", children: "Save these backup codes in a safe place. You can use them to access your account if you lose access to your authenticator app." }), _jsx("div", { className: "grid grid-cols-2 gap-2 mb-6", children: backupCodes.map((code, index) => (_jsx("div", { className: "bg-gray-700/50 p-2 rounded text-center font-mono", children: code }, index))) }), _jsx("div", { className: "flex justify-end", children: _jsx("button", { onClick: () => setShowBackupCodes(false), className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors", children: "I've saved my codes" }) })] }) })), activeTab === 'overview' && (_jsxs("div", { className: "space-y-8", children: [_jsxs("div", { className: "bg-gray-800/50 rounded-xl p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Change Password" }), _jsxs("form", { onSubmit: handlePasswordChange, className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { htmlFor: "currentPassword", className: "block text-sm font-medium text-gray-300 mb-1", children: "Current Password" }), _jsx("input", { type: "password", id: "currentPassword", value: currentPassword, onChange: (e) => setCurrentPassword(e.target.value), className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "newPassword", className: "block text-sm font-medium text-gray-300 mb-1", children: "New Password" }), _jsx("input", { type: "password", id: "newPassword", value: newPassword, onChange: (e) => setNewPassword(e.target.value), className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent", required: true })] }), _jsxs("div", { children: [_jsx("label", { htmlFor: "confirmPassword", className: "block text-sm font-medium text-gray-300 mb-1", children: "Confirm New Password" }), _jsx("input", { type: "password", id: "confirmPassword", value: confirmPassword, onChange: (e) => setConfirmPassword(e.target.value), className: "w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-primary focus:border-transparent", required: true })] }), _jsx("div", { className: "pt-2", children: _jsx("button", { type: "submit", disabled: isLoading, className: "px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50", children: isLoading ? 'Updating...' : 'Update Password' }) })] })] }), _jsxs("div", { className: "bg-gray-800/50 rounded-xl p-6", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsx("h3", { className: "text-lg font-semibold text-white", children: "Two-Factor Authentication" }), _jsx("p", { className: "text-sm text-gray-400 mt-1", children: twoFactorEnabled
                                                    ? 'Two-factor authentication is currently enabled.'
                                                    : 'Add an extra layer of security to your account.' })] }), twoFactorEnabled ? (_jsx("button", { onClick: handleDisable2FA, disabled: isLoading, className: "px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50", children: isLoading ? 'Disabling...' : 'Disable 2FA' })) : (_jsx("button", { onClick: handleEnable2FA, disabled: isLoading, className: "px-4 py-2 bg-primary/20 text-primary rounded-lg hover:bg-primary/30 transition-colors disabled:opacity-50", children: isLoading ? 'Enabling...' : 'Enable 2FA' }))] }), twoFactorEnabled && backupCodes.length > 0 && (_jsx("div", { className: "mt-4 pt-4 border-t border-gray-700", children: _jsx("button", { onClick: () => setShowBackupCodes(true), className: "text-sm text-blue-400 hover:text-blue-300", children: "View Backup Codes" }) }))] }), _jsxs("div", { className: "bg-blue-500/10 border border-blue-500/30 rounded-xl p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-blue-300 mb-3", children: "Security Tips" }), _jsxs("ul", { className: "space-y-3 text-sm text-blue-200", children: [_jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDD12" }), _jsx("span", { children: "Use a strong, unique password that you don't use elsewhere." })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDD11" }), _jsx("span", { children: "Enable two-factor authentication for added security." })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDC40" }), _jsx("span", { children: "Regularly review your active sessions and revoke any that look suspicious." })] }), _jsxs("li", { className: "flex items-start", children: [_jsx("span", { className: "mr-2", children: "\uD83D\uDCE7" }), _jsx("span", { children: "Make sure your email account is secure, as it can be used to reset your password." })] })] })] })] })), activeTab === 'sessions' && (_jsx("div", { className: "bg-gray-800/50 rounded-xl overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Active Sessions" }), _jsx("p", { className: "text-sm text-gray-400 mb-6", children: "This is a list of devices that have logged into your account. Revoke any sessions that you don't recognize." }), _jsx("div", { className: "space-y-4", children: activeSessions.map((session) => (_jsx("div", { className: `p-4 rounded-lg ${session.current ? 'bg-primary/10 border border-primary/30' : 'bg-gray-700/50'}`, children: _jsxs("div", { className: "flex justify-between items-start", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "font-medium text-white", children: session.device }), session.current && (_jsx("span", { className: "ml-2 px-2 py-0.5 text-xs bg-primary/20 text-primary rounded-full", children: "Current Session" }))] }), _jsxs("div", { className: "text-sm text-gray-400 mt-1", children: [session.location, " \u2022 ", session.ip] }), _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: ["Last active: ", session.lastActive] })] }), !session.current && (_jsx("button", { onClick: revokeSession, disabled: isLoading, className: "px-3 py-1 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors disabled:opacity-50", children: "Revoke" }))] }) }, session.id))) })] }) })), activeTab === 'activity' && (_jsx("div", { className: "bg-gray-800/50 rounded-xl overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsx("h3", { className: "text-lg font-semibold text-white mb-4", children: "Security Activity" }), _jsx("p", { className: "text-sm text-gray-400 mb-6", children: "Review recent security events related to your account." }), _jsx("div", { className: "space-y-4", children: securityEvents.map((event) => (_jsx("div", { className: "p-4 bg-gray-700/30 rounded-lg", children: _jsxs("div", { className: "flex items-start", children: [_jsx("div", { className: `w-2 h-2 rounded-full mt-2 ${event.status === 'success' ? 'bg-green-500' :
                                                event.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'}` }), _jsxs("div", { className: "ml-4 flex-1", children: [_jsxs("div", { className: "flex justify-between items-start", children: [_jsx("h4", { className: "font-medium text-white", children: event.description }), _jsx("span", { className: "text-xs text-gray-500", children: formatDate(event.timestamp) })] }), _jsxs("div", { className: "text-sm text-gray-400 mt-1", children: [event.device, " \u2022 ", event.ip] })] })] }) }, event.id))) }), _jsx("div", { className: "mt-6 text-center", children: _jsx("button", { className: "text-sm text-primary hover:text-primary/80 transition-colors", children: "View All Activity" }) })] }) }))] }));
};
export const AdminContent = () => {
    return (_jsxs("div", { className: "text-gray-100", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Admin Dashboard" }), _jsx("p", { children: "Admin specific content and tools." })] }));
};
const ProfileDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');
    const { user, userProfile, isAdmin, isLoading, isAuthenticated } = useAuth();
    const [displayProfile, setDisplayProfile] = useState({
        isSubscribed: false,
        subscriptionTier: 'free',
        betaReaderStatus: 'not_applied',
        subscriptionEndDate: undefined,
        booksRead: 0,
        readingHours: 0,
        currentlyReading: '',
        achievements: 0,
        username: 'User',
    });
    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }
    }, [isLoading, isAuthenticated, navigate]);
    // Update active tab based on URL
    useEffect(() => {
        const path = location.pathname.split('/').pop() || 'overview';
        setActiveTab(path === 'account' ? 'overview' : path);
    }, [location]);
    // Tab configuration
    const baseTabs = [
        { id: 'overview', name: 'Overview', icon: _jsx(Home, { size: 18 }), path: '/account' },
        { id: 'profile', name: 'Profile', icon: _jsx(UserIcon, { size: 18 }), path: '/account/profile' },
        { id: 'reading', name: 'Reading', icon: _jsx(BookOpen, { size: 18 }), path: '/account/reading' },
        { id: 'achievements', name: 'Achievements', icon: _jsx(Award, { size: 18 }), path: '/account/achievements' },
        { id: 'preferences', name: 'Preferences', icon: _jsx(Settings, { size: 18 }), path: '/account/preferences' },
        { id: 'security', name: 'Security', icon: _jsx(Shield, { size: 18 }), path: '/account/security' },
    ];
    const tabs = useMemo(() => [...baseTabs], []);
    const { data: userStats, isLoading: isLoadingStats } = useQuery({
        queryKey: ['userStats', user?.id],
        queryFn: () => getUserStats(user.id),
        enabled: !!user?.id,
    });
    const { data: subscription, isLoading: isLoadingSubscription } = useQuery({
        queryKey: ['subscription', user?.id],
        queryFn: () => getSubscription(user.id),
        enabled: !!user?.id,
    });
    useEffect(() => {
        if (userProfile) {
            setDisplayProfile(prev => ({
                ...prev,
                username: userProfile.username || user?.email?.split('@')[0] || 'User',
                betaReaderStatus: userProfile.beta_reader_status || 'not_applied',
            }));
        }
        if (userStats) {
            setDisplayProfile(prev => ({
                ...prev,
                booksRead: userStats.books_read || 0,
                readingHours: userStats.reading_hours || 0,
                currentlyReading: userStats.currently_reading || '',
                achievements: userStats.achievements || 0,
            }));
        }
        if (subscription) {
            setDisplayProfile(prev => ({
                ...prev,
                isSubscribed: true,
                subscriptionTier: subscription.plan_id,
                subscriptionEndDate: subscription.current_period_end,
            }));
        }
    }, [user, userProfile, userStats, subscription]);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    if (isLoading || (isAuthenticated && (!userProfile || isLoadingStats || isLoadingSubscription))) {
        return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-background-dark to-background-darker flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto" }), _jsx("p", { className: "mt-4 text-gray-400", children: "Loading your profile..." })] }) }));
    }
    if (!isAuthenticated || !user) {
        return null; // Redirect is handled by useEffect
    }
    return (_jsx("div", { className: "min-h-screen bg-gradient-to-b from-background-dark to-background-darker text-text-light", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8", children: _jsxs("div", { className: "flex flex-col lg:flex-row gap-8", children: [_jsxs("aside", { className: "w-full lg:w-64 flex-shrink-0", children: [_jsxs("div", { className: "bg-background-light/50 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-800", children: [_jsxs("div", { className: "p-6 text-center border-b border-gray-800", children: [_jsxs("div", { className: "relative inline-block", children: [_jsx("div", { className: "w-24 h-24 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white", children: user?.email?.charAt(0).toUpperCase() }), _jsx("button", { className: "absolute -bottom-1 -right-1 bg-primary w-8 h-8 rounded-full flex items-center justify-center text-white hover:bg-primary/90 transition-colors", children: _jsx(UserIcon, { size: 16 }) })] }), _jsx("h2", { className: "mt-4 text-xl font-semibold text-white", children: userProfile?.display_name || userProfile?.username }), _jsx("p", { className: "text-sm text-gray-400", children: isAdmin ? 'Admin' : 'Member' })] }), _jsx("nav", { className: "p-2", children: _jsx("ul", { className: "space-y-1", children: tabs.map((tab) => (_jsx("li", { children: _jsxs(NavLink, { to: tab.path, end: tab.path === '/account', className: ({ isActive }) => `flex items-center justify-between px-4 py-3 rounded-lg transition-colors duration-200 ${isActive
                                                        ? 'bg-primary/10 text-primary'
                                                        : 'text-gray-300 hover:bg-gray-800/50 hover:text-white'}`, children: [_jsxs("div", { className: "flex items-center", children: [_jsx("span", { className: "mr-3", children: tab.icon }), tab.name] }), _jsx(ChevronRight, { size: 16, className: "text-gray-500" })] }) }, tab.id))) }) })] }), activeTab === 'overview' && (_jsxs("div", { className: "mt-6 bg-background-light/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800", children: [_jsx("h3", { className: "text-sm font-medium text-gray-400 mb-4", children: "YOUR STATS" }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400", children: _jsx(BookOpen, { size: 16 }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-300", children: "Books Read" }), _jsx("p", { className: "text-lg font-semibold text-white", children: displayProfile.booksRead })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-400", children: _jsx(Clock, { size: 16 }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-300", children: "Reading Hours" }), _jsxs("p", { className: "text-lg font-semibold text-white", children: [displayProfile.readingHours, "h"] })] })] }), _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: "flex-shrink-0 w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400", children: _jsx(BookmarkIcon, { size: 16 }) }), _jsxs("div", { className: "ml-3", children: [_jsx("p", { className: "text-sm font-medium text-gray-300", children: "Currently Reading" }), _jsx("p", { className: "text-lg font-semibold text-white", children: displayProfile.currentlyReading || 'None' })] })] })] })] }))] }), _jsx("main", { className: "flex-1", children: _jsx("div", { className: "bg-background-light/50 backdrop-blur-sm rounded-xl border border-gray-800 overflow-hidden", children: _jsxs("div", { className: "p-6", children: [_jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(OverviewContent, { userId: user.id, isSubscribed: displayProfile.isSubscribed, subscriptionTier: displayProfile.subscriptionTier, betaReaderStatus: displayProfile.betaReaderStatus, subscriptionEndDate: displayProfile.subscriptionEndDate, booksRead: displayProfile.booksRead, readingHours: displayProfile.readingHours, currentlyReading: displayProfile.currentlyReading, achievements: displayProfile.achievements, username: displayProfile.username, onSignOut: handleLogout }) }), _jsx(Route, { path: "profile", element: _jsx(ProfileContent, {}) }), _jsx(Route, { path: "reading", element: _jsx(ReadingContent, {}) }), _jsx(Route, { path: "achievements", element: _jsx(AchievementsContent, {}) }), _jsx(Route, { path: "preferences", element: _jsx(PreferencesContent, {}) }), _jsx(Route, { path: "security", element: _jsx(SecurityContent, {}) }), isAdmin && _jsx(Route, { path: "admin/*", element: _jsx(AdminContent, {}) })] }), _jsx(Outlet, {})] }) }) })] }) }) }));
};
export default ProfileDashboard;
//# sourceMappingURL=ProfileDashboard.js.map