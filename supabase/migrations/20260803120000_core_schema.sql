-- 1. Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums
CREATE TYPE user_role AS ENUM ('learner', 'mentor', 'admin');
CREATE TYPE skill_category AS ENUM ('ai_ml', 'web_dev', 'data', 'product', 'soft_skill');
CREATE TYPE journey_status AS ENUM ('active', 'paused', 'completed', 'abandoned');
CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'completed', 'skipped', 'blocked');
CREATE TYPE activity_type_enum AS ENUM ('created', 'started', 'completed', 'skipped', 'blocked', 'rescheduled');
CREATE TYPE verification_status_enum AS ENUM ('pending', 'under_review', 'approved', 'rejected', 'suspended');
CREATE TYPE mentor_service_type AS ENUM ('project_review', 'resume_review', 'mock_interview', 'career_guidance', 'architecture_review');
CREATE TYPE booking_status AS ENUM ('pending_payment', 'confirmed', 'completed', 'cancelled', 'disputed', 'refunded');
CREATE TYPE project_status AS ENUM ('draft', 'submitted', 'ai_checked', 'human_review', 'verified', 'rejected');
CREATE TYPE evidence_type_enum AS ENUM ('github', 'live_demo', 'screenshot', 'document', 'video', 'deployment');
CREATE TYPE actor_type_enum AS ENUM ('learner', 'ai_agent', 'mentor', 'admin');
CREATE TYPE verification_event_type AS ENUM ('submitted', 'ai_check_started', 'ai_check_passed', 'ai_check_failed', 'mentor_reviewed', 'verified', 'rejected');
CREATE TYPE conversation_type_enum AS ENUM ('diagnostic', 'coach', 'project_review', 'mentor_match');
CREATE TYPE message_role_enum AS ENUM ('user', 'assistant', 'system', 'tool');
CREATE TYPE agent_type_enum AS ENUM ('diagnostic', 'sprint_planner', 'coach', 'matcher', 'portfolio_verifier', 'retention');
CREATE TYPE agent_event_status AS ENUM ('started', 'completed', 'failed', 'needs_human_review');
CREATE TYPE thread_status AS ENUM ('open', 'answered', 'verified_solution', 'closed');
CREATE TYPE answer_type_enum AS ENUM ('learner', 'mentor', 'ai');
CREATE TYPE vote_type_enum AS ENUM ('upvote');
CREATE TYPE payment_provider_enum AS ENUM ('razorpay');
CREATE TYPE payment_type_enum AS ENUM ('pro_subscription', 'mentor_booking', 'portfolio_review');
CREATE TYPE payment_status_enum AS ENUM ('created', 'paid', 'failed', 'refunded');
CREATE TYPE payout_status_enum AS ENUM ('pending', 'eligible', 'paid', 'failed');

-- 3. Create Tables

-- 1. profiles
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    role user_role NOT NULL DEFAULT 'learner',
    full_name TEXT,
    avatar_url TEXT,
    bio TEXT,
    college_or_company TEXT,
    location TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    target_role TEXT,
    experience_level TEXT,
    weekly_hours INTEGER,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. learner_profiles
CREATE TABLE public.learner_profiles (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    career_goal TEXT,
    target_role TEXT,
    current_skill_level TEXT,
    readiness_score INTEGER DEFAULT 0,
    xp_points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    pro_status BOOLEAN DEFAULT false,
    subscription_status TEXT,
    diagnostic_completed_at TIMESTAMPTZ,
    onboarding_completed BOOLEAN DEFAULT false
);

-- 3. skills
CREATE TABLE public.skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    category skill_category NOT NULL,
    description TEXT
);

-- 4. user_skills
CREATE TABLE public.user_skills (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    skill_id UUID REFERENCES public.skills(id) ON DELETE CASCADE,
    self_rating INTEGER CHECK (self_rating >= 1 AND self_rating <= 5),
    assessed_rating INTEGER CHECK (assessed_rating >= 1 AND assessed_rating <= 5),
    evidence_url TEXT,
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, skill_id)
);

-- 5. journeys
CREATE TABLE public.journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    category skill_category NOT NULL,
    description TEXT,
    duration_days INTEGER,
    hours_per_week INTEGER,
    difficulty TEXT,
    outcomes JSONB,
    cover_image_url TEXT,
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. journey_phases
CREATE TABLE public.journey_phases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID REFERENCES public.journeys(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    sequence_number INTEGER NOT NULL,
    description TEXT,
    expected_outcome TEXT,
    UNIQUE(journey_id, sequence_number)
);

-- 7. challenge_templates
CREATE TABLE public.challenge_templates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    journey_id UUID REFERENCES public.journeys(id) ON DELETE CASCADE,
    phase_id UUID REFERENCES public.journey_phases(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    estimated_minutes INTEGER,
    difficulty TEXT,
    skill_tags JSONB,
    instructions_markdown TEXT,
    rubric JSONB,
    required_evidence JSONB,
    is_published BOOLEAN DEFAULT false
);

-- 8. user_journeys
CREATE TABLE public.user_journeys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    journey_id UUID REFERENCES public.journeys(id) ON DELETE CASCADE,
    status journey_status DEFAULT 'active',
    start_date TIMESTAMPTZ DEFAULT NOW(),
    target_end_date TIMESTAMPTZ,
    progress_percent INTEGER DEFAULT 0,
    ai_plan JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, journey_id)
);

-- 9. user_tasks
CREATE TABLE public.user_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_journey_id UUID REFERENCES public.user_journeys(id) ON DELETE CASCADE,
    challenge_template_id UUID REFERENCES public.challenge_templates(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ,
    estimated_minutes INTEGER,
    status task_status DEFAULT 'todo',
    priority TEXT,
    ai_generated BOOLEAN DEFAULT false,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. task_activity
CREATE TABLE public.task_activity (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID REFERENCES public.user_tasks(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    activity_type activity_type_enum NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. mentor_profiles
CREATE TABLE public.mentor_profiles (
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
    headline TEXT,
    expertise_tags JSONB,
    years_experience INTEGER,
    hourly_rate_inr NUMERIC,
    session_rate_inr NUMERIC,
    rating_average NUMERIC(3,2) DEFAULT 0.00,
    total_reviews INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    verification_status verification_status_enum DEFAULT 'pending',
    quality_score INTEGER DEFAULT 0,
    intro_video_url TEXT,
    calendar_connection_status TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. mentor_availability
CREATE TABLE public.mentor_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.mentor_profiles(user_id) ON DELETE CASCADE,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    timezone TEXT NOT NULL,
    is_booked BOOLEAN DEFAULT false,
    recurring_rule TEXT
);

-- 13. mentor_services
CREATE TABLE public.mentor_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.mentor_profiles(user_id) ON DELETE CASCADE,
    service_type mentor_service_type NOT NULL,
    title TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    price_inr NUMERIC NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true
);

-- 14. mentor_bookings
CREATE TABLE public.mentor_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    learner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.mentor_profiles(user_id) ON DELETE CASCADE,
    mentor_service_id UUID REFERENCES public.mentor_services(id) ON DELETE CASCADE,
    scheduled_at TIMESTAMPTZ NOT NULL,
    duration_minutes INTEGER NOT NULL,
    status booking_status DEFAULT 'pending_payment',
    meeting_url TEXT,
    learner_notes TEXT,
    mentor_notes TEXT,
    payment_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 15. mentor_reviews
CREATE TABLE public.mentor_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES public.mentor_bookings(id) ON DELETE CASCADE,
    learner_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    mentor_id UUID REFERENCES public.mentor_profiles(user_id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    review_text TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(booking_id)
);

-- 16. portfolio_projects
CREATE TABLE public.portfolio_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    user_journey_id UUID REFERENCES public.user_journeys(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    github_url TEXT,
    live_demo_url TEXT,
    project_category TEXT,
    tech_stack JSONB,
    cover_image_url TEXT,
    status project_status DEFAULT 'draft',
    ai_score INTEGER,
    mentor_score INTEGER,
    verification_badge_url TEXT,
    submitted_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ
);

-- 17. project_evidence
CREATE TABLE public.project_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    evidence_type evidence_type_enum NOT NULL,
    url TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 18. portfolio_verification_events
CREATE TABLE public.portfolio_verification_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.portfolio_projects(id) ON DELETE CASCADE,
    actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    actor_type actor_type_enum NOT NULL,
    event_type verification_event_type NOT NULL,
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 19. diagnostic_results
CREATE TABLE public.diagnostic_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL,
    input_snapshot JSONB,
    readiness_score INTEGER,
    strengths JSONB,
    gaps JSONB,
    recommended_journey_id UUID REFERENCES public.journeys(id) ON DELETE SET NULL,
    recommended_next_steps JSONB,
    generated_plan JSONB,
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 20. ai_conversations
CREATE TABLE public.ai_conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    conversation_type conversation_type_enum NOT NULL,
    title TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 21. ai_messages
CREATE TABLE public.ai_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID REFERENCES public.ai_conversations(id) ON DELETE CASCADE,
    role message_role_enum NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 22. agent_events
CREATE TABLE public.agent_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    agent_type agent_type_enum NOT NULL,
    event_type TEXT NOT NULL,
    input_summary JSONB,
    output_summary JSONB,
    status agent_event_status DEFAULT 'started',
    latency_ms INTEGER,
    model_name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 23. community_threads
CREATE TABLE public.community_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    code_snippet TEXT,
    tags JSONB,
    status thread_status DEFAULT 'open',
    upvote_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 24. community_answers
CREATE TABLE public.community_answers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    answer_type answer_type_enum NOT NULL,
    body TEXT NOT NULL,
    is_accepted BOOLEAN DEFAULT false,
    upvote_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 25. thread_votes
CREATE TABLE public.thread_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    thread_id UUID REFERENCES public.community_threads(id) ON DELETE CASCADE,
    answer_id UUID REFERENCES public.community_answers(id) ON DELETE CASCADE,
    vote_type vote_type_enum DEFAULT 'upvote',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    CHECK (
        (thread_id IS NOT NULL AND answer_id IS NULL) OR 
        (thread_id IS NULL AND answer_id IS NOT NULL)
    ),
    UNIQUE(user_id, thread_id, answer_id)
);

-- 26. payments
CREATE TABLE public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    provider payment_provider_enum DEFAULT 'razorpay',
    provider_payment_id TEXT,
    provider_order_id TEXT,
    type payment_type_enum NOT NULL,
    amount_inr NUMERIC NOT NULL,
    currency TEXT DEFAULT 'INR',
    status payment_status_enum DEFAULT 'created',
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 27. payouts
CREATE TABLE public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    mentor_id UUID REFERENCES public.mentor_profiles(user_id) ON DELETE CASCADE,
    booking_id UUID REFERENCES public.mentor_bookings(id) ON DELETE CASCADE,
    gross_amount_inr NUMERIC NOT NULL,
    platform_fee_inr NUMERIC NOT NULL,
    payout_amount_inr NUMERIC NOT NULL,
    status payout_status_enum DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- 28. notifications
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    action_url TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 29. admin_audit_logs
CREATE TABLE public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
