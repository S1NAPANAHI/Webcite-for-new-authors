import React from 'react';
import type { Product } from '@zoroaster/shared';
interface ProductFormProps {
    product?: Product | null;
    onSave: (data: Partial<Product>) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}
export declare const ProductForm: React.FC<ProductFormProps>;
export {};
