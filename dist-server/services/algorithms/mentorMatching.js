import { supabaseAdmin } from '../../config/supabase.js';
/**
 * Searches for mentors using the active_mentors_mv materialized view
 * and calculates the Match Score via Supabase RPC or direct SQL query mapping.
 */
export async function getTopMentors(criteria) {
    const { requiredTags, budget, limit = 5 } = criteria;
    // In a real application we would use an RPC call to perform this calculation in the database.
    // E.g.: return await supabaseAdmin.rpc('match_mentors', { p_tags: requiredTags, p_budget: budget, p_limit: limit });
    // Since we are documenting the algorithm structure, here is how the data is fetched and ranked.
    // Fetch active mentors who have at least one of the required tags or match all criteria.
    const { data: mentors, error } = await supabaseAdmin
        .from('active_mentors_mv')
        .select('*');
    if (error) {
        throw error;
    }
    if (!mentors)
        return [];
    const scoredMentors = mentors.map((m) => {
        // Calculate intersection of requested tags and mentor tags
        const mentorTags = m.expertise_tags || [];
        const intersection = mentorTags.filter((tag) => requiredTags.includes(tag)).length;
        const expertiseRatio = requiredTags.length > 0 ? intersection / requiredTags.length : 1;
        const availabilityScore = m.has_availability ? 1.0 : 0.0;
        const normalizedRating = m.rating / 5.0;
        const budgetFit = m.hourly_rate <= budget ? 1.0 : 0.0;
        const newMentorBoost = m.cold_start_boost || 0;
        const matchScore = ((expertiseRatio * 0.40) +
            (availabilityScore * 0.20) +
            (normalizedRating * 0.15) +
            (budgetFit * 0.10) +
            (newMentorBoost * 0.05));
        return {
            ...m,
            matchScore
        };
    });
    // Sort by descending score
    scoredMentors.sort((a, b) => b.matchScore - a.matchScore);
    return scoredMentors.slice(0, limit);
}
