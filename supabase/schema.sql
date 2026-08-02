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
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 3. Sprints Table (Active Execution Sprints)
CREATE TABLE public.sprints (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
    completed_at TIMESTAMP WITH TIME ZONE
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

-- 5. Chat History (AI Coach Transcripts)
CREATE TABLE public.chat_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
    sender TEXT CHECK (sender IN ('user', 'ai')),
    message TEXT NOT NULL,
    code_snippet TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 6. Artifact Submissions (Project Code)
CREATE TABLE public.artifact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
    github_url TEXT NOT NULL,
    live_url TEXT,
    self_assessment TEXT NOT NULL,
    status TEXT DEFAULT 'pending_review' CHECK (status IN ('pending_review', 'verified', 'needs_work')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 7. Sprint Progress (Real-time Tracking)
CREATE TABLE public.sprint_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
    current_day INTEGER DEFAULT 1,
    streak_days INTEGER DEFAULT 0,
    completion_percentage INTEGER DEFAULT 0,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- RLS Policies for Phase 3 Tables
ALTER TABLE public.chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprint_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own chat history" ON public.chat_history FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own artifact submissions" ON public.artifact_submissions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own sprint progress" ON public.sprint_progress FOR ALL USING (auth.uid() = user_id);

-- PHASE 4: EXPERT MARKETPLACE --

-- 8. Expert Bookings
CREATE TABLE public.expert_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL, -- references a mentor/expert record
    slot_time TIMESTAMP WITH TIME ZONE NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_order_id TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.expert_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.expert_bookings FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookings" ON public.expert_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
