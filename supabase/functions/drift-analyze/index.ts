import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

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

    const { entity_id, entity_name, previous_state, current_state } = await req.json();
    if (!entity_id || !entity_name || !previous_state || !current_state) {
      throw new Error("Missing required fields: entity_id, entity_name, previous_state, current_state");
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are a real-time drift detection engine.
Compare previous and current state carefully.
Detect material changes.
Classify severity.
You must call the analyze_drift function with your analysis.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: `Entity: ${entity_name}\nPrevious State: ${previous_state}\nCurrent State: ${current_state}\n\nAnalyze the drift between these states.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analyze_drift",
              description: "Return structured drift analysis result",
              parameters: {
                type: "object",
                properties: {
                  driftDetected: { type: "boolean", description: "Whether material drift was detected" },
                  changeSummary: { type: "string", description: "Brief summary of what changed" },
                  severity: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"], description: "Severity of the drift" },
                  confidence: { type: "integer", description: "Confidence score 0-100" },
                  explanation: { type: "string", description: "Detailed explanation of the drift" },
                  recommendedAction: { type: "string", description: "Recommended action to take" },
                },
                required: ["driftDetected", "changeSummary", "severity", "confidence", "explanation", "recommendedAction"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analyze_drift" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again shortly." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI service unavailable");
    }

    const aiResult = await response.json();
    const toolCall = aiResult.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("AI did not return structured output");

    const analysis = JSON.parse(toolCall.function.arguments);

    // Store drift analysis
    const { error: insertError } = await supabase.from("drift_analyses").insert({
      user_id: user.id,
      entity_id,
      entity_name,
      previous_state,
      current_state,
      drift_detected: analysis.driftDetected,
      change_summary: analysis.changeSummary,
      severity: analysis.severity,
      confidence: analysis.confidence,
      explanation: analysis.explanation,
      recommended_action: analysis.recommendedAction,
    });
    if (insertError) console.error("Insert drift error:", insertError);

    // Store AI log
    await supabase.from("ai_logs").insert({
      user_id: user.id,
      entity_id,
      entity_name,
      request_data: { previous_state, current_state },
      response_data: analysis,
    });

    // Update entity state
    await supabase.from("entities").update({ current_state }).eq("id", entity_id);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("drift-analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
