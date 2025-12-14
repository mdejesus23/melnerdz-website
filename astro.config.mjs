import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwind from '@astrojs/tailwind';

import react from '@astrojs/react';

import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
  site: 'https://melnerdz.com',
  integrations: [sitemap(), tailwind(), react(), mdx()],
  markdown: {
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-dark',
        dark: 'github-dark',
      },
      /**
       * Make code block background transparent so site theme controls it.
       * This prevents white boxes in light mode over dark containers.
       */
      bg: 'transparent',
      wrap: true,
    },
  },
});
