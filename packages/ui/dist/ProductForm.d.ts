import React from 'react';
import type { Product } from '../../packages/shared/src/product.js';
interface ProductFormProps {
    product?: Product | null;
    onSave: (data: Partial<Product>) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}
export declare const ProductForm: React.FC<ProductFormProps>;
export {};
//# sourceMappingURL=ProductForm.d.ts.map