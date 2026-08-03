import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody, requireRole } from '../middleware/auth.js';
import { auditLog } from '../middleware/audit.js';

const router = express.Router();

const mentorApplySchema = z.object({
  expertise: z.array(z.string()),
  bio: z.string(),
  linkedinUrl: z.string().url()
});

const availabilitySchema = z.object({
  slots: z.array(z.object({
    startTime: z.string().datetime(),
    endTime: z.string().datetime()
  }))
});

const bookingSchema = z.object({
  mentorId: z.string(),
  slotTime: z.string().datetime()
});

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().optional()
});

router.get('/', (req, res) => {
  res.json({ mentors: [] });
});

router.get('/:id', (req, res) => {
  res.json({ mentor: { id: req.params.id } });
});

router.post('/apply', requireAuth, validateBody(mentorApplySchema), auditLog('mentor_apply'), (req, res) => {
  res.json({ message: "Application submitted for review" });
});

router.patch('/me', requireAuth, requireRole(['mentor']), validateBody(z.object({ bio: z.string() })), (req, res) => {
  res.json({ message: "Mentor profile updated" });
});

router.post('/availability', requireAuth, requireRole(['mentor']), validateBody(availabilitySchema), (req, res) => {
  res.json({ message: "Availability updated" });
});

router.get('/:id/availability', (req, res) => {
  res.json({ slots: [] });
});

// Bookings
router.post('/bookings/create', requireAuth, validateBody(bookingSchema), auditLog('create_booking'), (req, res) => {
  res.json({ message: "Booking created", bookingId: "b-123" });
});

router.patch('/bookings/:id/cancel', requireAuth, auditLog('cancel_booking'), (req, res) => {
  res.json({ message: "Booking cancelled" });
});

router.patch('/bookings/:id/complete', requireAuth, requireRole(['mentor']), auditLog('complete_booking'), (req, res) => {
  res.json({ message: "Booking completed" });
});

router.post('/bookings/:id/review', requireAuth, validateBody(reviewSchema), (req, res) => {
  res.json({ message: "Review submitted" });
});

export default router;
