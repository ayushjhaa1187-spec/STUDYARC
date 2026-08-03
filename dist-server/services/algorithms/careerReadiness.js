export function calculateReadinessScore(metrics) {
    const W_TECH = 0.30;
    const W_PROJECTS = 0.30;
    const W_JOURNEY = 0.20;
    const W_STREAK = 0.10;
    const W_EVIDENCE = 0.10;
    const TARGET_PROJECTS = 3;
    const TARGET_STREAK_DAYS = 30;
    // 1. Technical Skills (0-100)
    let techScore = 0;
    if (metrics.noAssessedSkills) {
        techScore = metrics.avgSelfReported * 0.50; // Heavy penalty
    }
    else {
        techScore = (metrics.avgAssessed * 0.75) + (metrics.avgSelfReported * 0.25);
    }
    techScore = Math.min(Math.max(techScore, 0), 100);
    // 2. Verified Projects (0-100)
    let projectScore = Math.min((metrics.verifiedProjectsCount / TARGET_PROJECTS) * 100, 100);
    // 3. Journey Completion (0-100)
    let journeyScore = 0;
    if (metrics.totalCoreTasks > 0) {
        journeyScore = Math.min((metrics.uniqueCompletedCoreTasks / metrics.totalCoreTasks) * 100, 100);
    }
    // 4. Consistency/Streak (0-100)
    let streakScore = Math.min((metrics.currentStreak / TARGET_STREAK_DAYS) * 100, 100);
    // 5. Portfolio/Evidence (0-100)
    let evidenceScore = Math.min(metrics.githubActivityScore + metrics.resumeCompletenessScore, 100);
    const totalScore = Math.round((W_TECH * techScore) +
        (W_PROJECTS * projectScore) +
        (W_JOURNEY * journeyScore) +
        (W_STREAK * streakScore) +
        (W_EVIDENCE * evidenceScore));
    return {
        total: Math.min(totalScore, 100),
        breakdown: {
            techScore: Math.round(techScore),
            projectScore: Math.round(projectScore),
            journeyScore: Math.round(journeyScore),
            streakScore: Math.round(streakScore),
            evidenceScore: Math.round(evidenceScore)
        }
    };
}
