import { AppError } from "@/lib/errors";
import { getClientIp } from "@/features/auth/lib/request-security";

const memoryStore = globalThis.__prepaiRateLimitStore ?? new Map();
globalThis.__prepaiRateLimitStore = memoryStore;

export const RATE_LIMITS = {
  login: { limit: 5, windowMs: 15 * 60 * 1000 },
  signup: { limit: 8, windowMs: 60 * 60 * 1000 },
  refresh: { limit: 30, windowMs: 15 * 60 * 1000 },
  passwordReset: { limit: 3, windowMs: 60 * 60 * 1000 },
};

export async function assertRateLimit(request, bucket, options) {
  const ip = getClientIp(request);
  const key = `${bucket}:${ip}`;
  const result = await consumeRateLimit(key, options);

  if (!result.allowed) {
    throw new AppError(
      "Too many attempts. Please wait a few minutes and try again.",
      429,
      "RATE_LIMITED"
    );
  }

  return result;
}

async function consumeRateLimit(key, { limit, windowMs }) {
  if (process.env.REDIS_REST_URL && process.env.REDIS_REST_TOKEN) {
    return consumeRedisRateLimit(key, { limit, windowMs });
  }

  return consumeMemoryRateLimit(key, { limit, windowMs });
}

function consumeMemoryRateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  const current = memoryStore.get(key);

  if (!current || current.resetAt <= now) {
    memoryStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (current.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: current.resetAt };
  }

  current.count += 1;
  memoryStore.set(key, current);

  return { allowed: true, remaining: limit - current.count, resetAt: current.resetAt };
}

async function consumeRedisRateLimit(key, { limit, windowMs }) {
  const redisKey = `rate:${key}`;
  const response = await fetch(`${process.env.REDIS_REST_URL}/pipeline`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify([
      ["INCR", redisKey],
      ["PEXPIRE", redisKey, windowMs, "NX"],
      ["PTTL", redisKey],
    ]),
  });

  if (!response.ok) {
    return consumeMemoryRateLimit(key, { limit, windowMs });
  }

  const [countResult, , ttlResult] = await response.json();
  const count = Number(countResult.result ?? 1);
  const ttl = Number(ttlResult.result ?? windowMs);

  return {
    allowed: count <= limit,
    remaining: Math.max(0, limit - count),
    resetAt: Date.now() + ttl,
  };
}
