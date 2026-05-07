import { decodeJwt } from "jose/jwt/decode";
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from "@/features/auth/lib/auth-constants";
import { getAuthEnv, getEncodedSecret } from "@/features/auth/lib/env";
import { createUuid, hashToken } from "@/features/auth/lib/crypto";

const ACCESS_AUDIENCE = "prepai:web";
const REFRESH_AUDIENCE = "prepai:refresh";
const ISSUER = "prepai";

export async function createAccessToken({ user, sessionId }) {
  const { accessSecret } = getAuthEnv();
  const tokenId = createUuid();

  const token = await new SignJWT({
    email: user.email,
    role: user.role,
    sid: sessionId,
    typ: "access",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(ISSUER)
    .setAudience(ACCESS_AUDIENCE)
    .setSubject(user.id)
    .setJti(tokenId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TOKEN_TTL_SECONDS}s`)
    .sign(getEncodedSecret(accessSecret));

  return { token, tokenId };
}

export async function createRefreshToken({ userId, sessionId, familyId, tokenId = createUuid() }) {
  const { refreshSecret } = getAuthEnv();

  const token = await new SignJWT({
    sid: sessionId,
    fid: familyId,
    typ: "refresh",
  })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuer(ISSUER)
    .setAudience(REFRESH_AUDIENCE)
    .setSubject(userId)
    .setJti(tokenId)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TOKEN_TTL_SECONDS}s`)
    .sign(getEncodedSecret(refreshSecret));

  return {
    token,
    tokenId,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_SECONDS * 1000),
  };
}

export async function verifyAccessToken(token) {
  const { accessSecret } = getAuthEnv();
  const { payload } = await jwtVerify(token, getEncodedSecret(accessSecret), {
    issuer: ISSUER,
    audience: ACCESS_AUDIENCE,
  });

  if (payload.typ !== "access") {
    throw new Error("Invalid token type.");
  }

  return payload;
}

export async function verifyRefreshToken(token) {
  const { refreshSecret } = getAuthEnv();
  const { payload } = await jwtVerify(token, getEncodedSecret(refreshSecret), {
    issuer: ISSUER,
    audience: REFRESH_AUDIENCE,
  });

  if (payload.typ !== "refresh") {
    throw new Error("Invalid token type.");
  }

  return payload;
}

export function decodeTokenUnsafe(token) {
  try {
    return decodeJwt(token);
  } catch {
    return null;
  }
}
