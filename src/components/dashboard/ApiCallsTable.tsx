import { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Activity, TrendingUp, Download, Search, ArrowUpDown, RefreshCw, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ApiCall {
  id: string;
  timestamp: string;
  endpoint_path: string;
  payment_amount: number;
  status: 'success' | 'failed' | 'pending';
  response_time_ms: number;
  wallet_address: string | null;
}

interface ApiCallsTableProps {
  calls: ApiCall[];
  onRefresh?: () => void;
}

type SortField = 'timestamp' | 'endpoint_path' | 'payment_amount' | 'status' | 'response_time_ms';
type SortDirection = 'asc' | 'desc';

export function ApiCallsTable({ calls, onRefresh }: ApiCallsTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const truncateWallet = (wallet: string | null) => {
    if (!wallet) return 'N/A';
    if (wallet.length <= 10) return wallet;
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  const filteredAndSortedCalls = useMemo(() => {
    let filtered = calls.filter((call) => {
      const matchesSearch =
        call.endpoint_path.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (call.wallet_address && call.wallet_address.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || call.status === statusFilter;
      return matchesSearch && matchesStatus;
    });

    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'timestamp') {
        aVal = new Date(a.timestamp).getTime();
        bVal = new Date(b.timestamp).getTime();
      }

      if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [calls, searchQuery, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const exportToCSV = () => {
    const headers = ['Time', 'Endpoint', 'Wallet', 'Amount', 'Status', 'Response Time'];
    const rows = filteredAndSortedCalls.map((call) => [
      new Date(call.timestamp).toLocaleString(),
      call.endpoint_path,
      call.wallet_address || 'N/A',
      `$${call.payment_amount.toFixed(4)}`,
      call.status,
      `${call.response_time_ms}ms`,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `api-calls-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Exported to CSV');
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Recent Activity
          </h2>
          {onRefresh && (
            <Button onClick={onRefresh} variant="ghost" size="icon">
              <RefreshCw className="w-4 h-4" />
            </Button>
          )}
        </div>
        <Button onClick={exportToCSV} variant="outline" size="sm">
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by endpoint or wallet..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="success">Success</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filteredAndSortedCalls.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
          <p>
            {calls.length === 0
              ? "No API calls yet. Once you start receiving requests, they'll appear here."
              : 'No results found. Try adjusting your search or filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('timestamp')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Time
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('endpoint_path')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Endpoint
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">Wallet</th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('payment_amount')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Amount
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('status')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Status
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground">
                  <button
                    onClick={() => handleSort('response_time_ms')}
                    className="flex items-center gap-1 hover:text-foreground"
                  >
                    Response
                    <ArrowUpDown className="w-3 h-3" />
                  </button>
                </th>
                <th className="pb-3 text-sm font-medium text-muted-foreground"></th>
              </tr>
            </thead>
            <tbody>
              {filteredAndSortedCalls.map((call) => (
                <tr key={call.id} className="border-b border-border/50 last:border-0">
                  <td className="py-4 text-sm">{new Date(call.timestamp).toLocaleString()}</td>
                  <td className="py-4 text-sm font-mono">{call.endpoint_path}</td>
                  <td className="py-4 text-sm font-mono text-muted-foreground">
                    {truncateWallet(call.wallet_address)}
                  </td>
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
                  <td className="py-4 text-sm text-muted-foreground">{call.response_time_ms}ms</td>
                  <td className="py-4 text-sm">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {
                        // Will redirect to BaseScan transaction
                        toast.info('BaseScan integration coming soon');
                      }}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
