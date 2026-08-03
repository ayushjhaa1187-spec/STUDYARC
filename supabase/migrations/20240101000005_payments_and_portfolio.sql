
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
