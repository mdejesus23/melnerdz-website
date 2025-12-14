import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';
import fs from 'node:fs/promises';
import path from 'node:path';

async function getImageAsBase64(imagePath: string): Promise<string | undefined> {
  try {
    // The image.src from content collections is an object with fsPath
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
  const blogs = await getCollection('blogs');

  return blogs.map((blog) => ({
    params: { id: blog.id },
    props: { blog },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const { blog } = props;

  // Get the image path from the content collection
  // The image.src is an ImageMetadata object with fsPath property
  const imageSrc = blog.data.image?.src;
  let imageBase64: string | undefined;

  if (imageSrc && typeof imageSrc === 'object' && 'fsPath' in imageSrc) {
    imageBase64 = await getImageAsBase64(imageSrc.fsPath as string);
  }

  const png = await generateOGImage({
    title: blog.data.title,
    description: blog.data.description,
    type: 'blog',
    tags: blog.data.tags,
    author: blog.data.author,
    pubDate: blog.data.pubDate,
    imageBase64,
  });

  return new Response(new Uint8Array(png), {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
