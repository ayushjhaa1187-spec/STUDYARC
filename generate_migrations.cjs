const fs = require('fs');
const path = require('path');

const migrationsDir = 'c:/Users/DELL/SKILL-BRIDGE-PRO/supabase/migrations';
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

const file1 = path.join(migrationsDir, '20240101000001_core_schema_and_roles.sql');
fs.writeFileSync(file1, `
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

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON public.users FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
);
`);

const file2 = path.join(migrationsDir, '20240101000002_diagnostics_and_sprints.sql');
fs.writeFileSync(file2, `
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

ALTER TABLE public.assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assessments" ON public.assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON public.assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own sprints" ON public.sprints FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sprints" ON public.sprints FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own sprints" ON public.sprints FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view own tasks" ON public.tasks FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.sprints WHERE sprints.id = tasks.sprint_id AND sprints.user_id = auth.uid())
);
CREATE POLICY "Users can insert own tasks" ON public.tasks FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.sprints WHERE sprints.id = tasks.sprint_id AND sprints.user_id = auth.uid())
);
CREATE POLICY "Users can update own tasks" ON public.tasks FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.sprints WHERE sprints.id = tasks.sprint_id AND sprints.user_id = auth.uid())
);
`);

const file3 = path.join(migrationsDir, '20240101000003_ai_coach_and_logs.sql');
fs.writeFileSync(file3, `
-- 5. Chat History (contextual AI coach)
CREATE TABLE public.chat_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sprint_id UUID REFERENCES public.sprints(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 6. Daily Progress Log (tracks day-by-day completion)
CREATE TABLE public.daily_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  sprint_id UUID NOT NULL REFERENCES public.sprints(id) ON DELETE CASCADE,
  day INTEGER NOT NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE(sprint_id, day)
);

-- 7. User Activity Log for analytics
CREATE TABLE public.user_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id),
  event_type TEXT NOT NULL, 
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

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
`);

const file4 = path.join(migrationsDir, '20240101000004_mentor_marketplace.sql');
fs.writeFileSync(file4, `
-- 8. Mentors Profile Table
CREATE TABLE public.mentors_profile (
    id UUID PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    quality_score NUMERIC(3, 1) DEFAULT 5.0,
    availability JSONB DEFAULT '[]'::jsonb,
    payout_status TEXT DEFAULT 'active' CHECK (payout_status IN ('active', 'suspended')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 9. Expert Bookings
CREATE TABLE public.expert_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    expert_id UUID NOT NULL REFERENCES public.mentors_profile(id),
    slot_time TIMESTAMP WITH TIME ZONE NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_order_id TEXT,
    payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.expert_bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bookings" ON public.expert_bookings FOR SELECT USING (auth.uid() = user_id OR auth.uid() = expert_id);
CREATE POLICY "Users can insert own bookings" ON public.expert_bookings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Experts can update booking status" ON public.expert_bookings FOR UPDATE USING (auth.uid() = expert_id);

ALTER TABLE public.mentors_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Mentors can view own profile" ON public.mentors_profile FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Mentors can update own profile" ON public.mentors_profile FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Anyone can view verified mentors" ON public.mentors_profile FOR SELECT USING (verification_status = 'verified');
`);

const file5 = path.join(migrationsDir, '20240101000005_payments_and_portfolio.sql');
fs.writeFileSync(file5, `
-- 10. Payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    razorpay_order_id TEXT UNIQUE NOT NULL,
    razorpay_payment_id TEXT UNIQUE,
    razorpay_signature TEXT,
    amount NUMERIC(10, 2) NOT NULL,
    status TEXT DEFAULT 'created' CHECK (status IN ('created', 'captured', 'failed')),
    booking_id UUID REFERENCES public.expert_bookings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- 11. Portfolio Submissions
CREATE TABLE public.portfolio_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sprint_id UUID REFERENCES public.sprints(id),
    title TEXT NOT NULL,
    github_url TEXT NOT NULL,
    live_demo_url TEXT,
    description TEXT,
    ai_feedback JSONB,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'needs_work')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);

ALTER TABLE public.portfolio_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own portfolios" ON public.portfolio_submissions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own portfolios" ON public.portfolio_submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own portfolios" ON public.portfolio_submissions FOR UPDATE USING (auth.uid() = user_id);
`);

const file7 = path.join(migrationsDir, '20240101000007_functions_and_triggers.sql');
fs.writeFileSync(file7, `
-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_modified_column() 
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$ language 'plpgsql';

-- Give users XP when tasks are completed
CREATE OR REPLACE FUNCTION reward_task_xp()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.is_completed = true AND OLD.is_completed = false THEN
        UPDATE public.users SET reputation_score = reputation_score + 10 WHERE id = (
            SELECT user_id FROM public.sprints WHERE id = NEW.sprint_id
        );
        INSERT INTO public.user_activities (user_id, event_type, metadata)
        VALUES (
            (SELECT user_id FROM public.sprints WHERE id = NEW.sprint_id),
            'task_completed',
            jsonb_build_object('task_id', NEW.id, 'xp_gained', 10)
        );
    END IF;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER task_completion_xp
    AFTER UPDATE ON public.tasks
    FOR EACH ROW
    EXECUTE FUNCTION reward_task_xp();
`);

console.log('Migrations created.');
