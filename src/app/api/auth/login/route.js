import { NextResponse } from "next/server";
import { fail, parseJson } from "@/lib/api/responses";
import { loginSchema } from "@/features/auth/validators/auth-schemas";
import { login } from "@/features/auth/services/auth-service";
import { setAuthCookies } from "@/features/auth/lib/cookies";
import { assertRateLimit, RATE_LIMITS } from "@/features/auth/lib/rate-limit";
import { assertSameOrigin, getRequestMetadata } from "@/features/auth/lib/request-security";

export async function POST(request) {
  try {
    assertSameOrigin(request);
    await assertRateLimit(request, "login", RATE_LIMITS.login);

    const input = await parseJson(request, loginSchema);
    const result = await login(input, getRequestMetadata(request));
    const response = NextResponse.json({ data: { user: result.user } });

    return setAuthCookies(response, result.tokenBundle);
  } catch (error) {
    return fail(error);
  }
}
