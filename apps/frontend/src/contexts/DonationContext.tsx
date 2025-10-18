import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-hot-toast';

// Types for donation management
export interface DonationTier {
  id: string;
  name: string;
  amount: number;
  description: string;
  benefits: string[];
  popular?: boolean;
  enabled: boolean;
  order?: number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  type: 'buymeacoffee' | 'paypal' | 'crypto' | 'kofi';
  enabled: boolean;
  config: Record<string, any>;
}

export interface DonationSettings {
  pageTitle: string;
  pageDescription: string;
  goalAmount?: number;
  currentAmount?: number;
  showProgress: boolean;
  thankYouMessage: string;
  isEnabled: boolean;
  showOnHomepage: boolean;
  floatingWidget: boolean;
  impactStats: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export interface DonationStats {
  totalDonations: number;
  monthlyDonations: number;
  topTier: string;
  donorCount: number;
  goalProgress: number;
}

interface DonationContextType {
  // Settings
  settings: DonationSettings;
  updateSettings: (updates: Partial<DonationSettings>) => Promise<void>;
  
  // Donation Tiers
  donationTiers: DonationTier[];
  addDonationTier: (tier: Omit<DonationTier, 'id'>) => Promise<void>;
  updateDonationTier: (id: string, updates: Partial<DonationTier>) => Promise<void>;
  deleteDonationTier: (id: string) => Promise<void>;
  reorderTiers: (tiers: DonationTier[]) => Promise<void>;
  
  // Payment Methods
  paymentMethods: PaymentMethod[];
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => Promise<void>;
  
  // Analytics
  stats: DonationStats;
  refreshStats: () => Promise<void>;
  
  // State
  isLoading: boolean;
  hasUnsavedChanges: boolean;
  saveAllChanges: () => Promise<void>;
}

const DonationContext = createContext<DonationContextType | undefined>(undefined);

// Default configuration
const defaultSettings: DonationSettings = {
  pageTitle: 'Support the Zoroastervers',
  pageDescription: 'Help bring the epic fantasy world of Zoroaster to life! Your support enables me to dedicate more time to writing, world-building, and creating the immersive experience that readers love.',
  goalAmount: 1000,
  currentAmount: 0,
  showProgress: true,
  thankYouMessage: 'Thank you for supporting the Zoroastervers! Your contribution helps bring this epic fantasy world to life.',
  isEnabled: true,
  showOnHomepage: false,
  floatingWidget: false,
  impactStats: [
    { icon: 'BookOpen', title: '5 Books Planned', description: 'Epic fantasy series in development' },
    { icon: 'Users', title: 'Growing Community', description: 'Dedicated readers and supporters' },
    { icon: 'Sparkles', title: 'Regular Updates', description: 'New chapters every month' }
  ]
};

const defaultTiers: DonationTier[] = [
  {
    id: '1',
    name: 'Coffee Supporter',
    amount: 5,
    description: 'Buy me a coffee to fuel late night writing sessions',
    benefits: ['My heartfelt thanks', 'Recognition as a supporter'],
    enabled: true,
    order: 1
  },
  {
    id: '2', 
    name: 'Chapter Patron',
    amount: 15,
    description: 'Support the creation of a new chapter',
    benefits: ['Early access to new content', 'Behind-the-scenes updates', 'Name in acknowledgments'],
    popular: true,
    enabled: true,
    order: 2
  },
  {
    id: '3',
    name: 'Book Benefactor', 
    amount: 50,
    description: 'Help bring an entire book to life',
    benefits: ['All previous benefits', 'Signed digital copy', 'Character naming rights consultation'],
    enabled: true,
    order: 3
  },
  {
    id: '4',
    name: 'Epic Sponsor',
    amount: 100,
    description: 'Become a major supporter of the Zoroastervers',
    benefits: ['All previous benefits', 'Monthly video calls', 'Input on story direction', 'Special mention in book credits'],
    enabled: true,
    order: 4
  }
];

const defaultPaymentMethods: PaymentMethod[] = [
  {
    id: 'buymeacoffee',
    name: 'Buy Me a Coffee',
    type: 'buymeacoffee',
    enabled: true,
    config: {
      username: 'sinapanahi' // Replace with your username
    }
  },
  {
    id: 'kofi',
    name: 'Ko-fi',
    type: 'kofi',
    enabled: false,
    config: {
      username: 'sinapanahi' // Replace with your username
    }
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'paypal',
    enabled: true,
    config: {
      paypalId: 'your-paypal-email@example.com', // Replace with your PayPal info
      buttonId: '',
      quickAmounts: [5, 10, 25, 50]
    }
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    type: 'crypto',
    enabled: true,
    config: {
      wallets: [
        { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' }, // Replace with your BTC address
        { name: 'Ethereum', symbol: 'ETH', address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2' }, // Replace with your ETH address
        { name: 'Solana', symbol: 'SOL', address: '7x8Y9Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S' } // Replace with your SOL address
      ]
    }
  }
];

interface DonationProviderProps {
  children: ReactNode;
}

export const DonationProvider: React.FC<DonationProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<DonationSettings>(defaultSettings);
  const [donationTiers, setDonationTiers] = useState<DonationTier[]>(defaultTiers);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(defaultPaymentMethods);
  const [stats, setStats] = useState<DonationStats>({
    totalDonations: 0,
    monthlyDonations: 0,
    topTier: 'Chapter Patron',
    donorCount: 0,
    goalProgress: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Load settings from localStorage or backend on mount
  useEffect(() => {
    loadDonationData();
  }, []);

  const loadDonationData = async () => {
    try {
      setIsLoading(true);
      
      // Try to load from localStorage first (for persistence)
      const savedSettings = localStorage.getItem('donation_settings');
      const savedTiers = localStorage.getItem('donation_tiers');
      const savedMethods = localStorage.getItem('payment_methods');
      
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
      if (savedTiers) {
        setDonationTiers(JSON.parse(savedTiers));
      }
      if (savedMethods) {
        setPaymentMethods(JSON.parse(savedMethods));
      }
      
      // TODO: Replace with actual backend API call
      // const response = await fetch('/api/donations/config');
      // const data = await response.json();
      // setSettings(data.settings);
      // setDonationTiers(data.tiers);
      // setPaymentMethods(data.paymentMethods);
      
    } catch (error) {
      console.error('Failed to load donation data:', error);
      toast.error('Failed to load donation settings');
    } finally {
      setIsLoading(false);
    }
  };

  const saveDonationData = async () => {
    try {
      setIsLoading(true);
      
      // Save to localStorage (temporary persistence)
      localStorage.setItem('donation_settings', JSON.stringify(settings));
      localStorage.setItem('donation_tiers', JSON.stringify(donationTiers));
      localStorage.setItem('payment_methods', JSON.stringify(paymentMethods));
      
      // TODO: Replace with actual backend API call
      // await fetch('/api/donations/config', {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ settings, donationTiers, paymentMethods })
      // });
      
      setHasUnsavedChanges(false);
      toast.success('Donation settings saved successfully!');
      
    } catch (error) {
      console.error('Failed to save donation data:', error);
      toast.error('Failed to save donation settings');
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<DonationSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  };

  const addDonationTier = async (tierData: Omit<DonationTier, 'id'>) => {
    const newTier: DonationTier = {
      ...tierData,
      id: Date.now().toString(),
      order: donationTiers.length + 1
    };
    setDonationTiers(prev => [...prev, newTier]);
    setHasUnsavedChanges(true);
  };

  const updateDonationTier = async (id: string, updates: Partial<DonationTier>) => {
    setDonationTiers(prev => 
      prev.map(tier => tier.id === id ? { ...tier, ...updates } : tier)
    );
    setHasUnsavedChanges(true);
  };

  const deleteDonationTier = async (id: string) => {
    setDonationTiers(prev => prev.filter(tier => tier.id !== id));
    setHasUnsavedChanges(true);
  };

  const reorderTiers = async (tiers: DonationTier[]) => {
    const reorderedTiers = tiers.map((tier, index) => ({
      ...tier,
      order: index + 1
    }));
    setDonationTiers(reorderedTiers);
    setHasUnsavedChanges(true);
  };

  const updatePaymentMethod = async (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(prev => 
      prev.map(method => method.id === id ? { ...method, ...updates } : method)
    );
    setHasUnsavedChanges(true);
  };

  const refreshStats = async () => {
    try {
      // TODO: Replace with actual analytics API
      // const response = await fetch('/api/donations/stats');
      // const statsData = await response.json();
      // setStats(statsData);
      
      // Mock data for now
      const goalProgress = settings.goalAmount && settings.currentAmount 
        ? (settings.currentAmount / settings.goalAmount) * 100 
        : 0;
      
      setStats({
        totalDonations: settings.currentAmount || 0,
        monthlyDonations: Math.floor((settings.currentAmount || 0) * 0.3),
        topTier: donationTiers.find(t => t.popular)?.name || 'Chapter Patron',
        donorCount: Math.floor((settings.currentAmount || 0) / 15), // Estimated based on average
        goalProgress: Math.min(goalProgress, 100)
      });
    } catch (error) {
      console.error('Failed to refresh stats:', error);
    }
  };

  const saveAllChanges = async () => {
    await saveDonationData();
  };

  // Refresh stats when settings change
  useEffect(() => {
    refreshStats();
  }, [settings, donationTiers]);

  const value: DonationContextType = {
    settings,
    updateSettings,
    donationTiers,
    addDonationTier,
    updateDonationTier,
    deleteDonationTier,
    reorderTiers,
    paymentMethods,
    updatePaymentMethod,
    stats,
    refreshStats,
    isLoading,
    hasUnsavedChanges,
    saveAllChanges
  };

  return (
    <DonationContext.Provider value={value}>
      {children}
    </DonationContext.Provider>
  );
};

export const useDonation = () => {
  const context = useContext(DonationContext);
  if (context === undefined) {
    throw new Error('useDonation must be used within a DonationProvider');
  }
  return context;
};

// Utility hooks for specific use cases
export const useActiveTiers = () => {
  const { donationTiers } = useDonation();
  return donationTiers
    .filter(tier => tier.enabled)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
};

export const useActivePaymentMethods = () => {
  const { paymentMethods } = useDonation();
  return paymentMethods.filter(method => method.enabled);
};

export const usePaymentMethodConfig = (type: PaymentMethod['type']) => {
  const { paymentMethods } = useDonation();
  const method = paymentMethods.find(m => m.type === type && m.enabled);
  return method?.config || {};
};

// Export types for use in other components
export type { DonationContextType };