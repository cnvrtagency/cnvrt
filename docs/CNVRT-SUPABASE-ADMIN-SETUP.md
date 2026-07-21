# CNVRT Supabase enquiry admin

Status: production connected and end-to-end tested as of 21 July 2026. This document began as the original enquiry-admin setup guide; use `../HANDOFF.md` for the complete current system.

## What is built

- The four public enquiry forms send to one Supabase Edge Function.
- The Edge Function validates the approved fields and option values before insert.
- Honeypot, minimum-duration, origin, payload-size, rate-limit and 90-second duplicate checks run server-side.
- Raw IP addresses are not stored. A salted one-way hash is used only for the short-lived rate-limit record.
- `/admin/` provides an invite-only commercial workspace with a daily attention queue, search, stage filters, qualification, opportunity value, next actions, due dates, internal notes, activity history, archiving and CSV export.
- Supabase Auth manages the administrator session.
- Row-level security allows only users in `public.admin_users` to read or change enquiry data.
- The anonymous browser role has no direct access to insert, read, update or delete the enquiry tables.

The site remains a static Astro build. This avoids changing the working marketing-site deployment. Public writes run in the Supabase Edge Function and admin data access is protected by Auth and row-level security.

## Environment contract

Copy `.env.example` to `.env.local` for local work and add:

```text
PUBLIC_SUPABASE_URL=https://PROJECT.supabase.co
PUBLIC_SUPABASE_ANON_KEY=PROJECT_PUBLISHABLE_KEY
```

These two values are designed for browser use. Access is controlled by row-level security, not by hiding the publishable key.

Never add either of the following server secrets to an Astro `PUBLIC_` variable:

```text
SUPABASE_SECRET_KEY=sb_secret_...
RATE_LIMIT_SALT=a-long-random-secret
```

## Create and connect the project

1. Create separate Supabase projects for staging and production if both environments will receive real enquiries.
2. Disable public user sign-ups in Supabase Auth. Administrator accounts must be created or invited deliberately.
3. Link the local folder to the correct Supabase project with the Supabase CLI.
4. Apply every migration in `supabase/migrations/` in filename order. The schema now extends beyond the original enquiry and commercial-workflow migrations to cover questionnaires, clients, onboarding, invoices, finance and documents.
5. Deploy `supabase/functions/submit-enquiry` with JWT verification disabled as defined in `supabase/config.toml`.
6. Set the function secrets `SUPABASE_SECRET_KEY`, `RATE_LIMIT_SALT` and `ALLOWED_ORIGINS` in Supabase. The production origin must be `https://cnvrtdigital.co.uk`.
7. Add the project URL and publishable key to the website deployment environment as `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY`.
8. Build the Astro site after adding the public variables. They are embedded at build time.

## Create the first administrator

Create the Auth user in the Supabase dashboard, then add that exact user to the allowlist from the SQL editor:

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'ADMIN_EMAIL_ADDRESS';
```

The user must exist in both `auth.users` and `public.admin_users`. A valid Auth login without the allowlist record cannot read enquiries because row-level security rejects the query.

Use a unique password and enable MFA before the admin handles live enquiry data.

## Production acceptance test

Do not treat the forms as live until all of these have passed:

1. Submit one valid homepage enquiry and confirm it reaches `public.enquiries`.
2. Submit one valid contact, project and audit enquiry.
3. Confirm invalid email, invalid URL and missing conditional fields return a visible error.
4. Confirm the honeypot receives a neutral success response without storing a record.
5. Confirm a repeated payload inside 90 seconds creates only one record.
6. Confirm the rate limit returns a controlled error after repeated submissions.
7. Sign into `/admin/`, open each enquiry, change its stage, fit, value and expected close date, then add an internal note.
8. Add an overdue next action and a due-today next action. Confirm both appear in the correct section of the Today queue.
9. Mark an action complete and confirm the next action clears while the completion remains in the activity history.
10. Confirm a normal authenticated user who is not in `admin_users` cannot read or change enquiries.
11. Confirm an anonymous request to the Supabase Data API cannot insert or select enquiries.
12. Test CSV export in a spreadsheet application and confirm multiline brief content and workflow fields remain intact.
13. Confirm the thank-you conversion event fires only after a successful Edge Function response.
14. Complete the notification-provider decision and test the final inbox alert separately. Database persistence must remain the source of truth if an alert fails.

## Deliberately deferred

- A full sales CRM with contacts, companies, deals and forecasting.
- Team assignment and multi-role permissions.
- File uploads.
- Email marketing automation.
- Analytics dashboards inside the admin.
- Content management.
- Permanent deletion from the admin interface.

These should be added only when the working enquiry workflow demonstrates a real operational need.
