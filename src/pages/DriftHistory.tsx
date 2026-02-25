import DashboardLayout from '@/components/DashboardLayout';
import SeverityBadge from '@/components/SeverityBadge';
import { useRealtimeTable } from '@/hooks/use-realtime';
import { Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DbDrift { id: string; entity_id: string; entity_name: string; previous_state: string; current_state: string; drift_detected: boolean; change_summary: string; severity: string; confidence: number; explanation: string; recommended_action: string; created_at: string; }

const DriftHistory = () => {
  const { data: drifts, loading } = useRealtimeTable<DbDrift>('drift_analyses');

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Drift History</h1>
        <p className="text-muted-foreground mt-1">Complete timeline of all drift analyses</p>
      </div>

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
      ) : drifts.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <Clock className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">No drift history available.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {drifts.map(d => (
            <div key={d.id} className="rounded-lg border border-border bg-card p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{d.entity_name}</h3>
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1"><Clock size={12} /> {formatDistanceToNow(new Date(d.created_at), { addSuffix: true })}</p>
                </div>
                <SeverityBadge severity={d.severity as 'LOW' | 'MEDIUM' | 'HIGH'} />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Previous State</p>
                  <div className="rounded-lg bg-input border border-border p-3 text-sm text-foreground font-mono">{d.previous_state}</div>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Current State</p>
                  <div className="rounded-lg bg-input border border-border p-3 text-sm text-foreground font-mono">{d.current_state}</div>
                </div>
              </div>
              <div className="rounded-lg bg-secondary/50 border border-border p-4 space-y-3">
                <div><p className="text-sm font-semibold text-foreground">Summary</p><p className="text-sm text-muted-foreground">{d.change_summary}</p></div>
                <div><p className="text-sm font-semibold text-foreground">Analysis</p><p className="text-sm text-muted-foreground">{d.explanation}</p></div>
                <div><p className="text-sm font-semibold text-foreground">Recommended Action</p><p className="text-sm text-muted-foreground">{d.recommended_action}</p></div>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground/60 font-mono">
                <span>Confidence: {d.confidence}%</span>
                <span>ID: {d.id.slice(0, 8)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DriftHistory;
