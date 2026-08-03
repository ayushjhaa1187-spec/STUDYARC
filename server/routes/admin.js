import express from 'express';
import { supabaseAdmin } from '../supabaseClient.js';

const router = express.Router();

router.get('/analytics', async (req, res) => {
  try {
    // 1. User Metrics
    const { count: totalUsers } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true });

    const { count: activeLearners } = await supabaseAdmin
      .from('users')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'learner');

    // 2. Sprint Metrics
    const { count: totalSprints } = await supabaseAdmin
      .from('sprints')
      .select('*', { count: 'exact', head: true });

    const { count: completedSprints } = await supabaseAdmin
      .from('sprints')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    const sprintCompletionRate = totalSprints > 0 ? (completedSprints / totalSprints) * 100 : 0;

    // 3. Mentor Sessions
    const { count: bookedSessions } = await supabaseAdmin
      .from('expert_bookings')
      .select('*', { count: 'exact', head: true });

    const { count: completedSessions } = await supabaseAdmin
      .from('expert_bookings')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    // 4. GMV and Platform Revenue
    const { data: bookingsData } = await supabaseAdmin
      .from('expert_bookings')
      .select('amount_paid')
      .eq('payment_status', 'paid');
    
    const gmv = bookingsData ? bookingsData.reduce((acc, curr) => acc + Number(curr.amount_paid), 0) : 0;

    const { data: payoutsData } = await supabaseAdmin
      .from('mentor_payouts')
      .select('platform_fee');
    
    const platformRevenue = payoutsData ? payoutsData.reduce((acc, curr) => acc + Number(curr.platform_fee), 0) : 0;

    // 5. Agent Actions & Failure Rate (mock/placeholder via audit logs)
    const { count: agentActions } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', 'agent_decision');

    const { count: agentFailures } = await supabaseAdmin
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('action_type', 'agent_failure');

    const agentFailureRate = agentActions > 0 ? (agentFailures / agentActions) * 100 : 0;

    // 6. Common Learner Blockers (Aggregation from gap analysis in assessments)
    const { data: assessments } = await supabaseAdmin
      .from('assessments')
      .select('gap_analysis');

    let gapAnalysisCounts = {};
    if (assessments) {
        assessments.forEach(assessment => {
            const gaps = assessment.gap_analysis || [];
            gaps.forEach(gap => {
                gapAnalysisCounts[gap] = (gapAnalysisCounts[gap] || 0) + 1;
            });
        });
    }

    // Sort to get top 5 blockers
    const topBlockers = Object.entries(gapAnalysisCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([blocker, count]) => ({ blocker, count }));

    res.json({
      metrics: {
        users: {
          total: totalUsers,
          activeLearners: activeLearners,
          activePaidUsers: bookingsData ? new Set(bookingsData.map(b => b.user_id)).size : 0, // Approximate
        },
        sprints: {
          total: totalSprints,
          completed: completedSprints,
          completionRate: sprintCompletionRate.toFixed(2) + '%'
        },
        mentorSessions: {
          booked: bookedSessions,
          completed: completedSessions
        },
        revenue: {
          gmv: gmv,
          platformRevenue: platformRevenue
        },
        agents: {
          totalActions: agentActions,
          failureRate: agentFailureRate.toFixed(2) + '%'
        },
        topBlockers: topBlockers
      }
    });

  } catch (error) {
    console.error('Admin Analytics Error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

export default router;
