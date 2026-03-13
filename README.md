# BluePipe Plumbing Ops App

Private plumbing operations app built with Next.js + Prisma + SQLite.

## Features
- Admin authentication (email/password + cookie session)
- CRM entities: leads, customers, jobs, invoices, notes/activity
- Lead statuses: `new`, `contacted`, `converted`, `disqualified`
- Lead conversion flow to customer records
- Invoice flow with customer/job references, line items, subtotal/tax/total, and status (`draft`, `sent`, `paid`)
- Demo-safe payment options layer with configurable methods (`stripe`, `zelle`, `venmo`, `paypal`) and Stripe as primary by default
- Mock email workflow with templates for invoice, payment link, and reminders (graceful demo fallback behavior)
- Activity log for admin actions and notes
- Seeded demo data and default admin login

## Stack
- Next.js (App Router)
- TypeScript
- Prisma ORM
- SQLite

## Exact Run Steps
1. `cd /private/tmp/field-service-prod-1yWo3D/repo`
2. `cp .env.example .env`
3. `npm install`
4. `npm run db:push`
5. `npm run seed`
6. `npm run dev`
7. Open `http://localhost:3000`
8. Login with:
   - Email: `admin@plumbing.local`
   - Password: `admin123`

## Useful Commands
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run db:push` - sync Prisma schema to SQLite
- `npm run seed` - reset and seed demo data

## Environment
- `DATABASE_URL`: `file:./dev.db` (resolved relative to `prisma/schema.prisma`, so local DB file is `prisma/dev.db`)
- `SESSION_COOKIE_NAME`: cookie key for admin session token
- `SESSION_TTL_HOURS`: positive integer session lifetime in hours (invalid values fall back to `168`)
- `PAYMENT_METHODS`: comma-separated enabled demo methods (defaults to `stripe,zelle,venmo,paypal`)
- `PAYMENT_PRIMARY_METHOD`: preferred demo method when none is selected (defaults to `stripe`)

## Notes
- Email sending is mock-only and logs to server console + activity feed with demo notices.
- Payment-link generation is demo-safe and method-aware; destinations are realistic mocks and do not create real charges/transfers.
- Login supports safe internal `next` redirects (`/login?next=/invoices/...`) and rejects external redirect targets.
- Middleware sends unauthenticated requests for protected routes to `/login?next=...` so users return to their original page after login.

## Production Readiness Checklist
- Replace SQLite with managed Postgres/MySQL and run migrations through CI/CD.
- Replace mock email and placeholder payment links with real providers (Resend/SES + Stripe).
- Add CSRF protection for auth-sensitive form posts.
- Add automated tests for auth/session expiry, status transitions, and invoice totals.
- Add rate limiting + structured audit logging for login attempts.
