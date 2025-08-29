import { toast as hotToast } from 'react-hot-toast';
export function useToast() {
    const toast = ({ title, description, variant }) => {
        if (variant === 'destructive') {
            hotToast.error(title, {
                id: title, // Use title as ID to prevent duplicate toasts
                duration: 5000,
                style: {
                    background: '#fee2e2', // red-100
                    color: '#ef4444', // red-500
                    border: '1px solid #fca5a5', // red-300
                },
                iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fee2e2',
                },
            });
        }
        else {
            hotToast.success(title, {
                id: title,
                duration: 3000,
                style: {
                    background: '#dcfce7', // green-100
                    color: '#22c55e', // green-500
                    border: '1px solid #86efac', // green-300
                },
                iconTheme: {
                    primary: '#22c55e',
                    secondary: '#dcfce7',
                },
            });
        }
    };
    return { toast };
}
