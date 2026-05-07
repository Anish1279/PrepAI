<div align="center">

<img src="https://your-domain.com/public/prepai-banner.png" alt="PrepAI Banner" width="100%" />

<br />

<a href="https://your-prepai-url.com">
  <img src="https://your-domain.com/public/logo-badge.svg" alt="PrepAI Logo" width="90" height="90" />
</a>

# PrepAI

### The AI-Native Interview Command Center

**Mock interviews. Coding rounds. Question banks. Feedback loops.**
All in one ruthlessly focused, dark-mode workspace.

<br />

[![Next.js](https://img.shields.io/badge/Next.js_15-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Drizzle](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![Neon](https://img.shields.io/badge/Neon_Postgres-00E699?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech)
[![Google Gemini](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://deepmind.google/technologies/gemini/)

<br />

[![License: MIT](https://img.shields.io/badge/License-MIT-cyan.svg?style=flat-square)](./LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](./CONTRIBUTING.md)
[![Stars](https://img.shields.io/github/stars/yourusername/prepai?style=flat-square&color=yellow)](https://github.com/yourusername/prepai/stargazers)
[![Issues](https://img.shields.io/github/issues/yourusername/prepai?style=flat-square&color=red)](https://github.com/yourusername/prepai/issues)

<br />

[**🚀 Live Demo**](https://your-prepai-url.com) · [**📖 Documentation**](https://your-prepai-url.com/docs) · [**🐛 Report Bug**](https://github.com/yourusername/prepai/issues/new?template=bug_report.md) · [**💡 Request Feature**](https://github.com/yourusername/prepai/issues/new?template=feature_request.md)

</div>

---

<br />

## 📸 Screenshots

<div align="center">

| Landing Page | Dashboard |
|:---:|:---:|
| <img src="https://your-domain.com/public/screenshot-landing.png" alt="Landing Page" width="480" /> | <img src="https://your-domain.com/public/screenshot-dashboard.png" alt="Dashboard" width="480" /> |

| Technical Interview | Coding Round |
|:---:|:---:|
| <img src="https://your-domain.com/public/screenshot-interview.png" alt="Technical Interview" width="480" /> | <img src="https://your-domain.com/public/screenshot-coding.png" alt="Coding Round" width="480" /> |

| Feedback Review | Question Bank |
|:---:|:---:|
| <img src="https://your-domain.com/public/screenshot-feedback.png" alt="Feedback" width="480" /> | <img src="https://your-domain.com/public/screenshot-questions.png" alt="Question Bank" width="480" /> |

</div>

---

<br />

## 🧠 What is PrepAI?

PrepAI is a **premium, full-stack AI interview preparation platform** built on the Next.js 15 App Router. It transforms chaotic interview prep into a tight, repeatable loop — generate role-specific questions, practice under real pressure, and review precise AI feedback. No bloat. No distractions. Just signal.

> **PrepAI turns nervous practice into repeatable interview rhythm.**

Unlike generic quiz tools, PrepAI simulates the real interview experience end-to-end:

- 🎙️ **Voice-first technical rounds** — record answers, auto-transcribe via Gemini, get structured feedback per question
- 💻 **Timed coding assessments** — Monaco editor with hints, countdown timer, and AI-powered code review
- 📚 **Targeted question banks** — company, stack, and seniority-aware generation with reference answers
- 🔒 **Enterprise-grade auth** — JWT + rotating refresh tokens, CSRF protection, account lockout, and session management

---

<br />

## ✨ Feature Highlights

<table>
  <tr>
    <td width="50%">
      <h3>🧪 Technical Mock Interviews</h3>
      <ul>
        <li>AI generates 5 adaptive questions per session</li>
        <li>Voice recording → Gemini transcription pipeline</li>
        <li>Per-question AI feedback with correctness rating (1–10)</li>
        <li>Webcam toggle for realistic practice atmosphere</li>
        <li>Session history with full feedback review</li>
      </ul>
    </td>
    <td width="50%">
      <h3>⚡ Timed Coding Rounds</h3>
      <ul>
        <li>Monaco editor with syntax highlighting & themes</li>
        <li>20-minute countdown with auto-submit on timeout</li>
        <li>Difficulty-calibrated problems (Easy / Medium / Hard)</li>
        <li>Contextual hints without spoiling the solution</li>
        <li>AI reviews: correctness, approach, efficiency, code quality, and optimization</li>
      </ul>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <h3>📖 Smart Question Banks</h3>
      <ul>
        <li>Company + stack + experience-aware generation</li>
        <li>Question type control (LeetCode, domain, system design)</li>
        <li>Expandable answer accordion with reference responses</li>
        <li>Save and revisit unlimited question sets</li>
      </ul>
    </td>
    <td width="50%">
      <h3>🔐 First-Party Auth System</h3>
      <ul>
        <li>JWT access tokens (15 min) + rotating refresh tokens (30 days)</li>
        <li>Refresh token replay detection & family revocation</li>
        <li>bcrypt password hashing (cost factor 12)</li>
        <li>Account lockout after 5 failed attempts</li>
        <li>CSRF double-submit cookie protection</li>
        <li>Rate limiting with Redis REST or in-memory fallback</li>
      </ul>
    </td>
  </tr>
</table>

---

<br />

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Client (Browser)                       │
│   Next.js App Router · React 19 · Tailwind CSS 4 · Motion   │
└────────────────────────┬────────────────────────────────────┘
                         │  HTTP / Server Actions
┌────────────────────────▼────────────────────────────────────┐
│                     Edge Middleware                           │
│   JWT verification · CSRF guard · Route protection · RBAC    │
└────────────────────────┬────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────┐
│                    Next.js API Routes                         │
│   Auth · Interviews · Coding · Questions · AI Transcription  │
│          Zod validation · AppError normalization             │
└───────────┬─────────────────────────────┬────────────────────┘
            │                             │
┌───────────▼──────────┐    ┌────────────▼────────────────────┐
│     Drizzle ORM       │    │       Google Gemini AI          │
│   Neon Postgres       │    │  gemini-2.5-flash / flash-lite  │
│                       │    │  Text generation · Transcription │
│  Users · Sessions     │    │  Model fallback · Retry logic   │
│  Refresh Tokens       │    └────────────────────────────────-┘
│  Interviews · Q&A     │
│  Coding · Feedback    │
└──────────────────────-┘
```

---

<br />

## 📁 Project Structure

```
prepai/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   ├── sign-in/              # Sign-in page
│   │   │   ├── sign-up/              # Sign-up page
│   │   │   ├── forgot-password/      # Forgot password page
│   │   │   └── reset-password/       # Reset password page
│   │   ├── api/
│   │   │   ├── auth/                 # Auth route handlers
│   │   │   │   ├── login/route.js    # POST — login + set cookies
│   │   │   │   ├── signup/route.js   # POST — create account
│   │   │   │   ├── logout/route.js   # POST — CSRF-protected logout
│   │   │   │   ├── refresh/route.js  # POST|GET — rotate tokens
│   │   │   │   ├── me/route.js       # GET — current user
│   │   │   │   ├── forgot-password/  # POST — request reset
│   │   │   │   ├── reset-password/   # POST — apply reset
│   │   │   │   └── verify-email/     # POST — verify email token
│   │   │   ├── interviews/
│   │   │   │   ├── technical/        # Technical interview CRUD + answers + feedback
│   │   │   │   └── coding/           # Coding interview CRUD + submissions + feedback
│   │   │   ├── questions/            # Question set CRUD
│   │   │   └── ai/transcribe/        # POST — audio → transcription
│   │   └── dashboard/                # Protected dashboard pages
│   │       ├── page.jsx              # Main dashboard
│   │       ├── layout.jsx            # Dashboard shell with webcam context
│   │       ├── interview/[id]/
│   │       │   ├── technicalround/   # Technical interview flow
│   │       │   └── codingRound/      # Coding assessment flow
│   │       ├── questions/            # Question bank page
│   │       ├── pyq/[pyqId]/          # Question set detail
│   │       ├── upgrade/              # Pricing / upgrade
│   │       └── howit/                # How it works
│   │
│   ├── components/                   # Shared UI components
│   │   ├── ui/                       # shadcn/ui primitives (Button, Input, Dialog…)
│   │   ├── Header.jsx                # App navigation
│   │   ├── Card3D.jsx                # Landing 3D card
│   │   └── Loader.jsx / Loader3D.jsx # Loading states
│   │
│   ├── features/                     # Domain feature modules
│   │   ├── auth/
│   │   │   ├── components/           # AuthShell, SignInForm, SignUpForm, UserMenu…
│   │   │   ├── lib/                  # tokens.js, cookies.js, password.js, rate-limit.js
│   │   │   ├── services/             # auth-service.js, session-service.js
│   │   │   └── validators/           # auth-schemas.js (Zod)
│   │   ├── interviews/
│   │   │   ├── components/           # AddNewInterview, InterviewList, RecordAnswerSection…
│   │   │   ├── context/              # webcam-context.jsx
│   │   │   ├── services/             # technical-interview-service.js
│   │   │   └── utils/                # validation.js, feedback.js
│   │   ├── coding/
│   │   │   ├── components/           # CodeEditor, Timer, CodingAssessmentClient…
│   │   │   ├── services/             # coding-interview-service.js
│   │   │   └── utils/                # validation.js
│   │   └── questions/
│   │       ├── components/           # AddQuestions, QuestionList, QuestionItemCard…
│   │       ├── services/             # question-service.js
│   │       └── utils/                # validation.js
│   │
│   ├── lib/
│   │   ├── ai/gemini.js              # Gemini client, model fallback, timeout wrapper
│   │   ├── api/
│   │   │   ├── client.js             # Fetch wrapper with auto-refresh
│   │   │   └── responses.js          # ok(), fail(), created(), parseJson()
│   │   ├── db/
│   │   │   ├── client.js             # Drizzle + Neon singleton
│   │   │   └── schema.js             # All table definitions
│   │   ├── errors.js                 # AppError, notFoundError, unauthorizedError…
│   │   └── utils.js                  # cn() (clsx + tailwind-merge)
│   │
│   ├── constants/                    # interviews.js, pricing-plan.js
│   ├── hooks/                        # Shared React hooks
│   ├── middleware.js                 # Edge: JWT verify, CSRF, RBAC, refresh redirect
│   ├── styles/globals.css            # Tailwind 4 + custom design system
│   └── utils/                        # date.js, json.js
│
├── drizzle/                          # Generated migration files
├── drizzle.config.js
├── next.config.mjs
├── package.json
└── README.md
```

---

<br />

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | SSR, RSC, API routes, middleware |
| **UI Library** | React 19 | Client interactivity |
| **Styling** | Tailwind CSS 4 + tw-animate-css | Utility-first dark design system |
| **Component Library** | shadcn/ui (Radix UI primitives) | Accessible UI components |
| **Animation** | Framer Motion / Motion | Page transitions & micro-interactions |
| **Database** | Neon Postgres (serverless) | Primary data store |
| **ORM** | Drizzle ORM | Type-safe SQL queries |
| **AI** | Google Gemini 2.5 Flash | Question gen, feedback, transcription |
| **Auth** | Custom JWT (jose) + bcryptjs | First-party secure auth |
| **Code Editor** | Monaco Editor | In-browser coding environment |
| **Syntax Highlight** | highlight.js | Code feedback display |
| **Forms** | React Hook Form + Zod | Validation + type inference |
| **Notifications** | Sonner | Toast notifications |
| **Rate Limiting** | In-memory / Upstash Redis REST | Brute-force protection |

---

<br />

## 🔐 Authentication Architecture

PrepAI implements a **production-grade, first-party auth system** — no third-party auth provider dependency.

```
┌──────────────────────────────────────────────────────────────┐
│                     Token Lifecycle                           │
│                                                               │
│  Login/Signup                                                 │
│      │                                                        │
│      ▼                                                        │
│  ┌──────────────┐    ┌─────────────────────────────────┐     │
│  │ Access Token  │    │       Refresh Token              │     │
│  │  (15 min JWT) │    │  (30 day JWT — httpOnly cookie) │     │
│  │  httpOnly     │    │  path: /api/auth                │     │
│  │  SameSite=Lax │    │  SHA-256 hash stored in DB      │     │
│  └──────────────┘    └─────────────────────────────────┘     │
│                                                               │
│  On Expiry → POST /api/auth/refresh                          │
│      • Verifies JWT signature                                 │
│      • Matches stored SHA-256 hash                           │
│      • Detects replay: revokes entire token family            │
│      • Issues new access + refresh tokens (rotation)         │
│                                                               │
│  On Logout → POST /api/auth/logout (CSRF-protected)          │
│      • Revokes session + all associated refresh tokens       │
└──────────────────────────────────────────────────────────────┘
```

**Security properties implemented:**

- ✅ Bcrypt password hashing (cost factor 12)
- ✅ Generic login error messages (no email enumeration)
- ✅ Account lockout after 5 failed login attempts (15-min window)
- ✅ Access/refresh secret separation
- ✅ Refresh token rotation with replay detection
- ✅ Token family revocation on suspicious reuse
- ✅ HTTP-only cookies (XSS-resistant token storage)
- ✅ SameSite=Lax CSRF mitigation
- ✅ Double-submit CSRF cookie on unsafe actions (logout)
- ✅ Same-origin enforcement on all mutation routes
- ✅ Rate limiting on login, signup, refresh, password reset
- ✅ Session revocation on password reset

---

<br />

## 🤖 AI Integration

PrepAI uses the **Google Gemini API** with a resilient, production-grade client:

```
                    ┌─────────────────────┐
                    │   generateText()     │
                    │   transcribeAudio()  │
                    └─────────┬───────────┘
                              │
              ┌───────────────▼────────────────┐
              │       runWithModelFallback()     │
              │                                  │
              │  1. gemini-2.5-flash             │
              │     ├── attempt 1               │
              │     └── attempt 2 (if 429/5xx)  │
              │                                  │
              │  2. gemini-2.5-flash-lite        │
              │     ├── attempt 1               │
              │     └── attempt 2               │
              └───────────────┬────────────────-┘
                              │
              ┌───────────────▼────────────────┐
              │       withAiTimeout()           │
              │   Hard 15s timeout per request  │
              └───────────────┬────────────────┘
                              │
              ┌───────────────▼────────────────┐
              │      normalizeAiError()         │
              │  401/403 → AI_AUTH_ERROR        │
              │  429     → AI_RATE_LIMITED      │
              │  5xx     → AI_UNAVAILABLE       │
              │  timeout → AI_TIMEOUT           │
              └────────────────────────────────-┘
```

**AI use cases:**
| Feature | AI Task | Model |
|---|---|---|
| Technical interview generation | 5-question JSON array generation | Gemini 2.5 Flash |
| Technical answer feedback | Rating (1–10) + 3–5 line feedback | Gemini 2.5 Flash |
| Coding problem generation | Full problem + solution JSON | Gemini 2.5 Flash |
| Coding submission feedback | 6-dimension code review | Gemini 2.5 Flash |
| Voice answer transcription | Audio → text (base64 inline data) | Gemini 2.5 Flash |
| Question bank generation | Company + role-specific Q&A sets | Gemini 2.5 Flash |

---

<br />

## 🗃️ Database Schema

```sql
-- Core auth tables
users                    -- Identity, password hash, role, lockout state
auth_sessions            -- Device/session records with IP + user agent
refresh_tokens           -- Hashed token lineage with family tracking
verification_tokens      -- Email verification (one-time)
password_reset_tokens    -- Password reset (one-time, 30-min TTL)

-- Application tables
mockInterview            -- Technical interview sessions + AI questions
userAnswer               -- Per-question answers + AI feedback + ratings
question                 -- Question bank sets + company/stack metadata
codingInterview          -- Coding assessments + generated problems
codingFeedback           -- Code submission reviews + correct solutions
```

<details>
<summary><strong>📊 Entity Relationship Overview (click to expand)</strong></summary>

```
Users (1) ──────────────── (N) AuthSessions
Users (1) ──────────────── (N) RefreshTokens
Users (1) ──────────────── (N) VerificationTokens
Users (1) ──────────────── (N) PasswordResetTokens

AuthSessions (1) ────────── (N) RefreshTokens

Users.email (1) ──────────── (N) MockInterview
MockInterview (1) ─────────── (N) UserAnswer

Users.email (1) ──────────── (N) CodingInterview
CodingInterview (1) ──────── (N) CodingFeedback

Users.email (1) ──────────── (N) Question
```

</details>

---

<br />

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.18.0
- **npm** ≥ 9
- A [Neon](https://neon.tech) Postgres database
- A [Google AI Studio](https://aistudio.google.com) Gemini API key

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/prepai.git
cd prepai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the root:

```env
# ─── Database ────────────────────────────────────────────────
DATABASE_URL=postgresql://user:password@your-neon-host/prepai

# ─── Google Gemini AI ─────────────────────────────────────────
GEMINI_API_KEY=your_gemini_api_key_here

# ─── Auth Secrets (min 32 chars, high entropy, DIFFERENT values)
AUTH_ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_min_32_chars
AUTH_REFRESH_TOKEN_SECRET=your_super_secret_refresh_token_key_min_32_chars

# ─── App URL ──────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL=http://localhost:3000

# ─── Optional: Redis Rate Limiting ────────────────────────────
# REDIS_REST_URL=https://your-upstash-url
# REDIS_REST_TOKEN=your_upstash_token

# ─── Optional: Cookie Domain (for production subdomains) ───────
# AUTH_COOKIE_DOMAIN=.yourdomain.com

# ─── UI Notes (shown in interview UI) ─────────────────────────
NEXT_PUBLIC_INFORMATION=Enable your webcam for a realistic experience.
NEXT_PUBLIC_QUESTION_NOTE=Think aloud as you answer. Silence is okay — the AI hears the pause.
```

> ⚠️ `AUTH_ACCESS_TOKEN_SECRET` and `AUTH_REFRESH_TOKEN_SECRET` **must be different** strings with at least 32 characters of high entropy.

### 4. Push the database schema

```bash
npm run db:push
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the landing page loads immediately.

---

<br />

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Next.js dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Drizzle schema to Neon Postgres |
| `npm run db:studio` | Open Drizzle Studio (local DB GUI) |

---

<br />

## 🔁 User Flows

### Technical Interview Flow

```
Dashboard → "Technical Round" card → Configure (role, stack, experience)
    → AI generates 5 questions → Preview page (webcam setup)
    → Live session: questions + voice recording per question
    → Auto-transcribe via Gemini → AI feedback per answer
    → Feedback page: rating, correct answer, improvement notes
```

### Coding Round Flow

```
Dashboard → "Coding Round" card → Configure (role, language, experience)
    → AI generates problem (title, description, constraints, hints, solution)
    → Rules preview → Assessment starts (20-min timer)
    → Monaco editor → Save code → Submit
    → AI reviews: correctness, approach, efficiency, quality, optimization
    → Feedback page: scores + correct solution with explanation
```

### Question Bank Flow

```
Questions page → "Question Set" card → Configure (role, stack, type, company, experience)
    → AI generates 5 targeted Q&A pairs
    → Accordion view for self-study
    → Saved sets persist in your dashboard
```

---

<br />

## 🌐 API Reference

<details>
<summary><strong>Auth Endpoints</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Create account, set auth cookies |
| `POST` | `/api/auth/login` | Login, set auth cookies |
| `POST` | `/api/auth/logout` | Revoke session, clear cookies |
| `POST` | `/api/auth/refresh` | Rotate refresh token, issue new access token |
| `GET` | `/api/auth/refresh` | Middleware redirect target for expired pages |
| `GET` | `/api/auth/me` | Return current authenticated user |
| `POST` | `/api/auth/forgot-password` | Request password reset token |
| `POST` | `/api/auth/reset-password` | Apply password reset |
| `POST` | `/api/auth/verify-email` | Verify email with one-time token |

</details>

<details>
<summary><strong>Interview Endpoints</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/interviews/technical` | List all technical interviews |
| `POST` | `/api/interviews/technical` | Create interview + generate AI questions |
| `GET` | `/api/interviews/technical/:id` | Get interview with questions |
| `POST` | `/api/interviews/technical/:id/answers` | Record answer + generate feedback |
| `GET` | `/api/interviews/technical/:id/feedback` | List all feedback for interview |
| `GET` | `/api/interviews/coding` | List coding rounds |
| `POST` | `/api/interviews/coding` | Create coding round + generate problem |
| `GET` | `/api/interviews/coding/:id` | Get coding round with problem |
| `POST` | `/api/interviews/coding/:id/submissions` | Submit code + generate review |
| `GET` | `/api/interviews/coding/:id/feedback` | Get latest coding feedback |

</details>

<details>
<summary><strong>Other Endpoints</strong></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/questions` | List question sets |
| `POST` | `/api/questions` | Create question set + generate Q&A |
| `GET` | `/api/questions/:id` | Get question set with Q&A pairs |
| `POST` | `/api/ai/transcribe` | Transcribe audio file to text |

</details>

---

<br />

## 🔧 Configuration

### Rate Limits

| Bucket | Limit | Window |
|---|---|---|
| Login | 5 requests | 15 minutes |
| Signup | 8 requests | 60 minutes |
| Refresh | 30 requests | 15 minutes |
| Password reset | 3 requests | 60 minutes |

Rate limiting defaults to **in-memory storage** (suitable for single-instance/dev). For production multi-instance deployments, set `REDIS_REST_URL` and `REDIS_REST_TOKEN` to use Upstash Redis REST.

### Gemini Model Fallback

PrepAI tries models in order: `gemini-2.5-flash` → `gemini-2.5-flash-lite`. Each model gets 2 attempts before falling over. Retryable statuses: `429, 500, 502, 503, 504`. Hard timeout: **15 seconds**.

---

<br />

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set all environment variables in the Vercel dashboard under **Settings → Environment Variables**.

### Required Production Variables

```env
DATABASE_URL=
GEMINI_API_KEY=
AUTH_ACCESS_TOKEN_SECRET=        # min 32 chars, high entropy
AUTH_REFRESH_TOKEN_SECRET=       # min 32 chars, DIFFERENT from access secret
NEXT_PUBLIC_APP_URL=             # https://yourdomain.com
REDIS_REST_URL=                  # Recommended for production rate limiting
REDIS_REST_TOKEN=
AUTH_COOKIE_DOMAIN=              # .yourdomain.com for subdomain support
```

### Database Migrations

```bash
# Push schema changes to production Neon DB
DATABASE_URL=your_prod_url npm run db:push
```

---

<br />

## 📦 Production Cleanup Jobs

Schedule these jobs for your production environment:

```sql
-- Clean expired refresh tokens (daily)
DELETE FROM refresh_tokens WHERE expires_at < NOW();

-- Clean revoked sessions older than 30 days (daily)
DELETE FROM auth_sessions WHERE revoked_at < NOW() - INTERVAL '30 days';

-- Clean used/expired verification tokens (daily)
DELETE FROM verification_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL;

-- Clean used/expired password reset tokens (daily)
DELETE FROM password_reset_tokens WHERE expires_at < NOW() OR used_at IS NOT NULL;
```

---

<br />

## 🤝 Contributing

We welcome contributions of all sizes. Here's how to get started:

```bash
# 1. Fork and clone
git clone https://github.com/yourusername/prepai.git

# 2. Create a feature branch
git checkout -b feature/your-feature-name

# 3. Make changes and commit
git commit -m "feat: add your feature"

# 4. Push and open a PR
git push origin feature/your-feature-name
```

**Contribution rules:**
- Follow the existing file and folder conventions
- DB access only through `src/features/*/services/` — never directly from components or route handlers
- Add Zod validation to every new API endpoint
- Wrap new DB calls in `AppError` with meaningful messages
- Test your auth changes against the middleware flow

---

<br />

## 🛡️ Security

Found a vulnerability? Please **do not open a public issue**.

Email us at: `security@yourprepai.com`

We follow responsible disclosure and will respond within 48 hours.

---

<br />

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](./LICENSE) for details.

---

<br />

## 🙏 Acknowledgements

| Library | Why |
|---|---|
| [Next.js](https://nextjs.org) | The full-stack React framework that makes this possible |
| [Drizzle ORM](https://orm.drizzle.team) | Type-safe, lightweight SQL ORM |
| [Neon](https://neon.tech) | Serverless Postgres with branching |
| [Google Gemini](https://deepmind.google/technologies/gemini/) | The AI powering question generation, feedback, and transcription |
| [shadcn/ui](https://ui.shadcn.com) | Beautiful, accessible component primitives |
| [Monaco Editor](https://microsoft.github.io/monaco-editor/) | The editor that powers VS Code, now in the browser |
| [Framer Motion](https://www.framer.com/motion/) | Production-grade animation for React |
| [jose](https://github.com/panva/jose) | Zero-dependency JWT/JWK implementation |
| [Zod](https://zod.dev) | TypeScript-first schema validation |

---

<br />

<div align="center">

**Built with ❤️ for every engineer chasing their next role.**

<img src="https://your-domain.com/public/prepai-footer.png" alt="PrepAI Footer" width="100%" />

<br />

[⭐ Star this repo](https://github.com/yourusername/prepai) · [🐦 Follow on X](https://x.com/yourhandle) · [💼 LinkedIn](https://linkedin.com/company/prepai)

</div>