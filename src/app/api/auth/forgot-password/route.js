import { fail, parseJson, ok } from "@/lib/api/responses";
import { forgotPasswordSchema } from "@/features/auth/validators/auth-schemas";
import { requestPasswordReset } from "@/features/auth/services/auth-service";
import { assertRateLimit, RATE_LIMITS } from "@/features/auth/lib/rate-limit";
import { assertSameOrigin } from "@/features/auth/lib/request-security";

export async function POST(request) {
  try {
    assertSameOrigin(request);
    await assertRateLimit(request, "password-reset", RATE_LIMITS.passwordReset);

    const input = await parseJson(request, forgotPasswordSchema);
    return ok(await requestPasswordReset(input));
  } catch (error) {
    return fail(error);
  }
}
