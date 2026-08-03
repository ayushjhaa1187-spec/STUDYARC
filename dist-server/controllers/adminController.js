import { supabaseAdmin } from '../config/supabase.js';
export const getMetrics = async (req, res) => {
    try {
        const { count: userCount } = await supabaseAdmin.from('users').select('*', { count: 'exact', head: true });
        const { count: mentorCount } = await supabaseAdmin.from('mentors_profile').select('*', { count: 'exact', head: true });
        const { data: payments } = await supabaseAdmin.from('payments').select('amount').eq('status', 'captured');
        const totalRevenue = payments ? payments.reduce((acc, curr) => acc + Number(curr.amount), 0) : 0;
        res.json({
            users: userCount,
            mentors: mentorCount,
            revenue: totalRevenue
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch metrics', details: error.message });
    }
};
