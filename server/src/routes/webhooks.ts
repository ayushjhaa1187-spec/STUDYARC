import { Router } from 'express';
import { handleWebhook } from '../controllers/paymentController.js';
import { paymentLimiter } from '../middlewares/rateLimit.js';

const router = Router();

// Mounted at /api/webhooks
router.post('/razorpay', paymentLimiter, handleWebhook);

export default router;
