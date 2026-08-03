-- 20260803130000_system_architecture_improvements.sql

-- ENUMS
DO $$ BEGIN
    CREATE TYPE public.job_status AS ENUM ('pending', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE public.event_type AS ENUM ('user_signup', 'sprint_completed', 'payment_success', 'portfolio_submitted', 'ai_generation');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 1. OUTBOX / JOB QUEUE (Transactional Outbox Pattern)
CREATE TABLE IF NOT EXISTS public.job_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type public.event_type NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status public.job_status DEFAULT 'pending',
    attempts INTEGER DEFAULT 0,
    locked_at TIMESTAMP WITH TIME ZONE,
    error_log TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    processed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_job_queue_status_created ON public.job_queue(status, created_at) WHERE status = 'pending';

-- 2. XP LEDGER (Immutable Ledger for XP)
CREATE TABLE IF NOT EXISTS public.xp_ledger (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE SET NULL,
    task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    xp_amount INTEGER NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE INDEX IF NOT EXISTS idx_xp_ledger_user ON public.xp_ledger(user_id);

-- 3. SCORE HISTORY (For Mentor Quality or User Readiness Trends)
CREATE TABLE IF NOT EXISTS public.score_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL,
    entity_type TEXT CHECK (entity_type IN ('mentor', 'learner')),
    previous_score NUMERIC(5,2),
    new_score NUMERIC(5,2) NOT NULL,
    change_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);
CREATE INDEX IF NOT EXISTS idx_score_history_entity ON public.score_history(entity_id, entity_type);


-- 4. RLS IMPROVEMENTS & SECURITY
ALTER TABLE public.job_queue ENABLE ROW LEVEL SECURITY;
-- No policies on job_queue means default deny all for anon/authenticated (Only Service Role / Backend can access)

ALTER TABLE public.xp_ledger ENABLE ROW LEVEL SECURITY;
-- Users can only read their own XP history
DROP POLICY IF EXISTS "Users view own XP" ON public.xp_ledger;
CREATE POLICY "Users view own XP" ON public.xp_ledger FOR SELECT USING (auth.uid() = user_id);
-- Insert allowed only via backend service role

ALTER TABLE public.score_history ENABLE ROW LEVEL SECURITY;
-- Users can view their own score history
DROP POLICY IF EXISTS "Users view own score history" ON public.score_history;
CREATE POLICY "Users view own score history" ON public.score_history FOR SELECT USING (auth.uid() = entity_id);


-- 5. COMPOSITE INDEXES FOR SCALABILITY
CREATE INDEX IF NOT EXISTS idx_tasks_sprint_completed ON public.tasks(sprint_id, is_completed);
CREATE INDEX IF NOT EXISTS idx_assessments_user_status ON public.assessments(user_id, status);
CREATE INDEX IF NOT EXISTS idx_chat_history_sprint_role ON public.chat_history(sprint_id, role);

-- 6. ADDITIONAL CONSTRAINTS
-- Prevent negative XP in ledger
ALTER TABLE public.xp_ledger ADD CONSTRAINT check_xp_amount_positive CHECK (xp_amount > 0);
