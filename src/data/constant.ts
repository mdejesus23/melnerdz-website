import ogImageSrc from '../images/main.png';

export const SITE = {
  title: 'Melnerdz',
  tagline: 'Crafting Modern and Robust Web Applications',
  description:
    'Explore my portfolio showcasing modern, user-friendly web applications. Specializing in front-end and full-stack development with a focus on responsive design, performance, and functionality.',
  description_short:
    'Portfolio of a web developer specializing in modern and robust applications.',
  url: 'https://melnerdz.dev', // Replace with your portfolio URL
  author: 'Melnard De Jesus', // Replace with your name
};

export const ISPARTOF = {
  '@type': 'WebSite',
  url: SITE.url,
  name: SITE.title,
  description: SITE.description,
};

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    inLanguage: 'en-US',
    '@id': SITE.url,
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
    isPartOf: ISPARTOF,
  },
};

export const OG = {
  locale: 'en_US',
  type: 'website',
  url: SITE.url,
  title: `${SITE.title} - Crafting Modern and Robust Web Applications`,
  description:
    'Welcome to my portfolio. I specialize in creating high-quality web applications using React, Astro, Node.js, and more. Explore my projects and skills.',
  image: ogImageSrc, // Ensure this image is relevant to your portfolio
};
