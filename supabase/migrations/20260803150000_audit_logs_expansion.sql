CREATE TABLE public.agent_decision_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assessment_id UUID REFERENCES public.assessments(id),
    user_id UUID REFERENCES public.users(id),
    action_type TEXT NOT NULL,
    input_payload JSONB NOT NULL,
    ai_output JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.agent_decision_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view agent decision logs" ON public.agent_decision_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );

CREATE TABLE public.payment_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID REFERENCES public.expert_bookings(id),
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    webhook_event_id TEXT,
    event_type TEXT NOT NULL,
    status TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.payment_audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view payment audit logs" ON public.payment_audit_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id = auth.uid() AND users.role = 'admin'
        )
    );
