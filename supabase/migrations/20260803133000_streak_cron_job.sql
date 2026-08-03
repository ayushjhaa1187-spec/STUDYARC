-- 20260803133000_streak_cron_job.sql

-- Enable pg_cron extension if not already enabled (Supabase enables this by default, but safe to include)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Create the function to calculate streaks
CREATE OR REPLACE FUNCTION public.calculate_daily_streaks()
RETURNS void AS $$
DECLARE
    yesterday DATE := current_date - interval '1 day';
BEGIN
    -- Update users who DID NOT have a completed task activity yesterday
    UPDATE public.learner_profiles lp
    SET current_streak = 0
    WHERE NOT EXISTS (
        SELECT 1
        FROM public.task_activity ta
        WHERE ta.user_id = lp.user_id
          AND ta.activity_type = 'completed'
          AND DATE(ta.created_at AT TIME ZONE 'UTC' AT TIME ZONE 'Asia/Kolkata') = yesterday
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Schedule the job to run daily at 00:05 AM IST (which is 18:35 UTC)
-- Note: cron uses UTC in Supabase. 18:35 UTC is 00:05 IST next day.
SELECT cron.schedule(
    'daily-streak-calculation',
    '35 18 * * *',
    'SELECT public.calculate_daily_streaks()'
);
