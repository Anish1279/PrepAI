import { fail, ok } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import { getTechnicalInterview } from '@/features/interviews/services/technical-interview-service';
import { interviewIdParamSchema } from '@/features/interviews/utils/validation';

export async function GET(_request, { params }) {
  try {
    const email = await requireCurrentUserEmail();
    const { interviewId } = interviewIdParamSchema.parse(await params);
    return ok(await getTechnicalInterview(interviewId, email));
  } catch (error) {
    return fail(error);
  }
}
