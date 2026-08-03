import { supabaseAdmin } from '../config/supabase.js';
export class SprintService {
    /**
     * Marks a specific day as completed using bitmask operations
     * @param sprintId The UUID of the sprint
     * @param day The day number (1-30)
     */
    static async markDayCompleted(userId, sprintId, day) {
        if (day < 1 || day > 30)
            throw new Error("Day must be between 1 and 30");
        // First, verify sprint belongs to user
        const { data: sprint, error: sprintError } = await supabaseAdmin
            .from('sprints')
            .select('user_id')
            .eq('id', sprintId)
            .single();
        if (sprintError || sprint?.user_id !== userId) {
            throw new Error("Unauthorized access to sprint");
        }
        // Get current progress or create it
        const { data: progress, error: fetchError } = await supabaseAdmin
            .from('daily_progress')
            .select('completion_mask')
            .eq('sprint_id', sprintId)
            .maybeSingle();
        if (fetchError)
            throw fetchError;
        let currentMask = BigInt(progress?.completion_mask || 0);
        const dayBit = 1n << BigInt(day - 1);
        // Set the bit for the specific day using bitwise OR
        const newMask = currentMask | dayBit;
        // Upsert the new mask
        const { data: updatedProgress, error: upsertError } = await supabaseAdmin
            .from('daily_progress')
            .upsert({
            user_id: userId,
            sprint_id: sprintId,
            completion_mask: newMask.toString() // Store as string to prevent JS precision issues
        }, { onConflict: 'sprint_id' })
            .select()
            .single();
        if (upsertError)
            throw upsertError;
        return updatedProgress;
    }
}
