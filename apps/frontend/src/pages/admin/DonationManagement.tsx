import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { 
  Save, Eye, Coffee, Bitcoin, Banknote, Heart, Plus, Trash2, ExternalLink, AlertTriangle, BarChart3, TrendingUp, Users, Target, Wallet, RefreshCw
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// ...types and initial state unchanged...

const DonationManagement: React.FC = () => {
  // ...state setup unchanged...
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 'buymeacoffee', name: 'Buy Me a Coffee', type: 'buymeacoffee', enabled: true, config: { username: 'sinapanahi' }
    },
    {
      id: 'kofi', name: 'Ko-fi', type: 'kofi', enabled: true, config: { username: 'sinapanahi' }
    },
    {
      id: 'paypal', name: 'PayPal', type: 'paypal', enabled: true, config: { paypalId: 'your-paypal-email@example.com', quickAmounts: [5,10,25,50] }
    }
  ]);

  // ...helpers unchanged...

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* ...header, alerts, tabs list unchanged... */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="tiers">Donation Tiers</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
        </TabsList>

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
                      {method.type === 'kofi' && <Heart className="h-5 w-5 text-red-500" />}
                      {method.type === 'paypal' && <Banknote className="h-5 w-5 text-blue-600" />}
                      {method.type === 'crypto' && <Bitcoin className="h-5 w-5 text-orange-500" />}
                      <div>
                        <CardTitle className="text-lg">{method.name}</CardTitle>
                        <CardDescription className="capitalize">{method.type} integration</CardDescription>
                      </div>
                    </div>
                    <Switch
                      checked={method.enabled}
                      onCheckedChange={(checked) => setPaymentMethods(prev => prev.map(m => m.id === method.id ? { ...m, enabled: checked } : m))}
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
                          onChange={(e) => setPaymentMethods(prev => prev.map(m => m.id === method.id ? { ...m, config: { ...m.config, username: e.target.value } } : m))}
                          placeholder="yourusername"
                        />
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open(`https://www.buymeacoffee.com/${method.config.username}`, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" /> Test Link
                        </Button>
                      </div>
                    )}

                    {method.type === 'kofi' && (
                      <div>
                        <Label>Ko‑fi Username</Label>
                        <Input
                          value={method.config.username}
                          onChange={(e) => setPaymentMethods(prev => prev.map(m => m.id === method.id ? { ...m, config: { ...m.config, username: e.target.value } } : m))}
                          placeholder="yourusername"
                        />
                        <p className="text-xs text-muted-foreground mt-1">Your page: https://ko-fi.com/<span className="font-mono">{method.config.username}</span></p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={() => window.open(`https://ko-fi.com/${method.config.username}`, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" /> Test Link
                        </Button>
                      </div>
                    )}

                    {method.type === 'paypal' && (
                      <div className="space-y-4">
                        <div>
                          <Label>PayPal ID (Email or PayPal.me username)</Label>
                          <Input
                            value={method.config.paypalId}
                            onChange={(e) => setPaymentMethods(prev => prev.map(m => m.id === method.id ? { ...m, config: { ...m.config, paypalId: e.target.value } } : m))}
                            placeholder="your-email@example.com or paypal.me/username"
                          />
                        </div>
                        <div>
                          <Label>Quick Amount Options (comma-separated)</Label>
                          <Input
                            value={(method.config.quickAmounts || []).join(', ')}
                            onChange={(e) => setPaymentMethods(prev => prev.map(m => m.id === method.id ? { ...m, config: { ...m.config, quickAmounts: e.target.value.split(',').map(n => Number(n.trim())).filter(n => n > 0) } } : m))}
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
