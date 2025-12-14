import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';

export const getStaticPaths: GetStaticPaths = async () => {
  const blogs = await getCollection('blogs');

  return blogs.map((blog) => ({
    params: { id: blog.id },
    props: { blog },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { blog } = props;

  const png = await generateOGImage({
    title: blog.data.title,
    description: blog.data.description,
    type: 'blog',
    tags: blog.data.tags,
    author: blog.data.author,
    pubDate: blog.data.pubDate,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
