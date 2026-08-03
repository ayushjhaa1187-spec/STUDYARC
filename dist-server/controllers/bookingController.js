import { supabaseAdmin } from '../config/supabase.js';
import { razorpay } from '../config/razorpay.js';
export const getMentors = async (req, res) => {
    try {
        const { data: mentors, error } = await supabaseAdmin
            .from('mentors_profile')
            .select('*, users(full_name, avatar_url)')
            .eq('verification_status', 'verified');
        if (error)
            throw error;
        res.json(mentors);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch mentors', details: error.message });
    }
};
export const createBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { expertId, slotTime, couponCode } = req.body;
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
            .from('expert_bookings')
            .insert({
            user_id: userId,
            expert_id: expertId,
            slot_time: slotTime,
            amount_paid: amount,
            payment_order_id: order.id,
            payment_status: 'pending'
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
            razorpay_order_id: order.id,
            amount: amount,
            booking_id: booking.id
        });
        res.json({ order, booking });
    }
    catch (error) {
        console.error('Booking Error:', error);
        res.status(500).json({ error: 'Failed to create booking', details: error.message });
    }
};
