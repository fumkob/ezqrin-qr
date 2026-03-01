import Image from 'next/image';
import { notFound } from 'next/navigation';
import { decodeBase64UrlToken, verifyHMACToken } from '@/lib/hmac';
import { generateQRCodeSVG } from '@/lib/qrcode';
import { getQRHMACSecret } from '@/lib/env';

export const dynamic = 'force-dynamic';

const EVENT_NAME = "Festa Tokyo 2026";
const EVENT_VENUE = "東京ドーム 第1ホール";
const EVENT_DATE = "2026.03.01";
const EVENT_ADDRESS = "東京都文京区後楽1丁目3−61";
const EVENT_MAPS_URL = "https://maps.google.com/?q=東京ドーム";

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
    <main className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl overflow-hidden">

        {/* (A) 上部アクセントバー */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 h-2" />

        {/* (B) ヘッダー行 */}
        <div className="flex justify-between items-center px-6 pt-5 pb-2">
          <span className="text-xs tracking-widest text-slate-400 uppercase">Boarding Pass</span>
          <span className="text-xs text-emerald-500 font-semibold">● VALID</span>
        </div>

        {/* (C) イベント情報ブロック */}
        <div className="px-6 pb-5">
          <p className="text-[10px] tracking-widest text-slate-400 uppercase">Event</p>
          <p className="text-2xl font-bold text-slate-800">{EVENT_NAME}</p>
          <div className="flex flex-col gap-3 mt-4">
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">Venue</p>
              <p className="text-sm font-semibold text-slate-700">{EVENT_VENUE}</p>
              <a
                href={EVENT_MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-500 underline"
              >
                {EVENT_ADDRESS}
              </a>
            </div>
            <div>
              <p className="text-[10px] tracking-widest text-slate-400 uppercase">Date</p>
              <p className="text-sm font-semibold text-slate-700">{EVENT_DATE}</p>
            </div>
          </div>
        </div>

        {/* (D) ミシン目セパレーター */}
        <div className="relative mx-0">
          <div className="border-t-2 border-dashed border-slate-200" />
          <div className="w-5 h-5 rounded-full bg-slate-100 absolute -left-2.5 -top-2.5" />
          <div className="w-5 h-5 rounded-full bg-slate-100 absolute -right-2.5 -top-2.5" />
        </div>

        {/* (E) QR コードブロック */}
        <div className="px-6 py-6 flex flex-col items-center">
          <Image
            src={svgDataUrl}
            alt="QR Code"
            width={220}
            height={220}
            unoptimized
          />
          <p className="text-xs text-slate-400 mt-3 text-center">
            このQRコードを会場入口でご提示ください
          </p>
        </div>

        {/* (F) フッターバー */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-6 py-3">
          <p className="text-white text-xs tracking-widest text-center uppercase">
            Admit One · 入場券
          </p>
        </div>

      </div>
    </main>
  );
}
