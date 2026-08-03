import { Router } from 'express';
import { getMe } from '../controllers/authController.js';
import { requireAuth } from '../middlewares/auth.js';
const router = Router();
// Mounted at /api/me
router.get('/', requireAuth, getMe);
export default router;
