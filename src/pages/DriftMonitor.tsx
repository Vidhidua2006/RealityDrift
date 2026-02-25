import DashboardLayout from '@/components/DashboardLayout';
import DriftCard from '@/components/DriftCard';
import { useRealtimeTable } from '@/hooks/use-realtime';
import { Activity } from 'lucide-react';

interface DbDrift { id: string; entity_id: string; entity_name: string; previous_state: string; current_state: string; drift_detected: boolean; change_summary: string; severity: string; confidence: number; explanation: string; recommended_action: string; created_at: string; }

const DriftMonitor = () => {
  const { data: drifts, loading } = useRealtimeTable<DbDrift>('drift_analyses');

  const mapped = drifts.map(d => ({
    id: d.id, entityId: d.entity_id, entityName: d.entity_name,
    previousState: d.previous_state, currentState: d.current_state,
    driftDetected: d.drift_detected, changeSummary: d.change_summary,
    severity: d.severity as 'LOW' | 'MEDIUM' | 'HIGH',
    confidence: d.confidence, explanation: d.explanation,
    recommendedAction: d.recommended_action, timestamp: d.created_at,
  }));

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Drift Monitor</h1>
        <p className="text-muted-foreground mt-1">Real-time drift detection and analysis — auto-updates</p>
      </div>
      {loading ? (
        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
      ) : mapped.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <Activity className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">No drift events to display.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4">
          {mapped.map(d => <DriftCard key={d.id} drift={d} />)}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DriftMonitor;
