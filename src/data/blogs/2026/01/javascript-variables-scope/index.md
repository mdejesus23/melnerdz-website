---
title: JavaScript Variables and Scope - let, const, var Explained
pubDate: 2026-01-18
author: Melnard
slug: javascript-variables-scope
image:
  src: ./main.png
  alt: JavaScript variables and scope illustration showing let, const, and var
description: A comprehensive guide to JavaScript variable declarations with let, const, and var. Learn block scope vs function scope, hoisting behavior, and best practices for writing clean code.
technology:
  - javascript
tags:
  - javascript
  - frontend
  - tutorial
  - beginner
faqs:
  - question: What's the difference between let, const, and var?
    answer: var is function-scoped and hoisted with undefined. let is block-scoped and hoisted but not initialized (temporal dead zone). const is like let but cannot be reassigned after initialization.
  - question: Should I use let or const?
    answer: Use const by default for values that won't be reassigned. Use let when you need to reassign a variable. Avoid var in modern JavaScript.
  - question: What is hoisting?
    answer: Hoisting is JavaScript's behavior of moving variable and function declarations to the top of their scope during compilation. Variables declared with var are initialized to undefined, while let and const remain uninitialized.
  - question: What is the temporal dead zone?
    answer: The temporal dead zone (TDZ) is the period between entering a scope and the variable declaration being processed. Accessing let or const variables in the TDZ throws a ReferenceError.
  - question: Can I change a const object's properties?
    answer: Yes! const only prevents reassignment of the variable itself. Object properties and array elements can still be modified. Use Object.freeze() for true immutability.
  - question: Why does var behave differently in loops?
    answer: var is function-scoped, so there's only one variable shared across all loop iterations. let creates a new binding for each iteration, which is why it works correctly with closures.
---

Imagine you're organizing a kitchen. You have different storage containers—some are labeled and permanent (like a sugar jar), some can be refilled (like a water pitcher), and some older ones might leak into other areas. JavaScript variables work similarly: `const` is your labeled jar, `let` is your refillable pitcher, and `var` is that old leaky container you should probably replace.

Understanding variables and scope is fundamental to writing predictable, bug-free JavaScript. Let's explore how JavaScript handles variable declarations and why modern JavaScript prefers `let` and `const` over `var`.

### The three ways to declare variables

JavaScript gives us three keywords for declaring variables:

```js
var oldWay = "I'm the original";
let modernWay = "I'm the flexible one";
const immutableWay = "I can't be reassigned";
```

Each behaves differently in terms of scope, hoisting, and reassignment. Let's break them down.

### var: The legacy declaration

`var` was the only way to declare variables before ES6 (2015). It has two unique characteristics:

1. **Function scope**: Variables are scoped to the nearest function, not block
2. **Hoisting with initialization**: Declarations are moved to the top and initialized as `undefined`

```js
function varExample() {
  console.log(x); // undefined (hoisted but not assigned)
  var x = 10;
  console.log(x); // 10

  if (true) {
    var y = 20; // Not block-scoped!
  }
  console.log(y); // 20 (accessible outside the if block)
}

varExample();
```

The lack of block scope leads to unexpected behavior:

```js
for (var i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 3, 3, 3 (not 0, 1, 2!)
  }, 100);
}
// There's only one 'i' shared across all iterations
```

### let: The modern variable

`let` was introduced in ES6 and fixes the issues with `var`:

1. **Block scope**: Variables are scoped to the nearest block (`{}`)
2. **Hoisting without initialization**: Declarations are hoisted but not accessible until declared

```js
function letExample() {
  // console.log(x); // ReferenceError: Cannot access 'x' before initialization
  let x = 10;
  console.log(x); // 10

  if (true) {
    let y = 20; // Block-scoped
  }
  // console.log(y); // ReferenceError: y is not defined
}

letExample();
```

The loop problem is solved with `let`:

```js
for (let i = 0; i < 3; i++) {
  setTimeout(function() {
    console.log(i); // 0, 1, 2 (each iteration has its own 'i')
  }, 100);
}
```

### const: The immutable binding

`const` works like `let` but with one additional rule: **you cannot reassign the variable**.

```js
const PI = 3.14159;
// PI = 3.14; // TypeError: Assignment to constant variable

const user = { name: "Alice" };
user.name = "Bob"; // This works! Object properties can change
// user = {}; // TypeError: Assignment to constant variable

const numbers = [1, 2, 3];
numbers.push(4); // This works! Array contents can change
// numbers = []; // TypeError: Assignment to constant variable
```

**Important**: `const` doesn't make values immutable—it makes the *binding* immutable. The variable can't point to something else, but the thing it points to can still change.

For true immutability, use `Object.freeze()`:

```js
const frozen = Object.freeze({ name: "Alice" });
frozen.name = "Bob"; // Silently fails (or throws in strict mode)
console.log(frozen.name); // "Alice"
```

### Block scope vs function scope

This is one of the most important concepts in JavaScript scope.

**Block scope** (let, const): Variables exist only within the `{}` where they're declared.

```js
{
  let blockScoped = "I exist only here";
  const alsoBlockScoped = "Me too";
}
// console.log(blockScoped); // ReferenceError

if (true) {
  let x = 1;
}
// console.log(x); // ReferenceError

for (let i = 0; i < 3; i++) {
  // i exists here
}
// console.log(i); // ReferenceError
```

**Function scope** (var): Variables exist throughout the entire function.

```js
function functionScoped() {
  if (true) {
    var x = 1; // Scoped to functionScoped, not the if block
  }
  console.log(x); // 1

  for (var i = 0; i < 3; i++) {
    // i is function-scoped
  }
  console.log(i); // 3
}

functionScoped();
```

Visual comparison:

```js
function scopeDemo() {
  // Function scope boundary for var

  if (true) {
    // Block scope boundary for let/const
    var a = 1;   // Accessible anywhere in function
    let b = 2;   // Only accessible in this if block
    const c = 3; // Only accessible in this if block
  }

  console.log(a); // 1
  // console.log(b); // ReferenceError
  // console.log(c); // ReferenceError
}
```

### Understanding hoisting

Hoisting is JavaScript's behavior of processing declarations before code execution. Think of it as JavaScript "moving" declarations to the top of their scope.

**var hoisting**: Declarations are hoisted and initialized to `undefined`.

```js
console.log(hoisted); // undefined
var hoisted = "I'm here";
console.log(hoisted); // "I'm here"

// JavaScript interprets this as:
// var hoisted = undefined;
// console.log(hoisted); // undefined
// hoisted = "I'm here";
// console.log(hoisted); // "I'm here"
```

**let and const hoisting**: Declarations are hoisted but NOT initialized.

```js
// This area is the Temporal Dead Zone for 'x'
// console.log(x); // ReferenceError: Cannot access 'x' before initialization
let x = 10;
console.log(x); // 10
```

**Function hoisting**: Function declarations are fully hoisted.

```js
sayHello(); // "Hello!" (works!)

function sayHello() {
  console.log("Hello!");
}

// But function expressions are NOT hoisted the same way
// sayGoodbye(); // TypeError: sayGoodbye is not a function
var sayGoodbye = function() {
  console.log("Goodbye!");
};
```

### The temporal dead zone (TDZ)

The TDZ is the region of code where a `let` or `const` variable exists but cannot be accessed.

```js
function tdz() {
  // TDZ for 'x' starts here
  console.log(typeof undeclared); // "undefined" (no error for typeof)
  // console.log(typeof x); // ReferenceError (TDZ!)
  // console.log(x); // ReferenceError (TDZ!)

  let x = 10; // TDZ for 'x' ends here
  console.log(x); // 10
}
```

The TDZ exists to catch errors early:

```js
let x = 10;

function broken() {
  console.log(x); // ReferenceError, not 10!
  let x = 20; // This shadows the outer x, creating a TDZ
}
```

### Variable shadowing

Inner scopes can declare variables with the same name as outer scopes:

```js
let x = "outer";

function shadowExample() {
  let x = "inner"; // Shadows the outer x
  console.log(x); // "inner"
}

shadowExample();
console.log(x); // "outer" (unchanged)
```

This works with all declaration types:

```js
var a = 1;
let b = 2;
const c = 3;

{
  var a = 10;   // Same variable (var is function-scoped)
  let b = 20;   // New variable (shadows outer b)
  const c = 30; // New variable (shadows outer c)

  console.log(a, b, c); // 10, 20, 30
}

console.log(a, b, c); // 10, 2, 3 (only 'a' changed!)
```

### Global scope behavior

Variables declared at the top level behave differently:

```js
var globalVar = "I'm on window";
let globalLet = "I'm not on window";
const globalConst = "Me neither";

// In browsers:
console.log(window.globalVar);   // "I'm on window"
console.log(window.globalLet);   // undefined
console.log(window.globalConst); // undefined
```

`var` declarations become properties of the global object (`window` in browsers), while `let` and `const` do not.

### Redeclaration rules

```js
// var allows redeclaration
var x = 1;
var x = 2; // No error

// let does NOT allow redeclaration in same scope
let y = 1;
// let y = 2; // SyntaxError: Identifier 'y' has already been declared

// const also does NOT allow redeclaration
const z = 1;
// const z = 2; // SyntaxError

// But you can redeclare in nested scopes
let outer = 1;
{
  let outer = 2; // Different variable (shadowing)
  console.log(outer); // 2
}
console.log(outer); // 1
```

### Practical examples

#### Example 1: Configuration objects

```js
// Use const for values that shouldn't change
const CONFIG = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3
};

// Properties can still be modified if needed
CONFIG.timeout = 10000; // Works

// But the reference can't change
// CONFIG = {}; // TypeError
```

#### Example 2: Loop counters

```js
// Always use let for loop counters
for (let i = 0; i < 5; i++) {
  setTimeout(() => console.log(i), i * 100);
}
// Output: 0, 1, 2, 3, 4

// Compare with var (broken behavior)
for (var j = 0; j < 5; j++) {
  setTimeout(() => console.log(j), j * 100);
}
// Output: 5, 5, 5, 5, 5
```

#### Example 3: Conditional initialization

```js
// Use let when value will be assigned conditionally
let result;

if (condition) {
  result = computeA();
} else {
  result = computeB();
}

// Or use const with ternary
const result2 = condition ? computeA() : computeB();
```

#### Example 4: Accumulating values

```js
// Use let for values that accumulate
function sum(numbers) {
  let total = 0; // Will be reassigned

  for (const num of numbers) { // const because num is new each iteration
    total += num;
  }

  return total;
}
```

### Common pitfalls

#### 1. Closure with var in loops

```js
// Bug: All handlers log 5
var buttons = document.querySelectorAll('button');
for (var i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    console.log(i); // Always logs buttons.length
  });
}

// Fix: Use let
for (let i = 0; i < buttons.length; i++) {
  buttons[i].addEventListener('click', function() {
    console.log(i); // Logs correct index
  });
}
```

#### 2. Assuming const means immutable

```js
const user = { name: "Alice", age: 25 };

// This works (modifying property)
user.age = 26;

// This fails (reassigning variable)
// user = { name: "Bob", age: 30 }; // TypeError
```

#### 3. Accessing variables before declaration

```js
function buggy() {
  // console.log(name); // ReferenceError with let
  console.log(name); // undefined with var (confusing!)

  var name = "Alice";
  // let name = "Alice";
}
```

#### 4. Switch statement scope

```js
// Bug: Variables leak across cases
switch (value) {
  case 1:
    var x = 10; // Accessible in all cases!
    break;
  case 2:
    console.log(x); // undefined (hoisted)
    break;
}

// Fix: Use blocks
switch (value) {
  case 1: {
    let x = 10; // Scoped to this case
    break;
  }
  case 2: {
    // console.log(x); // ReferenceError (good!)
    break;
  }
}
```

### Best practices

1. **Default to const**: Use `const` unless you know you need to reassign
2. **Use let for reassignment**: Only use `let` when the value will change
3. **Avoid var**: In modern JavaScript, there's rarely a reason to use `var`
4. **Declare at the top**: Declare variables at the beginning of their scope
5. **Minimize scope**: Declare variables in the smallest scope needed
6. **One declaration per line**: Makes code easier to read and modify

```js
// Good
const MAX_ITEMS = 100;
const API_URL = "https://api.example.com";

let count = 0;
let isLoading = false;

// Avoid
var x = 1, y = 2, z = 3; // Hard to modify, var is outdated
```

### When to use what

| Use Case | Keyword | Why |
|----------|---------|-----|
| Constants | `const` | Value never changes |
| Configuration | `const` | Reference shouldn't change |
| Loop counters | `let` | Value reassigned each iteration |
| Accumulators | `let` | Value changes over time |
| Conditional values | `let` | May be assigned in different branches |
| Imports | `const` | Module references are constant |
| Function expressions | `const` | Functions shouldn't be reassigned |
| DOM references | `const` | Element reference is constant |
| API responses | `const` | Response is assigned once |
| Form state | `let` | User input changes values |

### Quick reference

```js
// const - can't reassign
const PI = 3.14159;
const user = { name: "Alice" };
user.name = "Bob"; // OK (property change)
// user = {}; // Error (reassignment)

// let - block-scoped, can reassign
let count = 0;
count = 1; // OK
{
  let inner = 1;
}
// console.log(inner); // Error

// var - function-scoped, hoisted, avoid in modern code
var old = "legacy";
// Hoisted and initialized to undefined
// Accessible throughout the function
```

### Takeaways

- **const** is the safest default—it prevents accidental reassignment
- **let** is for variables that need to be reassigned
- **var** is legacy—avoid it in modern JavaScript
- **Block scope** (let/const) prevents variables from leaking
- **Hoisting** behaves differently: var is initialized to undefined, let/const have a TDZ
- **Use the smallest scope possible** to reduce bugs and improve code clarity

Understanding these fundamentals will save you from countless debugging sessions and make your code more predictable and maintainable.
