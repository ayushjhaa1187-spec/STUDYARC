-- 1. Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learner_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.journey_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenge_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_journeys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentor_reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_evidence ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_verification_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnostic_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thread_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 3. Admin Policies (All access for admins)
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN 
        SELECT table_name FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    LOOP
        EXECUTE format('CREATE POLICY "Admins have full access to %I" ON public.%I FOR ALL USING (public.is_admin());', t, t);
    END LOOP;
END $$;

-- 4. Table-specific Policies

-- profiles
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- learner_profiles
CREATE POLICY "Learners can view all learner profiles" ON public.learner_profiles FOR SELECT USING (true);
CREATE POLICY "Learners can manage own profile" ON public.learner_profiles FOR ALL USING (auth.uid() = user_id);

-- mentor_profiles
CREATE POLICY "Users can view all mentor profiles" ON public.mentor_profiles FOR SELECT USING (true);
CREATE POLICY "Mentors can manage own profile" ON public.mentor_profiles FOR ALL USING (auth.uid() = user_id);

-- skills, journeys, journey_phases, challenge_templates (Public Read-Only)
CREATE POLICY "Anyone can view skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Anyone can view journeys" ON public.journeys FOR SELECT USING (true);
CREATE POLICY "Anyone can view journey phases" ON public.journey_phases FOR SELECT USING (true);
CREATE POLICY "Anyone can view challenge templates" ON public.challenge_templates FOR SELECT USING (true);

-- user_skills
CREATE POLICY "Users can manage own skills" ON public.user_skills FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view others skills" ON public.user_skills FOR SELECT USING (true);

-- user_journeys
CREATE POLICY "Users can manage own journeys" ON public.user_journeys FOR ALL USING (auth.uid() = user_id);

-- user_tasks
CREATE POLICY "Users can manage own tasks" ON public.user_tasks FOR ALL USING (
    EXISTS (SELECT 1 FROM public.user_journeys uj WHERE uj.id = user_tasks.user_journey_id AND uj.user_id = auth.uid())
);

-- task_activity
CREATE POLICY "Users can manage own task activity" ON public.task_activity FOR ALL USING (auth.uid() = user_id);

-- mentor_availability
CREATE POLICY "Anyone can view mentor availability" ON public.mentor_availability FOR SELECT USING (true);
CREATE POLICY "Mentors can manage own availability" ON public.mentor_availability FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mentor_profiles mp WHERE mp.user_id = mentor_availability.mentor_id AND mp.user_id = auth.uid())
);

-- mentor_services
CREATE POLICY "Anyone can view mentor services" ON public.mentor_services FOR SELECT USING (true);
CREATE POLICY "Mentors can manage own services" ON public.mentor_services FOR ALL USING (
    EXISTS (SELECT 1 FROM public.mentor_profiles mp WHERE mp.user_id = mentor_services.mentor_id AND mp.user_id = auth.uid())
);

-- mentor_bookings
CREATE POLICY "Learners can view and manage own bookings" ON public.mentor_bookings FOR ALL USING (auth.uid() = learner_id);
CREATE POLICY "Mentors can view and manage assigned bookings" ON public.mentor_bookings FOR ALL USING (auth.uid() = mentor_id);

-- mentor_reviews
CREATE POLICY "Anyone can view mentor reviews" ON public.mentor_reviews FOR SELECT USING (true);
CREATE POLICY "Learners can manage own reviews" ON public.mentor_reviews FOR ALL USING (auth.uid() = learner_id);

-- portfolio_projects
CREATE POLICY "Anyone can view portfolio projects" ON public.portfolio_projects FOR SELECT USING (true);
CREATE POLICY "Users can manage own portfolio projects" ON public.portfolio_projects FOR ALL USING (auth.uid() = user_id);

-- project_evidence
CREATE POLICY "Anyone can view project evidence" ON public.project_evidence FOR SELECT USING (true);
CREATE POLICY "Users can manage own project evidence" ON public.project_evidence FOR ALL USING (
    EXISTS (SELECT 1 FROM public.portfolio_projects pp WHERE pp.id = project_evidence.project_id AND pp.user_id = auth.uid())
);

-- portfolio_verification_events
CREATE POLICY "Anyone can view verification events" ON public.portfolio_verification_events FOR SELECT USING (true);

-- diagnostic_results
CREATE POLICY "Users can manage own diagnostic results" ON public.diagnostic_results FOR ALL USING (auth.uid() = user_id);

-- ai_conversations
CREATE POLICY "Users can manage own ai conversations" ON public.ai_conversations FOR ALL USING (auth.uid() = user_id);

-- ai_messages
CREATE POLICY "Users can manage own ai messages" ON public.ai_messages FOR ALL USING (
    EXISTS (SELECT 1 FROM public.ai_conversations ac WHERE ac.id = ai_messages.conversation_id AND ac.user_id = auth.uid())
);

-- agent_events
CREATE POLICY "Users can manage own agent events" ON public.agent_events FOR ALL USING (auth.uid() = user_id);

-- community_threads
CREATE POLICY "Anyone can view threads" ON public.community_threads FOR SELECT USING (true);
CREATE POLICY "Users can manage own threads" ON public.community_threads FOR ALL USING (auth.uid() = author_id);

-- community_answers
CREATE POLICY "Anyone can view answers" ON public.community_answers FOR SELECT USING (true);
CREATE POLICY "Users can manage own answers" ON public.community_answers FOR ALL USING (auth.uid() = author_id);

-- thread_votes
CREATE POLICY "Anyone can view votes" ON public.thread_votes FOR SELECT USING (true);
CREATE POLICY "Users can manage own votes" ON public.thread_votes FOR ALL USING (auth.uid() = user_id);

-- payments
CREATE POLICY "Users can view own payments" ON public.payments FOR SELECT USING (auth.uid() = user_id);
-- Insert/Update on payments should be restricted to service role / admin, so no ALL policy for regular users.

-- payouts
CREATE POLICY "Mentors can view own payouts" ON public.payouts FOR SELECT USING (auth.uid() = mentor_id);
-- Insert/Update restricted to service role / admin.

-- notifications
CREATE POLICY "Users can manage own notifications" ON public.notifications FOR ALL USING (auth.uid() = user_id);

-- admin_audit_logs
-- Only admins can access, which is already handled by the blanket admin policy.
