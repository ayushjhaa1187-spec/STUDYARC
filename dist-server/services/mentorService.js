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
    /**
     * Heuristic Mentor Matching Algorithm
     * Scores mentors based on skill intersection, quality score, and availability.
     * Time Complexity: O(M * S) where M is mentors, S is requested skills.
     */
    static async getMatches(requestedSkills, minimumScore = 4.0) {
        const mentors = await this.getVerifiedMentors();
        if (!mentors)
            return [];
        const scoredMentors = mentors
            .filter((m) => m.quality_score >= minimumScore)
            .map((m) => {
            // Jaccard-like similarity for skills
            const mentorSkills = m.availability?.skills || [];
            const intersection = requestedSkills.filter(s => mentorSkills.includes(s));
            // Base score = quality (out of 5) * 20 -> 0-100
            let score = (m.quality_score || 0) * 20;
            // Bonus for matching skills (up to 50 points)
            if (requestedSkills.length > 0) {
                const matchRatio = intersection.length / requestedSkills.length;
                score += matchRatio * 50;
            }
            return {
                ...m,
                matchScore: Math.min(Math.round(score), 100)
            };
        })
            .sort((a, b) => b.matchScore - a.matchScore);
        return scoredMentors;
    }
}
