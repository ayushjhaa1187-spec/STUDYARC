import { supabaseAdmin } from '../config/supabase.js';
import { verifyWebhookSignature } from '../config/razorpay.js';
import { logger } from '../utils/logger.js';
export const handleWebhook = async (req, res) => {
    try {
        const signature = req.headers['x-razorpay-signature'];
        const rawBody = req.rawBody || JSON.stringify(req.body);
        if (!signature || !verifyWebhookSignature(rawBody, signature)) {
            logger.warn('Invalid webhook signature attempt');
            return res.status(400).json({ error: 'Invalid signature' });
        }
        const event = req.body;
        const webhookEventId = req.headers['x-razorpay-event-id'] || event.event_id || Date.now().toString();
        // Idempotency check: check if webhook_event_id is already processed
        const { data: existingEvent } = await supabaseAdmin
            .from('expert_bookings')
            .select('id')
            .eq('webhook_event_id', webhookEventId)
            .single();
        if (existingEvent) {
            return res.json({ success: true, message: 'Already processed' });
        }
        if (event.event === 'payment.captured') {
            const paymentEntity = event.payload.payment.entity;
            const razorpay_order_id = paymentEntity.order_id;
            const razorpay_payment_id = paymentEntity.id;
            // Notes usually contains our metadata
            const bookingId = paymentEntity.notes?.booking_id;
            if (bookingId) {
                // Enforce strong idempotency at the database level by ensuring we only update if not already paid
                const { data: updatedBooking, error: updateError } = await supabaseAdmin
                    .from('expert_bookings')
                    .update({
                    payment_status: 'paid',
                    status: 'scheduled',
                    razorpay_payment_id,
                    webhook_event_id: webhookEventId
                })
                    .eq('id', bookingId)
                    .neq('payment_status', 'paid')
                    .select()
                    .single();
                // If updatedBooking is null, it means it was already processed or not found
                if (updatedBooking && !updateError) {
                    // Outbox Pattern: Insert job for post-payment side effects (emails, payouts)
                    await supabaseAdmin
                        .from('job_queue')
                        .insert({
                        type: 'payment_success',
                        payload: {
                            bookingId,
                            razorpay_order_id,
                            razorpay_payment_id,
                            amount: paymentEntity.amount
                        }
                    });
                }
                else if (updateError && updateError.code !== 'PGRST116') {
                    // PGRST116 is 0 rows returned, meaning it was already updated
                    throw updateError;
                }
            }
        }
        res.json({ success: true });
    }
    catch (error) {
        logger.error('Webhook Error:', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Webhook processing failed', details: error.message });
    }
};
