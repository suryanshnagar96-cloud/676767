# Xreech

Personal X scheduler and automation dashboard based on the uploaded Tweet-Hunter-style project.

## Included
- Next.js dashboard
- X OAuth 2.0 PKCE flow
- encrypted X token storage
- post/thread creation and publishing routes
- draft/scheduled post storage
- Prisma schema and adapter
- Supabase migration SQL
- Vercel cron configuration

## Environment
Set deployment secrets for your own X/Supabase/Vercel setup. Never commit X client secrets, Supabase service-role keys, encryption keys, or cron secrets.

## Important
The cleaned core application is uploaded under `xreech/`. The production Supabase adapter still needs to be wired to the SQL migration before relying on Supabase-backed persistence on Vercel.
