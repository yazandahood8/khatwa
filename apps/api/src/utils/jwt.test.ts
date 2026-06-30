import { describe, it, expect } from 'vitest';
import { signToken, verifyToken } from './jwt';

describe('jwt', () => {
  it('round-trips a payload', () => {
    const token = signToken({ sub: 'user-1', role: 'student' as never });
    const decoded = verifyToken(token);
    expect(decoded.sub).toBe('user-1');
    expect(decoded.role).toBe('student');
  });

  it('rejects a tampered token', () => {
    const token = signToken({ sub: 'user-1', role: 'admin' as never });
    expect(() => verifyToken(token + 'x')).toThrow();
  });

  it('rejects a malformed token', () => {
    expect(() => verifyToken('not.a.real.token')).toThrow();
  });
});
