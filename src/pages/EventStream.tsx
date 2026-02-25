import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRealtimeTable } from '@/hooks/use-realtime';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Radio, AlertCircle, Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface DbEvent { id: string; entity_id: string; entity_name: string; event_type: string; description: string; new_state: string; created_at: string; }
interface DbEntity { id: string; name: string; current_state: string; type: string; created_at: string; updated_at: string; }

const EVENT_TYPES = ['accident', 'status_change', 'policy_update', 'news_alert'];

const EventStream = () => {
  const { user } = useAuth();
  const { data: events, loading } = useRealtimeTable<DbEvent>('drift_events');
  const { data: entities } = useRealtimeTable<DbEntity>('entities');
  const [showForm, setShowForm] = useState(false);
  const [entityId, setEntityId] = useState('');
  const [eventType, setEventType] = useState('status_change');
  const [description, setDescription] = useState('');
  const [newState, setNewState] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const { toast } = useToast();

  const handleTrigger = async (e: React.FormEvent) => {
    e.preventDefault();
    const entity = entities.find(en => en.id === entityId);
    if (!entity || !user) return;
    setSubmitting(true);

    // Insert event
    await supabase.from('drift_events').insert({
      user_id: user.id, entity_id: entityId, entity_name: entity.name,
      event_type: eventType, description, new_state: newState,
    });

    // Call AI drift analysis
    const { error } = await supabase.functions.invoke('drift-analyze', {
      body: {
        entity_id: entityId,
        entity_name: entity.name,
        previous_state: entity.current_state,
        current_state: newState,
      },
    });

    if (error) toast({ title: 'Analysis error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Event triggered', description: 'AI drift analysis complete.' });

    setEntityId(''); setDescription(''); setNewState(''); setShowForm(false);
    setSubmitting(false);
  };

  const handleSimulate = async () => {
    setSimulating(true);
    const { error } = await supabase.functions.invoke('simulate-stream');
    if (error) toast({ title: 'Simulation error', description: error.message, variant: 'destructive' });
    else toast({ title: 'Simulation complete', description: 'A new streaming event was generated and analyzed.' });
    setSimulating(false);
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Event Stream</h1>
          <p className="text-muted-foreground mt-1">Trigger events and monitor real-time drift detection</p>
        </div>
        <div className="flex gap-3">
          <button onClick={handleSimulate} disabled={simulating} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50">
            <Zap size={16} /> {simulating ? 'Simulating...' : 'Simulate Stream'}
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
            <Plus size={16} /> Trigger Event
          </button>
        </div>
      </div>

      {showForm && (
        <form onSubmit={handleTrigger} className="rounded-lg border border-border bg-card p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-foreground">Trigger New Event</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Entity</label>
              <select value={entityId} onChange={e => setEntityId(e.target.value)} required className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                <option value="">Select entity</option>
                {entities.map(en => <option key={en.id} value={en.id}>{en.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Event Type</label>
              <select value={eventType} onChange={e => setEventType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {EVENT_TYPES.map(t => <option key={t} value={t}>{t.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Description</label>
            <input value={description} onChange={e => setDescription(e.target.value)} required placeholder="Brief description of the event" className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">New State</label>
            <textarea value={newState} onChange={e => setNewState(e.target.value)} required placeholder="Describe the new state after this event..." rows={3} className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50">{submitting ? 'Analyzing...' : 'Trigger Event'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-80 transition">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-lg border border-border bg-card p-6">
        <h3 className="font-semibold text-foreground mb-4">Live Event Feed</h3>
        {loading ? (
          <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
        ) : events.length === 0 ? (
          <div className="text-center py-8">
            <Radio className="mx-auto mb-3 text-muted-foreground" size={40} />
            <p className="text-muted-foreground">No events recorded yet.</p>
            <p className="text-sm text-muted-foreground/70 mt-1">Click "Simulate Stream" to generate demo events with AI analysis.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {events.map(ev => (
              <div key={ev.id} className="flex items-start gap-3 py-3 border-b border-border last:border-0">
                <AlertCircle size={16} className="text-primary mt-1" />
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-foreground">{ev.event_type.toUpperCase()}</span>
                    <span className="text-muted-foreground ml-2 text-xs">{formatDistanceToNow(new Date(ev.created_at), { addSuffix: true })}</span>
                  </p>
                  <p className="text-sm text-muted-foreground">{ev.entity_name}</p>
                  <p className="text-xs text-muted-foreground/60">{ev.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default EventStream;
