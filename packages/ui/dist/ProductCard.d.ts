import React from 'react';
import { Product } from '@zoroaster/shared';
interface ProductCardProps {
    product: Product;
    onPurchase?: (productId: string) => void;
    showCheckout?: boolean;
}
export declare const ProductCard: React.FC<ProductCardProps>;
export {};
