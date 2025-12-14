---
title: Understanding the Node.js Event Loop
pubDate: 2025-12-14
author: Melnard
slug: nodejs-event-loop
image:
  src: ./node.png
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

The Node.js event loop is the heartbeat of the runtime. It lets single-threaded JavaScript feel “multitasked” by rapidly taking turns running tiny pieces of work.

Think of a helpful librarian (the event loop) serving many readers (your callbacks). The librarian doesn’t read every book themselves. Instead, they:

- Note requests (I/O like files, network, timers)
- Hand them to specialists (libuv and the OS)
- Call you back when results are ready

As long as you don’t make the librarian read an entire book aloud (long synchronous code), everyone gets served quickly.

### What the event loop does

- Orchestrates phases where different kinds of callbacks run
- Keeps the process alive while there’s work to do
- Prioritizes microtasks (Promises, queueMicrotask) ahead of macrotasks

“Microtasks” are very small, high-priority jobs (mostly Promise callbacks). They run right after the current bit of JavaScript finishes, before the loop moves to the next big step. “Macrotasks” are the bigger scheduled items like timers or `setImmediate`.

### The phases at a glance

1. Timers: `setTimeout`, `setInterval`
2. Pending callbacks: system operations
3. Idle/prepare: internal
4. Poll: new I/O events; executes I/O callbacks
5. Check: `setImmediate`
6. Close callbacks: `socket.on('close')`

Microtasks (Promises) run after each phase before moving on.

### Visual timeline (simplified)

Poll → run I/O callbacks

↳ run all microtasks (Promise `.then`)

Check → run `setImmediate`

↳ run all microtasks

Timers → run due `setTimeout`/`setInterval`

↳ run all microtasks

Repeat while there’s pending work.

### Common pitfalls

- Long synchronous work blocks the loop; use workers or chunk work
- Mixing `setTimeout(0)` and Promises often surprises ordering
- Heavy CPU-bound tasks should not run on the main thread

Tip: If you must do heavy computation, break it into small slices using `setImmediate` or `setTimeout(0)` between slices, or use `worker_threads`.

### Quick demo

Try to predict the order:

```js
setTimeout(() => console.log('timeout'), 0);
setImmediate(() => console.log('immediate'));
Promise.resolve().then(() => console.log('promise'));

// Likely: promise, then timeout/immediate (order can vary across env)
```

Why does this happen?

- Promises schedule microtasks; they run before moving to the next phase.
- `setTimeout(0)` runs in the Timers phase when its time is due.
- `setImmediate` runs in the Check phase. Depending on when you schedule them and the environment, `timeout` vs `immediate` ordering can swap.

Try another example to see microtasks vs macrotasks:

```js
console.log('A');
setTimeout(() => console.log('B (timeout)'), 0);
Promise.resolve().then(() => console.log('C (promise)'));
console.log('D');
// Output: A, D, C (promise), B (timeout)
```

Explanation: The synchronous logs run first (A, D). Then the microtask from the Promise runs (C). Finally the timer callback runs (B).

### Takeaways

- Prefer async I/O and avoid long synchronous blocks
- Use `setImmediate` for post-poll work, Promises for microtasks
- For CPU-bound tasks, use `worker_threads` or offload to services

### When to use what

- Use Promises/`async` functions for chaining small async steps (microtasks are fast).
- Use `setImmediate` to run something right after I/O callbacks (post-poll).
- Use Timers for scheduling work a bit later or repeatedly.
- Use `process.nextTick` sparingly; it runs even before other microtasks and can starve the loop if abused.

### Detecting a blocked loop

If your server feels “stuck,” check for long synchronous loops or JSON/string operations on large objects. Profilers (`node --prof`, Chrome DevTools) can reveal hotspots.

Further reading: Node.js docs on event loop, libuv guide.

—

FAQ

Q: Is Node.js truly single-threaded?
A: Your JavaScript runs on a single main thread, but Node uses other threads under the hood (libuv thread pool, OS) for I/O. You can also use `worker_threads` for CPU-bound tasks.

Q: Why do Promises run “sooner” than `setTimeout(0)`?
A: Promise callbacks are microtasks and run at the end of the current turn before the loop continues to the next phase where timers live.

Q: Can I guarantee `setImmediate` always before/after `setTimeout(0)`?
A: No. The relative order can vary based on context (polling state, platform). Prefer Promises for deterministic microtask ordering.
