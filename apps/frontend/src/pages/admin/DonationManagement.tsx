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
  RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Simple types since we're removing the context dependency temporarily
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
      id: 'paypal',
      name: 'PayPal',
      type: 'paypal',
      enabled: true,
      config: {
        paypalId: 'your-paypal-email@example.com',
        buttonId: '',
        quickAmounts: [5, 10, 25, 50]
      }
    }
  ]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  const handleSaveSettings = async () => {
    setIsLoading(true);
    try {
      // Save to localStorage for persistence
      localStorage.setItem('donation_settings', JSON.stringify(settings));
      localStorage.setItem('donation_tiers', JSON.stringify(donationTiers));
      localStorage.setItem('payment_methods', JSON.stringify(paymentMethods));
      
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
          <Button onClick={handleSaveSettings} disabled={!hasUnsavedChanges || isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {hasUnsavedChanges && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Unsaved Changes</AlertTitle>
          <AlertDescription>
            You have unsaved changes. Remember to save your configuration before leaving this page.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="tiers">Donation Tiers</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
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
                <div className={`text-2xl font-bold ${
                  settings.isEnabled ? 'text-green-600' : 'text-red-600'
                }`}>
                  {settings.isEnabled ? 'Live' : 'Disabled'}
                </div>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button 
                  onClick={() => copyToClipboard(window.location.origin + '/support')}
                  variant="outline" 
                  className="justify-start"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Support URL
                </Button>
                <Button 
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
                <Button 
                  variant="outline" 
                  className="justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Page Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Configuration</CardTitle>
                <CardDescription>
                  Core settings for your donation page
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.isEnabled}
                    onCheckedChange={(checked) => updateSettings({ isEnabled: checked })}
                  />
                  <Label>Enable donation page</Label>
                </div>
                
                <div>
                  <Label htmlFor="pageTitle">Page Title</Label>
                  <Input
                    id="pageTitle"
                    value={settings.pageTitle}
                    onChange={(e) => updateSettings({ pageTitle: e.target.value })}
                    placeholder="Support the Zoroastervers"
                  />
                </div>
                
                <div>
                  <Label htmlFor="pageDescription">Page Description</Label>
                  <Textarea
                    id="pageDescription"
                    value={settings.pageDescription}
                    onChange={(e) => updateSettings({ pageDescription: e.target.value })}
                    placeholder="Help bring the epic fantasy world of Zoroaster to life!"
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Goal & Progress</CardTitle>
                <CardDescription>
                  Set fundraising goals and track progress
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.showProgress}
                    onCheckedChange={(checked) => updateSettings({ showProgress: checked })}
                  />
                  <Label>Show progress bar on page</Label>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goalAmount">Goal Amount ($)</Label>
                    <Input
                      id="goalAmount"
                      type="number"
                      value={settings.goalAmount || ''}
                      onChange={(e) => updateSettings({ goalAmount: Number(e.target.value) })}
                      placeholder="1000"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="currentAmount">Current Amount ($)</Label>
                    <Input
                      id="currentAmount"
                      type="number"
                      value={settings.currentAmount || ''}
                      onChange={(e) => updateSettings({ currentAmount: Number(e.target.value) })}
                      placeholder="250"
                    />
                  </div>
                </div>

                {/* Progress Preview */}
                {settings.showProgress && (
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Goal Progress Preview</span>
                      <span>{progressPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Donation Tiers Tab */}
        <TabsContent value="tiers" className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold">Donation Tiers</h3>
              <p className="text-muted-foreground">Configure different support levels and their benefits</p>
            </div>
            <Button onClick={() => {
              const newTier: DonationTier = {
                id: Date.now().toString(),
                name: 'New Tier',
                amount: 10,
                description: 'Description for this tier',
                benefits: ['Benefit 1'],
                enabled: true
              };
              setDonationTiers([...donationTiers, newTier]);
              setHasUnsavedChanges(true);
            }}>
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
                    onClick={() => {
                      setDonationTiers(tiers => tiers.filter(t => t.id !== tier.id));
                      setHasUnsavedChanges(true);
                    }}
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
                        min="1"
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
                      onChange={(e) => updateDonationTier(tier.id, { 
                        benefits: e.target.value.split('\n').filter(b => b.trim()) 
                      })}
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
                    {/* Buy Me a Coffee Configuration */}
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
                          Links will go to: https://www.buymeacoffee.com/{method.config.username}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(`https://www.buymeacoffee.com/${method.config.username}`, '_blank')}
                          className="mt-2"
                        >
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Test Link
                        </Button>
                      </div>
                    )}
                    
                    {/* PayPal Configuration */}
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
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonationManagement;