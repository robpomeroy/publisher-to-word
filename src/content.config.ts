import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    module: z.number(),
    moduleTitle: z.string(),
    order: z.number(),
    summary: z.string(),
    wordTabs: z.array(z.string()).default([]),
    hasMacNotes: z.boolean().default(false),
  }),
});

export const collections = { lessons };
