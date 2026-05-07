import { fail, ok } from "@/lib/api/responses";
import { requireCurrentUser } from "@/features/auth/services/session-service";

export async function GET() {
  try {
    return ok({ user: await requireCurrentUser() });
  } catch (error) {
    return fail(error);
  }
}
