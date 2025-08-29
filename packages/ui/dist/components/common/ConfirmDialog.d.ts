interface ConfirmDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}
export declare function ConfirmDialog({ open, onOpenChange, onConfirm, title, description, confirmText, cancelText, }: ConfirmDialogProps): import("react/jsx-runtime").JSX.Element;
export {};
