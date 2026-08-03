-- 1. Normalization & Columns
-- Add user_id to user_tasks for faster queries (N+1 avoidance)
ALTER TABLE public.user_tasks ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Backfill user_id (if there is existing data)
UPDATE public.user_tasks ut
SET user_id = uj.user_id
FROM public.user_journeys uj
WHERE ut.user_journey_id = uj.id AND ut.user_id IS NULL;

-- 2. Constraints
ALTER TABLE public.mentor_profiles 
  ADD CONSTRAINT check_hourly_rate CHECK (hourly_rate_inr >= 0),
  ADD CONSTRAINT check_session_rate CHECK (session_rate_inr >= 0);

ALTER TABLE public.mentor_services
  ADD CONSTRAINT check_service_price CHECK (price_inr >= 0),
  ADD CONSTRAINT check_duration CHECK (duration_minutes > 0);

-- 3. B-Tree Indexes for Performance
-- Profiles & Roles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Journeys & Tasks
CREATE INDEX IF NOT EXISTS idx_user_journeys_user_status ON public.user_journeys(user_id, status);
CREATE INDEX IF NOT EXISTS idx_user_tasks_journey_status_due ON public.user_tasks(user_journey_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_user_tasks_user_status_due ON public.user_tasks(user_id, status, due_date);

-- Mentor Marketplace
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_marketplace ON public.mentor_profiles(verification_status, quality_score DESC, rating_average DESC);
CREATE INDEX IF NOT EXISTS idx_mentor_services_lookup ON public.mentor_services(mentor_id, service_type) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_mentor_availability_lookup ON public.mentor_availability(mentor_id, start_time, is_booked);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_learner ON public.mentor_bookings(learner_id, status);
CREATE INDEX IF NOT EXISTS idx_mentor_bookings_mentor ON public.mentor_bookings(mentor_id, scheduled_at, status);

-- Portfolio & Verification
CREATE INDEX IF NOT EXISTS idx_portfolio_projects_user_status ON public.portfolio_projects(user_id, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_portfolio_verification_events_project ON public.portfolio_verification_events(project_id, created_at DESC);

-- Agents & Payments
CREATE INDEX IF NOT EXISTS idx_agent_events_lookup ON public.agent_events(user_id, agent_type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_payments_lookup ON public.payments(user_id, status, created_at DESC);

-- Community
CREATE INDEX IF NOT EXISTS idx_community_threads_status_created ON public.community_threads(status, created_at DESC);

-- 4. GIN Indexes for JSONB and Full Text Search
CREATE INDEX IF NOT EXISTS idx_mentor_profiles_tags_gin ON public.mentor_profiles USING GIN (expertise_tags);
CREATE INDEX IF NOT EXISTS idx_portfolio_tech_stack_gin ON public.portfolio_projects USING GIN (tech_stack);

-- Full Text Search Index for Community Threads
ALTER TABLE public.community_threads ADD COLUMN IF NOT EXISTS fts_vector tsvector GENERATED ALWAYS AS (to_tsvector('english', title || ' ' || body)) STORED;
CREATE INDEX IF NOT EXISTS idx_community_threads_fts ON public.community_threads USING GIN (fts_vector);
