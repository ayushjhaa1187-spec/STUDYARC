-- ==========================================
-- Mentor Booking and Payment Transactions
-- ==========================================

-- 1. Create a booking safely with row-level locking
CREATE OR REPLACE FUNCTION create_mentor_booking_tx(
    p_learner_id UUID,
    p_mentor_id UUID,
    p_service_id UUID,
    p_availability_id UUID,
    p_duration_minutes INTEGER
) 
RETURNS UUID 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_booking_id UUID;
    v_scheduled_at TIMESTAMPTZ;
BEGIN
    -- Lock the availability row
    SELECT start_time INTO v_scheduled_at
    FROM public.mentor_availability
    WHERE id = p_availability_id AND mentor_id = p_mentor_id AND is_booked = false
    FOR UPDATE;

    -- If no row found, the slot is already booked or doesn't exist
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Mentor availability slot is already booked or invalid';
    END IF;

    -- Mark slot as booked
    UPDATE public.mentor_availability
    SET is_booked = true
    WHERE id = p_availability_id;

    -- Create the booking record
    INSERT INTO public.mentor_bookings (
        learner_id, 
        mentor_id, 
        mentor_service_id, 
        scheduled_at, 
        duration_minutes, 
        status
    )
    VALUES (
        p_learner_id, 
        p_mentor_id, 
        p_service_id, 
        v_scheduled_at, 
        p_duration_minutes, 
        'pending_payment'
    )
    RETURNING id INTO v_booking_id;

    RETURN v_booking_id;
END;
$$;

-- 2. Process Razorpay webhook safely with idempotency
CREATE OR REPLACE FUNCTION process_payment_webhook_tx(
    p_razorpay_order_id TEXT,
    p_razorpay_payment_id TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_payment_id UUID;
    v_payment_status payment_status_enum;
    v_booking_id UUID;
    v_mentor_id UUID;
    v_amount_inr NUMERIC;
    v_platform_fee NUMERIC;
    v_payout_amount NUMERIC;
BEGIN
    -- Lock the payment row
    SELECT id, status, amount_inr INTO v_payment_id, v_payment_status, v_amount_inr
    FROM public.payments
    WHERE provider_order_id = p_razorpay_order_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment record not found for order_id: %', p_razorpay_order_id;
    END IF;

    -- Idempotency check: if already paid, do nothing
    IF v_payment_status = 'paid' THEN
        RETURN TRUE;
    END IF;

    -- Get associated booking details
    SELECT id, mentor_id INTO v_booking_id, v_mentor_id
    FROM public.mentor_bookings
    WHERE payment_id = p_razorpay_order_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Associated booking not found for order_id: %', p_razorpay_order_id;
    END IF;

    -- Update payment
    UPDATE public.payments
    SET status = 'paid', provider_payment_id = p_razorpay_payment_id
    WHERE id = v_payment_id;

    -- Update booking status
    UPDATE public.mentor_bookings
    SET status = 'confirmed'
    WHERE id = v_booking_id;

    -- Calculate payout (assuming 15% platform fee for example)
    v_platform_fee := v_amount_inr * 0.15;
    v_payout_amount := v_amount_inr - v_platform_fee;

    -- Create payout record
    INSERT INTO public.payouts (
        mentor_id, 
        booking_id, 
        gross_amount_inr, 
        platform_fee_inr, 
        payout_amount_inr, 
        status
    )
    VALUES (
        v_mentor_id, 
        v_booking_id, 
        v_amount_inr, 
        v_platform_fee, 
        v_payout_amount, 
        'pending'
    );

    RETURN TRUE;
END;
$$;

-- 3. Cleanup pending bookings that have expired (older than 15 mins)
CREATE OR REPLACE FUNCTION cleanup_pending_bookings()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_cancelled_count INTEGER := 0;
    v_booking RECORD;
BEGIN
    -- Find and lock expired pending bookings
    FOR v_booking IN 
        SELECT id, mentor_id, scheduled_at 
        FROM public.mentor_bookings
        WHERE status = 'pending_payment'
          AND created_at < NOW() - INTERVAL '15 minutes'
        FOR UPDATE SKIP LOCKED
    LOOP
        -- Update booking status to cancelled
        UPDATE public.mentor_bookings
        SET status = 'cancelled'
        WHERE id = v_booking.id;

        -- Free up the slot in availability
        UPDATE public.mentor_availability
        SET is_booked = false
        WHERE mentor_id = v_booking.mentor_id
          AND start_time = v_booking.scheduled_at;

        v_cancelled_count := v_cancelled_count + 1;
    END LOOP;

    RETURN v_cancelled_count;
END;
$$;
