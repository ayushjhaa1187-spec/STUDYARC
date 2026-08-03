import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody, requireRole } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

const verifyMentorSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
  feedback: z.string().optional()
});

const verifyProjectSchema = z.object({
  status: z.enum(['approved', 'rejected', 'pending']),
  feedback: z.string().optional()
});

router.use(requireAuth, requireRole(['admin']));

router.get('/dashboard', (req, res) => {
  res.json({ stats: { users: 100, activeSprints: 45 } });
});

router.get('/mentor-applications', (req, res) => {
  res.json({ applications: [] });
});

router.patch('/mentors/:id/verification', validateBody(verifyMentorSchema), auditLog('admin_verify_mentor'), (req, res) => {
  res.json({ message: `Mentor ${req.params.id} verification updated` });
});

router.patch('/projects/:id/verification', validateBody(verifyProjectSchema), auditLog('admin_verify_project'), (req, res) => {
  res.json({ message: `Project ${req.params.id} verification updated` });
});

router.get('/agent-events', (req, res) => {
  res.json({ events: [] });
});

router.get('/disputes', (req, res) => {
  res.json({ disputes: [] });
});

export default router;
