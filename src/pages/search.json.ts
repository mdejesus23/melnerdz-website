import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

async function getPosts() {
  const posts: CollectionEntry<'blogs'>[] = (await getCollection('blogs')).sort(
    (a: CollectionEntry<'blogs'>, b: CollectionEntry<'blogs'>) =>
      a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );

  return posts.map((post) => ({
    slug: post.data.slug,
    collection: post.collection,
    title: post.data.title,
    description: post.data.description,
    date: post.data.pubDate,
  }));
}

async function getProjects() {
  const posts: CollectionEntry<'projects'>[] = (
    await getCollection('projects')
  ).sort(
    (a: CollectionEntry<'projects'>, b: CollectionEntry<'projects'>) =>
      a.data.pubDate.valueOf() - b.data.pubDate.valueOf(),
  );

  return posts.map((post) => ({
    slug: post.id,
    collection: post.collection,
    title: post.data.title,
    description: post.data.description,
    date: post.data.pubDate,
  }));
}

export async function GET() {
  const posts = await getPosts();
  const projects = await getProjects();

  // Combine the posts and journals into one array
  const allData = [...posts, ...projects];

  return Response.json(allData, { status: 200 });
}
