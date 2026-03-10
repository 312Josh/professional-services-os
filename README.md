# BluePipe Plumbing Ops App

Private plumbing operations app built with Next.js + Prisma + SQLite.

## Features
- Admin authentication (email/password + cookie session)
- CRM entities: leads, customers, jobs, invoices, notes/activity
- Lead statuses: `new`, `contacted`, `converted`, `disqualified`
- Lead conversion flow to customer records
- Invoice flow with customer/job references, line items, subtotal/tax/total, and status (`draft`, `sent`, `paid`)
- Placeholder payment link generation with architecture ready for Stripe integration
- Mock email workflow with templates for invoice, payment link, and reminders
- Activity log for admin actions and notes
- Seeded demo data and default admin login

## Stack
- Next.js (App Router)
- TypeScript
- Prisma ORM
- SQLite

## Exact Run Steps
1. `cd /tmp/plumbing-app-cJ5F5c`
2. `npm install`
3. `npm run db:push`
4. `npm run seed`
5. `npm run dev`
6. Open `http://localhost:3000`
7. Login with:
   - Email: `admin@plumbing.local`
   - Password: `admin123`

## Useful Commands
- `npm run dev` - start dev server
- `npm run build` - production build
- `npm run start` - run production server
- `npm run db:push` - sync Prisma schema to SQLite
- `npm run seed` - reset and seed demo data

## Project Path
`/tmp/plumbing-app-cJ5F5c`

## Notes
- Email sending is mock-only currently and logs to server console + activity feed.
- Payment links are placeholders. Replace with Stripe Checkout/Payment Links integration in `lib/actions.ts` when ready.
