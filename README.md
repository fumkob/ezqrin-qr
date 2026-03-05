# ezQRin QR Server

A stateless Next.js server that verifies HMAC-SHA256 signed tokens issued by ezqrin-server and displays QR codes in a boarding pass-style UI. Designed to be deployed on Vercel.

## How It Works

```
ezqrin-server                          ezqrin-qr (this repo)
─────────────                          ─────────────────────
1. Generate token                      3. Decode base64url token
   raw_token.HMAC-SHA256(secret)       4. Verify HMAC-SHA256 signature
2. Encode as base64url and             5. Generate QR code SVG
   issue /qr/{encoded_token} URL       6. Render boarding pass page
```

- Fully stateless — no database required
- Token format: `{raw_token}.{base64url_hmac_sha256_signature}`
- All verification failures return 404 (prevents information leakage)
- Uses `timingSafeEqual` to prevent timing attacks

## Tech Stack

- **Next.js 16** (App Router, `src/` directory structure)
- **TypeScript** / **Tailwind CSS v4**
- **qrcode** — QR code SVG generation
- **Vitest** — testing
- **proxy.ts** — Next.js 16 convention (successor to middleware.ts)

## Directory Structure

```
src/
├── app/
│   ├── qr/[token]/page.tsx   # QR code boarding pass page (Server Component)
│   ├── layout.tsx             # Root layout (noindex)
│   ├── page.tsx               # Top page (placeholder)
│   └── not-found.tsx          # 404 page
├── lib/
│   ├── hmac.ts                # HMAC-SHA256 verification + base64url decoding
│   ├── qrcode.ts              # QR code generation wrapper
│   ├── env.ts                 # Environment variable retrieval & validation
│   ├── lang.ts                # Language detection from Accept-Language
│   ├── messages.ts            # YAML-based i18n message loader
│   ├── messages/
│   │   ├── ja.yaml            # Japanese messages
│   │   └── en.yaml            # English messages
│   └── __tests__/             # Unit tests
└── proxy.ts                   # Cache-Control headers + language detection
```

## Setup

### Environment Variables

Copy `.env.example` to `.env.local` and fill in the values.

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|----------|----------|-------------|
| `QR_HMAC_SECRET` | Yes | HMAC secret key (min 32 chars, shared with ezqrin-server) |
| `EVENT_NAME` | Yes | Event name |
| `EVENT_VENUE` | Yes | Venue name |
| `EVENT_DATE` | Yes | Event date (e.g. `2026.04.01`) |
| `EVENT_ADDRESS` | Yes | Venue address |
| `EVENT_MAPS_URL` | Yes | Map URL (e.g. Google Maps) |

To generate a secret key:

```bash
openssl rand -base64 32
```

### Development

```bash
npm install
npm run dev    # http://localhost:4000
```

### Testing

```bash
npm test           # single run
npm run test:watch # watch mode
```

### Build & Start

```bash
npm run build
npm start
```

## Deployment

Deploy to Vercel and configure the environment variables. If using Vercel's automatic deployments, simply connect the repository and set the Environment Variables.

## i18n

Language is automatically detected from the browser's `Accept-Language` header. If it starts with `ja`, Japanese is used; otherwise English. Messages are managed as YAML files under `src/lib/messages/`.

## Security

- QR code SVG is base64-encoded and passed to `<Image src>` (XSS prevention)
- `Cache-Control: private, no-store` disables caching on QR pages
- `X-Robots-Tag: noindex, nofollow` prevents search engine indexing
- Root layout sets `robots: { index: false, follow: false }` metadata
