import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";
import { z } from "https://deno.land/x/zod@v3.22.4/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const razorpayKeyId = Deno.env.get("RAZORPAY_KEY_ID")!;
const razorpayKeySecret = Deno.env.get("RAZORPAY_KEY_SECRET")!;

const supabase = createClient(supabaseUrl, supabaseKey);

// Define input schema using Zod
const CreateBookingSchema = z.object({
  learnerId: z.string().uuid(),
  mentorId: z.string().uuid(),
  serviceId: z.string().uuid(),
  availabilityId: z.string().uuid(),
  durationMinutes: z.number().int().positive(),
  amountInr: z.number().int().positive(), // Amount in INR (not paise, we will convert)
});

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const rawBody = await req.json();
    
    // 1. Validate Input
    const parsed = CreateBookingSchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Validation Error", details: parsed.error.issues }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { learnerId, mentorId, serviceId, availabilityId, durationMinutes, amountInr } = parsed.data;

    // 2. Safely Lock Slot & Create Pending Booking via DB RPC
    const { data: bookingId, error: rpcError } = await supabase
      .rpc('create_mentor_booking_tx', {
        p_learner_id: learnerId,
        p_mentor_id: mentorId,
        p_service_id: serviceId,
        p_availability_id: availabilityId,
        p_duration_minutes: durationMinutes
      });

    if (rpcError || !bookingId) {
      console.error("RPC Error:", rpcError);
      return new Response(JSON.stringify({ error: "Failed to reserve slot. It may have been booked." }), {
        status: 409, // Conflict
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Create Razorpay Order
    // Amount must be in paise (smallest currency unit)
    const amountInPaise = amountInr * 100;

    const razorpayResponse = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Basic ${btoa(`${razorpayKeyId}:${razorpayKeySecret}`)}`
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt: bookingId, // Use bookingId as receipt
        notes: {
          learner_id: learnerId,
          mentor_id: mentorId
        }
      })
    });

    const razorpayOrder = await razorpayResponse.json();

    if (!razorpayResponse.ok) {
      console.error("Razorpay Error:", razorpayOrder);
      // Fallback: The background cron will clean up this pending booking.
      return new Response(JSON.stringify({ error: "Failed to create payment order." }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 4. Insert into Payments Table
    const { error: paymentInsertError } = await supabase
      .from('payments')
      .insert({
        user_id: learnerId,
        provider: 'razorpay',
        provider_order_id: razorpayOrder.id,
        type: 'mentor_booking',
        amount_inr: amountInr,
        currency: 'INR',
        status: 'created'
      });

    if (paymentInsertError) {
        console.error("Payment Insert Error:", paymentInsertError);
    }

    // Also update the booking record with the provider_order_id as payment_id
    await supabase
        .from('mentor_bookings')
        .update({ payment_id: razorpayOrder.id })
        .eq('id', bookingId);

    // 5. Return success
    return new Response(JSON.stringify({
      bookingId,
      orderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency
    }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Internal Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
