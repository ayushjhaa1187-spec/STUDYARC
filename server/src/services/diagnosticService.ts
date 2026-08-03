import { supabaseAdmin } from '../config/supabase.js';
import { AiService } from './aiService.js';
import { calculateReadinessScore, ReadinessMetrics } from './algorithms/careerReadiness.js';

export class DiagnosticService {
  static async processDiagnostic(userId: string, targetRole: string, weeklyHours: number, skills: string[], experienceLevel: string) {
    const aiAnalysis = await AiService.evaluateProfile(targetRole, weeklyHours, skills, experienceLevel);

    // Calculate real readiness score instead of trusting AI arbitrary number
    const metrics: ReadinessMetrics = {
        avgAssessed: 0, // In a real flow, fetch from past assessments if any
        avgSelfReported: skills.length > 0 ? 50 : 0, 
        noAssessedSkills: true, // First diagnostic
        verifiedProjectsCount: 0,
        uniqueCompletedCoreTasks: 0,
        totalCoreTasks: aiAnalysis.recommendedJourney ? 10 : 0, 
        currentStreak: 0,
        githubActivityScore: 0,
        resumeCompletenessScore: 0
    };

    const { total: calculatedScore, breakdown } = calculateReadinessScore(metrics);

    // Insert diagnostic assessment
    const { data: assessment, error } = await supabaseAdmin
      .from('assessments')
      .insert({
        user_id: userId,
        target_role: targetRole,
        weekly_hours: weeklyHours,
        skills: JSON.stringify(skills),
        readiness_score: calculatedScore,
        recommended_journey: aiAnalysis.recommendedJourney,
        gap_analysis: JSON.stringify(aiAnalysis.gapAnalysis),
        ai_output: aiAnalysis,
        status: 'completed'
      })
      .select()
      .single();

    if (error) throw error;

    // Persist a snapshot using our new DSA architecture table
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
