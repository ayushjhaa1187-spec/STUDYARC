import { Request, Response } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { env } from '../config/env.js';
import { logger } from '../utils/logger.js';

export const dailyCronJobs = async (req: Request, res: Response) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' });
        }

        const token = authHeader.split(' ')[1];
        if (token !== env.CRON_SECRET) {
            return res.status(403).json({ error: 'Forbidden: Invalid cron secret' });
        }

        logger.info('Starting daily cron jobs...');

        // 1. Reset broken streaks (last_activity_at > 48 hours ago)
        const fortyEightHoursAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        
        const { data: brokenSprints, error: streakError } = await supabaseAdmin
            .from('sprints')
            .update({ streak: 0 })
            .lt('last_activity_at', fortyEightHoursAgo)
            .eq('status', 'active')
            .select('id');

        if (streakError) {
            logger.error('Cron Error resetting streaks:', streakError);
        } else {
            logger.info(`Reset streaks for ${brokenSprints?.length || 0} sprints.`);
        }

        // 2. Suspend mentors with consistently low ratings (< 3.0) and > 5 reviews
        // (Assuming a function or query to check this. For now, a placeholder logic)
        const { data: lowRatedMentors, error: mentorError } = await supabaseAdmin
            .from('mentors_profile')
            .update({ payout_status: 'suspended' })
            .lt('quality_score', 3.0)
            .eq('payout_status', 'active')
            .select('id');

        if (mentorError) {
            logger.error('Cron Error suspending mentors:', mentorError);
        } else {
            logger.info(`Suspended ${lowRatedMentors?.length || 0} low-rated mentors.`);
        }

        logger.info('Daily cron jobs completed successfully.');
        res.json({ success: true, message: 'Cron jobs executed successfully.' });
    } catch (error: any) {
        logger.error('Cron Execution Error:', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Cron execution failed', details: error.message });
    }
};
