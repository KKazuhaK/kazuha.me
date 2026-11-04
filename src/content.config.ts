import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

/** "2026-06" (month) or "2026" (year). */
const yearMonth = z.string().regex(/^\d{4}(-\d{2})?$/);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    kind: z.enum(['oss', 'research', 'infra']),
    year: z.number().int(),
    role: z.string(),
    stack: z.array(z.string()),
    status: z.enum(['active', 'done', 'in-progress']),
    featured: z.boolean().default(false),
    order: z.number(),
    /** UI string key for the card button text. */
    cta: z
      .enum(['readCaseStudy', 'seeContributions', 'readMore'])
      .default('readCaseStudy'),
    /** Short list shown in the card illustration (e.g. notable PR titles). */
    highlights: z.array(z.string()).default([]),
    /** Illustration key for ProjectArt. */
    cover: z.string().optional(),
    links: z
      .object({
        github: z.url().optional(),
        /** A URL, or the sentinel `notes` (resolved to site.notesUrl). */
        demo: z.string().optional(),
        paper: z.url().optional(),
      })
      .default({}),
  }),
});

const updates = defineCollection({
  loader: file('src/data/updates.yaml'),
  schema: z.object({
    id: z.string(),
    /** YYYY-MM or YYYY-MM-DD; use only the precision that is known. */
    date: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/),
    text: z.string(),
    /** Internal path without locale prefix, or an absolute URL. */
    href: z.string().optional(),
  }),
});

const education = defineCollection({
  loader: file('src/data/education.yaml'),
  schema: z.object({
    id: z.string(),
    school: z.string(),
    degree: z.string(),
    field: z.string(),
    division: z.string().optional(),
    start: z.number().int(),
    end: z.number().int(),
    expected: z.boolean().default(false),
    notes: z.array(z.string()).default([]),
    url: z.url(),
  }),
});

const experience = defineCollection({
  loader: file('src/data/experience.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    org: z.string(),
    location: z.string(),
    start: yearMonth,
    end: yearMonth.optional(),
    mode: z.string().optional(),
    summary: z.string().optional(),
  }),
});

const teaching = defineCollection({
  loader: file('src/data/teaching.yaml'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    role: z.string(),
    course: z.string(),
    courseTitle: z.string().optional(),
    org: z.string(),
    term: z.string(),
    notes: z.array(z.string()).default([]),
  }),
});

const research = defineCollection({
  loader: file('src/data/research.yaml'),
  schema: z.object({
    id: z.string(),
    title: z.string(),
    start: yearMonth,
    end: yearMonth.optional(),
    with: z.string().optional(),
    summary: z.string(),
  }),
});

const skills = defineCollection({
  loader: file('src/data/skills.yaml'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    label: z.string(),
    items: z.array(z.string()),
  }),
});

const links = defineCollection({
  loader: file('src/data/links.yaml'),
  schema: z.object({
    id: z.string(),
    order: z.number(),
    group: z.enum(['school', 'sites', 'code', 'contact']),
    name: z.string(),
    sub: z.string(),
    /** A URL, or a sentinel: notes | github | linkedin | email. */
    url: z.string(),
    /** Text shown for the address; derived from the URL when omitted. */
    display: z.string().optional(),
    mark: z.string(),
    cta: z.string(),
    /** Set to false to hide a row without deleting it. */
    enabled: z.boolean().default(true),
  }),
});

export const collections = {
  projects,
  updates,
  education,
  experience,
  teaching,
  research,
  skills,
  links,
};
