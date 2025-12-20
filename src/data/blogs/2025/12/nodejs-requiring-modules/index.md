---
title: Requiring Modules in Node.js
pubDate: 2025-12-20
author: Melnard
slug: nodejs-requiring-modules
image:
  src: ./main.png
  alt: Node.js modules and require illustration
description: A beginner-friendly guide to understanding how Node.js modules work, how to use require(), and how to create your own modules.
technology:
  - node.js
  - javascript
tags:
  - node.js
  - backend
  - tutorial
---

Imagine you're building with LEGO blocks. Each block has a specific purpose, and you snap them together to create something bigger. In Node.js, modules work the same way—they're reusable pieces of code that you connect to build your application.

Instead of writing everything in one massive file, you break your code into smaller, focused modules. Need to read a file? There's a module for that. Need to make HTTP requests? There's a module for that too.

### What is a module?

A module is simply a JavaScript file that exports code (functions, objects, or values) for other files to use. Node.js has three types of modules:

1. **Core modules** - Built into Node.js (like `fs`, `path`, `http`)
2. **Local modules** - Files you create in your project
3. **Third-party modules** - Packages from npm (like `express`, `lodash`)

### The require() function

To use a module, you "require" it. The `require()` function reads a JavaScript file, executes it, and returns whatever that file exports.

```js
// Requiring a core module
const fs = require('fs');

// Requiring a local module
const myModule = require('./myModule');

// Requiring a third-party module
const express = require('express');
```

Notice the difference:
- Core and npm modules: just the name (`'fs'`, `'express'`)
- Local modules: start with `./` or `../` (`'./myModule'`)

### How Node.js finds modules

When you call `require('something')`, Node.js follows these steps:

1. **Is it a core module?** Check if `something` is built-in (like `fs`, `path`)
2. **Is it a file path?** If it starts with `./`, `../`, or `/`, look for that file
3. **Is it in node_modules?** Search the `node_modules` folder, then parent directories

```js
require('fs')           // Core module
require('./utils')      // Local file: ./utils.js
require('../config')    // Parent directory: ../config.js
require('express')      // node_modules/express
```

### Creating your first module

Let's create a simple module that greets users.

**greet.js**
```js
function sayHello(name) {
  return `Hello, ${name}!`;
}

function sayGoodbye(name) {
  return `Goodbye, ${name}!`;
}

// Export functions for other files to use
module.exports = {
  sayHello,
  sayGoodbye
};
```

**app.js**
```js
const greet = require('./greet');

console.log(greet.sayHello('Alice'));   // Hello, Alice!
console.log(greet.sayGoodbye('Bob'));   // Goodbye, Bob!
```

The `module.exports` object is the key—whatever you assign to it becomes available when other files require your module.

### Different ways to export

There are several patterns for exporting from modules:

**Export an object (most common)**
```js
// math.js
module.exports = {
  add: (a, b) => a + b,
  subtract: (a, b) => a - b
};

// Usage
const math = require('./math');
math.add(2, 3); // 5
```

**Export a single function**
```js
// logger.js
module.exports = function(message) {
  console.log(`[LOG]: ${message}`);
};

// Usage
const log = require('./logger');
log('Server started'); // [LOG]: Server started
```

**Export a class**
```js
// User.js
class User {
  constructor(name) {
    this.name = name;
  }

  greet() {
    return `Hi, I'm ${this.name}`;
  }
}

module.exports = User;

// Usage
const User = require('./User');
const alice = new User('Alice');
alice.greet(); // Hi, I'm Alice
```

**Add properties to exports**
```js
// helpers.js
exports.formatDate = (date) => date.toISOString();
exports.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

// Usage
const helpers = require('./helpers');
helpers.capitalize('hello'); // Hello
```

Note: `exports` is a shorthand for `module.exports`. They point to the same object initially, but if you reassign `module.exports`, the `exports` shorthand breaks.

### Using core modules

Node.js comes with many built-in modules. Here are some common ones:

```js
// File system - read/write files
const fs = require('fs');
const content = fs.readFileSync('file.txt', 'utf8');

// Path - work with file paths
const path = require('path');
const fullPath = path.join(__dirname, 'data', 'users.json');

// HTTP - create web servers
const http = require('http');
const server = http.createServer((req, res) => {
  res.end('Hello World');
});

// OS - operating system info
const os = require('os');
console.log(os.platform()); // 'linux', 'darwin', 'win32'

// Events - event handling
const EventEmitter = require('events');
const emitter = new EventEmitter();
```

### Installing and using npm modules

Third-party modules come from npm (Node Package Manager).

```bash
# Initialize a new project
npm init -y

# Install a package
npm install lodash
```

Then require it like a core module:

```js
const _ = require('lodash');

const numbers = [1, 2, 3, 4, 5];
console.log(_.sum(numbers)); // 15
console.log(_.shuffle(numbers)); // [3, 1, 5, 2, 4] (random order)
```

### Understanding module caching

Node.js caches modules after the first `require()`. This means:

```js
// counter.js
let count = 0;
module.exports = {
  increment: () => ++count,
  getCount: () => count
};
```

```js
// app.js
const counter1 = require('./counter');
const counter2 = require('./counter');

counter1.increment(); // 1
counter1.increment(); // 2
console.log(counter2.getCount()); // 2 (same module instance!)
```

Both `counter1` and `counter2` point to the same cached module. This is usually what you want, but be aware of it when working with stateful modules.

### The __dirname and __filename variables

Every module has access to two special variables:

```js
console.log(__filename); // Full path to current file
// /home/user/project/utils/helper.js

console.log(__dirname);  // Directory containing current file
// /home/user/project/utils
```

These are useful for building file paths:

```js
const path = require('path');
const dataPath = path.join(__dirname, '..', 'data', 'users.json');
```

### CommonJS vs ES Modules

Node.js supports two module systems:

**CommonJS (what we've been using)**
```js
// Exporting
module.exports = { add, subtract };

// Importing
const math = require('./math');
```

**ES Modules (modern JavaScript)**
```js
// Exporting
export { add, subtract };
export default multiply;

// Importing
import { add, subtract } from './math.js';
import multiply from './math.js';
```

To use ES Modules in Node.js:
- Use `.mjs` file extension, OR
- Add `"type": "module"` to your `package.json`

For beginners, CommonJS (`require`) is still the most common in Node.js tutorials and existing codebases.

### Practical example: Building a simple app

Let's put it all together with a mini project structure:

```
my-app/
├── index.js
├── config.js
├── utils/
│   ├── logger.js
│   └── formatter.js
└── package.json
```

**config.js**
```js
module.exports = {
  appName: 'My App',
  version: '1.0.0',
  debug: true
};
```

**utils/logger.js**
```js
const config = require('../config');

function log(message) {
  if (config.debug) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${message}`);
  }
}

module.exports = log;
```

**utils/formatter.js**
```js
exports.toUpperCase = (str) => str.toUpperCase();
exports.toLowercase = (str) => str.toLowerCase();
exports.capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
```

**index.js**
```js
const config = require('./config');
const log = require('./utils/logger');
const { capitalize } = require('./utils/formatter');

log(`Starting ${config.appName} v${config.version}`);
log(capitalize('hello world'));
```

Run it:
```bash
node index.js
# [2025-12-20T10:30:00.000Z] Starting My App v1.0.0
# [2025-12-20T10:30:00.000Z] Hello world
```

### Common pitfalls

- **Forgetting `./` for local files**: `require('myModule')` looks in `node_modules`, not your current directory
- **Circular dependencies**: Module A requires B, and B requires A—can cause unexpected `undefined` values
- **Modifying exports after requiring**: Changes won't affect other files that already required the module
- **Case sensitivity**: On Linux/Mac, `require('./User')` and `require('./user')` are different files

### Takeaways

- Modules help organize code into reusable, maintainable pieces
- Use `require()` to import and `module.exports` to export
- Core modules don't need installation; npm modules do
- Local file paths must start with `./` or `../`
- Modules are cached—requiring twice returns the same instance

---

FAQ

Q: What's the difference between `module.exports` and `exports`?
A: They initially point to the same object. Use `module.exports` when replacing the entire export; use `exports.something` when adding properties. If you reassign `exports = {}`, it breaks the reference.

Q: Should I use require() or import?
A: For new projects, ES Modules (`import`) is the modern standard. For existing Node.js projects or tutorials, `require()` (CommonJS) is still widely used. Both work in Node.js.

Q: Why does require() find modules in parent node_modules folders?
A: This allows shared dependencies between projects and supports monorepo structures. Node.js walks up the directory tree until it finds the module.

Q: Can I require JSON files?
A: Yes. `const data = require('./data.json')` automatically parses the JSON and returns a JavaScript object.
