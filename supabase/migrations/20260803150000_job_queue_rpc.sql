-- 20260803150000_job_queue_rpc.sql

CREATE OR REPLACE FUNCTION public.claim_pending_jobs(p_limit int)
RETURNS TABLE (
    id UUID,
    type public.event_type,
    payload JSONB,
    attempts INT
) AS $$
DECLARE
    claimed_ids UUID[];
BEGIN
    -- Select and lock pending jobs using SKIP LOCKED to prevent race conditions
    SELECT ARRAY(
        SELECT q.id FROM public.job_queue q
        WHERE q.status = 'pending'
        ORDER BY q.created_at ASC
        LIMIT p_limit
        FOR UPDATE SKIP LOCKED
    ) INTO claimed_ids;

    IF cardinality(claimed_ids) = 0 THEN
        RETURN;
    END IF;

    -- Update status to processing and increment attempts
    UPDATE public.job_queue
    SET status = 'processing',
        locked_at = NOW(),
        attempts = attempts + 1
    WHERE public.job_queue.id = any(claimed_ids);

    -- Return the claimed rows
    RETURN QUERY
    SELECT q.id, q.type, q.payload, q.attempts
    FROM public.job_queue q
    WHERE q.id = any(claimed_ids);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
