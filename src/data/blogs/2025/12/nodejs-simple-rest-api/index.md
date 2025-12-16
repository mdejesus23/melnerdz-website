---
title: Building a Simple REST API with Node.js (No Frameworks)
pubDate: 2025-12-14
author: Melnard
slug: nodejs-simple-rest-api-no-framework
image:
  src: ./main.png
  alt: Node.js REST API concept
description: Step-by-step tutorial to build a minimal, production-minded REST API using only Node.js core modules—no Express—covering routing, JSON parsing, CORS, status codes, and error handling.
technology:
  - node.js
  - node http
  - http
  - api
tags:
  - node.js
  - backend
  - api
---

In this tutorial, we’ll build a REST API using only Node.js core modules (no frameworks). You’ll learn how to:

- Create an HTTP server
- Implement routing manually
- Parse JSON request bodies safely
- Set CORS headers
- Return correct status codes and errors
- Handle graceful shutdown

## What is a REST API?

**REST** (Representational State Transfer) is an architectural style for building web services. A REST API allows different applications to communicate over HTTP using standard methods:

| HTTP Method | Purpose                 | Example                   |
| ----------- | ----------------------- | ------------------------- |
| `GET`       | Retrieve data           | Get all todos             |
| `POST`      | Create new data         | Add a new todo            |
| `PUT`       | Replace entire resource | Replace a todo completely |
| `PATCH`     | Update part of resource | Mark todo as done         |
| `DELETE`    | Remove data             | Delete a todo             |

Think of it like a waiter at a restaurant: your frontend (customer) makes requests, and the API (waiter) delivers responses from the backend (kitchen).

## Prerequisites

Before we start, make sure you have:

- **Node.js** (v18 or later) - [Download here](https://nodejs.org)
- A code editor (VS Code recommended)
- Basic JavaScript knowledge
- A terminal/command line

Verify your Node.js installation:

```bash
node --version
# Should output v18.x.x or higher
```

Optional tooling (recommended as you grow):

- `nodemon` for auto‑restarts during development
- `dotenv` for environment variables
- `helmet` and `cors` for security and cross‑origin access
- `pino` (or `morgan`) for logging

## Project Setup

### 1. Create Project Directory

```bash
mkdir todo-api
cd todo-api
```

### 2. Initialize Node.js Project

```bash
npm init -y
```

This creates a `package.json` file that tracks your project dependencies and metadata.

### 3. Enable ES Modules

Open `package.json` and add the `type` field:

```json
{
  "name": "todo-api",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node server.js",
    "dev": "node --watch server.js"
  }
}
```

The `"type": "module"` enables modern `import/export` syntax instead of the older `require()` style.

Alternatively, you can stay on CommonJS by omitting `type: "module"` and using `require()` across the codebase. Pick one style and keep it consistent.

### 4. Install Dependencies

No external dependencies required for the core API. Optionally:

```bash
npm install dotenv pino
```

- **dotenv** — loads environment variables from a `.env` file
- **pino** — fast JSON logger

## Building the Server (Node core only)

Create a file called `server.js`:

```js
// server.js (no frameworks)
import http from 'node:http';
import { URL } from 'node:url';

const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

// Simple in-memory store
let todos = [
  { id: 1, title: 'Learn Node.js', done: false },
  { id: 2, title: 'Build a REST API', done: false },
];

const generateId = () => Date.now();
const findTodo = (id) => todos.find((t) => t.id === id);

// Utility: send JSON
function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

// Utility: parse JSON body safely
async function parseJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      // protect against huge bodies (simple limit ~1MB)
      if (data.length > 1_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // Routing
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  // GET /todos
  if (req.method === 'GET' && pathname === '/todos') {
    return sendJson(res, 200, todos);
  }

  // GET /todos/:id
  if (req.method === 'GET' && pathname.startsWith('/todos/')) {
    const idStr = pathname.split('/')[2];
    const id = Number(idStr);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, {
        error: 'Bad request',
        message: 'id must be a number',
      });
    }
    const todo = findTodo(id);
    if (!todo) {
      return sendJson(res, 404, {
        error: 'Not found',
        message: `Todo with id ${id} does not exist`,
      });
    }
    return sendJson(res, 200, todo);
  }

  // POST /todos
  if (req.method === 'POST' && pathname === '/todos') {
    try {
      const body = await parseJson(req);
      const { title } = body;
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return sendJson(res, 400, {
          error: 'Bad request',
          message: 'Title is required and must be a non-empty string',
        });
      }
      const todo = {
        id: generateId(),
        title: title.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      };
      todos.push(todo);
      return sendJson(res, 201, todo);
    } catch (err) {
      if (err.message === 'Invalid JSON') {
        return sendJson(res, 400, {
          error: 'Bad request',
          message: 'Invalid JSON',
        });
      }
      if (err.message === 'Payload too large') {
        return sendJson(res, 413, { error: 'Payload too large' });
      }
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  }

  // PATCH /todos/:id
  if (req.method === 'PATCH' && pathname.startsWith('/todos/')) {
    const idStr = pathname.split('/')[2];
    const id = Number(idStr);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, {
        error: 'Bad request',
        message: 'id must be a number',
      });
    }
    const todo = findTodo(id);
    if (!todo) {
      return sendJson(res, 404, {
        error: 'Not found',
        message: `Todo with id ${id} does not exist`,
      });
    }
    try {
      const updates = await parseJson(req);
      const allowed = ['title', 'done'];
      for (const key of Object.keys(updates)) {
        if (!allowed.includes(key)) {
          return sendJson(res, 400, {
            error: 'Bad request',
            message: `Field '${key}' cannot be updated`,
          });
        }
      }
      Object.assign(todo, updates);
      todo.updatedAt = new Date().toISOString();
      return sendJson(res, 200, todo);
    } catch (err) {
      if (err.message === 'Invalid JSON') {
        return sendJson(res, 400, {
          error: 'Bad request',
          message: 'Invalid JSON',
        });
      }
      if (err.message === 'Payload too large') {
        return sendJson(res, 413, { error: 'Payload too large' });
      }
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  }

  // DELETE /todos/:id
  if (req.method === 'DELETE' && pathname.startsWith('/todos/')) {
    const idStr = pathname.split('/')[2];
    const id = Number(idStr);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, {
        error: 'Bad request',
        message: 'id must be a number',
      });
    }
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return sendJson(res, 404, {
        error: 'Not found',
        message: `Todo with id ${id} does not exist`,
      });
    }
    todos.splice(index, 1);
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  // Fallback 404
  return sendJson(res, 404, {
    error: 'Not found',
    message: `Route ${req.method} ${pathname} does not exist`,
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});
```

### Understanding the flow without middleware

With Node’s core `http` module, you implement the logic explicitly:

- Read the request (method, URL, headers)
- Parse the body if needed
- Route to a handler based on method/path
- Write headers and status code
- End the response

### In-Memory Data Store

For simplicity, we'll store data in memory. In production, you'd use a database.

```js
// Our "database" - resets when server restarts
let todos = [
  { id: 1, title: 'Learn Node.js', done: false },
  { id: 2, title: 'Build a REST API', done: false },
];

// Helper to generate unique IDs
const generateId = () => Date.now();

// Helper to find todo safely
const findTodo = (id) => todos.find((t) => t.id === id);
```

## Creating CRUD Endpoints (manual routing)

CRUD stands for **C**reate, **R**ead, **U**pdate, **D**elete - the four basic operations for managing data.

### GET - Retrieve All Todos

```js
// In server.js: GET /todos
if (req.method === 'GET' && pathname === '/todos') {
  return sendJson(res, 200, todos);
}
```

**What's happening:**

1. When someone visits `GET /todos`, Express calls this function
2. `req` (request) contains info about the incoming request
3. `res` (response) is used to send data back
4. `res.json()` sends JSON data with proper `Content-Type` headers

**Test it:**

```bash
curl http://localhost:3000/todos
```

### GET - Retrieve Single Todo

```js
// In server.js: GET /todos/:id
if (req.method === 'GET' && pathname.startsWith('/todos/')) {
  const id = Number(pathname.split('/')[2]);
  if (Number.isNaN(id)) {
    return sendJson(res, 400, {
      error: 'Bad request',
      message: 'id must be a number',
    });
  }
  const todo = findTodo(id);
  if (!todo) {
    return sendJson(res, 404, {
      error: 'Not found',
      message: `Todo with id ${id} does not exist`,
    });
  }
  return sendJson(res, 200, todo);
}
```

**Key concepts:**

- `:id` is a **route parameter** - it captures whatever value is in that URL position
- `req.params.id` returns a string, so we convert it to a number
- Always return appropriate status codes (404 for not found)

**Test it:**

```bash
curl http://localhost:3000/todos/1
```

### POST - Create New Todo

```js
// In server.js: POST /todos
if (req.method === 'POST' && pathname === '/todos') {
  const body = await parseJson(req);
  const { title } = body;
  if (!title || typeof title !== 'string' || title.trim() === '') {
    return sendJson(res, 400, {
      error: 'Bad request',
      message: 'Title is required and must be a non-empty string',
    });
  }
  const todo = {
    id: generateId(),
    title: title.trim(),
    done: false,
    createdAt: new Date().toISOString(),
  };
  todos.push(todo);
  return sendJson(res, 201, todo);
}
```

**Key concepts:**

- Request body (`req.body`) contains data sent by the client
- Always validate input before using it
- Status `201` indicates a resource was created
- Return the created object so the client has the generated ID

**Test it:**

```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Express"}'
```

### PATCH - Update Todo

```js
// In server.js: PATCH /todos/:id
if (req.method === 'PATCH' && pathname.startsWith('/todos/')) {
  const id = Number(pathname.split('/')[2]);
  if (Number.isNaN(id)) {
    return sendJson(res, 400, {
      error: 'Bad request',
      message: 'id must be a number',
    });
  }
  const todo = findTodo(id);
  if (!todo) {
    return sendJson(res, 404, {
      error: 'Not found',
      message: `Todo with id ${id} does not exist`,
    });
  }
  const updates = await parseJson(req);
  const allowed = ['title', 'done'];
  for (const key of Object.keys(updates)) {
    if (!allowed.includes(key)) {
      return sendJson(res, 400, {
        error: 'Bad request',
        message: `Field '${key}' cannot be updated`,
      });
    }
  }
  Object.assign(todo, updates);
  todo.updatedAt = new Date().toISOString();
  return sendJson(res, 200, todo);
}
```

**Why PATCH instead of PUT?**

- `PUT` replaces the entire resource
- `PATCH` updates only the fields you send
- For partial updates (like marking done), PATCH is more appropriate

**Test it:**

```bash
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

### DELETE - Remove Todo

```js
// In server.js: DELETE /todos/:id
if (req.method === 'DELETE' && pathname.startsWith('/todos/')) {
  const id = Number(pathname.split('/')[2]);
  if (Number.isNaN(id)) {
    return sendJson(res, 400, {
      error: 'Bad request',
      message: 'id must be a number',
    });
  }
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) {
    return sendJson(res, 404, {
      error: 'Not found',
      message: `Todo with id ${id} does not exist`,
    });
  }
  todos.splice(index, 1);
  res.writeHead(204, {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  return res.end();
}
```

**Key concepts:**

- Status `204` means success but no content to return
- `.end()` sends the response without a body
- We use `findIndex` + `splice` to remove by index (more efficient than filter for single removal)

**Test it:**

```bash
curl -X DELETE http://localhost:3000/todos/1
```

## Error Handling

In Node core, handle errors by catching JSON parsing issues, guarding against large payloads, and returning appropriate status codes for invalid input, missing resources, and server errors. We also demonstrated graceful shutdown using `server.close()` on SIGINT/SIGTERM.

## Starting the Server

Run the server:

```bash
node server.js
```

## Complete Code

Here's the full `server.js` file:

```js
import http from 'node:http';
import { URL } from 'node:url';

const PORT = process.env.PORT || 3000;

let todos = [
  { id: 1, title: 'Learn Node.js', done: false },
  { id: 2, title: 'Build a REST API', done: false },
];

const generateId = () => Date.now();
const findTodo = (id) => todos.find((t) => t.id === id);

function sendJson(res, status, data) {
  const body = JSON.stringify(data);
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(body);
}

async function parseJson(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => {
      data += chunk;
      if (data.length > 1_000_000) {
        reject(new Error('Payload too large'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!data) return resolve({});
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;

  if (req.method === 'GET' && pathname === '/todos') {
    return sendJson(res, 200, todos);
  }

  if (req.method === 'GET' && pathname.startsWith('/todos/')) {
    const id = Number(pathname.split('/')[2]);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, {
        error: 'Bad request',
        message: 'id must be a number',
      });
    }
    const todo = findTodo(id);
    if (!todo) {
      return sendJson(res, 404, {
        error: 'Not found',
        message: `Todo with id ${id} does not exist`,
      });
    }
    return sendJson(res, 200, todo);
  }

  if (req.method === 'POST' && pathname === '/todos') {
    try {
      const body = await parseJson(req);
      const { title } = body;
      if (!title || typeof title !== 'string' || title.trim() === '') {
        return sendJson(res, 400, {
          error: 'Bad request',
          message: 'Title is required and must be a non-empty string',
        });
      }
      const todo = {
        id: generateId(),
        title: title.trim(),
        done: false,
        createdAt: new Date().toISOString(),
      };
      todos.push(todo);
      return sendJson(res, 201, todo);
    } catch (err) {
      if (err.message === 'Invalid JSON') {
        return sendJson(res, 400, {
          error: 'Bad request',
          message: 'Invalid JSON',
        });
      }
      if (err.message === 'Payload too large') {
        return sendJson(res, 413, { error: 'Payload too large' });
      }
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  }

  if (req.method === 'PATCH' && pathname.startsWith('/todos/')) {
    const id = Number(pathname.split('/')[2]);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, {
        error: 'Bad request',
        message: 'id must be a number',
      });
    }
    const todo = findTodo(id);
    if (!todo) {
      return sendJson(res, 404, {
        error: 'Not found',
        message: `Todo with id ${id} does not exist`,
      });
    }
    try {
      const updates = await parseJson(req);
      const allowed = ['title', 'done'];
      for (const key of Object.keys(updates)) {
        if (!allowed.includes(key)) {
          return sendJson(res, 400, {
            error: 'Bad request',
            message: `Field '${key}' cannot be updated`,
          });
        }
      }
      Object.assign(todo, updates);
      todo.updatedAt = new Date().toISOString();
      return sendJson(res, 200, todo);
    } catch (err) {
      if (err.message === 'Invalid JSON') {
        return sendJson(res, 400, {
          error: 'Bad request',
          message: 'Invalid JSON',
        });
      }
      if (err.message === 'Payload too large') {
        return sendJson(res, 413, { error: 'Payload too large' });
      }
      return sendJson(res, 500, { error: 'Internal server error' });
    }
  }

  if (req.method === 'DELETE' && pathname.startsWith('/todos/')) {
    const id = Number(pathname.split('/')[2]);
    if (Number.isNaN(id)) {
      return sendJson(res, 400, {
        error: 'Bad request',
        message: 'id must be a number',
      });
    }
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) {
      return sendJson(res, 404, {
        error: 'Not found',
        message: `Todo with id ${id} does not exist`,
      });
    }
    todos.splice(index, 1);
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    });
    return res.end();
  }

  return sendJson(res, 404, {
    error: 'Not found',
    message: `Route ${req.method} ${pathname} does not exist`,
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});
process.on('SIGTERM', () => {
  console.log('Shutting down...');
  server.close(() => process.exit(0));
});
```

## Testing Your API

### Using curl

```bash
# Get all todos
curl http://localhost:3000/todos

# Create a todo
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Buy groceries"}'

# Update a todo
curl -X PATCH http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'

# Delete a todo
curl -X DELETE http://localhost:3000/todos/1
```

### Using a REST Client

For a better experience, try:

- **Thunder Client** (VS Code extension)
- **Postman** (standalone app)
- **Insomnia** (standalone app)

## HTTP Status Codes Reference

| Code  | Meaning               | When to Use            |
| ----- | --------------------- | ---------------------- |
| `200` | OK                    | Successful GET, PATCH  |
| `201` | Created               | Successful POST        |
| `204` | No Content            | Successful DELETE      |
| `400` | Bad Request           | Invalid input          |
| `404` | Not Found             | Resource doesn't exist |
| `500` | Internal Server Error | Something broke        |

## Next Steps

Now that you have a working API, here are ways to improve it:

### 1. Add Input Validation with Zod

```bash
npm install zod
```

```js
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().min(1).max(200),
  done: z.boolean().optional(),
});

// In your POST route
const result = todoSchema.safeParse(req.body);
if (!result.success) {
  return res.status(400).json({ errors: result.error.issues });
}
// If valid, use result.data
```

### 2. Connect a Database

Replace the in-memory array with SQLite or PostgreSQL for persistent storage.

### 3. Add Authentication

Protect your routes with JWT tokens or session-based auth.

### 4. Structure for Scale

As your API grows, organize code into separate files:

```
src/
├── routes/
│   └── todos.js
├── controllers/
│   └── todoController.js
├── middleware/
│   └── errorHandler.js
└── server.js
```

### 5. Add minimal tests (optional)

You can quickly test routes using Supertest with Vitest or Jest.

```bash
npm i -D supertest vitest
```

Create `test/todos.test.js`:

```js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import express from 'express';

// minimal app for tests
const app = express();
app.use(express.json());
let todos = [{ id: 1, title: 'Test', done: false }];
app.get('/todos', (req, res) => res.json(todos));

describe('GET /todos', () => {
  it('returns todos', async () => {
    const res = await request(app).get('/todos');
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(1);
  });
});
```

Run tests:

```bash
npx vitest run
```

## Summary

You've built a complete REST API that:

- Handles all CRUD operations
- Returns proper status codes
- Validates input data
- Has error handling
- Uses middleware for logging and CORS

This foundation will serve you well as you build more complex applications. The patterns here - route handlers, middleware, validation, error handling - apply to any Node.js backend, regardless of scale.
