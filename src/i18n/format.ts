import { t, type Locale } from './ui';

const intlLocale: Record<Locale, string> = { en: 'en-US', zh: 'zh-CN' };

/** "2026-06" -> "Jun 2026"; "2026" -> "2026". Also accepts a Date. */
export function formatMonth(value: string | Date, locale: Locale): string {
  if (typeof value === 'string' && /^\d{4}$/.test(value)) return value;
  const date =
    typeof value === 'string'
      ? new Date(`${value.slice(0, 7)}-01T00:00:00Z`)
      : value;
  return new Intl.DateTimeFormat(intlLocale[locale], {
    month: 'short',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date);
}

/** "2026-01" + undefined -> "Jan 2026 – present" */
export function formatPeriod(
  start: string,
  end: string | undefined,
  locale: Locale,
): string {
  const to = end ? formatMonth(end, locale) : t(locale, 'present');
  return `${formatMonth(start, locale)} – ${to}`;
}
