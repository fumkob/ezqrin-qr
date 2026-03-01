import { describe, it, expect } from 'vitest';
import { generateQRCodeSVG } from '../qrcode';

describe('generateQRCodeSVG', () => {
  it('should generate valid SVG string', async () => {
    const svg = await generateQRCodeSVG('test-token-data');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('should generate non-trivial SVG content', async () => {
    const token = 'evt_550e8400_prt_770e8400_a1b2c3d4e5f6.signature';
    const svg = await generateQRCodeSVG(token);
    expect(svg.length).toBeGreaterThan(100);
    expect(svg).toContain('<svg');
  });

  it('should throw for empty token', async () => {
    await expect(generateQRCodeSVG('')).rejects.toThrow();
  });
});
