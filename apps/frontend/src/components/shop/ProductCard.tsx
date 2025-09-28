import React from 'react';
import { Star, ShoppingCart, Eye, Download, Book, Scroll, Crown, Sparkles } from 'lucide-react';
import { Database } from '../../types/supabase';

type Product = Database['public']['Tables']['products']['Row'];
type ProductWithVariants = Product & {
  product_variants: Database['public']['Tables']['product_variants']['Row'][];
  product_reviews: { rating: number }[];
};

interface ProductCardProps {
  product: ProductWithVariants;
  viewMode: 'grid' | 'list';
  user: any; // Replace with proper User type
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode, user }) => {
  // Calculate average rating
  const averageRating = product.product_reviews.length > 0
    ? product.product_reviews.reduce((sum, review) => sum + review.rating, 0) / product.product_reviews.length
    : 0;

  // Get price from variants or fallback
  const price = product.product_variants[0]?.price_amount || product.price_cents || 0;
  const formattedPrice = (price / 100).toFixed(2);

  // Product type icons
  const getProductIcon = (type: string) => {
    switch (type) {
      case 'book':
        return <Book className="w-5 h-5" />;
      case 'guide':
        return <Scroll className="w-5 h-5" />;
      case 'bundle':
        return <Crown className="w-5 h-5" />;
      case 'subscription':
        return <Sparkles className="w-5 h-5" />;
      default:
        return <Book className="w-5 h-5" />;
    }
  };

  // Product type colors
  const getProductTypeColor = (type: string) => {
    switch (type) {
      case 'book':
        return 'from-blue-600/20 to-cyan-600/20 border-cyan-500/30';
      case 'guide':
        return 'from-amber-600/20 to-orange-600/20 border-amber-500/30';
      case 'bundle':
        return 'from-purple-600/20 to-pink-600/20 border-purple-500/30';
      case 'subscription':
        return 'from-emerald-600/20 to-teal-600/20 border-emerald-500/30';
      default:
        return 'from-slate-600/20 to-slate-500/20 border-slate-500/30';
    }
  };

  const handleAddToCart = () => {
    // TODO: Implement add to cart functionality
    console.log('Add to cart:', product.id);
  };

  const handlePreview = () => {
    // TODO: Implement preview functionality
    console.log('Preview product:', product.id);
  };

  const handlePurchase = () => {
    // TODO: Implement direct purchase
    console.log('Purchase product:', product.id);
  };

  if (viewMode === 'list') {
    return (
      <div className="bg-gradient-to-r from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 hover:border-amber-500/50 transition-all duration-300 group">
        <div className="flex gap-6">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="relative w-32 h-48 rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50">
              {product.cover_image_url ? (
                <img 
                  src={product.cover_image_url} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  {getProductIcon(product.product_type)}
                </div>
              )}
              
              {/* Premium Badge */}
              {product.is_premium && (
                <div className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full">
                  <Crown className="w-3 h-3 inline mr-1" />
                  Premium
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getProductTypeColor(product.product_type)}`}>
                    {getProductIcon(product.product_type)}
                    {product.product_type.charAt(0).toUpperCase() + product.product_type.slice(1)}
                  </span>
                  {product.is_featured && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-red-600/20 to-red-500/20 border-red-500/30 text-red-300">
                      <Sparkles className="w-3 h-3" />
                      Featured
                    </span>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-amber-300 transition-colors">
                  {product.name}
                </h3>
                
                {product.subtitle && (
                  <p className="text-slate-400 text-sm mb-2">{product.subtitle}</p>
                )}
                
                <p className="text-slate-300 text-sm line-clamp-2 mb-3">
                  {product.description || 'No description available.'}
                </p>

                {/* Rating */}
                {product.product_reviews.length > 0 && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= averageRating 
                              ? 'text-amber-400 fill-current' 
                              : 'text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-slate-400 text-sm">
                      ({product.product_reviews.length} review{product.product_reviews.length !== 1 ? 's' : ''})
                    </span>
                  </div>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <div className="text-2xl font-bold text-amber-400">${formattedPrice}</div>
                {product.product_variants[0]?.compare_at_amount && (
                  <div className="text-slate-500 line-through text-sm">
                    ${(Number(product.product_variants[0].compare_at_amount) / 100).toFixed(2)}
                  </div>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              {product.preview_url && (
                <button 
                  onClick={handlePreview}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-100 rounded-lg transition-all"
                >
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
              )}
              
              <button 
                onClick={handleAddToCart}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 rounded-lg transition-all"
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
              
              <button 
                onClick={handlePurchase}
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium rounded-lg transition-all shadow-lg hover:shadow-amber-500/25"
              >
                <Download className="w-4 h-4" />
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-sm rounded-xl border border-slate-700/50 p-4 hover:border-amber-500/50 transition-all duration-300 group hover:shadow-xl hover:shadow-amber-500/10">
      {/* Product Image */}
      <div className="relative mb-4">
        <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-600/50">
          {product.cover_image_url ? (
            <img 
              src={product.cover_image_url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-slate-400">
              {getProductIcon(product.product_type)}
            </div>
          )}
        </div>
        
        {/* Badges */}
        <div className="absolute top-2 right-2 flex flex-col gap-1">
          {product.is_premium && (
            <div className="bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3" />
              Premium
            </div>
          )}
          {product.is_featured && (
            <div className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Featured
            </div>
          )}
        </div>

        {/* Product Type Badge */}
        <div className="absolute top-2 left-2">
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r ${getProductTypeColor(product.product_type)}`}>
            {getProductIcon(product.product_type)}
            {product.product_type.charAt(0).toUpperCase() + product.product_type.slice(1)}
          </span>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-3">
        <div>
          <h3 className="text-lg font-bold text-slate-100 mb-1 group-hover:text-amber-300 transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.subtitle && (
            <p className="text-slate-400 text-sm mb-2">{product.subtitle}</p>
          )}
          <p className="text-slate-300 text-sm line-clamp-2">
            {product.description || 'No description available.'}
          </p>
        </div>

        {/* Rating */}
        {product.product_reviews.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= averageRating 
                      ? 'text-amber-400 fill-current' 
                      : 'text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-slate-400 text-xs">
              ({product.product_reviews.length})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xl font-bold text-amber-400">${formattedPrice}</div>
            {product.product_variants[0]?.compare_at_amount && (
              <div className="text-slate-500 line-through text-xs">
                ${(Number(product.product_variants[0].compare_at_amount) / 100).toFixed(2)}
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            {product.preview_url && (
              <button 
                onClick={handlePreview}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-slate-100 text-sm rounded-lg transition-all"
              >
                <Eye className="w-4 h-4" />
                Preview
              </button>
            )}
            
            <button 
              onClick={handleAddToCart}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 hover:text-amber-200 border border-amber-500/30 hover:border-amber-500/50 text-sm rounded-lg transition-all"
            >
              <ShoppingCart className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
          
          <button 
            onClick={handlePurchase}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-medium text-sm rounded-lg transition-all shadow-lg hover:shadow-amber-500/25"
          >
            <Download className="w-4 h-4" />
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};