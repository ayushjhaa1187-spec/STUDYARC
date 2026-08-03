
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
