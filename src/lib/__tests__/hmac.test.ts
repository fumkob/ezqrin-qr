import { createHmac } from 'crypto';
import { describe, it, expect } from 'vitest';
import { verifyHMACToken, decodeBase64UrlToken } from '../hmac';

const TEST_SECRET = 'test-secret-key-that-is-at-least-32-characters-long';

// Helper: generate a valid signed token for testing
// Matches Go format: {raw_token}.{base64url_hmac_sha256}
function makeSignedToken(secret: string, rawToken: string): string {
  const mac = createHmac('sha256', secret);
  mac.update(rawToken);
  const sig = mac.digest('base64url');
  return `${rawToken}.${sig}`;
}

describe('verifyHMACToken', () => {
  it('should return true for a valid signed token', () => {
    const rawToken = 'evt_550e8400_prt_770e8400_a1b2c3d4e5f6';
    const signedToken = makeSignedToken(TEST_SECRET, rawToken);
    expect(verifyHMACToken(TEST_SECRET, signedToken)).toBe(true);
  });

  it('should return false for a tampered raw token', () => {
    const rawToken = 'evt_550e8400_prt_770e8400_a1b2c3d4e5f6';
    const signedToken = makeSignedToken(TEST_SECRET, rawToken);
    const tampered = 'evt_XXXXXXXX_prt_770e8400_a1b2c3d4e5f6' + signedToken.substring(signedToken.lastIndexOf('.'));
    expect(verifyHMACToken(TEST_SECRET, tampered)).toBe(false);
  });

  it('should return false for a tampered signature', () => {
    const rawToken = 'evt_550e8400_prt_770e8400_a1b2c3d4e5f6';
    const signedToken = makeSignedToken(TEST_SECRET, rawToken);
    const tampered = signedToken.slice(0, -4) + 'XXXX';
    expect(verifyHMACToken(TEST_SECRET, tampered)).toBe(false);
  });

  it('should return false for wrong secret', () => {
    const rawToken = 'evt_550e8400_prt_770e8400_a1b2c3d4e5f6';
    const signedToken = makeSignedToken(TEST_SECRET, rawToken);
    expect(verifyHMACToken('wrong-secret-that-is-32-characters-long!!', signedToken)).toBe(false);
  });

  it('should return false for token without delimiter', () => {
    expect(verifyHMACToken(TEST_SECRET, 'no-delimiter-here')).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(verifyHMACToken(TEST_SECRET, '')).toBe(false);
  });

  it('should return false for empty secret', () => {
    const signedToken = makeSignedToken(TEST_SECRET, 'some-token');
    expect(verifyHMACToken('', signedToken)).toBe(false);
  });

  it('should return false when raw token is empty (starts with dot)', () => {
    expect(verifyHMACToken(TEST_SECRET, '.somesignature')).toBe(false);
  });

  it('should return false when signature is empty (ends with dot)', () => {
    expect(verifyHMACToken(TEST_SECRET, 'sometoken.')).toBe(false);
  });

  it('should use last dot as delimiter (token may contain dots)', () => {
    const rawToken = 'part1.part2';
    const signedToken = makeSignedToken(TEST_SECRET, rawToken);
    expect(verifyHMACToken(TEST_SECRET, signedToken)).toBe(true);
  });
});

describe('decodeBase64UrlToken', () => {
  it('should decode a valid base64url-encoded token', () => {
    const original = 'evt_550e8400_prt_770e8400_a1b2c3d4e5f6.signature123';
    const encoded = Buffer.from(original).toString('base64url');
    expect(decodeBase64UrlToken(encoded)).toBe(original);
  });

  it('should return null for invalid base64url', () => {
    expect(decodeBase64UrlToken('!!!invalid!!!')).toBeNull();
  });

  it('should return null for empty string', () => {
    expect(decodeBase64UrlToken('')).toBeNull();
  });

  it('should handle tokens with special characters after decoding', () => {
    const original = 'evt_abcdefgh_prt_12345678_aabbccddee.HMAC_SIG-test_value';
    const encoded = Buffer.from(original).toString('base64url');
    expect(decodeBase64UrlToken(encoded)).toBe(original);
  });
});
