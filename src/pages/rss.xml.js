import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

export async function GET(context) {
  const blog = await getCollection('blogs');

  return rss({
    title: 'Melnerdz Blog',
    description: 'A blog about spirituality, technology, and life.',
    site: context.site,
    items: blog.map((post) => ({
      // title: post.data.title,
      // pubDate: post.data.pubDate
      // description: post.data.description,
      link: `/blogs/${post.data.slug}/`,
      content: sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
      }),
      ...post.data,
    })),
    customData: `<language>en-us</language>`,
  });
}
