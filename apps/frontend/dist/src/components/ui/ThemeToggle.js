import { jsx as _jsx } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        // Initialize theme from localStorage or default to 'dark'
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'dark';
        }
        return 'dark';
    });
    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        }
        else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };
    return (_jsx("button", { onClick: toggleTheme, className: "p-2 rounded-md bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200", children: theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode' }));
};
export default ThemeToggle;
//# sourceMappingURL=ThemeToggle.js.map