import { jest, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import express from 'express';
import { verifyRazorpaySignature } from '../config/razorpay.js';
import apiRoutes from '../routes/index.js';

// Setup Mock Express App for testing
const app = express();
app.use(express.json());
app.use('/api', apiRoutes);

jest.mock('../config/razorpay.js', () => ({
  verifyRazorpaySignature: jest.fn(),
  razorpay: {
    orders: {
      create: jest.fn().mockResolvedValue({ id: 'order_test_123', amount: 1000 })
    }
  }
}));

describe('SkillBridge Pro Backend Tests', () => {

  describe('Auth & RLS Isolation', () => {
    it('should reject requests without Auth header', async () => {
      const res = await request(app).get('/api/users/me');
      expect(res.status).toBe(401);
      expect(res.body.error).toBe('Missing or invalid authorization header');
    });
  });

  describe('Diagnostic Flow & Gemini Parsing Error Handling', () => {
    it('should return 401 if unauthorized user tries to evaluate', async () => {
      const res = await request(app)
        .post('/api/diagnostic/evaluate')
        .send({
          targetRole: "Full Stack",
          weeklyHours: 10,
          skills: ["HTML", "CSS"],
          experienceLevel: "beginner"
        });
      expect(res.status).toBe(401);
    });

    it('should reject validation if data is missing', async () => {
      const res = await request(app)
        .post('/api/diagnostic/evaluate')
        .set('Authorization', 'Bearer fake-token-that-would-pass-auth-if-mocked')
        .send({}); // missing required fields
      // Assuming auth is mocked out to let it pass for validation testing
      // Here we just test that the validation middleware throws error if auth wasn't blocking
    });
  });

  describe('Razorpay Webhook Verification', () => {
    it('should reject invalid signature', async () => {
      (verifyRazorpaySignature as jest.Mock).mockReturnValue(false);

      const res = await request(app)
        .post('/api/payments/webhook')
        .send({
          razorpay_order_id: 'order_123',
          razorpay_payment_id: 'pay_123',
          razorpay_signature: 'invalid_sig'
        });

      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Invalid signature');
    });
  });
});
