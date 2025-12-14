import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';
import fs from 'node:fs/promises';
import path from 'node:path';

async function getImageAsBase64(imagePath: string): Promise<string | undefined> {
  try {
    const fsPath = imagePath;
    if (!fsPath) return undefined;

    const imageBuffer = await fs.readFile(fsPath);
    const ext = path.extname(fsPath).toLowerCase().slice(1);
    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading image:', error);
    return undefined;
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');

  return projects.map((project) => ({
    params: { id: project.id },
    props: { project },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { project } = props;

  // Get the image path from the content collection
  const imageSrc = project.data.image?.src;
  let imageBase64: string | undefined;

  if (imageSrc && typeof imageSrc === 'object' && 'fsPath' in imageSrc) {
    imageBase64 = await getImageAsBase64(imageSrc.fsPath as string);
  }

  const png = await generateOGImage({
    title: project.data.title,
    description: project.data.shortDesc || project.data.description,
    type: 'project',
    tags: project.data.technology?.slice(0, 4) || project.data.tags,
    author: project.data.author,
    pubDate: project.data.pubDate,
    imageBase64,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
