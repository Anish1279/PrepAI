import { NextResponse } from "next/server";
import { parseJson, fail } from "@/lib/api/responses";
import { signupSchema } from "@/features/auth/validators/auth-schemas";
import { signup } from "@/features/auth/services/auth-service";
import { setAuthCookies } from "@/features/auth/lib/cookies";
import { assertRateLimit, RATE_LIMITS } from "@/features/auth/lib/rate-limit";
import { assertSameOrigin, getRequestMetadata } from "@/features/auth/lib/request-security";

export async function POST(request) {
  try {
    assertSameOrigin(request);
    await assertRateLimit(request, "signup", RATE_LIMITS.signup);

    const input = await parseJson(request, signupSchema);
    const result = await signup(input, getRequestMetadata(request));
    const response = NextResponse.json(
      {
        data: {
          user: result.user,
          verificationToken: result.verificationToken,
        },
      },
      { status: 201 }
    );

    return setAuthCookies(response, result.tokenBundle);
  } catch (error) {
    return fail(error);
  }
}
