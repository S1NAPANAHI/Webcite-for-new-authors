import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { supabase } from '@zoroaster/shared/supabaseClient';
import styles from './Navbar.module.css';
import ThemeToggle from './components/ui/ThemeToggle';
import { Search } from 'lucide-react'; // Import Search icon
export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false); // Keep for mobile menu if needed
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [betaApplicationStatus, setBetaApplicationStatus] = useState('none');
    const navigate = useNavigate();
    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setIsAuthenticated(!!session);
            if (session?.user?.user_metadata?.betaApplicationStatus) {
                setBetaApplicationStatus(session.user.user_metadata.betaApplicationStatus);
            }
        };
        getSession();
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setIsAuthenticated(!!session);
            if (session?.user?.user_metadata?.betaApplicationStatus) {
                setBetaApplicationStatus(session.user.user_metadata.betaApplicationStatus);
            }
        });
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);
    const handleLogout = async () => {
        await supabase.auth.signOut();
        navigate('/');
    };
    // New structured navigation links
    const navLinks = [
        { name: 'Home', path: '/' },
        {
            name: 'Explore', // New parent link
            path: '#', // Placeholder path for parent dropdown
            children: [
                // Removed Store and Subscriptions
                { name: 'Library', path: '/library' },
                { name: 'Wiki', path: '/wiki' },
                { name: 'Timelines', path: '/timelines' },
                { name: 'Characters', path: '/characters' },
                { name: 'Blog', path: '/blog' },
            ]
        },
        { name: 'Beta Program', path: '/beta/application' }, // Top-level
    ];
    // Add account/login links as a dropdown if authenticated, or top-level if not
    if (isAuthenticated) {
        const accountChildren = [];
        // Add Store and Subscriptions here
        accountChildren.push({ name: 'Store', path: '/store' });
        accountChildren.push({ name: 'Subscriptions', path: '/subscriptions' });
        if (betaApplicationStatus === 'accepted') {
            accountChildren.push({ name: 'Beta Portal', path: '/beta/portal' });
        }
        accountChildren.push({ name: 'My Account', path: '/account' });
        navLinks.push({ name: 'Account', path: '#', children: accountChildren });
        navLinks.push({ name: 'Logout', path: '#', onClick: handleLogout }); // Logout as a top-level action
    }
    else {
        navLinks.push({ name: 'Login', path: '/login' });
    }
    return (_jsxs("header", { className: styles.zoroHeader, children: [_jsx("div", { className: styles.logo, children: _jsx(NavLink, { to: "/", children: _jsx("h1", { children: "Zoroasterverse" }) }) }), _jsxs("div", { className: styles.headerControls, children: [" ", _jsxs("form", { className: styles.searchForm, children: [_jsx("input", { type: "text", placeholder: "Search..." }), _jsxs("button", { type: "submit", children: [_jsx(Search, {}), " "] })] }), _jsx(ThemeToggle, {}), " "] }), _jsx("nav", { className: styles.navbar, children: _jsx("ul", { className: styles.navMenu, children: navLinks.map(link => (_jsxs("li", { className: link.children ? styles.dropdown : '', children: [link.onClick ? (_jsx("button", { onClick: link.onClick, className: styles.navLink, children: link.name })) : (_jsxs(NavLink, { to: link.path, className: styles.navLink, children: [link.name, " ", link.children ? '▾' : ''] })), link.children && (_jsx("ul", { className: styles.dropdownMenu, children: link.children.map(childLink => (_jsx("li", { children: _jsx(NavLink, { to: childLink.path, className: styles.dropdownMenuItem, children: childLink.name }) }, childLink.name))) }))] }, link.name))) }) })] }));
};
//# sourceMappingURL=Navbar.js.map