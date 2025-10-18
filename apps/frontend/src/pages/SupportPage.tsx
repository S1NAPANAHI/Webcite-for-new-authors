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
  Target
} from 'lucide-react';
import BuyMeACoffeeWidget from '../components/BuyMeACoffeeWidget';
import PayPalDonationButton from '../components/PayPalDonationButton';

// Temporary static configuration - replace with your actual info
const donationSettings = {
  pageTitle: 'Support the Zoroastervers',
  pageDescription: 'Help bring the epic fantasy world of Zoroaster to life! Your support enables me to dedicate more time to writing, world-building, and creating the immersive experience that readers love.',
  goalAmount: 1000,
  currentAmount: 0,
  showProgress: true,
  isEnabled: true,
  thankYouMessage: 'Thank you for supporting the Zoroastervers! Your contribution helps bring this epic fantasy world to life.',
  impactStats: [
    { icon: 'BookOpen', title: '5 Books Planned', description: 'Epic fantasy series in development' },
    { icon: 'Users', title: 'Growing Community', description: 'Dedicated readers and supporters' },
    { icon: 'Sparkles', title: 'Regular Updates', description: 'New chapters every month' }
  ]
};

const donationTiers = [
  {
    id: '1',
    name: 'Coffee Supporter',
    amount: 5,
    description: 'Buy me a coffee to fuel late night writing sessions',
    benefits: ['My heartfelt thanks', 'Recognition as a supporter'],
    enabled: true
  },
  {
    id: '2', 
    name: 'Chapter Patron',
    amount: 15,
    description: 'Support the creation of a new chapter',
    benefits: ['Early access to new content', 'Behind-the-scenes updates', 'Name in acknowledgments'],
    popular: true,
    enabled: true
  },
  {
    id: '3',
    name: 'Book Benefactor', 
    amount: 50,
    description: 'Help bring an entire book to life',
    benefits: ['All previous benefits', 'Signed digital copy', 'Character naming rights consultation'],
    enabled: true
  },
  {
    id: '4',
    name: 'Epic Sponsor',
    amount: 100,
    description: 'Become a major supporter of the Zoroastervers',
    benefits: ['All previous benefits', 'Monthly video calls', 'Input on story direction', 'Special mention in book credits'],
    enabled: true
  }
];

// Payment methods configuration - REPLACE WITH YOUR INFO
const paymentMethods = {
  buymeacoffee: {
    enabled: true,
    username: 'sinapanahi' // Replace with YOUR Buy Me a Coffee username
  },
  paypal: {
    enabled: true,
    paypalId: 'your-paypal-email@example.com', // Replace with YOUR PayPal info
    quickAmounts: [5, 10, 25, 50]
  },
  crypto: {
    enabled: true,
    wallets: [
      { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' }, // Replace with YOUR BTC address
      { name: 'Ethereum', symbol: 'ETH', address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2' } // Replace with YOUR ETH address
    ]
  }
};

const SupportPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<any>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

  // Load settings from localStorage if available
  const [settings] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_settings');
      return saved ? { ...donationSettings, ...JSON.parse(saved) } : donationSettings;
    } catch {
      return donationSettings;
    }
  });

  const [tiers] = useState(() => {
    try {
      const saved = localStorage.getItem('donation_tiers');
      return saved ? JSON.parse(saved) : donationTiers;
    } catch {
      return donationTiers;
    }
  });

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
    
    if (paymentMethods.paypal.paypalId.includes('@')) {
      paypalUrl = `https://www.paypal.com/donate/?business=${encodeURIComponent(paymentMethods.paypal.paypalId)}&amount=${donationAmount}&currency_code=USD`;
    } else {
      paypalUrl = `https://paypal.me/${paymentMethods.paypal.paypalId}/${donationAmount}USD`;
    }
    
    window.open(paypalUrl, '_blank');
  };

  const handleBuyMeACoffee = () => {
    window.open(`https://www.buymeacoffee.com/${paymentMethods.buymeacoffee.username}`, '_blank');
  };

  const progressPercentage = settings.goalAmount ? 
    Math.min((settings.currentAmount || 0) / settings.goalAmount * 100, 100) : 0;

  const activeTiers = tiers.filter(tier => tier.enabled);

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
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="text-center text-sm text-muted-foreground">
                {progressPercentage.toFixed(1)}% complete
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
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {paymentMethods.buymeacoffee.enabled && (
            <Button 
              onClick={handleBuyMeACoffee}
              className="bg-yellow-500 hover:bg-yellow-600 text-white"
              size="lg"
            >
              <Coffee className="h-5 w-5 mr-2" />
              Buy Me a Coffee
            </Button>
          )}
          {paymentMethods.paypal.enabled && (
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
                    {paymentMethods.paypal.enabled && (
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
        {paymentMethods.paypal.enabled && (
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
        {paymentMethods.crypto.enabled && (
          <Card className="mb-12">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bitcoin className="h-5 w-5 mr-2" />
                Cryptocurrency Donations
              </CardTitle>
              <CardDescription>
                Prefer to donate with crypto? Use any of the wallet addresses below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Security Warning */}
                <div className="flex items-start p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">Security Notice</p>
                    <p className="text-yellow-700 dark:text-yellow-300">
                      Always double-check wallet addresses before sending. Cryptocurrency transactions are irreversible.
                    </p>
                  </div>
                </div>
                
                {/* Crypto Wallets */}
                <div className="grid gap-4">
                  {paymentMethods.crypto.wallets.map((wallet) => (
                    <div key={wallet.symbol} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Bitcoin className="h-6 w-6 text-orange-500" />
                        <div>
                          <h4 className="font-medium">{wallet.name}</h4>
                          <Badge variant="secondary" className="text-xs">{wallet.symbol}</Badge>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                          {wallet.address.length > 20 
                            ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-6)}`
                            : wallet.address
                          }
                        </code>
                        <Button
                          onClick={() => copyToClipboard(wallet.address, wallet.symbol)}
                          variant="ghost"
                          size="sm"
                          className="p-2"
                        >
                          {copiedWallet === wallet.symbol ? (
                            <Check className="h-4 w-4 text-green-500" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {paymentMethods.buymeacoffee.enabled && (
            <BuyMeACoffeeWidget 
              username={paymentMethods.buymeacoffee.username}
              variant="card"
            />
          )}
          {paymentMethods.paypal.enabled && (
            <PayPalDonationButton 
              paypalId={paymentMethods.paypal.paypalId}
              quickAmounts={paymentMethods.paypal.quickAmounts}
              variant="card"
            />
          )}
        </div>

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

        {/* Configuration Notice for Admin */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-start">
            <Settings className="h-5 w-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-blue-800 dark:text-blue-200">Admin Configuration</p>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                To customize this page, update the configuration in the source code or use the 
                <a href="/admin/donations" className="text-primary hover:underline ml-1">
                  admin panel
                </a> (once fully configured).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;