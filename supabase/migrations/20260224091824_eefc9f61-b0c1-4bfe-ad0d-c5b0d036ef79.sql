
-- Create entities table
CREATE TABLE public.entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'other' CHECK (type IN ('road', 'stock', 'policy', 'infrastructure', 'other')),
  current_state TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.entities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own entities" ON public.entities FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own entities" ON public.entities FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own entities" ON public.entities FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own entities" ON public.entities FOR DELETE USING (auth.uid() = user_id);

-- Create drift_events table
CREATE TABLE public.drift_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  event_type TEXT NOT NULL DEFAULT 'status_change' CHECK (event_type IN ('accident', 'status_change', 'policy_update', 'news_alert')),
  description TEXT NOT NULL DEFAULT '',
  new_state TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.drift_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own events" ON public.drift_events FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own events" ON public.drift_events FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create drift_analyses table
CREATE TABLE public.drift_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  previous_state TEXT NOT NULL DEFAULT '',
  current_state TEXT NOT NULL DEFAULT '',
  drift_detected BOOLEAN NOT NULL DEFAULT false,
  change_summary TEXT NOT NULL DEFAULT '',
  severity TEXT NOT NULL DEFAULT 'LOW' CHECK (severity IN ('LOW', 'MEDIUM', 'HIGH')),
  confidence INTEGER NOT NULL DEFAULT 0,
  explanation TEXT NOT NULL DEFAULT '',
  recommended_action TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.drift_analyses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own analyses" ON public.drift_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own analyses" ON public.drift_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create ai_logs table
CREATE TABLE public.ai_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  entity_id UUID NOT NULL REFERENCES public.entities(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  request_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  response_data JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ai_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own logs" ON public.ai_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own logs" ON public.ai_logs FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_entities_updated_at
  BEFORE UPDATE ON public.entities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.entities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drift_events;
ALTER PUBLICATION supabase_realtime ADD TABLE public.drift_analyses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_logs;
