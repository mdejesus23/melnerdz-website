//Schemas enforce consistent frontmatter or entry data within a collection.
import { defineCollection, z } from 'astro:content';
const newsletterCollection = defineCollection({
  type: 'content', // is for markdown file
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      author: z.string(),
      image: z.object({
        src: image(),
        alt: z.string(),
      }),
      description: z.string(),
      tags: z.array(z.string()),
    }),
});

export const collections = {
  newsletter: newsletterCollection,
};
