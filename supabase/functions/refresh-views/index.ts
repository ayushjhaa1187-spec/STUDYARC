import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
// Secret used to authenticate the cron job request
const cronSecret = Deno.env.get("CRON_SECRET")!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Validate authorization header
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${cronSecret}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Execute the DB RPC to concurrently refresh materialized views
    const { error } = await supabase.rpc('refresh_materialized_views');
    
    if (error) {
      console.error("Error refreshing materialized views:", error);
      return new Response(JSON.stringify({ error: error.message }), { 
          status: 500,
          headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify({ success: true, message: "Materialized views refreshed" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { 
        status: 500,
        headers: { "Content-Type": "application/json" }
    });
  }
});
