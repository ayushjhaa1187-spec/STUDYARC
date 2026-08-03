import { supabaseAdmin } from '../config/supabase.js';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const mentorCache = new Map();
export class MentorService {
    /**
     * Retrieves verified mentors, utilizing an in-memory cache to reduce DB load.
     */
    static async getVerifiedMentors(useCache = true) {
        const cacheKey = 'verified_mentors';
        if (useCache && mentorCache.has(cacheKey)) {
            const entry = mentorCache.get(cacheKey);
            if (Date.now() - entry.timestamp < CACHE_TTL) {
                return entry.data;
            }
        }
        const { data: mentors, error } = await supabaseAdmin
            .from('mentors_profile')
            .select('*, users(full_name, avatar_url, email)')
            .eq('verification_status', 'verified');
        if (error)
            throw error;
        mentorCache.set(cacheKey, {
            data: mentors,
            timestamp: Date.now()
        });
        return mentors;
    }
    static async getMatches(requestedSkills, minimumScore = 4.0) {
        // Import dynamically to avoid circular issues if any, or just import at top
        const { getTopMentors } = await import('./algorithms/mentorMatching.js');
        // We pass a very high budget default just to return top quality matches if not specified
        const matches = await getTopMentors({
            requiredTags: requestedSkills,
            budget: 100000
        });
        // Optionally filter by minimumScore if strictly required by old API
        return matches.filter((m) => m.rating >= minimumScore);
    }
}
