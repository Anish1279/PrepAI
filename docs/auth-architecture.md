# PrepAI Authentication Architecture

## 1. Architecture Overview

PrepAI now uses first-party authentication built on Next.js App Router route handlers, Drizzle ORM, PostgreSQL, HTTP-only cookies, signed JWT access tokens, rotating JWT refresh tokens, Zod validation, and server-side route protection.

The system is intentionally hybrid:

- Access tokens are short-lived JWTs for fast middleware/API authorization.
- Refresh tokens are long-lived JWTs, but they are also hashed and persisted server-side so they can be rotated, revoked, and replay-detected.
- Sessions are stateful records so logout, password reset, and suspicious refresh-token reuse can revoke a whole device/session family.

This keeps the speed benefits of JWTs without accepting the usual “cannot revoke tokens” weakness of purely stateless auth.

## 2. Folder Structure

- `src/features/auth/validators`: shared Zod schemas used by client and API.
- `src/features/auth/lib`: token, cookie, password, environment, rate-limit, and request-security utilities.
- `src/features/auth/services`: auth/session business logic and DB-backed session resolution.
- `src/features/auth/components`: auth forms, auth shell, and user menu.
- `src/app/api/auth/*`: route handlers for signup, login, refresh, logout, me, forgot password, reset password, verify email.
- `src/middleware.js`: edge-safe route protection, RBAC checks, same-origin blocking, and refresh redirect.

## 3. Database Schema

Tables added in `src/lib/db/schema.js`:

- `users`: identity, password hash, role, status, email verification state, lockout counters.
- `auth_sessions`: device/session records, user agent/IP metadata, expiration, revocation.
- `refresh_tokens`: hashed refresh token lineage, token family, replacement pointer, revocation/expiry.
- `verification_tokens`: email verification token hashes, expiry, one-time use.
- `password_reset_tokens`: password reset token hashes, expiry, one-time use.

Indexes exist on email, session/user IDs, refresh token hash/JTI, token family, and expiry columns so auth lookups and cleanup jobs stay cheap.

## 4. JWT Strategy

Access tokens expire in 15 minutes. They contain only non-sensitive claims: `sub`, `email`, `role`, `sid`, `jti`, `typ`.

Refresh tokens expire in 30 days. Each refresh token has a unique `jti`, belongs to a `sid` session and `fid` token family, is stored only as SHA-256 hash in the DB, and is rotated on refresh.

Access tokens are short-lived because stolen access tokens cannot be revoked instantly without a DB lookup on every request. Short TTL limits damage. Refresh rotation matters because a stolen refresh token becomes detectable: if an already-replaced token is used again, the system revokes the whole token family/session.

## 5. Cookie Strategy

Cookies:

- `prepai_access`: HTTP-only, SameSite=Lax, path `/`, 15-minute max age.
- `prepai_refresh`: HTTP-only, SameSite=Lax, path `/api/auth`, 30-day max age.
- `prepai_csrf`: readable double-submit token, SameSite=Lax, path `/`.

Tokens are never stored in `localStorage`. Local storage is reachable from injected JavaScript, so an XSS bug can steal bearer tokens. HTTP-only cookies cannot be read by JavaScript, which turns many XSS token-theft bugs into same-origin action risks. Those are mitigated with SameSite cookies, origin validation, and CSRF checks for logout.

## 6. Security Model

Implemented:

- bcryptjs hashing with cost factor 12.
- Strong password policy via Zod.
- Duplicate email checks at signup.
- Generic login failure messages.
- Account lockout after repeated failed attempts.
- Access/refresh secret separation.
- Refresh rotation with replay detection.
- Token family/session revocation.
- HTTP-only cookies.
- Same-origin enforcement for unsafe methods.
- CSRF token check on logout.
- In-memory rate-limit fallback with Redis REST support.
- RBAC-ready `role` claim and DB field.
- Edge-safe middleware authorization.

## 7. API Endpoints

- `POST /api/auth/signup`: validates input, checks duplicate email, hashes password, creates user/session/verification token, sets cookies.
- `POST /api/auth/login`: validates input, verifies password, checks account state/lockout, creates session, sets cookies.
- `POST /api/auth/refresh`: validates same-origin request, verifies refresh JWT, checks DB hash/JTI/session, rotates refresh token, sets cookies.
- `GET /api/auth/refresh`: middleware redirect target for expired access tokens on protected page loads.
- `POST /api/auth/logout`: CSRF-protected, revokes session, clears cookies.
- `GET /api/auth/me`: returns sanitized current user.
- `POST /api/auth/forgot-password`: throttled, creates reset token if user exists, returns generic success.
- `POST /api/auth/reset-password`: validates one-time reset token, updates password, revokes all sessions.
- `POST /api/auth/verify-email`: validates one-time verification token and marks email verified.

## 8. Refresh Flow

1. Client sends refresh cookie to `/api/auth/refresh`.
2. Server verifies refresh JWT signature and expiry.
3. Server hashes the presented token and finds the DB row.
4. If the row is missing/revoked/replaced, the token family/session is revoked as replay defense.
5. If valid, old token is marked revoked and replaced by a new refresh token.
6. A new short-lived access token is issued.

Naive refresh systems that reuse the same refresh token cannot distinguish a legitimate refresh from an attacker replay. Rotation creates a one-time-use chain, so stolen token reuse is visible.

## 9. Rate Limiting

`src/features/auth/lib/rate-limit.js` supports:

- login brute-force throttling,
- signup abuse prevention,
- password reset throttling,
- refresh abuse throttling.

It uses an in-memory fallback for local/dev and Redis REST when `REDIS_REST_URL` and `REDIS_REST_TOKEN` are present. Production should use Redis or another centralized store because serverless memory is per-instance.

## 10. Production Deployment

Required environment:

- `DATABASE_URL`
- `AUTH_ACCESS_TOKEN_SECRET`
- `AUTH_REFRESH_TOKEN_SECRET`
- `NEXT_PUBLIC_APP_URL`

Optional:

- `AUTH_COOKIE_DOMAIN`
- `REDIS_REST_URL`
- `REDIS_REST_TOKEN`
- `MAIL_PROVIDER_API_KEY`

Secrets must be different, high entropy, and rotated using a staged deploy: accept old+new for verification during migration, sign only with new, then remove old after TTL.

## 11. Cleanup Jobs

Schedule cleanup for:

- expired refresh tokens,
- expired sessions,
- used/expired verification tokens,
- used/expired password reset tokens.

Redis-backed deny lists can be added for emergency access-token revocation if sub-15-minute revocation is required.

## 12. Vulnerabilities Prevented

- Plaintext password storage.
- Token theft from localStorage.
- Long-lived bearer-token compromise.
- Refresh-token replay.
- CSRF on unsafe cross-site requests.
- Credential stuffing without throttling.
- Account enumeration on forgot-password.
- Password reset token reuse.
- Session persistence after password reset.

## 13. Interview Notes

**Why JWT plus sessions?** JWTs keep middleware/API checks fast; sessions restore revocation and device management.

**Why refresh rotation?** It turns stolen refresh token reuse into a detectable event and lets the server revoke the entire token family.

**Why separate access and refresh secrets?** A leaked access secret should not allow minting long-lived refresh tokens.

**Why HTTP-only cookies?** They reduce token exfiltration risk during XSS because JavaScript cannot read them.

**Why Zod?** It gives one validation contract for client UX and server trust boundaries, with inferred shapes and consistent error handling.

**Why Redis rate limiting?** Brute-force defense must be shared across instances; memory fallback is useful only for local development and small single-instance deployments.
