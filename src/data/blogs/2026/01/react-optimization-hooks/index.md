---
title: React Performance Optimization - useMemo, useCallback, and React.memo
pubDate: 2026-01-29
author: Melnard
slug: react-optimization-hooks
image:
  src: ./main.png
  alt: React optimization hooks illustration showing useMemo, useCallback, and React.memo
description: Master React performance optimization with useMemo, useCallback, and React.memo. Learn when to use each technique, common pitfalls, and real-world patterns.
technology:
  - react
  - javascript
  - typescript
tags:
  - react
  - frontend
  - performance
  - tutorial
faqs:
  - question: Should I wrap everything in useMemo and useCallback?
    answer: No. Premature optimization adds complexity without benefit. Only optimize when you've identified actual performance issues through profiling. Memoization itself has a cost (memory and comparison overhead).
  - question: Does React.memo do deep comparison?
    answer: No, React.memo performs shallow comparison by default. For deep comparison, pass a custom comparison function as the second argument, but be careful as deep comparisons can be expensive.
  - question: Why does my useCallback still cause re-renders?
    answer: The memoized function reference stays the same, but if you're passing new object/array props alongside it, those will still trigger re-renders. All props need stable references.
  - question: When should I use useMemo vs useCallback?
    answer: Use useMemo for memoizing computed values (expensive calculations, derived data). Use useCallback for memoizing functions (event handlers, callbacks passed to children).
  - question: Does the React Compiler replace these hooks?
    answer: The React Compiler (React 19+) automatically memoizes components and values, potentially eliminating manual useMemo/useCallback usage. However, understanding these hooks remains valuable for older codebases and edge cases.
---

React's declarative model is powerful, but it comes with a trade-off: components re-render whenever their parent re-renders or their state changes. For most apps, this is fine. But when you have expensive computations, large lists, or frequently updating state, unnecessary re-renders can tank your performance.

Think of React's re-rendering like a domino effect - one state change at the top can cascade through dozens of child components. `useMemo`, `useCallback`, and `React.memo` are your tools to strategically break that chain where it matters.

### Understanding the Re-render Problem

Before diving into solutions, let's understand the problem. Every time a component re-renders, React:

1. Executes the entire component function
2. Recreates all variables, objects, and functions inside it
3. Compares the new Virtual DOM with the previous one
4. Updates the actual DOM if needed

```jsx
function ParentComponent() {
  const [count, setCount] = useState(0);

  // This object is recreated on EVERY render
  const config = { theme: 'dark', size: 'large' };

  // This function is recreated on EVERY render
  const handleClick = () => {
    console.log('clicked');
  };

  return (
    <div>
      <button onClick={() => setCount(count + 1)}>Count: {count}</button>
      {/* ChildComponent receives new references every time */}
      <ChildComponent config={config} onClick={handleClick} />
    </div>
  );
}
```

Even if `ChildComponent` is wrapped in `React.memo`, it will still re-render because `config` and `handleClick` are new references on every render.

### useMemo: Memoizing Expensive Values

`useMemo` caches the result of a computation between re-renders. It only recalculates when its dependencies change.

```jsx
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);
```

#### When to Use useMemo

**1. Expensive Calculations**

```jsx
function ProductList({ products, filterTerm }) {
  // Without useMemo: filters on EVERY render
  // With useMemo: only filters when products or filterTerm changes
  const filteredProducts = useMemo(() => {
    console.log('Filtering products...');
    return products.filter((product) =>
      product.name.toLowerCase().includes(filterTerm.toLowerCase())
    );
  }, [products, filterTerm]);

  return (
    <ul>
      {filteredProducts.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
}
```

**2. Referential Equality for Child Props**

```jsx
function Dashboard({ userId }) {
  const [refreshKey, setRefreshKey] = useState(0);

  // Without useMemo: new object reference on every render
  // UserProfile would re-render even if userId hasn't changed
  const userConfig = useMemo(
    () => ({
      id: userId,
      showAvatar: true,
      theme: 'compact',
    }),
    [userId]
  );

  return (
    <div>
      <button onClick={() => setRefreshKey((k) => k + 1)}>Refresh</button>
      <UserProfile config={userConfig} />
    </div>
  );
}
```

**3. Derived State from Props**

```jsx
function OrderSummary({ items }) {
  const { subtotal, tax, total } = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const tax = subtotal * 0.08;
    const total = subtotal + tax;
    return { subtotal, tax, total };
  }, [items]);

  return (
    <div>
      <p>Subtotal: ${subtotal.toFixed(2)}</p>
      <p>Tax: ${tax.toFixed(2)}</p>
      <p>Total: ${total.toFixed(2)}</p>
    </div>
  );
}
```

### useCallback: Memoizing Functions

`useCallback` returns a memoized version of a callback function that only changes when its dependencies change. It's essentially `useMemo` for functions.

```jsx
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);

// Equivalent to:
const memoizedCallback = useMemo(() => {
  return () => doSomething(a, b);
}, [a, b]);
```

#### When to Use useCallback

**1. Passing Callbacks to Memoized Children**

```jsx
function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState('all');

  // Without useCallback: TodoList re-renders on every filter change
  // because onToggle is a new function reference
  const handleToggle = useCallback((id) => {
    setTodos((prevTodos) =>
      prevTodos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  }, []); // Empty deps because we use functional update

  const handleDelete = useCallback((id) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  }, []);

  return (
    <div>
      <FilterButtons filter={filter} onFilterChange={setFilter} />
      <TodoList
        todos={todos}
        filter={filter}
        onToggle={handleToggle}
        onDelete={handleDelete}
      />
    </div>
  );
}

const TodoList = React.memo(({ todos, filter, onToggle, onDelete }) => {
  console.log('TodoList rendered');
  const filtered = todos.filter((todo) => {
    if (filter === 'active') return !todo.completed;
    if (filter === 'completed') return todo.completed;
    return true;
  });

  return (
    <ul>
      {filtered.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
});
```

**2. Dependencies in useEffect**

```jsx
function SearchResults({ query, category }) {
  const [results, setResults] = useState([]);

  // Without useCallback: fetchResults changes on every render
  // causing useEffect to run unnecessarily
  const fetchResults = useCallback(async () => {
    const response = await fetch(`/api/search?q=${query}&cat=${category}`);
    const data = await response.json();
    setResults(data);
  }, [query, category]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return <ResultsList results={results} />;
}
```

**3. Custom Hooks Returning Functions**

```jsx
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  // Memoize to give consumers a stable reference
  const debouncedCallback = useCallback(
    (...args) => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );

  return debouncedCallback;
}

// Usage
function SearchInput({ onSearch }) {
  const debouncedSearch = useDebounce(onSearch, 300);

  return <input onChange={(e) => debouncedSearch(e.target.value)} />;
}
```

### React.memo: Memoizing Components

`React.memo` is a higher-order component that prevents re-renders when props haven't changed (shallow comparison by default).

```jsx
const MemoizedComponent = React.memo(function MyComponent(props) {
  // Only re-renders if props change
  return <div>{props.value}</div>;
});
```

#### When to Use React.memo

**1. Pure Display Components**

```jsx
// Perfect candidate: pure presentation, likely receives same props often
const UserAvatar = React.memo(function UserAvatar({ user, size = 'medium' }) {
  const sizeMap = { small: 32, medium: 48, large: 64 };

  return (
    <img
      src={user.avatarUrl}
      alt={user.name}
      width={sizeMap[size]}
      height={sizeMap[size]}
      className="avatar"
    />
  );
});
```

**2. List Items**

```jsx
// Each item only re-renders when its specific data changes
const ProductCard = React.memo(function ProductCard({
  product,
  onAddToCart,
  onFavorite,
}) {
  console.log(`ProductCard rendered: ${product.id}`);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
      <button onClick={() => onFavorite(product.id)}>Favorite</button>
    </div>
  );
});
```

**3. Components Below Frequently Updating Parents**

```jsx
function LiveDashboard() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <Clock time={time} />
      {/* Without memo, these re-render every second! */}
      <MemoizedChart data={chartData} />
      <MemoizedStats stats={stats} />
      <MemoizedUserList users={users} />
    </div>
  );
}

const MemoizedChart = React.memo(Chart);
const MemoizedStats = React.memo(Stats);
const MemoizedUserList = React.memo(UserList);
```

#### Custom Comparison Function

For more control, pass a comparison function:

```jsx
const MemoizedComponent = React.memo(
  function MyComponent({ user, settings }) {
    return (
      <div>
        {user.name} - {settings.theme}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip re-render)
    // Return false if props are different (re-render)
    return (
      prevProps.user.id === nextProps.user.id &&
      prevProps.settings.theme === nextProps.settings.theme
    );
  }
);
```

### Putting It All Together

Here's a real-world example combining all three techniques:

```jsx
function ProductCatalog() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [cartCount, setCartCount] = useState(0);

  // useMemo: expensive filtering and sorting
  const processedProducts = useMemo(() => {
    console.log('Processing products...');
    return products
      .filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'price') return a.price - b.price;
        return 0;
      });
  }, [products, searchTerm, sortBy]);

  // useCallback: stable function references for memoized children
  const handleAddToCart = useCallback((productId) => {
    setCartCount((c) => c + 1);
    // Add to cart logic...
  }, []);

  const handleFavorite = useCallback((productId) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, favorited: !p.favorited } : p
      )
    );
  }, []);

  return (
    <div>
      <Header cartCount={cartCount} />
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <SortSelect value={sortBy} onChange={setSortBy} />

      {/* React.memo on ProductGrid prevents re-render when cartCount changes */}
      <ProductGrid
        products={processedProducts}
        onAddToCart={handleAddToCart}
        onFavorite={handleFavorite}
      />
    </div>
  );
}

// React.memo: prevent re-renders from parent state changes
const ProductGrid = React.memo(function ProductGrid({
  products,
  onAddToCart,
  onFavorite,
}) {
  console.log('ProductGrid rendered');

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onFavorite={onFavorite}
        />
      ))}
    </div>
  );
});

const ProductCard = React.memo(function ProductCard({
  product,
  onAddToCart,
  onFavorite,
}) {
  console.log(`ProductCard rendered: ${product.name}`);

  return (
    <div className="product-card">
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={() => onAddToCart(product.id)}>Add to Cart</button>
      <button onClick={() => onFavorite(product.id)}>
        {product.favorited ? 'Unfavorite' : 'Favorite'}
      </button>
    </div>
  );
});
```

### Common Pitfalls

**1. Inline Objects Break Memoization**

```jsx
// BAD: style is a new object every render
<MemoizedChild style={{ color: 'red' }} />

// GOOD: memoize the object
const style = useMemo(() => ({ color: 'red' }), []);
<MemoizedChild style={style} />

// ALSO GOOD: define outside component if static
const style = { color: 'red' };
function Parent() {
  return <MemoizedChild style={style} />;
}
```

**2. Missing Dependencies**

```jsx
// BAD: stale closure - count will always be 0
const handleClick = useCallback(() => {
  setCount(count + 1);
}, []); // Missing count dependency!

// GOOD: use functional update to avoid dependency
const handleClick = useCallback(() => {
  setCount((c) => c + 1);
}, []);

// ALSO GOOD: include dependency if needed
const handleClick = useCallback(() => {
  console.log(`Current count: ${count}`);
  setCount(count + 1);
}, [count]);
```

**3. Over-Memoizing Simple Components**

```jsx
// UNNECESSARY: simple component, memoization overhead > re-render cost
const Label = React.memo(({ text }) => <span>{text}</span>);

// The comparison check itself has a cost!
// Only memo components that are expensive to render
```

**4. Forgetting Children Prop**

```jsx
// This won't work as expected!
const MemoizedWrapper = React.memo(function Wrapper({ children }) {
  return <div className="wrapper">{children}</div>;
});

// children is a new React element on every parent render
<MemoizedWrapper>
  <SomeContent /> {/* New reference every time */}
</MemoizedWrapper>
```

### When NOT to Optimize

Don't reach for these tools prematurely. Avoid optimization when:

- **The component is simple** - A few DOM elements with basic props
- **Re-renders are infrequent** - User interactions, not real-time updates
- **The computation is cheap** - Simple array methods, basic math
- **You haven't measured** - Profile first with React DevTools

```jsx
// These probably don't need memoization:
const total = items.length;
const isActive = status === 'active';
const fullName = `${firstName} ${lastName}`;

// These might benefit from memoization:
const sortedItems = items.sort((a, b) => complexComparison(a, b));
const aggregatedData = data.reduce((acc, item) => expensiveAggregation(acc, item), {});
const filteredResults = results.filter(item => multipleConditions(item));
```

### The React Compiler (React 19+)

React 19 introduces the React Compiler (formerly "React Forget"), which automatically memoizes components and values at build time. This could make manual `useMemo` and `useCallback` usage largely unnecessary.

```jsx
// Before React Compiler: manual memoization
function TodoList({ todos, filter }) {
  const filteredTodos = useMemo(
    () => todos.filter((t) => matchesFilter(t, filter)),
    [todos, filter]
  );

  const handleToggle = useCallback((id) => {
    // toggle logic
  }, []);

  return <List items={filteredTodos} onToggle={handleToggle} />;
}

// After React Compiler: automatic optimization
function TodoList({ todos, filter }) {
  // Compiler automatically memoizes these
  const filteredTodos = todos.filter((t) => matchesFilter(t, filter));

  const handleToggle = (id) => {
    // toggle logic
  };

  return <List items={filteredTodos} onToggle={handleToggle} />;
}
```

However, understanding these hooks remains valuable for:
- Legacy codebases not using the compiler
- Fine-grained control over optimization behavior
- Understanding React's rendering model
- Edge cases the compiler can't handle

### Key Takeaways

- **useMemo** caches computed values; use for expensive calculations and stable object references
- **useCallback** caches functions; use when passing callbacks to memoized children
- **React.memo** prevents component re-renders; use for pure components with stable props
- **Profile first** - Don't optimize without measuring. React DevTools Profiler is your friend
- **Watch for broken memoization** - Inline objects, missing deps, and children props can defeat your optimizations
- **The React Compiler** may automate most of this in React 19+, but understanding the concepts remains essential
