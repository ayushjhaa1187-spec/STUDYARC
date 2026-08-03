import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { hmac } from "https://deno.land/x/hmac@v2.0.1/mod.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const razorpaySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const supabase = createClient(supabaseUrl, supabaseKey);

serve(async (req) => {
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
    
    // Process payment.captured event
    if (event.event === "payment.captured") {
      const paymentData = event.payload.payment.entity;
      const orderId = paymentData.order_id;
      const paymentId = paymentData.id;

      const { data: payment, error } = await supabase
        .from('payments')
        .update({
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          status: 'captured'
        })
        .eq('razorpay_order_id', orderId)
        .select()
        .single();

      if (!error && payment?.booking_id) {
        await supabase
          .from('expert_bookings')
          .update({ payment_status: 'paid', status: 'scheduled' })
          .eq('id', payment.booking_id);
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
});
