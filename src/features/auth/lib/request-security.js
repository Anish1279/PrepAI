import { headers } from "next/headers";
import { AUTH_COOKIE_NAMES } from "@/features/auth/lib/auth-constants";
import { validationError } from "@/lib/errors";

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export function getRequestMetadata(request) {
  return {
    ipAddress: getClientIp(request),
    userAgent: request.headers.get("user-agent") ?? "",
  };
}

export function assertSameOrigin(request) {
  if (SAFE_METHODS.has(request.method)) {
    return;
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    throw validationError("Missing request origin.");
  }

  const originHost = new URL(origin).host;

  if (originHost !== host) {
    throw validationError("Cross-site requests are not allowed.");
  }
}

export function assertCsrfToken(request) {
  const cookieToken = request.cookies.get(AUTH_COOKIE_NAMES.csrf)?.value;
  const headerToken = request.headers.get("x-csrf-token");

  if (!cookieToken || !headerToken || cookieToken !== headerToken) {
    throw validationError("Invalid CSRF token.");
  }
}

export function sanitizeReturnTo(value) {
  if (!value || typeof value !== "string") {
    return "/dashboard";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  if (value.startsWith("/api/")) {
    return "/dashboard";
  }

  return value;
}

export function getClientIp(request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export async function getServerActionHeaders() {
  return headers();
}
