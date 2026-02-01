/**
 * Internacionalização PT/EN.
 * Usar t(key, lang) para obter traduções.
 * Suporta chaves aninhadas: t('proposal.title', 'en') -> "Fee Proposal"
 */

export type Lang = 'pt' | 'en';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Translations = Record<string, any>;

import { pt } from './pt';
import { en } from './en';

const translations: Record<Lang, Translations> = { pt, en };

function get(obj: Translations, path: string): string | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const k of keys) {
    if (current == null || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[k];
  }
  return typeof current === 'string' ? current : undefined;
}

/** Traduz uma chave para o idioma indicado */
export function t(key: string, lang: Lang): string {
  const val = get(translations[lang], key);
  if (val) return val;
  const fallback = get(translations.pt, key);
  return fallback ?? key;
}

/** Formata moeda conforme o idioma */
export function formatCurrency(value: number, lang: Lang): string {
  const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
  return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(value);
}

/** Formata data conforme o idioma */
export function formatDate(date: Date, lang: Lang): string {
  const locale = lang === 'en' ? 'en-GB' : 'pt-PT';
  return date.toLocaleDateString(locale, { day: '2-digit', month: 'long', year: 'numeric' });
}

export { pt, en };
