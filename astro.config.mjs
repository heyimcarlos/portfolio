import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import image from '@astrojs/image';

// https://astro.build/config
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  site: 'https://carlosdlc.dev/',
  integrations: [tailwind(), react(), image({
    serviceEntryPoint: '@astrojs/image/sharp'
  })],
  output: "server",
  adapter: vercel()
});