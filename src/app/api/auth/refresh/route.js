import { NextResponse } from "next/server";
import { fail } from "@/lib/api/responses";
import { AUTH_COOKIE_NAMES } from "@/features/auth/lib/auth-constants";
import { clearAuthCookies, setAuthCookies } from "@/features/auth/lib/cookies";
import { refreshSession } from "@/features/auth/services/auth-service";
import { assertRateLimit, RATE_LIMITS } from "@/features/auth/lib/rate-limit";
import {
  assertSameOrigin,
  getRequestMetadata,
  sanitizeReturnTo,
} from "@/features/auth/lib/request-security";

export async function POST(request) {
  try {
    assertSameOrigin(request);
    await assertRateLimit(request, "refresh", RATE_LIMITS.refresh);

    const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value;
    const result = await refreshSession(refreshToken, getRequestMetadata(request));
    const response = NextResponse.json({ data: { user: result.user } });

    return setAuthCookies(response, result.tokenBundle);
  } catch (error) {
    return clearAuthCookies(fail(error));
  }
}

export async function GET(request) {
  const returnTo = sanitizeReturnTo(new URL(request.url).searchParams.get("returnTo"));

  try {
    await assertRateLimit(request, "refresh", RATE_LIMITS.refresh);

    const refreshToken = request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value;
    const result = await refreshSession(refreshToken, getRequestMetadata(request));
    const response = NextResponse.redirect(new URL(returnTo, request.url));

    return setAuthCookies(response, result.tokenBundle);
  } catch {
    const response = NextResponse.redirect(new URL(`/sign-in?returnTo=${encodeURIComponent(returnTo)}`, request.url));
    return clearAuthCookies(response);
  }
}
