import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
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
  Check
} from 'lucide-react';

interface DonationTier {
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  popular?: boolean;
}

const donationTiers: DonationTier[] = [
  {
    name: "Coffee Supporter",
    amount: 5,
    description: "Buy me a coffee to fuel late night writing sessions",
    benefits: ["My heartfelt thanks", "Recognition as a supporter"]
  },
  {
    name: "Chapter Patron",
    amount: 15,
    description: "Support the creation of a new chapter",
    benefits: ["Early access to new content", "Behind-the-scenes updates", "Name in acknowledgments"],
    popular: true
  },
  {
    name: "Book Benefactor",
    amount: 50,
    description: "Help bring an entire book to life",
    benefits: ["All previous benefits", "Signed digital copy", "Character naming rights consultation"]
  },
  {
    name: "Epic Sponsor",
    amount: 100,
    description: "Become a major supporter of the Zoroastervers",
    benefits: ["All previous benefits", "Monthly video calls", "Input on story direction", "Special mention in book credits"]
  }
];

const cryptoWallets = {
  bitcoin: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh",
  ethereum: "0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2",
  solana: "7x8Y9Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S",
  cardano: "addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh..."
};

const SupportPage: React.FC = () => {
  const [selectedTier, setSelectedTier] = useState<DonationTier | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [showCrypto, setShowCrypto] = useState(false);
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);

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
    // Replace with your actual PayPal.me link or PayPal button integration
    const paypalUrl = `https://www.paypal.com/donate/?hosted_button_id=YOUR_BUTTON_ID&amount=${donationAmount}`;
    window.open(paypalUrl, '_blank');
  };

  const handleBuyMeACoffee = () => {
    // Replace with your actual Buy Me a Coffee link
    window.open('https://www.buymeacoffee.com/sinapanahi', '_blank');
  };

  const handleKoFi = () => {
    // Replace with your actual Ko-fi link  
    window.open('https://ko-fi.com/sinapanahi', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background/95 to-background/90">
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Support the Zoroastervers
            </h1>
            <Heart className="h-8 w-8 text-red-500 ml-3" />
          </div>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Help bring the epic fantasy world of Zoroaster to life! Your support enables me to dedicate more time to writing, 
            world-building, and creating the immersive experience that readers love. Every contribution, no matter the size, 
            makes a meaningful difference in this creative journey.
          </p>
        </div>

        {/* Impact Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center">
            <CardContent className="pt-6">
              <BookOpen className="h-8 w-8 text-blue-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">5 Books Planned</h3>
              <p className="text-sm text-muted-foreground">Epic fantasy series in development</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Growing Community</h3>
              <p className="text-sm text-muted-foreground">Dedicated readers and supporters</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="pt-6">
              <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <h3 className="font-semibold mb-1">Regular Updates</h3>
              <p className="text-sm text-muted-foreground">New chapters every month</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Support Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button 
            onClick={handleBuyMeACoffee}
            className="bg-yellow-500 hover:bg-yellow-600 text-white"
            size="lg"
          >
            <Coffee className="h-5 w-5 mr-2" />
            Buy Me a Coffee
          </Button>
          <Button 
            onClick={handleKoFi}
            className="bg-blue-500 hover:bg-blue-600 text-white"
            size="lg"
          >
            <Heart className="h-5 w-5 mr-2" />
            Support on Ko-fi
          </Button>
          <Button 
            onClick={() => handlePayPalDonation()}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            size="lg"
          >
            <Banknote className="h-5 w-5 mr-2" />
            Donate via PayPal
          </Button>
        </div>

        {/* Donation Tiers */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Support Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {donationTiers.map((tier, index) => (
              <Card 
                key={index} 
                className={`relative cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  tier.popular ? 'ring-2 ring-purple-500 scale-105' : ''
                } ${
                  selectedTier?.name === tier.name ? 'bg-primary/5 ring-2 ring-primary' : ''
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
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Custom Amount */}
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

        {/* Crypto Donations */}
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
            <Button 
              onClick={() => setShowCrypto(!showCrypto)}
              variant="outline" 
              className="mb-4"
            >
              {showCrypto ? 'Hide' : 'Show'} Crypto Wallets
            </Button>
            
            {showCrypto && (
              <div className="space-y-4">
                {Object.entries(cryptoWallets).map(([crypto, address]) => (
                  <div key={crypto} className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium capitalize text-sm">{crypto}</h4>
                      <Button
                        onClick={() => copyToClipboard(address, crypto)}
                        variant="ghost"
                        size="sm"
                        className="p-1"
                      >
                        {copiedWallet === crypto ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <code className="text-xs bg-background px-2 py-1 rounded break-all block">
                      {address}
                    </code>
                  </div>
                ))}
                <div className="text-xs text-muted-foreground mt-4">
                  ⚠️ Always double-check wallet addresses before sending. Cryptocurrency transactions are irreversible.
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Other Ways to Help */}
        <Card>
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
        <div className="text-center mt-12 p-8 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-red-500/10 rounded-lg">
          <h2 className="text-2xl font-bold mb-4">Thank You! 🙏</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your support means the world to me and directly contributes to bringing the Zoroastervers to life. 
            Whether you choose to donate, share, or simply read and enjoy the stories, you're helping to make this 
            creative journey possible. Every supporter is valued and appreciated!
          </p>
          <div className="mt-6">
            <p className="text-sm text-muted-foreground italic">
              "In the world of Zoroaster, even the smallest flame can illuminate the darkest night." 
              <br />— Thank you for being that flame.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportPage;