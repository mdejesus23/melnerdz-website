import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '../../../../');

// Maximum source image size to process (1MB) - larger images are skipped
// to prevent memory issues and timeouts on serverless platforms
const MAX_SOURCE_IMAGE_SIZE = 1024 * 1024;

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
    console.log(`Compressed image size: ${(compressedSize / 1024).toFixed(2)}KB`);

    // Limit compressed image size to prevent memory issues (max 200KB)
    if (compressedBuffer.length > 200 * 1024) {
      console.warn(
        `Compressed image still too large (${(compressedSize / 1024).toFixed(2)}KB > 200KB), skipping`,
      );
      return undefined;
    }

    return `data:image/png;base64,${compressedBuffer.toString('base64')}`;
  } catch (error) {
    console.warn('Error reading/compressing image, continuing without it:', error);
    return undefined;
  }
}

// Find the image file for a project by parsing the original markdown file
// Returns undefined if image doesn't exist or is too large to process safely
async function findProjectImage(filePath: string): Promise<string | undefined> {
  const fullFilePath = path.join(projectRoot, filePath);
  const projectDir = path.dirname(fullFilePath);

  try {
    // Read the markdown file and extract the image src from frontmatter
    const content = await fs.readFile(fullFilePath, 'utf-8');
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);

    if (frontmatterMatch) {
      // Look for image.src in the frontmatter
      const srcMatch = frontmatterMatch[1].match(
        /src:\s*['"]?([^'"}\n]+)['"]?/,
      );
      if (srcMatch) {
        const imageSrcPath = srcMatch[1].trim();
        // Handle relative paths like './images/foo.png'
        const imagePath = path.join(projectDir, imageSrcPath);
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
          // Image not found at specified path
        }
      }
    }
  } catch (error) {
    console.error('Error finding project image:', error);
  }

  return undefined;
}

export const getStaticPaths: GetStaticPaths = async () => {
  const projects = await getCollection('projects');

  return projects.map((project) => ({
    params: { id: project.id },
    props: { project },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  try {
    const { project } = props;

    let imageBase64: string | undefined;

    // Use filePath from the content entry to find the image in the same directory
    const filePath = (project as { filePath?: string }).filePath;
    if (filePath) {
      const imagePath = await findProjectImage(filePath);
      if (imagePath) {
        imageBase64 = await getImageAsBase64(imagePath);
      }
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
        'X-Content-Type-Options': 'nosniff',
      },
    });
  } catch (error) {
    console.error('OG Image generation error:', error);
    return new Response('Error generating OG image', { status: 500 });
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
