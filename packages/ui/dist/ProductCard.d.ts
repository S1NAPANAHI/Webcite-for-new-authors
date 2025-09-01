import { default as React } from 'react';
import { Product } from '@zoroaster/shared/product';
interface ProductCardProps {
    product: Product;
    onCheckoutProduct: (product: Product, price: {
        id: string;
        unit_amount: number;
        currency: string;
        interval?: string;
        trial_days?: number;
    }) => void;
}
export declare const ProductCard: React.FC<ProductCardProps>;
export {};
//# sourceMappingURL=ProductCard.d.ts.map