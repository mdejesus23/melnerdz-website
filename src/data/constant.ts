import type {
  AboutPage,
  BreadcrumbList,
  CollectionPage,
  ContactPage,
  Person,
  ProfilePage,
  Thing,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

import ogImageSrc from '@/images/og-image.svg';

export const SITE = {
  title: 'Melnerdz',
  tagline: 'Crafting Modern and Robust Web Applications',
  description:
    'Explore my portfolio showcasing modern, user-friendly web applications. Specializing in front-end and full-stack development with a focus on responsive design, performance, and functionality.',
  description_short:
    'Portfolio of a web developer specializing in modern and robust applications.',
  url: 'https://melnerdz.com',
  author: 'Melnard De Jesus',
  jobTitle: 'Full-Stack Web Developer',
  email: 'me@melnerdz.com',
  /** Public-path logo used for the `Person` image in structured data. */
  logo: '/android-chrome-512x512.png',
};

/** Profiles that identify the same person — emitted as `sameAs`. */
export const SOCIALS = [
  'https://github.com/mdejesus23',
  'https://www.linkedin.com/in/melnard-de-jesus-279132278',
  'https://www.facebook.com/dejesusmelnard',
];

export const OG = {
  locale: 'en_US',
  type: 'website',
  url: SITE.url,
  title: `${SITE.title} - ${SITE.tagline}`,
  description:
    'Welcome to my portfolio. I specialize in creating high-quality web applications using React, Astro, Node.js, and more. Explore my projects and skills.',
  image: ogImageSrc,
};

/**
 * The site's primary entity. This is a personal portfolio, so the entity is a
 * `Person` rather than an `Organization` — reference it from a page's `about`,
 * `mainEntity`, `author`, or `creator` via `{ '@id': PERSON['@id'] }`.
 */
export const PERSON = {
  '@type': 'Person',
  '@id': `${SITE.url}/#person`,
  name: SITE.author,
  alternateName: SITE.title,
  url: SITE.url,
  image: `${SITE.url}${SITE.logo}`,
  description: SITE.description_short,
  jobTitle: SITE.jobTitle,
  email: SITE.email,
  knowsAbout: [
    'Web development',
    'Front-end development',
    'Full-stack development',
    'JavaScript',
    'TypeScript',
    'React',
    'Astro',
    'Node.js',
  ],
  sameAs: SOCIALS,
} satisfies Person;

export const ISPARTOF = {
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.title,
  description: SITE.description,
  inLanguage: 'en-US',
  publisher: { '@id': PERSON['@id'] },
} satisfies WebSite;

type PageType =
  | 'WebPage'
  | 'CollectionPage'
  | 'ContactPage'
  | 'AboutPage'
  | 'ProfilePage';

type PageNode = WebPage | CollectionPage | ContactPage | AboutPage | ProfilePage;

/** Schema.org page node — the shape every route was repeating by hand. */
export function pageSchema({
  type = 'WebPage',
  url,
  name,
  description,
}: {
  type?: PageType;
  url: string;
  name: string;
  description: string;
}): WithContext<PageNode> {
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': url,
    url,
    name,
    description,
    isPartOf: ISPARTOF,
    inLanguage: 'en-US',
  };
}

/** Breadcrumb node for an `@graph`. Omit `path` on the final crumb (current page). */
export function breadcrumbList(
  id: string,
  trail: { name: string; path?: string }[],
): BreadcrumbList {
  return {
    '@type': 'BreadcrumbList',
    '@id': `${id}#breadcrumb`,
    itemListElement: trail.map(({ name, path }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      ...(path !== undefined ? { item: `${SITE.url}${path}` } : {}),
    })),
  };
}

/**
 * Wrap `@id`-linked nodes in a single JSON-LD document. Use this instead of
 * emitting several standalone blobs so cross-references actually resolve.
 */
export function graph(nodes: Thing[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': nodes,
  };
}

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: graph([
    PERSON,
    ISPARTOF,
    {
      '@type': 'WebPage',
      '@id': SITE.url,
      url: SITE.url,
      name: SITE.title,
      description: SITE.description,
      isPartOf: { '@id': ISPARTOF['@id'] },
      about: { '@id': PERSON['@id'] },
      mainEntity: { '@id': PERSON['@id'] },
      inLanguage: 'en-US',
    },
  ]),
};
