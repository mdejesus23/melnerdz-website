import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');

async function getImageAsBase64(imagePath: string): Promise<string | undefined> {
  try {
    if (!imagePath) return undefined;

    const imageBuffer = await fs.readFile(imagePath);
    const ext = path.extname(imagePath).toLowerCase().slice(1);
    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading image:', error);
    return undefined;
  }
}

// Find the main.png image in the blog directory
async function findBlogImage(filePath: string): Promise<string | undefined> {
  const fullFilePath = path.join(projectRoot, filePath);
  const blogDir = path.dirname(fullFilePath);
  const imagePath = path.join(blogDir, 'main.png');

  try {
    await fs.access(imagePath);
    return imagePath;
  } catch {
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

  let imageBase64: string | undefined;

  // Use filePath from the content entry to find the image in the same directory
  const filePath = (blog as { filePath?: string }).filePath;
  if (filePath) {
    const imagePath = await findBlogImage(filePath);
    if (imagePath) {
      imageBase64 = await getImageAsBase64(imagePath);
    }
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
