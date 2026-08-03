import { Router } from 'express';
import { chatWithCoach } from '../controllers/coachController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { aiChatLimiter } from '../middlewares/rateLimit.js';
import * as schemas from '../schemas/index.js';

const router = Router();

// Mounted at /api/agents
router.post('/coach/chat', requireAuth, aiChatLimiter, validateRequest(schemas.ChatMessageSchema), chatWithCoach);

export default router;
