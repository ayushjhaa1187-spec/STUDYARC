import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

const diagnosticSchema = z.object({
  targetRole: z.string(),
  hours: z.number().min(1).max(168),
  selectedSkills: z.array(z.string())
});

const statusSchema = z.object({
  status: z.enum(['pending', 'in-progress', 'completed'])
});

const blockedSchema = z.object({
  reason: z.string().min(1)
});

// Diagnostics
router.post('/', requireAuth, validateBody(diagnosticSchema), auditLog('create_diagnostic'), (req, res) => {
  // Handled via external Supabase Edge function normally, or call Gemini API here
  res.json({ message: 'Diagnostic generated successfully' });
});

router.get('/latest', requireAuth, (req, res) => {
  // Fetch latest assessment for user
  res.json({ assessment: null });
});

// Journeys (Sprints)
router.get('/journeys', (req, res) => {
  // Public catalog of journeys
  res.json({ journeys: [] });
});

router.get('/journeys/:slug', (req, res) => {
  // Fetch specific journey details
  res.json({ journey: { slug: req.params.slug } });
});

router.post('/user-journeys/start', requireAuth, validateBody(z.object({ journeyId: z.string() })), auditLog('start_journey'), (req, res) => {
  res.json({ message: 'Journey started' });
});

router.get('/user-journeys/current', requireAuth, (req, res) => {
  // Fetch active sprint
  res.json({ sprint: null });
});

// Tasks
router.patch('/tasks/:id/status', requireAuth, validateBody(statusSchema), (req, res) => {
  res.json({ message: `Task ${req.params.id} updated` });
});

router.post('/tasks/:id/mark-blocked', requireAuth, validateBody(blockedSchema), (req, res) => {
  res.json({ message: `Task ${req.params.id} marked as blocked` });
});

router.get('/tasks/today', requireAuth, (req, res) => {
  res.json({ tasks: [] });
});

export default router;
