---
title: JavaScript Closures and Lexical Scope - A Beginner's Guide
pubDate: 2026-01-08
author: Melnard
slug: javascript-closures-lexical-scope
image:
  src: ./main.png
  alt: JavaScript closures and lexical scope illustration
description: A beginner-friendly guide to understanding JavaScript closures and lexical scope, with practical examples, common use cases, and clear explanations of how functions remember their outer variables.
technology:
  - javascript
tags:
  - javascript
  - frontend
  - tutorial
  - beginner
---

Imagine you're baking cookies and you have a secret family recipe. Even when you take the cookies to a friend's house, they still taste like your family's recipe—not your friend's. Closures work similarly: a function "remembers" the variables from where it was created, even when it's executed somewhere else.

Closures are one of JavaScript's most powerful features, but they can seem mysterious at first. Once you understand them, you'll see they're everywhere in JavaScript code and are essential for writing clean, modular applications.

### What is lexical scope?

Before understanding closures, you need to understand lexical scope. "Lexical" means "related to the code as written." Lexical scope means that the accessibility of variables is determined by where they are written in your code.

Think of lexical scope like nested boxes:

```js
let outerBox = "I'm outside";

function bigBox() {
  let middleBox = "I'm in the middle";

  function smallBox() {
    let innerBox = "I'm inside";

    console.log(innerBox);    // Can access: ✓
    console.log(middleBox);   // Can access: ✓
    console.log(outerBox);    // Can access: ✓
  }

  console.log(middleBox);     // Can access: ✓
  console.log(outerBox);      // Can access: ✓
  console.log(innerBox);      // Cannot access: ✗ (Error!)

  smallBox();
}

console.log(outerBox);        // Can access: ✓
console.log(middleBox);       // Cannot access: ✗ (Error!)

bigBox();
```

**The rule**: Inner functions can access variables from outer functions, but outer functions cannot access variables from inner functions.

### Scope chain

When JavaScript looks for a variable, it searches in this order:

1. Current function's local scope
2. Outer function's scope
3. Outer function's outer scope (and so on)
4. Global scope
5. If not found anywhere: `ReferenceError`

```js
let global = "I'm global";

function outer() {
  let outerVar = "I'm outer";

  function inner() {
    let innerVar = "I'm inner";

    console.log(innerVar);   // Found in step 1 (local)
    console.log(outerVar);   // Found in step 2 (outer function)
    console.log(global);     // Found in step 4 (global)
  }

  inner();
}

outer();
```

This chain of scopes is called the **scope chain**.

### What is a closure?

A closure is created when a function "remembers" and accesses variables from its lexical scope, even when that function is executed outside of its original scope.

In simpler terms: **A closure gives you access to an outer function's variables from an inner function.**

```js
function outerFunction() {
  let message = "Hello from outer";

  function innerFunction() {
    console.log(message); // Can access 'message'
  }

  return innerFunction;
}

let myFunction = outerFunction();
myFunction(); // "Hello from outer"
```

Here's what's special: `outerFunction()` has finished executing, but `innerFunction` still remembers the `message` variable. This is a closure!

### How closures work

When a function is created, it gets a hidden property that stores references to all variables in its lexical scope. This "backpack" of variables travels with the function wherever it goes.

```js
function createGreeting(greeting) {
  // 'greeting' is stored in the closure

  return function(name) {
    console.log(`${greeting}, ${name}!`);
  };
}

let sayHello = createGreeting("Hello");
let sayHi = createGreeting("Hi");

sayHello("Alice"); // "Hello, Alice!"
sayHi("Bob");      // "Hi, Bob!"

// Each function has its own closure with its own 'greeting' value
```

Each returned function has its own independent closure—its own "backpack" of variables.

### Practical example: Counter

One of the most common uses of closures is to create private variables:

```js
function createCounter() {
  let count = 0; // Private variable

  return {
    increment: function() {
      count++;
      console.log(count);
    },
    decrement: function() {
      count--;
      console.log(count);
    },
    getCount: function() {
      return count;
    }
  };
}

let counter = createCounter();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
console.log(counter.getCount()); // 1

// 'count' is private - you can't access it directly
console.log(counter.count); // undefined
```

The `count` variable is protected inside the closure. The only way to modify it is through the methods we provided.

### Practical example: Function factory

Closures let you create customized functions:

```js
function createMultiplier(multiplier) {
  return function(number) {
    return number * multiplier;
  };
}

let double = createMultiplier(2);
let triple = createMultiplier(3);
let quadruple = createMultiplier(4);

console.log(double(5));     // 10
console.log(triple(5));     // 15
console.log(quadruple(5));  // 20
```

Each function remembers its own `multiplier` value through closure.

### Practical example: Event handlers

Closures are heavily used in event handling:

```js
function attachClickHandler(buttonId, message) {
  let button = document.getElementById(buttonId);

  button.addEventListener('click', function() {
    // This function closes over 'message' and 'button'
    console.log(message);
    button.style.backgroundColor = 'blue';
  });
}

attachClickHandler('btn1', 'Button 1 clicked!');
attachClickHandler('btn2', 'Button 2 clicked!');

// Each event handler remembers its own message
```

Even though `attachClickHandler` finishes executing immediately, the event handlers remember their respective `message` and `button` variables.

### Practical example: Data privacy

Closures enable true data privacy in JavaScript:

```js
function createBankAccount(initialBalance) {
  let balance = initialBalance; // Private

  return {
    deposit: function(amount) {
      if (amount > 0) {
        balance += amount;
        return `Deposited $${amount}. New balance: $${balance}`;
      }
      return "Invalid amount";
    },

    withdraw: function(amount) {
      if (amount > 0 && amount <= balance) {
        balance -= amount;
        return `Withdrew $${amount}. New balance: $${balance}`;
      }
      return "Invalid amount or insufficient funds";
    },

    getBalance: function() {
      return balance;
    }
  };
}

let myAccount = createBankAccount(1000);
console.log(myAccount.deposit(500));   // "Deposited $500. New balance: $1500"
console.log(myAccount.withdraw(200));  // "Withdrew $200. New balance: $1300"
console.log(myAccount.getBalance());   // 1300

// Cannot access balance directly
console.log(myAccount.balance);        // undefined

// Cannot cheat the system
myAccount.balance = 1000000;           // Doesn't work
console.log(myAccount.getBalance());   // Still 1300
```

### Closures in loops (common pitfall)

This is a classic interview question and common bug:

```js
// Bug: All buttons show "5"
for (var i = 0; i < 5; i++) {
  let button = document.createElement('button');
  button.innerText = `Button ${i}`;

  button.addEventListener('click', function() {
    console.log(i); // Always logs 5!
  });

  document.body.appendChild(button);
}
```

Why does this happen? By the time you click any button, the loop has finished and `i` is 5. All event handlers share the same `i` variable.

**Fix 1: Use `let` instead of `var`**

```js
// Fix: Each iteration has its own 'i'
for (let i = 0; i < 5; i++) {
  let button = document.createElement('button');
  button.innerText = `Button ${i}`;

  button.addEventListener('click', function() {
    console.log(i); // Logs correct number!
  });

  document.body.appendChild(button);
}
```

`let` creates a new binding for each iteration, so each closure gets its own `i`.

**Fix 2: Use an IIFE (Immediately Invoked Function Expression)**

```js
for (var i = 0; i < 5; i++) {
  (function(index) {
    let button = document.createElement('button');
    button.innerText = `Button ${index}`;

    button.addEventListener('click', function() {
      console.log(index); // Logs correct number!
    });

    document.body.appendChild(button);
  })(i); // Pass current 'i' as 'index'
}
```

The IIFE creates a new scope for each iteration, capturing the current value of `i`.

**Fix 3: Use `forEach`**

```js
[0, 1, 2, 3, 4].forEach(function(i) {
  let button = document.createElement('button');
  button.innerText = `Button ${i}`;

  button.addEventListener('click', function() {
    console.log(i); // Logs correct number!
  });

  document.body.appendChild(button);
});
```

### Closures with arrow functions

Arrow functions work the same way with closures:

```js
function createCounter() {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count
  };
}

let counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
```

### Module pattern

Closures enable the module pattern, which creates self-contained units of code:

```js
let calculator = (function() {
  // Private variables
  let result = 0;

  // Private function
  function log(operation, value) {
    console.log(`${operation} ${value}, result: ${result}`);
  }

  // Public API
  return {
    add: function(x) {
      result += x;
      log('Added', x);
      return this; // For chaining
    },

    subtract: function(x) {
      result -= x;
      log('Subtracted', x);
      return this;
    },

    multiply: function(x) {
      result *= x;
      log('Multiplied by', x);
      return this;
    },

    getResult: function() {
      return result;
    },

    reset: function() {
      result = 0;
      console.log('Reset');
      return this;
    }
  };
})();

calculator.add(10).multiply(2).subtract(5);
// Added 10, result: 10
// Multiplied by 2, result: 20
// Subtracted 5, result: 15

console.log(calculator.getResult()); // 15
```

### Memory and closures

Closures keep variables in memory as long as the function exists. Be mindful of this:

```js
function createHugeClosure() {
  let hugeArray = new Array(1000000).fill('data');

  return function() {
    console.log(hugeArray[0]);
  };
}

let myClosure = createHugeClosure();
// 'hugeArray' stays in memory as long as 'myClosure' exists
```

If you're done with a closure, set it to `null` to allow garbage collection:

```js
myClosure = null; // Now 'hugeArray' can be garbage collected
```

### Real-world use cases

#### 1. Debouncing (limit function calls)

```js
function debounce(func, delay) {
  let timeoutId;

  return function(...args) {
    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

// Use for search input
let searchAPI = debounce(function(query) {
  console.log('Searching for:', query);
}, 500);

// User types: only searches after 500ms of no typing
searchAPI('ja');
searchAPI('jav');
searchAPI('java');
searchAPI('javasc');
searchAPI('javascript'); // Only this one executes
```

#### 2. Memoization (cache results)

```js
function memoize(fn) {
  let cache = {};

  return function(...args) {
    let key = JSON.stringify(args);

    if (key in cache) {
      console.log('Returning cached result');
      return cache[key];
    }

    console.log('Calculating result');
    let result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

let slowSquare = memoize(function(n) {
  // Simulate slow calculation
  for (let i = 0; i < 1000000000; i++) {}
  return n * n;
});

console.log(slowSquare(5)); // Calculating result -> 25
console.log(slowSquare(5)); // Returning cached result -> 25
```

#### 3. Once function (execute only once)

```js
function once(fn) {
  let called = false;
  let result;

  return function(...args) {
    if (!called) {
      called = true;
      result = fn.apply(this, args);
    }
    return result;
  };
}

let initialize = once(function() {
  console.log('Initializing...');
  return 'Initialized!';
});

console.log(initialize()); // "Initializing..." -> "Initialized!"
console.log(initialize()); // "Initialized!" (no log)
console.log(initialize()); // "Initialized!" (no log)
```

#### 4. Private state in React (before hooks)

```js
function createComponent() {
  let state = { count: 0 };

  return {
    getState: () => state,

    setState: (newState) => {
      state = { ...state, ...newState };
      render();
    },

    increment: function() {
      this.setState({ count: state.count + 1 });
    },

    render: function() {
      console.log(`Count: ${state.count}`);
    }
  };
}

let component = createComponent();
component.increment(); // Count: 1
component.increment(); // Count: 2
```

### Visualizing closures

Think of a closure as a function with a backpack:

```
outerFunction() {
  let secret = "password123"

  innerFunction() {
    use secret  ← Closure creates a "backpack"
  }

  return innerFunction
}

myFunc = outerFunction()
           ↓
myFunc: [Function]
  Backpack: { secret: "password123" }
```

Wherever `myFunc` goes, it carries its backpack (closure) with it.

### Common pitfalls

#### 1. Accidental global variables

```js
function createCounter() {
  count = 0; // Forgot 'let' - creates global variable!

  return function() {
    count++;
    console.log(count);
  };
}

let counter1 = createCounter();
let counter2 = createCounter();

counter1(); // 1
counter2(); // 2 (shares the same global count!)
```

**Fix**: Always use `let`, `const`, or `var`.

#### 2. Memory leaks

```js
// Bad: Unnecessary closure keeps large data in memory
function setupHandler() {
  let hugeData = new Array(1000000);

  document.getElementById('btn').addEventListener('click', function() {
    // Doesn't use hugeData but it's still kept in memory
    console.log('Clicked');
  });
}
```

**Fix**: Only close over what you need.

#### 3. Confusing `this` in closures

```js
let obj = {
  name: "Alice",

  greet: function() {
    setTimeout(function() {
      console.log(this.name); // undefined (this is wrong)
    }, 1000);
  }
};

obj.greet();
```

**Fix**: Use arrow function or `bind`:

```js
let obj = {
  name: "Alice",

  greet: function() {
    setTimeout(() => {
      console.log(this.name); // "Alice" (arrow function preserves this)
    }, 1000);
  }
};
```

### Don'ts (best practices)

- Don't close over unnecessary variables (memory waste)
- Don't forget `let`/`const` when creating closures in loops
- Don't create closures inside loops unless necessary (performance)
- Don't assume `this` works the same in closures (use arrow functions)
- Don't ignore memory implications of long-lived closures

### Quick test: Can you predict the output?

```js
function mystery() {
  let x = 0;

  return {
    a: function() { return ++x; },
    b: function() { return ++x; },
    c: function() { return x; }
  };
}

let obj = mystery();
console.log(obj.a()); // ?
console.log(obj.b()); // ?
console.log(obj.c()); // ?

// Answer: 1, 2, 2
// All three functions share the same closure with the same 'x'
```

### Takeaways

- **Lexical scope**: Variables are accessible based on where they're written in code
- **Closure**: A function that remembers variables from its outer scope
- **Closures enable**: Private variables, data encapsulation, function factories
- **Common uses**: Event handlers, callbacks, module pattern, debouncing
- **Be careful**: Loop closures, memory leaks, unnecessary closures

### When to use closures

- **Data privacy**: Hide implementation details
- **Function factories**: Create customized functions
- **Callbacks and event handlers**: Remember context
- **State management**: Maintain state without global variables
- **Performance optimization**: Memoization, debouncing, throttling

### Quick reference

```js
// Basic closure
function outer() {
  let x = 10;
  return function inner() {
    console.log(x); // Closure
  };
}

// Private variable
function createSecret() {
  let secret = "hidden";
  return {
    reveal: () => secret
  };
}

// Function factory
function multiply(x) {
  return (y) => x * y;
}

// Module pattern
let module = (function() {
  let private = "secret";
  return {
    public: () => private
  };
})();
```

---

FAQ

Q: What's the difference between scope and closure?
A: Scope determines where variables are accessible in your code. A closure is when a function remembers variables from its outer scope even after that scope has finished executing.

Q: Do all functions create closures?
A: Technically yes, but we only call it a "closure" when the function actually uses variables from an outer scope. If it doesn't reference any outer variables, the closure is empty/unused.

Q: Are closures slow?
A: Closures have minimal performance impact. The memory overhead is usually negligible unless you're creating thousands of closures or closing over large data structures.

Q: How do I debug closures?
A: Use browser DevTools: set a breakpoint inside the function, check the "Scope" panel to see all variables in the closure. You can also use `console.dir(functionName)` to inspect the function's internal properties.

Q: Why use closures instead of global variables?
A: Closures provide encapsulation and prevent naming conflicts. Global variables can be accessed and modified anywhere, making code unpredictable. Closures give you controlled access to data.

Q: Can closures access variables after the outer function returns?
A: Yes! That's the whole point of closures. The inner function keeps a reference to the outer variables, so they remain accessible even after the outer function has finished executing.

Q: What's the difference between closure and `this`?
A: Closures capture variables from the lexical scope (where code is written). `this` is determined by how a function is called (execution context). They're completely different mechanisms.
