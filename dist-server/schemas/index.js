import { z } from 'zod';
import sanitizeHtml from 'sanitize-html';
const sanitizeText = (val) => sanitizeHtml(val, {
    allowedTags: [], // Strip all HTML
    allowedAttributes: {}
});
export const DiagnosticEvaluationSchema = z.object({
    targetRole: z.string().min(1, "Target role is required").transform(sanitizeText),
    weeklyHours: z.number().min(1).max(100),
    skills: z.array(z.string().transform(sanitizeText)).min(1, "At least one skill is required"),
    experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'])
});
export const TaskCompletionSchema = z.object({
    proofUrl: z.string().url("Must be a valid URL").optional()
});
export const ChatMessageSchema = z.object({
    message: z.string().min(1, "Message cannot be empty").transform(sanitizeText),
    sprintId: z.string().uuid("Invalid Sprint ID").optional()
});
export const PortfolioSubmissionSchema = z.object({
    sprintId: z.string().uuid("Invalid Sprint ID").optional(),
    title: z.string().min(1, "Title is required").transform(sanitizeText),
    githubUrl: z.string().regex(/^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+.*$/, "Must be a valid GitHub repository URL"),
    liveDemoUrl: z.string().url("Must be a valid URL").optional(),
    description: z.string().optional().transform(val => val ? sanitizeText(val) : val)
});
export const CreateBookingSchema = z.object({
    expertId: z.string().uuid("Invalid Expert ID"),
    slotTime: z.string().datetime("Must be a valid ISO datetime string"),
    couponCode: z.string().optional().transform(val => val ? sanitizeText(val) : val)
});
