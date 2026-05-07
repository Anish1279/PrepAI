import { randomUUID } from 'crypto';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { CodingFeedback, CodingInterview } from '@/lib/db/schema';
import { generateText } from '@/lib/ai/gemini';
import { AppError, isAppError, notFoundError } from '@/lib/errors';
import { formatDateDMY } from '@/utils/date';
import { extractJsonObject, parseJson } from '@/utils/json';

const NO_SOLUTION_FEEDBACK = {
  message: 'No solution submitted',
  correctness: 'No solution was submitted, so correctness could not be evaluated.',
  approach: 'No approach was provided.',
  efficiency: 'No time or space complexity can be assessed without a submitted solution.',
  code_quality: 'No code was submitted for review.',
  optimization: 'Submit a working solution so optimization opportunities can be reviewed.',
  overall_feedback: 'No solution submitted. Please try the challenge again and submit code for feedback.',
};

const AI_FEEDBACK_FALLBACK = {
  message: 'Feedback could not be generated automatically.',
  correctness: 'The AI response could not be parsed reliably.',
  approach: 'Please review your solution manually against the expected approach.',
  efficiency: 'Complexity feedback is unavailable for this submission.',
  code_quality: 'Code-quality feedback is unavailable for this submission.',
  optimization: 'Optimization feedback is unavailable for this submission.',
  overall_feedback: 'Your code was saved, but automated feedback could not be generated. Please try again later.',
};

export async function listCodingInterviews(email) {
  try {
    return await db
      .select({
        mockId: CodingInterview.mockId,
        jobPosition: CodingInterview.jobPosition,
        language: CodingInterview.language,
        jobExperience: CodingInterview.jobExperience,
        createdAt: CodingInterview.createdAt,
      })
      .from(CodingInterview)
      .where(eq(CodingInterview.createdBy, email))
      .orderBy(desc(CodingInterview.id));
  } catch (error) {
    throw databaseError('Could not load coding rounds — try refreshing.', error);
  }
}

export async function getCodingInterview(mockId, email) {
  const [interview] = await safeDb(
    () => db
      .select({
        mockId: CodingInterview.mockId,
        jsonMockResp: CodingInterview.jsonMockResp,
        jobPosition: CodingInterview.jobPosition,
        language: CodingInterview.language,
        jobExperience: CodingInterview.jobExperience,
        createdAt: CodingInterview.createdAt,
      })
      .from(CodingInterview)
      .where(and(eq(CodingInterview.mockId, mockId), eq(CodingInterview.createdBy, email))),
    'Could not load this coding round. Please try again.'
  );

  if (!interview) {
    throw notFoundError('Coding interview not found.');
  }

  const parsed = parseJson(interview.jsonMockResp, 'Stored coding interview is invalid.');
  const { jsonMockResp, ...summary } = interview;

  return {
    ...summary,
    question: parsed.question,
    codeSolution: parsed.code_solution,
  };
}

export async function createCodingInterview(input, email) {
  const jsonMockResp = await generateCodingProblem(input);
  const mockId = randomUUID();

  const [created] = await safeDb(
    () => db
      .insert(CodingInterview)
      .values({
        mockId,
        jsonMockResp,
        jobPosition: input.jobPosition,
        language: input.language,
        jobExperience: input.jobExperience,
        createdBy: email,
        createdAt: formatDateDMY(),
      })
      .returning({ mockId: CodingInterview.mockId }),
    'Could not save coding round. Please try again.'
  );

  return created;
}

export async function submitCodingAnswer(input, mockId, email) {
  const userSolution = input.userSolution?.trim() ?? '';
  const feedback =
    userSolution.length < 5
      ? NO_SOLUTION_FEEDBACK
      : await getFeedbackOrFallback({ ...input, userSolution });

  await safeDb(
    () => db.insert(CodingFeedback).values({
      mockIdRef: mockId,
      question: JSON.stringify(input.question),
      correctAns: JSON.stringify(input.correctAns),
      userAns: userSolution,
      feedback: JSON.stringify(feedback),
      userEmail: email,
      createdAt: formatDateDMY(),
    }),
    'Could not save coding feedback. Please try again.'
  );

  return { recorded: true };
}

export async function getLatestCodingFeedback(mockId, email) {
  const [feedback] = await safeDb(
    () => db
      .select({
        correctAns: CodingFeedback.correctAns,
        feedback: CodingFeedback.feedback,
        createdAt: CodingFeedback.createdAt,
        language: CodingInterview.language,
      })
      .from(CodingFeedback)
      .innerJoin(
        CodingInterview,
        and(
          eq(CodingFeedback.mockIdRef, CodingInterview.mockId),
          eq(CodingInterview.createdBy, email)
        )
      )
      .where(and(eq(CodingFeedback.mockIdRef, mockId), eq(CodingFeedback.userEmail, email)))
      .orderBy(desc(CodingFeedback.id))
      .limit(1),
    'Could not load coding feedback. Please try again.'
  );

  if (!feedback) {
    throw notFoundError('Coding feedback not found.');
  }

  return {
    ...feedback,
    correctAnswer: parseJson(feedback.correctAns, 'Stored coding answer is invalid.'),
    solutionFeedback: parseJson(feedback.feedback, 'Stored coding feedback is invalid.'),
  };
}

async function generateCodingProblem(input) {
  const prompt = `
    Create one coding problem for a mock interview.
    Job position: ${input.jobPosition}
    Years of experience: ${input.jobExperience}
    Language: ${input.language}

    Return only JSON in this structure:
    {
      "question": {
        "title": "",
        "difficulty": "",
        "description": "",
        "input_format": "",
        "output_format": "",
        "constraints": "",
        "sample_input": ["", ""],
        "sample_output": ["", ""],
        "explanation": "",
        "platform": "",
        "hint": ""
      },
      "code_solution": {
        "explanation": "",
        "code": "",
        "time_complexity": "",
        "other_approach": ""
      }
    }
  `;

  const response = await generateText(prompt);
  const json = extractJsonObject(response);
  parseJson(json, 'AI returned an invalid coding problem.');

  return json;
}

async function generateCodingFeedback(input) {
  const prompt = `
    Coding question title: ${input.question.title}
    Description: ${input.question.description}
    Sample Input: ${input.question.sample_input?.[0] ?? ''}
    Sample Output: ${input.question.sample_output?.[0] ?? ''}
    Candidate solution: ${input.userSolution}

    Return only JSON with these fields:
    message, correctness, approach, efficiency, code_quality, optimization, overall_feedback.
  `;

  const response = await generateText(prompt);
  const json = extractJsonObject(response);
  return parseJson(json, 'AI returned invalid coding feedback.');
}

async function getFeedbackOrFallback(input) {
  try {
    return await generateCodingFeedback(input);
  } catch (error) {
    if (isAppError(error) && ['AI_TIMEOUT', 'AI_CONFIG_ERROR'].includes(error.code)) {
      throw error;
    }

    console.error('Failed to generate coding feedback:', error);
    return AI_FEEDBACK_FALLBACK;
  }
}

async function safeDb(runQuery, message) {
  try {
    return await runQuery();
  } catch (error) {
    throw databaseError(message, error);
  }
}

function databaseError(message, error) {
  console.error(message, error);
  return new AppError(message, 500, 'DATABASE_ERROR');
}
