---
title: Mastering Recursion in JavaScript
pubDate: 2025-12-17
author: Melnard
slug: javascript-recursion
image:
  src: ./main.png
  alt: Visual representation of recursion with nested boxes
description: A complete guide to understanding recursion in JavaScript. Learn the fundamentals, common patterns, and practical examples with clear explanations.
technology:
  - javascript
tags:
  - javascript
  - tutorial
  - beginner
  - algorithms
---

To understand recursion, you must first understand recursion.

That's the classic joke, but it actually captures the essence of what recursion is: a function that calls itself. Think of it like standing between two mirrors - you see infinite reflections, each one a smaller version of the one before it.

### What is Recursion?

Recursion is when a function solves a problem by calling itself with a smaller version of the same problem. Every recursive function needs two things:

1. **Base case**: The condition that stops the recursion
2. **Recursive case**: The function calling itself with a modified input

Without a base case, your function would call itself forever (until the browser crashes).

Here's the simplest recursive function:

```js
function countDown(n) {
  // Base case: stop when we reach 0
  if (n <= 0) {
    console.log('Done!');
    return;
  }

  // Do something
  console.log(n);

  // Recursive case: call with smaller value
  countDown(n - 1);
}

countDown(5);
// Output: 5, 4, 3, 2, 1, Done!
```

### How Recursion Works: The Call Stack

When a function calls itself, JavaScript puts each call on a "call stack" - like stacking plates. Each plate waits for the one above it to finish.

```js
function factorial(n) {
  if (n <= 1) return 1;           // Base case
  return n * factorial(n - 1);    // Recursive case
}

console.log(factorial(4)); // 24
```

Here's what happens step by step:

```
factorial(4)
  → 4 * factorial(3)
       → 3 * factorial(2)
            → 2 * factorial(1)
                 → returns 1      (base case hit!)
            → returns 2 * 1 = 2
       → returns 3 * 2 = 6
  → returns 4 * 6 = 24
```

The calls stack up going down, then resolve coming back up. Each call waits for its inner call to return before it can compute its own result.

### Classic Example: Fibonacci Sequence

The Fibonacci sequence is a famous pattern where each number is the sum of the two before it: 0, 1, 1, 2, 3, 5, 8, 13, 21...

```js
function fibonacci(n) {
  // Base cases
  if (n === 0) return 0;
  if (n === 1) return 1;

  // Recursive case: sum of two previous numbers
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(7)); // 13

// Let's see the sequence
for (let i = 0; i <= 10; i++) {
  console.log(`fib(${i}) = ${fibonacci(i)}`);
}
// fib(0) = 0, fib(1) = 1, fib(2) = 1, fib(3) = 2, fib(4) = 3...
```

This works, but it's inefficient for large numbers because it recalculates the same values many times. We'll fix this later with memoization.

### Recursion with Arrays

Recursion shines when working with nested or sequential data. Here's how to sum an array:

```js
function sumArray(arr) {
  // Base case: empty array has sum of 0
  if (arr.length === 0) return 0;

  // Take first element + sum of the rest
  return arr[0] + sumArray(arr.slice(1));
}

console.log(sumArray([1, 2, 3, 4, 5])); // 15
```

How it unfolds:

```
sumArray([1, 2, 3, 4, 5])
  → 1 + sumArray([2, 3, 4, 5])
       → 2 + sumArray([3, 4, 5])
            → 3 + sumArray([4, 5])
                 → 4 + sumArray([5])
                      → 5 + sumArray([])
                           → returns 0
                      → returns 5 + 0 = 5
                 → returns 4 + 5 = 9
            → returns 3 + 9 = 12
       → returns 2 + 12 = 14
  → returns 1 + 14 = 15
```

### Finding Elements Recursively

Search through an array for a value:

```js
function includes(arr, target) {
  // Base case: empty array means not found
  if (arr.length === 0) return false;

  // Found it!
  if (arr[0] === target) return true;

  // Keep searching in the rest
  return includes(arr.slice(1), target);
}

console.log(includes([1, 2, 3, 4], 3)); // true
console.log(includes([1, 2, 3, 4], 7)); // false
```

### Reversing a String

A classic interview question:

```js
function reverseString(str) {
  // Base case: empty or single character
  if (str.length <= 1) return str;

  // Take last char + reverse the rest
  return str[str.length - 1] + reverseString(str.slice(0, -1));
}

console.log(reverseString('hello')); // 'olleh'
console.log(reverseString('JavaScript')); // 'tpircSavaJ'
```

Alternative approach - take first char and put it at the end:

```js
function reverseString2(str) {
  if (str.length <= 1) return str;

  // Reverse the rest, then add first char at the end
  return reverseString2(str.slice(1)) + str[0];
}

console.log(reverseString2('hello')); // 'olleh'
```

### Working with Nested Data

Recursion is perfect for nested structures. Flatten a deeply nested array:

```js
function flatten(arr) {
  let result = [];

  for (const item of arr) {
    if (Array.isArray(item)) {
      // Recursively flatten nested arrays
      result = result.concat(flatten(item));
    } else {
      result.push(item);
    }
  }

  return result;
}

const nested = [1, [2, 3], [4, [5, [6, 7]]]];
console.log(flatten(nested)); // [1, 2, 3, 4, 5, 6, 7]
```

### Deep Clone an Object

Shallow copies don't handle nested objects. Recursion does:

```js
function deepClone(obj) {
  // Base cases: primitives and null
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Handle arrays
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }

  // Handle objects
  const cloned = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

const original = {
  name: 'Alice',
  address: {
    city: 'Manila',
    coords: { lat: 14.5, lng: 121 }
  },
  hobbies: ['coding', 'reading']
};

const copy = deepClone(original);
copy.address.city = 'Cebu';
copy.hobbies.push('gaming');

console.log(original.address.city); // 'Manila' (unchanged!)
console.log(original.hobbies);      // ['coding', 'reading'] (unchanged!)
```

### Tree Traversal

Recursion is the natural way to work with tree structures:

```js
const fileSystem = {
  name: 'root',
  children: [
    {
      name: 'src',
      children: [
        { name: 'index.js', children: [] },
        { name: 'utils.js', children: [] }
      ]
    },
    {
      name: 'public',
      children: [
        { name: 'index.html', children: [] }
      ]
    },
    { name: 'package.json', children: [] }
  ]
};

function printTree(node, indent = 0) {
  const prefix = '  '.repeat(indent);
  console.log(`${prefix}${node.name}`);

  // Recursively print children
  for (const child of node.children) {
    printTree(child, indent + 1);
  }
}

printTree(fileSystem);
// Output:
// root
//   src
//     index.js
//     utils.js
//   public
//     index.html
//   package.json
```

Find a file by name:

```js
function findFile(node, targetName) {
  // Found it!
  if (node.name === targetName) {
    return node;
  }

  // Search children
  for (const child of node.children) {
    const found = findFile(child, targetName);
    if (found) return found;
  }

  // Not found in this branch
  return null;
}

console.log(findFile(fileSystem, 'utils.js'));
// { name: 'utils.js', children: [] }
```

### Recursion vs Iteration

Most recursive solutions can be written iteratively with loops. Here's factorial both ways:

```js
// Recursive
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

// Iterative
function factorialIterative(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

// Both produce the same result
console.log(factorialRecursive(5)); // 120
console.log(factorialIterative(5)); // 120
```

**When to use each:**

| Recursion | Iteration |
|-----------|-----------|
| Nested/tree structures | Simple sequences |
| Divide-and-conquer algorithms | Known iteration count |
| When solution is naturally recursive | Performance-critical code |
| Cleaner, more readable code | When stack depth is a concern |

### Optimizing Recursion: Memoization

Remember the slow Fibonacci? Each call recalculates the same values. Memoization caches results:

```js
function fibonacciMemo() {
  const cache = {};

  function fib(n) {
    // Return cached result if available
    if (n in cache) return cache[n];

    // Base cases
    if (n <= 1) return n;

    // Calculate, cache, and return
    cache[n] = fib(n - 1) + fib(n - 2);
    return cache[n];
  }

  return fib;
}

const fib = fibonacciMemo();

console.log(fib(10));  // 55
console.log(fib(40));  // 102334155 (instant!)
console.log(fib(50));  // 12586269025 (still fast!)
```

Without memoization, `fib(50)` would take forever. With it, it's instant.

### Tail Call Optimization

A tail call is when the recursive call is the very last thing a function does. Some JavaScript engines can optimize these to avoid stack overflow:

```js
// Not tail-recursive (has to multiply AFTER the call returns)
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1);  // multiplication happens after
}

// Tail-recursive (call is the last operation)
function factorialTail(n, accumulator = 1) {
  if (n <= 1) return accumulator;
  return factorialTail(n - 1, n * accumulator);  // nothing after the call
}

console.log(factorialTail(5)); // 120
```

Note: Tail call optimization isn't implemented in all JavaScript engines, so don't rely on it for very deep recursion.

### Common Pitfalls

**Forgetting the base case:**

```js
// Bad: No base case - infinite recursion!
function broken(n) {
  return broken(n - 1);
}
// RangeError: Maximum call stack size exceeded

// Good: Always have a base case
function fixed(n) {
  if (n <= 0) return 0;  // Base case!
  return fixed(n - 1);
}
```

**Base case never reached:**

```js
// Bad: Base case can't be reached
function countUp(n) {
  if (n <= 0) return;  // Base case checks for <= 0
  console.log(n);
  countUp(n + 1);      // But we're incrementing! Never reaches 0
}

// Good: Make sure recursive case moves toward base case
function countUpTo(current, target) {
  if (current > target) return;  // Base case
  console.log(current);
  countUpTo(current + 1, target);  // Moving toward target
}
```

**Stack overflow with large inputs:**

```js
// This will crash with large n
function sumToN(n) {
  if (n <= 0) return 0;
  return n + sumToN(n - 1);
}

sumToN(100000); // RangeError: Maximum call stack size exceeded

// Solution: Use iteration for simple cases
function sumToNIterative(n) {
  return (n * (n + 1)) / 2;  // Math formula - instant!
}
```

### Practical Example: DOM Traversal

Recursively find all text content in a DOM tree:

```js
function getAllText(element) {
  let text = '';

  for (const child of element.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      text += child.textContent;
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      // Recursively get text from child elements
      text += getAllText(child);
    }
  }

  return text;
}

// Usage: getAllText(document.body)
```

### Practice Problems

Try these to solidify your understanding:

**1. Power function:**

```js
function power(base, exponent) {
  // Your code here
  // power(2, 3) should return 8
}
```

**2. Count occurrences in array:**

```js
function countOccurrences(arr, target) {
  // Your code here
  // countOccurrences([1, 2, 1, 3, 1], 1) should return 3
}
```

**3. Palindrome check:**

```js
function isPalindrome(str) {
  // Your code here
  // isPalindrome('racecar') should return true
}
```

<details>
<summary>Solutions</summary>

```js
function power(base, exponent) {
  if (exponent === 0) return 1;
  return base * power(base, exponent - 1);
}

function countOccurrences(arr, target) {
  if (arr.length === 0) return 0;
  const count = arr[0] === target ? 1 : 0;
  return count + countOccurrences(arr.slice(1), target);
}

function isPalindrome(str) {
  if (str.length <= 1) return true;
  if (str[0] !== str[str.length - 1]) return false;
  return isPalindrome(str.slice(1, -1));
}
```

</details>

### Takeaways

- Every recursive function needs a base case and a recursive case
- The recursive case must move toward the base case
- Recursion uses the call stack - each call waits for inner calls to complete
- Recursion excels with trees, nested data, and divide-and-conquer problems
- Use memoization to avoid redundant calculations
- Consider iteration for simple loops or when stack depth is a concern

### FAQ

**Q: When should I use recursion over loops?**
A: Use recursion for naturally recursive structures (trees, nested data, divide-and-conquer algorithms). Use loops for simple iterations where performance matters or when dealing with potentially very large datasets.

**Q: Why do I get "Maximum call stack size exceeded"?**
A: Each recursive call adds to the call stack. JavaScript has a limit (typically around 10,000-20,000 calls). Either your base case isn't being reached, or your input is too large for recursive processing.

**Q: Is recursion slower than iteration?**
A: Generally yes, due to function call overhead and stack management. But for many problems, the clarity and correctness of recursive code outweighs the performance cost. Profile before optimizing.

**Q: Can all recursive functions be converted to iterative?**
A: Yes, any recursive solution can be written iteratively, often using an explicit stack. However, the recursive version is frequently cleaner and easier to understand.

Further reading: [MDN - Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)
