import { DiagnosticService } from '../services/diagnosticService.js';
export const evaluateDiagnostic = async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetRole, weeklyHours, skills, experienceLevel } = req.body;
        const assessment = await DiagnosticService.processDiagnostic(userId, targetRole, weeklyHours, skills, experienceLevel);
        res.json({ success: true, assessment });
    }
    catch (error) {
        console.error('Diagnostic Evaluation Error:', error);
        res.status(500).json({ error: 'Failed to process diagnostic', details: error.message });
    }
};
