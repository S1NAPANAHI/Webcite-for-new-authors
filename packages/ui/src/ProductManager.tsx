import React, { useState, useEffect } from 'react';
import { Button } from './button';
import { ProductForm } from './ProductForm';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow
} from './table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './dialog';
import { toast } from 'sonner';
import { Loader2, Plus, Pencil, Trash2 } from 'lucide-react';
import type { Product } from '@zoroaster/shared';

export const ProductManager: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSave = async (productData: Partial<Product>) => {
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
      } else {
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
        throw new Error((errorData as { message: string }).message || 'Failed to save product');
      }
      
      const result = await response.json();
      toast.success(editingProduct ? 'Product updated successfully' : 'Product created successfully');
      setIsFormOpen(false);
      setEditingProduct(null);
      await fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      toast.error((error instanceof Error ? error.message : String(error)) || 'Failed to save product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to archive this product?')) return;
    
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error((errorData as { message: string }).message || 'Failed to delete product');
      }
      
      toast.success('Product archived successfully');
      await fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error((error instanceof Error ? error.message : String(error)) || 'Failed to archive product');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Products</h2>
          <p className="text-muted-foreground">
            {products.length} product{products.length !== 1 ? 's' : ''} in your store
          </p>
        </div>
        <Dialog open={isFormOpen} onOpenChange={handleCloseForm}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsFormOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>{editingProduct ? 'Edit Product' : 'Create New Product'}</DialogTitle>
            </DialogHeader>
            <ProductForm 
              product={editingProduct} 
              onSave={handleSave} 
              onCancel={handleCloseForm} 
              isSubmitting={isSubmitting}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">
                    <div className="font-medium">{product.name}</div>
                    <div className="text-sm text-muted-foreground line-clamp-2">
                      {product.description || 'No description'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground capitalize">
                      {product.product_type?.replace('_', ' ')}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${product.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                      {product.active ? 'Active' : 'Inactive'}
                    </div>
                  </TableCell>
                  <TableCell>
                    {new Date(product.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleEdit(product)}
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => handleDelete(product.id)}
                        className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Archive
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
