import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../../.env') }); // Point to root or server/.env based on your setup
export const env = {
    PORT: process.env.PORT || 3001,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID || 'rzp_test_dummy_key_123',
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET || 'dummy_secret_abc123',
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET || 'dummy_webhook_secret_123',
    SUPABASE_URL: process.env.VITE_SUPABASE_URL || 'https://dummy-project.supabase.co',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || 'dummy-service-role-key',
    SUPABASE_JWT_SECRET: process.env.SUPABASE_JWT_SECRET || 'super-secret-jwt-token-with-at-least-32-characters-long'
};
