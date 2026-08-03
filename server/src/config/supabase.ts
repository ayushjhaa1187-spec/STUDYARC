import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';

// We create a service role client for backend operations that need to bypass RLS (like webhooks)
export const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});
