import { jsx as _jsx } from "react/jsx-runtime";
import { cva } from "class-variance-authority";
import { cn } from '@zoroaster/shared/utils';
const tagVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
    variants: {
        variant: {
            default: "border-transparent bg-primary/10 text-primary hover:bg-primary/20",
            secondary: "border-transparent bg-secondary/10 text-secondary-foreground hover:bg-secondary/20",
            destructive: "border-transparent bg-destructive/10 text-destructive hover:bg-destructive/20",
            outline: "text-foreground",
        },
    },
    defaultVariants: {
        variant: "default",
    },
});
function Tag({ className, variant, ...props }) {
    return (_jsx("div", { className: cn(tagVariants({ variant }), className), ...props }));
}
export { Tag, tagVariants };
//# sourceMappingURL=tag.js.map