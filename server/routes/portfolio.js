import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string(),
  repositoryUrl: z.string().url().optional(),
  liveUrl: z.string().url().optional()
});

const submitSchema = z.object({
  notes: z.string().optional()
});

router.get('/me', requireAuth, (req, res) => {
  res.json({ projects: [] });
});

router.get('/:username', (req, res) => {
  res.json({ projects: [] });
});

router.post('/', requireAuth, validateBody(projectSchema), (req, res) => {
  res.json({ message: "Project created" });
});

router.patch('/:id', requireAuth, validateBody(projectSchema.partial()), (req, res) => {
  res.json({ message: `Project ${req.params.id} updated` });
});

router.post('/:id/submit', requireAuth, validateBody(submitSchema), auditLog('submit_project'), (req, res) => {
  res.json({ message: "Project submitted for review" });
});

router.post('/:id/ai-verify', requireAuth, auditLog('ai_verify_project'), (req, res) => {
  res.json({ status: "Verified", feedback: [] });
});

export default router;
