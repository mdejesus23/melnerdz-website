---
title: Astro.js Tutorials — Build Fast, Content-Focused Sites
pubDate: 2025-12-14
author: Melnard
slug: astrojs-tutorials
image:
  src: ./astro.png
  alt: Astro.js tutorials cover image
description: A curated set of bite-size Astro.js tutorials—from project setup and content collections to islands, integrations, and deployment.
technology:
  - astro
  - typescript
  - markdown
tags:
  - astro
  - web
  - tutorials
---

Astro helps you build fast, content‑focused websites by shipping little or no JavaScript by default. When you need interactivity, you can add it using “islands” powered by frameworks like React, Svelte, or Vue.

This beginner‑friendly guide walks you from a brand‑new project to deploying a production site, with clear steps and small, testable examples.

## What you’ll build

- A fresh Astro project you can run locally
- A Content Collection for blogs with a simple schema
- A page that lists blog posts
- A tiny interactive “Counter” island
- Tailwind and Sitemap integrations
- Guidance to deploy on Netlify or Vercel

## Prerequisites

- Node.js 18+ and npm
- Basic terminal usage
- Optional: Git installed

Check your versions:

```bash
node -v
npm -v
```

### 1) Create a project

```bash
npm create astro@latest
```

Follow the prompts:

- Choose “Empty” or “Blog” template (either is fine for learning)
- TypeScript: Yes (recommended)
- Install dependencies: Yes

Run the dev server:

```bash
npm run dev
```

Open http://localhost:4321 to see your site. Astro uses file‑based routing, so anything under `src/pages` becomes a route.

Project structure (simplified):

```text
src/
  pages/        # .astro files -> routes
  components/   # UI pieces (Astro/React/Vue/Svelte)
  content/      # Markdown/MDX and Content Collections
astro.config.mjs
```

### 2) Content Collections

Use `content.config.ts` to define schema‑validated content. Collections make your Markdown/MDX structured and type‑safe.

Example: define a `blog` collection with fields for title, description, tags, and date.

Create `src/content/config.ts` (or update it if it exists):

```ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().optional(),
  }),
});

export const collections = { blog };
```

Add a sample post at `src/content/blog/hello-astro.md`:

```markdown
---
title: Hello Astro
description: Your first post using Content Collections
pubDate: 2025-12-14
tags: [intro]
---

Welcome to Astro! This post is validated by your schema.
```

List posts in a page, e.g., `src/pages/blog.astro`:

```astro
---
import { getCollection } from 'astro:content';
const posts = await getCollection('blog');
---
<layout>
  <h1>Blog</h1>
  <ul>
    {posts.map((p) => (
      <li>
        <a href={`/blog/${p.slug}/`}>{p.data.title}</a>
        <small>{p.data.pubDate.toDateString()}</small>
      </li>
    ))}
  </ul>
</layout>
```

Then create dynamic routes for individual posts at `src/pages/blog/[slug].astro` using `getEntryBySlug`.

### 3) Islands (partial hydration)

Interactivity in Astro is opt‑in. Drop a React/Svelte/Vue component into an `.astro` page and control when it hydrates with directives like `client:load`, `client:idle`, or `client:visible`.

```astro
---
import Counter from '../components/Counter.jsx';
---
<Counter client:idle />
```

Example Counter (React): `src/components/Counter.jsx`

```jsx
import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount((c) => c + 1)}>Count: {count}</button>;
}
```

Place it in any `.astro` page and pick a directive:

- `client:idle` — hydrate after the browser is idle
- `client:load` — hydrate immediately on page load
- `client:visible` — hydrate when the component enters the viewport

### 4) Integrations

Popular ones: `@astrojs/tailwind`, `@astrojs/sitemap`, `@astrojs/image`.

Install Tailwind and Sitemap:

```bash
npm i -D @astrojs/tailwind @astrojs/sitemap
```

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://your-site.example',
  integrations: [tailwind(), sitemap()],
});
```

Tailwind usage: create `src/styles/global.css` and import it in `src/pages/_app.astro` or your main layout, then apply classes to elements.

### 5) Deployment

You can deploy to Netlify, Vercel, or any static host. Astro builds to static HTML by default.

Build locally:

```bash
npm run build
```

Preview the build:

```bash
npm run preview
```

For Netlify:

- Install the Netlify adapter: `npm i -D @astrojs/netlify`
- Update `astro.config.mjs`:

```js
import netlify from '@astrojs/netlify';
export default defineConfig({ adapter: netlify() });
```

For Vercel:

- Install the Vercel adapter: `npm i -D @astrojs/vercel`
- Update config: `export default defineConfig({ adapter: vercel() })`

Connect your repo and let the platform handle builds. Ensure `site` is set in `astro.config.mjs` for correct sitemap and canonical URLs.

## Tips and common pitfalls

- File names and slugs: Avoid spaces; use kebab‑case (e.g., `my-first-post.md`).
- Frontmatter dates: Use `YYYY-MM-DD`; make sure they’re valid if using `z.date()`.
- MDX vs Markdown: MDX lets you import components into your content, but requires the MDX integration.
- Images: Prefer `@astrojs/image` for optimized images.
- Client directives: Don’t overuse hydration—keep most pages static for speed.

---

Astro is ideal for content‑heavy sites that want great performance and a smooth developer experience. Start small, keep pages mostly static, and add islands only where interactivity truly helps.
