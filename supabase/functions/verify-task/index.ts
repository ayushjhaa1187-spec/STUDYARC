import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { submission_id } = await req.json();

    if (!submission_id) {
      return new Response(JSON.stringify({ error: "submission_id is required" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      });
    }

    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Fetch the project details
    const { data: project, error: fetchError } = await supabaseAdmin
      .from("portfolio_projects")
      .select("*, project_evidence(*)")
      .eq("id", submission_id)
      .single();

    if (fetchError || !project) {
      throw fetchError || new Error("Project not found");
    }

    // Call Gemini API
    const geminiApiKey = Deno.env.get("GEMINI_API_KEY");
    if (!geminiApiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }

    const prompt = `You are an expert technical evaluator. A student has submitted a portfolio project for verification.
Review the following project details and evidence (like GitHub URLs or demo links).
Project Details: ${JSON.stringify(project)}

Evaluate if the submission meets the basic criteria for an entry-level developer project.
Provide a structured JSON output with the following schema:
{
  "is_approved": boolean,
  "score": integer (0-100),
  "feedback": "Detailed constructive feedback",
  "needs_human_review": boolean (true if you are unsure or it's a very complex project)
}
Return ONLY valid JSON, no markdown blocks.`;

    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${geminiApiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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
      throw new Error("Failed to evaluate submission");
    }

    const geminiData = await geminiResponse.json();
    let evaluation = null;

    try {
      const responseText = geminiData.candidates[0].content.parts[0].text;
      evaluation = JSON.parse(responseText);
    } catch (e) {
      console.error("Failed to parse Gemini output:", e, geminiData);
      throw new Error("AI returned invalid JSON");
    }

    // Update status based on evaluation
    let newStatus = evaluation.is_approved ? "ai_checked" : "rejected";
    if (evaluation.needs_human_review) {
      newStatus = "human_review";
    }

    // Update project with AI evaluation
    const { error: updateError } = await supabaseAdmin
      .from("portfolio_projects")
      .update({
        status: newStatus,
        ai_score: evaluation.score,
      })
      .eq("id", submission_id);

    if (updateError) throw updateError;

    // Log the verification event
    await supabaseAdmin
      .from("portfolio_verification_events")
      .insert({
        project_id: submission_id,
        actor_type: "ai_agent",
        event_type: evaluation.is_approved ? "ai_check_passed" : "ai_check_failed",
        notes: evaluation.feedback,
        metadata: { score: evaluation.score, needs_human: evaluation.needs_human_review }
      });

    return new Response(
      JSON.stringify({ success: true, evaluation }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
