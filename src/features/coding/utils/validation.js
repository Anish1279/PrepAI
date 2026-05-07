import { z } from 'zod';
import { MAX_JOB_EXPERIENCE_YEARS } from '@/constants/interviews';

const trimmedText = z.string().trim().min(1).max(500);

export const createCodingInterviewSchema = z.object({
  jobPosition: trimmedText,
  language: trimmedText,
  jobExperience: z.coerce
    .number()
    .int()
    .min(0)
    .max(MAX_JOB_EXPERIENCE_YEARS),
});

export const codingSubmissionSchema = z.object({
  question: z.object({
    title: z.string().trim().min(1).max(500),
    description: z.string().trim().min(1).max(5000),
    sample_input: z.array(z.string()).default([]),
    sample_output: z.array(z.string()).default([]),
  }).passthrough(),
  correctAns: z.object({
    code: z.string().optional(),
  }).passthrough(),
  userSolution: z.string().trim().max(20000).optional().default(""),
});

export const codingInterviewIdParamSchema = z.object({
  interviewId: z.string().trim().min(1).max(120),
});
