import { locales, pathInLocale, type Locale } from './ui';

export interface SeoLinks {
  canonical: URL;
  alternates: { hreflang: string; href: URL }[];
}

/**
 * Canonical and hreflang links for a page.
 *
 * A non-English page that has no real translation (`translated` is false) only
 * shows English content, so it points its canonical at the English URL and
 * emits no hreflang alternates. Pages with a real translation are
 * self-canonical and list every language plus x-default.
 */
export function seoLinks(
  locale: Locale,
  pathname: string,
  translated: boolean,
  origin: URL,
): SeoLinks {
  const url = (target: Locale) =>
    new URL(pathInLocale(pathname, target), origin);
  const canonical = locale === 'en' || translated ? url(locale) : url('en');
  const alternates = translated
    ? [
        ...locales.map((code) => ({
          hreflang: code === 'zh' ? 'zh-Hans' : code,
          href: url(code),
        })),
        { hreflang: 'x-default', href: url('en') },
      ]
    : [];
  return { canonical, alternates };
}
