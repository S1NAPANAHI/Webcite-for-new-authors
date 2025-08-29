import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
export const NotFoundPage = () => {
    return (_jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-4xl font-bold", children: "404 - Not Found" }), _jsx("p", { className: "mt-4", children: "Sorry, the page you are looking for does not exist." }), _jsx(Link, { to: "/", className: "mt-6 inline-block bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600", children: "Go to Home" })] }));
};
