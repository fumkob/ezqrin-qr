import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verifies an HMAC-SHA256 signed token.
 * Token format: {raw_token}.{base64url_hmac_sha256_signature}
 * Compatible with ezqrin-server's Go implementation (pkg/crypto/token.go).
 */
export function verifyHMACToken(secret: string, signedToken: string): boolean {
  if (!secret || !signedToken) {
    return false;
  }

  const delimIdx = signedToken.lastIndexOf('.');
  if (delimIdx === -1) {
    return false;
  }

  const rawToken = signedToken.substring(0, delimIdx);
  const providedSig = signedToken.substring(delimIdx + 1);

  if (!rawToken || !providedSig) {
    return false;
  }

  const mac = createHmac('sha256', secret);
  mac.update(rawToken);
  const expectedSig = mac.digest('base64url');

  try {
    return timingSafeEqual(
      Buffer.from(providedSig),
      Buffer.from(expectedSig),
    );
  } catch {
    return false;
  }
}

/**
 * Decodes a base64url-encoded token back to the original string.
 * Returns null if the input is invalid.
 */
export function decodeBase64UrlToken(encoded: string): string | null {
  if (!encoded) {
    return null;
  }

  try {
    const decoded = Buffer.from(encoded, 'base64url').toString('utf-8');
    if (Buffer.from(decoded).toString('base64url') !== encoded) {
      return null;
    }
    return decoded;
  } catch {
    return null;
  }
}
