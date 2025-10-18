import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
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
  Settings,
  Shield,
  Zap,
  Star,
  Gift,
  Crown,
  Award
} from 'lucide-react';
import BuyMeACoffeeWidget from '../components/BuyMeACoffeeWidget';
import PayPalDonationButton from '../components/PayPalDonationButton';
import KoFiWidget from '../components/KoFiWidget';
import CryptoWalletDonation from '../components/CryptoWalletDonation';

// Types
interface DonationSettings {
  pageTitle: string;
  pageDescription: string;
  goalAmount?: number;
  currentAmount?: number;
  showProgress: boolean;
  thankYouMessage: string;
  isEnabled: boolean;
}

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  popular?: boolean;
  enabled: boolean;
  icon?: React.ReactNode;
}

interface CryptoWallet {
  id: string;
  name: string;
  symbol: string;
  address: string;
  enabled: boolean;
  color?: string;
  explorerUrl?: string;
  network?: string;
  description?: string;
}

interface PaymentMethods {
  buymeacoffee: { enabled: boolean; username: string };
  kofi: { enabled: boolean; username: string };
  paypal: { enabled: boolean; paypalId: string; quickAmounts: number[] };
  crypto: { enabled: boolean; wallets: CryptoWallet[] };
}

const SupportPage: React.FC = () => {
  // Load settings from localStorage (normally would come from Supabase)
  const [settings, setSettings] = useState<DonationSettings>({
    pageTitle: 'Support the Zoroastervers',
    pageDescription: 'Help bring the epic fantasy world of Zoroaster to life! Your support enables me to dedicate more time to writing, world-building, and creating immersive content for this universe.',
    goalAmount: 1000,
    currentAmount: 47,
    showProgress: true,
    thankYouMessage: 'Thank you for supporting the Zoroastervers! Your contribution helps bring this epic fantasy world to life.',
    isEnabled: true
  });

  const [donationTiers, setDonationTiers] = useState<DonationTier[]>([
    {
      id: '1',
      name: 'Coffee Supporter',
      amount: 5,
      description: 'Buy me a coffee to fuel late-night writing sessions',
      benefits: ['My heartfelt thanks', 'Recognition as a supporter', 'Access to supporter-only updates'],
      enabled: true,
      icon: <Coffee className="h-6 w-6" />
    },
    {
      id: '2', 
      name: 'Chapter Patron',
      amount: 15,
      description: 'Support the creation of a new chapter',
      benefits: ['Early access to new content', 'Behind-the-scenes updates', 'Name in chapter acknowledgments', 'Supporter Discord access'],
      popular: true,
      enabled: true,
      icon: <BookOpen className="h-6 w-6" />
    },
    {
      id: '3',
      name: 'World Builder',
      amount: 50,
      description: 'Help expand the Zoroastervers universe',
      benefits: ['All previous benefits', 'Monthly world-building insights', 'Character naming opportunity', 'Signed digital artwork'],
      enabled: true,
      icon: <Globe className="h-6 w-6" />
    },
    {
      id: '4',
      name: 'Epic Sponsor',
      amount: 100,
      description: 'Become a legendary supporter of the saga',
      benefits: ['All previous benefits', 'Monthly video calls', 'Story influence input', 'Custom character creation', 'Physical signed books'],
      enabled: true,
      icon: <Crown className="h-6 w-6" />
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethods>({
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
        {
          id: '1',
          name: 'Bitcoin',
          symbol: 'BTC',
          address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
          enabled: true,
          color: 'text-orange-500',
          explorerUrl: 'https://blockstream.info/address/',
          network: 'Bitcoin Mainnet',
          description: 'Primary Bitcoin wallet for donations'
        },
        {
          id: '2',
          name: 'Ethereum',
          symbol: 'ETH',
          address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2',
          enabled: true,
          color: 'text-blue-500',
          explorerUrl: 'https://etherscan.io/address/',
          network: 'Ethereum Mainnet',
          description: 'Ethereum wallet for ETH and ERC-20 tokens'
        }
      ]
    }
  });

  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('donation_settings');
    const savedTiers = localStorage.getItem('donation_tiers');
    const savedPaymentMethods = localStorage.getItem('payment_methods');
    const savedCryptoWallets = localStorage.getItem('crypto_wallets');

    if (savedSettings) setSettings(JSON.parse(savedSettings));
    if (savedTiers) setDonationTiers(JSON.parse(savedTiers));
    if (savedPaymentMethods) {
      const methods = JSON.parse(savedPaymentMethods);
      setPaymentMethods(prev => ({ ...prev, ...methods }));
    }
    if (savedCryptoWallets) {
      setPaymentMethods(prev => ({
        ...prev,
        crypto: { ...prev.crypto, wallets: JSON.parse(savedCryptoWallets) }
      }));
    }
  }, []);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAddress(label);
      toast.success(`${label} address copied!`);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const handlePayPalDonation = () => {
    const url = paymentMethods.paypal.paypalId.includes('@') 
      ? `https://www.paypal.com/paypalme/${paymentMethods.paypal.paypalId.split('@')[0]}`
      : `https://www.paypal.com/paypalme/${paymentMethods.paypal.paypalId}`;
    window.open(url, '_blank');
  };

  const progressPercentage = settings.goalAmount ? 
    Math.min((settings.currentAmount || 0) / settings.goalAmount * 100, 100) : 0;

  const enabledTiers = donationTiers.filter(tier => tier.enabled);
  const enabledWallets = paymentMethods.crypto.wallets.filter(w => w.enabled);

  if (!settings.isEnabled) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="p-8 text-center">
            <Settings className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">Support Page Unavailable</h2>
            <p className="text-muted-foreground">The support page is currently disabled. Please check back later.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Sparkles className="h-4 w-4" />
            Support the Zoroastervers
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent">
            {settings.pageTitle}
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed">
            {settings.pageDescription}
          </p>

          {/* Progress Section */}
          {settings.showProgress && settings.goalAmount && (
            <Card className="max-w-md mx-auto mb-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Current Goal</span>
                  </div>
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    ${settings.currentAmount} / ${settings.goalAmount}
                  </Badge>
                </div>
                
                <Progress 
                  value={progressPercentage} 
                  className="h-3 mb-3 bg-muted"
                />
                
                <p className="text-sm text-muted-foreground">
                  <strong>{progressPercentage.toFixed(1)}% funded</strong> • 
                  ${(settings.goalAmount - (settings.currentAmount || 0)).toFixed(0)} to go
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Quick Support Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {paymentMethods.buymeacoffee.enabled && (
            <Button 
              onClick={() => window.open(`https://www.buymeacoffee.com/${paymentMethods.buymeacoffee.username}`, '_blank')} 
              className="bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transition-all" 
              size="lg"
            >
              <Coffee className="h-5 w-5 mr-2" /> 
              Buy Me a Coffee
            </Button>
          )}
          {paymentMethods.kofi.enabled && (
            <Button 
              onClick={() => window.open(`https://ko-fi.com/${paymentMethods.kofi.username}`, '_blank')} 
              className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transition-all" 
              size="lg"
            >
              <Heart className="h-5 w-5 mr-2" /> 
              Support on Ko-fi
            </Button>
          )}
          {paymentMethods.paypal.enabled && (
            <Button 
              onClick={handlePayPalDonation} 
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all" 
              size="lg"
            >
              <Banknote className="h-5 w-5 mr-2" /> 
              Donate via PayPal
            </Button>
          )}
        </div>

        {/* Donation Tiers */}
        {enabledTiers.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Support Level</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Every contribution, no matter the size, helps bring the Zoroastervers to life. Choose the tier that works best for you.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {enabledTiers.map((tier) => (
                <Card 
                  key={tier.id} 
                  className={`relative transition-all duration-300 hover:shadow-xl hover:scale-105 cursor-pointer group ${
                    tier.popular 
                      ? 'border-primary shadow-lg bg-gradient-to-b from-primary/5 to-primary/10' 
                      : 'hover:border-primary/50'
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-primary to-purple-600 text-white px-4 py-1">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <CardHeader className="text-center pb-2">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-4 ${
                      tier.popular ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {tier.icon}
                    </div>
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="text-3xl font-bold text-primary">
                      ${tier.amount}
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <CardDescription className="text-center mb-6 text-sm">
                      {tier.description}
                    </CardDescription>

                    <div className="space-y-2 mb-6">
                      {tier.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>

                    <Button 
                      className={`w-full ${
                        tier.popular 
                          ? 'bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-700' 
                          : ''
                      }`}
                      variant={tier.popular ? 'default' : 'outline'}
                      onClick={() => window.open(`https://www.buymeacoffee.com/${paymentMethods.buymeacoffee.username}`, '_blank')}
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      Choose This Tier
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Payment Methods Grid */}
        <section className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Payment Methods</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose your preferred way to support. All methods are secure and trusted.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
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
        </section>

        {/* Cryptocurrency Section */}
        {paymentMethods.crypto.enabled && enabledWallets.length > 0 && (
          <section className="mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4 flex items-center justify-center gap-2">
                <Bitcoin className="h-8 w-8 text-orange-500" />
                Cryptocurrency Donations
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
                Support with your favorite cryptocurrency. All transactions are secure and decentralized.
              </p>
              
              {/* Security Warning */}
              <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                    <div className="text-left">
                      <h3 className="font-semibold text-amber-800 dark:text-amber-200 mb-1">Security Notice</h3>
                      <p className="text-sm text-amber-700 dark:text-amber-300">
                        Always double-check wallet addresses before sending. Cryptocurrency transactions are irreversible. 
                        Only send the exact cryptocurrency to its corresponding address.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {enabledWallets.map((wallet) => (
                <Card key={wallet.id} className="transition-all duration-300 hover:shadow-lg hover:border-primary/50">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center text-white font-bold`}>
                        {wallet.symbol.charAt(0)}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{wallet.name}</CardTitle>
                        <Badge variant="secondary" className={wallet.color || 'text-muted-foreground'}>
                          {wallet.symbol}
                        </Badge>
                      </div>
                    </div>
                    {wallet.network && (
                      <p className="text-sm text-muted-foreground">Network: {wallet.network}</p>
                    )}
                  </CardHeader>

                  <CardContent>
                    {wallet.description && (
                      <p className="text-sm text-muted-foreground mb-4">{wallet.description}</p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="bg-muted p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Wallet Address:</p>
                        <div className="flex items-center gap-2">
                          <code className="text-sm font-mono break-all flex-1">
                            {wallet.address}
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(wallet.address, wallet.symbol)}
                            className="flex-shrink-0"
                          >
                            {copiedAddress === wallet.symbol ? 
                              <Check className="h-4 w-4 text-green-500" /> : 
                              <Copy className="h-4 w-4" />
                            }
                          </Button>
                        </div>
                      </div>
                      
                      {wallet.explorerUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(wallet.explorerUrl + wallet.address, '_blank')}
                          className="w-full"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Blockchain
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Impact Stats */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 via-purple-500/5 to-blue-500/5 border-primary/20">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Project Impact</h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  See how your support helps bring the Zoroastervers to life
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary mb-1">12+</div>
                  <div className="text-sm text-muted-foreground">Chapters Written</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Users className="h-6 w-6 text-purple-500" />
                  </div>
                  <div className="text-2xl font-bold text-purple-500 mb-1">50+</div>
                  <div className="text-sm text-muted-foreground">Characters Created</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Globe className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-2xl font-bold text-blue-500 mb-1">5+</div>
                  <div className="text-sm text-muted-foreground">Worlds Designed</div>
                </div>
                
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <div className="text-2xl font-bold text-green-500 mb-1">100K+</div>
                  <div className="text-sm text-muted-foreground">Words Written</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Community Support */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-muted/50 to-muted/30">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">More Ways to Support</h2>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Not ready to donate? There are other ways you can help the Zoroastervers grow!
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4">
                  <Users className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Share & Follow</h3>
                  <p className="text-sm text-muted-foreground">Follow on social media and share with friends who love fantasy</p>
                </div>
                
                <div className="p-4">
                  <Star className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Review & Rate</h3>
                  <p className="text-sm text-muted-foreground">Leave reviews and ratings on reading platforms</p>
                </div>
                
                <div className="p-4">
                  <Award className="h-8 w-8 mx-auto mb-3 text-primary" />
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">Join discussions and provide feedback on the story</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Thank You Message */}
        <div className="text-center">
          <Card className="max-w-2xl mx-auto bg-gradient-to-r from-primary/10 to-purple-500/10 border-primary/20">
            <CardContent className="p-8">
              <Heart className="h-12 w-12 mx-auto mb-4 text-primary" />
              <p className="text-lg leading-relaxed text-muted-foreground">
                {settings.thankYouMessage}
              </p>
              <p className="text-sm text-muted-foreground mt-4 font-medium">
                — Sina Panahi, Creator of Zoroastervers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;