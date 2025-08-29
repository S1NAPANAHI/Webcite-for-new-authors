import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from './button';
import { Input } from './input';
import { Label } from './label';
import { Textarea } from './textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
import { Switch } from './switch';
import { Loader2, X, Plus, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './alert';
// Define validation schema
const productSchema = z.object({
    name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    description: z.string().max(500, 'Description is too long').optional(),
    product_type: z.enum(['single_issue', 'bundle', 'chapter_pass', 'arc_pass']),
    active: z.boolean(),
    work_id: z.string().nullable().optional(),
    content_grants: z.array(z.object({
        type: z.enum(['work', 'chapter']),
        id: z.string().min(1, 'Content ID is required'),
    })),
});
export const ProductForm = ({ product, onSave, onCancel, isSubmitting = false }) => {
    const [works, setWorks] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { control, register, handleSubmit, reset, watch, setValue, formState: { errors }, } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            product_type: product?.product_type || 'single_issue',
            active: product?.active ?? true,
            work_id: product?.work_id || null,
            content_grants: Array.isArray(product?.content_grants)
                ? product.content_grants
                : [],
        },
    });
    const productType = watch('product_type');
    useEffect(() => {
        const fetchWorks = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/content/works');
                if (!response.ok) {
                    throw new Error(`Failed to fetch works: ${response.statusText}`);
                }
                const data = await response.json();
                setWorks(data.works || []);
            }
            catch (err) {
                console.error('Error fetching works:', err);
                setError('Failed to load content. Please try again later.');
            }
            finally {
                setIsLoading(false);
            }
        };
        fetchWorks();
    }, []);
    const onSubmit = (data) => {
        // Transform data to match the expected API format
        const submitData = {
            ...data,
            // Ensure work_id is null if empty string
            work_id: data.work_id || null,
        };
        onSave(submitData);
    };
    const handleAddContentGrant = () => {
        const currentGrants = watch('content_grants') || [];
        setValue('content_grants', [...currentGrants, { type: 'work', id: '' }], { shouldValidate: true });
    };
    const handleRemoveContentGrant = (index) => {
        const currentGrants = watch('content_grants') || [];
        const newGrants = currentGrants.filter((_, i) => i !== index);
        setValue('content_grants', newGrants, { shouldValidate: true });
    };
    const handleContentGrantChange = (index, field, value) => {
        const currentGrants = watch('content_grants') || [];
        const updatedGrants = [...currentGrants];
        updatedGrants[index] = {
            ...updatedGrants[index],
            [field]: field === 'type' ? value : value
        };
        setValue('content_grants', updatedGrants, { shouldValidate: true });
    };
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center justify-center p-8", children: [_jsx(Loader2, { className: "h-6 w-6 animate-spin text-primary mr-2" }), _jsx("span", { children: "Loading form..." })] }));
    }
    return (_jsxs("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-6", children: [error && (_jsxs(Alert, { variant: "destructive", children: [_jsx(AlertCircle, { className: "h-4 w-4" }), _jsx(AlertTitle, { children: "Error" }), _jsx(AlertDescription, { children: error })] })), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Product Name *" }), _jsx(Input, { id: "name", placeholder: "e.g., Issue #1, Premium Bundle", ...register('name'), className: errors.name ? 'border-destructive' : '' }), errors.name && (_jsx("p", { className: "text-sm font-medium text-destructive", children: errors.name.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", placeholder: "A brief description of the product...", rows: 3, ...register('description'), className: errors.description ? 'border-destructive' : '' }), errors.description && (_jsx("p", { className: "text-sm font-medium text-destructive", children: errors.description.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "product_type", children: "Product Type *" }), _jsx(Controller, { name: "product_type", control: control, render: ({ field }) => (_jsxs(Select, { onValueChange: field.onChange, value: field.value, children: [_jsx(SelectTrigger, { className: "w-full", children: _jsx(SelectValue, { placeholder: "Select a product type" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "single_issue", children: "Single Issue" }), _jsx(SelectItem, { value: "bundle", children: "Bundle" }), _jsx(SelectItem, { value: "chapter_pass", children: "Chapter Pass" }), _jsx(SelectItem, { value: "arc_pass", children: "Arc Pass" })] })] })) }), errors.product_type && (_jsx("p", { className: "text-sm font-medium text-destructive", children: errors.product_type.message }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Controller, { name: "active", control: control, render: ({ field }) => (_jsx(Switch, { id: "active", checked: field.value, onCheckedChange: field.onChange })) }), _jsx(Label, { htmlFor: "active", children: "Active" })] }), productType === 'single_issue' && (_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "work_id", children: "Associated Work (Issue/Book)" }), _jsx(Controller, { name: "work_id", control: control, render: ({ field }) => (_jsxs(Select, { onValueChange: field.onChange, value: field.value || '', children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: "Select an associated work" }) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "", children: "None" }), works.map((work) => (_jsxs(SelectItem, { value: work.id, children: [work.title, " (", work.type, ")"] }, work.id)))] })] })) }), errors.work_id && (_jsx("p", { className: "text-sm font-medium text-destructive", children: errors.work_id.message }))] })), (productType === 'bundle' || productType === 'chapter_pass' || productType === 'arc_pass') && (_jsxs("div", { className: "space-y-3", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { children: "Content Grants" }), _jsxs(Button, { type: "button", variant: "outline", size: "sm", onClick: handleAddContentGrant, className: "text-sm", children: [_jsx(Plus, { className: "h-3.5 w-3.5 mr-1.5" }), "Add Grant"] })] }), _jsxs("div", { className: "space-y-3", children: [watch('content_grants')?.map((grant, index) => (_jsxs("div", { className: "flex items-start gap-2", children: [_jsxs("div", { className: "grid grid-cols-2 gap-2 flex-1", children: [_jsx("div", { className: "space-y-1", children: _jsxs(Select, { value: grant.type, onValueChange: (value) => handleContentGrantChange(index, 'type', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, {}) }), _jsxs(SelectContent, { children: [_jsx(SelectItem, { value: "work", children: "Work" }), _jsx(SelectItem, { value: "chapter", children: "Chapter" })] })] }) }), _jsx("div", { className: "space-y-1", children: _jsxs(Select, { value: grant.id, onValueChange: (value) => handleContentGrantChange(index, 'id', value), children: [_jsx(SelectTrigger, { children: _jsx(SelectValue, { placeholder: `Select ${grant.type}...` }) }), _jsxs(SelectContent, { children: [works
                                                                    .filter(work => grant.type === 'work' || work.type === grant.type)
                                                                    .map((work) => (_jsxs(SelectItem, { value: work.id, children: [work.title, " (", work.type, ")"] }, work.id))), works.length === 0 && (_jsxs("div", { className: "p-2 text-sm text-muted-foreground", children: ["No ", grant.type, "s found"] }))] })] }) })] }), _jsxs(Button, { type: "button", variant: "ghost", size: "icon", className: "h-10 w-10 text-destructive hover:bg-destructive/10", onClick: () => handleRemoveContentGrant(index), children: [_jsx(X, { className: "h-4 w-4" }), _jsx("span", { className: "sr-only", children: "Remove" })] })] }, index))), watch('content_grants')?.length === 0 && (_jsx("div", { className: "rounded-md border border-dashed p-4 text-center", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "No content grants added yet. Click \"Add Grant\" to get started." }) }))] }), errors.content_grants && (_jsx("p", { className: "text-sm font-medium text-destructive", children: errors.content_grants.message || 'Please check the content grants' }))] })), _jsxs("div", { className: "flex justify-end space-x-3 pt-4 border-t", children: [_jsx(Button, { type: "button", variant: "outline", onClick: onCancel, disabled: isSubmitting, children: "Cancel" }), _jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), product ? 'Updating...' : 'Creating...'] })) : (_jsx(_Fragment, { children: product ? 'Update Product' : 'Create Product' })) })] })] }));
};
