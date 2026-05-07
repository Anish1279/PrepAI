import { cookies } from "next/headers";
import { AUTH_COOKIE_NAMES, AUTH_STATUS } from "@/features/auth/lib/auth-constants";
import { getCookieValue } from "@/features/auth/lib/cookies";
import { verifyAccessToken } from "@/features/auth/lib/tokens";
import {
  findUserById,
  getActiveSession,
  sanitizeUser,
} from "@/features/auth/services/auth-service";
import { unauthorizedError } from "@/lib/errors";

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const accessToken = getCookieValue(cookieStore, AUTH_COOKIE_NAMES.access);

  if (!accessToken) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    const [user, session] = await Promise.all([
      findUserById(payload.sub),
      getActiveSession(payload.sid),
    ]);

    if (!user || !session || user.status !== AUTH_STATUS.active) {
      return null;
    }

    return sanitizeUser(user);
  } catch {
    return null;
  }
}

export async function requireCurrentUser() {
  const user = await getCurrentUser();

  if (!user) {
    throw unauthorizedError();
  }

  return user;
}

export async function requireCurrentUserEmail() {
  const user = await requireCurrentUser();
  return user.email;
}

export async function requireRole(allowedRoles) {
  const user = await requireCurrentUser();
  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  if (!roles.includes(user.role)) {
    throw unauthorizedError("You do not have permission to access this resource.");
  }

  return user;
}
