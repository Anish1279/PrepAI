import { fail, ok, parseJson } from "@/lib/api/responses";
import { resetPasswordSchema } from "@/features/auth/validators/auth-schemas";
import { resetPassword } from "@/features/auth/services/auth-service";
import { assertSameOrigin } from "@/features/auth/lib/request-security";

export async function POST(request) {
  try {
    assertSameOrigin(request);

    const input = await parseJson(request, resetPasswordSchema);
    return ok(await resetPassword(input));
  } catch (error) {
    return fail(error);
  }
}
