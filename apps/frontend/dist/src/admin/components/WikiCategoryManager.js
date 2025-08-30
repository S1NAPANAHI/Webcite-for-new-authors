import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@zoroaster/shared';
import { Button } from '@zoroaster/ui';
import { Input } from '@zoroaster/ui';
import { Label } from '@zoroaster/ui';
import { Textarea } from '@zoroaster/ui';
import { Badge } from '@zoroaster/ui';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@zoroaster/ui';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from '@zoroaster/ui';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, } from '@zoroaster/ui';
import { Plus, Pencil, Trash2, Loader2 } from 'lucide-react';
import { useToast } from '@zoroaster/ui';
export const WikiCategoryManager = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [formErrors, setFormErrors] = useState({});
    const { toast } = useToast();
    const navigate = useNavigate();
    // Load categories on component mount
    useEffect(() => {
        loadCategories();
    }, []);
    const loadCategories = async () => {
        try {
            setLoading(true);
            const data = await fetchCategories();
            setCategories(data);
        }
        catch (error) {
            console.error('Error loading categories:', error);
            toast({
                title: 'Error',
                description: 'Failed to load categories. Please try again.',
                variant: 'destructive',
            });
        }
        finally {
            setLoading(false);
        }
    };
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user types
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };
    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) {
            errors.name = 'Category name is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        try {
            setIsSubmitting(true);
            if (currentCategory?.id) {
                // Update existing category
                const updatedCategory = await updateCategory(currentCategory.id, {
                    name: formData.name,
                    description: formData.description || null,
                });
                setCategories(categories.map(cat => cat.id === updatedCategory.id ? updatedCategory : cat));
                toast({
                    title: 'Success',
                    description: 'Category updated successfully',
                });
            }
            else {
                // Create new category
                const newCategory = await createCategory({
                    name: formData.name,
                    description: formData.description || null,
                    user_id: 'current-user-id', // This should be replaced with actual user ID from auth context
                });
                setCategories([...categories, newCategory]);
                toast({
                    title: 'Success',
                    description: 'Category created successfully',
                });
            }
            // Reset form and close dialog
            handleDialogClose();
        }
        catch (error) {
            console.error('Error saving category:', error);
            toast({
                title: 'Error',
                description: `Failed to ${currentCategory?.id ? 'update' : 'create'} category. Please try again.`,
                variant: 'destructive',
            });
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async () => {
        if (!currentCategory?.id)
            return;
        try {
            setIsDeleting(true);
            await deleteCategory(currentCategory.id);
            setCategories(categories.filter(cat => cat.id !== currentCategory.id));
            toast({
                title: 'Success',
                description: 'Category deleted successfully',
            });
            setIsDeleteDialogOpen(false);
            setCurrentCategory(null);
        }
        catch (error) {
            console.error('Error deleting category:', error);
            toast({
                title: 'Error',
                description: 'Failed to delete category. It may be in use by wiki pages.',
                variant: 'destructive',
            });
        }
        finally {
            setIsDeleting(false);
        }
    };
    const handleEdit = (category) => {
        setCurrentCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
        });
        setIsDialogOpen(true);
    };
    const handleAddNew = () => {
        setCurrentCategory(null);
        setFormData({
            name: '',
            description: '',
        });
        setFormErrors({});
        setIsDialogOpen(true);
    };
    const handleDialogClose = () => {
        setIsDialogOpen(false);
        setCurrentCategory(null);
        setFormData({
            name: '',
            description: '',
        });
        setFormErrors({});
    };
    const handleDeleteClick = (category) => {
        setCurrentCategory(category);
        setIsDeleteDialogOpen(true);
    };
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", children: "Wiki Categories" }), _jsx("p", { className: "text-muted-foreground", children: "Manage categories for organizing wiki content" })] }), _jsxs(Button, { onClick: handleAddNew, children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add Category"] })] }), _jsx("div", { className: "rounded-md border", children: loading ? (_jsx("div", { className: "flex justify-center p-8", children: _jsx(Loader2, { className: "h-6 w-6 animate-spin" }) })) : categories.length === 0 ? (_jsx("div", { className: "text-center p-8", children: _jsx("p", { className: "text-muted-foreground", children: "No categories found. Create your first category to get started." }) })) : (_jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { children: "Name" }), _jsx(TableHead, { children: "Description" }), _jsx(TableHead, { children: "Pages" }), _jsx(TableHead, { className: "w-[100px]", children: "Actions" })] }) }), _jsx(TableBody, { children: categories.map((category) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "font-medium", children: category.name }), _jsx(TableCell, { className: "text-muted-foreground", children: category.description || 'No description' }), _jsx(TableCell, { children: _jsxs(Badge, { variant: "outline", children: [category.page_count || 0, " pages"] }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex space-x-2", children: [_jsx(Button, { variant: "ghost", size: "icon", onClick: () => handleEdit(category), children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx(Button, { variant: "ghost", size: "icon", className: "text-destructive hover:text-destructive", onClick: () => handleDeleteClick(category), children: _jsx(Trash2, { className: "h-4 w-4" }) })] }) })] }, category.id))) })] })) }), _jsx(Dialog, { open: isDialogOpen, onOpenChange: setIsDialogOpen, children: _jsxs(DialogContent, { className: "sm:max-w-[500px]", children: [_jsxs(DialogHeader, { children: [_jsx(DialogTitle, { children: currentCategory?.id ? 'Edit Category' : 'Add New Category' }), _jsx(DialogDescription, { children: currentCategory?.id
                                        ? 'Update the category details below.'
                                        : 'Fill in the details to create a new category.' })] }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid gap-4 py-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "name", children: "Name *" }), _jsx(Input, { id: "name", name: "name", value: formData.name, onChange: handleInputChange, placeholder: "Category name", className: formErrors.name ? 'border-destructive' : '' }), formErrors.name && (_jsx("p", { className: "text-sm text-destructive", children: formErrors.name }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "description", children: "Description" }), _jsx(Textarea, { id: "description", name: "description", value: formData.description, onChange: handleInputChange, placeholder: "Optional description for this category", rows: 3 })] })] }), _jsxs(DialogFooter, { children: [_jsx(Button, { type: "button", variant: "outline", onClick: handleDialogClose, disabled: isSubmitting, children: "Cancel" }), _jsx(Button, { type: "submit", disabled: isSubmitting, children: isSubmitting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), currentCategory?.id ? 'Updating...' : 'Creating...'] })) : (_jsxs(_Fragment, { children: [currentCategory?.id ? 'Update' : 'Create', " Category"] })) })] })] })] }) }), _jsx(AlertDialog, { open: isDeleteDialogOpen, onOpenChange: setIsDeleteDialogOpen, children: _jsxs(AlertDialogContent, { children: [_jsxs(AlertDialogHeader, { children: [_jsx(AlertDialogTitle, { children: "Are you sure?" }), _jsxs(AlertDialogDescription, { children: ["This will permanently delete the category \"", currentCategory?.name, "\".", currentCategory?.page_count ? ` This category contains ${currentCategory.page_count} page(s). ` : ' ', "This action cannot be undone."] })] }), _jsxs(AlertDialogFooter, { children: [_jsx(AlertDialogCancel, { disabled: isDeleting, children: "Cancel" }), _jsx(AlertDialogAction, { onClick: handleDelete, className: "bg-destructive text-destructive-foreground hover:bg-destructive/90", disabled: isDeleting, children: isDeleting ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), "Deleting..."] })) : ('Delete Category') })] })] }) })] }));
};
export default WikiCategoryManager;
//# sourceMappingURL=WikiCategoryManager.js.map