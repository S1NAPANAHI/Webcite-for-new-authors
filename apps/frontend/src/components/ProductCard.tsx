import React from 'react';
import { Star, Crown, Download, ShoppingCart } from 'lucide-react';
import type { Product } from '@zoroaster/shared';

interface ProductCardProps {
  product: Product;
  onCheckoutProduct?: (product: Product, price: any) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onCheckoutProduct }) => {
  const getProductTypeLabel = (type: string) => {
    switch (type) {
      case 'single_issue':
        return 'Single Issue';
      case 'bundle':
        return 'Bundle';
      case 'chapter_pass':
        return 'Chapter Pass';
      case 'arc_pass':
        return 'Arc Pass';
      default:
        return type;
    }
  };

  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'single_issue':
        return 'bg-accent/20 text-accent';
      case 'bundle':
        return 'bg-secondary/20 text-secondary';
      case 'chapter_pass':
        return 'bg-primary/20 text-primary';
      case 'arc_pass':
        return 'bg-gradient-to-r from-primary/20 to-secondary/20 text-primary';
      default:
        return 'bg-text-dark/20 text-text-dark';
    }
  };

  const handleCheckout = () => {
    if (onCheckoutProduct && product.prices && product.prices.length > 0) {
      onCheckoutProduct(product, product.prices[0]);
    }
  };

  const formatPrice = (price: any) => {
    if (!price) return 'Free';
    const amount = price.unit_amount / 100;
    return `$${amount.toFixed(2)}${price.interval ? `/${price.interval}` : ''}`;
  };

  return (
    <div className="bg-background-light/50 backdrop-blur-sm rounded-2xl p-6 border border-border/30 hover:border-secondary/50 transition-all duration-300 group">
      {/* Product Image Placeholder */}
      <div className="relative w-full h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-xl mb-4 overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Crown className="w-16 h-16 text-secondary/50" />
        </div>
        {/* Product Type Badge */}
        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${getProductTypeColor(product.product_type)}`}>
          {getProductTypeLabel(product.product_type)}
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <h3 className="text-xl font-heading text-text-light group-hover:text-secondary transition-colors">
          {product.name}
        </h3>
        
        {product.description && (
          <p className="text-text-dark text-sm line-clamp-2">
            {product.description}
          </p>
        )}

        {/* Pricing */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            {product.prices && product.prices.length > 0 ? (
              product.prices.map((price, index) => (
                <div key={index} className="text-lg font-semibold text-text-light">
                  {formatPrice(price)}
                </div>
              ))
            ) : (
              <div className="text-lg font-semibold text-accent">Free</div>
            )}
          </div>
          
          {/* Rating placeholder */}
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-secondary/30" />
            ))}
            <span className="text-text-dark text-sm ml-1">(0)</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          <button
            onClick={handleCheckout}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-secondary hover:bg-secondary-dark text-background rounded-xl transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase</span>
          </button>
          <button className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-xl transition-colors">
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
