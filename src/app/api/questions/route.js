import { created, fail, ok, parseJson } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import {
  createQuestionSet,
  listQuestionSets,
} from '@/features/questions/services/question-service';
import { createQuestionSetSchema } from '@/features/questions/utils/validation';

export async function GET() {
  try {
    const email = await requireCurrentUserEmail();
    return ok(await listQuestionSets(email));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request) {
  try {
    const email = await requireCurrentUserEmail();
    const input = await parseJson(request, createQuestionSetSchema);
    return created(await createQuestionSet(input, email));
  } catch (error) {
    return fail(error);
  }
}
