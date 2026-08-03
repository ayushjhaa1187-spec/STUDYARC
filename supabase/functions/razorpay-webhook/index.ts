import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
  // Allow OPTIONS for preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  try {
    const signature = req.headers.get("x-razorpay-signature");
    if (!signature) {
      return new Response("Missing Signature", { status: 400 });
    }

    const payload = await req.text();
    const generatedSignature = hmac("sha256", razorpaySecret, payload, "utf8", "hex");

    if (generatedSignature !== signature) {
      return new Response("Invalid Signature", { status: 400 });
    }

    const event = JSON.parse(payload);
    
    // Log the webhook for audit
    await supabase.from('admin_audit_logs').insert({
      action: `webhook_${event.event}`,
      entity_type: 'razorpay_webhook',
      entity_id: '00000000-0000-0000-0000-000000000000', // Typically webhook ID if stored
      metadata: { event_id: req.headers.get("x-razorpay-event-id") || 'unknown' }
    });

    // Process payment.captured event safely with RPC
    if (event.event === "payment.captured" || event.event === "order.paid") {
      const paymentData = event.payload.payment.entity;
      const orderId = paymentData.order_id;
      const paymentId = paymentData.id;

      // Invoke the DB transaction to safely handle idempotency and state changes
      const { data: success, error: rpcError } = await supabase.rpc('process_payment_webhook_tx', {
        p_razorpay_order_id: orderId,
        p_razorpay_payment_id: paymentId
      });

      if (rpcError) {
        console.error("Webhook RPC Error:", rpcError);
        // We still return 200 to Razorpay sometimes to stop retries if it's a structural DB issue, 
        // but if it's a lock timeout, a 500 would allow a retry. For now, returning 500 on failure.
        return new Response(JSON.stringify({ error: rpcError.message }), { status: 500 });
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
