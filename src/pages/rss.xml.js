import rss from '@astrojs/rss';

export async function GET(context) {
  // Blog rendering is disabled — the feed is intentionally empty for now.
  return rss({
    title: 'Melnerdz',
    description: 'Portfolio of Melnard De Jesus, fullstack web developer.',
    site: context.site,
    items: [],
    customData: `<language>en-us</language>`,
  });
}
