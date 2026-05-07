import { AppError } from "@/lib/errors";

const MIN_SECRET_LENGTH = 32;

export function getAuthEnv() {
  const accessSecret = process.env.AUTH_ACCESS_TOKEN_SECRET;
  const refreshSecret = process.env.AUTH_REFRESH_TOKEN_SECRET;

  if (!isStrongSecret(accessSecret) || !isStrongSecret(refreshSecret)) {
    throw new AppError(
      "Auth secrets are not configured. Set AUTH_ACCESS_TOKEN_SECRET and AUTH_REFRESH_TOKEN_SECRET to high-entropy values.",
      500,
      "AUTH_CONFIG_ERROR"
    );
  }

  return {
    accessSecret,
    refreshSecret,
    appUrl: process.env.NEXT_PUBLIC_APP_URL,
    cookieDomain: process.env.AUTH_COOKIE_DOMAIN,
    isProduction: process.env.NODE_ENV === "production",
  };
}

export function getEncodedSecret(secret) {
  return new TextEncoder().encode(secret);
}

function isStrongSecret(value) {
  return typeof value === "string" && value.length >= MIN_SECRET_LENGTH;
}
