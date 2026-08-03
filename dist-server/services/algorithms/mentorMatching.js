import { supabaseAdmin } from '../../config/supabase.js';
/**
 * Searches for mentors using the PostgreSQL match_mentors RPC
 * which calculates the Match Score in-database.
 */
export async function getTopMentors(criteria) {
    const { requiredTags, budget, limit = 5 } = criteria;
    // Call the database RPC to perform the matching and ranking on the database side
    const { data: mentors, error } = await supabaseAdmin.rpc('match_mentors', {
        p_tags: requiredTags,
        p_budget: budget,
        p_limit: limit
    });
    if (error) {
        throw error;
    }
    return mentors || [];
}
