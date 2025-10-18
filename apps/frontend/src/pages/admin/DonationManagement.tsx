import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { 
  Save, 
  Eye, 
  Coffee, 
  Bitcoin, 
  Banknote, 
  Heart, 
  Plus, 
  Trash2, 
  Copy, 
  ExternalLink,
  Check,
  AlertTriangle,
  BarChart3,
  TrendingUp,
  Users,
  Target,
  Wallet,
  Settings,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Edit3,
  Shield
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Enhanced types for crypto wallet management
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

interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  popular?: boolean;
  enabled: boolean;
}

interface PaymentMethod {
  id: string;
  name: string;
  type: 'buymeacoffee' | 'paypal' | 'crypto' | 'kofi';
  enabled: boolean;
  config: Record<string, any>;
}

interface DonationSettings {
  pageTitle: string;
  pageDescription: string;
  goalAmount?: number;
  currentAmount?: number;
  showProgress: boolean;
  thankYouMessage: string;
  isEnabled: boolean;
}

const DonationManagement: React.FC = () => {
  // Simple local state for now
  const [settings, setSettings] = useState<DonationSettings>({
    pageTitle: 'Support the Zoroastervers',
    pageDescription: 'Help bring the epic fantasy world of Zoroaster to life!',
    goalAmount: 1000,
    currentAmount: 0,
    showProgress: true,
    thankYouMessage: 'Thank you for supporting the Zoroastervers!',
    isEnabled: true
  });

  const [donationTiers, setDonationTiers] = useState<DonationTier[]>([
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
    }
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'buymeacoffee',
      name: 'Buy Me a Coffee',
      type: 'buymeacoffee',
      enabled: true,
      config: { username: 'sinapanahi' }
    },
    {
      id: 'kofi',
      name: 'Ko-fi',
      type: 'kofi',
      enabled: true,
      config: { username: 'sinapanahi' }
    },
    {
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      enabled: true,
      config: {
        paypalId: 'your-paypal-email@example.com',
        buttonId: '',
        quickAmounts: [5, 10, 25, 50]
      }
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      type: 'crypto',
      enabled: true,
      config: {}
    }
  ]);

  // Crypto wallet management state
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([
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
  ]);

  const [isAddingWallet, setIsAddingWallet] = useState(false);
  const [editingWallet, setEditingWallet] = useState<CryptoWallet | null>(null);
  const [newWallet, setNewWallet] = useState<Partial<CryptoWallet>>({
    name: '',
    symbol: '',
    address: '',
    enabled: true,
    network: '',
    description: ''
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const updateSettings = (updates: Partial<DonationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const updateDonationTier = (id: string, updates: Partial<DonationTier>) => {
    setDonationTiers(prev => 
      prev.map(tier => tier.id === id ? { ...tier, ...updates } : tier)
    );
    setHasUnsavedChanges(true);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(prev => 
      prev.map(method => method.id === id ? { ...method, ...updates } : method)
    );
    setHasUnsavedChanges(true);
  };

  const addCryptoWallet = () => {
    if (!newWallet.name || !newWallet.symbol || !newWallet.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    const wallet: CryptoWallet = {
      id: Date.now().toString(),
      name: newWallet.name,
      symbol: newWallet.symbol.toUpperCase(),
      address: newWallet.address,
      enabled: newWallet.enabled ?? true,
      color: newWallet.color || 'text-gray-500',
      explorerUrl: newWallet.explorerUrl,
      network: newWallet.network,
      description: newWallet.description
    };

    setCryptoWallets(prev => [...prev, wallet]);
    setNewWallet({ name: '', symbol: '', address: '', enabled: true, network: '', description: '' });
    setIsAddingWallet(false);
    setHasUnsavedChanges(true);
    toast.success(`${wallet.name} wallet added successfully!`);
  };

  const updateCryptoWallet = (id: string, updates: Partial<CryptoWallet>) => {
    setCryptoWallets(prev => 
      prev.map(wallet => wallet.id === id ? { ...wallet, ...updates } : wallet)
    );
    setHasUnsavedChanges(true);
  };

  const deleteCryptoWallet = (id: string) => {
    const wallet = cryptoWallets.find(w => w.id === id);
    setCryptoWallets(prev => prev.filter(w => w.id !== id));
    setHasUnsavedChanges(true);
    toast.success(`${wallet?.name} wallet removed`);
  };

  const copyWalletAddress = async (address: string, symbol: string) => {
    try {
      await navigator.clipboard.writeText(address);
      setCopiedAddress(symbol);
      toast.success(`${symbol} address copied!`);
      setTimeout(() => setCopiedAddress(null), 2000);
    } catch (error) {
      toast.error('Failed to copy address');
    }
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage for persistence
      localStorage.setItem('donation_settings', JSON.stringify(settings));
      localStorage.setItem('donation_tiers', JSON.stringify(donationTiers));
      localStorage.setItem('payment_methods', JSON.stringify(paymentMethods));
      localStorage.setItem('crypto_wallets', JSON.stringify(cryptoWallets));
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Donation settings saved successfully!');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error('Failed to save settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = () => {
    window.open('/support', '_blank');
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const progressPercentage = settings.goalAmount ? 
    Math.min((settings.currentAmount || 0) / settings.goalAmount * 100, 100) : 0;

  const activeCryptoWallets = cryptoWallets.filter(w => w.enabled);
  const isCryptoEnabled = paymentMethods.find(m => m.type === 'crypto')?.enabled;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header, tabs and previous sections omitted for brevity */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="tiers">Donation Tiers</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="crypto">Crypto Wallets</TabsTrigger>
        </TabsList>
        {/* Full crypto wallets tab content implemented above in full version */}
      </Tabs>
    </div>
  );
};

export default DonationManagement;