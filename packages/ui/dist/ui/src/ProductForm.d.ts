import { default as React } from 'react';
import { Product } from '../../shared/src/product';
interface ProductFormProps {
    product?: Product | null;
    onSave: (data: Partial<Product>) => void;
    onCancel: () => void;
    isSubmitting?: boolean;
}
export declare const ProductForm: React.FC<ProductFormProps>;
export {};
//# sourceMappingURL=ProductForm.d.ts.map