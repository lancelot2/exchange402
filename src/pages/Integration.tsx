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
        <Tabs defaultValue="express">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger 
              value="express"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Express/Node.js
            </TabsTrigger>
            <TabsTrigger 
              value="nextjs"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Next.js
            </TabsTrigger>
            <TabsTrigger 
              value="other"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Other Frameworks
            </TabsTrigger>
          </TabsList>

          <TabsContent value="express" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Install Coinbase's x402 middleware</h3>
              <Card className="p-4 bg-muted relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('npm install @coinbase/x402')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="text-sm"><code>npm install @coinbase/x402</code></pre>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Add to Your Express Server</h3>
              <Card className="p-4 bg-muted relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`import { paymentMiddleware } from '@coinbase/x402';

// Fetch your configuration from 402exchange
const response = await fetch('https://api.402exchange.com/config?apiKey=${apiKey}');
const config = await response.json();

// Apply x402 middleware with your configuration
app.use(paymentMiddleware(config.walletAddress, config.endpoints));

// Your API routes below will now require payment
app.get('/api-patients', (req, res) => {
  // Your existing code
});`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="text-sm overflow-x-auto pr-10"><code>{`import { paymentMiddleware } from '@coinbase/x402';

// Fetch your configuration from 402exchange
const response = await fetch('https://api.402exchange.com/config?apiKey=${apiKey}');
const config = await response.json();

// Apply x402 middleware with your configuration
app.use(paymentMiddleware(config.walletAddress, config.endpoints));

// Your API routes below will now require payment
app.get('/api-patients', (req, res) => {
  // Your existing code
});`}</code></pre>
              </Card>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg border border-border">
              <h4 className="font-semibold mb-2">Important Notes:</h4>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                <li>Add this middleware BEFORE your API route definitions</li>
                <li>The middleware will automatically return 402 Payment Required for unpaid requests</li>
                <li>Update your pricing or wallet in the Configuration page - changes apply immediately after server restart</li>
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="nextjs" className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">1. Install Package</h3>
              <Card className="p-4 bg-muted relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard('npm install @coinbase/x402')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="text-sm"><code>npm install @coinbase/x402</code></pre>
              </Card>
            </div>

            <div>
              <h3 className="font-semibold mb-2">2. Create Middleware (middleware.ts in project root)</h3>
              <Card className="p-4 bg-muted relative">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute top-2 right-2"
                  onClick={() => copyToClipboard(`import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Fetch config from 402exchange
  const response = await fetch('https://api.402exchange.com/config?apiKey=${apiKey}');
  const config = await response.json();
  
  // Check for payment header
  const payment = request.headers.get('X-PAYMENT');
  
  if (!payment) {
    return new NextResponse(
      JSON.stringify({
        maxAmountRequired: config.endpoints[request.nextUrl.pathname],
        resource: request.nextUrl.pathname,
        payTo: config.walletAddress,
        asset: config.asset,
        network: config.network
      }),
      { 
        status: 402,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};`)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <pre className="text-sm overflow-x-auto pr-10"><code>{`import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // Fetch config from 402exchange
  const response = await fetch('https://api.402exchange.com/config?apiKey=${apiKey}');
  const config = await response.json();
  
  // Check for payment header
  const payment = request.headers.get('X-PAYMENT');
  
  if (!payment) {
    return new NextResponse(
      JSON.stringify({
        maxAmountRequired: config.endpoints[request.nextUrl.pathname],
        resource: request.nextUrl.pathname,
        payTo: config.walletAddress,
        asset: config.asset,
        network: config.network
      }),
      { 
        status: 402,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
};`}</code></pre>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="other" className="space-y-4">
            <div className="space-y-4">
              <p className="text-muted-foreground">For FastAPI, Flask, or other frameworks:</p>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li>Install Coinbase's x402 package for your language (if available)</li>
                <li>Fetch your configuration from: <code className="bg-muted px-2 py-1 rounded text-xs">https://api.402exchange.com/config?apiKey={apiKey}</code></li>
                <li>Apply payment middleware before your route handlers</li>
                <li>See x402 documentation: <a href="https://docs.cdp.coinbase.com/x402/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">https://docs.cdp.coinbase.com/x402/</a></li>
              </ol>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Test Your Integration</h2>
        <p className="text-sm text-muted-foreground mb-4">Once middleware is added, test with curl:</p>
        <Card className="p-4 bg-muted relative">
          <Button 
            variant="outline" 
            size="icon" 
            className="absolute top-2 right-2"
            onClick={() => copyToClipboard(`# This should return 402 Payment Required
curl -X GET https://your-api-url.com/api-patients

# Response should include payment details:
# {
#   "maxAmountRequired": "0.01",
#   "resource": "/api-patients",
#   "payTo": "0xYourWallet...",
#   "asset": "USDC",
#   "network": "base-mainnet"
# }`)}
          >
            <Copy className="w-4 h-4" />
          </Button>
          <pre className="text-sm overflow-x-auto pr-10"><code>{`# This should return 402 Payment Required
curl -X GET https://your-api-url.com/api-patients

# Response should include payment details:
# {
#   "maxAmountRequired": "0.01",
#   "resource": "/api-patients",
#   "payTo": "0xYourWallet...",
#   "asset": "USDC",
#   "network": "base-mainnet"
# }`}</code></pre>
        </Card>
      </Card>

      <Card className="p-6 mt-8">
        <h2 className="text-xl font-semibold mb-4">Troubleshooting</h2>
        <div className="space-y-3 text-sm">
          <div>
            <p className="font-medium">Server won't start:</p>
            <p className="text-muted-foreground">Make sure to use <code className="bg-muted px-2 py-1 rounded text-xs">await</code> when fetching config, or fetch config before starting server</p>
          </div>
          <div>
            <p className="font-medium">Still getting regular responses:</p>
            <p className="text-muted-foreground">Middleware must be added BEFORE route definitions</p>
          </div>
          <div>
            <p className="font-medium">Config not updating:</p>
            <p className="text-muted-foreground">Restart your server after changing settings in dashboard</p>
          </div>
          <div>
            <p className="font-medium">Need help?</p>
            <p className="text-muted-foreground">Join our Discord or email support@402exchange.com</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
