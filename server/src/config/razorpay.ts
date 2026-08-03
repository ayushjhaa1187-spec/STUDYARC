import Razorpay from 'razorpay';
import { env } from './env.js';
import crypto from 'crypto';

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export const verifyRazorpaySignature = (orderId: string, paymentId: string, signature: string): boolean => {
  const text = `${orderId}|${paymentId}`;
  const generatedSignature = crypto
    .createHmac('sha256', env.RAZORPAY_KEY_SECRET)
    .update(text)
    .digest('hex');

  return generatedSignature === signature;
};
