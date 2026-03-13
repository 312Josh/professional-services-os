# Field Service Ops App

Private field-service operations app built with Next.js + Prisma + SQLite.

## Features
- Admin authentication (email/password + cookie session)
- CRM entities: leads, customers, jobs, invoices, notes/activity
- Owner-first dashboard that shows attention now, money at risk, unpaid totals, bookings, and next actions
- Lead pipeline visibility for new/unworked/response-late/stale/follow-up-needed states with revenue-slip estimates
- In-product lead urgency surfaces (pulse alerts, first-touch clock, and one-click priority actions) before external notification channels
- Conversion-oriented intake flow with configurable framing/copy, contactability guardrails, and captured intake details
- White-label seams for brand colors, key copy, lead-alert thresholds, trust-layer mode, and proof points
- Demo-safe payment options layer with configurable methods (`stripe`, `zelle`, `venmo`, `paypal`) and Stripe as primary by default
- Mock email workflow with templates for invoice, payment link, and reminders (graceful demo fallback behavior)
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
   - Email: `owner@fieldops.local` (or `DEMO_ADMIN_EMAIL`)
   - Password: `admin123` (or `DEMO_ADMIN_PASSWORD`)

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
- `PAYMENT_METHODS_DEFAULT`: fallback enabled methods used when `PAYMENT_METHODS` is unset
- `PAYMENT_PRIMARY_METHOD_DEFAULT`: fallback primary method used when `PAYMENT_PRIMARY_METHOD` is unset
- `BUSINESS_NAME`, `APP_TITLE`, `APP_SHORT_TITLE`, `APP_DESCRIPTION`: white-label brand identity strings
- `BRAND_ACCENT_COLOR`, `BRAND_ACCENT_COLOR_MUTED`, `BRAND_SUCCESS_COLOR`, `BRAND_DANGER_COLOR`, `BRAND_SURFACE_TINT_COLOR`: white-label color and reskin seams
- `LOGIN_SUBTITLE`, `DASHBOARD_TITLE`, `DASHBOARD_SUBTITLE`, `DASHBOARD_LEAD_ALERT_TITLE`, `DASHBOARD_LEAD_ALERT_SUBTITLE`, `DASHBOARD_FIRST_TOUCH_TITLE`, `DASHBOARD_FIRST_TOUCH_SUBTITLE`: owner-facing dashboard copy seams
- `LEADS_TITLE`, `LEADS_SUBTITLE`, `LEADS_ALERT_TITLE`, `LEAD_PRIORITY_QUEUE_TITLE`, `LEAD_PRIORITY_QUEUE_SUBTITLE`, `LEAD_INTAKE_TITLE`, `LEAD_INTAKE_SUBTITLE`, `LEAD_INTAKE_CONTACT_REQUIREMENT`, `LEAD_INTAKE_CTA`, `LEAD_DEFAULT_SOURCE`, `LEAD_INTAKE_PROMISE_LINE`: lead queue/intake copy seams
- `TRUST_LAYER_TITLE`, `TRUST_LAYER_MINIMAL_SUMMARY`, `TRUST_LAYER_DEFERRED_SUMMARY`, `TRUST_LAYER_BUILD_DECISION_SUMMARY`, `TRUST_LAYER_DEFER_DECISION_SUMMARY`: trust-layer copy seams
- `NEW_LEAD_ALERT_MINUTES`, `STALE_LEAD_HOURS`, `FOLLOW_UP_LEAD_HOURS`, `DEFAULT_LEAD_VALUE_CENTS`: lead urgency + revenue-slip tuning
- `TRUST_LAYER_MODE` (`minimal` or `defer`), `TRUST_LAYER_MIN_PROOF_POINTS`, and `TRUST_LAYER_PROOF_POINTS` (CSV): trust/authority decision and messaging
- `ACTIVITY_SUBTITLE`: activity screen copy seam
- `INVOICE_PAYMENT_MODE_LABEL`, `INVOICE_ACTIONS_SUBTITLE`, `EMAIL_REPLY_PROMPT`, `DEMO_EMAIL_FOOTER`: white-label invoice/email/demo copy seams
- `DEMO_ADMIN_EMAIL`, `DEMO_ADMIN_PASSWORD`: seeded admin credentials + login form defaults
- `DEMO_PAYMENT_ZELLE_RECIPIENT`, `DEMO_PAYMENT_VENMO_HANDLE`, `DEMO_PAYMENT_PAYPAL_HANDLE`, `DEMO_PAYMENT_FALLBACK_BASE_URL`: payment destination defaults for demo link generation

## Notes
- Email sending is mock-only and logs to server console + activity feed with demo notices.
- Payment-link generation is demo-safe and method-aware; destinations are realistic mocks and do not create real charges/transfers.
- Login supports safe internal `next` redirects (`/login?next=/invoices/...`) and rejects external redirect targets.
- Middleware sends unauthenticated requests for protected routes to `/login?next=...` so users return to their original page after login.
- Trust layer currently ships in a minimal build-now mode by default (`TRUST_LAYER_MODE=minimal`).
- Lead intake requires at least one contact method (`phone` or `email`) and a service request so every new lead is workable.

## Production Readiness Checklist
- Replace SQLite with managed Postgres/MySQL and run migrations through CI/CD.
- Replace mock email and placeholder payment links with real providers (Resend/SES + Stripe).
- Add CSRF protection for auth-sensitive form posts.
- Add automated tests for auth/session expiry, status transitions, and invoice totals.
- Add rate limiting + structured audit logging for login attempts.
