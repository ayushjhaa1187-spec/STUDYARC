import rateLimit from 'express-rate-limit';
// Utility to create a rate limiter
const createLimiter = (windowMs, max, message) => {
    return rateLimit({
        windowMs,
        max,
        message: { error: message },
        standardHeaders: true,
        legacyHeaders: false,
    });
};
// 5 requests per 15 minutes
export const loginLimiter = createLimiter(15 * 60 * 1000, 5, 'Too many login attempts. Please try again after 15 minutes.');
// 20 requests per hour
export const aiChatLimiter = createLimiter(60 * 60 * 1000, 20, 'AI Chat rate limit exceeded. Please try again later.');
// 5 requests per day
export const diagnosticLimiter = createLimiter(24 * 60 * 60 * 1000, 5, 'Daily diagnostic limit reached. Please try again tomorrow.');
// 10 requests per day
export const bookingLimiter = createLimiter(24 * 60 * 60 * 1000, 10, 'Booking limit reached for today.');
// 30 requests per hour
export const communityLimiter = createLimiter(60 * 60 * 1000, 30, 'Too many posts. Please slow down.');
// 10 requests per day
export const paymentLimiter = createLimiter(24 * 60 * 60 * 1000, 10, 'Payment attempts limit reached.');
