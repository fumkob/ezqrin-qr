import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { detectLang } from '@/lib/lang';

export function proxy(request: NextRequest) {
  const lang = detectLang(request.headers.get('accept-language') ?? '');

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-lang', lang);

  const response = NextResponse.next({ request: { headers: requestHeaders } });

  if (request.nextUrl.pathname.startsWith('/qr/')) {
    response.headers.set('Cache-Control', 'private, no-store');
    response.headers.set('X-Robots-Tag', 'noindex, nofollow');
  }

  return response;
}

export const config = {
  matcher: '/qr/:path*',
};
