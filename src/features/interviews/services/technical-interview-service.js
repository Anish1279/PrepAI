import { randomUUID } from 'crypto';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { MockInterview, UserAnswer } from '@/lib/db/schema';
import { generateText } from '@/lib/ai/gemini';
import { notFoundError } from '@/lib/errors';
import { TECHNICAL_QUESTION_COUNT } from '@/constants/interviews';
import { formatDateDMY, formatDateYMD } from '@/utils/date';
import { extractJsonArray, extractJsonObject, parseJson } from '@/utils/json';

export async function listTechnicalInterviews(email) {
  return db
    .select({
      mockId: MockInterview.mockId,
      jobPosition: MockInterview.jobPosition,
      jobExperience: MockInterview.jobExperience,
      createdAt: MockInterview.createdAt,
    })
    .from(MockInterview)
    .where(eq(MockInterview.createdBy, email))
    .orderBy(desc(MockInterview.id));
}

export async function getTechnicalInterview(mockId, email) {
  const [interview] = await db
    .select({
      mockId: MockInterview.mockId,
      jsonMockResp: MockInterview.jsonMockResp,
      jobPosition: MockInterview.jobPosition,
      jobDesc: MockInterview.jobDesc,
      jobExperience: MockInterview.jobExperience,
      createdAt: MockInterview.createdAt,
    })
    .from(MockInterview)
    .where(and(eq(MockInterview.mockId, mockId), eq(MockInterview.createdBy, email)));

  if (!interview) {
    throw notFoundError('Interview not found.');
  }

  const { jsonMockResp, ...summary } = interview;

  return {
    ...summary,
    questions: parseJson(interview.jsonMockResp, 'Stored interview questions are invalid.'),
  };
}

export async function createTechnicalInterview(input, email) {
  const jsonMockResp = await generateTechnicalQuestions(input);
  const mockId = randomUUID();

  const [created] = await db
    .insert(MockInterview)
    .values({
      mockId,
      jsonMockResp,
      jobPosition: input.jobRole,
      jobDesc: input.jobDesc,
      jobExperience: input.jobExp,
      createdBy: email,
      createdAt: formatDateDMY(),
    })
    .returning({ mockId: MockInterview.mockId });

  return created;
}

export async function recordTechnicalAnswer(input, mockId, email) {
  const feedback = await generateTechnicalFeedback(input);

  await db.insert(UserAnswer).values({
    mockIdRef: mockId,
    question: input.question,
    correctAns: input.correctAns,
    userAns: input.userAns,
    feedback: feedback.feedback,
    rating: String(feedback.rating ?? ''),
    userEmail: email,
    createdAt: formatDateYMD(),
  });

  return { recorded: true };
}

export async function listTechnicalFeedback(mockId, email) {
  return db
    .select({
      question: UserAnswer.question,
      correctAns: UserAnswer.correctAns,
      userAns: UserAnswer.userAns,
      feedback: UserAnswer.feedback,
      rating: UserAnswer.rating,
      createdAt: UserAnswer.createdAt,
    })
    .from(UserAnswer)
    .where(and(eq(UserAnswer.mockIdRef, mockId), eq(UserAnswer.userEmail, email)))
    .orderBy(UserAnswer.id);
}

async function generateTechnicalQuestions(input) {
  const prompt = `
    Job Position: ${input.jobRole}
    Job Description: ${input.jobDesc}
    Years of Experience: ${input.jobExp}

    Generate exactly ${TECHNICAL_QUESTION_COUNT} interview questions.
    Return only a JSON array. Each item must include "Question" and "Answer".
  `;

  const response = await generateText(prompt);
  const json = extractJsonArray(response);
  parseJson(json, 'AI returned invalid technical interview questions.');

  return json;
}

async function generateTechnicalFeedback(input) {
  const prompt = `
    Question: ${input.question}
    Candidate Answer: ${input.userAns}
    Correct Answer: ${input.correctAns}

    Evaluate the candidate answer. Return only JSON with "rating" from 1 to 10
    and "feedback" in 3 to 5 lines.
  `;

  const response = await generateText(prompt);
  const json = extractJsonObject(response);
  return parseJson(json, 'AI returned invalid technical feedback.');
}
