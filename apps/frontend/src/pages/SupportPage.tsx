import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { toast } from 'react-hot-toast';
import { 
  Coffee, 
  Heart, 
  Wallet, 
  Copy, 
  ExternalLink,
  Bitcoin,
  Banknote,
  Globe,
  BookOpen,
  Sparkles,
  Users,
  Check,
  AlertTriangle,
  Target,
  Settings
} from 'lucide-react';
import BuyMeACoffeeWidget from '../components/BuyMeACoffeeWidget';
import PayPalDonationButton from '../components/PayPalDonationButton';
import KoFiWidget from '../components/KoFiWidget';

// Temporary static configuration - replace with your actual info
const donationSettings = { /* ...unchanged... */ } as const;

const donationTiers = [ /* ...unchanged... */ ];

// Payment methods configuration - REPLACE WITH YOUR INFO
const paymentMethods = {
  buymeacoffee: {
    enabled: true,
    username: 'sinapanahi'
  },
  kofi: {
    enabled: true,
    username: 'sinapanahi'
  },
  paypal: {
    enabled: true,
    paypalId: 'your-paypal-email@example.com',
    quickAmounts: [5, 10, 25, 50]
  },
  crypto: {
    enabled: true,
    wallets: [
      { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
      { name: 'Ethereum', symbol: 'ETH', address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2' }
    ]
  }
};

const SupportPage: React.FC = () => {
  // ...unchanged state and helpers...

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* ...header, progress, impact... */}

        {/* Quick Support Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {paymentMethods.buymeacoffee.enabled && (
            <Button onClick={() => window.open(`https://www.buymeacoffee.com/${paymentMethods.buymeacoffee.username}`, '_blank')} className="bg-yellow-500 hover:bg-yellow-600 text-white" size="lg">
              <Coffee className="h-5 w-5 mr-2" /> Buy Me a Coffee
            </Button>
          )}
          {paymentMethods.kofi.enabled && (
            <Button onClick={() => window.open(`https://ko-fi.com/${paymentMethods.kofi.username}`, '_blank')} className="bg-red-500 hover:bg-red-600 text-white" size="lg">
              <Heart className="h-5 w-5 mr-2" /> Support on Ko-fi
            </Button>
          )}
          {paymentMethods.paypal.enabled && (
            <Button onClick={() => handlePayPalDonation()} className="bg-blue-600 hover:bg-blue-700 text-white" size="lg">
              <Banknote className="h-5 w-5 mr-2" /> Donate via PayPal
            </Button>
          )}
        </div>

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {paymentMethods.buymeacoffee.enabled && (
            <BuyMeACoffeeWidget username={paymentMethods.buymeacoffee.username} variant="card" />
          )}
          {paymentMethods.paypal.enabled && (
            <PayPalDonationButton paypalId={paymentMethods.paypal.paypalId} quickAmounts={paymentMethods.paypal.quickAmounts} variant="card" />
          )}
          {paymentMethods.kofi.enabled && (
            <KoFiWidget username={paymentMethods.kofi.username} variant="card" />
          )}
        </div>

        {/* ...rest unchanged incl. thank-you, config notice... */}
      </div>
    </div>
  );
};

export default SupportPage;
