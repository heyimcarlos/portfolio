import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: z.optional(image()),
			tag: z.enum(['essay', 'notes', 'case-study', 'life']).default('notes'),
			readTime: z.string().optional(),
			featured: z.boolean().default(false),
			excerpt: z.string().optional(),
		}),
});

const projects = defineCollection({
	loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			year: z.string(),
			description: z.string(),
			stack: z.array(z.string()),
			cover: image().optional(),
			category: z.enum(['web', 'oss', 'side-quests']).default('web'),
			featured: z.boolean().default(false),
			url: z.string().url().optional(),
			repo: z.string().url().optional(),
			order: z.number().optional(),
			updatedDate: z.coerce.date().optional(),
			role: z.string().optional(),
			status: z.enum(['shipped', 'archived', 'active']).default('shipped'),
		}),
});

export const collections = { blog, projects };
