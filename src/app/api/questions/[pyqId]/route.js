import { fail, ok } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import { getQuestionSet } from '@/features/questions/services/question-service';
import { questionSetIdParamSchema } from '@/features/questions/utils/validation';

export async function GET(_request, { params }) {
  try {
    const email = await requireCurrentUserEmail();
    const { pyqId } = questionSetIdParamSchema.parse(await params);
    return ok(await getQuestionSet(pyqId, email));
  } catch (error) {
    return fail(error);
  }
}
