import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { ReactNode } from 'react';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Cache font in memory to avoid repeated file reads
let fontCache: ArrayBuffer | null = null;

async function loadFont(): Promise<ArrayBuffer> {
  if (fontCache) return fontCache;

  try {
    const fontPath = path.resolve(
      __dirname,
      '../../public/fonts/og/DMSans-Regular.ttf',
    );
    const fontBuffer = await fs.readFile(fontPath);
    fontCache = new Uint8Array(fontBuffer).buffer;
    return fontCache;
  } catch (error) {
    console.error('Error loading font:', error);
    throw new Error('Failed to load font file');
  }
}

export interface OGImageOptions {
  title: string;
  description?: string;
  type?: 'blog' | 'project';
  tags?: string[];
  author?: string;
  pubDate?: Date;
  imageBase64?: string; // Base64 encoded image data URL
}

interface OGTemplateProps {
  title: string;
  description?: string;
  typeLabel: string;
  tags: string[];
  author: string;
  formattedDate: string;
  accentColor: string;
  imageBase64?: string;
}

function OGTemplate({
  title,
  description,
  typeLabel,
  tags,
  author,
  formattedDate,
  accentColor,
  imageBase64,
}: OGTemplateProps): ReactNode {
  const displayTags = tags.slice(0, 4);
  const truncatedDescription =
    description && description.length > 120
      ? description.substring(0, 120) + '...'
      : description;

  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background image */}
      {imageBase64 && (
        <img
          src={imageBase64}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      )}

      {/* Dark overlay for better text readability */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: imageBase64
            ? 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.85) 100%)'
            : 'transparent',
        }}
      />

      {/* Background gradient orbs (only if no image) */}
      {!imageBase64 && (
        <>
          <div
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-100px',
              width: '400px',
              height: '400px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 70%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-150px',
              right: '-100px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background:
                'radial-gradient(circle, rgba(250, 204, 21, 0.1) 0%, transparent 70%)',
            }}
          />
        </>
      )}

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Content wrapper with padding */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          width: '100%',
          padding: '60px',
          position: 'relative',
        }}
      >
        {/* Header with type badge and site name */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          {/* Type badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(250, 204, 21, 0.2)',
              border: '1px solid rgba(250, 204, 21, 0.4)',
              borderRadius: '9999px',
              padding: '8px 20px',
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: '20px',
                fontWeight: 700,
                fontFamily: 'sans-serif',
              }}
            >
              {typeLabel}
            </span>
          </div>

          {/* Site name */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <span
              style={{
                color: '#ffffff',
                fontSize: '24px',
                fontWeight: 700,
                fontFamily: 'serif',
              }}
            >
              Melnerdz
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            justifyContent: 'center',
          }}
        >
          {/* Title */}
          <h1
            style={{
              color: '#ffffff',
              fontSize: title.length > 50 ? '48px' : '56px',
              fontWeight: 700,
              fontFamily: 'serif',
              lineHeight: 1.2,
              marginBottom: '24px',
              maxWidth: '900px',
              textShadow: imageBase64 ? '0 2px 10px rgba(0,0,0,0.5)' : 'none',
            }}
          >
            {title}
          </h1>

          {/* Description */}
          {truncatedDescription && (
            <p
              style={{
                color: 'rgba(255, 255, 255, 0.85)',
                fontSize: '24px',
                fontFamily: 'sans-serif',
                lineHeight: 1.5,
                maxWidth: '800px',
                marginBottom: '32px',
                textShadow: imageBase64 ? '0 1px 5px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              {truncatedDescription}
            </p>
          )}
        </div>

        {/* Footer with tags and meta info */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          {/* Tags */}
          {displayTags.length > 0 && (
            <div
              style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap',
              }}
            >
              {displayTags.map((tag, index) => (
                <span
                  key={index}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    borderRadius: '8px',
                    padding: '8px 16px',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '16px',
                    fontFamily: 'sans-serif',
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Author and date */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-end',
              gap: '4px',
            }}
          >
            <span
              style={{
                color: accentColor,
                fontSize: '18px',
                fontWeight: 600,
                fontFamily: 'sans-serif',
                textShadow: imageBase64 ? '0 1px 3px rgba(0,0,0,0.5)' : 'none',
              }}
            >
              {author}
            </span>
            {formattedDate && (
              <span
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: '16px',
                  fontFamily: 'sans-serif',
                  textShadow: imageBase64
                    ? '0 1px 3px rgba(0,0,0,0.5)'
                    : 'none',
                }}
              >
                {formattedDate}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export async function generateOGImage(
  options: OGImageOptions,
): Promise<Buffer> {
  try {
    const {
      title,
      description,
      type = 'blog',
      tags = [],
      author = 'Melnard De Jesus',
      pubDate,
      imageBase64,
    } = options;

    const formattedDate = pubDate
      ? new Date(pubDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : '';

    const typeLabel = type === 'blog' ? 'Blog Post' : 'Project';
    const accentColor = '#facc15'; // Yellow accent from theme

    const element = OGTemplate({
      title,
      description,
      typeLabel,
      tags,
      author,
      formattedDate,
      accentColor,
      imageBase64,
    });

    // Load the single font needed for satori
    const font = await loadFont();

    // Add timeout to satori call
    const svgPromise = satori(element as React.ReactNode, {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'sans-serif',
          data: font,
          weight: 400,
          style: 'normal',
        },
      ],
    });

    const svg = await Promise.race([
      svgPromise,
      new Promise<string>((_, reject) =>
        setTimeout(() => reject(new Error('Satori rendering timeout')), 10000),
      ),
    ]);

    const resvg = new Resvg(svg, {
      fitTo: {
        mode: 'width',
        value: 1200,
      },
    });

    const pngData = resvg.render();
    return pngData.asPng();
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error generating OG image:', errorMessage);
    console.error('Full error:', error);
    throw new Error(`Failed to generate OG image: ${errorMessage}`);
  }
}
