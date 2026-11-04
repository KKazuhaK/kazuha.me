import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from './ui';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface LocalizedProject {
  /** URL slug: the id without its language directory. */
  slug: string;
  entry: ProjectEntry;
  /** True when `locale` has no translation and the English entry is used. */
  fallback: boolean;
}

/** "en/anteater-mcp" -> { lang: "en", slug: "anteater-mcp" } */
function splitId(id: string): { lang: string; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang, slug: rest.join('/') };
}

/**
 * Every English project, in `order`. For another locale, the translated entry
 * when it exists, otherwise the English one with `fallback: true`.
 */
export async function getProjects(locale: Locale): Promise<LocalizedProject[]> {
  const all = await getCollection('projects');
  const byLang = (lang: string) =>
    new Map(
      all
        .filter((e) => splitId(e.id).lang === lang)
        .map((e) => [splitId(e.id).slug, e]),
    );
  const english = byLang('en');
  const localized = byLang(locale);

  return [...english.entries()]
    .sort(
      ([, a], [, b]) => a.data.order - b.data.order || a.id.localeCompare(b.id),
    )
    .map(([slug, enEntry]) => {
      const own = locale === 'en' ? undefined : localized.get(slug);
      return {
        slug,
        entry: own ?? enEntry,
        fallback: locale !== 'en' && !own,
      };
    });
}

/** Project with its neighbours in `order`. */
export async function getProject(locale: Locale, slug: string) {
  const projects = await getProjects(locale);
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) return undefined;
  return {
    project: projects[index],
    previous: projects[index - 1],
    next: projects[index + 1],
  };
}
