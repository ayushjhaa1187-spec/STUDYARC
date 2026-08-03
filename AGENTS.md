# Project Architecture and Security Guidelines

The following rules must be strictly adhered to during development:

- **Security & Credentials**: NEVER expose Gemini, Razorpay, Supabase service-role, or Google Cloud credentials to the frontend.
- **Data Access**: Use Supabase RLS (Row Level Security) for all user-owned data.
- **Validation**: Validate every API/Edge Function input with Zod.
- **Payments**: Verify Razorpay webhook signatures before processing any payment events.
- **Role-Based Access**: Implement role-based access control with the following roles: `learner`, `mentor`, `admin`.
- **Audit Logging**: Keep detailed audit logs for:
  - Agent decisions
  - Mentor verification
  - Portfolio verification
  - Payment actions
- **Communication Guidelines**: Do not promise jobs, salary, income, admission, or guaranteed outcomes in backend-generated copy.
