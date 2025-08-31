import { VariantProps } from 'class-variance-authority';
import * as React from "react";
declare const Alert: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLDivElement> & VariantProps<(props?: ({
    variant?: "default" | "destructive" | "success" | null | undefined;
} & import('class-variance-authority/types').ClassProp) | undefined) => string> & React.RefAttributes<HTMLDivElement>>;
declare const AlertTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLParagraphElement>>;
declare const AlertDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>;
interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: "default" | "destructive" | "success";
    icon?: React.ReactNode;
}
declare const AlertWithIcon: React.ForwardRefExoticComponent<AlertProps & React.RefAttributes<HTMLDivElement>>;
export { Alert, AlertTitle, AlertDescription, AlertWithIcon };
//# sourceMappingURL=alert.d.ts.map