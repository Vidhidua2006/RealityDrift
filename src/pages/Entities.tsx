import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { useRealtimeTable } from '@/hooks/use-realtime';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Plus, Trash2, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DbEntity { id: string; name: string; type: string; current_state: string; created_at: string; updated_at: string; user_id: string; }

const TYPES = ['road', 'stock', 'policy', 'infrastructure', 'other'];

const Entities = () => {
  const { user } = useAuth();
  const { data: entities, loading } = useRealtimeTable<DbEntity>('entities', 'created_at', false);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState('road');
  const [state, setState] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSubmitting(true);
    const { error } = await supabase.from('entities').insert({
      user_id: user.id, name, type, current_state: state,
    });
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else { setName(''); setState(''); setShowForm(false); }
    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('entities').delete().eq('id', id);
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Entity Management</h1>
          <p className="text-muted-foreground mt-1">Monitor roads, stocks, policies, and more</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition">
          <Plus size={16} /> Create Entity
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="rounded-lg border border-border bg-card p-6 mb-6 space-y-4">
          <h3 className="font-semibold text-foreground">Create New Entity</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} required placeholder="e.g., Highway 101, AAPL Stock" className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
                {TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Current State</label>
            <textarea value={state} onChange={e => setState(e.target.value)} required placeholder="Describe the current state..." rows={3} className="w-full px-4 py-2.5 rounded-lg bg-input border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y" />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting} className="px-5 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition disabled:opacity-50">{submitting ? 'Creating...' : 'Create'}</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2 rounded-lg bg-secondary text-secondary-foreground text-sm font-medium hover:opacity-80 transition">Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <div className="text-center py-10"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto" /></div>
      ) : entities.length === 0 ? (
        <div className="rounded-lg border border-border bg-card p-10 text-center">
          <FileText className="mx-auto mb-3 text-muted-foreground" size={40} />
          <p className="text-muted-foreground">No entities created yet.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entities.map(e => (
            <div key={e.id} className="rounded-lg border border-border bg-card p-5 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-foreground">{e.name}</h3>
                  <span className="px-2 py-0.5 rounded text-xs font-mono bg-primary/15 text-primary border border-primary/30">{e.type}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{e.current_state}</p>
                <p className="text-xs text-muted-foreground/60 mt-1 font-mono">Created: {new Date(e.created_at).toLocaleString()}</p>
              </div>
              <button onClick={() => handleDelete(e.id)} className="p-2 rounded text-destructive/70 hover:text-destructive hover:bg-destructive/10 transition">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default Entities;
