import React, { useState } from 'react';
import { useCart } from '@zoroaster/shared/CartContext';
import { ShoppingCart, ArrowLeft, CreditCard, Lock } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';

export const CheckoutPage: React.FC = () => {
  const { state, clearCart } = useCart();
  // const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount);
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    // Simulate checkout process
    setTimeout(() => {
      setIsProcessing(false);
      clearCart();
      // navigate('/store?checkout=success');
    }, 2000);
  };

  const handleBackToStore = () => {
    // navigate('/store');
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background-light to-background flex items-center justify-center">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-text-dark mx-auto mb-4" />
          <h2 className="text-2xl font-heading text-text-light mb-2">Your cart is empty</h2>
          <p className="text-text-dark mb-6">Add some products to your cart before checking out.</p>
          <button
            onClick={handleBackToStore}
            className="px-6 py-3 bg-secondary text-background rounded-xl hover:bg-secondary-dark transition-colors"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background-light to-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={handleBackToStore}
            className="flex items-center space-x-2 text-text-light hover:text-secondary transition-colors mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Store</span>
          </button>
          <h1 className="text-4xl font-heading text-text-light mb-2">Checkout</h1>
          <p className="text-text-light/70">Complete your purchase</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
            <h2 className="text-2xl font-heading text-text-light mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              {state.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-background/30 rounded-xl">
                  <div className="flex-1">
                    <h3 className="font-medium text-text-light">{item.title}</h3>
                    <p className="text-sm text-text-dark">{item.format.toUpperCase()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-secondary font-medium">
                      {formatPrice(item.price, item.currency)}
                    </p>
                    <p className="text-sm text-text-dark">Qty: {item.quantity}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-border/30 pt-4">
              <div className="flex justify-between items-center text-lg font-medium text-text-light mb-2">
                <span>Subtotal:</span>
                <span>{formatPrice(state.total, 'USD')}</span>
              </div>
              <div className="flex justify-between items-center text-sm text-text-dark mb-4">
                <span>Tax:</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between items-center text-xl font-bold text-secondary">
                <span>Total:</span>
                <span>{formatPrice(state.total, 'USD')}</span>
              </div>
            </div>
          </div>

          {/* Checkout Form */}
          <div className="bg-background-light/30 backdrop-blur-sm rounded-2xl p-6 border border-border/30">
            <h2 className="text-2xl font-heading text-text-light mb-6">Payment Information</h2>
            
            <form className="space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-medium text-text-light mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                      placeholder="Enter first name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-light mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                      placeholder="Enter last name"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-text-light mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                    placeholder="Enter email address"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h3 className="text-lg font-medium text-text-light mb-4">Payment Method</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3 p-4 bg-background/30 rounded-xl border border-border/30">
                    <input
                      type="radio"
                      name="payment"
                      id="card"
                      defaultChecked
                      className="text-secondary focus:ring-secondary"
                    />
                    <label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                      <CreditCard className="w-5 h-5 text-secondary" />
                      <span className="text-text-light">Credit/Debit Card</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="p-4 bg-accent/10 border border-accent/30 rounded-xl">
                <div className="flex items-center space-x-2 text-accent mb-2">
                  <Lock className="w-5 h-5" />
                  <span className="font-medium">Secure Checkout</span>
                </div>
                <p className="text-sm text-text-light/70">
                  Your payment information is encrypted and secure. We never store your credit card details.
                </p>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full bg-secondary text-background py-4 px-6 rounded-xl font-medium hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-background-light transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-5 h-5 border-2 border-background border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  `Complete Purchase - ${formatPrice(state.total, 'USD')}`
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};


