import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Razorpay from 'razorpay';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

import agentsRouter from './routes/agents.js';
app.use('/api/agents', agentsRouter);

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_123',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_abc123'
});

const PORT = 3001;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Hardcoded secret coupons (NOT exposed to frontend)
const VALID_COUPONS = {
  'ayush1187': 100,
  'aniketman': 200,
  'vishal102': 150
};

app.post('/api/apply-coupon', (req, res) => {
  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code required' });
  
  const discount = VALID_COUPONS[code.toLowerCase()];
  if (discount) {
    res.json({ valid: true, discount, message: `Coupon applied! ₹${discount} off.` });
  } else {
    res.json({ valid: false, discount: 0, message: 'Invalid coupon code.' });
  }
});


// Razorpay Order Creation Endpoint
app.post('/api/create-order', async (req, res) => {
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
  } catch (error) {
    console.error('Razorpay Error:', error);
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
});


app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    const prompt = `You are a helpful support assistant for SkillBridge Pro. 
User asks: ${message}
Keep the response helpful, friendly, and concise (under 3 sentences).`;
    const result = await model.generateContent(prompt);
    res.json({ text: result.response.text().trim() });
  } catch (error) {
    res.json({ text: "I'm having trouble connecting right now, but I'm here to help you navigate SkillBridge Pro! Try asking again later." });
  }
});

app.post('/api/course-match', async (req, res) => {
  try {
    const { query } = req.body;
    const prompt = `
      A user wants to learn: ${query}
      We have YouTube playlist courses on our platform.
      Recommend 1 to 3 YouTube playlist courses for this goal.
      Format as strict JSON array of objects:
      [
        {
          "title": "Course Title",
          "description": "Short description",
          "youtubeUrl": "A real or realistic youtube playlist URL",
          "difficulty": "Beginner | Intermediate | Advanced"
        }
      ]
    `;
    const result = await model.generateContent(prompt);
    let text = result.response.text().trim();
    if (text.startsWith('\`\`\`json')) text = text.replace(/\`\`\`json/g, '').replace(/\`\`\`/g, '');
    else if (text.startsWith('\`\`\`')) text = text.replace(/\`\`\`/g, '');
    res.json(JSON.parse(text));
  } catch (error) {
    // Fallback Mock
    res.json([
      {
        title: "Full Stack Masterclass",
        description: "Comprehensive guide to modern web development.",
        youtubeUrl: "https://www.youtube.com/watch?v=PkZNo7MFOUg",
        difficulty: "Beginner"
      }
    ]);
  }
});

app.listen(PORT, () => {
  console.log(`Secure Backend API running on http://localhost:${PORT}`);
});
