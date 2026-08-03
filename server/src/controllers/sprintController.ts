import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { supabaseAdmin } from '../config/supabase.js';

export const getActiveSprints = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { data: sprints, error } = await supabaseAdmin
      .from('sprints')
      .select('*, tasks(*)')
      .eq('user_id', userId)
      .eq('status', 'active');

    if (error) throw error;
    res.json(sprints);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch sprints', details: error.message });
  }
};

export const completeTask = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { taskId } = req.params;
    const { proofUrl } = req.body;

    // Verify task belongs to user's sprint
    const { data: task, error: taskError } = await supabaseAdmin
      .from('tasks')
      .select('*, sprints!inner(user_id)')
      .eq('id', taskId)
      .single();

    if (taskError || task.sprints.user_id !== userId) {
      return res.status(403).json({ error: 'Unauthorized to update this task' });
    }

    const { data: updatedTask, error: updateError } = await supabaseAdmin
      .from('tasks')
      .update({ is_completed: true, proof_url: proofUrl })
      .eq('id', taskId)
      .select()
      .single();

    if (updateError) throw updateError;

    // Gamification Integration: Award XP
    try {
      await supabaseAdmin.rpc('grant_xp', {
        p_user_id: userId,
        p_event: 'task_complete',
        p_ref_id: taskId,
        p_xp: 15 // Assuming 15 XP for a task
      });
    } catch (xpError) {
      console.warn("Failed to award XP:", xpError);
      // We don't throw, as the task is already completed
    }

    res.json({ success: true, task: updatedTask });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to complete task', details: error.message });
  }
};

import { SprintService } from '../services/sprintService.js';

export const markDayComplete = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { sprintId, day } = req.body;

    const progress = await SprintService.markDayCompleted(userId, sprintId, day);
    res.json({ success: true, progress });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update daily progress', details: error.message });
  }
};
