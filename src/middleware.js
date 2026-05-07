import { jwtVerify } from "jose/jwt/verify";
import { NextResponse } from "next/server";

const ACCESS_COOKIE = "prepai_access";
const AUTH_ROUTES = ["/sign-in", "/sign-up", "/forgot-password", "/reset-password"];
const PROTECTED_PAGE_PREFIXES = ["/dashboard", "/forum"];
const PROTECTED_API_PREFIXES = ["/api/interviews", "/api/questions", "/api/ai"];
const ADMIN_PREFIXES = ["/dashboard/admin", "/api/admin"];
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (!SAFE_METHODS.has(request.method) && !isSameOrigin(request)) {
    return NextResponse.json(
      { error: { code: "CSRF_BLOCKED", message: "Cross-site requests are not allowed." } },
      { status: 403 }
    );
  }

  const accessPayload = await readAccessPayload(request);

  if (isAuthRoute(pathname) && accessPayload) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isProtectedApi(pathname)) {
    if (!accessPayload) {
      return NextResponse.json(
        { error: { code: "UNAUTHORIZED", message: "Authentication required." } },
        { status: 401 }
      );
    }

    if (isAdminRoute(pathname) && accessPayload.role !== "admin") {
      return NextResponse.json(
        { error: { code: "FORBIDDEN", message: "You do not have permission to access this resource." } },
        { status: 403 }
      );
    }
  }

  if (isProtectedPage(pathname)) {
    if (!accessPayload) {
      const returnTo = `${request.nextUrl.pathname}${request.nextUrl.search}`;
      return NextResponse.redirect(
        new URL(`/api/auth/refresh?returnTo=${encodeURIComponent(returnTo)}`, request.url)
      );
    }

    if (isAdminRoute(pathname) && accessPayload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

async function readAccessPayload(request) {
  const token = request.cookies.get(ACCESS_COOKIE)?.value;
  const secret = process.env.AUTH_ACCESS_TOKEN_SECRET;

  if (!token || !secret) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), {
      issuer: "prepai",
      audience: "prepai:web",
    });

    return payload.typ === "access" ? payload : null;
  } catch {
    return null;
  }
}

function isSameOrigin(request) {
  const origin = request.headers.get("origin");

  if (!origin) {
    return true;
  }

  return new URL(origin).host === request.headers.get("host");
}

function isAuthRoute(pathname) {
  return AUTH_ROUTES.some((route) => pathname.startsWith(route));
}

function isProtectedPage(pathname) {
  return PROTECTED_PAGE_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isProtectedApi(pathname) {
  return PROTECTED_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

function isAdminRoute(pathname) {
  return ADMIN_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
