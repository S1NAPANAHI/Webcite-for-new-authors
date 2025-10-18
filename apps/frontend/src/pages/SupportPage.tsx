import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
  Target
} from 'lucide-react';
import { 
  useDonation, 
  useActiveTiers, 
  useActivePaymentMethods,
  usePaymentMethodConfig 
} from '../contexts/DonationContext';
import BuyMeACoffeeWidget from '../components/BuyMeACoffeeWidget';
import PayPalDonationButton from '../components/PayPalDonationButton';
import CryptoWalletDonation from '../components/CryptoWalletDonation';

const SupportPage: React.FC = () => {
  const { settings, stats } = useDonation();
  const activeTiers = useActiveTiers();
  const activePaymentMethods = useActivePaymentMethods();
  const coffeeConfig = usePaymentMethodConfig('buymeacoffee');
  const paypalConfig = usePaymentMethodConfig('paypal');
  const kofiConfig = usePaymentMethodConfig('kofi');
  const cryptoConfig = usePaymentMethodConfig('crypto');
  
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  // If donations are disabled, show a message
  if (!settings.isEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="text-center">
            <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-4xl font-bold mb-4">Support Page</h1>
            <p className="text-lg text-muted-foreground">
              Donations are currently not available. Please check back later!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedWallet(type);
      toast.success(`${type} address copied to clipboard!`);
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  const handlePayPalDonation = (amount?: number) => {
    const donationAmount = amount || parseFloat(customAmount) || 5;
    let paypalUrl;
    
    if (paypalConfig.buttonId) {
      paypalUrl = `https://www.paypal.com/donate/?hosted_button_id=${paypalConfig.buttonId}&amount=${donationAmount}`;
    } else if (paypalConfig.paypalId?.includes('@')) {
      paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(paypalConfig.paypalId)}&amount=${donationAmount}&currency_code=USD`;
    } else {
      paypalUrl = `https://paypal.me/${paypalConfig.paypalId}/${donationAmount}USD`;
    }
    
    window.open(paypalUrl, '_blank');
  };

  const handleBuyMeACoffee = () => {
    if (coffeeConfig.username) {
      window.open(`https://www.buymeacoffee.com/${coffeeConfig.username}`, '_blank');
    } else {
      toast.error('Buy Me a Coffee is not properly configured');
    }
  };

  const handleKoFi = () => {
    if (kofiConfig.username) {
      window.open(`https://ko-fi.com/${kofiConfig.username}`, '_blank');
    } else {
      toast.error('Ko-fi is not properly configured');
    }
  };

  const isBuyMeCoffeeEnabled = activePaymentMethods.some(m => m.type === 'buymeacoffee');
  const isPayPalEnabled = activePaymentMethods.some(m => m.type === 'paypal');
  const isKoFiEnabled = activePaymentMethods.some(m => m.type === 'kofi');
  const isCryptoEnabled = activePaymentMethods.some(m => m.type === 'crypto');

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              {settings.pageTitle}
            </h1>
            <Heart className="h-8 w-8 text-red-500 ml-3" />
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            {settings.pageDescription}
          </p>
        </div>

        {/* Progress Bar */}
        {settings.showProgress && settings.goalAmount && (
          <Card className="mb-12">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Fundraising Goal
                </h3>
                <div className="text-right">
                  <div className="text-2xl font-bold">${settings.currentAmount || 0}</div>
                  <div className="text-sm text-muted-foreground">of ${settings.goalAmount} goal</div>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-4 mb-2">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-4 rounded-full transition-all duration-500"
                  style={{ width: `${stats.goalProgress}%` }}
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {stats.goalProgress.toFixed(1)}% complete • {stats.donorCount} supporters
              </div>
            </CardContent>
          </Card>
        )}

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {settings.impactStats.map((stat, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                {stat.icon === 'BookOpen' && <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />}
                {stat.icon === 'Users' && <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />}
                {stat.icon === 'Sparkles' && <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />}
                <h3 className="font-semibold mb-1">{stat.title}</h3>
                <p className="text-sm text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Support Buttons */}
        {(isBuyMeCoffeeEnabled || isPayPalEnabled || isKoFiEnabled) && (
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {isBuyMeCoffeeEnabled && (
              <Button 
                onClick={handleBuyMeACoffee}
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
                size="lg"
              >
                <Coffee className="h-5 w-5 mr-2" />
                Buy Me a Coffee
              </Button>
            )}
            {isKoFiEnabled && (
              <Button 
                onClick={handleKoFi}
                className="bg-blue-500 hover:bg-blue-600 text-white"
                size="lg"
              >
                <Heart className="h-5 w-5 mr-2" />
                Support on Ko-fi
              </Button>
            )}
            {isPayPalEnabled && (
              <Button 
                onClick={() => handlePayPalDonation()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Banknote className="h-5 w-5 mr-2" />
                Donate via PayPal
              </Button>
            )}
          </div>
        )}

        {/* Donation Tiers */}
        {activeTiers.length > 0 && (
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-center mb-8">Support Tiers</h2>
            <div className={`grid gap-6 ${
              activeTiers.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
              activeTiers.length === 2 ? 'grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto' :
              activeTiers.length === 3 ? 'grid-cols-1 md:grid-cols-3 max-w-5xl mx-auto' :
              'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
            }`}>
              {activeTiers.map((tier) => (
                <Card 
                  key={tier.id} 
                  className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    tier.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                  } ${
                    selectedTier?.id === tier.id ? 'bg-primary/5 ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedTier(tier)}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500">
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-lg">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">${tier.amount}</div>
                    <CardDescription className="text-sm">{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {tier.benefits.map((benefit, idx) => (
                        <li key={idx} className="text-sm flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                    {isPayPalEnabled && (
                      <Button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePayPalDonation(tier.amount);
                        }}
                        className="w-full"
                        variant={tier.popular ? "default" : "outline"}
                      >
                        Support ${tier.amount}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Custom Amount */}
        {isPayPalEnabled && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Wallet className="h-5 w-5 mr-2" />
                Custom Amount
              </CardTitle>
              <CardDescription>
                Want to contribute a different amount? Enter your preferred donation below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-center">
                <div className="flex-1 max-w-xs">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">$</span>
                    <input
                      type="number"
                      placeholder="25.00"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      className="w-full pl-8 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      min="1"
                      step="0.01"
                    />
                  </div>
                </div>
                <Button 
                  onClick={() => handlePayPalDonation()}
                  disabled={!customAmount || parseFloat(customAmount) < 1}
                  className="bg-green-600 hover:bg-green-700"
                >
                  Donate ${customAmount || '0.00'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Crypto Donations */}
        {isCryptoEnabled && cryptoConfig.wallets && cryptoConfig.wallets.length > 0 && (
          <div className="mb-12">
            <CryptoWalletDonation 
              wallets={cryptoConfig.wallets}
              variant="detailed"
              title="Cryptocurrency Donations"
              description="Prefer to donate with crypto? Use any of the wallet addresses below."
            />
          </div>
        )}

        {/* Payment Methods Grid */}
        {(isBuyMeCoffeeEnabled || isKoFiEnabled || isPayPalEnabled) && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {isBuyMeCoffeeEnabled && (
              <BuyMeACoffeeWidget 
                username={coffeeConfig.username}
                variant="card"
              />
            )}
            {isPayPalEnabled && (
              <PayPalDonationButton 
                paypalId={paypalConfig.paypalId}
                buttonId={paypalConfig.buttonId}
                quickAmounts={paypalConfig.quickAmounts}
                variant="card"
              />
            )}
            {isKoFiEnabled && (
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleKoFi}>
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center mb-3">
                    <Heart className="h-8 w-8 text-red-500 mr-2" />
                    <h3 className="text-lg font-semibold">Ko-fi</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Support me with a Ko-fi donation! ❤️
                  </p>
                  <Button 
                    className="bg-red-500 hover:bg-red-600 text-white w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleKoFi();
                    }}
                  >
                    <Heart className="h-4 w-4 mr-2" />
                    Support on Ko-fi
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Other Ways to Help */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="h-5 w-5 mr-2" />
              Other Ways to Support
            </CardTitle>
            <CardDescription>
              Not able to donate? There are other meaningful ways to help!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">📚 Share & Review</h4>
                <p className="text-sm text-muted-foreground">
                  Share Zoroastervers with friends, leave reviews, and help spread the word about the series.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">💬 Join the Community</h4>
                <p className="text-sm text-muted-foreground">
                  Participate in discussions, provide feedback, and be part of the growing Zoroastervers community.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">🎨 Fan Content</h4>
                <p className="text-sm text-muted-foreground">
                  Create fan art, fan fiction, or other creative content inspired by the Zoroastervers universe.
                </p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-medium mb-2">📱 Follow & Subscribe</h4>
                <p className="text-sm text-muted-foreground">
                  Follow on social media and subscribe to newsletters for updates and exclusive content.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Thank You Message */}
        <div className="text-center p-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Thank You! 🙏</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            {settings.thankYouMessage}
          </p>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground italic">
              "In the world of Zoroaster, even the smallest flame can illuminate the darkest night." 
              <br />— Thank you for being that flame.
            </p>
          </div>
        </div>

        {/* No Payment Methods Warning (Admin Only) */}
        {activePaymentMethods.length === 0 && (
          <Alert className="mt-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              No payment methods are currently enabled. 
              <a href="/admin/donations" className="text-primary hover:underline ml-1">
                Configure payment methods in the admin area
              </a>
              .
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default SupportPage;