import { Router } from 'express';
import { getMetrics } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { processJobs } from '../controllers/jobController.js';
import { dailyCronJobs } from '../controllers/cronController.js';
const router = Router();
// Mounted at /api/admin
router.get('/metrics', requireAuth, requireRole('admin'), getMetrics);
// Keep the internal/cron jobs in admin router or move them if specified, but the diff didn't show a cron router.
router.post('/cron/daily', dailyCronJobs);
router.post('/internal/jobs/process', processJobs);
export default router;
