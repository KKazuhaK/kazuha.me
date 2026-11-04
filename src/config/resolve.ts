import { isPlaceholder, site } from './site';

/**
 * Data files may use a sentinel instead of repeating a URL that lives in
 * site.ts. Returns the real URL, or null when it is missing or a placeholder.
 */
export function resolveUrl(url: string | undefined): string | null {
  if (!url) return null;
  let resolved: string;
  switch (url) {
    case 'notes':
      resolved = site.notesUrl;
      break;
    case 'github':
      resolved = site.social.github;
      break;
    case 'linkedin':
      resolved = site.social.linkedin;
      break;
    case 'email':
      resolved = isPlaceholder(site.email) ? '' : `mailto:${site.email}`;
      break;
    default:
      resolved = url;
  }
  return isPlaceholder(resolved) ? null : resolved;
}

/** True for an absolute http(s) URL on a different host than the site. */
export function isExternalUrl(url: string): boolean {
  if (!/^https?:\/\//i.test(url)) return false;
  try {
    return new URL(url).host !== new URL(site.url).host;
  } catch {
    return false;
  }
}

/** "https://ics.uci.edu/~kazuhak/" -> "ics.uci.edu/~kazuhak" */
export function displayUrl(url: string): string {
  return url
    .replace(/^mailto:/, '')
    .replace(/^https?:\/\//, '')
    .replace(/^www\./, '')
    .replace(/\/$/, '');
}
