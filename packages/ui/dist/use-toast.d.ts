type ToastVariant = 'default' | 'destructive';
interface ToastProps {
    title: string;
    description?: string;
    variant?: ToastVariant;
}
export declare function useToast(): {
    toast: ({ title, description, variant }: ToastProps) => void;
};
export {};
//# sourceMappingURL=use-toast.d.ts.map