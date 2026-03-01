import QRCode from 'qrcode';

/**
 * Generates a QR code as an SVG string.
 * Uses medium error correction level to match ezqrin-server's Go implementation.
 */
export async function generateQRCodeSVG(data: string): Promise<string> {
  if (!data) {
    throw new Error('QR code data cannot be empty');
  }

  return QRCode.toString(data, {
    type: 'svg',
    errorCorrectionLevel: 'M',
    margin: 2,
    width: 256,
  });
}
