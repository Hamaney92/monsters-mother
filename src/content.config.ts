import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
const blog = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/blog' }), schema: z.object({ title: z.string(), description: z.string(), date: z.coerce.date(), modified: z.coerce.date().optional(), category: z.string(), draft: z.boolean().default(false), author: z.string().default('The Ember Journal') }) });
const books = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/books' }), schema: z.object({ title: z.string(), subtitle: z.string(), author: z.string(), order: z.number(), amazon: z.url().optional(), description: z.string(), published: z.boolean().default(false), paperback: z.object({ isbn: z.string().regex(/^97[89]\d{10}$/), pages: z.number().int().positive() }).optional() }) });
const chapters = defineCollection({ loader: glob({ pattern: '**/*.md', base: './src/content/chapters' }), schema: z.object({ title: z.string(), bookId: z.string(), number: z.number() }) });
export const collections = { blog, books, chapters };
