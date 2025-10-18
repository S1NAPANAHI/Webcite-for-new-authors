import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Save, 
  Eye, 
  Settings, 
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
  DollarSign,
  Target,
  Edit,
  Wallet
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types for donation configuration
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
  impactStats: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

const DonationManagement: React.FC = () => {
  const [settings, setSettings] = useState<DonationSettings>({
    pageTitle: 'Support the Zoroastervers',
    pageDescription: 'Help bring the epic fantasy world of Zoroaster to life!',
    goalAmount: 1000,
    currentAmount: 250,
    showProgress: true,
    thankYouMessage: 'Thank you for supporting the Zoroastervers! Your contribution helps bring this epic fantasy world to life.',
    impactStats: [
      { icon: 'BookOpen', title: '5 Books Planned', description: 'Epic fantasy series in development' },
      { icon: 'Users', title: 'Growing Community', description: 'Dedicated readers and supporters' },
      { icon: 'Sparkles', title: 'Regular Updates', description: 'New chapters every month' }
    ]
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
  ]);

  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: 'buymeacoffee',
      name: 'Buy Me a Coffee',
      type: 'buymeacoffee',
      enabled: true,
      config: {
        username: 'sinapanahi'
      }
    },
    {
      id: 'kofi',
      name: 'Ko-fi',
      type: 'kofi',
      enabled: false,
      config: {
        username: 'sinapanahi'
      }
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
      config: {
        wallets: [
          { name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh' },
          { name: 'Ethereum', symbol: 'ETH', address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2' },
          { name: 'Solana', symbol: 'SOL', address: '7x8Y9Z1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P7Q8R9S' }
        ]
      }
    }
  ]);

  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const handleSaveSettings = async () => {
    try {
      // Here you would save to your backend/database
      // For now, we'll just simulate a save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Donation settings saved successfully!');
      setHasChanges(false);
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const handlePreview = () => {
    // Open the support page in a new tab
    window.open('/support', '_blank');
  };

  const addDonationTier = () => {
    const newTier: DonationTier = {
      id: Date.now().toString(),
      name: 'New Tier',
      amount: 10,
      description: 'Description for this tier',
      benefits: ['Benefit 1'],
      enabled: true
    };
    setDonationTiers([...donationTiers, newTier]);
    setHasChanges(true);
  };

  const updateDonationTier = (id: string, updates: Partial<DonationTier>) => {
    setDonationTiers(tiers => 
      tiers.map(tier => tier.id === id ? { ...tier, ...updates } : tier)
    );
    setHasChanges(true);
  };

  const deleteDonationTier = (id: string) => {
    setDonationTiers(tiers => tiers.filter(tier => tier.id !== id));
    setHasChanges(true);
  };

  const updatePaymentMethod = (id: string, updates: Partial<PaymentMethod>) => {
    setPaymentMethods(methods => 
      methods.map(method => method.id === id ? { ...method, ...updates } : method)
    );
    setHasChanges(true);
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

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center">
            <Heart className="h-8 w-8 text-red-500 mr-3" />
            Donation Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Configure and manage donation settings, payment methods, and support tiers for your website.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button onClick={handlePreview} variant="outline">
            <Eye className="h-4 w-4 mr-2" />
            Preview Page
          </Button>
          <Button onClick={handleSaveSettings} disabled={!hasChanges}>
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>

      {hasChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unsaved Changes</AlertTitle>
          <AlertDescription>
            You have unsaved changes. Remember to save your configuration before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="tiers">Donation Tiers</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{progressPercentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  ${settings.currentAmount} of ${settings.goalAmount} goal
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tiers</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{donationTiers.filter(t => t.enabled).length}</div>
                <p className="text-xs text-muted-foreground">
                  {donationTiers.length} total tiers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Payment Methods</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paymentMethods.filter(m => m.enabled).length}</div>
                <p className="text-xs text-muted-foreground">
                  {paymentMethods.length} configured
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Page Status</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Live</div>
                <p className="text-xs text-muted-foreground">
                  Accessible at /support
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common tasks for managing your donation system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Button 
                  onClick={() => copyToClipboard(window.location.origin + '/support')}
                  variant="outline" 
                  className="justify-start"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Support Page URL
                </Button>
                <Button 
                  onClick={addDonationTier}
                  variant="outline" 
                  className="justify-start"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Tier
                </Button>
                <Button 
                  onClick={handlePreview}
                  variant="outline" 
                  className="justify-start"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  View Live Page
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Page Configuration</CardTitle>
              <CardDescription>
                Customize the appearance and content of your donation page
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="pageTitle">Page Title</Label>
                    <Input
                      id="pageTitle"
                      value={settings.pageTitle}
                      onChange={(e) => {
                        setSettings(s => ({ ...s, pageTitle: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="Support the Zoroastervers"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="pageDescription">Page Description</Label>
                    <Textarea
                      id="pageDescription"
                      value={settings.pageDescription}
                      onChange={(e) => {
                        setSettings(s => ({ ...s, pageDescription: e.target.value }));
                        setHasChanges(true);
                      }}
                      placeholder="Help bring the epic fantasy world of Zoroaster to life!"
                      rows={3}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                      <Input
                        id="goalAmount"
                        type="number"
                        value={settings.goalAmount || ''}
                        onChange={(e) => {
                          setSettings(s => ({ ...s, goalAmount: Number(e.target.value) }));
                          setHasChanges(true);
                        }}
                        placeholder="1000"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="currentAmount">Current Amount ($)</Label>
                      <Input
                        id="currentAmount"
                        type="number"
                        value={settings.currentAmount || ''}
                        onChange={(e) => {
                          setSettings(s => ({ ...s, currentAmount: Number(e.target.value) }));
                          setHasChanges(true);
                        }}
                        placeholder="250"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showProgress"
                      checked={settings.showProgress}
                      onCheckedChange={(checked) => {
                        setSettings(s => ({ ...s, showProgress: checked }));
                        setHasChanges(true);
                      }}
                    />
                    <Label htmlFor="showProgress">Show progress bar on page</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="thankYouMessage">Thank You Message</Label>
                <Textarea
                  id="thankYouMessage"
                  value={settings.thankYouMessage}
                  onChange={(e) => {
                    setSettings(s => ({ ...s, thankYouMessage: e.target.value }));
                    setHasChanges(true);
                  }}
                  placeholder="Thank you for supporting the project!"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Donation Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Donation Tiers</h3>
              <p className="text-muted-foreground">Configure different support levels and their benefits</p>
            </div>
            <Button onClick={addDonationTier}>
              <Plus className="h-4 w-4 mr-2" />
              Add Tier
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {donationTiers.map((tier) => (
              <Card key={tier.id} className={`${!tier.enabled ? 'opacity-50' : ''}`}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tier.enabled}
                      onCheckedChange={(checked) => updateDonationTier(tier.id, { enabled: checked })}
                    />
                    {tier.popular && <Badge variant="secondary">Popular</Badge>}
                  </div>
                  <Button
                    onClick={() => deleteDonationTier(tier.id)}
                    variant="ghost"
                    size="sm"
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Tier Name</Label>
                      <Input
                        value={tier.name}
                        onChange={(e) => updateDonationTier(tier.id, { name: e.target.value })}
                        placeholder="Coffee Supporter"
                      />
                    </div>
                    <div>
                      <Label>Amount ($)</Label>
                      <Input
                        type="number"
                        value={tier.amount}
                        onChange={(e) => updateDonationTier(tier.id, { amount: Number(e.target.value) })}
                        placeholder="5"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={tier.description}
                      onChange={(e) => updateDonationTier(tier.id, { description: e.target.value })}
                      placeholder="What this tier supports"
                    />
                  </div>
                  
                  <div>
                    <Label>Benefits (one per line)</Label>
                    <Textarea
                      value={tier.benefits.join('\n')}
                      onChange={(e) => updateDonationTier(tier.id, { benefits: e.target.value.split('\n').filter(b => b.trim()) })}
                      placeholder="My heartfelt thanks\nRecognition as a supporter"
                      rows={3}
                    />
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={tier.popular || false}
                      onCheckedChange={(checked) => updateDonationTier(tier.id, { popular: checked })}
                    />
                    <Label>Mark as popular tier</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Payment Methods Tab */}
        <TabsContent value="payments" className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Payment Methods</h3>
            <p className="text-muted-foreground">Configure your payment providers and wallet addresses</p>
          </div>

          <div className="space-y-6">
            {paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.type === 'buymeacoffee' && <Coffee className="h-5 w-5 text-yellow-500" />}
                      {method.type === 'paypal' && <Banknote className="h-5 w-5 text-blue-600" />}
                      {method.type === 'crypto' && <Bitcoin className="h-5 w-5 text-orange-500" />}
                      {method.type === 'kofi' && <Heart className="h-5 w-5 text-red-500" />}
                      <div>
                        <CardTitle className="text-lg">{method.name}</CardTitle>
                        <CardDescription className="capitalize">{method.type} integration</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={(checked) => updatePaymentMethod(method.id, { enabled: checked })}
                    />
                  </div>
                </CardHeader>
                {method.enabled && (
                  <CardContent className="space-y-4">
                    {method.type === 'buymeacoffee' && (
                      <div>
                        <Label>Buy Me a Coffee Username</Label>
                        <Input
                          value={method.config.username}
                          onChange={(e) => updatePaymentMethod(method.id, { 
                            config: { ...method.config, username: e.target.value }
                          })}
                          placeholder="yourusername"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This will create links to: https://www.buymeacoffee.com/{method.config.username}
                        </p>
                      </div>
                    )}
                    
                    {method.type === 'kofi' && (
                      <div>
                        <Label>Ko-fi Username</Label>
                        <Input
                          value={method.config.username}
                          onChange={(e) => updatePaymentMethod(method.id, { 
                            config: { ...method.config, username: e.target.value }
                          })}
                          placeholder="yourusername"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          This will create links to: https://ko-fi.com/{method.config.username}
                        </p>
                      </div>
                    )}
                    
                    {method.type === 'paypal' && (
                      <div className="space-y-4">
                        <div>
                          <Label>PayPal ID (Email or PayPal.me username)</Label>
                          <Input
                            value={method.config.paypalId}
                            onChange={(e) => updatePaymentMethod(method.id, { 
                              config: { ...method.config, paypalId: e.target.value }
                            })}
                            placeholder="your-email@example.com or paypal.me/username"
                          />
                        </div>
                        <div>
                          <Label>PayPal Hosted Button ID (Optional)</Label>
                          <Input
                            value={method.config.buttonId}
                            onChange={(e) => updatePaymentMethod(method.id, { 
                              config: { ...method.config, buttonId: e.target.value }
                            })}
                            placeholder="Leave empty to use direct donation links"
                          />
                        </div>
                        <div>
                          <Label>Quick Amount Options (comma-separated)</Label>
                          <Input
                            value={method.config.quickAmounts?.join(', ')}
                            onChange={(e) => updatePaymentMethod(method.id, { 
                              config: { 
                                ...method.config, 
                                quickAmounts: e.target.value.split(',').map(n => Number(n.trim())).filter(n => n > 0)
                              }
                            })}
                            placeholder="5, 10, 25, 50"
                          />
                        </div>
                      </div>
                    )}
                    
                    {method.type === 'crypto' && (
                      <div className="space-y-4">
                        <Label>Cryptocurrency Wallets</Label>
                        {method.config.wallets?.map((wallet: any, index: number) => (
                          <div key={index} className="grid grid-cols-3 gap-4 p-4 border rounded-lg">
                            <div>
                              <Label>Currency</Label>
                              <Input
                                value={wallet.name}
                                onChange={(e) => {
                                  const newWallets = [...method.config.wallets];
                                  newWallets[index] = { ...wallet, name: e.target.value };
                                  updatePaymentMethod(method.id, { 
                                    config: { ...method.config, wallets: newWallets }
                                  });
                                }}
                                placeholder="Bitcoin"
                              />
                            </div>
                            <div>
                              <Label>Symbol</Label>
                              <Input
                                value={wallet.symbol}
                                onChange={(e) => {
                                  const newWallets = [...method.config.wallets];
                                  newWallets[index] = { ...wallet, symbol: e.target.value };
                                  updatePaymentMethod(method.id, { 
                                    config: { ...method.config, wallets: newWallets }
                                  });
                                }}
                                placeholder="BTC"
                              />
                            </div>
                            <div className="flex items-end space-x-2">
                              <div className="flex-1">
                                <Label>Wallet Address</Label>
                                <Input
                                  value={wallet.address}
                                  onChange={(e) => {
                                    const newWallets = [...method.config.wallets];
                                    newWallets[index] = { ...wallet, address: e.target.value };
                                    updatePaymentMethod(method.id, { 
                                      config: { ...method.config, wallets: newWallets }
                                    });
                                  }}
                                  placeholder="Wallet address"
                                />
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newWallets = method.config.wallets.filter((_: any, i: number) => i !== index);
                                  updatePaymentMethod(method.id, { 
                                    config: { ...method.config, wallets: newWallets }
                                  });
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          onClick={() => {
                            const newWallet = { name: '', symbol: '', address: '' };
                            const newWallets = [...(method.config.wallets || []), newWallet];
                            updatePaymentMethod(method.id, { 
                              config: { ...method.config, wallets: newWallets }
                            });
                          }}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Wallet
                        </Button>
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Donation Analytics</CardTitle>
              <CardDescription>
                Track the performance of your donation system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Analytics Coming Soon</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  Detailed analytics including donation trends, popular payment methods, 
                  and tier performance will be available in a future update.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonationManagement;