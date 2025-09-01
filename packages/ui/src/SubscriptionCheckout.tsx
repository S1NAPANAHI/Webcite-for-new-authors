import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { ShoppingCart, CreditCard, Calendar, Download, Crown, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';

import type { Product } from '@zoroaster/shared/product';

// Create stripePromise with memoization to avoid recreating on every render
let stripePromise: Promise<any> | null = null;
const getStripePromise = (publishableKey: string) => {
  if (!stripePromise) {
    stripePromise = loadStripe(publishableKey);
  }
  return stripePromise;
};

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
  stripePublishableKey?: string; // Allow passing key as prop
  inline?: boolean; // New prop to support inline mode
}

interface CheckoutFormProps extends StripeCheckoutProps {
  clientSecret?: string;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ 
  product, 
  onSuccess, 
  onCancel, 
  customerEmail,
  inline = false,
  clientSecret
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(customerEmail || '');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      setError('Payment system not loaded. Please refresh and try again.');
      return;
    }

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const { error: confirmError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          receipt_email: email,
          return_url: `${window.location.origin}/subscription-success`,
        },
        redirect: 'if_required'
      });

      if (confirmError) {
        throw new Error(confirmError.message || 'Payment failed. Please try again.');
      }

      // Success
      onSuccess('payment_completed');

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
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

  // Inline mode for integration into checkout page
  if (inline) {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Input */}
        <div>
          <label htmlFor="email" className="block text-sm font-bold text-foreground mb-3">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all duration-200"
            placeholder="your@email.com"
          />
        </div>

        {/* Payment Element */}
        {clientSecret && (
          <div>
            <label className="block text-sm font-bold text-gray-900 dark:text-white mb-3">
              Payment Details *
            </label>
            <div className="rounded-xl border-2 border-gray-200 dark:border-gray-600 p-1 bg-gray-50 dark:bg-gray-700">
              <PaymentElement 
                options={{
                  layout: 'tabs',
                  paymentMethodOrder: ['card', 'apple_pay', 'google_pay'],
                }}
              />
            </div>
          </div>
        )}
        
        {!clientSecret && !error && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Initializing payment...</span>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="flex items-center space-x-3 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border-2 border-red-200 dark:border-red-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Security Notice */}
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
          <div className="flex items-center justify-center space-x-2 text-green-700 dark:text-green-400 mb-2">
            <CheckCircle className="w-5 h-5" />
            <span className="text-sm font-medium">256-bit SSL Encrypted Payment</span>
          </div>
          <p className="text-xs text-green-600 dark:text-green-500 text-center">
            Your payment information is fully encrypted and secure. We never store your card details.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 pt-2">
          <button
            type="submit"
            disabled={!stripe || isProcessing}
            className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center justify-center gap-3"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white border-t-transparent"></div>
                <span>Processing Payment...</span>
              </div>
            ) : (
              <>
                <CreditCard className="w-6 h-6" />
                <span>
                  {product.is_subscription 
                    ? `Start ${product.name} - ${formatPrice(product.price, product.currency)}` 
                    : `Complete Purchase - ${formatPrice(product.price, product.currency)}`
                  }
                </span>
              </>
            )}
          </button>

          {!inline && (
            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    );
  }

  // Original modal mode
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-gray-700 overflow-hidden">
        {/* Product Header */}
        <div className="bg-gradient-to-r from-primary to-secondary p-6 text-white">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{product.name}</h2>
              <p className="text-white/90 text-sm">Secure checkout</p>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-3xl font-bold text-foreground">
              {formatPrice(product.price, product.currency)}
            </div>
            {product.is_subscription && (
              <div className="text-muted-foreground">
                per {formatInterval(product.interval)}
                {product.trial_period_days && product.trial_period_days > 0 && (
                  <span className="ml-2 text-success font-medium">
                    • {product.trial_period_days}-day free trial
                  </span>
                )}
              </div>
            )}
            {!product.is_subscription && (
              <div className="text-muted-foreground">One-time purchase</div>
            )}
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="your@email.com"
            />
          </div>

          {/* Stripe Card Element */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Card Details
            </label>
            <div className="border border-gray-200 dark:border-gray-600 rounded-xl p-4 bg-gray-50 dark:bg-gray-700">
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#1f2937',
                      fontFamily: 'Inter, system-ui, sans-serif',
                      '::placeholder': {
                        color: '#6b7280',
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
            <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              type="submit"
              disabled={!stripe || isProcessing}
              className="w-full bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white py-4 px-6 rounded-xl font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isProcessing ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="w-5 h-5" />
                  <span>
                    {product.is_subscription ? 'Start Subscription' : 'Complete Purchase'}
                  </span>
                </div>
              )}
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-xl font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-all duration-200 border border-gray-300 dark:border-gray-600"
            >
              Cancel
            </button>
          </div>

          {/* Security Notice */}
          <div className="text-center text-xs text-muted-foreground">
            <div className="flex items-center justify-center space-x-1 mb-2">
              <CheckCircle className="w-4 h-4 text-success" />
              <span>Secure payment powered by Stripe</span>
            </div>
            <p>Your payment information is encrypted and secure.</p>
          </div>
        </form>
      </div>
    </div>
  );
};

const SubscriptionCheckout: React.FC<StripeCheckoutProps> = (props) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Check if Stripe key is configured (prop takes precedence over env var)
  const stripeKey = props.stripePublishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
  
  // Debug logging
  console.log('🔑 Stripe key source:', props.stripePublishableKey ? 'prop' : 'env var');
  console.log('🔑 Stripe key loaded:', stripeKey ? `${stripeKey.substring(0, 12)}...` : 'NOT FOUND');
  
  // Create subscription intent on mount
  useEffect(() => {
    if (props.product.is_subscription && stripeKey) {
      createSubscriptionIntent();
    }
  }, [props.product.id, stripeKey]);

  const createSubscriptionIntent = async () => {
    try {
      const response = await fetch('/api/stripe/create-subscription-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: props.product.id,
          customerEmail: props.customerEmail || '',
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create subscription');
      }

      setClientSecret(data.clientSecret);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize payment');
    }
  };
  
  // Simple validation - just check if we have a valid Stripe key
  const hasValidStripeKey = stripeKey && (stripeKey.startsWith('pk_test_') || stripeKey.startsWith('pk_live_'));
  
  if (!hasValidStripeKey) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Stripe Not Configured</h3>
          <p className="text-red-600 dark:text-red-500 text-sm mb-4">
            Please configure Stripe to enable payments.
          </p>
          <button
            onClick={props.onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border border-red-200 dark:border-red-800">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-red-700 dark:text-red-400 mb-2">Payment Error</h3>
          <p className="text-red-600 dark:text-red-500 text-sm mb-4">{error}</p>
          <button
            onClick={() => {
              setError(null);
              createSubscriptionIntent();
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors mr-2"
          >
            Retry
          </button>
          <button
            onClick={props.onCancel}
            className="px-6 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Initializing secure payment...</span>
      </div>
    );
  }

  const elementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe' as const,
      variables: {
        colorPrimary: '#3b82f6',
        colorBackground: '#ffffff',
        colorText: '#1f2937',
        colorDanger: '#ef4444',
        fontFamily: 'Inter, system-ui, sans-serif',
        spacingUnit: '4px',
        borderRadius: '12px',
      },
    },
  };

  return (
    <Elements stripe={getStripePromise(stripeKey)} options={elementsOptions}>
      <CheckoutForm {...props} clientSecret={clientSecret} />
    </Elements>
  );
};

export { SubscriptionCheckout };
