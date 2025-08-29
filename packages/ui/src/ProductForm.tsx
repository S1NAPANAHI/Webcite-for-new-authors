import React, { useState, useEffect } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
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
import { toast } from 'sonner';
import type { Product } from '../../packages/shared/src/product.js';

// Define validation schema
const productSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().max(500, 'Description is too long').optional(),
  product_type: z.enum(['single_issue', 'bundle', 'chapter_pass', 'arc_pass']),
  active: z.boolean(),
  work_id: z.string().nullable().optional(),
  content_grants: z.array(
    z.object({
      type: z.enum(['work', 'chapter']),
      id: z.string().min(1, 'Content ID is required'),
    })
  ),
});

type ProductFormData = z.infer<typeof productSchema>;

interface ProductFormProps {
  product?: Product | null;
  onSave: (data: Partial<Product>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

interface Work {
  id: string;
  title: string;
  type: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  product, 
  onSave, 
  onCancel, 
  isSubmitting = false 
}) => {
  const [works, setWorks] = useState<Work[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: product?.name || '',
      description: product?.description || '',
      product_type: (product?.product_type as any) || 'single_issue',
      active: product?.active ?? true,
      work_id: product?.work_id || null,
      content_grants: Array.isArray(product?.content_grants)
        ? (product.content_grants as { type: "work" | "chapter"; id: string; }[])
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
      } catch (err) {
        console.error('Error fetching works:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorks();
  }, []);

  const onSubmit: SubmitHandler<ProductFormData> = (data) => {
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
    setValue('content_grants', [...currentGrants, { type: 'work' as const, id: '' }], { shouldValidate: true });
  };

  const handleRemoveContentGrant = (index: number) => {
    const currentGrants = watch('content_grants') || [];
    const newGrants = currentGrants.filter((_, i) => i !== index);
    setValue('content_grants', newGrants, { shouldValidate: true });
  };

  const handleContentGrantChange = (index: number, field: 'type' | 'id', value: string) => {
    const currentGrants = watch('content_grants') || [];
    const updatedGrants = [...currentGrants];
    updatedGrants[index] = {
      ...updatedGrants[index],
      [field]: field === 'type' ? value as 'work' | 'chapter' : value
    };
    setValue('content_grants', updatedGrants, { shouldValidate: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Loading form...</span>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Product Name *</Label>
        <Input 
          id="name" 
          placeholder="e.g., Issue #1, Premium Bundle"
          {...register('name')} 
          className={errors.name ? 'border-destructive' : ''}
        />
        {errors.name && (
          <p className="text-sm font-medium text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          placeholder="A brief description of the product..."
          rows={3}
          {...register('description')} 
          className={errors.description ? 'border-destructive' : ''}
        />
        {errors.description && (
          <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="product_type">Product Type *</Label>
        <Controller
          name="product_type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a product type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="single_issue">Single Issue</SelectItem>
                <SelectItem value="bundle">Bundle</SelectItem>
                <SelectItem value="chapter_pass">Chapter Pass</SelectItem>
                <SelectItem value="arc_pass">Arc Pass</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
        {errors.product_type && (
          <p className="text-sm font-medium text-destructive">{errors.product_type.message}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <Switch
              id="active"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="active">Active</Label>
      </div>

      {productType === 'single_issue' && (
        <div className="space-y-2">
          <Label htmlFor="work_id">Associated Work (Issue/Book)</Label>
          <Controller
            name="work_id"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an associated work" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  {works.map((work) => (
                    <SelectItem key={work.id} value={work.id}>
                      {work.title} ({work.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.work_id && (
            <p className="text-sm font-medium text-destructive">{errors.work_id.message}</p>
          )}
        </div>
      )}

      {(productType === 'bundle' || productType === 'chapter_pass' || productType === 'arc_pass') && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Content Grants</Label>
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={handleAddContentGrant}
              className="text-sm"
            >
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add Grant
            </Button>
          </div>
          
          <div className="space-y-3">
            {watch('content_grants')?.map((grant, index) => (
              <div key={index} className="flex items-start gap-2">
                <div className="grid grid-cols-2 gap-2 flex-1">
                  <div className="space-y-1">
                    <Select 
                      value={grant.type} 
                      onValueChange={(value) => handleContentGrantChange(index, 'type', value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="chapter">Chapter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Select 
                      value={grant.id}
                      onValueChange={(value) => handleContentGrantChange(index, 'id', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={`Select ${grant.type}...`} />
                      </SelectTrigger>
                      <SelectContent>
                        {works
                          .filter(work => grant.type === 'work' || work.type === grant.type)
                          .map((work) => (
                            <SelectItem key={work.id} value={work.id}>
                              {work.title} ({work.type})
                            </SelectItem>
                          ))}
                        {works.length === 0 && (
                          <div className="p-2 text-sm text-muted-foreground">
                            No {grant.type}s found
                          </div>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 text-destructive hover:bg-destructive/10"
                  onClick={() => handleRemoveContentGrant(index)}
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Remove</span>
                </Button>
              </div>
            ))}
            
            {watch('content_grants')?.length === 0 && (
              <div className="rounded-md border border-dashed p-4 text-center">
                <p className="text-sm text-muted-foreground">
                  No content grants added yet. Click "Add Grant" to get started.
                </p>
              </div>
            )}
          </div>
          
          {errors.content_grants && (
            <p className="text-sm font-medium text-destructive">
              {errors.content_grants.message || 'Please check the content grants'}
            </p>
          )}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-4 border-t">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {product ? 'Updating...' : 'Creating...'}
            </>
          ) : (
            <>{product ? 'Update Product' : 'Create Product'}</>
          )}
        </Button>
      </div>
    </form>
  );
};
