import { created, fail, ok, parseJson } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import {
  createTechnicalInterview,
  listTechnicalInterviews,
} from '@/features/interviews/services/technical-interview-service';
import { createTechnicalInterviewSchema } from '@/features/interviews/utils/validation';

export async function GET() {
  try {
    const email = await requireCurrentUserEmail();
    return ok(await listTechnicalInterviews(email));
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request) {
  try {
    const email = await requireCurrentUserEmail();
    const input = await parseJson(request, createTechnicalInterviewSchema);
    return created(await createTechnicalInterview(input, email));
  } catch (error) {
    return fail(error);
  }
}
