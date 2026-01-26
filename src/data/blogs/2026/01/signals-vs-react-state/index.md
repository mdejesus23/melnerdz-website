---
title: Signals vs React State - The Battle for Reactive Supremacy
pubDate: 2026-01-26
author: Melnard
slug: signals-vs-react-state
image:
  src: ./main.png
  alt: Illustration comparing Signals and React state management approaches
description: A deep dive into Signals and React state - how they differ, which frameworks use them, and when to choose one over the other for optimal performance.
technology:
  - javascript
  - react
  - solid.js
  - preact
  - angular
  - vue
tags:
  - frontend
  - state-management
  - performance
  - tutorial
  - react
faqs:
  - question: Can I use Signals in React?
    answer: Not officially. There are experimental libraries like @preact/signals-react, but they work against React's design philosophy. If you want Signals, consider Preact or Solid.js instead.
  - question: Are Signals always faster than React?
    answer: For fine-grained updates, yes. But React's concurrent features (Suspense, Transitions) offer different performance benefits like better perceived performance during data fetching.
  - question: Will React adopt Signals?
    answer: The React team has expressed that Signals don't align with their vision. React is exploring other optimizations like the React Compiler (formerly React Forget) that automatically memoizes components.
  - question: Should I migrate my React app to Signals?
    answer: Probably not for existing apps. The ecosystem, tooling, and team familiarity often outweigh raw performance gains. Consider Signals for new projects where they make sense.
  - question: How do Signals handle async data?
    answer: Most Signal implementations have companion primitives for async data (like Solid's createResource or Angular's toSignal(observable)). They integrate well with Promises and observables.
---

If you've been following the frontend ecosystem lately, you've probably noticed a lot of buzz around **Signals**. From Solid.js to Preact, Angular, and even proposals for vanilla JavaScript - Signals are everywhere. But what exactly are they, and how do they compare to React's tried-and-true `useState` and `useReducer`?

Think of React state like sending a company-wide email every time something changes - everyone gets notified, even if it doesn't concern them. Signals, on the other hand, are like a direct message to only the people who need to know. This fundamental difference has huge implications for performance and developer experience.

### What is React State?

React's state management is built around a **pull-based** reactivity model combined with a Virtual DOM. When state changes, React:

1. Marks the component as "dirty"
2. Re-renders the entire component function
3. Diffs the new Virtual DOM against the old one
4. Applies only the necessary DOM updates

```jsx
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);

  console.log('Component re-rendered!'); // Logs on EVERY state change

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

Every time you click the button, the entire `Counter` function re-executes. React then figures out what actually changed in the DOM. This works well, but it means your component logic runs more often than strictly necessary.

### What are Signals?

Signals represent a **push-based** fine-grained reactivity system. A Signal is essentially a reactive primitive - a container for a value that notifies its subscribers when that value changes.

```jsx
// Solid.js example
import { createSignal } from 'solid-js';

function Counter() {
  const [count, setCount] = createSignal(0);

  console.log('Component setup - runs ONCE!'); // Only logs once

  return (
    <div>
      <p>Count: {count()}</p> {/* Only this text node updates */}
      <button onClick={() => setCount(count() + 1)}>Increment</button>
    </div>
  );
}
```

Notice the key difference: the component function runs **once** during setup. When the signal changes, only the specific DOM node that depends on `count()` updates - no re-render, no diffing.

### How Signals Work Under the Hood

Signals maintain a dependency graph at runtime. When you read a signal inside a reactive context (like a computed value or a DOM binding), that context automatically subscribes to the signal.

```jsx
// Conceptual implementation
class Signal {
  constructor(initialValue) {
    this.value = initialValue;
    this.subscribers = new Set();
  }

  get() {
    // Track current reactive context
    if (currentContext) {
      this.subscribers.add(currentContext);
    }
    return this.value;
  }

  set(newValue) {
    this.value = newValue;
    // Notify only subscribed contexts
    this.subscribers.forEach((subscriber) => subscriber.update());
  }
}
```

This automatic dependency tracking is what makes Signals so efficient - updates propagate directly to where they're needed.

### Framework Adoption

Here's where different frameworks stand on the Signals vs traditional state debate:

| Framework    | State Model                   | Notes                                             |
| ------------ | ----------------------------- | ------------------------------------------------- |
| **React**    | Virtual DOM + useState        | Traditional pull-based model                      |
| **Solid.js** | Signals (native)              | Built from ground up with Signals                 |
| **Preact**   | Signals (via @preact/signals) | Added in 2022, optional                           |
| **Angular**  | Signals (v16+)                | Major shift from Zone.js                          |
| **Vue**      | Refs (Signal-like)            | `ref()` and `reactive()` are conceptually similar |
| **Svelte**   | Runes (v5)                    | Compiler-based fine-grained reactivity            |
| **Qwik**     | Signals (native)              | Designed for resumability                         |

### Signals in Practice: Preact Example

Preact's signals implementation shows how Signals can be added to an existing ecosystem:

```jsx
import { signal, computed } from '@preact/signals';

// Signals can live outside components!
const count = signal(0);
const doubled = computed(() => count.value * 2);

function Counter() {
  // No hooks, no re-renders
  return (
    <div>
      <p>Count: {count}</p>
      <p>Doubled: {doubled}</p>
      <button onClick={() => count.value++}>Increment</button>
    </div>
  );
}

// Update from anywhere - even outside React tree
setTimeout(() => {
  count.value = 100;
}, 5000);
```

### Angular's Signal Revolution

Angular 16+ embraced Signals as a core primitive, moving away from Zone.js for change detection:

```typescript
import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'app-counter',
  template: `
    <p>Count: {{ count() }}</p>
    <p>Doubled: {{ doubled() }}</p>
    <button (click)="increment()">Increment</button>
  `,
})
export class CounterComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);

  constructor() {
    // Side effects with automatic cleanup
    effect(() => {
      console.log(`Count changed to: ${this.count()}`);
    });
  }

  increment() {
    this.count.update((c) => c + 1);
  }
}
```

### Pros and Cons Comparison

#### React State

**Pros:**

- Battle-tested at scale (Meta, Netflix, Airbnb)
- Massive ecosystem and community
- Predictable top-down data flow
- Excellent developer tools (React DevTools)
- Time-travel debugging with Redux
- Concurrent features (Suspense, Transitions)

**Cons:**

- Re-renders entire component subtrees
- Requires memoization (`useMemo`, `useCallback`, `React.memo`)
- Closure stale state issues
- Rules of Hooks add cognitive overhead
- Can lead to "prop drilling" or complex state management

#### Signals

**Pros:**

- Fine-grained updates (surgical DOM changes)
- No Virtual DOM overhead
- State can live outside components
- No stale closure issues
- Simpler mental model (no memoization needed)
- Automatic dependency tracking
- Typically smaller bundle sizes

**Cons:**

- Smaller ecosystem (for non-React frameworks)
- Different debugging paradigm
- Can create implicit dependencies (harder to trace)
- Some frameworks still maturing
- React integration is unofficial/experimental

### Performance Comparison

Let's look at a scenario where Signals shine - a large list with a single updating item:

```jsx
// React - entire list component re-renders
function ItemList({ items }) {
  const [selectedId, setSelectedId] = useState(null);

  return (
    <ul>
      {items.map((item) => (
        <Item
          key={item.id}
          item={item}
          isSelected={item.id === selectedId}
          onSelect={setSelectedId}
        />
      ))}
    </ul>
  );
}

// Need React.memo to prevent unnecessary re-renders
const Item = React.memo(({ item, isSelected, onSelect }) => {
  return (
    <li
      className={isSelected ? 'selected' : ''}
      onClick={() => onSelect(item.id)}
    >
      {item.name}
    </li>
  );
});
```

```jsx
// Solid.js with Signals - only selected items update
function ItemList(props) {
  const [selectedId, setSelectedId] = createSignal(null);

  return (
    <ul>
      <For each={props.items}>
        {(item) => (
          <li
            classList={{ selected: selectedId() === item.id }}
            onClick={() => setSelectedId(item.id)}
          >
            {item.name}
          </li>
        )}
      </For>
    </ul>
  );
}
// No memo needed - only the classList binding updates
```

### When to Use What

**Choose React State when:**

- You need the massive React ecosystem
- Your team is already proficient in React
- You're building apps where re-render overhead is acceptable
- You need React-specific features (Server Components, Suspense)
- You're integrating with React-only libraries

**Choose Signals when:**

- Performance is critical (real-time apps, animations)
- You're starting a new project and open to alternatives
- You want simpler state management without memoization
- Your app has many independent updating pieces
- Bundle size is a concern

### The Future: TC39 Signals Proposal

There's an active [TC39 proposal](https://github.com/tc39/proposal-signals) to add Signals to JavaScript itself. If accepted, this could mean:

- Native browser-level optimizations
- Framework interoperability
- A standardized reactivity primitive

```javascript
// Potential future JavaScript syntax
const counter = new Signal.State(0);
const doubled = new Signal.Computed(() => counter.get() * 2);

// Automatic batching
Signal.subtle.batch(() => {
  counter.set(1);
  counter.set(2);
  counter.set(3);
}); // Only triggers one update
```

### Common Pitfalls

**With React State:**

- Forgetting to memoize expensive computations
- Creating new objects/arrays in render (breaks `React.memo`)
- Stale closures in useEffect dependencies
- Over-using global state (Redux for everything)

**With Signals:**

- Accessing signal values outside reactive contexts
- Creating signals in loops (memory leaks)
- Forgetting to call signal as function (`count()` not `count`)
- Over-using effects when computed values suffice

### Wrapping Up

Both React state and Signals are valid approaches to reactivity, each with their trade-offs. React's model has proven itself at scale for nearly a decade, while Signals offer a compelling performance advantage with a simpler mental model.

The frontend world isn't abandoning React state anytime soon, but Signals are clearly influencing the ecosystem. Whether you stick with React, explore Solid.js, or wait for native JavaScript Signals, understanding both paradigms makes you a more versatile developer.

**Key takeaways:**

- React state triggers component re-renders; Signals update DOM directly
- Signals eliminate the need for memoization
- Major frameworks (Angular, Vue, Preact) are adopting Signal-like patterns
- Choose based on your project's performance needs and team expertise
- Keep an eye on the TC39 Signals proposal

