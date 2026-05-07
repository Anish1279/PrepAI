import { randomUUID } from 'crypto';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { Question } from '@/lib/db/schema';
import { generateText } from '@/lib/ai/gemini';
import { AppError, notFoundError } from '@/lib/errors';
import { TECHNICAL_QUESTION_COUNT } from '@/constants/interviews';
import { formatDateYMD } from '@/utils/date';
import { extractJsonArray, parseJson } from '@/utils/json';

export async function listQuestionSets(email) {
  return safeDb(
    () => db
      .select({
        mockId: Question.mockId,
        jobPosition: Question.jobPosition,
        jobExperience: Question.jobExperience,
        company: Question.company,
        typeQuestion: Question.typeQuestion,
        createdAt: Question.createdAt,
      })
      .from(Question)
      .where(eq(Question.createdBy, email))
      .orderBy(desc(Question.id)),
    'Could not load question sets. Please refresh and try again.'
  );
}

export async function createQuestionSet(input, email) {
  const MockQuestionJsonResp = await generateQuestionSet(input);
  const mockId = randomUUID();

  const [created] = await safeDb(
    () => db
      .insert(Question)
      .values({
        mockId,
        MockQuestionJsonResp,
        jobPosition: input.jobPosition,
        jobDesc: input.jobDesc,
        jobExperience: input.jobExperience,
        typeQuestion: input.typeQuestion,
        company: input.company,
        createdBy: email,
        createdAt: formatDateYMD(),
      })
      .returning({ mockId: Question.mockId }),
    'Could not save generated questions. Please try again.'
  );

  return created;
}

export async function getQuestionSet(mockId, email) {
  const [questionSet] = await safeDb(
    () => db
      .select({
        mockId: Question.mockId,
        MockQuestionJsonResp: Question.MockQuestionJsonResp,
        jobPosition: Question.jobPosition,
        jobExperience: Question.jobExperience,
        createdAt: Question.createdAt,
      })
      .from(Question)
      .where(and(eq(Question.mockId, mockId), eq(Question.createdBy, email))),
    'Could not load this question set. Please try again.'
  );

  if (!questionSet) {
    throw notFoundError('Question set not found.');
  }

  const { MockQuestionJsonResp, ...summary } = questionSet;

  return {
    ...summary,
    questions: parseJson(
      extractJsonArray(questionSet.MockQuestionJsonResp),
      'Stored question set is invalid.'
    ),
  };
}

async function generateQuestionSet(input) {
  const prompt = `
    Job Position: ${input.jobPosition}
    Job Description: ${input.jobDesc}
    Years of Experience: ${input.jobExperience}
    Question Type: ${input.typeQuestion}
    Target Company: ${input.company}

    Generate exactly ${TECHNICAL_QUESTION_COUNT} interview questions.
    Return only a JSON array. Each item must include "Question" and "Answer".
  `;

  let lastError;

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await generateText(prompt);
      const json = extractJsonArray(response);
      parseJson(json, 'AI returned invalid preparation questions.');

      return json;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

async function safeDb(runQuery, message) {
  try {
    return await runQuery();
  } catch (error) {
    console.error(message, error);
    throw new AppError(message, 500, 'DATABASE_ERROR');
  }
}
