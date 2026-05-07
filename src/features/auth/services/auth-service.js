import { and, desc, eq, isNull } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  AuthSessions,
  PasswordResetTokens,
  RefreshTokens,
  Users,
  VerificationTokens,
} from "@/lib/db/schema";
import { AppError, unauthorizedError, validationError } from "@/lib/errors";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTH_STATUS,
  EMAIL_VERIFICATION_TTL_HOURS,
  PASSWORD_RESET_TTL_MINUTES,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/features/auth/lib/auth-constants";
import { createSecureToken, createUuid, hashToken } from "@/features/auth/lib/crypto";
import { hashPassword, verifyPassword } from "@/features/auth/lib/password";
import {
  createAccessToken,
  createRefreshToken,
  decodeTokenUnsafe,
  verifyRefreshToken,
} from "@/features/auth/lib/tokens";

const MAX_FAILED_LOGIN_ATTEMPTS = 5;
const ACCOUNT_LOCK_MINUTES = 15;

export async function signup(input, metadata) {
  const email = input.email.toLowerCase();
  const existingUser = await findUserByEmail(email);

  if (existingUser) {
    throw validationError("An account with this email already exists.");
  }

  const now = new Date();
  const user = {
    id: createUuid(),
    email,
    name: input.name,
    passwordHash: await hashPassword(input.password),
    role: "user",
    status: AUTH_STATUS.active,
    emailVerified: false,
    createdAt: now,
    updatedAt: now,
  };

  const [createdUser] = await db
    .insert(Users)
    .values(user)
    .returning({
      id: Users.id,
      email: Users.email,
      name: Users.name,
      role: Users.role,
      status: Users.status,
      emailVerified: Users.emailVerified,
    });

  const verification = await createEmailVerificationToken(createdUser.id);
  const tokenBundle = await createSession(createdUser, metadata);

  return {
    user: sanitizeUser(createdUser),
    tokenBundle,
    verificationToken: process.env.NODE_ENV === "production" ? undefined : verification.token,
  };
}

export async function login(input, metadata) {
  const email = input.email.toLowerCase();
  const user = await findUserByEmail(email);
  const invalidCredentials = unauthorizedError("Invalid email or password.");

  if (!user) {
    await verifyPassword(input.password, null);
    throw invalidCredentials;
  }

  if (user.status !== AUTH_STATUS.active) {
    throw new AppError("This account is disabled.", 403, "ACCOUNT_DISABLED");
  }

  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new AppError("Too many failed attempts. Please try again later.", 423, "ACCOUNT_LOCKED");
  }

  const passwordValid = await verifyPassword(input.password, user.passwordHash);

  if (!passwordValid) {
    await recordFailedLogin(user);
    throw invalidCredentials;
  }

  await db
    .update(Users)
    .set({ failedLoginAttempts: 0, lockedUntil: null, updatedAt: new Date() })
    .where(eq(Users.id, user.id));

  const tokenBundle = await createSession(user, metadata);

  return {
    user: sanitizeUser(user),
    tokenBundle,
  };
}

export async function refreshSession(refreshToken, metadata) {
  if (!refreshToken) {
    throw unauthorizedError("Missing refresh token.");
  }

  let payload;

  try {
    payload = await verifyRefreshToken(refreshToken);
  } catch {
    await revokeRefreshFamilyFromUnsafeToken(refreshToken);
    throw unauthorizedError("Invalid refresh token.");
  }

  const tokenHash = hashToken(refreshToken);
  const [storedToken] = await db
    .select()
    .from(RefreshTokens)
    .where(eq(RefreshTokens.tokenHash, tokenHash))
    .limit(1);

  if (!storedToken) {
    await revokeRefreshFamily(payload.fid, payload.sid);
    throw unauthorizedError("Refresh token reuse detected.");
  }

  if (storedToken.revokedAt || storedToken.replacedByTokenId) {
    await revokeRefreshFamily(storedToken.familyId, storedToken.sessionId);
    throw unauthorizedError("Refresh token replay detected.");
  }

  if (storedToken.expiresAt <= new Date()) {
    await revokeSession(storedToken.sessionId);
    throw unauthorizedError("Refresh token expired.");
  }

  const session = await getActiveSession(storedToken.sessionId);
  const user = await findUserById(storedToken.userId);

  if (!session || !user || user.status !== AUTH_STATUS.active) {
    await revokeSession(storedToken.sessionId);
    throw unauthorizedError();
  }

  const rotated = await createRefreshToken({
    userId: user.id,
    sessionId: session.id,
    familyId: storedToken.familyId,
  });
  const access = await createAccessToken({ user, sessionId: session.id });
  const now = new Date();

  await db
    .update(RefreshTokens)
    .set({
      revokedAt: now,
      lastUsedAt: now,
      replacedByTokenId: rotated.tokenId,
    })
    .where(eq(RefreshTokens.id, storedToken.id));

  await db.insert(RefreshTokens).values({
    tokenId: rotated.tokenId,
    sessionId: session.id,
    userId: user.id,
    familyId: storedToken.familyId,
    tokenHash: rotated.tokenHash,
    expiresAt: rotated.expiresAt,
  });

  await db
    .update(AuthSessions)
    .set({
      lastSeenAt: now,
      ipAddress: metadata.ipAddress,
      userAgent: metadata.userAgent,
    })
    .where(eq(AuthSessions.id, session.id));

  return {
    user: sanitizeUser(user),
    tokenBundle: {
      accessToken: access.token,
      refreshToken: rotated.token,
    },
  };
}

export async function logout(refreshToken) {
  if (refreshToken) {
    const payload = decodeTokenUnsafe(refreshToken);

    if (payload?.sid) {
      await revokeSession(payload.sid);
    }
  }

  return { ok: true };
}

export async function requestPasswordReset(input) {
  const user = await findUserByEmail(input.email.toLowerCase());

  if (!user) {
    return { ok: true };
  }

  const token = createSecureToken(48);

  await db.insert(PasswordResetTokens).values({
    userId: user.id,
    tokenHash: hashToken(token),
    expiresAt: addMinutes(new Date(), PASSWORD_RESET_TTL_MINUTES),
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`Password reset token for ${user.email}: ${token}`);
  }

  return {
    ok: true,
    resetToken: process.env.NODE_ENV === "production" ? undefined : token,
  };
}

export async function resetPassword(input) {
  const tokenHash = hashToken(input.token);
  const [resetToken] = await db
    .select()
    .from(PasswordResetTokens)
    .where(and(eq(PasswordResetTokens.tokenHash, tokenHash), isNull(PasswordResetTokens.usedAt)))
    .limit(1);

  if (!resetToken || resetToken.expiresAt <= new Date()) {
    throw validationError("Password reset link is invalid or expired.");
  }

  const passwordHash = await hashPassword(input.password);
  const now = new Date();

  await db.update(Users).set({ passwordHash, updatedAt: now }).where(eq(Users.id, resetToken.userId));
  await db.update(PasswordResetTokens).set({ usedAt: now }).where(eq(PasswordResetTokens.id, resetToken.id));
  await revokeAllUserSessions(resetToken.userId);

  return { ok: true };
}

export async function verifyEmail(input) {
  const tokenHash = hashToken(input.token);
  const [verificationToken] = await db
    .select()
    .from(VerificationTokens)
    .where(and(eq(VerificationTokens.tokenHash, tokenHash), isNull(VerificationTokens.usedAt)))
    .limit(1);

  if (!verificationToken || verificationToken.expiresAt <= new Date()) {
    throw validationError("Email verification link is invalid or expired.");
  }

  const now = new Date();

  await db
    .update(Users)
    .set({ emailVerified: true, emailVerifiedAt: now, updatedAt: now })
    .where(eq(Users.id, verificationToken.userId));
  await db
    .update(VerificationTokens)
    .set({ usedAt: now })
    .where(eq(VerificationTokens.id, verificationToken.id));

  return { ok: true };
}

export async function findUserById(userId) {
  const [user] = await db.select().from(Users).where(eq(Users.id, userId)).limit(1);
  return user;
}

export async function findUserByEmail(email) {
  const [user] = await db.select().from(Users).where(eq(Users.email, email)).limit(1);
  return user;
}

export function sanitizeUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    status: user.status,
    emailVerified: user.emailVerified,
  };
}

async function createSession(user, metadata) {
  const sessionId = createUuid();
  const familyId = createUuid();
  const refresh = await createRefreshToken({
    userId: user.id,
    sessionId,
    familyId,
  });
  const access = await createAccessToken({ user, sessionId });

  await db.insert(AuthSessions).values({
    id: sessionId,
    userId: user.id,
    refreshTokenFamilyId: familyId,
    ipAddress: metadata.ipAddress,
    userAgent: metadata.userAgent,
    deviceLabel: parseDeviceLabel(metadata.userAgent),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
  });

  await db.insert(RefreshTokens).values({
    tokenId: refresh.tokenId,
    sessionId,
    userId: user.id,
    familyId,
    tokenHash: refresh.tokenHash,
    expiresAt: refresh.expiresAt,
  });

  return {
    accessToken: access.token,
    refreshToken: refresh.token,
  };
}

async function createEmailVerificationToken(userId) {
  const token = createSecureToken(48);

  await db.insert(VerificationTokens).values({
    userId,
    tokenHash: hashToken(token),
    type: "email_verification",
    expiresAt: addHours(new Date(), EMAIL_VERIFICATION_TTL_HOURS),
  });

  if (process.env.NODE_ENV !== "production") {
    console.info(`Email verification token for ${userId}: ${token}`);
  }

  return { token };
}

async function recordFailedLogin(user) {
  const attempts = Number(user.failedLoginAttempts ?? 0) + 1;
  const lockedUntil =
    attempts >= MAX_FAILED_LOGIN_ATTEMPTS
      ? addMinutes(new Date(), ACCOUNT_LOCK_MINUTES)
      : user.lockedUntil;

  await db
    .update(Users)
    .set({
      failedLoginAttempts: attempts,
      lockedUntil,
      updatedAt: new Date(),
    })
    .where(eq(Users.id, user.id));
}

export async function getActiveSession(sessionId) {
  const [session] = await db
    .select()
    .from(AuthSessions)
    .where(and(eq(AuthSessions.id, sessionId), isNull(AuthSessions.revokedAt)))
    .orderBy(desc(AuthSessions.createdAt))
    .limit(1);

  if (!session || session.expiresAt <= new Date()) {
    return null;
  }

  return session;
}

async function revokeSession(sessionId) {
  const now = new Date();

  await db.update(AuthSessions).set({ revokedAt: now }).where(eq(AuthSessions.id, sessionId));
  await db.update(RefreshTokens).set({ revokedAt: now }).where(eq(RefreshTokens.sessionId, sessionId));
}

async function revokeAllUserSessions(userId) {
  const now = new Date();

  await db.update(AuthSessions).set({ revokedAt: now }).where(eq(AuthSessions.userId, userId));
  await db.update(RefreshTokens).set({ revokedAt: now }).where(eq(RefreshTokens.userId, userId));
}

async function revokeRefreshFamilyFromUnsafeToken(refreshToken) {
  const payload = decodeTokenUnsafe(refreshToken);

  if (payload?.fid || payload?.sid) {
    await revokeRefreshFamily(payload.fid, payload.sid);
  }
}

async function revokeRefreshFamily(familyId, sessionId) {
  const now = new Date();

  if (familyId) {
    await db.update(RefreshTokens).set({ revokedAt: now }).where(eq(RefreshTokens.familyId, familyId));
  }

  if (sessionId) {
    await db.update(AuthSessions).set({ revokedAt: now }).where(eq(AuthSessions.id, sessionId));
  }
}

function parseDeviceLabel(userAgent = "") {
  if (!userAgent) {
    return "Unknown device";
  }

  if (/mobile|android|iphone/i.test(userAgent)) {
    return "Mobile browser";
  }

  return "Desktop browser";
}

function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function addHours(date, hours) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}
