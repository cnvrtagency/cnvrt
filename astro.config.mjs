import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://cnvrtdigital.co.uk',
  integrations: [sitemap({
    filter: (page) => !['/accessibility/', '/cookies/', '/privacy/', '/terms/', '/thank-you/', '/project-checklist/', '/web-design-discovery/', '/client/'].some((path) => page.endsWith(path)) && !page.includes('/admin/'),
  })],
  output: 'static',
  trailingSlash: 'always',
});
