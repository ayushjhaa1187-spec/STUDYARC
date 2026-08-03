-- Migration for Part 4: API & Background Job Design (Idempotency and Outbox Pattern)

-- 1. Create idempotency_keys table
CREATE TABLE IF NOT EXISTS public.idempotency_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL CHECK (status IN ('processing', 'completed', 'failed')),
    response_code INT,
    response_body JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for idempotency key lookup
CREATE INDEX IF NOT EXISTS idx_idempotency_keys_key ON public.idempotency_keys(key);

-- Trigger to update updated_at on idempotency_keys
CREATE OR REPLACE FUNCTION public.update_idempotency_keys_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_idempotency_keys_updated_at_trigger
    BEFORE UPDATE ON public.idempotency_keys
    FOR EACH ROW
    EXECUTE FUNCTION public.update_idempotency_keys_updated_at();


-- 2. Create outbox_events table
CREATE TABLE IF NOT EXISTS public.outbox_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL, -- e.g., 'sprint.generate', 'portfolio.verify'
    aggregate_type TEXT NOT NULL, -- e.g., 'user', 'project'
    aggregate_id UUID NOT NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'dead_letter')),
    attempts INT NOT NULL DEFAULT 0,
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    locked_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    error_message TEXT,
    idempotency_key TEXT UNIQUE, -- Ensure we don't enqueue the exact same event twice if needed
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Index for the worker to quickly find pending jobs that are ready to run
CREATE INDEX IF NOT EXISTS idx_outbox_events_pending ON public.outbox_events (scheduled_at) WHERE status = 'pending';

-- Trigger to update updated_at on outbox_events
CREATE OR REPLACE FUNCTION public.update_outbox_events_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_outbox_events_updated_at_trigger
    BEFORE UPDATE ON public.outbox_events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_outbox_events_updated_at();


-- 3. Row Level Security (RLS)
-- Enable RLS
ALTER TABLE public.idempotency_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox_events ENABLE ROW LEVEL SECURITY;

-- Idempotency and Outbox should ONLY be accessible by the service_role (Edge Functions / Backend)
-- Users should NEVER read or write directly to these tables from the frontend.

-- Drop existing policies if they exist (for idempotent reruns)
DROP POLICY IF EXISTS "Service role can manage idempotency_keys" ON public.idempotency_keys;
DROP POLICY IF EXISTS "Service role can manage outbox_events" ON public.outbox_events;

CREATE POLICY "Service role can manage idempotency_keys"
    ON public.idempotency_keys
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Service role can manage outbox_events"
    ON public.outbox_events
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- Revoke all access from authenticated and anon to ensure strict security
REVOKE ALL ON public.idempotency_keys FROM authenticated, anon;
REVOKE ALL ON public.outbox_events FROM authenticated, anon;
