import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { isAppError, validationError } from '@/lib/errors';

export function ok(data, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function created(data) {
  return ok(data, 201);
}

export function fail(error) {
  const appError = normalizeError(error);

  return NextResponse.json(
    {
      error: {
        code: appError.code,
        message: appError.message,
      },
    },
    { status: appError.statusCode }
  );
}

export async function parseJson(request, schema) {
  const body = await request.json();
  return schema.parse(body);
}

function normalizeError(error) {
  if (isAppError(error)) {
    return error;
  }

  if (error instanceof ZodError) {
    const issue = error.issues[0];
    return validationError(issue?.message ?? 'Invalid request');
  }

  return {
    code: 'INTERNAL_ERROR',
    message: 'Something went wrong. Please try again.',
    statusCode: 500,
  };
}
