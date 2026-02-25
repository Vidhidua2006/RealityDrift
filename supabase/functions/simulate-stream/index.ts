import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SCENARIOS = [
  { name: "Highway 101", type: "road", states: ["OPEN - Normal traffic flow", "SLOW - Heavy congestion detected", "CLOSED - Major accident reported", "OPEN - Accident cleared, normal flow resuming"] },
  { name: "Market Index Alpha", type: "stock", states: ["STABLE at 4,520 (+0.2%)", "VOLATILE - Sharp drop to 4,380 (-3.1%)", "RECOVERING at 4,450 (+1.6%)", "STABLE at 4,510 (+1.3%)"] },
  { name: "Emissions Policy 2026", type: "policy", states: ["ACTIVE - Current limits enforced", "UNDER REVIEW - New amendments proposed", "AMENDED - Stricter limits adopted", "ACTIVE - New limits in effect"] },
  { name: "Power Grid Sector 7", type: "infrastructure", states: ["OPERATIONAL - 98% capacity", "WARNING - Load at 95%, brownout risk", "CRITICAL - Rolling blackouts initiated", "RECOVERING - Load balanced to 80%"] },
  { name: "Bridge Connector 42", type: "infrastructure", states: ["OPEN - Structural integrity normal", "RESTRICTED - Inspection in progress", "CLOSED - Structural failure detected", "OPEN - Emergency repairs completed"] },
];

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_ANON_KEY") || Deno.env.get("SUPABASE_PUBLISHABLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) throw new Error("Unauthorized");

    // Pick a random scenario
    const scenario = SCENARIOS[Math.floor(Math.random() * SCENARIOS.length)];

    // Check if entity exists
    const { data: existingEntities } = await supabase
      .from("entities")
      .select("*")
      .eq("user_id", user.id)
      .eq("name", scenario.name)
      .limit(1);

    let entity = existingEntities?.[0];

    if (!entity) {
      // Create entity with first state
      const { data: newEntity, error: createError } = await supabase
        .from("entities")
        .insert({
          user_id: user.id,
          name: scenario.name,
          type: scenario.type,
          current_state: scenario.states[0],
        })
        .select()
        .single();
      if (createError) throw createError;
      entity = newEntity;
    }

    // Pick a new state different from current
    const currentIdx = scenario.states.indexOf(entity.current_state);
    const nextIdx = (currentIdx + 1) % scenario.states.length;
    const newState = scenario.states[nextIdx];
    const previousState = entity.current_state;

    // Determine event type based on scenario
    const eventTypes = ["status_change", "accident", "policy_update", "news_alert"];
    const eventType = scenario.type === "road" && newState.includes("accident")
      ? "accident"
      : scenario.type === "policy"
      ? "policy_update"
      : "status_change";

    // Insert drift event
    await supabase.from("drift_events").insert({
      user_id: user.id,
      entity_id: entity.id,
      entity_name: entity.name,
      event_type: eventType,
      description: `State changed from "${previousState}" to "${newState}"`,
      new_state: newState,
    });

    // Call drift-analyze function
    const analyzeUrl = `${supabaseUrl}/functions/v1/drift-analyze`;
    const analyzeResp = await fetch(analyzeUrl, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        entity_id: entity.id,
        entity_name: entity.name,
        previous_state: previousState,
        current_state: newState,
      }),
    });

    const analysis = await analyzeResp.json();

    return new Response(JSON.stringify({
      event: { entity: entity.name, previousState, newState, eventType },
      analysis,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("simulate-stream error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
