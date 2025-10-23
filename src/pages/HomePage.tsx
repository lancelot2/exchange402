import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Code2, BarChart3, Zap, ArrowRight, Check, Wallet, TrendingUp } from 'lucide-react';
import logo from '@/assets/logo.png';
import shieldIcon from '@/assets/shield-icon.png';
export default function HomePage() {
  return <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32 hero-blue text-white">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-[66rem] mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Your API, Instantly Payable by AI Agents</h1>
            <p className="text-xl md:text-2xl mb-12 opacity-90">Configuration and monitoring layer for digital payments</p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-2 md:grid-cols-6 gap-6 mb-12 bg-white/10 backdrop-blur-sm p-6 rounded-2xl">
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🌐</span>
                <span className="text-sm font-medium">New distribution</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">⚡</span>
                <span className="text-sm font-medium">Instant settlement</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🔗</span>
                <span className="text-sm font-medium">Blockchain Agnostic</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">✨</span>
                <span className="text-sm font-medium">Frictionless</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🔒</span>
                <span className="text-sm font-medium">Private & secure</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <span className="text-4xl">🌍</span>
                <span className="text-sm font-medium">Web native</span>
              </div>
            </div>

            <div className="flex justify-center mb-12">
              <Button size="lg" asChild className="bg-white text-primary hover:bg-white/90 hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-white/20 text-lg px-8 py-6 font-semibold">
                <Link to="/signup">
                  Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Powered by x402 */}
            <div className="inline-flex items-center gap-4 px-6 py-3">
              <img src={shieldIcon} alt="x402 Protocol" className="w-12 h-auto" />
              <div className="text-left">
                <h2 className="text-2xl font-bold">
                  Powered by x402
                </h2>
                <p className="text-base opacity-90">
                  Open protocol for digital payments
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20" style={{
      background: "linear-gradient(to bottom,white 66px,transparent 500px),url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%232196f3' fill-opacity='0.1'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\")"
    }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need to Monetize Your APIs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A powerful configuration layer that makes x402 payments even easier to manage
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
              <Settings className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dashboard Control</h3>
              <p className="text-muted-foreground">
                Update pricing, wallets, and endpoints without code changes. Make changes live in seconds.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
              <Code2 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Built on x402</h3>
              <p className="text-muted-foreground">
                Leverages Coinbase's battle-tested payment protocol. Secure, reliable, proven.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow bg-card">
              <BarChart3 className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Analytics</h3>
              <p className="text-muted-foreground">
                Track every API call, payment, and usage pattern in real-time with detailed insights.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden bg-card">
              <Badge className="absolute top-4 right-4 hero-blue text-white">Coming Soon</Badge>
              <Wallet className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Smart Wallet</h3>
              <p className="text-muted-foreground">
                Advanced wallet features for seamless payment management and automation.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden bg-card">
              <Badge className="absolute top-4 right-4 hero-blue text-white">Coming Soon</Badge>
              <TrendingUp className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Dynamic Pricing</h3>
              <p className="text-muted-foreground">
                Automatically adjust pricing based on demand, usage patterns, and market conditions.
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow relative overflow-hidden bg-card">
              <Badge className="absolute top-4 right-4 hero-blue text-white">Coming Soon</Badge>
              <Zap className="w-10 h-10 text-primary mb-4" />
              <h3 className="text-xl font-semibold mb-2">Intelligent Caching</h3>
              <p className="text-muted-foreground">
                Reduce costs and improve response times with smart caching strategies.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#1A1F2C] text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Integration in 3 Steps
            </h2>
            <p className="text-lg opacity-80 max-w-2xl mx-auto">
              Get up and running in minutes, not hours
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                1
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Configure Your API</h3>
                <p className="opacity-80 mb-4">
                  Set up endpoints, pricing, and wallet in our dashboard. No code required.
                </p>
              </div>
              <Card className="flex-1 p-4 bg-white/5 border-white/10 text-white">
                <div className="text-sm font-mono">
                  <div className="opacity-70">Endpoint: <span className="opacity-100">/api/data</span></div>
                  <div className="opacity-70">Price: <span className="opacity-100">0.001 USDC</span></div>
                  <div className="opacity-70">Network: <span className="opacity-100">Base Mainnet</span></div>
                </div>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                2
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Add Two Lines of Code</h3>
                <p className="opacity-80 mb-4">
                  Install x402 + our config wrapper in your API server. That's it.
                </p>
              </div>
              <Card className="flex-1 p-4 bg-white/5 border-white/10 text-white">
                <pre className="text-xs overflow-x-auto">
                  <code>{`npm install @coinbase/x402 @402exchange/config

app.use(await get402Config('your_key'));`}</code>
                </pre>
              </Card>
            </div>

            <div className="flex flex-col md:flex-row gap-6 items-center">
              <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center text-xl font-bold flex-shrink-0">
                3
              </div>
              <div className="flex-1">
                <h3 className="text-2xl font-semibold mb-2">Control Everything from Dashboard</h3>
                <p className="opacity-80 mb-4">
                  Change pricing, monitor usage, no redeployments. Update instantly.
                </p>
              </div>
              <div className="flex-1 flex gap-2">
                <Card className="p-3 flex-1 text-center bg-white/5 border-white/10 text-white">
                  <div className="text-2xl font-bold text-primary">1,247</div>
                  <div className="text-xs opacity-70">API Calls</div>
                </Card>
                <Card className="p-3 flex-1 text-center bg-white/5 border-white/10 text-white">
                  <div className="text-2xl font-bold text-primary">$12.47</div>
                  <div className="text-xs opacity-70">Revenue</div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20" style={{
      background: "linear-gradient(to bottom,white 66px,transparent 500px),url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='199' viewBox='0 0 100 199'%3E%3Cg fill='%232196f3' fill-opacity='0.1'%3E%3Cpath d='M0 199V0h1v1.99L100 199h-1.12L1 4.22V199H0zM100 2h-.12l-1-2H100v2z'%3E%3C/path%3E%3C/g%3E%3C/svg%3E\")"
    }}>
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
          

          <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 402exchange. Built on x402 by Coinbase.</p>
          </div>
        </div>
      </footer>
    </div>;
}