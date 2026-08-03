# Part 6: Caching, Realtime, and Performance Architecture

This document outlines the caching, realtime synchronization, and performance optimization strategies for SkillBridge Pro. The goal is to provide a reliable, fast experience for the first 1,000 users while laying the groundwork to scale to 10,000+ users without introducing unnecessary operational complexity (like Redis) during the MVP phase.

## 1. Caching Strategy

The core philosophy for the MVP is **"Leverage existing infrastructure for caching."** We will use Vercel's caching mechanisms (Next.js Data Cache / ISR) for the frontend and PostgreSQL features for backend performance, avoiding the need for a separate Redis cluster initially.

### What to Cache (Cache Candidates)

These items have high read volumes and low update frequencies. We will utilize **Vercel Data Cache / Incremental Static Regeneration (ISR)** for these:

*   **Published Journeys & Challenge Templates:** Static content. Revalidate via webhook (`revalidateTag`) only when an admin or AI updates a template.
*   **Public Mentor Search Results:** Cache with a short TTL (e.g., 5-10 minutes) or update via background jobs.
*   **Mentor Profiles & Public Portfolio Pages:** Cached heavily. Invalidate using `revalidatePath('/mentor/[id]')` whenever the mentor updates their profile or when new verified reviews are added.
*   **Frequently Used Skill Taxonomy:** Cached globally on the Edge. Can be revalidated daily or weekly.
*   **Dashboard Aggregates (XP, Leaderboards):** Instead of calculating these on the fly or using Redis, use **PostgreSQL Materialized Views**. A Google Cloud Scheduler job will refresh this view periodically (e.g., every 5-15 minutes).

### What NOT to Cache (Bypass Cache / Direct DB Reads)

These items require absolute consistency or contain sensitive data. They will always fetch directly from the Supabase PostgreSQL database:

*   **Payment Status:** Always query the DB or Razorpay directly. Stale payment data can lead to service denial or financial discrepancies.
*   **Private User Data:** XP points (current), streaks, private notes, and diagnostic results. (Never share cache across users).
*   **Booking Slot Availability:** Active booking slot availability changes rapidly and requires transactional guarantees to prevent double-booking.
*   **AI Agent Context & Chat History:** Requires real-time accuracy for the Gemini AI Coach to provide relevant answers.

### Cache Invalidation Rules

*   **Event-Driven Invalidation:** When a database mutation occurs (via Edge Function or Supabase API), trigger a Next.js API route to call `revalidateTag` or `revalidatePath`.
*   **Time-Based Invalidation (TTL):** For data like public search results, use a simple `revalidate: 300` (5 minutes) in Next.js fetch requests.

---

## 2. Realtime Architecture (Supabase Realtime)

Realtime features are crucial for a dynamic user experience (especially for AI interactions and notifications), but over-subscribing can cause significant performance degradation and database load.

### Subscription Principles

1.  **Never subscribe to an entire table globally.**
2.  **Scope channels tightly** using row-level identifiers (e.g., `user_id`, `booking_id`).
3.  **Strict Lifecycle Management:** Always clean up subscriptions when a React component unmounts.

### Authorized Realtime Channels

*   **`user_notifications:[user_id]`**
    *   **Usage:** Payment confirmations, milestone achievements, mentor booking acceptances/declines.
    *   **Payload:** Lightweight JSON.
*   **`booking_status:[booking_id]`**
    *   **Usage:** Live state changes during a session (e.g., "Mentor Joined", "Session Started", "Completed").
*   **`ai_agent_thread:[thread_id]`**
    *   **Usage:** Streaming responses from the Gemini AI Coach. When the Edge Function generates tokens, they are pushed to this channel.
    *   **Note:** Alternatively, standard SSE (Server-Sent Events) can be used for AI streaming, using Supabase Realtime for database state changes.
*   **`task_updates:[sprint_id]`**
    *   **Usage:** When an AI agent autonomously generates new daily tasks, it broadcasts here so the user's dashboard updates without a refresh.
*   **`community_post:[post_id]`**
    *   **Usage:** Live updates for answers and upvotes on a specific Q&A thread the user is currently viewing.

### Implementation Checklist (Frontend)

```typescript
// Example: Strict cleanup on unmount
useEffect(() => {
  const channel = supabase
    .channel(`booking_status:${bookingId}`)
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'bookings', filter: `id=eq.${bookingId}` },
      (payload) => handleStatusChange(payload.new)
    )
    .subscribe();

  // CRITICAL: Cleanup to prevent memory leaks and connection exhaustion
  return () => {
    supabase.removeChannel(channel);
  };
}, [bookingId]);
```

---

## 3. Database & System Performance Optimization

To handle 100-10,000 users seamlessly on Supabase Postgres:

### Data Structures & Schema Design

*   **JSONB for Flexibility, Columns for Indexing:** Use `JSONB` for the AI-generated 30-day sprint data (since the schema of tasks might vary). However, extract critical fields (like `status`, `due_date`, `user_id`) into standard columns to allow for fast B-Tree indexing.
*   **Avoid Deep Joins for Feeds:** For the dashboard feed, use Database Functions (RPC) or Views to pre-join user data, rather than making multiple round-trips from the frontend.

### Indexing Strategy

Ensure `B-Tree` indexes are applied to:
*   Foreign keys (e.g., `user_id` on the `tasks` table).
*   Lookup fields (e.g., `slug` on `mentor_profiles`).
*   Filtering fields (e.g., `status`, `created_at` on `bookings` and `payments`).

### Connection Pooling

*   Use **Supavisor** (Supabase's connection pooler) for all server-side connections (e.g., from Google Cloud Run or Next.js API routes). Standard connections will quickly exhaust the Postgres limit if a traffic spike occurs.

### Observability

*   **Supabase Dashboard:** Monitor index hit rates and slow queries.
*   **Vercel Analytics:** Monitor frontend edge cache hit/miss ratios.
*   **Error Logging:** Route unhandled exceptions from Edge Functions/Cloud Run to a centralized logger (e.g., Google Cloud Logging or Sentry) to catch failing AI agent workflows or failed Razorpay webhooks early.
