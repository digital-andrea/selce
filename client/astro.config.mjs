// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  redirects: {
    'https://dev.localhost/api': 'https://localhost/api',
  }
});
