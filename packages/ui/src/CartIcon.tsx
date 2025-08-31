import React, { useState } from 'react';
import { ShoppingCart, X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '@zoroaster/shared/CartContext';
// import { useNavigate } from 'react-router-dom';

export const CartIcon: React.FC = () => {
  const { state, removeItem, updateQuantity, clearCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);
  // const navigate = useNavigate();

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const handleCheckout = () => {
    setIsOpen(false);
    // navigate('/checkout');
  };

  return (
    <div className="relative">
      {/* Cart Icon with Badge */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-text-light hover:text-secondary transition-colors"
        aria-label="Shopping Cart"
      >
        <ShoppingCart className="w-6 h-6" />
        {state.itemCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-secondary text-background text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
            {state.itemCount > 99 ? '99+' : state.itemCount}
          </span>
        )}
      </button>

      {/* Cart Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-background-light rounded-2xl shadow-2xl border border-border/30 z-50 glass-effect">
          <div className="p-4 border-b border-border/30">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-text-light">Shopping Cart</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-dark hover:text-text-light transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {state.items.length === 0 ? (
              <div className="p-6 text-center">
                <ShoppingCart className="w-12 h-12 text-text-dark mx-auto mb-3" />
                <p className="text-text-dark">Your cart is empty</p>
                <p className="text-text-dark text-sm">Add some products to get started!</p>
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {state.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-background/30 rounded-xl">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-text-light truncate">{item.title}</h4>
                      <p className="text-xs text-text-dark">{item.format.toUpperCase()}</p>
                      <p className="text-sm text-secondary font-medium">
                        {formatPrice(item.price, item.currency)}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 text-text-dark hover:text-text-light transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      
                      <span className="text-sm text-text-light min-w-[2rem] text-center">
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 text-text-dark hover:text-text-light transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-1 text-error hover:text-error-dark transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="p-4 border-t border-border/30">
              <div className="flex items-center justify-between mb-4">
                <span className="text-text-light font-medium">Total:</span>
                <span className="text-xl text-secondary font-bold">
                  {formatPrice(state.total, 'USD')}
                </span>
              </div>
              
              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  className="w-full bg-secondary text-background py-3 px-4 rounded-xl font-medium hover:bg-secondary-dark transition-colors"
                >
                  Proceed to Checkout
                </button>
                
                <button
                  onClick={clearCart}
                  className="w-full bg-background/50 text-text-light py-2 px-4 rounded-xl font-medium hover:bg-background/70 transition-colors border border-border/30"
                >
                  Clear Cart
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};


