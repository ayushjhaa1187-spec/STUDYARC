import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

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

    // Call Gemini API
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      throw new Error('GEMINI_API_KEY is not set');
    }

    const prompt = `You are an expert career coach for Indian students. A student has taken a career diagnostic.
Based on their assessment, generate a personalized 14-day sprint. 
Assessment details: ${JSON.stringify(assessment)}

Provide a structured JSON output with the following schema:
{
  "career_map": "Brief encouraging analysis of their goals",
  "recommended_sprint": {
    "name": "Sprint title",
    "duration_days": 14,
    "daily_tasks": [
      { "day": 1, "title": "Task title", "description": "Actionable task description" }
    ]
  }
}
Return ONLY valid JSON, no markdown blocks.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          response_mime_type: "application/json"
        }
      })
    });

    if (!geminiResponse.ok) {
      const errText = await geminiResponse.text();
      console.error("Gemini Error:", errText);
      throw new Error('Failed to generate AI sprint');
    }

    const geminiData = await geminiResponse.json();
    let aiOutput = null;

    try {
      const responseText = geminiData.candidates[0].content.parts[0].text;
      aiOutput = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", e, geminiData);
      throw new Error('AI returned invalid JSON');
    }

    // Update assessment with AI output
    const { error: updateError } = await supabaseAdmin
      .from('assessments')
      .update({
        ai_output: aiOutput,
        status: 'completed'
      })
      .eq('id', assessment_id)

    if (updateError) throw updateError

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error) {
    console.error(error)
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
