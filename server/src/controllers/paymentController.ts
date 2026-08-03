import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { verifyRazorpaySignature } from '../config/razorpay.js';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    const isValid = verifyRazorpaySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Update payment record
    const { data: payment, error: paymentError } = await supabaseAdmin
      .from('payments')
      .update({
        razorpay_payment_id,
        razorpay_signature,
        status: 'captured'
      })
      .eq('razorpay_order_id', razorpay_order_id)
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Update booking status
    if (payment && payment.booking_id) {
      await supabaseAdmin
        .from('expert_bookings')
        .update({ payment_status: 'paid', status: 'scheduled' })
        .eq('id', payment.booking_id);
    }

    // Log the event for XP/Audit
    await supabaseAdmin
      .from('user_activities')
      .insert({
        user_id: payment.user_id,
        event_type: 'payment_captured',
        metadata: { amount: payment.amount, order_id: razorpay_order_id }
      });

    res.json({ success: true });
  } catch (error: any) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Webhook processing failed', details: error.message });
  }
};
