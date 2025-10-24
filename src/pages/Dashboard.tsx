import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'react-router-dom';
import { Globe, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';
import { SeedDataButton } from '@/components/SeedDataButton';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { ApiCallsTable } from '@/components/dashboard/ApiCallsTable';
import { DateRangePicker } from '@/components/dashboard/DateRangePicker';
import { DateRange } from 'react-day-picker';
import { subHours, subDays, subWeeks } from 'date-fns';

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
  wallet_address: string | null;
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
  
  const now = new Date();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(now, 1),
    to: now,
  });
  const [selectedPreset, setSelectedPreset] = useState('1 day');

  const presets = [
    { label: '1 hour', value: { from: subHours(now, 1), to: now } },
    { label: '6 hours', value: { from: subHours(now, 6), to: now } },
    { label: '1 day', value: { from: subDays(now, 1), to: now } },
    { label: '1 week', value: { from: subWeeks(now, 1), to: now } },
  ];

  useEffect(() => {
    if (user && dateRange?.from) {
      loadDashboardData();
    }
  }, [user, dateRange]);

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

      // Get API calls stats filtered by date range
      let callsQuery = supabase
        .from('api_calls')
        .select('payment_amount, response_time_ms')
        .eq('user_id', user?.id)
        .eq('status', 'success');

      if (dateRange?.from) {
        callsQuery = callsQuery.gte('timestamp', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        callsQuery = callsQuery.lte('timestamp', dateRange.to.toISOString());
      }

      const { data: calls, error: callsError } = await callsQuery;

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

      // Get recent calls with endpoint info filtered by date range
      let recentQuery = supabase
        .from('api_calls')
        .select(`
          id,
          timestamp,
          payment_amount,
          status,
          response_time_ms,
          wallet_address,
          endpoints (endpoint_path)
        `)
        .eq('user_id', user?.id)
        .order('timestamp', { ascending: false })
        .limit(100);

      if (dateRange?.from) {
        recentQuery = recentQuery.gte('timestamp', dateRange.from.toISOString());
      }
      if (dateRange?.to) {
        recentQuery = recentQuery.lte('timestamp', dateRange.to.toISOString());
      }

      const { data: recent, error: recentError } = await recentQuery;

      if (recentError) throw recentError;

      const formattedCalls = recent?.map(call => ({
        id: call.id,
        timestamp: call.timestamp,
        endpoint_path: (call.endpoints as any)?.endpoint_path || 'Unknown',
        payment_amount: Number(call.payment_amount) || 0,
        status: call.status as 'success' | 'failed' | 'pending',
        response_time_ms: call.response_time_ms || 0,
        wallet_address: call.wallet_address,
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

      {/* Date Range Picker */}
      <DateRangePicker
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
        presets={presets}
        selectedPreset={selectedPreset}
        onPresetChange={setSelectedPreset}
      />

      {/* Stats Grid */}
      <DashboardStats stats={stats} />

      {/* Recent Activity */}
      <div className="mt-8">
        <ApiCallsTable calls={recentCalls} />
      </div>
    </div>
  );
}
