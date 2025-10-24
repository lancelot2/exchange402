import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { 
  Activity, 
  DollarSign, 
  Globe, 
  Clock,
  TrendingUp,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import { SeedDataButton } from '@/components/SeedDataButton';

interface DashboardStats {
  totalCalls: number;
  totalRevenue: number;
  activeEndpoints: number;
  avgResponseTime: number;
}

interface RecentCall {
  id: string;
  timestamp: string;
  endpoint_path: string;
  payment_amount: number;
  status: 'success' | 'failed' | 'pending';
  response_time_ms: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCalls: 0,
    totalRevenue: 0,
    activeEndpoints: 0,
    avgResponseTime: 0,
  });
  const [recentCalls, setRecentCalls] = useState<RecentCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasEndpoints, setHasEndpoints] = useState(false);

  useEffect(() => {
    if (user) {
      loadDashboardData();
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      // Check if user has any endpoints
      const { data: endpoints, error: endpointsError } = await supabase
        .from('endpoints')
        .select('id, endpoint_path, is_active')
        .eq('user_id', user?.id);

      if (endpointsError) throw endpointsError;

      setHasEndpoints(endpoints && endpoints.length > 0);

      if (!endpoints || endpoints.length === 0) {
        setLoading(false);
        return;
      }

      const activeCount = endpoints.filter((e) => e.is_active).length;

      // Get API calls stats
      const { data: calls, error: callsError } = await supabase
        .from('api_calls')
        .select('payment_amount, response_time_ms')
        .eq('user_id', user?.id)
        .eq('status', 'success');

      if (callsError) throw callsError;

      const totalRevenue = calls?.reduce((sum, call) => sum + (Number(call.payment_amount) || 0), 0) || 0;
      const avgResponseTime = calls && calls.length > 0
        ? calls.reduce((sum, call) => sum + (call.response_time_ms || 0), 0) / calls.length
        : 0;

      setStats({
        totalCalls: calls?.length || 0,
        totalRevenue,
        activeEndpoints: activeCount,
        avgResponseTime: Math.round(avgResponseTime),
      });

      // Get recent calls with endpoint info
      const { data: recent, error: recentError } = await supabase
        .from('api_calls')
        .select(`
          id,
          timestamp,
          payment_amount,
          status,
          response_time_ms,
          endpoints (endpoint_path)
        `)
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(10);

      if (recentError) throw recentError;

      const formattedCalls = recent?.map(call => ({
        id: call.id,
        timestamp: call.timestamp,
        endpoint_path: (call.endpoints as any)?.endpoint_path || 'Unknown',
        payment_amount: Number(call.payment_amount) || 0,
        status: call.status as 'success' | 'failed' | 'pending',
        response_time_ms: call.response_time_ms || 0,
      })) || [];

      setRecentCalls(formattedCalls);
    } catch (error) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasEndpoints) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <Globe className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome to 402exchange!</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-md">
            You haven't set up any endpoints yet. Let's get started by configuring your first API endpoint.
          </p>
          <Button size="lg" asChild className="shadow-glow">
            <Link to="/config">
              Set Up Your First Endpoint <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your API usage and revenue in real-time
          </p>
        </div>
        <SeedDataButton />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Activity className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total API Calls</p>
              <p className="text-2xl font-bold">{stats.totalCalls.toLocaleString()}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Globe className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Endpoints</p>
              <p className="text-2xl font-bold">{stats.activeEndpoints}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">{stats.avgResponseTime}ms</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
        </div>

        {recentCalls.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No API calls yet. Once you start receiving requests, they'll appear here.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Time</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Endpoint</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Amount</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Status</th>
                  <th className="pb-3 text-sm font-medium text-muted-foreground">Response</th>
                </tr>
              </thead>
              <tbody>
                {recentCalls.map((call) => (
                  <tr key={call.id} className="border-b border-border/50 last:border-0">
                    <td className="py-4 text-sm">
                      {new Date(call.timestamp).toLocaleString()}
                    </td>
                    <td className="py-4 text-sm font-mono">{call.endpoint_path}</td>
                    <td className="py-4 text-sm">${call.payment_amount.toFixed(4)}</td>
                    <td className="py-4 text-sm">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          call.status === 'success'
                            ? 'bg-green-500/10 text-green-600'
                            : call.status === 'failed'
                            ? 'bg-red-500/10 text-red-600'
                            : 'bg-yellow-500/10 text-yellow-600'
                        }`}
                      >
                        {call.status}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-muted-foreground">
                      {call.response_time_ms}ms
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
