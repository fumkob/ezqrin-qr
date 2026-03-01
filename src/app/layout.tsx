import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'ezQRin - QR Code',
  description: 'イベント参加用QRコード',
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
