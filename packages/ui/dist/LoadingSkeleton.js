import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { cn } from './lib/utils';
const LoadingSkeleton = ({ count = 4, viewMode = 'grid', className }) => {
    const skeletons = Array.from({ length: count }, (_, index) => (_jsxs("div", { className: `${viewMode === 'grid'
            ? 'bg-background-light/30 backdrop-blur-sm rounded-2xl border border-border/30 overflow-hidden'
            : 'bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30'}`, children: [_jsx("div", { className: "h-64 bg-gradient-to-r from-border/20 to-border/40 skeleton" }), _jsxs("div", { className: "p-6", children: [_jsx("div", { className: "h-6 bg-border/20 rounded skeleton mb-3" }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsx("div", { className: "h-4 bg-border/20 rounded skeleton" }), _jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-3/4" }), _jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-1/2" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-24 mb-2" }), _jsxs("div", { className: "flex space-x-2", children: [_jsx("div", { className: "h-6 bg-border/20 rounded-full skeleton w-16" }), _jsx("div", { className: "h-6 bg-border/20 rounded-full skeleton w-20" })] })] }), _jsxs("div", { className: "mb-6", children: [_jsx("div", { className: "h-8 bg-border/20 rounded skeleton w-20 mb-2" }), _jsx("div", { className: "h-4 bg-border/20 rounded skeleton w-32" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { className: "h-12 bg-border/20 rounded-xl skeleton" }), _jsx("div", { className: "h-10 bg-border/20 rounded-xl skeleton" })] })] })] }, index)));
    return (_jsx("div", { className: cn(viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4', className), children: skeletons }));
};
export { LoadingSkeleton };
//# sourceMappingURL=LoadingSkeleton.js.map