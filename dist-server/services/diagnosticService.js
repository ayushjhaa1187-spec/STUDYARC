import { supabaseAdmin } from '../config/supabase.js';
import { AiService } from './aiService.js';
import { calculateReadinessScore } from './algorithms/careerReadiness.js';
export class DiagnosticService {
    static async processDiagnostic(userId, targetRole, weeklyHours, skills, experienceLevel) {
        // Step 1: Insert pending assessment
        const { data: assessment, error } = await supabaseAdmin
            .from('assessments')
            .insert({
            user_id: userId,
            target_role: targetRole,
            weekly_hours: weeklyHours,
            skills: JSON.stringify(skills),
            readiness_score: 0,
            recommended_journey: '',
            gap_analysis: '{}',
            status: 'pending'
        })
            .select()
            .single();
        if (error)
            throw error;
        // Step 2: Insert into job_queue (Outbox Pattern)
        const { error: jobError } = await supabaseAdmin
            .from('job_queue')
            .insert({
            type: 'ai_generation',
            payload: {
                assessmentId: assessment.id,
                userId,
                targetRole,
                weeklyHours,
                skills,
                experienceLevel
            }
        });
        if (jobError)
            throw jobError;
        return assessment;
    }
    // To be called by the Background Worker
    static async processDiagnosticJob(assessmentId, userId, targetRole, weeklyHours, skills, experienceLevel) {
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
        // Update assessment to completed
        const { data: assessment, error } = await supabaseAdmin
            .from('assessments')
            .update({
            readiness_score: calculatedScore,
            recommended_journey: aiAnalysis.recommendedJourney,
            gap_analysis: JSON.stringify(aiAnalysis.gapAnalysis),
            ai_output: aiAnalysis,
            status: 'completed'
        })
            .eq('id', assessmentId)
            .select()
            .single();
        if (error)
            throw error;
        // Persist a snapshot
        await supabaseAdmin
            .from('career_readiness_snapshots')
            .insert({
            user_id: userId,
            total_score: calculatedScore,
            tech_score: breakdown.techScore,
            project_score: breakdown.projectScore,
            journey_score: breakdown.journeyScore,
            streak_score: breakdown.streakScore,
            evidence_score: breakdown.evidenceScore,
            trigger_event: 'diagnostic_completed'
        });
        return assessment;
    }
}
