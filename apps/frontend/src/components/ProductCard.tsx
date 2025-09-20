import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@zoroaster/ui';
import { Badge, Button } from '@zoroaster/ui';
import { ShoppingCart, Star, Eye } from 'lucide-react';

interface ProductCardProps {
  id: string;
  title: string;
  description?: string;
  price: number;
  image?: string;
  category?: string;
  rating?: number;
  views?: number;
  onAddToCart?: (id: string) => void;
  onClick?: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  image,
  category,
  rating,
  views,
  onAddToCart,
  onClick
}) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <Card className="group relative overflow-hidden bg-card border-border hover:shadow-lg transition-all duration-300 cursor-pointer product-card-hover" onClick={onClick}>
      {/* Product Image */}
      {image && (
        <div className="relative h-48 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {/* Category Badge */}
          {category && (
            <Badge 
              variant="secondary"
              className="absolute top-3 left-3"
            >
              {category}
            </Badge>
          )}
        </div>
      )}

      <CardHeader className="space-y-3">
        <div className="space-y-2">
          <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {title}
          </CardTitle>
          
          {description && (
            <CardDescription className="text-muted-foreground line-clamp-3">
              {description}
            </CardDescription>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-primary">
            {formatPrice(price)}
          </span>
          
          {/* Rating & Views */}
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-current text-yellow-400" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            
            {views && (
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{views}</span>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 mr-2"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            View Details
          </Button>
          
          <Button
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.(id);
            }}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;