import { fail, ok, parseJson } from "@/lib/api/responses";
import { verifyEmailSchema } from "@/features/auth/validators/auth-schemas";
import { verifyEmail } from "@/features/auth/services/auth-service";
import { assertSameOrigin } from "@/features/auth/lib/request-security";

export async function POST(request) {
  try {
    assertSameOrigin(request);

    const input = await parseJson(request, verifyEmailSchema);
    return ok(await verifyEmail(input));
  } catch (error) {
    return fail(error);
  }
}
