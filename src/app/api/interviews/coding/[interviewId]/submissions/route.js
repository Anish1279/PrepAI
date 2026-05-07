import { created, fail, parseJson } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import { submitCodingAnswer } from '@/features/coding/services/coding-interview-service';
import {
  codingInterviewIdParamSchema,
  codingSubmissionSchema,
} from '@/features/coding/utils/validation';

export async function POST(request, { params }) {
  try {
    const email = await requireCurrentUserEmail();
    const { interviewId } = codingInterviewIdParamSchema.parse(await params);
    const input = await parseJson(request, codingSubmissionSchema);

    return created(await submitCodingAnswer(input, interviewId, email));
  } catch (error) {
    return fail(error);
  }
}
