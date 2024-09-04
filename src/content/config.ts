//Schemas enforce consistent frontmatter or entry data within a collection.
import { defineCollection, z } from 'astro:content';
const projectsCollections = defineCollection({
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
      technology: z.array(
        z.object({
          src: image(), // image() is used to ensure valid image references
          alt: z.string(),
        }),
      ),
      tags: z.array(z.string()),
      link: z.string(),
      repo: z.string(),
      shortDesc: z.string(),
    }),
});

export const collections = {
  projects: projectsCollections,
};
