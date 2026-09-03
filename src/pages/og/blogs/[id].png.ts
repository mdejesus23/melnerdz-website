import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');

async function getImageAsBase64(
  imagePath: string,
): Promise<string | undefined> {
  try {
    if (!imagePath) return undefined;

    // Add timeout to image reading to prevent hanging
    const imageBuffer = await Promise.race([
      fs.readFile(imagePath),
      new Promise<Buffer>((_, reject) =>
        setTimeout(() => reject(new Error('Image read timeout')), 2000),
      ),
    ]);

    const originalSize = imageBuffer.length;
    console.log(`Original image size: ${(originalSize / 1024).toFixed(2)}KB`);

    // Compress image using sharp to reduce file size
    // Resize to max 600px width (OG images are 1200x630, but we can scale down)
    // and apply aggressive compression
    const compressedBuffer = await Promise.race([
      sharp(imageBuffer)
        .resize(600, 400, { fit: 'cover', withoutEnlargement: true })
        .png({ quality: 70, progressive: true })
        .toBuffer(),
      new Promise<Buffer>((_, reject) =>
        setTimeout(() => reject(new Error('Image compression timeout')), 3000),
      ),
    ]);

    const compressedSize = compressedBuffer.length;
    const compressionRatio = (
      (1 - compressedSize / originalSize) *
      100
    ).toFixed(2);
    console.log(
      `Compressed image size: ${(compressedSize / 1024).toFixed(2)}KB (${compressionRatio}% reduction)`,
    );

    // Limit compressed image size to prevent memory issues (max 200KB)
    if (compressedBuffer.length > 200 * 1024) {
      console.warn(
        `Compressed image still too large (${(compressedSize / 1024).toFixed(2)}KB > 200KB), skipping:`,
        imagePath,
      );
      return undefined;
    }

    const mimeType = 'png';
    return `data:image/${mimeType};base64,${compressedBuffer.toString('base64')}`;
  } catch (error) {
    console.warn(
      'Error reading/compressing image, continuing without it:',
      error,
    );
    return undefined;
  }
}

// Maximum source image size to process (1MB) - larger images are skipped
// to prevent memory issues and timeouts on serverless platforms
const MAX_SOURCE_IMAGE_SIZE = 1024 * 1024;

// Find the main.png image in the blog directory
// Returns undefined if image doesn't exist or is too large to process safely
async function findBlogImage(filePath: string): Promise<string | undefined> {
  const fullFilePath = path.join(projectRoot, filePath);
  const blogDir = path.dirname(fullFilePath);
  const imagePath = path.join(blogDir, 'main.png');

  try {
    const stats = await fs.stat(imagePath);

    // Skip images that are too large to process safely
    if (stats.size > MAX_SOURCE_IMAGE_SIZE) {
      console.log(
        `Skipping large image (${(stats.size / 1024).toFixed(0)}KB > ${MAX_SOURCE_IMAGE_SIZE / 1024}KB):`,
        imagePath,
      );
      return undefined;
    }

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
  try {
    const { blog } = props;

    let imageBase64: string | undefined;

    // Use filePath from the content entry to find the image in the same directory
    const filePath = (blog as { filePath?: string }).filePath;
    console.log('Blog filePath:', filePath);
    if (filePath) {
      const imagePath = await findBlogImage(filePath);
      console.log('Found blog image path:', imagePath);
      if (imagePath) {
        imageBase64 = await getImageAsBase64(imagePath);
        if (imageBase64) {
          console.log('✓ Image successfully compressed and embedded');
        } else {
          console.log(
            '⚠ Image compression resulted in undefined (likely too large)',
          );
        }
      }
    }

    // Add timeout to OG image generation (30 seconds max)
    const pngPromise = generateOGImage({
      title: blog.data.title,
      description: blog.data.description,
      type: 'blog',
      tags: blog.data.tags,
      author: blog.data.author,
      pubDate: blog.data.pubDate,
      imageBase64,
    });

    const png = await Promise.race([
      pngPromise,
      new Promise<Buffer>((_, reject) =>
        setTimeout(
          () => reject(new Error('OG image generation timeout')),
          30000,
        ),
      ),
    ]);

    return new Response(new Uint8Array(png), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=31536000, immutable',
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('OG Image generation error:', errorMessage);
    return new Response(`Error generating OG image: ${errorMessage}`, {
      status: 500,
    });
  }
};

// Some crawlers use HEAD to check content type. Provide explicit handler.
export const HEAD: APIRoute = async () => {
  return new Response(null, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'X-Content-Type-Options': 'nosniff',
    },
  });
};
