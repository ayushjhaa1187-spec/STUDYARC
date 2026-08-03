import { Router } from 'express';
import { evaluateDiagnostic } from '../controllers/diagnosticController.js';
import { getActiveSprints, completeTask, markDayComplete } from '../controllers/sprintController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { diagnosticLimiter } from '../middlewares/rateLimit.js';
import * as schemas from '../schemas/index.js';

const router = Router();

// Mounted at /api
router.post('/diagnostic/evaluate', requireAuth, diagnosticLimiter, validateRequest(schemas.DiagnosticEvaluationSchema), evaluateDiagnostic);
router.get('/sprints/active', requireAuth, getActiveSprints);
router.post('/sprints/:sprintId/tasks/:taskId/complete', requireAuth, validateRequest(schemas.TaskCompletionSchema), completeTask);
router.post('/sprints/daily-progress', requireAuth, markDayComplete);

export default router;
