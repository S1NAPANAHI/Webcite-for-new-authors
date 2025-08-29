import type { LucideIcon } from "lucide-react";
interface GlowButtonProps {
    children: React.ReactNode;
    icon?: LucideIcon;
    variant?: "primary" | "secondary";
    className?: string;
    onClick: () => void;
    type?: "button" | "submit" | "reset";
    disabled?: boolean;
}
declare const GlowButton: ({ children, icon: Icon, variant, className, onClick, type }: GlowButtonProps) => import("react/jsx-runtime").JSX.Element;
export { GlowButton };
