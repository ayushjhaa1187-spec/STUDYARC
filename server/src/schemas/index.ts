import { z } from 'zod';

export const DiagnosticEvaluationSchema = z.object({
  targetRole: z.string().min(1, "Target role is required"),
  weeklyHours: z.number().min(1).max(100),
  skills: z.array(z.string()).min(1, "At least one skill is required"),
  experienceLevel: z.enum(['beginner', 'intermediate', 'advanced'])
});

export const TaskCompletionSchema = z.object({
  proofUrl: z.string().url("Must be a valid URL").optional()
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, "Message cannot be empty"),
  sprintId: z.string().uuid("Invalid Sprint ID").optional()
});

export const PortfolioSubmissionSchema = z.object({
  sprintId: z.string().uuid("Invalid Sprint ID").optional(),
  title: z.string().min(1, "Title is required"),
  githubUrl: z.string().url("Must be a valid GitHub URL"),
  liveDemoUrl: z.string().url("Must be a valid URL").optional(),
  description: z.string().optional()
});

export const CreateBookingSchema = z.object({
  expertId: z.string().uuid("Invalid Expert ID"),
  slotTime: z.string().datetime("Must be a valid ISO datetime string"),
  couponCode: z.string().optional()
});
