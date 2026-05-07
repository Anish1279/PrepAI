import { validationError } from '@/lib/errors';

export function extractJsonObject(value) {
  const match = String(value ?? '').match(/\{[\s\S]*\}/);

  if (!match) {
    throw validationError('AI response did not contain a JSON object.');
  }

  return match[0];
}

export function extractJsonArray(value) {
  const cleaned = String(value ?? '');
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');

  if (start === -1 || end === -1 || end < start) {
    throw validationError('AI response did not contain a JSON array.');
  }

  return cleaned.slice(start, end + 1);
}

export function parseJson(value, fallbackMessage = 'Invalid JSON payload.') {
  try {
    return JSON.parse(value);
  } catch {
    throw validationError(fallbackMessage);
  }
}
