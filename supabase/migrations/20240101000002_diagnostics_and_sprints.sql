
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
