import express from 'express';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import { z } from 'zod';
import { supabaseAdmin } from '../supabaseClient.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const router = express.Router();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_abc123'
});

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';

// Hardcoded secret coupons for demo purposes
const VALID_COUPONS = {
  'ayush1187': 100,
  'aniketman': 200,
  'vishal102': 150
};

// Zod Schema for Order Creation
const CreateOrderSchema = z.object({
  amount: z.number().positive(),
  couponCode: z.string().optional(),
  expert_id: z.string().uuid().optional(), // Needed for mentor bookings
  user_id: z.string().uuid().optional(), // Usually comes from auth middleware, but we'll accept it here
  slot_time: z.string().optional(),
});

// Endpoint to create a Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const validated = CreateOrderSchema.parse(req.body);
    const { amount, couponCode, expert_id, user_id, slot_time } = validated;

    let finalAmount = amount;
    if (couponCode && VALID_COUPONS[couponCode.toLowerCase()]) {
      finalAmount = Math.max(0, amount - VALID_COUPONS[couponCode.toLowerCase()]);
    }

    const options = {
      amount: finalAmount * 100, // paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };

    let order;
    try {
      order = await razorpay.orders.create(options);
    } catch (err) {
      console.error('Razorpay Error:', err);
      // Fallback for testing when keys are missing
      order = {
        id: `order_fallback_${Date.now()}`,
        amount: finalAmount * 100,
        currency: "INR"
      };
    }

    // If this is a mentor booking, store it in the database
    if (expert_id && user_id && slot_time) {
      const { data, error } = await supabaseAdmin
        .from('expert_bookings')
        .insert({
          user_id: user_id,
          expert_id: expert_id,
          slot_time: slot_time,
          amount_paid: finalAmount,
          payment_order_id: order.id,
          payment_status: 'pending',
          status: 'pending_payment'
        })
        .select()
        .single();

      if (error) {
        console.error('Error saving booking:', error);
        return res.status(500).json({ error: 'Failed to save booking record' });
      }
    }

    res.json(order);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.errors });
    }
    console.error('Create Order Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Endpoint to handle Razorpay Webhooks
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    // Determine body structure depending on how express parses it
    let bodyText = req.body;
    if (Buffer.isBuffer(req.body)) {
      bodyText = req.body.toString('utf8');
    } else if (typeof req.body === 'object') {
      bodyText = JSON.stringify(req.body); // Fallback if express.json is also applied
    }

    const signature = req.headers['x-razorpay-signature'];
    if (!signature) {
      return res.status(400).json({ error: 'Missing signature' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(bodyText)
      .digest('hex');

    if (signature !== expectedSignature) {
      console.warn('Invalid signature detected');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = typeof req.body === 'object' && !Buffer.isBuffer(req.body) 
        ? req.body 
        : JSON.parse(bodyText);

    const eventId = event.event_id || event.id; // Usually x-razorpay-event-id or in payload

    if (event.event === 'order.paid' || event.event === 'payment.captured') {
      const paymentEntity = event.payload.payment.entity;
      const orderId = paymentEntity.order_id;
      const razorpayPaymentId = paymentEntity.id;

      // Check if we've already processed this webhook
      const { data: existingBooking } = await supabaseAdmin
        .from('expert_bookings')
        .select('id, amount_paid, expert_id')
        .eq('payment_order_id', orderId)
        .single();

      if (existingBooking) {
        // Prevent replay attacks
        const { data: replayCheck } = await supabaseAdmin
          .from('expert_bookings')
          .select('webhook_event_id')
          .eq('id', existingBooking.id)
          .single();

        if (replayCheck && replayCheck.webhook_event_id) {
            return res.json({ status: 'ok', message: 'Webhook already processed' });
        }

        // Update booking status
        await supabaseAdmin
          .from('expert_bookings')
          .update({
            payment_status: 'paid',
            status: 'confirmed',
            razorpay_payment_id: razorpayPaymentId,
            webhook_event_id: eventId
          })
          .eq('id', existingBooking.id);

        // Platform fee logic (25% platform fee)
        const totalAmount = existingBooking.amount_paid;
        const platformFee = totalAmount * 0.25;
        const mentorPayoutAmount = totalAmount - platformFee;

        // Create payout record
        await supabaseAdmin
          .from('mentor_payouts')
          .insert({
            booking_id: existingBooking.id,
            mentor_id: existingBooking.expert_id,
            amount: mentorPayoutAmount,
            platform_fee: platformFee,
            status: 'eligible'
          });

        // Audit Log
        await supabaseAdmin
          .from('audit_logs')
          .insert({
            action_type: 'payment_webhook_processed',
            entity_id: existingBooking.id,
            metadata: { event: event.event, order_id: orderId }
          });
      }
    }

    res.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;
