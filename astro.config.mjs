import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://publishertoword.guide',
  integrations: [mdx(), sitemap()],
  scopedStyleStrategy: 'where',
  vite: {
    resolve: {
      preserveSymlinks: true,
    },
  },
});
