import React from 'react';
import { X, Plus, Minus, ShoppingBag, CreditCard, Trash2 } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';

export const ShoppingCart: React.FC = () => {
  const { 
    state, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    toggleCart, 
    getTotalItems, 
    getTotalPrice 
  } = useCart();

  const formatPrice = (priceInCents: number) => {
    return (priceInCents / 100).toFixed(2);
  };

  const handleCheckout = () => {
    // TODO: Implement checkout process
    console.log('Proceed to checkout');
  };

  if (!state.isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity"
        onClick={toggleCart}
      />
      
      {/* Cart Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 transform transition-transform duration-300 ease-in-out">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center gap-3">
              <ShoppingBag className="w-6 h-6 text-amber-400" />
              <h2 className="text-xl font-bold text-slate-100">
                Cart ({getTotalItems()})
              </h2>
            </div>
            <button 
              onClick={toggleCart}
              className="p-2 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-slate-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-300 mb-2">Your cart is empty</h3>
                <p className="text-slate-500 text-sm mb-6">
                  Start exploring our Zoroastervers collection to add items to your cart.
                </p>
                <button 
                  onClick={toggleCart}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/50">
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-20 bg-slate-700 rounded-md overflow-hidden">
                          {item.product.cover_image_url ? (
                            <img 
                              src={item.product.cover_image_url} 
                              alt={item.product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full text-slate-500">
                              <ShoppingBag className="w-6 h-6" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h4 className="text-slate-200 font-medium text-sm mb-1 truncate">
                          {item.product.name}
                        </h4>
                        {item.variant && (
                          <p className="text-slate-400 text-xs mb-2">
                            {item.variant.name}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="text-amber-400 font-bold text-sm">
                            ${formatPrice(item.price)}
                          </div>
                          
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            
                            <span className="text-slate-200 text-sm min-w-[2rem] text-center">
                              {item.quantity}
                            </span>
                            
                            <button 
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                            
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-red-400 hover:text-red-300 transition-colors ml-2"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        
                        {/* Item Total */}
                        <div className="text-right mt-2">
                          <span className="text-slate-300 text-xs">
                            Total: <span className="text-amber-400 font-medium">
                              ${formatPrice(item.price * item.quantity)}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Clear Cart Button */}
                {state.items.length > 0 && (
                  <button 
                    onClick={clearCart}
                    className="w-full text-red-400 hover:text-red-300 text-sm py-2 transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Clear Cart
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Footer - Checkout */}
          {state.items.length > 0 && (
            <div className="p-6 border-t border-slate-700 bg-slate-900/50">
              <div className="space-y-4">
                {/* Totals */}
                <div className="space-y-2">
                  <div className="flex justify-between text-slate-300">
                    <span>Subtotal:</span>
                    <span>${formatPrice(getTotalPrice())}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 text-sm">
                    <span>Items:</span>
                    <span>{getTotalItems()}</span>
                  </div>
                  <div className="border-t border-slate-700 pt-2">
                    <div className="flex justify-between text-lg font-bold text-slate-100">
                      <span>Total:</span>
                      <span className="text-amber-400">${formatPrice(getTotalPrice())}</span>
                    </div>
                  </div>
                </div>
                
                {/* Checkout Button */}
                <button 
                  onClick={handleCheckout}
                  className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-lg hover:shadow-amber-500/25 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-5 h-5" />
                  Proceed to Checkout
                </button>
                
                <button 
                  onClick={toggleCart}
                  className="w-full text-slate-400 hover:text-slate-200 py-2 transition-colors"
                >
                  Continue Shopping
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// Cart Badge Component (for navbar)
export const CartBadge: React.FC = () => {
  const { getTotalItems, toggleCart } = useCart();
  const itemCount = getTotalItems();

  return (
    <button 
      onClick={toggleCart}
      className="relative p-2 text-slate-400 hover:text-slate-200 transition-colors"
    >
      <ShoppingBag className="w-6 h-6" />
      {itemCount > 0 && (
        <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </button>
  );
};