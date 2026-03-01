import Image from 'next/image';
import { notFound } from 'next/navigation';
import { decodeBase64UrlToken, verifyHMACToken } from '@/lib/hmac';
import { generateQRCodeSVG } from '@/lib/qrcode';
import { getQRHMACSecret } from '@/lib/env';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function QRCodePage({ params }: PageProps) {
  const { token: encodedToken } = await params;

  // 1. Decode base64url token
  const qrToken = decodeBase64UrlToken(encodedToken);
  if (!qrToken) {
    notFound();
  }

  // 2. Verify HMAC signature
  const secret = getQRHMACSecret();
  if (!verifyHMACToken(secret, qrToken)) {
    notFound();
  }

  // 3. Generate QR code SVG and embed as base64 data URL (no dangerouslySetInnerHTML needed)
  const svgString = await generateQRCodeSVG(qrToken);
  const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgString).toString('base64')}`;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-8">
      <div className="w-full max-w-sm">
        <Image
          src={svgDataUrl}
          alt="QR Code"
          width={256}
          height={256}
          className="mx-auto"
          unoptimized
        />
        <p className="mt-6 text-center text-gray-600 text-sm">
          このQRコードを会場で提示してください
        </p>
      </div>
    </main>
  );
}
