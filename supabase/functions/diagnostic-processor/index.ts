import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { GoogleGenerativeAI, SchemaType } from 'npm:@google/generative-ai'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const startTime = Date.now();
  let agentEventId = null;

  try {
    const { assessment_id } = await req.json()

    if (!assessment_id) {
      return new Response(JSON.stringify({ error: 'assessment_id is required' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      })
    }

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch assessment details
    const { data: assessment, error: fetchError } = await supabaseAdmin
      .from('assessments')
      .select('*')
      .eq('id', assessment_id)
      .single()

    if (fetchError || !assessment) throw fetchError

    // 1. Log Agent Event Start
    const { data: agentEvent, error: eventError } = await supabaseAdmin
      .from('agent_events')
      .insert({
        user_id: assessment.user_id,
        agent_type: 'diagnostic',
        event_type: 'generate_sprint',
        input_summary: { assessment_id: assessment.id, target_role: assessment.target_role },
        status: 'started',
        model_name: 'gemini-1.5-pro'
      })
      .select()
      .single();

    if (!eventError && agentEvent) {
      agentEventId = agentEvent.id;
    }

    // 2. Call Gemini API using Official SDK
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `You are an expert career coach for Indian students. A student has taken a career diagnostic.
Based on their assessment, generate a personalized 14-day sprint. 
Assessment details: ${JSON.stringify(assessment)}`;

    const responseSchema = {
      type: SchemaType.OBJECT,
      properties: {
        career_map: {
          type: SchemaType.STRING,
          description: "Brief encouraging analysis of their goals"
        },
        recommended_sprint: {
          type: SchemaType.OBJECT,
          properties: {
            name: { type: SchemaType.STRING, description: "Sprint title" },
            duration_days: { type: SchemaType.INTEGER, description: "Duration in days, e.g. 14" },
            daily_tasks: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  day: { type: SchemaType.INTEGER },
                  title: { type: SchemaType.STRING, description: "Task title" },
                  description: { type: SchemaType.STRING, description: "Actionable task description" }
                },
                required: ["day", "title", "description"]
              }
            }
          },
          required: ["name", "duration_days", "daily_tasks"]
        }
      },
      required: ["career_map", "recommended_sprint"]
    };

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const responseText = result.response.text();
    let aiOutput = null;

    try {
      aiOutput = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", e, responseText);
      throw new Error('AI returned invalid JSON');
    }

    // 3. Update assessment with AI output
    const { error: updateError } = await supabaseAdmin
      .from('assessments')
      .update({
        ai_output: aiOutput,
        status: 'completed'
      })
      .eq('id', assessment_id)

    if (updateError) throw updateError

    // 4. Log Agent Event Completion
    if (agentEventId) {
      await supabaseAdmin
        .from('agent_events')
        .update({
          status: 'completed',
          latency_ms: Date.now() - startTime,
          output_summary: { sprint_name: aiOutput?.recommended_sprint?.name }
        })
        .eq('id', agentEventId);
    }

    return new Response(
      JSON.stringify({ success: true, data: aiOutput }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error(error)
    
    // Log Agent Event Failure
    if (agentEventId) {
      const supabaseAdmin = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      )
      await supabaseAdmin
        .from('agent_events')
        .update({
          status: 'failed',
          latency_ms: Date.now() - startTime,
          output_summary: { error: error.message }
        })
        .eq('id', agentEventId);
    }

    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
