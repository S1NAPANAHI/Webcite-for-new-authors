import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
export const Layout = () => {
    return (_jsxs("div", { className: "zr-root", children: [_jsx(Navbar, {}), _jsx("main", { children: _jsx(Outlet, {}) }), _jsx(Footer, {})] }));
};
