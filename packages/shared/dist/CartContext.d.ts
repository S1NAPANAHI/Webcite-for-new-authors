import React, { ReactNode } from 'react';
interface CartItem {
    id: string;
    title: string;
    price: number;
    currency: string;
    format: string;
    quantity: number;
}
interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}
interface CartContextType {
    state: CartState;
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: string) => void;
    updateQuantity: (id: string, quantity: number) => void;
    clearCart: () => void;
    isInCart: (id: string) => boolean;
}
export declare const useCart: () => CartContextType;
interface CartProviderProps {
    children: ReactNode;
}
export declare const CartProvider: React.FC<CartProviderProps>;
export {};
