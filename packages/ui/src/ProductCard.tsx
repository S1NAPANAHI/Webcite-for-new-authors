import React, { useState } from 'react';
import { ShoppingCart, Download, Crown, Star, Eye, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { StripeCheckout } from './StripeCheckout'; // Assuming StripeCheckout is in the same package
import { useCart } from '@zoroaster/shared';

// Assuming Product type is defined elsewhere (e.g., in shared types or generated types)
interface Product {
  id: string;
  name: string;
  description: string | null;
  product_type: 'single_issue' | 'bundle' | 'chapter_pass' | 'arc_pass';
  active: boolean;
  created_at: string;
  updated_at: string;
  work_id: string | null;
  content_grants: Array<{ type: 'work' | 'chapter'; id: string }>;
  price_ids: string[];
  unit_amounts: number[];
  currencies: string[];
}

interface ProductCardProps {
  product: Product;
  onPurchase?: (productId: string) => void;
  showCheckout?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ 
  product, 
  onPurchase, 
  showCheckout = false 
}) => {
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [showSample, setShowSample] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState<{ id: string; unit_amount: number; currency: string; interval?: string; trial_days?: number } | null>(null);
  const { addItem, isInCart } = useCart();

  // Get primary price (first price or subscription price)
  const primaryPrice = product.unit_amounts && product.unit_amounts.length > 0 ? {
    id: product.price_ids[0],
    unit_amount: product.unit_amounts[0],
    currency: product.currencies[0],
    // Assuming interval and trial_days are not directly on product for now, 
    // will need to fetch full price details if needed for display here.
  } : null;
  
  const formatPrice = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  };

  const handlePurchase = (price: { id: string; unit_amount: number; currency: string; interval?: string; trial_days?: number }) => {
    setSelectedPrice(price);
    setShowCheckoutModal(true);
  };

  const handleAddToCart = () => {
    if (primaryPrice) {
      addItem({
        id: product.id,
        name: product.name,
        price: primaryPrice.unit_amount / 100,
        currency: primaryPrice.currency,
        // format: product.files[0]?.format || 'pdf' // Files are no longer directly on product
      });
    }
  };

  const handleCheckoutSuccess = (sessionId: string) => {
    setShowCheckoutModal(false);
    if (onPurchase) {
      onPurchase(product.id);
    }
    // You can redirect to success page or show success message
    console.log('Purchase successful:', sessionId);
  };

  const handleCheckoutCancel = () => {
    setShowCheckoutModal(false);
  };

  if (!primaryPrice) {
    return null; // Don't render if no price available
  }

  const isProductInCart = isInCart(product.id);

  return (
    <>
      <div className="bg-background-light/30 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 product-card-hover glass-effect border border-border/30">
        {/* Cover Image - Placeholder for now */}
        <div className="relative h-64 bg-gradient-to-br from-primary/30 via-secondary/30 to-accent/30">
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <Crown className="w-16 h-16 text-secondary mx-auto mb-2" />
              <p className="text-text-light/60 text-sm font-medium">{product.name}</p>
            </div>
          </div>
          
          {/* Status Badge */}
          {product.active && (
            <div className="absolute top-4 right-4 bg-success text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Available
            </div>
          )}
          
          {/* Product Type Badge */}
          {product.product_type === 'bundle' && (
            <div className="absolute top-4 left-4 bg-secondary text-background px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Bundle
            </div>
          )}

          {(product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') && (
            <div className="absolute top-4 left-4 bg-accent text-white px-3 py-1 rounded-full text-xs font-medium shadow-lg">
              Subscription
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-6">
          <h3 className="text-xl font-bold text-text-light mb-3 line-clamp-2">{product.name}</h3>
          
          <p className="text-text-light/70 text-sm mb-4 line-clamp-3 leading-relaxed">
            {product.description}
          </p>

          {/* Available Formats - Removed for now as files are not directly on product */}
          {/* <div className="mb-4">
            <div className="text-sm text-text-dark mb-2">Available Formats:</div>
            <div className="flex flex-wrap gap-2">
              {product.files.map((file) => (
                <span
                  key={file.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent/20 text-accent border border-accent/30"
                >
                  <Download className="w-3 h-3 mr-1" />
                  {file.format.toUpperCase()}
                  {file.is_primary && (
                    <span className="ml-1 text-accent">•</span>
                  )}
                </span>
              ))}
            </div>
          </div> */}

          {/* Pricing */}
          <div className="mb-6">
            <div className="text-3xl font-bold text-secondary mb-2">
              {formatPrice(primaryPrice.unit_amount, primaryPrice.currency)}
            </div>
            
            {(product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') && (
              <div className="text-text-light/70 text-sm">
                {/* Interval and trial_days need to be fetched with price details */}
                per month
              </div>
            )}
            
            {!(product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') && (
              <div className="text-text-light/70 text-sm">One-time purchase</div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              disabled={isProductInCart}
              className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
                isProductInCart
                  ? 'bg-success text-white cursor-not-allowed'
                  : 'bg-secondary text-background hover:bg-secondary-dark focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:ring-offset-2 focus:ring-offset-background-light shadow-lg hover:shadow-xl'
              }`}
            >
              {isProductInCart ? (
                <>
                  <span>✓</span>
                  <span>Added to Cart</span>
                </>
              ) : (
                <>
                  <Plus className="w-5 h-5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            {/* Buy Now Button */}
            <button
              onClick={() => handlePurchase(primaryPrice)}
              className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>
                {(product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') ? 'Start Subscription' : 'Buy Now'}
              </span>
            </button>

            {/* Sample Preview Toggle - Removed for now */}
            {/* <button
              onClick={() => setShowSample(!showSample)}
              className="w-full bg-background/50 text-text-light py-2 px-4 rounded-xl font-medium hover:bg-background/70 focus:outline-none focus:ring-2 focus:ring-border focus:ring-offset-2 focus:ring-offset-background-light transition-all duration-200 flex items-center justify-center space-x-2 border border-border/30"
            >
              <Eye className="w-4 h-4" />
              <span>Read Sample</span>
              {showSample ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button> */}
          </div>

          {/* Sample Content - Removed for now */}
          {/* {showSample && (
            <div className="mt-4 p-4 bg-background/30 rounded-xl border-l-4 border-accent">
              <h4 className="font-medium text-text-light mb-2">Sample Preview</h4>
              <p className="text-text-light/70 text-sm mb-3">
                This is a preview of the content. Purchase to access the full book.
              </p>
              <div className="text-xs text-text-dark">
                <div>Formats: {availableFormats}</div>
                {product.files[0] && (
                  <div>Sample size: {formatFileSize(product.files[0].file_size)}</div>
                )}
              </div>
            </div>
          )} */}

          {/* Additional Info */}
          <div className="mt-6 pt-4 border-t border-border/30">
            <div className="grid grid-cols-2 gap-4 text-sm text-text-dark">
              <div>
                <span className="font-medium text-text-light">Published:</span>
                <br />
                {new Date(product.created_at).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium text-text-light">Type:</span>
                <br />
                {product.product_type === 'bundle' ? 'Bundle' : (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') ? 'Subscription' : 'Single Issue'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && selectedPrice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-background-light rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto glass-effect border border-border/30">
            <div className="p-6 border-b border-border/30">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-text-light">Complete Purchase</h3>
                <button
                  onClick={() => setShowCheckoutModal(false)}
                  className="text-text-dark hover:text-text-light transition-colors p-1 rounded-lg hover:bg-background/30"
                >
                  <span className="sr-only">Close</span>
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            
            <StripeCheckout
              product={{
                id: product.id,
                name: product.name,
                price: selectedPrice.unit_amount,
                currency: selectedPrice.currency,
                interval: selectedPrice.interval,
                trial_period_days: selectedPrice.trial_days,
                is_subscription: (product.product_type === 'chapter_pass' || product.product_type === 'arc_pass')
              }}
              onSuccess={handleCheckoutSuccess}
              onCancel={handleCheckoutCancel}
            />
          </div>
        </div>
      )}
    </>
  );
};


