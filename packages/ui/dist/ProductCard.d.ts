import { default as React } from 'react';
import { Product } from '@zoroaster/shared/product';
interface ProductCardProps {
    product: Product;
    onPurchase?: (productId: string) => void;
    showCheckout?: boolean;
}
export declare const ProductCard: React.FC<ProductCardProps>;
export {};
//# sourceMappingURL=ProductCard.d.ts.map