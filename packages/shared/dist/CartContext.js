import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer } from 'react';
const initialState = {
    items: [],
    total: 0,
    itemCount: 0,
};
const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existingItem = state.items.find(item => item.id === action.payload.id);
            if (existingItem) {
                const updatedItems = state.items.map(item => item.id === action.payload.id
                    ? { ...item, quantity: item.quantity + action.payload.quantity }
                    : item);
                const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
                return { ...state, items: updatedItems, total, itemCount };
            }
            else {
                const newItems = [...state.items, action.payload];
                const total = newItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
                const itemCount = newItems.reduce((sum, item) => sum + item.quantity, 0);
                return { ...state, items: newItems, total, itemCount };
            }
        }
        case 'REMOVE_ITEM': {
            const updatedItems = state.items.filter(item => item.id !== action.payload);
            const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            return { ...state, items: updatedItems, total, itemCount };
        }
        case 'UPDATE_QUANTITY': {
            const updatedItems = state.items.map(item => item.id === action.payload.id
                ? { ...item, quantity: action.payload.quantity }
                : item);
            const total = updatedItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            return { ...state, items: updatedItems, total, itemCount };
        }
        case 'CLEAR_CART':
            return initialState;
        case 'LOAD_CART': {
            const total = action.payload.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const itemCount = action.payload.reduce((sum, item) => sum + item.quantity, 0);
            return { ...state, items: action.payload, total, itemCount };
        }
        default:
            return state;
    }
};
const CartContext = createContext(undefined);
export const useCart = () => {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, initialState);
    const addItem = (item) => {
        dispatch({ type: 'ADD_ITEM', payload: { ...item, quantity: 1 } });
    };
    const removeItem = (id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    };
    const updateQuantity = (id, quantity) => {
        if (quantity <= 0) {
            removeItem(id);
        }
        else {
            dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } });
        }
    };
    const clearCart = () => {
        dispatch({ type: 'CLEAR_CART' });
    };
    const isInCart = (id) => {
        return state.items.some(item => item.id === id);
    };
    const value = {
        state,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
    };
    return _jsx(CartContext.Provider, { value: value, children: children });
};
//# sourceMappingURL=CartContext.js.map