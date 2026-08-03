import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';
import { supabaseAdmin } from '../supabaseClient.js';

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

router.get('/me', requireAuth, async (req, res) => {
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select('*')
    .eq('user_id', req.user.id);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json({ projects });
});

router.get('/:username', async (req, res) => {
  // Ideally fetch user_id from username first
  // Here we just mock it for simplicity until we add username to public.users
  const { data: projects, error } = await supabaseAdmin
    .from('projects')
    .select('*, users(full_name, avatar_url)')
    .eq('status', 'verified')
    .limit(10);
    
  if (error) return res.status(500).json({ error: error.message });
  res.json({ projects });
});

router.post('/', requireAuth, validateBody(projectSchema), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .insert({
      user_id: req.user.id,
      title: req.body.title,
      description: req.body.description,
      repository_url: req.body.repositoryUrl,
      live_url: req.body.liveUrl,
      status: 'draft'
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Project created", project: data });
});

router.patch('/:id', requireAuth, validateBody(projectSchema.partial()), async (req, res) => {
  // We explicitly add eq('user_id', req.user.id) to prevent updating others' projects
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({
      title: req.body.title,
      description: req.body.description,
      repository_url: req.body.repositoryUrl,
      live_url: req.body.liveUrl
    })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: `Project updated`, project: data });
});

router.post('/:id/submit', requireAuth, validateBody(submitSchema), auditLog('submit_project'), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({ status: 'submitted' })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Project submitted for review", project: data });
});

router.post('/:id/ai-verify', requireAuth, auditLog('ai_verify_project'), async (req, res) => {
  // Mocking AI verification logic. Usually you'd call Gemini API here
  const { data, error } = await supabaseAdmin
    .from('projects')
    .update({ 
      status: 'verified',
      ai_feedback: { score: 95, comments: "Code structure is clean and responsive." }
    })
    .eq('id', req.params.id)
    .eq('user_id', req.user.id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ status: "Verified", project: data });
});

export default router;
