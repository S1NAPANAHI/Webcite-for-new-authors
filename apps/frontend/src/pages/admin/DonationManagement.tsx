import React, { useEffect, useMemo, useState } from 'react';
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
  Shield,
  Download
} from 'lucide-react';
import { toast } from 'react-hot-toast';

// Types
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

interface DonationRecord {
  id: string;
  created_at: string;
  amount: number;
  currency: string;
  source: 'paypal' | 'buymeacoffee' | 'kofi' | 'crypto' | 'stripe' | 'other';
  txid?: string; // for crypto
  note?: string;
  supporter_name?: string;
}

const STORAGE_KEYS = {
  settings: 'donation_settings',
  tiers: 'donation_tiers',
  methods: 'payment_methods',
  wallets: 'crypto_wallets',
  records: 'donation_records'
} as const;

const DonationManagement: React.FC = () => {
  // Core state
  const [settings, setSettings] = useState<DonationSettings>({
    pageTitle: 'Support the Zoroastervers',
    pageDescription: 'Help bring the epic fantasy world of Zoroaster to life!',
    goalAmount: 1000,
    currentAmount: 0,
    showProgress: true,
    thankYouMessage: 'Thank you for supporting the Zoroastervers!',
    isEnabled: true
  });

  const [donationTiers, setDonationTiers] = useState<DonationTier[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [cryptoWallets, setCryptoWallets] = useState<CryptoWallet[]>([]);
  const [donationRecords, setDonationRecords] = useState<DonationRecord[]>([]);

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  // Load from localStorage on mount (temporary persistence until Supabase tables are wired)
  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEYS.settings);
      const t = localStorage.getItem(STORAGE_KEYS.tiers);
      const m = localStorage.getItem(STORAGE_KEYS.methods);
      const w = localStorage.getItem(STORAGE_KEYS.wallets);
      const r = localStorage.getItem(STORAGE_KEYS.records);

      if (s) setSettings(JSON.parse(s));
      if (t) setDonationTiers(JSON.parse(t)); else setDonationTiers([
        { id: '1', name: 'Coffee Supporter', amount: 5, description: 'Buy a coffee', benefits: ['Thanks'], enabled: true },
        { id: '2', name: 'Chapter Patron', amount: 15, description: 'Support a chapter', benefits: ['Early access'], popular: true, enabled: true },
      ]);
      if (m) setPaymentMethods(JSON.parse(m)); else setPaymentMethods([
        { id: 'buymeacoffee', name: 'Buy Me a Coffee', type: 'buymeacoffee', enabled: true, config: { username: 'sinapanahi' } },
        { id: 'kofi', name: 'Ko-fi', type: 'kofi', enabled: true, config: { username: 'sinapanahi' } },
        { id: 'paypal', name: 'PayPal', type: 'paypal', enabled: true, config: { paypalId: 'your-paypal-email@example.com', quickAmounts: [5,10,25,50] } },
        { id: 'crypto', name: 'Cryptocurrency', type: 'crypto', enabled: true, config: {} },
      ]);
      if (w) setCryptoWallets(JSON.parse(w)); else setCryptoWallets([
        { id: '1', name: 'Bitcoin', symbol: 'BTC', address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', enabled: true, color: 'text-orange-500', explorerUrl: 'https://blockstream.info/address/' },
        { id: '2', name: 'Ethereum', symbol: 'ETH', address: '0x742e4C4C8f27B3E4F3C4E8D3A9E5F7B8C9D0E1F2', enabled: true, color: 'text-blue-500', explorerUrl: 'https://etherscan.io/address/' },
      ]);
      if (r) setDonationRecords(JSON.parse(r));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const saveAll = async () => {
    setIsLoading(true);
    try {
      localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(settings));
      localStorage.setItem(STORAGE_KEYS.tiers, JSON.stringify(donationTiers));
      localStorage.setItem(STORAGE_KEYS.methods, JSON.stringify(paymentMethods));
      localStorage.setItem(STORAGE_KEYS.wallets, JSON.stringify(cryptoWallets));
      localStorage.setItem(STORAGE_KEYS.records, JSON.stringify(donationRecords));
      await new Promise(res => setTimeout(res, 500));
      toast.success('Donation configuration saved');
      setHasUnsavedChanges(false);
    } catch {
      toast.error('Failed to save');
    } finally {
      setIsLoading(false);
    }
  };

  const exportCSV = () => {
    const header = ['id','created_at','amount','currency','source','txid','note','supporter_name'];
    const rows = donationRecords.map(r => [r.id, r.created_at, r.amount, r.currency, r.source, r.txid||'', r.note||'', r.supporter_name||'']);
    const csv = [header, ...rows].map(cols => cols.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'donations.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  const addTier = () => {
    const id = Date.now().toString();
    setDonationTiers(prev => [...prev, { id, name: 'New Tier', amount: 10, description: '', benefits: [], enabled: true }]);
    setHasUnsavedChanges(true);
  };

  const removeTier = (id: string) => {
    setDonationTiers(prev => prev.filter(t => t.id !== id));
    setHasUnsavedChanges(true);
  };

  const toggleMethod = (id: string, enabled: boolean) => {
    setPaymentMethods(prev => prev.map(m => m.id === id ? { ...m, enabled } : m));
    setHasUnsavedChanges(true);
  };

  const addWallet = () => {
    const id = Date.now().toString();
    setCryptoWallets(prev => [...prev, { id, name: 'New', symbol: 'COIN', address: '', enabled: true }]);
    setHasUnsavedChanges(true);
  };

  const removeWallet = (id: string) => {
    setCryptoWallets(prev => prev.filter(w => w.id !== id));
    setHasUnsavedChanges(true);
  };

  const addRecord = () => {
    const id = Date.now().toString();
    setDonationRecords(prev => [{ id, created_at: new Date().toISOString(), amount: 5, currency: 'USD', source: 'other' }, ...prev]);
    setHasUnsavedChanges(true);
  };

  const totalRaised = useMemo(() => donationRecords.reduce((s, r) => s + (r.amount || 0), 0), [donationRecords]);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2"><Heart className="h-5 w-5 text-primary"/> Donation Management</h1>
          <p className="text-sm text-muted-foreground">Configure support page, methods, tiers, and track donations</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => window.open('/support','_blank')}><Eye className="h-4 w-4 mr-2"/>Preview</Button>
          <Button variant="outline" onClick={exportCSV}><Download className="h-4 w-4 mr-2"/>Export CSV</Button>
          <Button onClick={saveAll} disabled={isLoading}><Save className="h-4 w-4 mr-2"/>{isLoading? 'Saving...' : 'Save'}</Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Total Raised</CardTitle>
            <CardDescription className="text-2xl font-bold">${totalRaised.toFixed(2)}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Goal Progress</CardTitle>
            <CardDescription className="text-2xl font-bold">${settings.currentAmount} / ${settings.goalAmount}</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Methods Enabled</CardTitle>
            <CardDescription className="text-2xl font-bold">{paymentMethods.filter(m=>m.enabled).length}</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="settings">Page Settings</TabsTrigger>
          <TabsTrigger value="tiers">Donation Tiers</TabsTrigger>
          <TabsTrigger value="payments">Payment Methods</TabsTrigger>
          <TabsTrigger value="crypto">Crypto Wallets</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Donations</CardTitle>
              <CardDescription>Track manual entries until automated webhooks are set up</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-muted-foreground">Records: {donationRecords.length}</div>
                <Button size="sm" onClick={addRecord}><Plus className="h-4 w-4 mr-1"/>Add Record</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-muted-foreground">
                      <th className="p-2">Date</th>
                      <th className="p-2">Amount</th>
                      <th className="p-2">Source</th>
                      <th className="p-2">Supporter</th>
                      <th className="p-2">Note / TxID</th>
                      <th className="p-2 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donationRecords.map((r, i) => (
                      <tr key={r.id} className="border-t border-border">
                        <td className="p-2 whitespace-nowrap">
                          <Input type="datetime-local" value={new Date(r.created_at).toISOString().slice(0,16)} onChange={e=>{ const v=e.target.value; setDonationRecords(prev=>prev.map(x=>x.id===r.id?{...x,created_at:new Date(v).toISOString()}:x)); setHasUnsavedChanges(true); }} />
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <Input type="number" className="w-28" value={r.amount} onChange={e=>{ const v=Number(e.target.value); setDonationRecords(prev=>prev.map(x=>x.id===r.id?{...x,amount:v}:x)); setHasUnsavedChanges(true); }} />
                            <Input className="w-20" value={r.currency} onChange={e=>{ const v=e.target.value; setDonationRecords(prev=>prev.map(x=>x.id===r.id?{...x,currency:v}:x)); setHasUnsavedChanges(true); }} />
                          </div>
                        </td>
                        <td className="p-2">
                          <select className="border rounded px-2 py-2 bg-background" value={r.source} onChange={e=>{ const v=e.target.value as DonationRecord['source']; setDonationRecords(prev=>prev.map(x=>x.id===r.id?{...x,source:v}:x)); setHasUnsavedChanges(true); }}>
                            <option value="paypal">PayPal</option>
                            <option value="buymeacoffee">BuyMeACoffee</option>
                            <option value="kofi">Ko-fi</option>
                            <option value="crypto">Crypto</option>
                            <option value="stripe">Stripe</option>
                            <option value="other">Other</option>
                          </select>
                        </td>
                        <td className="p-2">
                          <Input value={r.supporter_name||''} onChange={e=>{ const v=e.target.value; setDonationRecords(prev=>prev.map(x=>x.id===r.id?{...x,supporter_name:v}:x)); setHasUnsavedChanges(true); }} />
                        </td>
                        <td className="p-2">
                          <Input value={r.txid||r.note||''} onChange={e=>{ const v=e.target.value; setDonationRecords(prev=>prev.map(x=>x.id===r.id?{...x, txid: r.source==='crypto'? v: r.txid, note: r.source!=='crypto'? v: r.note }:x)); setHasUnsavedChanges(true); }} />
                        </td>
                        <td className="p-2 text-right">
                          <Button variant="ghost" size="sm" onClick={()=>{ setDonationRecords(prev=>prev.filter(x=>x.id!==r.id)); setHasUnsavedChanges(true); }}>
                            <Trash2 className="h-4 w-4"/>
                          </Button>
                        </td>
                      </tr>
                    ))}
                    {donationRecords.length===0 && (
                      <tr>
                        <td className="p-4 text-center text-muted-foreground" colSpan={6}>No records yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Support Page Settings</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Page Title</Label>
                <Input value={settings.pageTitle} onChange={e=>{ setSettings({...settings, pageTitle:e.target.value}); setHasUnsavedChanges(true); }} />
              </div>
              <div>
                <Label>Goal Amount (USD)</Label>
                <Input type="number" value={settings.goalAmount||0} onChange={e=>{ setSettings({...settings, goalAmount:Number(e.target.value)}); setHasUnsavedChanges(true); }} />
              </div>
              <div className="md:col-span-2">
                <Label>Description</Label>
                <Textarea rows={3} value={settings.pageDescription} onChange={e=>{ setSettings({...settings, pageDescription:e.target.value}); setHasUnsavedChanges(true); }} />
              </div>
              <div>
                <Label>Current Amount</Label>
                <Input type="number" value={settings.currentAmount||0} onChange={e=>{ setSettings({...settings, currentAmount:Number(e.target.value)}); setHasUnsavedChanges(true); }} />
              </div>
              <div>
                <Label>Show Progress</Label>
                <div className="flex items-center gap-3">
                  <Switch checked={settings.showProgress} onCheckedChange={(v)=>{ setSettings({...settings, showProgress:v}); setHasUnsavedChanges(true); }} />
                  <span className="text-sm text-muted-foreground">Display goal progress bar</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <Label>Thank You Message</Label>
                <Textarea rows={2} value={settings.thankYouMessage} onChange={e=>{ setSettings({...settings, thankYouMessage:e.target.value}); setHasUnsavedChanges(true); }} />
              </div>
              <div>
                <Label>Enable Support Page</Label>
                <div className="flex items-center gap-3">
                  <Switch checked={settings.isEnabled} onCheckedChange={(v)=>{ setSettings({...settings, isEnabled:v}); setHasUnsavedChanges(true); }} />
                  <span className="text-sm text-muted-foreground">Turn the support page on/off</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tiers */}
        <TabsContent value="tiers" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Donation Tiers</CardTitle>
                <CardDescription>Create suggested tiers your supporters can choose</CardDescription>
              </div>
              <Button size="sm" onClick={addTier}><Plus className="h-4 w-4 mr-1"/>Add Tier</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {donationTiers.map(t => (
                <div key={t.id} className="grid grid-cols-1 md:grid-cols-6 gap-3 border rounded-lg p-3">
                  <div className="md:col-span-2">
                    <Label>Name</Label>
                    <Input value={t.name} onChange={e=>{ const v=e.target.value; setDonationTiers(prev=>prev.map(x=>x.id===t.id?{...x,name:v}:x)); setHasUnsavedChanges(true); }} />
                  </div>
                  <div>
                    <Label>Amount</Label>
                    <Input type="number" value={t.amount} onChange={e=>{ const v=Number(e.target.value); setDonationTiers(prev=>prev.map(x=>x.id===t.id?{...x,amount:v}:x)); setHasUnsavedChanges(true); }} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Description</Label>
                    <Input value={t.description} onChange={e=>{ const v=e.target.value; setDonationTiers(prev=>prev.map(x=>x.id===t.id?{...x,description:v}:x)); setHasUnsavedChanges(true); }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2"><Switch checked={!!t.popular} onCheckedChange={(v)=>{ setDonationTiers(prev=>prev.map(x=>x.id===t.id?{...x,popular:v}:x)); setHasUnsavedChanges(true); }} /> <span className="text-sm">Popular</span></div>
                    <div className="flex items-center gap-2"><Switch checked={t.enabled} onCheckedChange={(v)=>{ setDonationTiers(prev=>prev.map(x=>x.id===t.id?{...x,enabled:v}:x)); setHasUnsavedChanges(true); }} /> <span className="text-sm">Enabled</span></div>
                  </div>
                  <div className="md:col-span-6 flex items-center justify-between">
                    <div className="text-xs text-muted-foreground">Benefits: {t.benefits.join(', ') || 'None'} (edit in future update)</div>
                    <Button variant="ghost" size="sm" onClick={()=>removeTier(t.id)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                </div>
              ))}
              {donationTiers.length===0 && (
                <div className="text-sm text-muted-foreground">No tiers defined</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Payment Methods */}
        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Methods</CardTitle>
              <CardDescription>Toggle and configure available methods</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentMethods.map(m => (
                <div key={m.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{m.type}</Badge>
                      <span className="font-medium">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch checked={m.enabled} onCheckedChange={(v)=>toggleMethod(m.id, v)} />
                      <span className="text-sm text-muted-foreground">Enabled</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
                    {m.type==='buymeacoffee' && (
                      <div className="md:col-span-1">
                        <Label>Username</Label>
                        <Input value={m.config.username||''} onChange={e=>{ const v=e.target.value; setPaymentMethods(prev=>prev.map(x=>x.id===m.id?{...x,config:{...x.config, username:v}}:x)); setHasUnsavedChanges(true); }} />
                      </div>
                    )}
                    {m.type==='kofi' && (
                      <div className="md:col-span-1">
                        <Label>Username</Label>
                        <Input value={m.config.username||''} onChange={e=>{ const v=e.target.value; setPaymentMethods(prev=>prev.map(x=>x.id===m.id?{...x,config:{...x.config, username:v}}:x)); setHasUnsavedChanges(true); }} />
                      </div>
                    )}
                    {m.type==='paypal' && (
                      <>
                        <div>
                          <Label>PayPal ID/Link</Label>
                          <Input value={m.config.paypalId||''} onChange={e=>{ const v=e.target.value; setPaymentMethods(prev=>prev.map(x=>x.id===m.id?{...x,config:{...x.config, paypalId:v}}:x)); setHasUnsavedChanges(true); }} />
                        </div>
                        <div className="md:col-span-2">
                          <Label>Quick Amounts (comma separated)</Label>
                          <Input value={(m.config.quickAmounts||[]).join(',')} onChange={e=>{ const v=e.target.value.split(',').map(x=>Number(x.trim())).filter(Boolean); setPaymentMethods(prev=>prev.map(x=>x.id===m.id?{...x,config:{...x.config, quickAmounts:v}}:x)); setHasUnsavedChanges(true); }} />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Crypto */}
        <TabsContent value="crypto" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle>Crypto Wallets</CardTitle>
                <CardDescription>Manage addresses displayed on the support page</CardDescription>
              </div>
              <Button size="sm" onClick={addWallet}><Plus className="h-4 w-4 mr-1"/>Add Wallet</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              {cryptoWallets.map(w => (
                <div key={w.id} className="grid grid-cols-1 md:grid-cols-5 gap-3 border rounded-lg p-3">
                  <div>
                    <Label>Name</Label>
                    <Input value={w.name} onChange={e=>{ const v=e.target.value; setCryptoWallets(prev=>prev.map(x=>x.id===w.id?{...x,name:v}:x)); setHasUnsavedChanges(true); }} />
                  </div>
                  <div>
                    <Label>Symbol</Label>
                    <Input value={w.symbol} onChange={e=>{ const v=e.target.value.toUpperCase(); setCryptoWallets(prev=>prev.map(x=>x.id===w.id?{...x,symbol:v}:x)); setHasUnsavedChanges(true); }} />
                  </div>
                  <div className="md:col-span-2">
                    <Label>Address</Label>
                    <Input value={w.address} onChange={e=>{ const v=e.target.value; setCryptoWallets(prev=>prev.map(x=>x.id===w.id?{...x,address:v}:x)); setHasUnsavedChanges(true); }} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch checked={w.enabled} onCheckedChange={(v)=>{ setCryptoWallets(prev=>prev.map(x=>x.id===w.id?{...x,enabled:v}:x)); setHasUnsavedChanges(true); }} />
                    <Button variant="ghost" size="sm" onClick={()=>removeWallet(w.id)}><Trash2 className="h-4 w-4"/></Button>
                  </div>
                  <div className="md:col-span-5 grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <Label>Explorer URL</Label>
                      <Input value={w.explorerUrl||''} onChange={e=>{ const v=e.target.value; setCryptoWallets(prev=>prev.map(x=>x.id===w.id?{...x,explorerUrl:v}:x)); setHasUnsavedChanges(true); }} />
                    </div>
                    <div>
                      <Label>Network</Label>
                      <Input value={w.network||''} onChange={e=>{ const v=e.target.value; setCryptoWallets(prev=>prev.map(x=>x.id===w.id?{...x,network:v}:x)); setHasUnsavedChanges(true); }} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Input value={w.description||''} onChange={e=>{ const v=e.target.value; setCryptoWallets(prev=>prev.map(x=>x.id===w.id?{...x,description:v}:x)); setHasUnsavedChanges(true); }} />
                    </div>
                  </div>
                </div>
              ))}
              {cryptoWallets.length===0 && (
                <div className="text-sm text-muted-foreground">No wallets added</div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Sticky footer actions */}
      <div className="sticky bottom-4 flex justify-end">
        <div className="bg-card border rounded-full shadow-lg px-3 py-2 flex items-center gap-2">
          <div className="text-xs text-muted-foreground">{hasUnsavedChanges? 'Unsaved changes' : 'All changes saved'}</div>
          <Button size="sm" onClick={saveAll} disabled={isLoading}><Save className="h-4 w-4 mr-2"/>{isLoading? 'Saving...' : 'Save'}</Button>
        </div>
      </div>
    </div>
  );
};

export default DonationManagement;
