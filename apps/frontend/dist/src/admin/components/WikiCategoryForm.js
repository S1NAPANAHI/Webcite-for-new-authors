import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Button } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Label } from '@zoroaster/ui';
import { Textarea } from '@zoroaster/ui';
import { Loader2 } from 'lucide-react';
import { useToast } from '@zoroaster/ui';
import { createCategory } from '@zoroaster/shared';
const WikiCategoryForm = ({ onSuccess, onCancel, initialData, }) => {
    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        description: initialData?.description || '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const { toast } = useToast();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: '',
            }));
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = 'Category name is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setIsSubmitting(true);
            // In a real app, you would get the user ID from your auth context
            const newCategory = await createCategory({
                ...formData,
                user_id: 'current-user-id', // Replace with actual user ID from auth context
            });
            onSuccess(newCategory);
            toast({
                title: 'Success',
                description: 'Category created successfully',
            });
        }
        catch (error) {
            console.error('Error creating category:', error);
            toast({
                title: 'Error',
                description: 'Failed to create category. Please try again.',
                variant: 'destructive',
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    return (_jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Name *" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleChange, placeholder: "Category name", className: errors.name ? 'border-destructive' : '', disabled: isSubmitting }), errors.name && (_jsx("p", { className: "text-sm text-destructive", children: errors.name }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleChange, placeholder: "Optional description for this category", rows: 3, disabled: isSubmitting })] }), _jsxs("div", { className: "flex justify-end space-x-2 pt-4", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, disabled: isSubmitting, children: "Cancel" }), _jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Creating..."] })) : ('Create Category') })] })] }));
};
export default WikiCategoryForm;
//# sourceMappingURL=WikiCategoryForm.js.map