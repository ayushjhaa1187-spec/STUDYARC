# SkillBridge Pro (StudyArc)

A comprehensive AI-powered learning and mentorship platform. This project includes a sophisticated TypeScript Express backend integrated with Supabase, Gemini AI, and Razorpay.

## Features

- **AI Diagnostics**: Evaluates user skills and recommends personalized learning journeys.
- **Sprint Management**: Daily task tracking with XP rewards and streak mechanics.
- **AI Coach**: Context-aware Gemini AI assistant to help learners.
- **Portfolio Pre-check**: Automated AI evaluation of submitted projects.
- **Expert Mentorship**: Book verified mentors for 1-on-1 sessions.
- **Secure Payments**: Razorpay integration with robust webhook verification.
- **Role-Based Access**: Learner, Mentor, and Admin roles secured by Supabase RLS.

## Architecture

- **Backend**: Express + TypeScript + Zod (Validation).
- **Database**: Supabase (PostgreSQL) with Row Level Security (RLS).
- **Edge Functions**: Supabase Edge Function for Razorpay Webhook fallback.
- **AI**: Google Gemini (1.5 Pro).
- **Payments**: Razorpay (Sandbox).

## Local Setup

1. **Clone & Install Dependencies**
   ```bash
   npm install
   ```
2. **Environment Variables**
   Copy `.env.example` to `.env` and fill in your Supabase, Gemini, and Razorpay credentials.

3. **Database Migrations**
   Execute the generated migration files inside `supabase/migrations/` in your Supabase SQL Editor in numerical order.

4. **Seed Data**
   Run the `006_seed_data.sql` to populate Journey Templates and Challenges.

5. **Run the Server**
   ```bash
   npm run dev
   ```
   This will run both the Vite frontend and the Node TS backend concurrently.

## Testing
We use Jest and Supertest for backend API verification.
```bash
npm run test
```

## Deployment (Cloud Run)
1. Build the TypeScript backend:
   ```bash
   npm run build:server
   ```
2. Create a Dockerfile for the Express server.
3. Deploy to Google Cloud Run and set environment variables.
