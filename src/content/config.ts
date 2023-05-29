import { z, defineCollection } from 'astro:content';

const docs = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    published: z.number(),
    date: z.date(),
    tags: z.string().optional(),
    editor: z.string(),
    dateCreated: z.date(),
  }),
});

export const collections = {
  docs,
};
