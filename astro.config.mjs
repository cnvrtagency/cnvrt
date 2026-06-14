// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

// https://astro.build/config
export default defineConfig({
  site: isGitHubPages ? 'https://cnvrtagency.github.io' : undefined,
  base: isGitHubPages ? '/cnvrt' : '/',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
