import { jsx as _jsx } from "react/jsx-runtime";
import * as React from "react";
import { cn } from '@zoroaster/shared';
const variantClasses = {
    default: "bg-primary text-primary-foreground hover:bg-primary/80 border-transparent",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 border-transparent",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/80 border-transparent",
    outline: "text-foreground border border-input hover:bg-accent hover:text-accent-foreground",
    success: "bg-green-500 text-white hover:bg-green-600 border-transparent",
};
const Badge = React.forwardRef(({ className, variant = "default", ...props }, ref) => {
    return (_jsx("div", { ref: ref, className: cn("inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variantClasses[variant], className), ...props }));
});
Badge.displayName = "Badge";
export { Badge };
//# sourceMappingURL=badge.js.map