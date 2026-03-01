import type { NextConfig } from 'next';
import path from 'path';

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  outputFileTracingIncludes: {
    '/qr/[token]': ['./src/lib/messages/*.yaml'],
  },
};

export default nextConfig;
