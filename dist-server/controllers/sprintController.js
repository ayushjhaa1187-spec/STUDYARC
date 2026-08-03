import { supabaseAdmin } from '../config/supabase.js';
export const getActiveSprints = async (req, res) => {
    try {
        const userId = req.user.id;
        const { data: sprints, error } = await supabaseAdmin
            .from('sprints')
            .select('*, tasks(*)')
            .eq('user_id', userId)
            .eq('status', 'active');
        if (error)
            throw error;
        res.json(sprints);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch sprints', details: error.message });
    }
};
export const completeTask = async (req, res) => {
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
        if (updateError)
            throw updateError;
        res.json({ success: true, task: updatedTask });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to complete task', details: error.message });
    }
};
