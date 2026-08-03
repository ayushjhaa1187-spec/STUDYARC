import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { verifyWebhookSignature } from '../config/razorpay.js';
import { logger } from '../utils/logger.js';

export const handleWebhook = async (req: Request, res: Response) => {
  try {
    const signature = req.headers['x-razorpay-signature'] as string;
    const rawBody = (req as any).rawBody || JSON.stringify(req.body);

    if (!signature || !verifyWebhookSignature(rawBody, signature)) {
      logger.warn('Invalid webhook signature attempt');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    const event = req.body;
    const webhookEventId = req.headers['x-razorpay-event-id'] as string || event.event_id || Date.now().toString();

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
        await supabaseAdmin
          .from('expert_bookings')
          .update({ 
            payment_status: 'paid', 
            status: 'scheduled',
            razorpay_payment_id,
            webhook_event_id: webhookEventId
          })
          .eq('id', bookingId);
      }
    }

    res.json({ success: true });
  } catch (error: any) {
    logger.error('Webhook Error:', { error: error.message, stack: error.stack });
    res.status(500).json({ error: 'Webhook processing failed', details: error.message });
  }
};
