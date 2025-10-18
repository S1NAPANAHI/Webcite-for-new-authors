import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';

interface KoFiWidgetProps {
  username: string;
  className?: string;
  variant?: 'button' | 'card' | 'floating';
}

const KoFiWidget: React.FC<KoFiWidgetProps> = ({ username, className = '', variant = 'button' }) => {
  const url = `https://ko-fi.com/${username}`;

  const open = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-24 right-6 z-50 ${className}`}>
        <Button onClick={open} className="bg-red-500 hover:bg-red-600 text-white rounded-full h-14 w-14 p-0 shadow-lg">
          <Heart className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <Card className={`hover:shadow-lg transition-shadow cursor-pointer ${className}`} onClick={open}>
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-3">
            <Heart className="h-8 w-8 text-red-500 mr-2" />
            <h3 className="text-lg font-semibold">Ko-fi</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Support me on Ko-fi ❤️</p>
          <Button className="bg-red-500 hover:bg-red-600 text-white w-full" onClick={open}>
            <Heart className="h-4 w-4 mr-2" /> Support on Ko-fi
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Button onClick={open} className={`bg-red-500 hover:bg-red-600 text-white ${className}`}>
      <Heart className="h-4 w-4 mr-2" /> Support on Ko-fi <ExternalLink className="h-4 w-4 ml-2" />
    </Button>
  );
};

export default KoFiWidget;
