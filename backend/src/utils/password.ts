import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;

/** تشفير كلمة السر — hash a plain password. */
export function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, SALT_ROUNDS);
}

/** التحقق من كلمة السر — compare plain vs hash. */
export function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
