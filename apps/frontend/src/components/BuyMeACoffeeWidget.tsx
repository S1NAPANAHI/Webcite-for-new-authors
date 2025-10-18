import React from 'react';
import { Coffee, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface BuyMeACoffeeWidgetProps {
  username?: string;
  className?: string;
  variant?: 'button' | 'card' | 'floating';
  size?: 'sm' | 'md' | 'lg';
}

const BuyMeACoffeeWidget: React.FC<BuyMeACoffeeWidgetProps> = ({
  username = 'sinapanahi', // Your Buy Me a Coffee username
  className = '',
  variant = 'button',
  size = 'md'
}) => {
  const buyMeCoffeeUrl = `https://www.buymeacoffee.com/${username}`;

  const handleClick = () => {
    window.open(buyMeCoffeeUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'px-3 py-2 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg'
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={handleClick}
          className={`
            bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg
            rounded-full h-14 w-14 p-0
            transition-all duration-300 hover:scale-110
          `}
          title="Buy me a coffee"
        >
          <Coffee className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`} onClick={handleClick}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Coffee className="h-8 w-8 text-yellow-500 mr-2" />
            <h3 className="text-lg font-semibold">Buy Me a Coffee</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Support my work with a virtual coffee! ☕
          </p>
          <Button 
            className="bg-yellow-500 hover:bg-yellow-600 text-white w-full"
            onClick={(e) => {
              e.stopPropagation();
              handleClick();
            }}
          >
            <Coffee className="h-4 w-4 mr-2" />
            Buy Coffee
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Default button variant
  return (
    <Button
      onClick={handleClick}
      className={`
        bg-yellow-500 hover:bg-yellow-600 text-white
        ${sizeClasses[size]} ${className}
      `}
    >
      <Coffee className={`h-4 w-4 mr-2 ${size === 'lg' ? 'h-5 w-5' : ''}`} />
      Buy Me a Coffee
      <ExternalLink className={`h-3 w-3 ml-2 ${size === 'lg' ? 'h-4 w-4' : ''}`} />
    </Button>
  );
};

export default BuyMeACoffeeWidget;