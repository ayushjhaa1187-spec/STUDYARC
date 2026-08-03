import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { data: profile, error } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    res.json(profile);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
  }
};
