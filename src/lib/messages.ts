import { readFileSync } from 'fs';
import { join } from 'path';
import { parse } from 'yaml';
import type { Lang } from '@/lib/lang';

type Messages = {
  qr_instruction: string;
  admit_one: string;
};

const cache = new Map<Lang, Messages>();

export function getMessages(lang: Lang): Messages {
  if (cache.has(lang)) return cache.get(lang)!;
  const raw = readFileSync(join(process.cwd(), `src/lib/messages/${lang}.yaml`), 'utf-8');
  const messages = parse(raw) as Messages;
  cache.set(lang, messages);
  return messages;
}
