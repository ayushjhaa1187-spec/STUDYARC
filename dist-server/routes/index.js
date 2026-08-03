import { Router } from 'express';
import { getMe } from '../controllers/authController.js';
import { evaluateDiagnostic } from '../controllers/diagnosticController.js';
import { getActiveSprints, completeTask } from '../controllers/sprintController.js';
import { chatWithCoach } from '../controllers/coachController.js';
import { submitPortfolio } from '../controllers/portfolioController.js';
import { getMentors, createBooking } from '../controllers/bookingController.js';
import { handleWebhook } from '../controllers/paymentController.js';
import { getMetrics } from '../controllers/adminController.js';
import { requireAuth, requireRole } from '../middlewares/auth.js';
import { validateRequest } from '../middlewares/validate.js';
import * as schemas from '../schemas/index.js';
const router = Router();
// Auth & Profiles
router.get('/users/me', requireAuth, getMe);
// AI Diagnostic & Journeys
router.post('/diagnostic/evaluate', requireAuth, validateRequest(schemas.DiagnosticEvaluationSchema), evaluateDiagnostic);
router.get('/sprints/active', requireAuth, getActiveSprints);
router.post('/sprints/:sprintId/tasks/:taskId/complete', requireAuth, validateRequest(schemas.TaskCompletionSchema), completeTask);
// AI Coach & Portfolio
router.post('/coach/chat', requireAuth, validateRequest(schemas.ChatMessageSchema), chatWithCoach);
router.post('/portfolio/submit', requireAuth, validateRequest(schemas.PortfolioSubmissionSchema), submitPortfolio);
// Mentorship & Payments
router.get('/mentors', requireAuth, getMentors);
router.post('/bookings/create', requireAuth, validateRequest(schemas.CreateBookingSchema), createBooking);
router.post('/payments/webhook', handleWebhook); // Razorpay sends this, no requireAuth
// Admin
router.get('/admin/metrics', requireAuth, requireRole('admin'), getMetrics);
export default router;
