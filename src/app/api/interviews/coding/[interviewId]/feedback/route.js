import { fail, ok } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import { getLatestCodingFeedback } from '@/features/coding/services/coding-interview-service';
import { codingInterviewIdParamSchema } from '@/features/coding/utils/validation';

export async function GET(_request, { params }) {
  try {
    const email = await requireCurrentUserEmail();
    const { interviewId } = codingInterviewIdParamSchema.parse(await params);
    return ok(await getLatestCodingFeedback(interviewId, email));
  } catch (error) {
    return fail(error);
  }
}
