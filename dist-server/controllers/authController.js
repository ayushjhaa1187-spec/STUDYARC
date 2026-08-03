import { supabaseAdmin } from '../config/supabase.js';
export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: profile, error } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error)
            throw error;
        res.json(profile);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch profile', details: error.message });
    }
};
