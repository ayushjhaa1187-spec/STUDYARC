import { supabaseAdmin } from '../config/supabase.js';
export const submitPortfolio = async (req, res) => {
    try {
        const userId = req.user.id;
        const { githubUrl, liveDemoUrl } = req.body;
        // Based on the new Portfolio Verification State Machine (DSA Architecture)
        // 1. We create the submission in 'ai_check_queued' state.
        // 2. An async worker (e.g., Supabase Edge Function with Cloud Tasks) will pick this up,
        //    run the Gemini AI validation, and move it to 'ai_check_passed' or 'needs_changes'.
        // 3. Human mentors can then review 'ai_check_passed' submissions.
        const { data: submission, error } = await supabaseAdmin
            .from('portfolio_submissions')
            .insert({
            user_id: userId,
            github_url: githubUrl,
            demo_url: liveDemoUrl,
            status: 'ai_check_queued',
            submission_version: 1
        })
            .select()
            .single();
        if (error)
            throw error;
        // XP will only be granted later when the mentor marks it as 'verified'
        res.json({
            success: true,
            message: 'Portfolio submitted and queued for AI verification',
            submission
        });
    }
    catch (error) {
        console.error('Portfolio Error:', error);
        res.status(500).json({ error: 'Failed to queue portfolio submission', details: error.message });
    }
};
