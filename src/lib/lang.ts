export type Lang = 'ja' | 'en';

export function detectLang(acceptLanguage: string): Lang {
  const primary = acceptLanguage.split(',')[0]?.split(';')[0]?.trim() ?? '';
  return primary.startsWith('ja') ? 'ja' : 'en';
}
