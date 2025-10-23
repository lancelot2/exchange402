import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Copy, RefreshCw } from 'lucide-react';

export default function Integration() {
  const { user } = useAuth();
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) loadApiKey();
  }, [user]);

  const loadApiKey = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('api_key')
        .eq('user_id', user?.id)
        .eq('is_active', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      
      if (data) {
        setApiKey(data.api_key);
      } else {
        await generateApiKey();
      }
    } catch (error) {
      console.error('Error loading API key:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    const newKey = `402x_${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
    
    try {
      const { error } = await supabase.from('api_keys').insert({
        user_id: user?.id,
        api_key: newKey,
        is_active: true,
      });

      if (error) throw error;
      setApiKey(newKey);
      toast.success('API key generated');
    } catch (error: any) {
      toast.error('Failed to generate API key');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Integration</h1>
        <p className="text-muted-foreground">Get your API key and integration instructions</p>
      </div>

      <Card className="p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your API Key</h2>
        <div className="flex gap-2">
          <code className="flex-1 p-3 bg-muted rounded font-mono text-sm break-all">{apiKey || 'Loading...'}</code>
          <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiKey)}>
            <Copy className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={generateApiKey}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <Tabs defaultValue="quickstart">
          <TabsList>
            <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
            <TabsTrigger value="nextjs">Next.js</TabsTrigger>
            <TabsTrigger value="other">Other Frameworks</TabsTrigger>
          </TabsList>

          <TabsContent value="quickstart" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Install Dependencies</h3>
              <Card className="p-4 bg-muted">
                <pre className="text-sm"><code>npm install @coinbase/x402 @402exchange/config</code></pre>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Add to Your Server</h3>
              <Card className="p-4 bg-muted">
                <pre className="text-sm overflow-x-auto"><code>{`import { paymentMiddleware } from '@coinbase/x402';
import { get402Config } from '@402exchange/config';

app.use(await get402Config('${apiKey}'));`}</code></pre>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="nextjs">
            <p className="text-muted-foreground">Coming soon - Next.js specific instructions</p>
          </TabsContent>

          <TabsContent value="other">
            <p className="text-muted-foreground">Coming soon - Other framework instructions</p>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
