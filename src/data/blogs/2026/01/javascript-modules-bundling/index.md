---
title: JavaScript Modules & Bundling
pubDate: 2026-01-25
author: Melnard
slug: javascript-modules-bundling
image:
  src: ./main.png
  alt: JavaScript modules and bundling visualization showing code being organized and optimized
description: Master CommonJS vs ES Modules, tree-shaking, and code splitting to build faster web apps with Vite and Astro.
technology:
  - javascript
  - vite
  - astro
tags:
  - javascript
  - frontend
  - performance
  - bundling
faqs:
  - question: Should I use CommonJS or ES Modules in 2026?
    answer: Use ES Modules for new projects. They're the standard, support tree-shaking, and work natively in browsers. Only use CommonJS when working with legacy Node.js code or older packages.
  - question: Does Vite bundle my code during development?
    answer: No. Vite serves ES Modules directly to the browser during development, which is why it's so fast. It only bundles for production using Rollup.
  - question: Can tree-shaking remove unused code from CommonJS modules?
    answer: Not effectively. Tree-shaking relies on static analysis of import/export statements, which CommonJS doesn't support due to its dynamic nature.
  - question: What's the difference between code splitting and lazy loading?
    answer: Code splitting is the technique of breaking code into chunks. Lazy loading is when you load those chunks on demand (e.g., when a user navigates to a route). They work together.
  - question: Do I need to configure tree-shaking in Vite or Astro?
    answer: No. Both Vite and Astro enable tree-shaking by default in production builds. Just use ES Modules and avoid side effects in your code.
---

Think of your JavaScript codebase like a shipping warehouse. You have thousands of products (functions, classes, utilities), but each customer order (page) only needs specific items. Would you ship the entire warehouse to every customer? That's what happens when you don't optimize your bundles.

Modern bundlers like Vite and frameworks like Astro solve this problem using three key techniques: smart module systems, tree-shaking, and code splitting. Understanding these concepts is essential for building fast web applications.

### Why modules matter

Before ES6, JavaScript had no native module system. Developers used script tags, IIFEs (Immediately Invoked Function Expressions), and patterns like the Revealing Module Pattern to organize code. It was messy.

```html
<!-- The old days: order matters, globals everywhere -->
<script src="jquery.js"></script>
<script src="utils.js"></script>
<script src="app.js"></script>
```

Every script shared the global scope. Name collisions were common. Dependencies were implicit. Testing was painful.

Modules changed everything by giving us explicit imports, exports, and encapsulation.

### CommonJS: The Node.js standard

CommonJS was created for Node.js in 2009. It uses `require()` to import and `module.exports` to export.

```js
// math.js (CommonJS)
function add(a, b) {
  return a + b;
}

function multiply(a, b) {
  return a * b;
}

module.exports = { add, multiply };
```

```js
// app.js (CommonJS)
const { add } = require('./math');
console.log(add(2, 3)); // 5
```

**Key characteristics of CommonJS:**

- **Synchronous loading**: `require()` blocks execution until the module loads
- **Dynamic**: You can require modules conditionally or compute paths at runtime
- **Designed for servers**: Synchronous loading works fine when files are on disk

```js
// Dynamic require (CommonJS allows this)
const moduleName = condition ? 'moduleA' : 'moduleB';
const module = require(`./${moduleName}`);

// Conditional require
if (process.env.NODE_ENV === 'development') {
  require('./devTools');
}
```

This flexibility comes at a cost—bundlers can't always know what code is actually used.

### ES Modules: The modern standard

ES Modules (ESM) were introduced in ES6 (2015) and are now the official JavaScript module system. They use `import` and `export` keywords.

```js
// math.js (ES Modules)
export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// Default export
export default function subtract(a, b) {
  return a - b;
}
```

```js
// app.js (ES Modules)
import subtract, { add } from './math.js';
console.log(add(2, 3)); // 5
console.log(subtract(5, 2)); // 3
```

**Key characteristics of ES Modules:**

- **Asynchronous loading**: Imports are resolved before execution
- **Static structure**: Imports/exports must be at the top level (not inside conditions)
- **Live bindings**: Exports are references, not copies
- **Browser-native**: Works directly in browsers with `<script type="module">`

```js
// This is NOT allowed in ES Modules
if (condition) {
  import something from './module'; // SyntaxError!
}

// Dynamic imports ARE allowed (returns a Promise)
if (condition) {
  const module = await import('./module.js');
}
```

### CommonJS vs ES Modules: Side-by-side comparison

| Feature         | CommonJS                      | ES Modules         |
| --------------- | ----------------------------- | ------------------ |
| Syntax          | `require()`, `module.exports` | `import`, `export` |
| Loading         | Synchronous                   | Asynchronous       |
| Structure       | Dynamic                       | Static             |
| Browser support | Needs bundler                 | Native             |
| Tree-shaking    | Limited                       | Full support       |
| Top-level await | No                            | Yes                |
| File extension  | `.js`, `.cjs`                 | `.js`, `.mjs`      |

**When to use which:**

- **ES Modules**: New projects, browser code, libraries, anything with Vite/Astro
- **CommonJS**: Legacy Node.js projects, older npm packages, dynamic module loading

### Tree-shaking: Eliminating dead code

Tree-shaking is the process of removing unused code from your final bundle. The name comes from the idea of "shaking" a tree to make dead leaves fall off.

Here's a practical example:

```js
// utils.js - A utility library with many functions
export function formatDate(date) {
  return date.toISOString().split('T')[0];
}

export function formatCurrency(amount) {
  return `$${amount.toFixed(2)}`;
}

export function formatPhoneNumber(phone) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

export function formatSSN(ssn) {
  return ssn.replace(/(\d{3})(\d{2})(\d{4})/, '$1-$2-$3');
}
```

```js
// app.js - Only uses one function
import { formatDate } from './utils.js';

console.log(formatDate(new Date()));
```

Without tree-shaking, your bundle includes all four functions (~500 bytes). With tree-shaking, it only includes `formatDate` (~100 bytes).

**Why ES Modules enable tree-shaking:**

The static structure of ES Modules means bundlers can analyze your code at build time:

```js
// Bundler sees this at build time:
import { formatDate } from './utils.js';
//        ↑ Only formatDate is imported

// Bundler removes: formatCurrency, formatPhoneNumber, formatSSN
```

**Why CommonJS breaks tree-shaking:**

CommonJS is dynamic, so bundlers can't be certain what's used:

```js
// Bundler can't safely analyze this:
const utils = require('./utils');
const fn = utils[someVariable]; // Which function? Unknown at build time!
```

**Writing tree-shakeable code:**

```js
// Bad: Barrel file that re-exports everything
// utils/index.js
export * from './formatters';
export * from './validators';
export * from './helpers';
// Bundler may include everything

// Good: Direct imports
import { formatDate } from './utils/formatters';
```

```js
// Bad: Side effects at module level
let config = {};
fetch('/config.json')
  .then((r) => r.json())
  .then((c) => (config = c));
export { config };
// Bundler can't remove this - it has side effects!

// Good: Pure exports
export function getConfig() {
  return fetch('/config.json').then((r) => r.json());
}
```

### Code splitting: Loading only what you need

Code splitting breaks your application into smaller chunks that load on demand. Instead of one massive bundle, you get multiple smaller files.

**Why code splitting matters:**

```
Without code splitting:
├── bundle.js (500KB) ← User downloads everything upfront

With code splitting:
├── main.js (50KB)      ← Initial load
├── dashboard.js (100KB) ← Loads when user visits /dashboard
├── settings.js (80KB)   ← Loads when user visits /settings
└── charts.js (150KB)    ← Loads when charts are needed
```

Users see your app faster because they only download what's needed for the current page.

**Dynamic imports for code splitting:**

ES Modules support dynamic imports that return Promises:

```js
// Static import - always loaded
import { heavyFunction } from './heavy-module.js';

// Dynamic import - loaded on demand
const button = document.getElementById('loadChart');
button.addEventListener('click', async () => {
  const { renderChart } = await import('./charts.js');
  renderChart(data);
});
```

**Route-based code splitting:**

Most frameworks automatically split code by route:

```js
// React with React.lazy
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}
```

```js
// Vue with defineAsyncComponent
import { defineAsyncComponent } from 'vue';

const Dashboard = defineAsyncComponent(
  () => import('./components/Dashboard.vue'),
);
```

### How Vite handles modules and bundling

Vite takes a fundamentally different approach than traditional bundlers like Webpack.

**Development mode: No bundling**

Vite serves ES Modules directly to the browser:

```
Browser requests: /src/main.js
         ↓
Vite transforms: TypeScript → JavaScript, JSX → JavaScript
         ↓
Browser receives: ES Module (import statements intact)
         ↓
Browser requests: Each imported module separately
```

This is why Vite development servers start instantly—no bundling required.

**Production mode: Optimized bundling with Rollup**

For production, Vite uses Rollup to:

1. **Tree-shake** unused code
2. **Code-split** automatically at dynamic import boundaries
3. **Minify** JavaScript and CSS
4. **Generate** optimized chunks with content hashes

```js
// vite.config.js - Code splitting configuration
export default {
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Group vendor libraries into separate chunks
          'vendor-react': ['react', 'react-dom'],
          'vendor-charts': ['chart.js', 'd3'],
        },
      },
    },
  },
};
```

### How Astro optimizes your bundles

Astro is designed for content-focused websites and takes optimization even further.

**Zero JavaScript by default:**

Astro components ship zero JavaScript unless you explicitly add interactivity:

```astro
---
// This runs at build time only
const posts = await fetch('https://api.example.com/posts').then(r => r.json());
---

<!-- This is static HTML - no JavaScript shipped -->
<ul>
  {posts.map(post => (
    <li>{post.title}</li>
  ))}
</ul>
```

**Partial hydration with client directives:**

Astro only loads JavaScript for interactive components:

```astro
---
import StaticHeader from './Header.astro';
import InteractiveSearch from './Search.jsx';
import HeavyChart from './Chart.jsx';
---

<!-- No JavaScript -->
<StaticHeader />

<!-- Loads immediately -->
<InteractiveSearch client:load />

<!-- Loads when visible -->
<HeavyChart client:visible />

<!-- Loads when browser is idle -->
<Newsletter client:idle />
```

**Automatic code splitting:**

Each page and each client-hydrated component becomes its own chunk:

```
dist/
├── _astro/
│   ├── index.abc123.js    (page-specific JS)
│   ├── Search.def456.js   (Search component)
│   ├── Chart.ghi789.js    (Chart component)
│   └── hoisted.jkl012.js  (shared runtime)
```

### Performance checklist

Use this checklist to ensure your bundles are optimized:

**Module system:**

- Use ES Modules for all new code
- Add `"type": "module"` to package.json
- Convert CommonJS dependencies when possible

**Tree-shaking:**

- Import only what you need: `import { specific } from 'library'`
- Avoid barrel files that re-export everything
- Mark packages as side-effect-free in package.json
- Check bundle size with tools like `npx vite-bundle-visualizer`

**Code splitting:**

- Use dynamic imports for heavy features
- Implement route-based splitting
- Lazy load below-the-fold components
- Consider `client:visible` in Astro for charts/graphs

**Monitoring:**

- Set performance budgets
- Analyze bundles regularly
- Test on real devices with throttled connections

### Common pitfalls

**Importing the entire library:**

```js
// Bad: Imports everything (~70KB for lodash)
import _ from 'lodash';
_.debounce(fn, 300);

// Good: Imports only debounce (~2KB)
import debounce from 'lodash/debounce';
debounce(fn, 300);

// Better: Use a tree-shakeable alternative
import { debounce } from 'lodash-es';
```

**Circular dependencies:**

```js
// a.js
import { b } from './b.js';
export const a = 'A' + b;

// b.js
import { a } from './a.js';
export const b = 'B' + a; // a is undefined here!
```

**Side effects preventing tree-shaking:**

```js
// analytics.js
console.log('Analytics loaded'); // Side effect!
export function track(event) {
  /* ... */
}

// Even if track() is never used, the console.log runs
```

**Forgetting file extensions with ES Modules:**

```js
// Node.js with ES Modules requires extensions
import { helper } from './utils'; // Error!
import { helper } from './utils.js'; // Correct
```

### Takeaways

- **ES Modules** are the standard—use them for new projects and better tooling support
- **Tree-shaking** removes unused code but requires ES Modules and side-effect-free code
- **Code splitting** loads code on demand, improving initial page load
- **Vite** serves ES Modules directly in development and optimizes with Rollup for production
- **Astro** ships zero JavaScript by default and hydrates components selectively
- Always import specifically: `import { x }` not `import *`
- Use dynamic imports (`import()`) for features not needed immediately
- Analyze your bundles regularly to catch bloat early
