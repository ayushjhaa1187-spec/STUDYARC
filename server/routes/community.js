import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody } from '../middleware/auth.js';

const router = express.Router();

const threadSchema = z.object({
  title: z.string().min(5),
  content: z.string().min(10),
  tags: z.array(z.string()).optional()
});

const answerSchema = z.object({
  content: z.string().min(5)
});

const voteSchema = z.object({
  targetId: z.string(),
  targetType: z.enum(['thread', 'answer']),
  vote: z.enum(['up', 'down', 'none'])
});

router.get('/threads', (req, res) => {
  res.json({ threads: [] });
});

router.get('/threads/:id', (req, res) => {
  res.json({ thread: { id: req.params.id, answers: [] } });
});

router.post('/threads', requireAuth, validateBody(threadSchema), (req, res) => {
  res.json({ message: "Thread created", threadId: "t-123" });
});

router.post('/threads/:id/answers', requireAuth, validateBody(answerSchema), (req, res) => {
  res.json({ message: "Answer posted" });
});

router.post('/votes', requireAuth, validateBody(voteSchema), (req, res) => {
  res.json({ message: "Vote recorded" });
});

export default router;
