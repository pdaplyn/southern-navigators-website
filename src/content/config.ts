import { defineCollection, z } from 'astro:content';

const eventsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    location: z.string().optional(),
    level: z.enum(['Activity', 'Course', 'Local', 'Regional', 'National', 'Major']).optional(),
    eventTypes: z.array(z.enum(['Race', 'Coaching', 'Training', 'Juniors', 'Schools', 'Relay', 'Score', 'Social', 'Urban', 'Night'])).optional(),
    externalUrl: z.string().url().optional(),
    summary: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const newsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subTitle: z.string().optional(),
    date: z.coerce.date(),
    categories: z.array(z.string()).optional(),
    summary: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    parent: z.string().optional(),
    order: z.number().optional(),
    draft: z.boolean().optional().default(false),
  }),
});

const contactsCollection = defineCollection({
  type: 'data',
  schema: z.object({
    roles: z.array(z.object({
      name: z.string(),
      people: z.array(z.object({
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
      })),
    })),
  }),
});

export const collections = {
  events: eventsCollection,
  news: newsCollection,
  pages: pagesCollection,
  contacts: contactsCollection,
};
