import type {
  AboutPage,
  BreadcrumbList,
  CollectionPage,
  ContactPage,
  Organization,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts';

export const SITE = {
  title: 'Klein Solutions',
  tagline: 'Your NetSuite is live. We keep it sharp.',
  description:
    'kleinsol is a consulting firm for companies already running NetSuite. We administer, automate, and extend your account — custom records, saved searches, dashboards, and SuiteScript that fits the way you actually work.',
  description_short:
    'NetSuite administration, automation, and development for companies already running it.',
  url: 'https://kleinsol.com',
  author: 'dar dev',
  email: 'hello@kleinsol.com',
  phoneNumber: '123 456 789',
  address: '123 Location Address',
};

export const ISPARTOF = {
  '@type': 'WebSite',
  '@id': `${SITE.url}/#website`,
  url: SITE.url,
  name: SITE.title,
  description: SITE.description,
} satisfies WebSite;

export const OG = {
  locale: 'en_US',
  type: 'website',
  url: SITE.url,
  title: SITE.title,
  description: SITE.description,
  image: '/Klein-Solutions-Color.png',
};

// Used as `creator` and `provider` in project structured data.
export const ORGANIZATION = {
  '@type': 'Organization',
  '@id': `${SITE.url}/#organization`,
  name: SITE.title,
  url: SITE.url,
  logo: `${SITE.url}${OG.image}`,
  description: SITE.description_short,
  slogan: SITE.tagline,
  knowsAbout: [
    'NetSuite',
    'NetSuite administration',
    'SuiteScript development',
    'NetSuite integrations',
  ],
  email: SITE.email,
  telephone: SITE.phoneNumber,
  // Placeholder values — break `address` into locality/region/postalCode/
  // addressCountry once the real details are known.
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address,
  },
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: SITE.email,
    telephone: SITE.phoneNumber,
    availableLanguage: 'English',
  },
} satisfies Organization;

type PageType = 'WebPage' | 'CollectionPage' | 'ContactPage' | 'AboutPage';

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
}): WithContext<WebPage | CollectionPage | ContactPage | AboutPage> {
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

export const SEO = {
  title: SITE.title,
  description: SITE.description,
  structuredData: pageSchema({
    url: SITE.url,
    name: SITE.title,
    description: SITE.description,
  }),
};
