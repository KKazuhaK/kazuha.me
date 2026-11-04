import type { UiKey } from '../i18n/ui';

export type NavKey = 'home' | 'projects' | 'blog' | 'cv' | 'links' | 'notes';

export interface NavItem {
  key: NavKey;
  /** UI string key for the desktop label. */
  labelKey: UiKey;
  /** Optional longer label used in the mobile menu. */
  mobileLabelKey?: UiKey;
  /** Internal path without locale prefix, or an absolute URL when `external`. */
  href: string;
  enabled: boolean;
  external?: boolean;
}

/** Marker for values the owner has not provided yet. */
export const PLACEHOLDER = '[占位]';

const notesUrl = 'https://ics.uci.edu/~kazuhak/';

const nav: NavItem[] = [
  { key: 'home', labelKey: 'nav_home', href: '/', enabled: true },
  {
    key: 'projects',
    labelKey: 'nav_projects',
    href: '/projects',
    enabled: true,
  },
  { key: 'blog', labelKey: 'nav_blog', href: '/blog', enabled: false },
  { key: 'cv', labelKey: 'nav_cv', href: '/cv', enabled: true },
  { key: 'links', labelKey: 'nav_links', href: '/links', enabled: true },
  {
    key: 'notes',
    labelKey: 'nav_notes',
    mobileLabelKey: 'courseNotes',
    href: notesUrl,
    enabled: true,
    external: true,
  },
];

export const site = {
  url: 'https://kazuha.me',
  name: 'Kazuha Mo',
  tagline: 'Software · AI systems · infrastructure',
  now: { label: 'CS undergraduate', org: 'UC Irvine' },
  intro:
    'I build AI systems and MCP tools, run my own infrastructure, and teach as a Learning Assistant.',
  role: { title: 'Founding Engineer, AI Systems', org: 'Anchan' },
  avatar: PLACEHOLDER,
  cv: { updated: PLACEHOLDER, pdf: PLACEHOLDER },
  email: PLACEHOLDER,
  social: {
    github: 'https://github.com/KKazuhaK',
    linkedin: PLACEHOLDER,
  },
  notesUrl,
  nav,
};

/** True when a value is missing or contains the placeholder marker. */
export function isPlaceholder(value: string | null | undefined): boolean {
  return !value || value.includes(PLACEHOLDER);
}

export function getEnabledNav(): NavItem[] {
  return site.nav.filter((item) => item.enabled);
}
