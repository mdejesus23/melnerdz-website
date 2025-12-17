---
title: Node.js Event Driven Architecture for Beginners
pubDate: 2025-12-17
author: Melnard
slug: nodejs-event-driven-architecture
image:
  src: ./main.png
  alt: Node.js event driven architecture diagram showing emitters and listeners
description: Learn how Node.js event driven architecture works with practical examples. Understand EventEmitter, custom events, and build real-world patterns.
technology:
  - node.js
  - javascript
  - backend
tags:
  - node.js
  - backend
  - tutorial
  - beginner
---

Imagine a restaurant kitchen. The chef doesn't stand at the door waiting for each customer to order. Instead, waiters take orders and shout them to the kitchen. The chef listens for these "order events" and starts cooking when they hear one.

That's exactly how Node.js works. It's an event-driven system where things happen in response to events, not in a strict sequence.

### What is Event Driven Architecture?

Event Driven Architecture (EDA) is a programming pattern where the flow of your program is determined by events. An event is simply something that happens: a user clicks a button, a file finishes loading, or a timer goes off.

In Node.js, this pattern is everywhere:

- When a request comes in, that's an event
- When a file is read, that's an event
- When data arrives from a database, that's an event

### Why Node.js Uses Events

Node.js is single-threaded. It can only do one thing at a time. So how does it handle thousands of simultaneous connections?

The answer: it doesn't wait around.

Instead of blocking while waiting for a file to read or a network request to complete, Node.js:

1. Starts the operation
2. Registers a callback to run when it's done
3. Moves on to handle other work
4. Runs the callback when the event fires

This is called non-blocking I/O, and events make it possible.

### The EventEmitter: Heart of Node.js Events

The `EventEmitter` class is the foundation of event handling in Node.js. Think of it as a megaphone system where:

- **Emitters** shout out that something happened
- **Listeners** wait to hear specific announcements

Here's the simplest possible example:

```js
const EventEmitter = require('events');

// Create a new emitter (like installing a megaphone)
const myEmitter = new EventEmitter();

// Add a listener (someone waiting for an announcement)
myEmitter.on('greeting', () => {
  console.log('Hello was called!');
});

// Emit the event (make the announcement)
myEmitter.emit('greeting');
// Output: Hello was called!
```

### Passing Data with Events

Events become powerful when you pass data along with them:

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Listener receives data from the event
emitter.on('userLoggedIn', (user) => {
  console.log(`Welcome back, ${user.name}!`);
});

// Emit with data
emitter.emit('userLoggedIn', { name: 'Alice', id: 123 });
// Output: Welcome back, Alice!
```

You can pass multiple arguments too:

```js
emitter.on('purchase', (item, quantity, price) => {
  console.log(`Bought ${quantity}x ${item} for $${price * quantity}`);
});

emitter.emit('purchase', 'Coffee', 2, 4.50);
// Output: Bought 2x Coffee for $9
```

### Common EventEmitter Methods

Here are the methods you'll use most often:

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// on() - Listen for an event (runs every time)
emitter.on('message', (msg) => console.log(msg));

// once() - Listen only once, then auto-remove
emitter.once('welcome', () => console.log('This runs once only'));

// emit() - Trigger an event
emitter.emit('message', 'Hello!');

// removeListener() - Stop listening
const handler = () => console.log('Handler');
emitter.on('test', handler);
emitter.removeListener('test', handler);

// removeAllListeners() - Remove all listeners for an event
emitter.removeAllListeners('message');

// listenerCount() - Check how many listeners exist
console.log(emitter.listenerCount('message')); // 0
```

### Real Example: Building a Simple Logger

Let's build something practical. A logger that emits events for different log levels:

```js
const EventEmitter = require('events');

class Logger extends EventEmitter {
  log(message) {
    // Emit a general log event
    this.emit('log', { level: 'info', message, timestamp: new Date() });
  }

  error(message) {
    // Emit an error event
    this.emit('log', { level: 'error', message, timestamp: new Date() });
  }

  warn(message) {
    // Emit a warning event
    this.emit('log', { level: 'warn', message, timestamp: new Date() });
  }
}

// Create logger instance
const logger = new Logger();

// Add listeners for different purposes
logger.on('log', (data) => {
  const time = data.timestamp.toISOString();
  console.log(`[${time}] ${data.level.toUpperCase()}: ${data.message}`);
});

// Could also save errors to a file
logger.on('log', (data) => {
  if (data.level === 'error') {
    // In real code: fs.appendFile('errors.log', ...)
    console.log('  -> Error saved to file');
  }
});

// Use the logger
logger.log('Server started');
logger.warn('Memory usage high');
logger.error('Database connection failed');
```

Output:

```
[2025-12-17T10:30:00.000Z] INFO: Server started
[2025-12-17T10:30:00.001Z] WARN: Memory usage high
[2025-12-17T10:30:00.002Z] ERROR: Database connection failed
  -> Error saved to file
```

### Events in Built-in Node.js Modules

Many Node.js modules use EventEmitter. You've probably used them without realizing:

**HTTP Server:**

```js
const http = require('http');

const server = http.createServer();

// 'request' is an event!
server.on('request', (req, res) => {
  res.end('Hello World');
});

server.listen(3000);
```

**File Streams:**

```js
const fs = require('fs');

const stream = fs.createReadStream('large-file.txt');

stream.on('data', (chunk) => {
  console.log(`Received ${chunk.length} bytes`);
});

stream.on('end', () => {
  console.log('File reading complete');
});

stream.on('error', (err) => {
  console.error('Error reading file:', err);
});
```

**Process Events:**

```js
// Runs before Node.js exits
process.on('exit', (code) => {
  console.log(`Exiting with code: ${code}`);
});

// Catch unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});
```

### Building an Order System

Let's build a more complete example - a simple order processing system:

```js
const EventEmitter = require('events');

class OrderSystem extends EventEmitter {
  constructor() {
    super();
    this.orders = [];
  }

  placeOrder(order) {
    // Add order to list
    this.orders.push(order);

    // Emit event so other parts of the system can react
    this.emit('orderPlaced', order);
  }

  processOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'processing';
      this.emit('orderProcessing', order);
    }
  }

  completeOrder(orderId) {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      order.status = 'completed';
      this.emit('orderCompleted', order);
    }
  }
}

// Create system
const orderSystem = new OrderSystem();

// Different parts of the app listen for events

// Inventory service
orderSystem.on('orderPlaced', (order) => {
  console.log(`[Inventory] Reserving items for order #${order.id}`);
});

// Email service
orderSystem.on('orderPlaced', (order) => {
  console.log(`[Email] Sending confirmation to ${order.customer}`);
});

orderSystem.on('orderCompleted', (order) => {
  console.log(`[Email] Sending receipt to ${order.customer}`);
});

// Analytics service
orderSystem.on('orderCompleted', (order) => {
  console.log(`[Analytics] Recording sale: $${order.total}`);
});

// Place an order
orderSystem.placeOrder({
  id: 1,
  customer: 'alice@example.com',
  items: ['Book', 'Pen'],
  total: 25.99
});

// Process and complete
orderSystem.processOrder(1);
orderSystem.completeOrder(1);
```

Output:

```
[Inventory] Reserving items for order #1
[Email] Sending confirmation to alice@example.com
[Email] Sending receipt to alice@example.com
[Analytics] Recording sale: $25.99
```

Notice how different services react to the same events. They don't know about each other - they just listen and respond. This is called loose coupling and it's a major benefit of event-driven architecture.

### Error Handling with Events

Always handle the 'error' event. If an EventEmitter emits 'error' and no one is listening, Node.js will crash:

```js
const EventEmitter = require('events');
const emitter = new EventEmitter();

// Always add an error handler!
emitter.on('error', (err) => {
  console.error('Something went wrong:', err.message);
});

// Now this won't crash your app
emitter.emit('error', new Error('Database connection lost'));
```

### Async Events with Promises

EventEmitter callbacks are synchronous by default. For async operations, you can combine events with Promises:

```js
const EventEmitter = require('events');

class AsyncProcessor extends EventEmitter {
  async process(data) {
    this.emit('start', data);

    try {
      // Simulate async work
      await new Promise(resolve => setTimeout(resolve, 1000));

      const result = data.toUpperCase();
      this.emit('complete', result);
      return result;
    } catch (err) {
      this.emit('error', err);
      throw err;
    }
  }
}

const processor = new AsyncProcessor();

processor.on('start', (data) => console.log(`Processing: ${data}`));
processor.on('complete', (result) => console.log(`Done: ${result}`));
processor.on('error', (err) => console.error(`Failed: ${err.message}`));

processor.process('hello world');
```

### Common Pitfalls

**Memory leaks from too many listeners:**

```js
// Bad: Adding listeners in a loop
for (let i = 0; i < 100; i++) {
  emitter.on('event', () => {}); // Memory leak!
}

// Node.js warns after 10 listeners by default
// Increase if needed (but usually you don't need to)
emitter.setMaxListeners(20);
```

**Forgetting to remove listeners:**

```js
// If you add listeners dynamically, clean them up
function setupHandler(emitter) {
  const handler = () => console.log('Event fired');
  emitter.on('event', handler);

  // Return cleanup function
  return () => emitter.removeListener('event', handler);
}

const cleanup = setupHandler(myEmitter);
// Later...
cleanup(); // Remove the listener
```

**Emitting before listeners are attached:**

```js
// Bad: Event fires before listener exists
const emitter = new EventEmitter();
emitter.emit('ready'); // No one is listening!
emitter.on('ready', () => console.log('Ready')); // Never runs

// Good: Attach listeners first
const emitter2 = new EventEmitter();
emitter2.on('ready', () => console.log('Ready'));
emitter2.emit('ready'); // Works!
```

### When to Use Event Driven Architecture

**Good use cases:**

- Decoupling parts of your application
- Handling I/O operations (files, network, database)
- Building real-time features (chat, notifications)
- Creating plugin systems
- Logging and monitoring

**Not ideal for:**

- Simple synchronous operations
- When you need guaranteed execution order
- When one failure should stop everything

### Takeaways

- Events let Node.js handle many operations without blocking
- `EventEmitter` is the foundation: emit events, listen with callbacks
- Many Node.js modules (http, fs, streams) use events internally
- Events enable loose coupling between different parts of your app
- Always handle the 'error' event to prevent crashes
- Clean up listeners to avoid memory leaks

### FAQ

**Q: What's the difference between events and callbacks?**
A: A callback is a function you pass to be called later. An event is a signal that something happened, and multiple listeners can respond to it. Events use callbacks, but add the ability to have many subscribers.

**Q: Are events synchronous or asynchronous?**
A: The `emit()` method is synchronous - all listeners run immediately in order. But listeners can start async operations. The event loop handles truly async behavior.

**Q: Can I use async/await with EventEmitter?**
A: EventEmitter itself is callback-based, but you can use `events.once()` which returns a Promise:

```js
const { once } = require('events');

async function waitForEvent(emitter) {
  const [data] = await once(emitter, 'data');
  console.log('Received:', data);
}
```

**Q: How many listeners is too many?**
A: Node.js warns at 10 listeners for a single event (possible memory leak). If you legitimately need more, use `setMaxListeners()`. But first ask: do you really need that many?

Further reading: [Node.js Events documentation](https://nodejs.org/api/events.html)
