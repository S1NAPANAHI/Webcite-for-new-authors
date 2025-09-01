import React from 'react';
import { ShoppingCart, Download, Crown, Star, Eye, ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { useCart } from '@zoroaster/shared/CartContext';
import { Product } from '@zoroaster/shared/product';

interface ProductCardProps {
  product: Product;
  onCheckoutProduct: (product: Product, price: { id: string; unit_amount: number; currency: string; interval?: string; trial_days?: number }) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onCheckoutProduct
}) => {
  const { addItem, isInCart } = useCart();

  // Get primary price (first price or subscription price)
  const primaryPrice = product.prices && product.prices.length > 0 ? {
    id: product.prices[0].id,
    unit_amount: product.prices[0].unit_amount,
    currency: product.prices[0].currency,
    interval: product.prices[0].interval || undefined, // Add interval if available
    trial_days: product.prices[0].trial_days || undefined, // Add trial_days if available
  } : null;
  
  const formatPrice = (amountCents: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amountCents / 100);
  };

  const handleAddToCart = () => {
    if (primaryPrice) {
      addItem({
        id: product.id,
        title: (product as any).name, // Temporarily cast to any
        price: primaryPrice.unit_amount / 100,
        currency: primaryPrice.currency,
        format: 'digital' // Added a placeholder format
      });
    }
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
              onClick={() => onCheckoutProduct(product, primaryPrice)}
              className="w-full bg-primary text-white py-3 px-4 rounded-xl font-medium hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background-light transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
            >
              <ShoppingCart className="w-5 h-5" />
              <span>
                {(product.product_type === 'chapter_pass' || product.product_type === 'arc_pass') ? 'Start Subscription' : 'Buy Now'}
              </span>
            </button>
          </div>

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
    </>
  );
};


