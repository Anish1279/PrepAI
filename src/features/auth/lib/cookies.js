import { NextResponse } from "next/server";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  AUTH_COOKIE_NAMES,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/features/auth/lib/auth-constants";
import { createSecureToken } from "@/features/auth/lib/crypto";
import { getAuthEnv } from "@/features/auth/lib/env";

export function setAuthCookies(response, { accessToken, refreshToken }) {
  const env = getAuthEnv();
  const csrfToken = createSecureToken(24);

  response.cookies.set(AUTH_COOKIE_NAMES.access, accessToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: ACCESS_TOKEN_TTL_SECONDS,
    path: "/",
    domain: env.cookieDomain,
  });

  response.cookies.set(AUTH_COOKIE_NAMES.refresh, refreshToken, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
    path: "/api/auth",
    domain: env.cookieDomain,
  });

  response.cookies.set(AUTH_COOKIE_NAMES.csrf, csrfToken, {
    httpOnly: false,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_TTL_SECONDS,
    path: "/",
    domain: env.cookieDomain,
  });

  return response;
}

export function clearAuthCookies(response = NextResponse.json({ data: { ok: true } })) {
  const env = getAuthEnv();
  const base = {
    maxAge: 0,
    expires: new Date(0),
    domain: env.cookieDomain,
  };

  response.cookies.set(AUTH_COOKIE_NAMES.access, "", {
    ...base,
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
  });

  response.cookies.set(AUTH_COOKIE_NAMES.refresh, "", {
    ...base,
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/api/auth",
  });

  response.cookies.set(AUTH_COOKIE_NAMES.csrf, "", {
    ...base,
    httpOnly: false,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
  });

  return response;
}

export function getCookieValue(cookieStore, name) {
  return cookieStore.get(name)?.value;
}
