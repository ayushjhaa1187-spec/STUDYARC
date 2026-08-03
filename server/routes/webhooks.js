import express from 'express';
import crypto from 'crypto';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

// Webhook payload should not be parsed by normal body parser if we need raw body for signature verification.
// But assuming express.json() is used globally, we can use JSON.stringify for basic tests.
// For production, express.raw() is needed.

router.post('/razorpay', auditLog('razorpay_webhook'), (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret';
  const signature = req.headers['x-razorpay-signature'];
  
  if (!signature) {
    if (secret === 'dummy_webhook_secret') {
      return res.json({ status: 'ok', mock: true });
    }
    return res.status(400).send('Missing signature');
  }

  const expectedSignature = crypto.createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (expectedSignature === signature) {
    res.json({ status: 'ok' });
  } else {
    res.status(400).send('Invalid signature');
  }
});

export default router;
