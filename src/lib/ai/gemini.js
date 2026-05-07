import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { AppError } from '@/lib/errors';

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];
const MAX_OUTPUT_TOKENS = 8192;
const AI_TIMEOUT_MS = 15000;
const AI_TIMEOUT_MESSAGE = 'AI is taking too long — please try again';
const MAX_ATTEMPTS_PER_MODEL = 2;
const RETRYABLE_STATUSES = new Set([429, 500, 502, 503, 504]);

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: MAX_OUTPUT_TOKENS,
  responseMimeType: 'text/plain',
};

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  },
];

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new AppError('Gemini API key is not configured.', 500, 'AI_CONFIG_ERROR');
  }

  return new GoogleGenerativeAI(apiKey);
}

export async function generateText(prompt) {
  const result = await withAiTimeout(() =>
    runWithModelFallback(async (model) => {
      const chat = model.startChat({ generationConfig, safetySettings });
      return chat.sendMessage(prompt);
    })
  );

  return result.response.text();
}

export async function transcribeAudio(base64Audio, mimeType) {
  const result = await withAiTimeout(() =>
    runWithModelFallback((model) =>
      model.generateContent([
        'Transcribe the following audio:',
        { inlineData: { data: base64Audio, mimeType } },
      ])
    )
  );

  return result.response.text();
}

async function runWithModelFallback(runRequest) {
  const client = getGeminiClient();
  let lastError;

  for (const modelName of GEMINI_MODELS) {
    const model = client.getGenerativeModel({ model: modelName });

    for (let attempt = 1; attempt <= MAX_ATTEMPTS_PER_MODEL; attempt += 1) {
      try {
        return await runRequest(model);
      } catch (error) {
        lastError = error;

        if (!shouldRetryAiRequest(error) && !isMissingModelError(error)) {
          throw normalizeAiError(error);
        }

        if (attempt < MAX_ATTEMPTS_PER_MODEL) {
          await sleep(400 * attempt);
        }
      }
    }
  }

  throw normalizeAiError(lastError);
}

function withAiTimeout(runRequest) {
  let timeoutId;

  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => {
      reject(new AppError(AI_TIMEOUT_MESSAGE, 504, 'AI_TIMEOUT'));
    }, AI_TIMEOUT_MS);
  });

  return Promise.race([runRequest(), timeout]).finally(() => clearTimeout(timeoutId));
}

function shouldRetryAiRequest(error) {
  return RETRYABLE_STATUSES.has(error?.status);
}

function isMissingModelError(error) {
  return error?.status === 404;
}

function normalizeAiError(error) {
  if (error instanceof AppError) {
    return error;
  }

  if (error?.status === 401 || error?.status === 403) {
    return new AppError(
      'Gemini API key is invalid or not allowed. Check your environment variables.',
      502,
      'AI_AUTH_ERROR'
    );
  }

  if (error?.status === 429) {
    return new AppError(
      'AI quota is rate-limited right now — please try again shortly.',
      429,
      'AI_RATE_LIMITED'
    );
  }

  if (shouldRetryAiRequest(error)) {
    return new AppError(
      'AI service is busy right now — please try again.',
      503,
      'AI_UNAVAILABLE'
    );
  }

  return new AppError('AI request failed. Please try again.', 502, 'AI_REQUEST_ERROR');
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
