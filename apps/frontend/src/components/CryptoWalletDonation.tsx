import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Bitcoin, 
  Copy, 
  Check, 
  ExternalLink,
  QrCode,
  Wallet,
  AlertTriangle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CryptoWallet {
  name: string;
  symbol: string;
  address: string;
  icon?: React.ReactNode;
  color?: string;
  scanUrl?: string; // For blockchain explorers
}

interface CryptoWalletDonationProps {
  wallets?: CryptoWallet[];
  className?: string;
  variant?: 'compact' | 'detailed' | 'grid';
  showQRCodes?: boolean;
  title?: string;
  description?: string;
}

// Default wallet configurations - Replace these with your actual wallet addresses
const defaultWallets: CryptoWallet[] = [
  {
    name: 'Bitcoin',
    symbol: 'BTC',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    color: 'text-orange-500',
    scanUrl: 'https://blockstream.info/address/'
  },
  {
    name: 'Ethereum',
    symbol: 'ETH',
    address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2',
    color: 'text-blue-500',
    scanUrl: 'https://etherscan.io/address/'
  },
  {
    name: 'Solana',
    symbol: 'SOL',
    address: '7x8Y9Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S',
    color: 'text-purple-500',
    scanUrl: 'https://solscan.io/account/'
  },
  {
    name: 'Cardano',
    symbol: 'ADA',
    address: 'addr1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh5tx8yz9abc...',
    color: 'text-blue-600',
    scanUrl: 'https://cardanoscan.io/address/'
  },
  {
    name: 'Polygon',
    symbol: 'MATIC',
    address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2',
    color: 'text-purple-600',
    scanUrl: 'https://polygonscan.com/address/'
  },
  {
    name: 'Litecoin',
    symbol: 'LTC',
    address: 'ltc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    color: 'text-gray-500',
    scanUrl: 'https://blockchair.com/litecoin/address/'
  }
];

const CryptoWalletDonation: React.FC<CryptoWalletDonationProps> = ({
  wallets = defaultWallets,
  className = '',
  variant = 'detailed',
  showQRCodes = false,
  title = 'Cryptocurrency Donations',
  description = 'Support with your favorite cryptocurrency'
}) => {
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  const [expandedWallets, setExpandedWallets] = useState<Set<string>>(new Set());
  const [showAll, setShowAll] = useState(false);

  const copyToClipboard = async (address: string, symbol: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedWallet(symbol);
      toast.success(`${symbol} address copied to clipboard!`);
      setTimeout(() => setCopiedWallet(null), 2000);
    } catch (err) {
      toast.error('Failed to copy address');
    }
  };

  const toggleWallet = (symbol: string) => {
    const newExpanded = new Set(expandedWallets);
    if (newExpanded.has(symbol)) {
      newExpanded.delete(symbol);
    } else {
      newExpanded.add(symbol);
    }
    setExpandedWallets(newExpanded);
  };

  const openBlockchainExplorer = (wallet: CryptoWallet) => {
    if (wallet.scanUrl) {
      window.open(wallet.scanUrl + wallet.address, '_blank', 'noopener,noreferrer');
    }
  };

  const displayWallets = showAll ? wallets : wallets.slice(0, 3);

  if (variant === 'compact') {
    return (
      <div className={`space-y-3 ${className}`}>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center">
            <Wallet className="h-5 w-5 mr-2" />
            {title}
          </h3>
          <Button
            onClick={() => setShowAll(!showAll)}
            variant="ghost"
            size="sm"
            className="text-xs"
          >
            {showAll ? 'Show Less' : `+${wallets.length - 3} More`}
          </Button>
        </div>
        
        {displayWallets.map((wallet) => (
          <div key={wallet.symbol} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <Bitcoin className={`h-5 w-5 ${wallet.color || 'text-orange-500'}`} />
              <div>
                <span className="font-medium">{wallet.name}</span>
                <Badge variant="secondary" className="ml-2 text-xs">{wallet.symbol}</Badge>
              </div>
            </div>
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
        ))}
      </div>
    );
  }

  if (variant === 'grid') {
    return (
      <div className={className}>
        <div className="text-center mb-6">
          <h3 className="text-xl font-bold mb-2 flex items-center justify-center">
            <Wallet className="h-6 w-6 mr-2" />
            {title}
          </h3>
          <p className="text-muted-foreground">{description}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {wallets.map((wallet) => (
            <Card key={wallet.symbol} className="hover:shadow-lg transition-shadow">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center mb-2">
                  <Bitcoin className={`h-8 w-8 ${wallet.color || 'text-orange-500'}`} />
                </div>
                <CardTitle className="text-lg">{wallet.name}</CardTitle>
                <Badge variant="secondary">{wallet.symbol}</Badge>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-2 bg-muted/30 rounded text-center">
                    <code className="text-xs break-all">
                      {wallet.address.length > 20 
                        ? `${wallet.address.slice(0, 10)}...${wallet.address.slice(-10)}`
                        : wallet.address
                      }
                    </code>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => copyToClipboard(wallet.address, wallet.symbol)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    >
                      {copiedWallet === wallet.symbol ? (
                        <Check className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      Copy
                    </Button>
                    {wallet.scanUrl && (
                      <Button
                        onClick={() => openBlockchainExplorer(wallet)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <ExternalLink className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Detailed variant (default)
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Wallet className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>
          {description}
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

          {/* Wallet List */}
          {wallets.map((wallet) => (
            <div key={wallet.symbol} className="border border-border rounded-lg">
              <div 
                className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/50"
                onClick={() => toggleWallet(wallet.symbol)}
              >
                <div className="flex items-center space-x-3">
                  <Bitcoin className={`h-6 w-6 ${wallet.color || 'text-orange-500'}`} />
                  <div>
                    <h4 className="font-medium">{wallet.name}</h4>
                    <Badge variant="secondary" className="text-xs">{wallet.symbol}</Badge>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      copyToClipboard(wallet.address, wallet.symbol);
                    }}
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
                  {expandedWallets.has(wallet.symbol) ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </div>
              
              {expandedWallets.has(wallet.symbol) && (
                <div className="px-4 pb-4 border-t">
                  <div className="mt-3 space-y-3">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground mb-1 block">
                        Wallet Address:
                      </label>
                      <div className="p-3 bg-muted/30 rounded border">
                        <code className="text-sm break-all">{wallet.address}</code>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => copyToClipboard(wallet.address, wallet.symbol)}
                        variant="outline"
                        size="sm"
                        className="flex-1"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Full Address
                      </Button>
                      {wallet.scanUrl && (
                        <Button
                          onClick={() => openBlockchainExplorer(wallet)}
                          variant="outline"
                          size="sm"
                          className="flex-1"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          View on Blockchain
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CryptoWalletDonation;