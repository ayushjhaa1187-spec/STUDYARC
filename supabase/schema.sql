-- Supabase Schema for Phase 2: Core User Flow & Diagnostic

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Users Table (extends Supabase Auth)
CREATE TABLE public.users (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    reputation_score INTEGER DEFAULT 0,
    role TEXT DEFAULT 'learner' CHECK (role IN ('learner', 'mentor', 'admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 2. Assessments Table (Stores Diagnostic Results)
CREATE TABLE public.assessments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    weekly_hours INTEGER NOT NULL,
    skills JSONB NOT NULL,
    readiness_score INTEGER NOT NULL,
    recommended_journey TEXT NOT NULL,
    gap_analysis JSONB NOT NULL,
    ai_output JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Sprints Table (Active Execution Sprints)
CREATE TABLE public.sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completed_at TIMESTAMP WITH TIME ZONE,
    last_activity_at TIMESTAMP WITH TIME ZONE,
    total_days INTEGER,
    current_day INTEGER DEFAULT 1,
    streak INTEGER DEFAULT 0
);

-- 4. Tasks Table (Sprint Sub-tasks)
CREATE TABLE public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    proof_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ROW LEVEL SECURITY (RLS) POLICIES

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Users can only read and update their own profile
CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Users can only manage their own assessments
CREATE POLICY "Users can view own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only manage their own sprints
CREATE POLICY "Users can view own sprints" ON public.sprints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sprints" ON public.sprints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sprints" ON public.sprints FOR UPDATE USING (auth.uid() = user_id);

-- Users can only manage tasks within their own sprints
CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sprints WHERE sprints.id = tasks.sprint_id AND sprints.user_id = auth.uid())
);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.sprints WHERE sprints.id = tasks.sprint_id AND sprints.user_id = auth.uid())
);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sprints WHERE sprints.id = tasks.sprint_id AND sprints.user_id = auth.uid())
);

-- PHASE 3: SPRINT DASHBOARD & EXECUTION --

-- 5. Chat History (contextual AI coach)
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sprint_id UUID NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Daily Progress Log (tracks day-by-day completion)
CREATE TABLE public.daily_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sprint_id UUID NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE UNIQUE,
  completion_mask BIGINT DEFAULT 0, -- bitmask where nth bit represents day n completion
  notes JSONB DEFAULT '{}'::jsonb, -- optional user notes mapped by day
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. User Activity Log for analytics
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  event_type TEXT NOT NULL, -- 'task_completed', 'chat_message', 'streak_milestone'
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS Policies for Phase 3 Tables
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat history" ON public.chat_history
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily progress" ON public.daily_progress
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own activities" ON public.user_activities
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- PHASE 4: EXPERT MARKETPLACE --

-- 8. Expert Bookings
CREATE TABLE public.expert_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL, -- references a mentor/expert record
    slot_time TIMESTAMP WITH TIME ZONE NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_order_id TEXT,
    razorpay_payment_id TEXT,
    webhook_event_id TEXT UNIQUE,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    status TEXT DEFAULT 'pending_payment' CHECK (status IN ('pending_payment', 'confirmed', 'scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.expert_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.expert_bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() = expert_id);
CREATE POLICY "Users can insert own bookings" ON public.expert_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 9. Mentors Profile Table
CREATE TABLE public.mentors_profile (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    quality_score NUMERIC(3, 1) DEFAULT 5.0,
    availability JSONB DEFAULT '[]'::jsonb,
    payout_status TEXT DEFAULT 'active' CHECK (payout_status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.mentors_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors can view own profile" ON public.mentors_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Public can view verified mentor profiles" ON public.mentors_profile FOR SELECT USING (verification_status = 'verified');
CREATE POLICY "Mentors can update own profile" ON public.mentors_profile FOR UPDATE USING (auth.uid() = id);
-- Admins will have a bypass policy or use a custom claim to view all mentor profiles.

-- PHASE 5: PAYMENTS & AUDITING --

-- 10. Mentor Payouts
CREATE TABLE public.mentor_payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.expert_bookings(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    platform_fee NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'eligible' CHECK (status IN ('eligible', 'processing', 'paid', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.mentor_payouts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors can view own payouts" ON public.mentor_payouts FOR SELECT USING (auth.uid() = mentor_id);

-- 11. Audit Logs
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action_type TEXT NOT NULL,
    entity_id UUID,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- INDEXES FOR PERFORMANCE
CREATE INDEX idx_sprints_user_id ON public.sprints(user_id);
CREATE INDEX idx_tasks_sprint_id ON public.tasks(sprint_id);
CREATE INDEX idx_assessments_user_id ON public.assessments(user_id);
CREATE INDEX idx_chat_history_sprint_id ON public.chat_history(sprint_id);
CREATE INDEX idx_expert_bookings_user_id ON public.expert_bookings(user_id);
CREATE INDEX idx_expert_bookings_expert_id ON public.expert_bookings(expert_id);
CREATE INDEX idx_mentor_payouts_mentor_id ON public.mentor_payouts(mentor_id);

-- TRIGGERS FOR UPDATED_AT
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc', NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_assessments_updated_at
    BEFORE UPDATE ON public.assessments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_progress_updated_at
    BEFORE UPDATE ON public.daily_progress
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
