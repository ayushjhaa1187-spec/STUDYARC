import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody } from '../middleware/auth.js';
import { supabaseAdmin } from '../supabaseClient.js';

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
  vote: z.enum(['up', 'down', 'none']) // 'none' removes the vote
});

router.get('/threads', async (req, res) => {
  const { data: threads, error } = await supabaseAdmin
    .from('community_threads')
    .select('*, users(full_name, avatar_url)')
    .order('created_at', { ascending: false })
    .limit(20);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ threads });
});

router.get('/threads/:id', async (req, res) => {
  const { data: thread, error: threadError } = await supabaseAdmin
    .from('community_threads')
    .select('*, users(full_name, avatar_url)')
    .eq('id', req.params.id)
    .single();

  if (threadError) return res.status(500).json({ error: threadError.message });

  const { data: answers, error: answerError } = await supabaseAdmin
    .from('community_answers')
    .select('*, users(full_name, avatar_url)')
    .eq('thread_id', req.params.id)
    .order('upvotes', { ascending: false });

  if (answerError) return res.status(500).json({ error: answerError.message });
  
  res.json({ thread: { ...thread, answers } });
});

router.post('/threads', requireAuth, validateBody(threadSchema), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('community_threads')
    .insert({
      user_id: req.user.id,
      title: req.body.title,
      content: req.body.content,
      tags: req.body.tags || []
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Thread created", thread: data });
});

router.post('/threads/:id/answers', requireAuth, validateBody(answerSchema), async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from('community_answers')
    .insert({
      thread_id: req.params.id,
      user_id: req.user.id,
      content: req.body.content
    })
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: "Answer posted", answer: data });
});

router.post('/votes', requireAuth, validateBody(voteSchema), async (req, res) => {
  const { targetId, targetType, vote } = req.body;
  const userId = req.user.id;

  try {
    if (vote === 'none') {
      // Remove vote
      await supabaseAdmin
        .from('community_votes')
        .delete()
        .eq('user_id', userId)
        .eq('target_id', targetId);
    } else {
      // Upsert vote
      await supabaseAdmin
        .from('community_votes')
        .upsert({
          user_id: userId,
          target_id: targetId,
          target_type: targetType,
          vote_type: vote
        }, { onConflict: 'user_id, target_id' });
    }

    // In a real app you'd recount votes using a trigger or a rpc function
    res.json({ message: "Vote recorded" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
