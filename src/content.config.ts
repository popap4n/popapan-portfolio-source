import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const placeholderOrUrl = z.string().refine(
  (value) => value.startsWith('[REPLACE:') || /^https:\/\//i.test(value),
  'Use a full https:// URL or a [REPLACE: ...] placeholder',
);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string().min(1),
    summary: z.string().min(1),
    featured: z.boolean(),
    order: z.number().int().nonnegative(),
    engine: z.string().min(1),
    languages: z.array(z.string()).min(1),
    tools: z.array(z.string()),
    projectType: z.enum(['individual', 'team', 'unspecified']),
    context: z.string().min(1),
    startDate: z.string().min(1),
    endDate: z.string().min(1),
    role: z.string().min(1),
    image: z.string().min(1),
    imageAlt: z.string().min(1),
    screenshots: z.array(z.object({ image: z.string().min(1), alt: z.string().min(1) })).optional(),
    video: placeholderOrUrl.optional(),
    playableBuild: placeholderOrUrl.optional(),
    repository: placeholderOrUrl.optional(),
    technicalDocumentation: placeholderOrUrl.optional(),
  }),
});

export const collections = { projects };
