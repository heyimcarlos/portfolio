import { glob } from "astro/loaders";

import { z, defineCollection } from "astro:content";
const games = defineCollection({
    loader: glob({ pattern: '**/[^_]*.astro', base: './src/pages/games' })
});

const projects = defineCollection({
    loader: glob({ pattern: '**/[^_]*.md', base: './src/blog' }),
    schema: z.object({
        pageUrl: z.string().optional(),
        public: z.boolean().optional(),
        createdAt: z.number().optional(),
        updatedAt: z.number().optional(),
        title: z.string(),
        tags: z.array(z.string()).optional(),
        slug: z.string(),
        thumbnail: z.string().optional()
    })
});

export const collections = {
    games,
    projects
};

