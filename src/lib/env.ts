let cachedSecret: string | undefined;

export function getQRHMACSecret(): string {
  if (cachedSecret !== undefined) return cachedSecret;
  const secret = process.env.QR_HMAC_SECRET;
  if (!secret) {
    throw new Error('QR_HMAC_SECRET environment variable is required');
  }
  if (secret.length < 32) {
    throw new Error('QR_HMAC_SECRET must be at least 32 characters');
  }
  cachedSecret = secret;
  return cachedSecret;
}
