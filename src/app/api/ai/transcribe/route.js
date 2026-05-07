import { fail, ok } from '@/lib/api/responses';
import { requireCurrentUserEmail } from '@/features/auth/services/session-service';
import { validationError } from '@/lib/errors';
import { transcribeAudio } from '@/lib/ai/gemini';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

export async function POST(request) {
  try {
    await requireCurrentUserEmail();
    const formData = await request.formData();
    const audio = formData.get('audio');

    if (!audio || typeof audio.arrayBuffer !== 'function') {
      throw validationError('Audio file is required.');
    }

    if (audio.size > MAX_AUDIO_BYTES) {
      throw validationError('Audio file is too large.');
    }

    const buffer = Buffer.from(await audio.arrayBuffer());
    const transcription = await transcribeAudio(buffer.toString('base64'), audio.type);

    return ok({ transcription });
  } catch (error) {
    return fail(error);
  }
}
