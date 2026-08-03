import { supabaseAdmin } from '../config/supabase.js';
import { AiService } from './aiService.js';
import { calculateReadinessScore } from './algorithms/careerReadiness.js';
export class DiagnosticService {
    static async processDiagnostic(userId, targetRole, weeklyHours, skills, experienceLevel) {
        // Step 1: Insert pending assessment record
        const { data: diagnostic, error } = await supabaseAdmin
            .from('diagnostic_results')
            .insert({
            user_id: userId,
            target_role: targetRole,
            input_snapshot: { skills, weeklyHours, experienceLevel }
        })
            .select()
            .single();
        if (error)
            throw error;
        // Step 2: Insert into job_queue
        const { error: jobError } = await supabaseAdmin
            .from('job_queue')
            .insert({
            type: 'ai_generation',
            payload: {
                diagnosticId: diagnostic.id,
                userId,
                targetRole,
                weeklyHours,
                skills,
                experienceLevel
            }
        });
        if (jobError)
            throw jobError;
        return diagnostic;
    }
    static async processDiagnosticJob(diagnosticId, userId, targetRole, weeklyHours, skills, experienceLevel) {
        const aiAnalysis = await AiService.evaluateProfile(targetRole, weeklyHours, skills, experienceLevel);
        const metrics = {
            avgAssessed: 0,
            avgSelfReported: skills.length > 0 ? 50 : 0,
            noAssessedSkills: true,
            verifiedProjectsCount: 0,
            uniqueCompletedCoreTasks: 0,
            totalCoreTasks: aiAnalysis.recommendedJourney ? 10 : 0,
            currentStreak: 0,
            githubActivityScore: 0,
            resumeCompletenessScore: 0
        };
        const { total: calculatedScore, breakdown } = calculateReadinessScore(metrics);
        // Update diagnostic_results to completed state
        const { data: diagnostic, error } = await supabaseAdmin
            .from('diagnostic_results')
            .update({
            readiness_score: calculatedScore,
            recommended_next_steps: aiAnalysis.gapAnalysis,
            generated_plan: aiAnalysis,
            model_name: 'gemini-pro'
        })
            .eq('id', diagnosticId)
            .select()
            .single();
        if (error)
            throw error;
        // Update readiness score on learner_profiles directly
        await supabaseAdmin
            .from('learner_profiles')
            .upsert({
            user_id: userId,
            readiness_score: calculatedScore,
            target_role: targetRole
        }, { onConflict: 'user_id' });
        // Audit log for Agent decision
        await supabaseAdmin
            .from('agent_events')
            .insert({
            user_id: userId,
            agent_type: 'diagnostic',
            event_type: 'diagnostic_evaluation',
            input_summary: { targetRole, weeklyHours, skills, experienceLevel },
            output_summary: aiAnalysis,
            status: 'completed'
        });
        return diagnostic;
    }
}
