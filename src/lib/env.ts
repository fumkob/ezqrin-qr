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

export interface EventInfo {
  name: string;
  venue: string;
  date: string;
  address: string;
  mapsUrl: string;
}

export function getEventInfo(): EventInfo {
  const name = process.env.EVENT_NAME;
  const venue = process.env.EVENT_VENUE;
  const date = process.env.EVENT_DATE;
  const address = process.env.EVENT_ADDRESS;
  const mapsUrl = process.env.EVENT_MAPS_URL;

  if (!name || !venue || !date || !address || !mapsUrl) {
    throw new Error(
      'Missing required event environment variables: EVENT_NAME, EVENT_VENUE, EVENT_DATE, EVENT_ADDRESS, EVENT_MAPS_URL'
    );
  }

  return { name, venue, date, address, mapsUrl };
}
