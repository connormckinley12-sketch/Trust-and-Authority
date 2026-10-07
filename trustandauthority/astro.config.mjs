import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://trustandauthority.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({ filter: (page) => !page.includes('/thanks/') }),
  ],
});
