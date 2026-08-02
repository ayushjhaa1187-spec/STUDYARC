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

    // Call Gemini (Mocking the call for now due to lack of API Key in Deno env directly)
    // In production, we'd use fetch to POST to https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000))

    const aiOutput = {
      career_map: "Based on your goal to get an AI internship, we recommend focusing on Python, ML basics, and building projects.",
      recommended_sprint: {
        name: "AI Internship Prep",
        duration_days: 14,
        daily_tasks: Array.from({ length: 14 }).map((_, i) => ({
          day: i + 1,
          title: `Task for Day ${i + 1}`,
          description: `Learn and implement concepts for Day ${i + 1}.`
        }))
      }
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
