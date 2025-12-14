import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import type { ReactNode } from 'react';

export interface OGImageOptions {
  title: string;
  description?: string;
  type?: 'blog' | 'project';
  tags?: string[];
  author?: string;
  pubDate?: Date;
}

interface OGTemplateProps {
  title: string;
  description?: string;
  typeLabel: string;
  tags: string[];
  author: string;
  formattedDate: string;
  accentColor: string;
}

function OGTemplate({
  title,
  description,
  typeLabel,
  tags,
  author,
  formattedDate,
  accentColor,
}: OGTemplateProps): ReactNode {
  const displayTags = tags.slice(0, 4);
  const truncatedDescription = description && description.length > 120
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
        padding: '60px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient orbs */}
      <div
        style={{
          position: 'absolute',
          top: '-100px',
          left: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.15) 0%, transparent 70%)',
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
          background: 'radial-gradient(circle, rgba(250, 204, 21, 0.1) 0%, transparent 70%)',
        }}
      />

      {/* Grid pattern overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

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
            backgroundColor: 'rgba(250, 204, 21, 0.15)',
            border: '1px solid rgba(250, 204, 21, 0.3)',
            borderRadius: '9999px',
            padding: '8px 20px',
          }}
        >
          <span
            style={{
              color: accentColor,
              fontSize: '20px',
              fontWeight: 700,
              fontFamily: 'DM Sans',
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
              fontFamily: 'Playfair Display',
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
            fontFamily: 'Playfair Display',
            lineHeight: 1.2,
            marginBottom: '24px',
            maxWidth: '900px',
          }}
        >
          {title}
        </h1>

        {/* Description */}
        {truncatedDescription && (
          <p
            style={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: '24px',
              fontFamily: 'DM Sans',
              lineHeight: 1.5,
              maxWidth: '800px',
              marginBottom: '32px',
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
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '16px',
                  fontFamily: 'DM Sans',
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
              fontFamily: 'DM Sans',
            }}
          >
            {author}
          </span>
          {formattedDate && (
            <span
              style={{
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '16px',
                fontFamily: 'DM Sans',
              }}
            >
              {formattedDate}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export async function generateOGImage(options: OGImageOptions): Promise<Buffer> {
  const {
    title,
    description,
    type = 'blog',
    tags = [],
    author = 'Melnard De Jesus',
    pubDate
  } = options;

  // Load fonts
  const [dmSansRegular, dmSansBold, playfairBold] = await Promise.all([
    fetch('https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-400-normal.ttf').then(res => res.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/fontsource/fonts/dm-sans@latest/latin-700-normal.ttf').then(res => res.arrayBuffer()),
    fetch('https://cdn.jsdelivr.net/fontsource/fonts/playfair-display@latest/latin-700-normal.ttf').then(res => res.arrayBuffer()),
  ]);

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
  });

  const svg = await satori(element as React.ReactNode, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'DM Sans',
        data: dmSansRegular,
        weight: 400,
        style: 'normal',
      },
      {
        name: 'DM Sans',
        data: dmSansBold,
        weight: 700,
        style: 'normal',
      },
      {
        name: 'Playfair Display',
        data: playfairBold,
        weight: 700,
        style: 'normal',
      },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: {
      mode: 'width',
      value: 1200,
    },
  });

  const pngData = resvg.render();
  return pngData.asPng();
}
