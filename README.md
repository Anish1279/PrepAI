# PrepAI

PrepAI is a Next.js App Router application for AI-powered technical interview, coding round, and question-set practice.

## Stack

- Next.js App Router
- React 19
- Clerk authentication
- Drizzle ORM with Neon Postgres
- Gemini AI
- Zod validation

## Project Structure

```text
src
├── app              # App Router routes and thin API handlers
├── components       # Shared reusable UI
├── constants        # Shared constants and config
├── features         # Domain modules: auth, coding, interviews, questions
├── hooks            # Shared hooks
├── lib              # DB, API, AI, and external clients
├── services         # Cross-domain services
├── styles           # Global styles
├── types            # Shared types
└── utils            # Pure helpers
```

## Environment

Prefer server-only secrets. The old `NEXT_PUBLIC_*` names are still read as a compatibility fallback, but new environments should use:

```bash
DATABASE_URL=
GEMINI_API_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

## Commands

```bash
npm run dev
npm run lint
npm run build
npm run db:push
npm run db:studio
```

## Data Access Rule

UI components and API handlers do not call Drizzle directly. Database access lives in `src/features/*/services`, with API routes acting as validation/auth/controller boundaries.
