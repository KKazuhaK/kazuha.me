// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

import { existsSync } from 'node:fs';
import { rename, rmdir, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// Cloudflare's `404-page` mode looks for the nearest 404.html, so move zh/404/index.html to zh/404.html.
/** @type {import('astro').AstroIntegration} */
const flatZhNotFound = {
  name: 'flat-zh-404',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      const from = join(root, 'zh/404/index.html');
      if (!existsSync(from)) return;
      await rename(from, join(root, 'zh/404.html'));
      const folder = join(root, 'zh/404');
      if ((await readdir(folder)).length === 0) await rmdir(folder);
    },
  },
};

// https://astro.build/config
export default defineConfig({
  integrations: [
    mdx(),
    // zh pages are English fallbacks canonical to the en URL until translated.
    sitemap({
      filter: (page) =>
        !/\/404\/?$/.test(page) && !new URL(page).pathname.startsWith('/zh/'),
    }),
    flatZhNotFound,
  ],
  site: 'https://kazuha.me',
  i18n: {
    locales: ['en', 'zh'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Instrument Serif',
      cssVariable: '--font-serif',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Songti SC', 'Noto Serif SC', 'Georgia', 'serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Sans',
      cssVariable: '--font-sans',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['PingFang SC', 'Noto Sans SC', 'system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.fontsource(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'monospace'],
    },
  ],
});
