import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from '../../button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '../../alert-dialog';
export function ConfirmDialog({ open, onOpenChange, onConfirm, title, description, confirmText = 'Confirm', cancelText = 'Cancel', }) {
    return (_jsx(AlertDialog, { open: open, onOpenChange: onOpenChange, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: title }), _jsx(AlertDialogDescription, { children: description })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { children: cancelText }), _jsx(AlertDialogAction, { asChild: true, children: _jsx(Button, { variant: "destructive", onClick: onConfirm, children: confirmText }) })] })] }) }));
}
