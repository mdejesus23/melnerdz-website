# Tech Blog Writing Rules

When writing tech blogs for this website, follow these guidelines to maintain consistency and quality.

## File Location & Structure

- Place blog posts in: `src/data/blogs/YYYY/MM/[slug]/index.md`
- Include a `main.png` image in the same directory for the blog cover image
- Use `.md` extension (or `.mdx` if components are needed)

## Required Frontmatter Schema

Every blog post MUST include this frontmatter:

```yaml
---
title: string           # Clear, descriptive title
pubDate: YYYY-MM-DD     # Publication date
author: Melnard         # Author name
slug: kebab-case-slug   # URL-friendly slug (must be unique)
image:
  src: ./main.png       # Cover image (relative path)
  alt: string           # Descriptive alt text for accessibility
description: string     # 1-2 sentence summary for SEO/previews
technology:             # Optional - list of technologies covered
  - tech-name
tags:                   # Required - list of relevant tags
  - tag-name
---
```

## Content Guidelines

### Structure
- Start with a hook or analogy to make concepts accessible
- Use `###` for main sections (h3 headings)
- Break complex topics into digestible sections
- Include practical code examples with syntax highlighting
- End with takeaways, tips, or FAQ section

### Writing Style
- Write in a developer-friendly, conversational tone
- Explain concepts before diving into implementation
- Use analogies to simplify complex topics (e.g., "Think of X as a librarian...")
- Keep paragraphs short and scannable
- Use bullet points and numbered lists for steps/phases

### Code Examples
- Use fenced code blocks with language identifier: \`\`\`js, \`\`\`python, etc.
- Include comments explaining non-obvious code
- Show expected output where helpful
- Provide "try this" examples for interactive learning

### Technical Content
- Include "Don'ts" or "Common Pitfalls" sections for advanced topics
- Add "When to use what" comparisons when discussing alternatives
- Include FAQ section for anticipated questions
- Link to official docs for further reading

## Tags & Technology Conventions

### Tags (lowercase, kebab-case)
- Use broad categories: `backend`, `frontend`, `performance`, `tutorial`
- Include framework/language names: `node.js`, `python`, `astro`

### Technology (lowercase)
- List specific technologies used/discussed
- Include runtime/framework: `node.js`, `javascript`, `python`

## Image Requirements

- Cover image: `main.png` in the blog directory
- Alt text: Descriptive, accessibility-friendly
- Use relative paths: `./main.png`

## SEO Best Practices

- Title: Include primary keyword, keep under 60 characters
- Description: Summarize value proposition, 120-160 characters
- Slug: Short, keyword-rich, lowercase with hyphens

## Example Frontmatter

```yaml
---
title: Understanding the Node.js Event Loop
pubDate: 2025-12-15
author: Melnard
slug: nodejs-event-loop
image:
  src: ./main.png
  alt: Node.js event loop illustration
description: A practical, developer-friendly guide to how the Node.js event loop works, including phases, the microtask queue, timers, I/O callbacks, and common pitfalls.
technology:
  - node.js
  - javascript
  - runtime
tags:
  - node.js
  - backend
  - performance
---
```
