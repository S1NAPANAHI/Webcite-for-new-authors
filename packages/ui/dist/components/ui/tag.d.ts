import { VariantProps } from 'class-variance-authority';
import * as React from "react";
declare const tagVariants: (props?: {
    variant?: "default" | "destructive" | "outline" | "secondary";
} & import('class-variance-authority/types').ClassProp) => string;
export interface TagProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
}
declare function Tag({ className, variant, ...props }: TagProps): import("react/jsx-runtime").JSX.Element;
export { Tag, tagVariants };
//# sourceMappingURL=tag.d.ts.map