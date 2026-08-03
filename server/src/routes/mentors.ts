import { Router } from 'express';
import { getMentors, createBooking } from '../controllers/bookingController.js';
import { requireAuth } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { bookingLimiter } from '../middlewares/rateLimit.js';
import * as schemas from '../schemas/index.js';

const router = Router();

// Mounted at /api/mentors and /api/bookings
router.get('/', requireAuth, getMentors);
router.post('/create', requireAuth, bookingLimiter, validateRequest(schemas.CreateBookingSchema), createBooking);

export default router;
