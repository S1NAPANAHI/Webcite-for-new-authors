import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ChevronRight } from "lucide-react";
const GlowButton = ({ children, icon: Icon, variant = "primary", className = "", onClick, type = "button" }) => {
    const baseClasses = "group relative inline-flex items-center gap-3 rounded-2xl px-8 py-4 font-semibold tracking-wide transition-all duration-300 transform";
    const variants = {
        primary: "border border-amber-600/60 bg-gradient-to-r from-amber-600/20 to-orange-600/20 text-amber-100 shadow-[0_0_30px_rgba(251,191,36,0.15)] hover:shadow-[0_0_50px_rgba(251,191,36,0.3)] hover:-translate-y-1",
        secondary: "border border-slate-600/60 bg-gradient-to-r from-slate-800/80 to-slate-900/80 text-slate-200 shadow-[0_0_20px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(251,191,36,0.2)] hover:border-amber-600/40 hover:-translate-y-1"
    };
    return (_jsxs("button", { className: `${baseClasses} ${variants[variant]} ${className}`, onClick: onClick, type: type, children: [Icon && _jsx(Icon, { className: "w-5 h-5" }), _jsx("span", { className: "relative z-10", children: children }), _jsx(ChevronRight, { className: "w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" }), _jsx("div", { className: "absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-600/10 via-orange-600/10 to-amber-600/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl" })] }));
};
export default GlowButton;
//# sourceMappingURL=GlowButton.js.map