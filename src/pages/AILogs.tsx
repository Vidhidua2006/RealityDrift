import DashboardLayout from '@/components/DashboardLayout';
import { useRealtimeTable } from '@/hooks/use-realtime';
import { FileCode, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DbLog { id: string; entity_id: string; entity_name: string; request_data: Record<string, unknown>; response_data: Record<string, unknown>; created_at: string; }

const AILogs = () => {
  const { data: logs, loading } = useRealtimeTable<DbLog>('ai_logs');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">AI Analysis Logs</h1>
        <p className="text-muted-foreground mt-1">Detailed AI request and response logs</p>
      </div>

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
      ) : logs.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <FileCode className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">No AI logs available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {logs.map(log => (
            <div key={log.id} className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{log.entity_name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock size={12} /> {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</p>
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono font-semibold bg-primary/15 text-primary border border-primary/30">AI LOG</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">Request Data</p>
                <pre className="rounded-lg bg-input border border-border p-4 text-sm text-muted-foreground font-mono overflow-x-auto">{JSON.stringify(log.request_data, null, 2)}</pre>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">AI Response</p>
                <pre className="rounded-lg bg-input border border-border p-4 text-xs severity-low font-mono overflow-x-auto">{JSON.stringify(log.response_data, null, 2)}</pre>
              </div>
              <p className="text-xs text-muted-foreground/60 font-mono">Log ID: {log.id.slice(0, 8)}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AILogs;
