import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.js';
import { supabaseAdmin } from '../config/supabase.js';
import { razorpay } from '../config/razorpay.js';
import { MentorService } from '../services/mentorService.js';

export const getMentors = async (req: AuthRequest, res: Response) => {
  try {
    const { skills } = req.query;
    
    if (skills) {
      const requestedSkills = (skills as string).split(',');
      const matches = await MentorService.getMatches(requestedSkills);
      return res.json(matches);
    }
    
    const mentors = await MentorService.getVerifiedMentors();
    res.json(mentors);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to fetch mentors', details: error.message });
  }
};

export const createBooking = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const { expertId, slotTime, couponCode } = req.body;

    // Hardcoded discount logic for testing (as requested in rules)
    let amount = 1000; // Base ₹1000 per session
    if (couponCode === 'ayush1187') amount -= 100;

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

    if (bookingError) throw bookingError;

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
  } catch (error: any) {
    console.error('Booking Error:', error);
    res.status(500).json({ error: 'Failed to create booking', details: error.message });
  }
};
