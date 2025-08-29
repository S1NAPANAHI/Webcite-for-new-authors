import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { cva } from "class-variance-authority";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "./lib/utils";
const alertVariants = cva("relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:h-4 [&>svg]:w-4", {
    variants: {
        variant: {
            default: "bg-background text-foreground",
            destructive: "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
            success: "border-emerald-500/50 text-emerald-600 dark:text-emerald-400 [&>svg]:text-emerald-600 dark:[&>svg]:text-emerald-400",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
const Alert = React.forwardRef(({ className, variant, ...props }, ref) => (_jsx("div", { ref: ref, role: "alert", className: cn(alertVariants({ variant }), className), ...props })));
Alert.displayName = "Alert";
const AlertTitle = React.forwardRef(({ className, ...props }, ref) => (_jsx("h5", { ref: ref, className: cn("mb-1 font-medium leading-none tracking-tight", className), ...props })));
AlertTitle.displayName = "AlertTitle";
const AlertDescription = React.forwardRef(({ className, ...props }, ref) => (_jsx("div", { ref: ref, className: cn("text-sm [&_p]:leading-relaxed", className), ...props })));
AlertDescription.displayName = "AlertDescription";
const AlertWithIcon = React.forwardRef(({ className, variant = "default", children, icon, ...props }, ref) => {
    const Icon = {
        default: Info,
        destructive: XCircle,
        success: CheckCircle2,
    }[variant] || AlertCircle;
    return (_jsxs(Alert, { ref: ref, variant: variant, className: cn("flex items-start gap-3", className), ...props, children: [icon || _jsx(Icon, { className: "h-4 w-4 flex-shrink-0 mt-0.5" }), _jsx("div", { children: React.Children.map(children, (child) => {
                    if (React.isValidElement(child) &&
                        (child.type === AlertTitle || child.type === AlertDescription)) {
                        return child;
                    }
                    return (_jsx(AlertDescription, { children: child }));
                }) })] }));
});
AlertWithIcon.displayName = "AlertWithIcon";
export { Alert, AlertTitle, AlertDescription, AlertWithIcon };
