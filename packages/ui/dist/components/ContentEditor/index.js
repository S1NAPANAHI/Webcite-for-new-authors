import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback } from 'react';
import { X, Save } from 'lucide-react';
// Helper function to generate a URL-friendly slug from a string
const generateSlug = (str) => {
    if (!str)
        return '';
    return str
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '');
};
export function ContentEditor({ item, contentType, onSave, onCancel }) {
    const [formData, setFormData] = useState(getInitialFormData());
    const [errors, setErrors] = useState({});
    // Get initial form data based on content type
    function getInitialFormData() {
        if (item) {
            // If we have an existing item, use its values
            const { id, created_at, updated_at, created_by, ...rest } = item;
            return rest;
        }
        // Default values based on content type
        switch (contentType) {
            case 'posts':
            case 'pages':
                return {
                    status: 'draft',
                    title: '',
                    content: undefined,
                    slug: '',
                    author_id: undefined,
                    excerpt: undefined,
                    featured_image: undefined,
                    tags: [],
                    category_id: undefined,
                };
            case 'storeItems':
                return {
                    status: 'active', // Default status for storeItems
                    name: '',
                    description: '',
                    price: 0,
                    category: 'digital',
                    image_url: undefined,
                    stock_quantity: 0,
                    sku: undefined,
                };
            case 'libraryItems':
                return {
                    status: 'draft',
                    title: '',
                    description: '',
                    file_url: '',
                    file_type: undefined,
                    file_size: 0,
                    category: 'tutorial',
                    thumbnail_url: undefined,
                };
            case 'characters':
                return {
                    status: 'draft',
                    name: '',
                    description: '',
                    role: '',
                    backstory: '',
                    image_url: undefined,
                    birth_date: undefined,
                    death_date: null,
                    species: undefined,
                    occupation: undefined,
                    relationships: undefined,
                };
            case 'timelineEvents': // Add this case
                return {
                    status: 'draft',
                    title: '',
                    date: '',
                    era: 'ancient',
                    description: '',
                    is_published: false,
                };
            case 'betaUsers': // Add this case
                return {
                    status: 'pending',
                    name: '',
                    email: '',
                    message: ''
                };
            default:
                throw new Error(`Unsupported content type: ${contentType}`);
        }
    }
    // Reset form when item or content type changes
    useEffect(() => {
        setFormData(getInitialFormData());
        setErrors({});
    }, [contentType, item]);
    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave({
                ...(item || {}),
                ...formData,
                updated_at: new Date().toISOString(),
                status: formData.status || 'draft'
            });
        }
    };
    // Validate form fields
    const validateForm = () => {
        const newErrors = {};
        // Common validations
        if ('title' in formData && !formData.title) {
            newErrors.title = 'Title is required';
        }
        if ('content' in formData && !formData.content) {
            newErrors.content = 'Content is required';
        }
        // Type-specific validations
        if (contentType === 'storeItems') {
            const storeItem = formData;
            if (storeItem.price < 0) {
                newErrors.price = 'Price cannot be negative';
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    // Handle text input changes
    const handleTextChange = useCallback((field) => (e) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Auto-generate slug when title changes
        if (field === 'title' && 'slug' in formData) {
            setFormData(prev => ({
                ...prev,
                slug: generateSlug(value)
            }));
        }
        // Clear error when field is updated
        if (errors[field]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    }, [errors, formData]);
    // Handle number input changes
    const handleNumberChange = useCallback((field) => (e) => {
        const value = parseFloat(e.target.value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        // Clear error when field is updated
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    }, [errors]);
    // Handle select changes
    const handleSelectChange = useCallback((field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    }, []);
    // Render form fields based on content type
    const renderFields = () => {
        switch (contentType) {
            case 'posts':
            case 'pages':
                return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Title" }), _jsx("input", { type: "text", value: formData.title || '', onChange: handleTextChange('title'), className: "w-full p-2 border rounded" }), errors.title && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.title })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Slug" }), _jsx("input", { type: "text", value: formData.slug || '', onChange: handleTextChange('slug'), className: "w-full p-2 border rounded" })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Excerpt" }), _jsx("textarea", { value: formData.excerpt || '', onChange: handleTextChange('excerpt'), className: "w-full p-2 border rounded h-24" })] })] }));
            case 'storeItems':
                return (_jsxs(_Fragment, { children: [_jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Name" }), _jsx("input", { type: "text", value: formData.name || '', onChange: handleTextChange('name'), className: "w-full p-2 border rounded" }), errors.name && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.name })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium mb-1", children: "Price" }), _jsx("input", { type: "number", step: "0.01", value: formData.price || 0, onChange: handleNumberChange('price'), className: "w-full p-2 border rounded" }), errors.price && _jsx("p", { className: "text-red-500 text-sm mt-1", children: errors.price })] })] }));
            // Add more cases for other content types
            default:
                return null;
        }
    };
    return (_jsxs("div", { className: "bg-white rounded-lg shadow p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("h2", { className: "text-xl font-semibold", children: [item ? 'Edit' : 'Create', " ", contentType] }), _jsx("button", { onClick: onCancel, className: "text-gray-500 hover:text-gray-700", children: _jsx(X, { size: 20 }) })] }), _jsxs("form", { onSubmit: handleSubmit, children: [renderFields(), _jsxs("div", { className: "mt-6 flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: onCancel, className: "px-4 py-2 border rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50", children: "Cancel" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700", children: _jsxs("span", { className: "flex items-center", children: [_jsx(Save, { size: 16, className: "mr-2" }), item ? 'Update' : 'Save'] }) })] })] })] }));
}
export default ContentEditor;
//# sourceMappingURL=index.js.map