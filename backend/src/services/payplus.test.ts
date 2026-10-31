import { describe, it, expect } from 'vitest';
import crypto from 'node:crypto';
import { ipnSignature } from './payplus';

describe('ipnSignature (PayPlus IPN HMAC)', () => {
  const secret = 'test-secret-key';
  const body = { transaction: { status_code: '000', uid: 'tx_1' }, more_info: 'user-1:premium' };

  it('matches an independent HMAC-SHA256/base64 of the JSON body', () => {
    const expected = crypto.createHmac('sha256', secret).update(JSON.stringify(body)).digest('base64');
    expect(ipnSignature(body, secret)).toBe(expected);
  });

  it('changes when the body is tampered with', () => {
    const tampered = { ...body, more_info: 'user-1:basic' };
    expect(ipnSignature(tampered, secret)).not.toBe(ipnSignature(body, secret));
  });

  it('changes with a different secret key', () => {
    expect(ipnSignature(body, 'other-secret')).not.toBe(ipnSignature(body, secret));
  });
});
