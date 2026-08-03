import { supabaseAdmin } from '../config/supabase.js';
import { razorpay } from '../config/razorpay.js';
import { MentorService } from '../services/mentorService.js';
export const getMentors = async (req, res) => {
    try {
        const { skills } = req.query;
        if (skills) {
            const requestedSkills = skills.split(',');
            const matches = await MentorService.getMatches(requestedSkills);
            return res.json(matches);
        }
        const mentors = await MentorService.getVerifiedMentors();
        res.json(mentors);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch mentors', details: error.message });
    }
};
export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { mentorId, mentorServiceId, scheduledAt, durationMinutes, couponCode, expertId, slotTime } = req.body;
        // Backward compatibility mappings
        const mId = mentorId || expertId;
        const sAt = scheduledAt || slotTime;
        const dur = durationMinutes || 60;
        // Hardcoded discount logic for testing (as requested in rules)
        let amount = 1000; // Base ₹1000 per session
        if (couponCode === 'ayush1187')
            amount -= 100;
        const options = {
            amount: amount * 100, // paise
            currency: "INR",
            receipt: `booking_${Date.now()}`
        };
        const order = await razorpay.orders.create(options);
        // Create pending booking
        const { data: booking, error: bookingError } = await supabaseAdmin
            .from('mentor_bookings')
            .insert({
            learner_id: userId,
            mentor_id: mId,
            mentor_service_id: mentorServiceId || null, // Might be null if legacy frontend
            scheduled_at: sAt,
            duration_minutes: dur,
            status: 'pending_payment'
        })
            .select()
            .single();
        if (bookingError)
            throw bookingError;
        // Create payment intent record
        await supabaseAdmin
            .from('payments')
            .insert({
            user_id: userId,
            provider: 'razorpay',
            provider_order_id: order.id,
            type: 'mentor_booking',
            amount_inr: amount,
            currency: 'INR',
            status: 'created',
            metadata: { booking_id: booking.id }
        });
        res.json({ order, booking });
    }
    catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
};
