import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  Code2, 
  BarChart3, 
  Zap,
  ArrowRight,
  Check
} from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        <div className="absolute inset-0 gradient-hero opacity-10"></div>
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-hero">
              Add Pay-Per-Use Pricing to Your APIs in Minutes
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8">
              Built on x402. Managed through our dashboard. No redeployments for price changes.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="shadow-glow">
                <Link to="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="#how-it-works">How It Works</Link>
              </Button>
            </div>

            {/* Code Preview */}
            <Card className="mt-12 p-6 text-left bg-card border-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-destructive"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <span className="text-sm text-muted-foreground ml-2">server.js</span>
              </div>
              <pre className="text-sm overflow-x-auto">
                <code>{`import { paymentMiddleware } from '@coinbase/x402';
import { get402Config } from '@402exchange/config';

app.use(await get402Config('your_api_key'));`}</code>
              </pre>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Monetize Your APIs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A powerful configuration layer that makes x402 payments even easier to manage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Settings className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dashboard Control</h3>
              <p className="text-muted-foreground">
                Update pricing, wallets, and endpoints without code changes. Make changes live in seconds.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Code2 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Built on x402</h3>
              <p className="text-muted-foreground">
                Leverages Coinbase's battle-tested payment protocol. Secure, reliable, proven.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <BarChart3 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Track every API call, payment, and usage pattern in real-time with detailed insights.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-secondary text-secondary-foreground">Coming Soon</Badge>
              <Zap className="w-10 h-10 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2 text-muted-foreground">Intelligent Caching</h3>
              <p className="text-muted-foreground">
                Reduce costs and improve response times with smart caching strategies.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Integration in 3 Steps
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get up and running in minutes, not hours
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Configure Your API</h3>
                <p className="text-muted-foreground mb-4">
                  Set up endpoints, pricing, and wallet in our dashboard. No code required.
                </p>
              </div>
              <Card className="flex-1 p-4 bg-muted">
                <div className="text-sm font-mono">
                  <div className="text-muted-foreground">Endpoint: <span className="text-foreground">/api/data</span></div>
                  <div className="text-muted-foreground">Price: <span className="text-foreground">0.001 USDC</span></div>
                  <div className="text-muted-foreground">Network: <span className="text-foreground">Base Mainnet</span></div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Add Two Lines of Code</h3>
                <p className="text-muted-foreground mb-4">
                  Install x402 + our config wrapper in your API server. That's it.
                </p>
              </div>
              <Card className="flex-1 p-4 bg-card border-2">
                <pre className="text-xs overflow-x-auto">
                  <code>{`npm install @coinbase/x402 @402exchange/config

app.use(await get402Config('your_key'));`}</code>
                </pre>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Control Everything from Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Change pricing, monitor usage, no redeployments. Update instantly.
                </p>
              </div>
              <div className="flex-1 flex gap-2">
                <Card className="p-3 flex-1 text-center">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-xs text-muted-foreground">API Calls</div>
                </Card>
                <Card className="p-3 flex-1 text-center">
                  <div className="text-2xl font-bold text-primary">$12.47</div>
                  <div className="text-xs text-muted-foreground">Revenue</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-muted-foreground">
              Start free, scale as you grow
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <div className="text-4xl font-bold mb-1">$0</div>
              <p className="text-muted-foreground mb-6">per month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Up to 1,000 requests/month</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>1 API endpoint</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Basic analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Email support</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </Card>

            <Card className="p-8 border-2 border-primary hover:shadow-xl transition-shadow relative">
              <Badge className="absolute top-4 right-4 bg-primary">Popular</Badge>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <div className="text-4xl font-bold mb-1">$29</div>
              <p className="text-muted-foreground mb-6">per month</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Unlimited requests</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Unlimited endpoints</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Advanced analytics</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>1% platform fee</span>
                </li>
              </ul>
              <Button className="w-full shadow-glow" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </Card>

            <Card className="p-8 hover:shadow-xl transition-shadow">
              <h3 className="text-2xl font-bold mb-2">Enterprise</h3>
              <div className="text-4xl font-bold mb-1">Custom</div>
              <p className="text-muted-foreground mb-6">contact us</p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Custom solutions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Dedicated support</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>SLA guarantee</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span>Custom pricing</span>
                </li>
              </ul>
              <Button className="w-full" variant="outline" asChild>
                <Link to="/signup">Contact Sales</Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-lg">402exchange</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Configuration management for x402 payment protocol
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground">Features</Link></li>
                <li><Link to="#" className="hover:text-foreground">Pricing</Link></li>
                <li><Link to="#" className="hover:text-foreground">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="https://github.com/coinbase/x402" className="hover:text-foreground" target="_blank" rel="noopener noreferrer">x402 Docs</a></li>
                <li><Link to="#" className="hover:text-foreground">API Reference</Link></li>
                <li><Link to="#" className="hover:text-foreground">Guides</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="#" className="hover:text-foreground">About</Link></li>
                <li><Link to="#" className="hover:text-foreground">Blog</Link></li>
                <li><Link to="#" className="hover:text-foreground">Contact</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 402exchange. Built on x402 by Coinbase.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
