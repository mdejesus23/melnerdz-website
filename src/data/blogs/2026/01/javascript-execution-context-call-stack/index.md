---
title: JavaScript Execution Context and Call Stack Explained
pubDate: 2026-01-20
author: Melnard
slug: javascript-execution-context-call-stack
image:
  src: ./main.png
  alt: JavaScript execution context and call stack visualization
description: A beginner-friendly guide to understanding how JavaScript executes code through execution contexts and the call stack, with clear visualizations and practical examples.
technology:
  - javascript
tags:
  - javascript
  - frontend
  - tutorial
  - beginner
faqs:
  - question: What is an execution context in JavaScript?
    answer: An execution context is the environment where JavaScript code is evaluated and executed. It contains the variables, functions, and the value of 'this' available to the code at any given time.
  - question: What's the difference between global and function execution context?
    answer: The global execution context is created when your script starts and remains until the program ends. Function execution contexts are created each time a function is called and are destroyed when the function returns.
  - question: What causes a stack overflow error?
    answer: A stack overflow occurs when the call stack exceeds its maximum size, usually from infinite recursion where a function keeps calling itself without a base case to stop.
  - question: Is JavaScript single-threaded?
    answer: Yes, JavaScript has a single call stack, meaning it can only execute one piece of code at a time. Asynchronous operations use the event loop to handle non-blocking behavior.
  - question: What happens during the creation phase?
    answer: During creation phase, JavaScript sets up memory for variables (hoisting them as undefined for var, or leaving let/const uninitialized), stores function declarations, and determines the value of 'this'.
  - question: Why does hoisting happen?
    answer: Hoisting is a result of the creation phase. Before code executes, JavaScript scans for declarations and allocates memory for them. This is why you can call function declarations before they appear in code.
---

Imagine a chef in a busy restaurant kitchen. They have a main prep station (global context) where they keep essential ingredients. When an order comes in, they set up a dedicated workspace for that dish (function context), complete with all the specific ingredients needed. They handle one dish at a time, stacking order tickets on a spike—the most recent order on top. That spike is like JavaScript's call stack.

Understanding execution context and the call stack is fundamental to grasping how JavaScript actually runs your code. Let's dive in.

### What is an execution context?

An execution context is the environment in which JavaScript code is executed. Think of it as a container that holds:

- **Variables and functions** declared in that scope
- **The value of `this`**
- **A reference to the outer environment** (scope chain)

Every time JavaScript runs code, it does so inside an execution context.

```js
let message = "Hello"; // Executed in global context

function greet() {
  let name = "Alice"; // Executed in greet's context
  console.log(message + ", " + name);
}

greet(); // Creates a new execution context
```

### The three types of execution context

JavaScript has three types of execution contexts:

1. **Global Execution Context (GEC)**: Created when your script first runs
2. **Function Execution Context (FEC)**: Created each time a function is called
3. **Eval Execution Context**: Created when `eval()` is used (avoid using this)

We'll focus on the first two since they're what you'll encounter in everyday coding.

### Global execution context

The global execution context is created automatically when your JavaScript file starts running. It's the base level—the "default" context that exists throughout your program's lifetime.

**What the global context provides:**

```js
// In browsers:
console.log(this === window); // true (in non-strict mode)

// Global variables become properties of the global object
var globalVar = "I'm global";
console.log(window.globalVar); // "I'm global"

// let and const don't attach to window
let notOnWindow = "I'm not on window";
console.log(window.notOnWindow); // undefined
```

**Only one global context exists:**

```js
// All this code runs in the same global execution context
let counter = 0;

function increment() {
  counter++; // Accesses global counter
}

function decrement() {
  counter--; // Same global counter
}

increment();
increment();
console.log(counter); // 2
```

### Function execution context

A new function execution context is created every time a function is called. Each call gets its own fresh context, even for the same function.

```js
function greet(name) {
  // New execution context created for each call
  let greeting = "Hello, " + name;
  console.log(greeting);
}

greet("Alice"); // Creates context #1, then destroys it
greet("Bob");   // Creates context #2, then destroys it
greet("Carol"); // Creates context #3, then destroys it
```

**Each context is independent:**

```js
function createCounter() {
  let count = 0; // Each call gets its own 'count'
  return function() {
    count++;
    return count;
  };
}

const counter1 = createCounter(); // Context with count = 0
const counter2 = createCounter(); // Different context, separate count = 0

console.log(counter1()); // 1
console.log(counter1()); // 2
console.log(counter2()); // 1 (independent!)
```

### The two phases of execution context

Every execution context goes through two phases:

#### Phase 1: Creation phase

Before any code runs, JavaScript:

1. Creates the `this` binding
2. Sets up memory for variables and functions (hoisting)
3. Creates the scope chain reference

```js
console.log(myVar);    // undefined (hoisted)
console.log(myFunc()); // "I work!" (function hoisted completely)
// console.log(myLet); // ReferenceError (TDZ)

var myVar = "Hello";
let myLet = "World";

function myFunc() {
  return "I work!";
}
```

**What happens in creation phase:**

```js
// Your code:
var x = 10;
let y = 20;
function add(a, b) { return a + b; }

// Creation phase sets up:
// x = undefined (var is hoisted and initialized)
// y = <uninitialized> (let is hoisted but in TDZ)
// add = function(a, b) { return a + b; } (fully hoisted)
```

#### Phase 2: Execution phase

JavaScript runs through the code line by line, assigning values and executing statements.

```js
// After creation phase, execution begins:
var x = 10;   // Now x is assigned 10
let y = 20;   // Now y is assigned 20 (exits TDZ)
let sum = add(x, y); // Calls add, creates new context
console.log(sum); // 30
```

### Visualizing the two phases

Let's trace through this code:

```js
var name = "Global";

function outer() {
  var name = "Outer";

  function inner() {
    var name = "Inner";
    console.log(name);
  }

  inner();
}

outer();
```

**Global Context Creation:**
```
┌─────────────────────────────┐
│   Global Execution Context  │
│   (Creation Phase)          │
├─────────────────────────────┤
│ this: window                │
│ name: undefined             │
│ outer: function() {...}     │
└─────────────────────────────┘
```

**Global Context Execution:**
```
┌─────────────────────────────┐
│   Global Execution Context  │
│   (Execution Phase)         │
├─────────────────────────────┤
│ this: window                │
│ name: "Global"              │
│ outer: function() {...}     │
│                             │
│ → Line: outer() is called   │
└─────────────────────────────┘
```

### What is the call stack?

The call stack is a data structure that keeps track of where we are in the program. It follows the LIFO principle: Last In, First Out.

Think of it like a stack of plates:
- When you call a function, you put a plate on top
- When the function returns, you remove the top plate
- You can only access the top plate

```js
function first() {
  console.log("First start");
  second();
  console.log("First end");
}

function second() {
  console.log("Second start");
  third();
  console.log("Second end");
}

function third() {
  console.log("Third");
}

first();
```

**Output:**
```
First start
Second start
Third
Second end
First end
```

### Visualizing the call stack

Let's trace the call stack for the code above:

```
Step 1: Script starts
┌─────────────┐
│   global    │  ← first() is called
└─────────────┘

Step 2: first() is called
┌─────────────┐
│   first()   │  ← second() is called
├─────────────┤
│   global    │
└─────────────┘

Step 3: second() is called
┌─────────────┐
│  second()   │  ← third() is called
├─────────────┤
│   first()   │
├─────────────┤
│   global    │
└─────────────┘

Step 4: third() is called
┌─────────────┐
│   third()   │  ← console.log("Third")
├─────────────┤
│  second()   │
├─────────────┤
│   first()   │
├─────────────┤
│   global    │
└─────────────┘

Step 5: third() returns
┌─────────────┐
│  second()   │  ← continues execution
├─────────────┤
│   first()   │
├─────────────┤
│   global    │
└─────────────┘

Step 6: second() returns
┌─────────────┐
│   first()   │  ← continues execution
├─────────────┤
│   global    │
└─────────────┘

Step 7: first() returns
┌─────────────┐
│   global    │  ← program ends
└─────────────┘
```

### Call stack with return values

When functions return values, the call stack handles them:

```js
function multiply(a, b) {
  return a * b;
}

function square(n) {
  return multiply(n, n);
}

function sumOfSquares(x, y) {
  const sq1 = square(x);
  const sq2 = square(y);
  return sq1 + sq2;
}

const result = sumOfSquares(3, 4);
console.log(result); // 25
```

**Trace:**
```
1. sumOfSquares(3, 4) pushed
2.   square(3) pushed
3.     multiply(3, 3) pushed → returns 9
4.   square(3) returns 9
5.   square(4) pushed
6.     multiply(4, 4) pushed → returns 16
7.   square(4) returns 16
8. sumOfSquares returns 25
```

### Stack overflow: when things go wrong

The call stack has a limited size. If you keep pushing without popping, you get a stack overflow:

```js
// Infinite recursion - DON'T DO THIS
function forever() {
  forever(); // Calls itself without stopping
}

forever(); // RangeError: Maximum call stack size exceeded
```

**Proper recursion with a base case:**

```js
function countdown(n) {
  if (n <= 0) {       // Base case: stops recursion
    console.log("Done!");
    return;
  }
  console.log(n);
  countdown(n - 1);   // Recursive case
}

countdown(5); // 5, 4, 3, 2, 1, Done!
```

### Seeing the call stack in DevTools

You can visualize the call stack in your browser's developer tools:

```js
function a() {
  b();
}

function b() {
  c();
}

function c() {
  debugger; // Execution pauses here
  console.log("Check the call stack!");
}

a();
```

When you run this and open DevTools, you'll see:

```
Call Stack:
  c         (index.js:12)
  b         (index.js:6)
  a         (index.js:2)
  (anonymous) (index.js:16)
```

### Error stack traces

When an error occurs, JavaScript shows you the call stack:

```js
function validateUser(user) {
  if (!user.name) {
    throw new Error("Name is required");
  }
}

function createUser(data) {
  validateUser(data);
  return { ...data, id: Date.now() };
}

function handleSignup(formData) {
  const user = createUser(formData);
  return user;
}

handleSignup({}); // Error thrown!
```

**Error output:**
```
Error: Name is required
    at validateUser (script.js:3)
    at createUser (script.js:8)
    at handleSignup (script.js:13)
    at script.js:17
```

This trace helps you understand exactly how your code reached the error.

### The execution context and `this`

Each execution context has its own `this` binding:

```js
// Global context: this = window (browser)
console.log(this === window); // true

const obj = {
  name: "Alice",
  greet: function() {
    // Function context: this = obj (the caller)
    console.log(this.name);
  },
  greetArrow: () => {
    // Arrow function: this = enclosing context (global)
    console.log(this.name); // undefined
  }
};

obj.greet();      // "Alice"
obj.greetArrow(); // undefined
```

### Practical example: understanding async behavior

The call stack is synchronous—it can only do one thing at a time. Async operations work differently:

```js
console.log("Start");

setTimeout(() => {
  console.log("Timeout");
}, 0);

console.log("End");

// Output:
// Start
// End
// Timeout (even with 0ms delay!)
```

**Why?** The setTimeout callback doesn't go on the call stack immediately. It goes to a queue and waits until the stack is empty. This is part of the event loop.

```
1. Stack: [global]
   → console.log("Start")

2. Stack: [global]
   → setTimeout() registered (callback goes to queue)

3. Stack: [global]
   → console.log("End")

4. Stack: [] (empty!)
   → Event loop moves callback to stack

5. Stack: [callback]
   → console.log("Timeout")
```

### Putting it all together

```js
let globalVar = "I'm global";

function outer() {
  let outerVar = "I'm outer";

  function inner() {
    let innerVar = "I'm inner";
    console.log(globalVar); // Accesses global context
    console.log(outerVar);  // Accesses outer's context
    console.log(innerVar);  // Accesses own context
  }

  inner();
}

outer();
```

**Execution flow:**

1. **Global context created** → `globalVar` and `outer` set up
2. **Global context executes** → `globalVar = "I'm global"`, `outer()` called
3. **Outer context created** → pushed to stack, `outerVar` and `inner` set up
4. **Outer context executes** → `outerVar = "I'm outer"`, `inner()` called
5. **Inner context created** → pushed to stack, `innerVar` set up
6. **Inner context executes** → logs all three variables
7. **Inner returns** → popped from stack
8. **Outer returns** → popped from stack
9. **Only global context remains**

### Common pitfalls

#### 1. Assuming code runs in order with async

```js
function fetchData() {
  let data;

  setTimeout(() => {
    data = "fetched!";
  }, 100);

  return data; // Returns undefined immediately!
}

console.log(fetchData()); // undefined
```

#### 2. Loop variable issues with var

```js
for (var i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 3, 3, 3 (not 0, 1, 2)
  }, 100);
}
// Each callback references the same 'i' in the same context
```

**Fix with let (block-scoped):**

```js
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    console.log(i); // 0, 1, 2
  }, 100);
}
// Each iteration has its own 'i' in a new block context
```

#### 3. Deep recursion without tail optimization

```js
// This can overflow for large n
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // Keeps building stack
}

factorial(100000); // Stack overflow!
```

**Fix with iteration:**

```js
function factorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}
```

### Key takeaways

- **Execution context** is the environment where code runs, containing variables, functions, and `this`
- **Global context** is created once when your script starts and persists throughout
- **Function context** is created fresh each time a function is called
- **Creation phase** sets up memory (hoisting) before code runs
- **Execution phase** runs code line by line
- **Call stack** tracks which function is currently executing (LIFO order)
- **Stack overflow** happens when recursion has no base case
- JavaScript is **single-threaded**—one call stack, one thing at a time

Understanding these concepts helps you debug errors, predict code behavior, and write more reliable JavaScript.
