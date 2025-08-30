import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Link } from 'react-router-dom';
const HomePage = () => {
    return (_jsxs("div", { className: "p-4", children: [_jsx("h1", { className: "text-2xl", children: "Welcome to the Zoroasterverse" }), _jsxs("nav", { className: "mt-4", children: [_jsx(Link, { to: "/login", className: "mr-4", children: "Login" }), _jsx(Link, { to: "/admin", children: "Admin" })] })] }));
};
export default HomePage;
//# sourceMappingURL=HomePage.js.map