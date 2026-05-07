import { z } from 'zod';
import { MAX_JOB_EXPERIENCE_YEARS } from '@/constants/interviews';

const trimmedText = z.string().trim().min(1).max(500);

export const createQuestionSetSchema = z.object({
  jobPosition: trimmedText,
  jobDesc: z.string().trim().min(1).max(2000),
  typeQuestion: trimmedText,
  company: trimmedText,
  jobExperience: z.coerce
    .number()
    .int()
    .min(0)
    .max(MAX_JOB_EXPERIENCE_YEARS)
    .transform(String),
});

export const questionSetIdParamSchema = z.object({
  pyqId: z.string().trim().min(1).max(120),
});
