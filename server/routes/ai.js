import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody, requireRole } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

const chatSchema = z.object({
  message: z.string(),
  context: z.string().optional()
});

const verificationSchema = z.object({
  projectId: z.string(),
  githubUrl: z.string().url()
});

router.post('/diagnostic', requireAuth, validateBody(z.object({ targetRole: z.string(), hours: z.number(), selectedSkills: z.array(z.string()) })), auditLog('ai_diagnostic'), (req, res) => {
  res.json({ score: 85, recommendation: "AI Sprint" });
});

router.post('/sprint-plan', requireAuth, validateBody(z.object({ goal: z.string() })), auditLog('ai_sprint_plan'), (req, res) => {
  res.json({ plan: "Generated Sprint Plan" });
});

router.post('/coach', requireAuth, validateBody(chatSchema), auditLog('ai_coach_query'), (req, res) => {
  res.json({ text: "AI Coach response", codeSnippet: null });
});

router.post('/match-mentor', requireAuth, validateBody(z.object({ topic: z.string() })), (req, res) => {
  res.json({ matches: [] });
});

router.post('/verify-project', requireAuth, validateBody(verificationSchema), auditLog('ai_project_verification'), (req, res) => {
  res.json({ isVerified: true, feedback: "Looks good" });
});

// Admins can see agent events (e.g. tracking prompt usage)
router.get('/agent-events', requireAuth, requireRole(['admin']), (req, res) => {
  res.json({ events: [] });
});

export default router;
