import { Router } from 'express';
import { getMe } from '../controllers/authController.js';
import { evaluateDiagnostic } from '../controllers/diagnosticController.js';
import { getActiveSprints, completeTask, markDayComplete } from '../controllers/sprintController.js';
import { chatWithCoach, globalChat, courseMatch } from '../controllers/coachController.js';
import { submitPortfolio } from '../controllers/portfolioController.js';
import { getMentors, createBooking } from '../controllers/bookingController.js';
import { handleWebhook, applyCoupon, createOrder } from '../controllers/paymentController.js';
import { getMetrics } from '../controllers/adminController.js';
import { processJobs } from '../controllers/jobController.js';
import { dailyCronJobs } from '../controllers/cronController.js';

import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import { 
  aiChatLimiter, 
  diagnosticLimiter, 
  bookingLimiter, 
  paymentLimiter 
} from '../middlewares/rateLimit.js';
import * as schemas from '../schemas/index.js';

const router = Router();

// Auth & Profiles
router.get('/users/me', requireAuth, getMe);

// AI Diagnostic & Journeys
router.post('/diagnostic/evaluate', requireAuth, diagnosticLimiter, validateRequest(schemas.DiagnosticEvaluationSchema), evaluateDiagnostic);
router.get('/sprints/active', requireAuth, getActiveSprints);
router.post('/sprints/:sprintId/tasks/:taskId/complete', requireAuth, validateRequest(schemas.TaskCompletionSchema), completeTask);
router.post('/sprints/daily-progress', requireAuth, markDayComplete);

// AI Coach & Portfolio
router.post('/coach/chat', requireAuth, aiChatLimiter, validateRequest(schemas.ChatMessageSchema), chatWithCoach);
router.post('/chat', aiChatLimiter, globalChat); // Global chatbot does not strictly require auth according to its usage but rate limiting is good
router.post('/course-match', aiChatLimiter, courseMatch);
router.post('/portfolio/submit', requireAuth, validateRequest(schemas.PortfolioSubmissionSchema), submitPortfolio);

// Mentorship & Payments
router.get('/mentors', requireAuth, getMentors);
router.post('/bookings/create', requireAuth, bookingLimiter, validateRequest(schemas.CreateBookingSchema), createBooking);
router.post('/payments/apply-coupon', paymentLimiter, applyCoupon);
router.post('/payments/create-order', paymentLimiter, createOrder);
router.post('/payments/webhook', paymentLimiter, handleWebhook); // Razorpay sends this, no requireAuth

// Internal / Admin Jobs
router.post('/cron/daily', dailyCronJobs);
router.post('/internal/jobs/process', processJobs);
router.get('/admin/metrics', requireAuth, requireRole('admin'), getMetrics);

export default router;
