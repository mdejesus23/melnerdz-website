import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');

  return projects.map((project) => ({
    params: { id: project.id },
    props: { project },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { project } = props;

  const png = await generateOGImage({
    title: project.data.title,
    description: project.data.shortDesc || project.data.description,
    type: 'project',
    tags: project.data.technology?.slice(0, 4) || project.data.tags,
    author: project.data.author,
    pubDate: project.data.pubDate,
  });

  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
