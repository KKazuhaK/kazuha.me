import { getEnabledNav } from './site';
import { localizedPath, stripLocale, t, type Locale } from '../i18n/ui';

export interface ResolvedNavItem {
  key: string;
  label: string;
  mobileLabel: string;
  href: string;
  external: boolean;
  active: boolean;
}

/** Enabled nav items with locale-aware hrefs, labels and the active flag. */
export function resolveNav(
  locale: Locale,
  pathname: string,
): ResolvedNavItem[] {
  const current = stripLocale(pathname);
  return getEnabledNav().map((item) => {
    const external = item.external === true;
    const active =
      !external &&
      (item.href === '/'
        ? current === '/'
        : current === item.href || current.startsWith(item.href + '/'));
    return {
      key: item.key,
      label: t(locale, item.labelKey),
      mobileLabel: t(locale, item.mobileLabelKey ?? item.labelKey),
      href: external ? item.href : localizedPath(locale, item.href),
      external,
      active,
    };
  });
}
