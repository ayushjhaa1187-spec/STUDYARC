import { supabaseAdmin } from '../config/supabase.js';
export const getActiveSprints = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: journeys, error } = await supabaseAdmin
            .from('user_journeys')
            .select('*, user_tasks(*)')
            .eq('user_id', userId)
            .eq('status', 'active');
        if (error)
            throw error;
        res.json(journeys);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch active journeys', details: error.message });
    }
};
export const completeTask = async (req, res) => {
    try {
        const userId = req.user.id;
        const { taskId } = req.params;
        const { proofUrl } = req.body; // In new schema, proof might be in task_activity metadata
        // Verify task belongs to user's journey
        const { data: task, error: taskError } = await supabaseAdmin
            .from('user_tasks')
            .select('*, user_journeys!inner(user_id)')
            .eq('id', taskId)
            .single();
        if (taskError || task.user_journeys.user_id !== userId) {
            return res.status(403).json({ error: 'Unauthorized to update this task' });
        }
        const { data: updatedTask, error: updateError } = await supabaseAdmin
            .from('user_tasks')
            .update({ status: 'completed', completed_at: new Date().toISOString() })
            .eq('id', taskId)
            .select()
            .single();
        if (updateError)
            throw updateError;
        // Log the activity
        await supabaseAdmin
            .from('task_activity')
            .insert({
            task_id: taskId,
            user_id: userId,
            activity_type: 'completed',
            metadata: { proofUrl }
        });
        // Gamification Integration: Award XP
        try {
            await supabaseAdmin.rpc('grant_xp', {
                p_user_id: userId,
                p_event: 'task_complete',
                p_ref_id: taskId,
                p_xp: 15 // Assuming 15 XP for a task
            });
        }
        catch (xpError) {
            console.warn("Failed to award XP:", xpError);
            // We don't throw, as the task is already completed
        }
        res.json({ success: true, task: updatedTask });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to complete task', details: error.message });
    }
};
import { SprintService } from '../services/sprintService.js';
export const markDayComplete = async (req, res) => {
    try {
        const userId = req.user.id;
        const { sprintId, day } = req.body;
        const progress = await SprintService.markDayCompleted(userId, sprintId, day);
        res.json({ success: true, progress });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to update daily progress', details: error.message });
    }
};
