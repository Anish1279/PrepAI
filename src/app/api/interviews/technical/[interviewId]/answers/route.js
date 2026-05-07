import { created, fail, parseJson } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import { recordTechnicalAnswer } from '@/features/interviews/services/technical-interview-service';
import {
  interviewIdParamSchema,
  technicalAnswerSchema,
} from '@/features/interviews/utils/validation';

export async function POST(request, { params }) {
  try {
    const email = await requireCurrentUserEmail();
    const { interviewId } = interviewIdParamSchema.parse(await params);
    const input = await parseJson(request, technicalAnswerSchema);

    return created(await recordTechnicalAnswer(input, interviewId, email));
  } catch (error) {
    return fail(error);
  }
}
