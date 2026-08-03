# Backend Status Checklist

This checklist maps each frontend screen to its API and Data dependencies.

## 1. Landing & Auth
- [x] **Supabase Auth**: Frontend signs up / signs in user using `supabase.auth`.
- [x] **User Profile sync**: `GET /api/users/me` verified.

## 2. AI Diagnostic Screen
- [x] **API Endpoint**: `POST /api/diagnostic/evaluate`
- [x] **Data Dependency**: Inserts into `assessments` table.
- [x] **AI Agent**: Gemini structured output parser implemented and validated by Zod.

## 3. Sprint Dashboard
- [x] **API Endpoint**: `GET /api/sprints/active`
- [x] **Data Dependency**: Joins `sprints` and `tasks` table. RLS ensures user only sees their own data.
- [x] **Action**: `POST /api/sprints/:id/tasks/:taskId/complete` (awards XP).

## 4. AI Coach Chat
- [x] **API Endpoint**: `POST /api/coach/chat`
- [x] **Data Dependency**: Reads and writes to `chat_history`.
- [x] **AI Agent**: Gemini context-aware session maintained.

## 5. Portfolio Submission
- [x] **API Endpoint**: `POST /api/portfolio/submit`
- [x] **Data Dependency**: `portfolio_submissions` table.
- [x] **AI Agent**: Pre-check evaluation logic implemented for GitHub/Demo URLs.

## 6. Mentor Marketplace
- [x] **API Endpoint**: `GET /api/mentors`
- [x] **Data Dependency**: `mentors_profile` (only verified mentors).

## 7. Booking & Payments
- [x] **API Endpoint**: `POST /api/bookings/create` (Initializes Razorpay order, creates pending booking)
- [x] **Webhook**: `POST /api/payments/webhook` (Verifies signature, updates booking to 'scheduled').
- [x] **Security**: Webhook signature verification and RLS on `payments` table.

## 8. Admin Dashboard
- [x] **API Endpoint**: `GET /api/admin/metrics`
- [x] **Data Dependency**: Cross-checks `users`, `mentors_profile`, and `payments` tables. Needs 'admin' role bypass.
