import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { glob } from 'glob';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

async function compressBlogImages() {
  const blogImagesPattern = path.join(
    projectRoot,
    'src/data/blogs/**/main.png',
  );

  const images = await glob(blogImagesPattern);

  console.log(`Found ${images.length} blog images to compress\n`);

  let totalOriginal = 0;
  let totalCompressed = 0;

  for (const imagePath of images) {
    try {
      const stats = await fs.stat(imagePath);
      const originalSize = stats.size;
      totalOriginal += originalSize;

      // Read and compress
      const buffer = await fs.readFile(imagePath);
      const compressed = await sharp(buffer)
        .resize(1200, 800, { fit: 'inside', withoutEnlargement: true })
        .png({ quality: 80, compressionLevel: 9 })
        .toBuffer();

      const compressedSize = compressed.length;
      totalCompressed += compressedSize;

      const reduction = ((1 - compressedSize / originalSize) * 100).toFixed(1);
      const relativePath = path.relative(projectRoot, imagePath);

      // Only write if we achieved compression
      if (compressedSize < originalSize) {
        await fs.writeFile(imagePath, compressed);
        console.log(
          `✓ ${relativePath}: ${(originalSize / 1024).toFixed(0)}KB → ${(compressedSize / 1024).toFixed(0)}KB (${reduction}% smaller)`,
        );
      } else {
        console.log(
          `- ${relativePath}: ${(originalSize / 1024).toFixed(0)}KB (already optimized)`,
        );
      }
    } catch (error) {
      console.error(`✗ Error processing ${imagePath}:`, error.message);
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total original: ${(totalOriginal / 1024 / 1024).toFixed(2)}MB`);
  console.log(
    `Total compressed: ${(totalCompressed / 1024 / 1024).toFixed(2)}MB`,
  );
  console.log(
    `Total saved: ${((totalOriginal - totalCompressed) / 1024 / 1024).toFixed(2)}MB (${((1 - totalCompressed / totalOriginal) * 100).toFixed(1)}%)`,
  );
}

compressBlogImages().catch(console.error);
