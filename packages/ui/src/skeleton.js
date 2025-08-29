import { jsx as _jsx } from "react/jsx-runtime";
export function Skeleton({ className, ...props }) {
    return (_jsx("div", { className: `animate-pulse bg-gray-200 dark:bg-gray-700 rounded-md ${className || ''}`, ...props }));
}
