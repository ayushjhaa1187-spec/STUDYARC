-- ==========================================
-- Part 6: Caching & Realtime Configuration
-- ==========================================

-- 1. Leaderboard & XP Materialized View
-- This view aggregates learner XP, streaks, and calculates global ranks.
CREATE MATERIALIZED VIEW public.leaderboard_rankings_mv AS
SELECT 
    lp.user_id,
    p.full_name,
    p.avatar_url,
    lp.xp_points,
    lp.level,
    lp.current_streak,
    RANK() OVER (ORDER BY lp.xp_points DESC, lp.current_streak DESC) as global_rank,
    NOW() as last_refreshed_at
FROM 
    public.learner_profiles lp
JOIN 
    public.profiles p ON p.id = lp.user_id
WHERE 
    p.role = 'learner';

-- Create a unique index to allow CONCURRENT refresh
CREATE UNIQUE INDEX idx_leaderboard_rankings_user_id ON public.leaderboard_rankings_mv (user_id);
-- Create an index on rank for fast dashboard queries
CREATE INDEX idx_leaderboard_rankings_rank ON public.leaderboard_rankings_mv (global_rank);

-- 2. RPC to refresh the materialized view
-- Can be called via Supabase Edge Functions or pg_cron
CREATE OR REPLACE FUNCTION public.refresh_materialized_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Refresh concurrently so we don't block reads from the dashboard
    REFRESH MATERIALIZED VIEW CONCURRENTLY public.leaderboard_rankings_mv;
END;
$$;

-- 3. Configure Supabase Realtime
-- Drop the publication if it already exists to recreate it cleanly (optional, but safe)
DROP PUBLICATION IF EXISTS supabase_realtime;

-- Create the publication for realtime
CREATE PUBLICATION supabase_realtime;

-- Explicitly add only the tables that require realtime subscriptions to the publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.mentor_bookings;
ALTER PUBLICATION supabase_realtime ADD TABLE public.ai_messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.user_tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_answers;
