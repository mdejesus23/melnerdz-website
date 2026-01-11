import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projectsCollections = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/projects' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      author: z.string(),
      featured: z.boolean().optional(),
      image: z.object({
        src: image(),
        alt: z.string(),
      }),
      description: z.string(),
      technology: z.array(z.string()),
      tags: z.array(z.string()),
      link: z.string(),
      repo: z.string(),
      shortDesc: z.string(),
    }),
});

const blogCollection = defineCollection({
  loader: glob({ pattern: '**/[^_]*.{md,mdx}', base: './src/data/blogs' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      pubDate: z.date(),
      author: z.string(),
      slug: z.string(),
      image: z.object({
        src: image(),
        alt: z.string(),
      }),
      description: z.string(),
      technology: z.array(z.string()).optional(),
      tags: z.array(z.string()),
    }),
});

const aboutMeCollection = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/data/personal' }),
  schema: () =>
    z.object({
      title: z.string(),
    }),
});

export const collections = {
  projects: projectsCollections,
  blogs: blogCollection,
  personal: aboutMeCollection,
};
