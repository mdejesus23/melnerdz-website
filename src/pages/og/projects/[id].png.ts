import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { generateOGImage } from '../../../utils/ogImage';
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

    const imageBuffer = await fs.readFile(imagePath);
    const ext = path.extname(imagePath).toLowerCase().slice(1);
    const mimeType = ext === 'jpg' ? 'jpeg' : ext;
    return `data:image/${mimeType};base64,${imageBuffer.toString('base64')}`;
  } catch (error) {
    console.error('Error reading image:', error);
    return undefined;
  }
}

// Find the image file for a project by parsing the original markdown file
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
          await fs.access(imagePath);
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
