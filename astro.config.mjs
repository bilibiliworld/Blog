import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { postRedirects } from './src/config/redirects.mjs';

const buildTime = process.env.SITE_BUILD_TIME ?? new Date().toISOString();

export default defineConfig({
  site: 'https://www.loliking.com',
  integrations: [mdx(), sitemap({ filter: (page) => !Object.keys(postRedirects).some((slug) => page.endsWith(`/posts/${slug}/`)) })],
  vite: { define: { __SITE_BUILD_TIME__: JSON.stringify(buildTime) } },
});
