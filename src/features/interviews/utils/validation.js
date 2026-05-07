import { z } from 'zod';
import { MAX_JOB_EXPERIENCE_YEARS, MIN_ANSWER_LENGTH } from '@/constants/interviews';

const trimmedText = z.string().trim().min(1).max(500);

export const createTechnicalInterviewSchema = z.object({
  jobRole: trimmedText,
  jobDesc: z.string().trim().min(1).max(2000),
  jobExp: z.coerce
    .number()
    .int()
    .min(0)
    .max(MAX_JOB_EXPERIENCE_YEARS)
    .transform(String),
});

export const technicalAnswerSchema = z.object({
  question: z.string().trim().min(1).max(3000),
  correctAns: z.string().trim().min(1).max(5000),
  userAns: z.string().trim().min(MIN_ANSWER_LENGTH).max(10000),
});

export const interviewIdParamSchema = z.object({
  interviewId: z.string().trim().min(1).max(120),
});
