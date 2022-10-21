import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import react from '@astrojs/react'
import image from '@astrojs/image'
import vercel from '@astrojs/vercel/serverless'
import addClasses from 'rehype-add-classes'

// https://astro.build/config
export default defineConfig({
  site: 'https://heyimcarlos.dev/',
  integrations: [
    tailwind(),
    react(),
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    })
  ],
  markdown: {
    extendDefaultPlugins: true,
    rehypePlugins: [
      [
        addClasses,
        {
          h1: 'text-4xl font-bold font-mplus',
          h2: 'font-mplus font-bold text-xl mb-4 mt-3 leading-[1.33] md:leading-tight underline underline-offset-[6px] decoration-4 decoration-custom-teal dark:decoration-zinc-600',
          h3: 'text-xl font-bold font-mplus',
          h4: 'text-lg font-bold font-mplus',
          h5: 'text-md font-bold font-mplus',
          h6: 'text-sm font-bold font-mplus',
          p: 'indent-4 sm:text-justify mb-6',
          img: 'border border-slate-300 dark:border-zinc-700 rounded-xl my-6',
          a: 'underline underline-offset-2 hover:text-orange-500 decoration-orange-500'
        }
      ]
    ]
  },
  output: 'server',
  adapter: vercel()
})
