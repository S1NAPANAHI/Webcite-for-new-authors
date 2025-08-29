import * as React from "react";
import { type VariantProps } from "class-variance-authority";
declare const tagVariants: (props?: ({
    variant?: "default" | "destructive" | "outline" | "secondary" | null | undefined;
} & import("class-variance-authority/types").ClassProp) | undefined) => string;
export interface TagProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof tagVariants> {
}
declare function Tag({ className, variant, ...props }: TagProps): import("react/jsx-runtime").JSX.Element;
export { Tag, tagVariants };
