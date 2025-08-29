import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { Button } from './button';
import { ProductForm } from './ProductForm';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
export const ProductManager = () => {
    const [products, setProducts] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const fetchProducts = async () => {
        setIsLoading(true);
        try {
            const response = await fetch('/api/products');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setProducts(data.products);
            toast.success('Products loaded successfully');
        }
        catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        }
        finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchProducts();
    }, []);
    const handleSave = async (productData) => {
        setIsSubmitting(true);
        try {
            let response;
            if (editingProduct) {
                response = await fetch(`/api/products/${editingProduct.id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...productData,
                        active: productData.active ?? true,
                    }),
                });
            }
            else {
                response = await fetch('/api/products', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        ...productData,
                        active: productData.active ?? true,
                    }),
                });
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to save product');
            }
            const result = await response.json();
            toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
            setIsFormOpen(false);
            setEditingProduct(null);
            await fetchProducts();
        }
        catch (error) {
            console.error('Error saving product:', error);
            toast.error((error instanceof Error ? error.message : String(error)) || 'Failed to save product');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to archive this product?'))
            return;
        try {
            const response = await fetch(`/api/products/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to delete product');
            }
            toast.success('Product archived successfully');
            await fetchProducts();
        }
        catch (error) {
            console.error('Error deleting product:', error);
            toast.error((error instanceof Error ? error.message : String(error)) || 'Failed to archive product');
        }
    };
    const handleEdit = (product) => {
        setEditingProduct(product);
        setIsFormOpen(true);
    };
    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingProduct(null);
    };
    if (isLoading) {
        return (_jsxs("div", { className: "flex items-center justify-center p-8", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin text-primary" }), _jsx("span", { className: "ml-2", children: "Loading products..." })] }));
    }
    return (_jsxs("div", { className: "p-6", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold tracking-tight", children: "Products" }), _jsxs("p", { className: "text-muted-foreground", children: [products.length, " product", products.length !== 1 ? 's' : '', " in your store"] })] }), _jsxs(Dialog, { open: isFormOpen, onOpenChange: handleCloseForm, children: [_jsx(DialogTrigger, { asChild: true, children: _jsxs(Button, { onClick: () => setIsFormOpen(true), children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), "Add Product"] }) }), _jsxs(DialogContent, { className: "sm:max-w-[700px]", children: [_jsx(DialogHeader, { children: _jsx(DialogTitle, { children: editingProduct ? 'Edit Product' : 'Create New Product' }) }), _jsx(ProductForm, { product: editingProduct, onSave: handleSave, onCancel: handleCloseForm, isSubmitting: isSubmitting })] })] })] }), _jsx("div", { className: "rounded-md border", children: _jsxs(Table, { children: [_jsx(TableHeader, { children: _jsxs(TableRow, { children: [_jsx(TableHead, { className: "w-[300px]", children: "Name" }), _jsx(TableHead, { children: "Type" }), _jsx(TableHead, { children: "Status" }), _jsx(TableHead, { children: "Created" }), _jsx(TableHead, { className: "text-right", children: "Actions" })] }) }), _jsx(TableBody, { children: products.length === 0 ? (_jsx(TableRow, { children: _jsx(TableCell, { colSpan: 5, className: "h-24 text-center", children: "No products found." }) })) : (products.map((product) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { className: "font-medium", children: [_jsx("div", { className: "font-medium", children: product.name }), _jsx("div", { className: "text-sm text-muted-foreground line-clamp-2", children: product.description || 'No description' })] }), _jsx(TableCell, { children: _jsx("span", { className: "inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground capitalize", children: product.product_type?.replace('_', ' ') }) }), _jsx(TableCell, { children: _jsxs("div", { className: "flex items-center", children: [_jsx("div", { className: `h-2.5 w-2.5 rounded-full mr-2 ${product.active ? 'bg-green-500' : 'bg-gray-300'}` }), product.active ? 'Active' : 'Inactive'] }) }), _jsx(TableCell, { children: new Date(product.created_at).toLocaleDateString() }), _jsx(TableCell, { className: "text-right", children: _jsxs("div", { className: "flex justify-end space-x-2", children: [_jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleEdit(product), children: [_jsx(Pencil, { className: "h-4 w-4 mr-1" }), "Edit"] }), _jsxs(Button, { variant: "outline", size: "sm", onClick: () => handleDelete(product.id), className: "text-destructive hover:bg-destructive/10 hover:text-destructive", children: [_jsx(Trash2, { className: "h-4 w-4 mr-1" }), "Archive"] })] }) })] }, product.id)))) })] }) })] }));
};
