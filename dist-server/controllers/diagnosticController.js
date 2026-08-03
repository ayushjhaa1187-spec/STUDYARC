import { DiagnosticService } from '../services/diagnosticService.js';
import { logger } from '../utils/logger.js';
export const evaluateDiagnostic = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetRole, weeklyHours, skills, experienceLevel } = req.body;
        const diagnostic = await DiagnosticService.processDiagnostic(userId, targetRole, weeklyHours, skills, experienceLevel);
        res.json({ success: true, diagnostic });
    }
    catch (error) {
        logger.error('Diagnostic Evaluation Error:', { error: error.message, stack: error.stack });
        res.status(500).json({ error: 'Failed to process diagnostic', details: error.message });
    }
};
