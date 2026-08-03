import { supabaseAdmin } from '../config/supabase.js';
import { razorpay, verifyWebhookSignature } from '../config/razorpay.js';
import { logger } from '../utils/logger.js';
// Hardcoded secret coupons (NOT exposed to frontend)
const VALID_COUPONS = {
    'ayush1187': 100,
    'aniketman': 200,
    'vishal102': 150
};
export const applyCoupon = (req, res) => {
    const { code } = req.body;
    if (!code)
        return res.status(400).json({ error: 'Code required' });
    const discount = VALID_COUPONS[code.toLowerCase()];
    if (discount) {
        res.json({ valid: true, discount, message: `Coupon applied! ₹${discount} off.` });
    }
    else {
        res.json({ valid: false, discount: 0, message: 'Invalid coupon code.' });
    }
};
export const createOrder = async (req, res) => {
    try {
        const { amount, couponCode, items } = req.body;
        // Server-side calculation to prevent tampering
        let finalAmount = amount;
        if (couponCode && VALID_COUPONS[couponCode.toLowerCase()]) {
            finalAmount = Math.max(0, amount - VALID_COUPONS[couponCode.toLowerCase()]);
        }
        // Razorpay amount is in paise (₹1 = 100 paise)
        const options = {
            amount: finalAmount * 100,
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`,
            notes: { items: JSON.stringify(items || []) }
        };
        const order = await razorpay.orders.create(options);
        res.json(order);
    }
    catch (error) {
        logger.error('Razorpay Error:', { error: error.message });
        // Fallback order for testing when keys are missing/invalid
        let finalAmount = req.body.amount;
        if (req.body.couponCode && VALID_COUPONS[req.body.couponCode.toLowerCase()]) {
            finalAmount = Math.max(0, req.body.amount - VALID_COUPONS[req.body.couponCode.toLowerCase()]);
        }
        res.json({
            id: `order_fallback_${Date.now()}`,
            amount: finalAmount * 100,
            currency: "INR"
        });
    }
};
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
