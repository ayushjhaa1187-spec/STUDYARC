import express from 'express';
import { z } from 'zod';
import { requireAuth, validateBody } from '../middleware/auth.js';

const router = express.Router();

const updateProfileSchema = z.object({
  fullName: z.string().optional(),
  bio: z.string().optional(),
  avatarUrl: z.string().url().optional()
});

const updatePreferencesSchema = z.object({
  emailNotifications: z.boolean().optional(),
  theme: z.enum(['light', 'dark', 'system']).optional()
});

router.get('/me', requireAuth, (req, res) => {
  // Mock fetching user from Supabase
  res.json({ user: req.user });
});

router.patch('/me/profile', requireAuth, validateBody(updateProfileSchema), (req, res) => {
  // Update user profile in Supabase (public.users)
  res.json({ message: 'Profile updated successfully', data: req.body });
});

router.patch('/me/preferences', requireAuth, validateBody(updatePreferencesSchema), (req, res) => {
  // Update preferences in user metadata
  res.json({ message: 'Preferences updated successfully', data: req.body });
});

router.get('/me/dashboard', requireAuth, (req, res) => {
  // Aggregate user dashboard stats (active sprints, etc)
  res.json({ 
    stats: { sprintsCompleted: 2, currentStreak: 5 },
    recentActivity: []
  });
});

export default router;
