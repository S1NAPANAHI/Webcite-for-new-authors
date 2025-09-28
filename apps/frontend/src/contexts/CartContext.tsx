import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { User } from '@supabase/supabase-js';
import { Database } from '../lib/database.types';
import { supabase } from '../lib/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductVariant = Database['public']['Tables']['product_variants']['Row'];

interface CartItem {
  id: string;
  product: Product;
  variant?: ProductVariant;
  quantity: number;
  price: number; // Price in cents
}

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  loading: boolean;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: { product: Product; variant?: ProductVariant; quantity?: number } }
  | { type: 'REMOVE_ITEM'; payload: { id: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_CART_OPEN'; payload: boolean }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'LOAD_CART'; payload: CartItem[] };

interface CartContextType {
  state: CartState;
  addItem: (product: Product, variant?: ProductVariant, quantity?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, variant, quantity = 1 } = action.payload;
      const price = variant?.price_amount || product.price_cents || 0;
      const itemId = variant ? `${product.id}-${variant.id}` : product.id;
      
      const existingItemIndex = state.items.findIndex(item => item.id === itemId);
      
      if (existingItemIndex >= 0) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return { ...state, items: updatedItems };
      }
      
      const newItem: CartItem = {
        id: itemId,
        product,
        variant,
        quantity,
        price
      };
      
      return {
        ...state,
        items: [...state.items, newItem]
      };
    }
    
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload.id)
      };
    
    case 'UPDATE_QUANTITY': {
      const { id, quantity } = action.payload;
      
      if (quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(item => item.id !== id)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      };
    }
    
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    
    case 'SET_CART_OPEN':
      return {
        ...state,
        isOpen: action.payload
      };
    
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    
    case 'LOAD_CART':
      return {
        ...state,
        items: action.payload,
        loading: false
      };
    
    default:
      return state;
  }
};

const initialState: CartState = {
  items: [],
  isOpen: false,
  loading: false
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('zoroasterverse-cart');
    if (savedCart) {
      try {
        const cartItems = JSON.parse(savedCart);
        dispatch({ type: 'LOAD_CART', payload: cartItems });
      } catch (error) {
        console.error('Failed to load cart from localStorage:', error);
        localStorage.removeItem('zoroasterverse-cart');
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (state.items.length > 0) {
      localStorage.setItem('zoroasterverse-cart', JSON.stringify(state.items));
    } else {
      localStorage.removeItem('zoroasterverse-cart');
    }
  }, [state.items]);

  const addItem = (product: Product, variant?: ProductVariant, quantity = 1) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, variant, quantity } });
    
    // Show success feedback (you could add a toast notification here)
    console.log(`Added ${product.name} to cart`);
  };

  const removeItem = (id: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { id } });
  };

  const updateQuantity = (id: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    localStorage.removeItem('zoroasterverse-cart');
  };

  const toggleCart = () => {
    dispatch({ type: 'SET_CART_OPEN', payload: !state.isOpen });
  };

  const getTotalItems = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getSubtotal = () => {
    return getTotalPrice();
  };

  const contextValue: CartContextType = {
    state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    toggleCart,
    getTotalItems,
    getTotalPrice,
    getSubtotal
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

// Hook for cart badge count
export const useCartCount = () => {
  const { getTotalItems } = useCart();
  return getTotalItems();
};

// Hook for cart total
export const useCartTotal = () => {
  const { getTotalPrice } = useCart();
  return getTotalPrice();
};