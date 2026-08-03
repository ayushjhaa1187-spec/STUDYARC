import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

// Configure maximum retries for a job before dead lettering
const MAX_RETRIES = 5;

// Note: To schedule this via pg_cron, you would run the following in SQL:
/*
  select cron.schedule(
    'process-outbox-every-minute',
    '* * * * *',
    $$
    select net.http_post(
        url:='https://<project-ref>.supabase.co/functions/v1/outbox-worker',
        headers:='{"Authorization": "Bearer <SERVICE_ROLE_KEY>"}'::jsonb,
        body:='{}'::jsonb
    )
    $$
  );
*/

serve(async (req) => {
  // Security check: Only allow service role (internal trigger)
  const authHeader = req.headers.get("Authorization");
  if (!authHeader || authHeader !== `Bearer ${Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")}`) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  const supabaseAdmin = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  let processedCount = 0;

  try {
    // 1. Fetch pending jobs that are ready to run, using FOR UPDATE SKIP LOCKED
    // Since Supabase JS doesn't natively support FOR UPDATE SKIP LOCKED, we must use an RPC function
    // For this implementation, we assume we created a Postgres function 'claim_outbox_jobs' 
    // OR we can do an atomic UPDATE with subquery.
    // Atomic UPDATE approach:
    const { data: jobsToProcess, error: fetchError } = await supabaseAdmin
      .rpc('claim_outbox_jobs', { batch_size: 10 });

    if (fetchError) {
      // If RPC is not created, fallback to a simpler optimistic concurrency approach (less robust for horizontal scaling but works for 1 worker)
      console.warn("RPC claim_outbox_jobs failed/missing. Using optimistic approach. Error:", fetchError.message);
      
      const { data: pendingJobs } = await supabaseAdmin
        .from('outbox_events')
        .select('*')
        .eq('status', 'pending')
        .lte('scheduled_at', new Date().toISOString())
        .order('scheduled_at', { ascending: true })
        .limit(10);
      
      if (!pendingJobs || pendingJobs.length === 0) {
        return new Response(JSON.stringify({ message: "No jobs to process", processedCount: 0 }), { status: 200 });
      }

      // Mark as processing
      const jobIds = pendingJobs.map(j => j.id);
      await supabaseAdmin.from('outbox_events').update({ status: 'processing', locked_at: new Date().toISOString() }).in('id', jobIds);
      
      for (const job of pendingJobs) {
        await processJob(job, supabaseAdmin);
        processedCount++;
      }
    } else if (jobsToProcess && jobsToProcess.length > 0) {
      for (const job of jobsToProcess) {
         await processJob(job, supabaseAdmin);
         processedCount++;
      }
    }

    return new Response(JSON.stringify({ message: "Success", processedCount }), {
      headers: { "Content-Type": "application/json" },
    });

  } catch (error: any) {
    console.error("Worker error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});

async function processJob(job: any, supabaseAdmin: any) {
  let success = false;
  let errorMessage = null;

  try {
    // ---- JOB ROUTER ----
    switch (job.event_type) {
      case 'sprint.generate':
        // Await generateSprintLogic(job.payload);
        console.log(`Generating sprint for user: ${job.aggregate_id}`);
        break;
      
      case 'portfolio.verify':
        // Await verifyPortfolioLogic(job.payload);
        console.log(`Verifying portfolio for project: ${job.aggregate_id}`);
        break;

      default:
        throw new Error(`Unknown event_type: ${job.event_type}`);
    }
    
    success = true;
  } catch (err: any) {
    console.error(`Job ${job.id} failed:`, err);
    errorMessage = err.message;
  }

  // Handle result
  if (success) {
    await supabaseAdmin.from('outbox_events').update({
      status: 'completed',
      completed_at: new Date().toISOString()
    }).eq('id', job.id);
  } else {
    const newAttempts = job.attempts + 1;
    if (newAttempts >= MAX_RETRIES) {
      await supabaseAdmin.from('outbox_events').update({
        status: 'dead_letter',
        attempts: newAttempts,
        error_message: errorMessage
      }).eq('id', job.id);
    } else {
      // Exponential backoff: Base 2 minutes ^ attempts (e.g., 2m, 4m, 8m...)
      const backoffMinutes = Math.pow(2, newAttempts);
      const nextScheduled = new Date(Date.now() + backoffMinutes * 60000);
      
      await supabaseAdmin.from('outbox_events').update({
        status: 'pending',
        attempts: newAttempts,
        error_message: errorMessage,
        scheduled_at: nextScheduled.toISOString(),
        locked_at: null
      }).eq('id', job.id);
    }
  }
}
