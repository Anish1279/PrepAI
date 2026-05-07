import { createHash, randomBytes, randomUUID } from "crypto";

export function createUuid() {
  return randomUUID();
}

export function createSecureToken(bytes = 32) {
  return randomBytes(bytes).toString("base64url");
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}
