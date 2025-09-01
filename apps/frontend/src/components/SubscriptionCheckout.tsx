import React, { useState } from 'react';
import { CreditCard, X, CheckCircle, AlertCircle } from 'lucide-react';

interface CheckoutProduct {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval?: string;
  trial_period_days?: number;
  is_subscription: boolean;
}

interface SubscriptionCheckoutProps {
  product: CheckoutProduct;
  onSuccess: () => void;
  onCancel: () => void;
}

const SubscriptionCheckout: React.FC<SubscriptionCheckoutProps> = ({ 
  product, 
  onSuccess, 
  onCancel 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [name, setName] = useState('');

  const formatPrice = () => {
    const amount = product.price / 100;
    return `$${amount.toFixed(2)}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Implement actual payment processing with Stripe or PayPal
      console.log('Processing payment for:', product);
      
      onSuccess();
    } catch (err) {
      setError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-background rounded-2xl p-6 border border-border/30">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-heading text-text-light">Checkout</h3>
        <button
          onClick={onCancel}
          className="p-2 hover:bg-background-light/50 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-text-dark" />
        </button>
      </div>

      {/* Product Summary */}
      <div className="bg-background-light/30 rounded-xl p-4 mb-6 border border-border/20">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-lg font-medium text-text-light">{product.name}</h4>
            <p className="text-text-dark text-sm">
              {product.is_subscription ? 'Subscription' : 'One-time purchase'}
              {product.interval && ` • Billed ${product.interval}ly`}
              {product.trial_period_days && ` • ${product.trial_period_days} day trial`}
            </p>
          </div>
          <div className="text-right">
            <div className="text-xl font-semibold text-secondary">
              {formatPrice()}
              {product.interval && <span className="text-sm">/{product.interval}</span>}
            </div>
            {product.trial_period_days && (
              <div className="text-xs text-accent">Free trial included</div>
            )}
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 flex items-center space-x-3">
          <AlertCircle className="w-5 h-5 text-red-400" />
          <p className="text-red-400">{error}</p>
        </div>
      )}

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-text-light mb-2">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            placeholder="your.email@example.com"
          />
        </div>

        {/* Cardholder Name */}
        <div>
          <label className="block text-sm font-medium text-text-light mb-2">
            Cardholder Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            placeholder="John Doe"
          />
        </div>

        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-text-light mb-2">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(e.target.value)}
            required
            maxLength={19}
            className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            placeholder="1234 5678 9012 3456"
          />
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
              placeholder="MM/YY"
              maxLength={5}
              className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-light mb-2">
              CVC
            </label>
            <input
              type="text"
              value={cvc}
              onChange={(e) => setCvc(e.target.value)}
              required
              maxLength={4}
              placeholder="123"
              className="w-full px-4 py-3 bg-background/50 border border-border/30 rounded-xl text-text-light placeholder-text-dark/50 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full flex items-center justify-center space-x-3 px-6 py-4 bg-secondary hover:bg-secondary-dark disabled:bg-text-dark/20 disabled:text-text-dark text-background rounded-xl transition-all font-medium mt-6"
        >
          {isProcessing ? (
            <>
              <div className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full animate-spin"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              <span>
                {product.trial_period_days ? 'Start Free Trial' : `Pay ${formatPrice()}`}
              </span>
            </>
          )}
        </button>

        {/* Security Note */}
        <div className="flex items-center justify-center space-x-2 mt-4 text-text-dark text-sm">
          <CheckCircle className="w-4 h-4 text-accent" />
          <span>Secure payment powered by Stripe</span>
        </div>
      </form>

      {/* Terms */}
      <div className="mt-6 pt-4 border-t border-border/20">
        <p className="text-xs text-text-dark text-center">
          By completing this purchase, you agree to our{' '}
          <a href="/terms" className="text-secondary hover:underline">Terms of Service</a>
          {' '}and{' '}
          <a href="/privacy" className="text-secondary hover:underline">Privacy Policy</a>.
          {product.is_subscription && (
            <span> Your subscription will auto-renew unless cancelled.</span>
          )}
        </p>
      </div>
    </div>
  );
};

export default SubscriptionCheckout;
