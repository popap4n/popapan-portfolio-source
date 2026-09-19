import { defineConfig } from 'astro/config';
import 'dotenv/config';

// Set PUBLIC_SITE_URL=https://[REPLACE-WITH-DOMAIN] in .env before publishing.
const configuredSite = process.env.PUBLIC_SITE_URL;
const site = configuredSite && !configuredSite.includes('[REPLACE')
  ? configuredSite
  : 'https://example.invalid';

export default defineConfig({
  output: 'static',
  outDir: './dist',
  site,
});
