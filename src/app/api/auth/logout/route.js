import { NextResponse } from "next/server";
import { fail } from "@/lib/api/responses";
import { AUTH_COOKIE_NAMES } from "@/features/auth/lib/auth-constants";
import { clearAuthCookies } from "@/features/auth/lib/cookies";
import { logout } from "@/features/auth/services/auth-service";
import { assertCsrfToken, assertSameOrigin } from "@/features/auth/lib/request-security";

export async function POST(request) {
  try {
    assertSameOrigin(request);
    assertCsrfToken(request);

    await logout(request.cookies.get(AUTH_COOKIE_NAMES.refresh)?.value);
    return clearAuthCookies(NextResponse.json({ data: { ok: true } }));
  } catch (error) {
    return clearAuthCookies(fail(error));
  }
}
