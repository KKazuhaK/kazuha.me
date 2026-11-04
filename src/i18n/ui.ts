import { getRelativeLocaleUrl } from 'astro:i18n';

export const locales = ['en', 'zh'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'en';

const en = {
  navLabel: 'Main',
  nav_home: 'Home',
  nav_projects: 'Projects',
  nav_blog: 'Blog',
  nav_cv: 'CV',
  nav_links: 'Links',
  nav_notes: 'Notes',
  menu: 'Menu',
  close: 'Close',
  contactMe: 'Contact me',
  courseNotes: 'Course Notes',
  allLinks: 'All links',
  email: 'Email',
  github: 'GitHub',
  skipToContent: 'Skip to content',
  opensNewTab: '(opens in a new tab)',
  language: 'Language',
  langEn: 'EN',
  langZh: '中文',
  now: 'Now',
  comingSoon: 'This page is being built.',
  projectsTitle: 'Projects',
  cvTitle: 'CV',
  linksTitle: 'Find me elsewhere',
  notFoundTitle: 'Page not found',
  notFoundBody: 'The page you are looking for does not exist or has moved.',
  backHome: 'Back to home',
} as const;

export type UiKey = keyof typeof en;

const zh: Record<UiKey, string> = {
  navLabel: '主导航',
  nav_home: '首页',
  nav_projects: '项目',
  nav_blog: '博客',
  nav_cv: '简历',
  nav_links: '链接',
  nav_notes: '笔记',
  menu: '菜单',
  close: '关闭',
  contactMe: '联系我',
  courseNotes: '课程笔记',
  allLinks: '所有链接',
  email: '邮箱',
  github: 'GitHub',
  skipToContent: '跳到正文',
  opensNewTab: '（在新标签页打开）',
  language: '语言',
  langEn: 'EN',
  langZh: '中文',
  now: '目前',
  comingSoon: '这个页面正在建设中。',
  projectsTitle: '项目',
  cvTitle: '简历',
  linksTitle: '在别处找到我',
  notFoundTitle: '找不到这个页面',
  notFoundBody: '你访问的页面不存在，或已被移动。',
  backHome: '回到首页',
};

const dictionaries: Record<Locale, Record<UiKey, string>> = { en, zh };

export function getLocale(currentLocale: string | undefined): Locale {
  return (locales as readonly string[]).includes(currentLocale ?? '')
    ? (currentLocale as Locale)
    : defaultLocale;
}

export function t(locale: Locale, key: UiKey): string {
  return dictionaries[locale][key];
}

/** Path for `path` (written without a locale prefix, e.g. "/cv") in `locale`. */
export function localizedPath(locale: Locale, path: string): string {
  return getRelativeLocaleUrl(locale, path === '/' ? '' : path);
}

/** Remove a leading locale segment and any trailing slash; "/" stays "/". */
export function stripLocale(pathname: string): string {
  const parts = pathname.split('/').filter(Boolean);
  if ((locales as readonly string[]).includes(parts[0] ?? '')) parts.shift();
  return '/' + parts.join('/');
}

/** The same page as `pathname`, but in `target` locale. */
export function pathInLocale(pathname: string, target: Locale): string {
  return localizedPath(target, stripLocale(pathname));
}
