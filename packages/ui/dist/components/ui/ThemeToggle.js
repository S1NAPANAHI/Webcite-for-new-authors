import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import styles from '../../Navbar.module.css'; // Assuming Navbar.module.css is accessible
const STORAGE_KEY = 'zoro-theme';
const ThemeToggle = () => {
    const [theme, setTheme] = useState(() => {
        // Initial theme: stored value → system preference → default 'dark'
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem(STORAGE_KEY);
            const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return stored ?? (systemDark ? 'dark' : 'light');
        }
        return 'dark';
    });
    useEffect(() => {
        const root = window.document.documentElement;
        root.setAttribute('data-theme', theme); // This sets the data-theme attribute
        localStorage.setItem(STORAGE_KEY, theme);
        // This part applies the 'dark'/'light' classes, which is what the project's existing theming uses
        if (theme === 'dark') {
            root.classList.add('dark');
            root.classList.remove('light');
        }
        else {
            root.classList.add('light');
            root.classList.remove('dark');
        }
    }, [theme]);
    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
    };
    return (_jsxs("button", { id: "theme-toggle", className: styles.themeToggle, "aria-label": "Toggle dark mode", "aria-pressed": theme === 'dark' ? 'true' : 'false', title: theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode', onClick: toggleTheme, children: [_jsxs("svg", { className: `${styles.icon} ${styles.iconSun}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: [_jsx("circle", { cx: "12", cy: "12", r: "4", fill: "currentColor" }), _jsxs("g", { stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [_jsx("line", { x1: "12", y1: "2", x2: "12", y2: "5" }), _jsx("line", { x1: "12", y1: "19", x2: "12", y2: "22" }), _jsx("line", { x1: "2", y1: "12", x2: "5", y2: "12" }), _jsx("line", { x1: "19", y1: "12", x2: "22", y2: "12" }), _jsx("line", { x1: "4.2", y1: "4.2", x2: "6.3", y2: "6.3" }), _jsx("line", { x1: "17.7", y1: "17.7", x2: "19.8", y2: "19.8" }), _jsx("line", { x1: "4.2", y1: "19.8", x2: "6.3", y2: "17.7" }), _jsx("line", { x1: "17.7", y1: "6.3", x2: "19.8", y2: "4.2" })] })] }), _jsx("svg", { className: `${styles.icon} ${styles.iconMoon}`, viewBox: "0 0 24 24", width: "22", height: "22", "aria-hidden": "true", children: _jsx("path", { d: "M21 14.5a9 9 0 1 1-8.5-12\n                 a8 8 0 0 0 8.5 12z", fill: "currentColor" }) })] }));
};
export default ThemeToggle;
//# sourceMappingURL=ThemeToggle.js.map