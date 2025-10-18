import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
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
import { useDonation, type DonationTier, type PaymentMethod } from '../../contexts/DonationContext';

const DonationManagement: React.FC = () => {
  const {
    settings,
    updateSettings,
    donationTiers,
    addDonationTier,
    updateDonationTier,
    deleteDonationTier,
    paymentMethods,
    updatePaymentMethod,
    stats,
    refreshStats,
    isLoading,
    hasUnsavedChanges,
    saveAllChanges
  } = useDonation();

  const [activeTab, setActiveTab] = useState('overview');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleSaveSettings = async () => {
    try {
      await saveAllChanges();
    } catch (error) {
      toast.error('Failed to save settings. Please try again.');
    }
  };

  const handlePreview = () => {
    // Open the support page in a new tab
    window.open('/support', '_blank');
  };

  const handleAddTier = async () => {
    const newTier = {
      name: 'New Tier',
      amount: 10,
      description: 'Description for this tier',
      benefits: ['Benefit 1'],
      enabled: true
    };
    await addDonationTier(newTier);
  };

  const copyToClipboard = async (text: string, label: string = '') => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label ? label + ' ' : ''}copied to clipboard!`);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const exportSettings = () => {
    const exportData = {
      settings,
      donationTiers,
      paymentMethods,
      exportedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'donation-settings-export.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Settings exported successfully!');
  };

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
          <Button onClick={exportSettings} variant="outline">
            <ExternalLink className="h-4 w-4 mr-2" />
            Export Settings
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                <div className="text-2xl font-bold">{stats.goalProgress.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  ${settings.currentAmount} of ${settings.goalAmount} goal
                </p>
                <div className="w-full bg-muted rounded-full h-2 mt-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${stats.goalProgress}%` }}
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
                  onClick={() => copyToClipboard(window.location.origin + '/support', 'Support page URL')}
                  variant="outline" 
                  className="justify-start"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Support URL
                </Button>
                <Button 
                  onClick={handleAddTier}
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
                  onClick={refreshStats}
                  variant="outline" 
                  className="justify-start"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Stats
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Configuration Summary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Active Donation Tiers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {donationTiers.filter(t => t.enabled).map((tier) => (
                    <div key={tier.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div>
                        <div className="font-medium">{tier.name}</div>
                        <div className="text-sm text-muted-foreground">${tier.amount}</div>
                      </div>
                      {tier.popular && <Badge>Popular</Badge>}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Payment Methods Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div key={method.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                      <div className="flex items-center space-x-2">
                        {method.type === 'buymeacoffee' && <Coffee className="h-4 w-4 text-yellow-500" />}
                        {method.type === 'paypal' && <Banknote className="h-4 w-4 text-blue-600" />}
                        {method.type === 'crypto' && <Bitcoin className="h-4 w-4 text-orange-500" />}
                        {method.type === 'kofi' && <Heart className="h-4 w-4 text-red-500" />}
                        <span className="font-medium">{method.name}</span>
                      </div>
                      <Badge variant={method.enabled ? 'default' : 'secondary'}>
                        {method.enabled ? 'Active' : 'Disabled'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Page Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Settings */}
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
                
                <div>
                  <Label htmlFor="thankYouMessage">Thank You Message</Label>
                  <Textarea
                    id="thankYouMessage"
                    value={settings.thankYouMessage}
                    onChange={(e) => updateSettings({ thankYouMessage: e.target.value })}
                    placeholder="Thank you for supporting the project!"
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Goal & Progress Settings */}
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
                      <span>{stats.goalProgress.toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all"
                        style={{ width: `${stats.goalProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Widget Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Widget Settings</CardTitle>
              <CardDescription>
                Configure where donation widgets appear on your site
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.showOnHomepage}
                    onCheckedChange={(checked) => updateSettings({ showOnHomepage: checked })}
                  />
                  <Label>Show on homepage</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={settings.floatingWidget}
                    onCheckedChange={(checked) => updateSettings({ floatingWidget: checked })}
                  />
                  <Label>Floating donation button</Label>
                </div>
                
                <div className="text-sm text-muted-foreground">
                  <p>Additional widget placement options will be added in future updates.</p>
                </div>
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
            <Button onClick={handleAddTier}>
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
                        min="1"
                        step="1"
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
                      onCheckedChange={(checked) => {
                        // Only allow one popular tier at a time
                        if (checked) {
                          donationTiers.forEach(t => {
                            if (t.id !== tier.id && t.popular) {
                              updateDonationTier(t.id, { popular: false });
                            }
                          });
                        }
                        updateDonationTier(tier.id, { popular: checked });
                      }}
                    />
                    <Label>Mark as popular tier (highlighted)</Label>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {donationTiers.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Donation Tiers</h3>
                <p className="text-muted-foreground mb-4">Create your first donation tier to get started.</p>
                <Button onClick={handleAddTier}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Tier
                </Button>
              </CardContent>
            </Card>
          )}
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
                    
                    {/* Ko-fi Configuration */}
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
                          Links will go to: https://ko-fi.com/{method.config.username}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => window.open(`https://ko-fi.com/${method.config.username}`, '_blank')}
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
                          <Label>PayPal Hosted Button ID (Optional - for better integration)</Label>
                          <Input
                            value={method.config.buttonId}
                            onChange={(e) => updatePaymentMethod(method.id, { 
                              config: { ...method.config, buttonId: e.target.value }
                            })}
                            placeholder="Get this from PayPal's donation button creator"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            <a 
                              href="https://www.paypal.com/donate/buttons" 
                              target="_blank" 
                              className="text-blue-500 hover:underline"
                            >
                              Create a PayPal donation button →
                            </a>
                          </p>
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
                    
                    {/* Cryptocurrency Configuration */}
                    {method.type === 'crypto' && (
                      <div className="space-y-4">
                        <Label>Cryptocurrency Wallets</Label>
                        <Alert>
                          <AlertTriangle className="h-4 w-4" />
                          <AlertTitle>Security Warning</AlertTitle>
                          <AlertDescription>
                            Double-check all wallet addresses. Crypto transactions cannot be reversed.
                          </AlertDescription>
                        </Alert>
                        
                        {method.config.wallets?.map((wallet: any, index: number) => (
                          <div key={index} className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 border rounded-lg">
                            <div>
                              <Label>Currency Name</Label>
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
                                  newWallets[index] = { ...wallet, symbol: e.target.value.toUpperCase() };
                                  updatePaymentMethod(method.id, { 
                                    config: { ...method.config, wallets: newWallets }
                                  });
                                }}
                                placeholder="BTC"
                              />
                            </div>
                            <div>
                              <Label>Wallet Address</Label>
                              <div className="flex space-x-2">
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
                                  className="font-mono text-sm"
                                />
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => copyToClipboard(wallet.address, `${wallet.symbol} address`)}
                                  title="Copy address"
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="flex items-end">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const newWallets = method.config.wallets.filter((_: any, i: number) => i !== index);
                                  updatePaymentMethod(method.id, { 
                                    config: { ...method.config, wallets: newWallets }
                                  });
                                }}
                                className="text-destructive w-full"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Remove
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Raised</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.totalDonations}</div>
                <p className="text-xs text-muted-foreground">All time</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">This Month</CardTitle>
                <BarChart3 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">${stats.monthlyDonations}</div>
                <p className="text-xs text-muted-foreground">Current month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Supporters</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.donorCount}</div>
                <p className="text-xs text-muted-foreground">Total donors</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Popular Tier</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-lg font-bold">{stats.topTier}</div>
                <p className="text-xs text-muted-foreground">Most chosen</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Analytics Coming Soon</CardTitle>
              <CardDescription>
                Detailed donation analytics will be available in a future update
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Enhanced Analytics</h3>
                <p className="text-muted-foreground max-w-md mx-auto mb-4">
                  Future updates will include detailed analytics such as:
                </p>
                <ul className="text-sm text-muted-foreground space-y-1 max-w-md mx-auto text-left">
                  <li>• Donation trends over time</li>
                  <li>• Payment method preferences</li>
                  <li>• Tier conversion rates</li>
                  <li>• Geographic donor distribution</li>
                  <li>• Seasonal donation patterns</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DonationManagement;