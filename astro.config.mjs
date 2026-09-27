import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
const site = process.env.SITE_URL || 'https://example.com';
const base = process.env.BASE_PATH || '/';
export default defineConfig({ site, base, output: 'static', trailingSlash: 'always', devToolbar: { enabled: false }, integrations: [sitemap({ filter: (url) => !['/404/', '/404'].some(path => url.endsWith(path)) })] });
