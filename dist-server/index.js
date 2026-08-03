import express from 'express';
import cors from 'cors';
import { env } from './config/env.js';
// Import Routers
import authRouter from './routes/auth.js';
import diagnosticsRouter from './routes/diagnostics.js';
import aiRouter from './routes/ai.js';
import mentorsRouter from './routes/mentors.js';
import portfolioRouter from './routes/portfolio.js';
import communityRouter from './routes/community.js';
import paymentsRouter from './routes/payments.js';
import adminRouter from './routes/admin.js';
import webhooksRouter from './routes/webhooks.js';
const app = express();
app.use(cors());
app.use(express.json({
    verify: (req, res, buf) => {
        req.rawBody = buf;
    }
}));
// Global Error Handler for JSON parsing
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).send({ error: 'Bad JSON' });
    }
    next();
});
// API Routes mounting
app.use('/api/me', authRouter); // Auth and profile
app.use('/api', diagnosticsRouter); // Diagnostics, Journeys, Tasks
app.use('/api/agents', aiRouter); // AI Agents
app.use('/api/mentors', mentorsRouter); // Mentors and Mentor bookings
app.use('/api/bookings', mentorsRouter); // Bookings map to mentors router
app.use('/api/portfolio', portfolioRouter); // Portfolio
app.use('/api/projects', portfolioRouter); // Projects map to portfolio router
app.use('/api/community', communityRouter); // Community threads and votes
app.use('/api/payments', paymentsRouter); // Payments
app.use('/api/admin', adminRouter); // Admin routes
app.use('/api/webhooks', webhooksRouter); // Webhooks
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
app.listen(env.PORT, () => {
    console.log(`Secure Backend API running on http://localhost:${env.PORT}`);
});
