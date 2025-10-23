import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Wallet, Plus, Trash2, Edit, Globe } from 'lucide-react';

interface WalletData {
  id: string;
  wallet_address: string;
  network: string;
}

interface Endpoint {
  id: string;
  endpoint_path: string;
  description: string | null;
  price_per_call: number;
  currency: string;
  network: string;
  is_active: boolean;
}

export default function Configuration() {
  const { user } = useAuth();
  const [wallets, setWallets] = useState<WalletData[]>([]);
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEndpoint, setEditingEndpoint] = useState<Endpoint | null>(null);

  // Form states
  const [walletAddress, setWalletAddress] = useState('');
  const [walletNetwork, setWalletNetwork] = useState('base-mainnet');
  const [endpointPath, setEndpointPath] = useState('');
  const [endpointDesc, setEndpointDesc] = useState('');
  const [endpointPrice, setEndpointPrice] = useState('');
  const [endpointCurrency, setEndpointCurrency] = useState('USDC');
  const [endpointNetwork, setEndpointNetwork] = useState('base-mainnet');

  useEffect(() => {
    if (user) {
      loadConfiguration();
    }
  }, [user]);

  const loadConfiguration = async () => {
    try {
      const [walletsRes, endpointsRes] = await Promise.all([
        supabase.from('wallets').select('*').eq('user_id', user?.id),
        supabase.from('endpoints').select('*').eq('user_id', user?.id).order('created_at', { ascending: false }),
      ]);

      if (walletsRes.error) throw walletsRes.error;
      if (endpointsRes.error) throw endpointsRes.error;

      setWallets(walletsRes.data || []);
      setEndpoints(endpointsRes.data || []);
    } catch (error) {
      console.error('Error loading configuration:', error);
      toast.error('Failed to load configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveWallet = async () => {
    if (!walletAddress || !walletNetwork) {
      toast.error('Please fill in all wallet fields');
      return;
    }

    try {
      const existingWallet = wallets.find((w) => w.network === walletNetwork);

      if (existingWallet) {
        const { error } = await supabase
          .from('wallets')
          .update({ wallet_address: walletAddress })
          .eq('id', existingWallet.id);

        if (error) throw error;
        toast.success('Wallet updated successfully');
      } else {
        const { error } = await supabase.from('wallets').insert({
          user_id: user?.id,
          wallet_address: walletAddress,
          network: walletNetwork,
        });

        if (error) throw error;
        toast.success('Wallet added successfully');
      }

      setWalletAddress('');
      loadConfiguration();
    } catch (error: any) {
      console.error('Error saving wallet:', error);
      toast.error(error.message || 'Failed to save wallet');
    }
  };

  const handleSaveEndpoint = async () => {
    if (!endpointPath || !endpointPrice) {
      toast.error('Please fill in required fields');
      return;
    }

    if (!endpointPath.startsWith('/')) {
      toast.error('Endpoint path must start with "/"');
      return;
    }

    const price = parseFloat(endpointPrice);
    if (isNaN(price) || price <= 0) {
      toast.error('Price must be a positive number');
      return;
    }

    try {
      if (editingEndpoint) {
        const { error } = await supabase
          .from('endpoints')
          .update({
            endpoint_path: endpointPath,
            description: endpointDesc || null,
            price_per_call: price,
            currency: endpointCurrency,
            network: endpointNetwork,
          })
          .eq('id', editingEndpoint.id);

        if (error) throw error;
        toast.success('Endpoint updated successfully');
      } else {
        const { error } = await supabase.from('endpoints').insert({
          user_id: user?.id,
          endpoint_path: endpointPath,
          description: endpointDesc || null,
          price_per_call: price,
          currency: endpointCurrency,
          network: endpointNetwork,
          is_active: true,
        });

        if (error) throw error;
        toast.success('Endpoint added successfully');
      }

      resetEndpointForm();
      setDialogOpen(false);
      loadConfiguration();
    } catch (error: any) {
      console.error('Error saving endpoint:', error);
      toast.error(error.message || 'Failed to save endpoint');
    }
  };

  const resetEndpointForm = () => {
    setEndpointPath('');
    setEndpointDesc('');
    setEndpointPrice('');
    setEndpointCurrency('USDC');
    setEndpointNetwork('base-mainnet');
    setEditingEndpoint(null);
  };

  const handleEditEndpoint = (endpoint: Endpoint) => {
    setEndpointPath(endpoint.endpoint_path);
    setEndpointDesc(endpoint.description || '');
    setEndpointPrice(endpoint.price_per_call.toString());
    setEndpointCurrency(endpoint.currency);
    setEndpointNetwork(endpoint.network);
    setEditingEndpoint(endpoint);
    setDialogOpen(true);
  };

  const handleDeleteEndpoint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this endpoint?')) return;

    try {
      const { error } = await supabase.from('endpoints').delete().eq('id', id);

      if (error) throw error;
      toast.success('Endpoint deleted successfully');
      loadConfiguration();
    } catch (error: any) {
      console.error('Error deleting endpoint:', error);
      toast.error('Failed to delete endpoint');
    }
  };

  const handleToggleEndpoint = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('endpoints')
        .update({ is_active: !isActive })
        .eq('id', id);

      if (error) throw error;
      toast.success(`Endpoint ${!isActive ? 'activated' : 'deactivated'}`);
      loadConfiguration();
    } catch (error: any) {
      console.error('Error toggling endpoint:', error);
      toast.error('Failed to update endpoint');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Configuration</h1>
        <p className="text-muted-foreground">
          Manage your wallet addresses and API endpoints
        </p>
      </div>

      {/* Wallet Configuration */}
      <Card className="p-6 mb-8">
        <div className="flex items-center gap-2 mb-6">
          <Wallet className="w-5 h-5 text-primary" />
          <h2 className="text-xl font-semibold">Wallet Configuration</h2>
        </div>

        {wallets.length > 0 && (
          <div className="mb-6 space-y-3">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-mono text-sm">{wallet.wallet_address}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Network: {wallet.network === 'base-mainnet' ? 'Base Mainnet' : 'Base Sepolia'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <Label htmlFor="wallet">Wallet Address</Label>
            <Input
              id="wallet"
              placeholder="0x..."
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              className="font-mono"
            />
          </div>

          <div>
            <Label htmlFor="network">Network</Label>
            <Select value={walletNetwork} onValueChange={setWalletNetwork}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="base-mainnet">Base Mainnet</SelectItem>
                <SelectItem value="base-sepolia">Base Sepolia (Testnet)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={handleSaveWallet}>
            {wallets.find((w) => w.network === walletNetwork) ? 'Update Wallet' : 'Add Wallet'}
          </Button>
        </div>
      </Card>

      {/* API Endpoints */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="text-xl font-semibold">API Endpoints</h2>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetEndpointForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Endpoint
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingEndpoint ? 'Edit Endpoint' : 'Add New Endpoint'}
                </DialogTitle>
                <DialogDescription>
                  Configure your API endpoint pricing and details
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="path">Endpoint Path *</Label>
                  <Input
                    id="path"
                    placeholder="/api/data"
                    value={endpointPath}
                    onChange={(e) => setEndpointPath(e.target.value)}
                    className="font-mono"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="What does this endpoint do?"
                    value={endpointDesc}
                    onChange={(e) => setEndpointDesc(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price per Call *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.000001"
                    min="0"
                    placeholder="0.001"
                    value={endpointPrice}
                    onChange={(e) => setEndpointPrice(e.target.value)}
                  />
                </div>

                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={endpointCurrency} onValueChange={setEndpointCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USDC">USDC</SelectItem>
                      <SelectItem value="USDT">USDT</SelectItem>
                      <SelectItem value="PYUSD">PYUSD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="endpoint-network">Network</Label>
                  <Select value={endpointNetwork} onValueChange={setEndpointNetwork}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="base-mainnet">Base Mainnet</SelectItem>
                      <SelectItem value="base-sepolia">Base Sepolia (Testnet)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSaveEndpoint} className="w-full">
                  {editingEndpoint ? 'Update Endpoint' : 'Add Endpoint'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {endpoints.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Globe className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No endpoints configured yet. Click "Add Endpoint" to get started.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {endpoints.map((endpoint) => (
              <div
                key={endpoint.id}
                className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="font-mono text-sm font-semibold">{endpoint.endpoint_path}</code>
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${
                          endpoint.is_active
                            ? 'bg-green-500/10 text-green-600'
                            : 'bg-gray-500/10 text-gray-600'
                        }`}
                      >
                        {endpoint.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    {endpoint.description && (
                      <p className="text-sm text-muted-foreground mb-2">{endpoint.description}</p>
                    )}
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span>Price: {endpoint.price_per_call} {endpoint.currency}</span>
                      <span>Network: {endpoint.network === 'base-mainnet' ? 'Base Mainnet' : 'Base Sepolia'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Switch
                      checked={endpoint.is_active}
                      onCheckedChange={() => handleToggleEndpoint(endpoint.id, endpoint.is_active)}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEditEndpoint(endpoint)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteEndpoint(endpoint.id)}
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
