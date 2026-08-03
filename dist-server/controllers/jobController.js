import { JobWorkerService } from '../services/jobWorkerService.js';
import { logger } from '../utils/logger.js';
export const processJobs = async (req, res) => {
    try {
        const authHeader = req.headers['x-internal-key'];
        const expectedKey = process.env.INTERNAL_JOB_KEY || 'local-dev-secret';
        if (authHeader !== expectedKey) {
            logger.warn('Unauthorized attempt to trigger job worker');
            return res.status(401).json({ error: 'Unauthorized' });
        }
        const limit = req.query.limit ? parseInt(req.query.limit) : 5;
        const result = await JobWorkerService.processBatch(limit);
        res.json({ success: true, ...result });
    }
    catch (error) {
        logger.error('Job controller error:', error);
        res.status(500).json({ error: 'Failed to process jobs', details: error.message });
    }
};
