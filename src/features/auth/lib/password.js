import bcrypt from "bcryptjs";

const PASSWORD_COST = 12;

export async function hashPassword(password) {
  return bcrypt.hash(password, PASSWORD_COST);
}

export async function verifyPassword(password, passwordHash) {
  if (!passwordHash) {
    await bcrypt.hash(password, PASSWORD_COST);
    return false;
  }

  return bcrypt.compare(password, passwordHash);
}
