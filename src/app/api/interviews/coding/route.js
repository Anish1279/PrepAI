import { created, fail, ok, parseJson } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import {
  createCodingInterview,
  listCodingInterviews,
} from '@/features/coding/services/coding-interview-service';
import { createCodingInterviewSchema } from '@/features/coding/utils/validation';

export const maxDuration = 10;

export async function GET() {
  try {
    const email = await requireCurrentUserEmail();
    return ok(await listCodingInterviews(email));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request) {
  try {
    const email = await requireCurrentUserEmail();
    const input = await parseJson(request, createCodingInterviewSchema);
    return created(await createCodingInterview(input, email));
  } catch (error) {
    return fail(error);
  }
}
