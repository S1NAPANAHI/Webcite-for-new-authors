import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '../../packages/shared/src/utils.js';
import { useAuth } from '../../packages/shared/src/AuthContext.js';
import { supabase } from '../../packages/shared/src/supabaseClient.js';
import { LayoutDashboard, FileText, Store, BookOpen, Settings, Users, Upload, ChevronLeft, ChevronRight, LogOut, Calendar } from 'lucide-react';
const navigation = [
    { name: 'Dashboard', href: '/account/admin', icon: LayoutDashboard },
    { name: 'Posts', href: '/account/admin/posts', icon: FileText },
    { name: 'Media', href: '/account/admin/media', icon: Upload },
    { name: 'Users', href: '/account/admin/users', icon: Users },
    { name: 'Beta Applications', href: '/account/admin/beta-applications', icon: Users },
    { name: 'Store', href: '/account/admin/store', icon: Store },
    { name: 'Works', href: '/account/admin/works', icon: BookOpen },
    { name: 'Timeline', href: '/account/admin/timeline/events', icon: Calendar },
    { name: 'Settings', href: '/account/admin/settings', icon: Settings },
];
export const AdminLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { user, userProfile } = useAuth();
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);
    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };
    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/login');
    };
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200 flex", children: [_jsx("button", { onClick: toggleSidebar, className: cn('fixed top-4 left-0 z-50 p-2 rounded-r-lg bg-white dark:bg-gray-800 shadow-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-300', isCollapsed ? 'translate-x-0' : 'translate-x-64', 'lg:hidden' // Only show on mobile
                ), "aria-label": isCollapsed ? "Expand sidebar" : "Collapse sidebar", children: isCollapsed ? _jsx(ChevronRight, { size: 20 }) : _jsx(ChevronLeft, { size: 20 }) }), _jsx("aside", { className: cn('fixed top-0 left-0 z-40 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out', isCollapsed ? 'w-0 opacity-0' : 'w-64 opacity-100', isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0', 'lg:opacity-100' // Always show on desktop
                ), children: _jsxs("div", { className: "h-full flex flex-col", children: [_jsx("div", { className: "p-4 border-b border-gray-200 dark:border-gray-700", children: _jsx("h2", { className: "text-xl font-bold", children: "Admin" }) }), _jsx("nav", { className: "flex-1 overflow-y-auto py-4 px-2", children: _jsx("ul", { className: "space-y-1", children: navigation.map((item) => (_jsx("li", { children: _jsxs(NavLink, { to: item.href, end: item.href === '/account/admin', className: ({ isActive }) => cn('flex items-center p-3 rounded-lg transition-colors', isActive
                                            ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                                            : 'hover:bg-gray-100 dark:hover:bg-gray-700', isCollapsed ? 'justify-center' : 'space-x-3'), children: [_jsx(item.icon, { size: 20, className: "flex-shrink-0" }), !isCollapsed && _jsx("span", { children: item.name })] }) }, item.name))) }) }), _jsx("div", { className: "p-4 border-t border-gray-200 dark:border-gray-700", children: _jsxs("div", { className: cn("flex items-center", isCollapsed ? 'justify-center' : 'justify-between'), children: [!isCollapsed && (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx("div", { className: "w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold", children: userProfile?.display_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium truncate max-w-[140px]", children: userProfile?.display_name || 'Admin User' }), _jsx("p", { className: "text-xs text-gray-500 dark:text-gray-400 truncate max-w-[140px]", children: user?.email })] })] })), _jsx("button", { onClick: handleLogout, className: "p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700", title: "Sign out", children: _jsx(LogOut, { size: 18 }) })] }) })] }) }), _jsx("div", { className: cn('transition-all duration-300 min-h-screen', isCollapsed ? 'lg:ml-0' : 'lg:ml-64', 'ml-0 w-full'), children: _jsx("div", { className: "w-full max-w-[2000px] mx-auto px-4 py-6", children: _jsx("div", { className: "bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 md:p-6", children: _jsx(Outlet, {}) }) }) })] }));
};
export default AdminLayout;
//# sourceMappingURL=AdminLayout.js.map