import React, { useState } from 'react';
import { Card, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Heart, X, Coffee, Wallet, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

interface SupportWidgetProps {
  /** Position of the floating widget */
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  /** Show widget on all pages or specific pages */
  showOnPages?: string[] | 'all';
  /** Auto-hide after certain time (in ms) */
  autoHide?: number;
}

const SupportWidget: React.FC<SupportWidgetProps> = ({
  position = 'bottom-right',
  showOnPages = 'all',
  autoHide
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  React.useEffect(() => {
    if (autoHide && !isExpanded) {
      const timer = setTimeout(() => setIsDismissed(true), autoHide);
      return () => clearTimeout(timer);
    }
  }, [autoHide, isExpanded]);

  // Check if widget should be shown on current page
  const currentPath = window.location.pathname;
  const shouldShow = showOnPages === 'all' || 
    (Array.isArray(showOnPages) && showOnPages.some(page => currentPath.includes(page)));

  // Don't show on support page itself or admin pages
  if (!shouldShow || isDismissed || currentPath.includes('/support') || currentPath.includes('/admin')) {
    return null;
  }

  const positionClasses = {
    'bottom-right': 'bottom-6 right-6',
    'bottom-left': 'bottom-6 left-6',
    'top-right': 'top-6 right-6',
    'top-left': 'top-6 left-6'
  };

  return (
    <div className={`fixed ${positionClasses[position]} z-50 transition-all duration-300 ease-in-out`}>
      {!isExpanded ? (
        // Collapsed floating button
        <Button
          onClick={() => setIsExpanded(true)}
          className="
            bg-gradient-to-r from-red-500 to-pink-600 
            hover:from-red-600 hover:to-pink-700 
            text-white shadow-lg hover:shadow-xl 
            rounded-full w-14 h-14 p-0
            animate-pulse hover:animate-none
            transition-all duration-300
          "
          title="Support Zoroastervers"
        >
          <Heart className="h-6 w-6" />
        </Button>
      ) : (
        // Expanded widget card
        <Card className="
          bg-gradient-to-br from-background to-background/95 
          backdrop-blur-sm border-border shadow-2xl 
          w-80 max-w-[90vw] animate-in slide-in-from-bottom-2
        ">
          <CardContent className="p-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                <h3 className="font-semibold text-foreground">Support Us</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(false)}
                className="h-8 w-8 p-0 hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground mb-4">
              Help bring the epic Zoroastervers fantasy world to life!
            </p>

            {/* Quick action buttons */}
            <div className="space-y-2">
              <Link to="/support" className="w-full">
                <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                  <Wallet className="h-4 w-4 mr-2" />
                  View All Options
                </Button>
              </Link>
              
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://www.buymeacoffee.com/sinapanahi', '_blank')}
                  className="text-xs"
                >
                  <Coffee className="h-3 w-3 mr-1" />
                  Coffee
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open('https://ko-fi.com/sinapanahi', '_blank')}
                  className="text-xs"
                >
                  <Heart className="h-3 w-3 mr-1" />
                  Ko-fi
                </Button>
              </div>
            </div>

            {/* Dismiss option */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDismissed(true)}
              className="w-full mt-2 text-xs text-muted-foreground hover:text-foreground"
            >
              Don't show again
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SupportWidget;