import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

export function useRealtimeTable<T extends { id: string }>(
  tableName: string,
  orderBy: string = 'created_at',
  ascending: boolean = false
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchData = useCallback(async () => {
    if (!user) { setData([]); setLoading(false); return; }
    const { data: rows, error } = await supabase
      .from(tableName as any)
      .select('*')
      .order(orderBy, { ascending })
      .limit(100);
    if (!error && rows) setData(rows as unknown as T[]);
    setLoading(false);
  }, [tableName, orderBy, ascending, user]);

  useEffect(() => {
    fetchData();

    const channel = supabase
      .channel(`${tableName}-realtime`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        fetchData();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [fetchData, tableName]);

  return { data, loading, refetch: fetchData };
}
