import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShoppingCart, CreditCard, Calendar, Download, Crown, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

// Load Stripe outside of component to avoid recreating on every render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_key_here');

import type { Product } from '@zoroaster/shared';

interface StripeCheckoutProps {
  product: {
    id: string;
    name: string;
    price: number; // unit_amount
    currency: string;
    interval?: string;
    trial_period_days?: number;
    is_subscription: boolean;
  };
  onSuccess: (sessionId: string) => void;
  onCancel: () => void;
  customerEmail?: string;
}

const CheckoutForm: React.FC<StripeCheckoutProps> = ({ 
  product, 
  onSuccess, 
  onCancel, 
  customerEmail 
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(customerEmail || '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: product.id,
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/cancel`,
          customerEmail: email,
          productSlug: product.id
        }),
      });

      const { url, error: responseError } = await response.json();

      if (responseError) {
        throw new Error(responseError);
      }

      // Redirect to Stripe Checkout
      window.location.href = url;

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setIsProcessing(false);
    }
  };

  const formatPrice = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  };

  const formatInterval = (interval?: string) => {
    if (!interval) return '';
    return interval === 'month' ? 'monthly' : interval === 'year' ? 'yearly' : interval;
  };

  return (
    <div className="max-w-md mx-auto bg-background-light rounded-2xl shadow-lg overflow-hidden border border-border/30">
      {/* Product Header */}
      <div className="bg-gradient-to-r from-primary/80 to-secondary/80 p-6 text-text-light">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-20 bg-white bg-opacity-20 rounded-md flex items-center justify-center">
            <Crown className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">{product.name}</h2>
            <p className="text-text-light/80 text-sm">{product.description}</p>
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="p-6 border-b border-border/30">
        <div className="text-center">
          <div className="text-3xl font-bold text-secondary">
            {formatPrice(product.price, product.currency)}
          </div>
          {product.is_subscription && (
            <div className="text-text-light/70">
              per {formatInterval(product.interval)}
              {product.trial_period_days && product.trial_period_days > 0 && (
                <span className="ml-2 text-success font-medium">
                  • {product.trial_period_days}-day free trial
                </span>
              )}
            </div>
          )}
          {!product.is_subscription && (
            <div className="text-text-light/70">One-time purchase</div>
          )}
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-text-light mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            placeholder="your@email.com"
          />
        </div>

        {/* Stripe Card Element */}
        <div>
          <label className="block text-sm font-medium text-text-light mb-2">
            Card Details
          </label>
          <div className="border border-border/30 rounded-xl p-3 bg-background/30">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#e0e0e0',
                    '::placeholder': {
                      color: '#a0a0a0',
                    },
                  },
                  invalid: {
                    color: '#dc3545',
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-2 text-error bg-error/10 p-3 rounded-xl border border-error/30">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-secondary text-background py-3 px-4 rounded-xl font-medium hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-background-light disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-background"></div>
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center space-x-2">
                <ShoppingCart className="w-5 h-5" />
                <span>
                  {product.is_subscription ? 'Start Subscription' : 'Complete Purchase'}
                </span>
              </div>
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-background/50 text-text-light py-3 px-4 rounded-xl font-medium hover:bg-background/70 focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background-light transition-all duration-200 border border-border/30"
          >
            Cancel
          </button>
        </div>

        {/* Security Notice */}
        <div className="text-center text-xs text-text-dark">
          <div className="flex items-center justify-center space-x-1 mb-2">
            <CheckCircle className="w-4 h-4 text-success" />
            <span>Secure payment powered by Stripe</span>
          </div>
          <p>Your payment information is encrypted and secure.</p>
        </div>
      </form>
    </div>
  );
};

const SubscriptionCheckout: React.FC<StripeCheckoutProps> = (props) => {
  // Check if Stripe key is configured
  const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  if (!stripeKey || stripeKey === 'pk_test_your_key_here') {
    return (
      <div className="max-w-md mx-auto bg-background-light rounded-2xl p-6 border border-border/30">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-warning mx-auto mb-4" />
          <h3 className="text-xl font-bold text-text-light mb-2">Stripe Not Configured</h3>
          <p className="text-text-dark mb-4">
            Please configure your Stripe publishable key in the environment variables to enable checkout functionality.
          </p>
          <div className="bg-background/30 p-4 rounded-xl border border-border/30">
            <p className="text-sm text-text-dark font-mono">
              VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_actual_key_here
            </p>
          </div>
          <button
            onClick={props.onCancel}
            className="mt-4 px-6 py-2 bg-secondary text-background rounded-xl hover:bg-secondary-dark transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm {...props} />
    </Elements>
  );
};

export { SubscriptionCheckout };
