import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('x-razorpay-signature');
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET || '';

    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
    
    // Using a simple equality check for MVP (use timingSafeEqual in production)
    if (expectedSignature !== signature && process.env.NODE_ENV === 'production') {
       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    const event = JSON.parse(body);
    const supabase = await createClient(); // Use a service role client in a real app

    if (event.event === 'payment.captured') {
       // Update expert session or activate subscription based on notes payload
       const payment = event.payload.payment.entity;
       // ... implement fulfillment logic here based on payment.notes ...
    } else if (event.event === 'subscription.charged') {
       // Extend subscription
    } else if (event.event === 'subscription.cancelled') {
       // Cancel subscription
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error('Razorpay Webhook Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
