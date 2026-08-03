import { Router } from 'express';
import { submitPortfolio } from '../controllers/portfolioController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import * as schemas from '../schemas/index.js';
const router = Router();
// Mounted at /api/portfolio and /api/projects
router.post('/submit', requireAuth, validateRequest(schemas.PortfolioSubmissionSchema), submitPortfolio);
export default router;
