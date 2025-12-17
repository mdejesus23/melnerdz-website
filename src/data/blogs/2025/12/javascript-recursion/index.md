---
title: Mastering Recursion in JavaScript
pubDate: 2025-12-17
author: Melnard
slug: javascript-recursion
image:
  src: ./main.png
  alt: Visual representation of recursion with nested boxes
description: A beginner-friendly guide to understanding recursion in JavaScript with simple examples, interactive tests, and clear explanations.
technology:
  - javascript
tags:
  - javascript
  - tutorial
  - beginner
  - algorithms
---

To understand recursion, you must first understand recursion.

That’s the classic joke =), but it actually captures the essence of what recursion is: a function that calls itself. Think of it like standing between two mirrors - you see infinite reflections, each one a smaller version of the one before it.

### What is Recursion?

Recursion is when a function calls itself. That's it. A function that calls itself is a recursive function.

```js
function sayHello() {
  console.log('Hello!');
  sayHello(); // Calls itself - this is recursion!
}
```

But wait! This code has a problem. Can you spot it?

The function never stops. It will keep saying "Hello!" forever (until your browser crashes). This is called infinite recursion - and it's bad.

### The Two Rules of Recursion

Every recursive function needs two things:

1. **Base case** - When to STOP
2. **Recursive case** - When to call itself again

Think of it like this:

- Base case = "I found the keys, stop opening boxes"
- Recursive case = "No keys here, open the next box"

Let's fix our example:

```js
function sayHello(times) {
  // Base case: stop when times reaches 0
  if (times <= 0) {
    return;
  }

  console.log('Hello!');

  // Recursive case: call again with a smaller number
  sayHello(times - 1);
}

sayHello(3);
// Output:
// Hello!
// Hello!
// Hello!
```

Now it stops after 3 times. The base case (`times <= 0`) tells the function when to stop.

### Understanding with Countdown

The best way to understand recursion is with a simple countdown. Let's count down from any number to zero:

```js
function countdown(n) {
  // Base case: stop when we reach 0
  if (n <= 0) {
    console.log('Done!');
    return;
  }

  // Print current number
  console.log(n);

  // Recursive case: call with n minus 1
  countdown(n - 1);
}

countdown(5);
```

Output:

```
5
4
3
2
1
Done!
```

Here's what happens step by step:

```
countdown(5) → prints 5, calls countdown(4)
  countdown(4) → prints 4, calls countdown(3)
    countdown(3) → prints 3, calls countdown(2)
      countdown(2) → prints 2, calls countdown(1)
        countdown(1) → prints 1, calls countdown(0)
          countdown(0) → n <= 0 is true, prints "Done!", returns
        returns
      returns
    returns
  returns
returns
```

Each call waits for the next one to finish. The `- 1` is crucial - it moves us closer to the base case with every call.

### Seeing the Call Stack Unwind

In the previous example, we printed **before** the recursive call. But what happens if we print **after** the recursive call? This shows us how the call stack "unwinds" - returning back up through each function call.

```js
function countup(n) {
  // Base case: stop when we reach 0
  if (n <= 0) {
    return;
  }

  // First: go deeper (recursive call)
  countup(n - 1);

  // Then: print AFTER returning from the recursive call
  console.log(n);
}

countup(5);
```

Output:

```
1
2
3
4
5
```

Wait, it printed 1 to 5 instead of 5 to 1! Why?

Here's what happens step by step:

```
countup(5) calls countup(4)             -- going DOWN the stack
  countup(4) calls countup(3)
    countup(3) calls countup(2)
      countup(2) calls countup(1)
        countup(1) calls countup(0)
          countup(0) returns (base case)
        prints 1, then returns          -- coming back UP the stack
      prints 2, then returns
    prints 3, then returns
  prints 4, then returns
prints 5, then returns
```

The key insight: each function **waits** for its recursive call to finish before continuing. So `countup(5)` can't print until `countup(4)` finishes, which can't print until `countup(3)` finishes, and so on.

The printing only happens on the way **back up** - this is called "unwinding the call stack."

### Before vs After: A Side-by-Side Comparison

```js
// Print BEFORE recursive call = countdown (5, 4, 3, 2, 1)
function countdown(n) {
  if (n <= 0) return;
  console.log(n); // Print first
  countdown(n - 1); // Then recurse
}

// Print AFTER recursive call = countup (1, 2, 3, 4, 5)
function countup(n) {
  if (n <= 0) return;
  countup(n - 1); // Recurse first
  console.log(n); // Then print (on the way back up)
}
```

This is a powerful concept! By placing code before or after the recursive call, you control whether it runs on the way **down** the stack or on the way **back up**.

---

### Test Yourself #1

What will this code print?

```js
function countdown(n) {
  if (n <= 0) {
    console.log('Go!');
    return;
  }
  console.log(n);
  countdown(n - 1);
}

countdown(3);
```

Think about it before looking at the answer...

<details>
<summary>Click to see the answer</summary>

**Output:**

```
3
2
1
Go!
```

**Explanation:**

1. `countdown(3)` → `n` is 3, not <= 0, so print `3` and call `countdown(3 - 1)`
2. `countdown(2)` → `n` is 2, not <= 0, so print `2` and call `countdown(2 - 1)`
3. `countdown(1)` → `n` is 1, not <= 0, so print `1` and call `countdown(1 - 1)`
4. `countdown(0)` → `n` is 0, which IS <= 0, so print `Go!` and return

The function counts down by subtracting 1 each time until it reaches the base case.

</details>

---

### Test Yourself #2

What will this code print?

```js
function countdown(n) {
  if (n <= 0) {
    console.log('Blastoff!');
    return;
  }
  console.log(n);
  countdown(n - 2);
}

countdown(6);
```

Notice the difference: we're subtracting 2 instead of 1!

<details>
<summary>Click to see the answer</summary>

**Output:**

```
6
4
2
Blastoff!
```

**Explanation:**

1. `countdown(6)` → `n` is 6, not <= 0, so print `6` and call `countdown(6 - 2)`
2. `countdown(4)` → `n` is 4, not <= 0, so print `4` and call `countdown(4 - 2)`
3. `countdown(2)` → `n` is 2, not <= 0, so print `2` and call `countdown(2 - 2)`
4. `countdown(0)` → `n` is 0, which IS <= 0, so print `Blastoff!` and return

By subtracting 2 each time, we skip odd numbers and only print even numbers: 6, 4, 2.

</details>

---

### Common Mistakes

**Mistake 1: Forgetting the base case**

```js
// BAD - never stops!
function badCountdown(n) {
  console.log(n);
  badCountdown(n - 1); // No base case to stop!
}

// GOOD - has a base case
function goodCountdown(n) {
  if (n <= 0) return; // This stops the recursion
  console.log(n);
  goodCountdown(n - 1);
}
```

**Mistake 2: Not moving toward the base case**

```js
// BAD - n keeps getting bigger, never reaches <= 0
function badCountdown(n) {
  if (n <= 0) return;
  console.log(n);
  badCountdown(n + 1); // Going the wrong direction!
}

// GOOD - n gets smaller toward the base case
function goodCountdown(n) {
  if (n <= 0) return;
  console.log(n);
  goodCountdown(n - 1); // Moving toward base case
}
```

### When to Use Recursion

**Good for:**

- Working with nested structures (folders in folders, boxes in boxes)
- Breaking big problems into smaller identical problems
- When the problem is naturally recursive (like factorial, tree traversal)

**Not good for:**

- Simple counting loops
- Very large numbers (can crash with "stack overflow")
- When a simple loop would work

### Takeaways

- Recursion is a function that calls itself
- Every recursive function needs a **base case** (when to stop) and a **recursive case** (when to continue)
- The recursive case must move toward the base case (usually by subtracting)
- Think of recursion as solving a big problem by solving smaller versions of the same problem

### FAQ

**Q: Why use recursion when loops exist?**
A: Some problems are naturally recursive (like navigating folders or tree structures). The code becomes simpler and easier to understand. But for simple counting, loops are usually better.

**Q: What is "stack overflow"?**
A: Each recursive call uses memory. Too many calls uses too much memory and crashes. JavaScript typically allows around 10,000-20,000 recursive calls.

**Q: How do I know what the base case should be?**
A: Ask yourself: "What's the simplest version of this problem that I can answer immediately?" For countdown, it's when n reaches 0 or less.

Further reading: [MDN - Recursion](https://developer.mozilla.org/en-US/docs/Glossary/Recursion)
