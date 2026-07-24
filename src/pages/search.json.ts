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
  // Blog rendering is disabled, so blog entries are left out of the index to
  // avoid surfacing links to pages that are no longer built.
  const projects = await getProjects();

  return Response.json([...projects], { status: 200 });
}
