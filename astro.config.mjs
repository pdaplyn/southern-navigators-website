import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.southernnavigators.com',
  output: 'static',
  build: {
    format: 'file',
  },
});
