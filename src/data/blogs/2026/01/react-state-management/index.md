---
title: React State Management - From useState to Global Solutions
pubDate: 2026-01-29
author: Melnard
slug: react-state-management
image:
  src: ./main.png
  alt: React state management diagram showing local and global state patterns
description: A practical guide to React state management - from useState and useReducer to Context API and when to adopt external libraries like Redux or Zustand.
technology:
  - react
  - javascript
  - typescript
tags:
  - react
  - frontend
  - state-management
  - tutorial
faqs:
  - question: When should I use useReducer instead of useState?
    answer: Use useReducer when state logic is complex, involves multiple sub-values, or when the next state depends on the previous one. It's also helpful when you want to centralize state update logic for easier testing.
  - question: Does Context API replace Redux?
    answer: Context API is for passing data through the component tree without prop drilling. It's not optimized for frequent updates. Redux (or alternatives like Zustand) is better for complex global state with frequent changes.
  - question: What's the best state management library for React?
    answer: There's no "best" - it depends on your needs. Zustand is great for simplicity, Redux Toolkit for large apps with complex logic, and Jotai/Recoil for atomic state. Start with built-in tools and add libraries only when needed.
  - question: Should I put all state in global state?
    answer: No. Keep state as local as possible. Only lift to global state when multiple unrelated components need access. Form inputs, UI toggles, and component-specific data should stay local.
  - question: How do I avoid unnecessary re-renders with Context?
    answer: Split contexts by update frequency, memoize context values with useMemo, and consider using state selectors with libraries like use-context-selector or switching to Zustand for fine-grained subscriptions.
---

State is the heartbeat of any React application. It's the data that changes over time and drives what users see on screen. But as applications grow, managing state becomes one of the biggest challenges developers face.

Think of state like the memory of your application. Local state is like short-term memory - what's in this specific form field right now. Global state is like long-term memory - who's the logged-in user, what's in the shopping cart. Knowing where to store each piece of information is half the battle.

### Understanding State in React

Before diving into solutions, let's clarify what state actually is:

```jsx
// State: data that can change and triggers re-renders
const [count, setCount] = useState(0);

// Props: data passed from parent (read-only)
function Child({ name }) {
  return <p>Hello, {name}</p>;
}

// Derived values: computed from state/props (not state itself)
const doubled = count * 2; // Don't useState for this!
```

The golden rule: **state should be the single source of truth**. If you can compute something from existing state or props, don't store it as separate state.

### useState: The Foundation

`useState` is your go-to for simple, local state:

```jsx
function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await loginUser(email, password);
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Sign In'}
      </button>
    </form>
  );
}
```

**Key patterns with useState:**

```jsx
// Functional updates - use when new state depends on previous
setCount(prev => prev + 1);

// Lazy initialization - for expensive initial values
const [data, setData] = useState(() => computeExpensiveInitialValue());

// Object state - always spread to preserve other fields
const [form, setForm] = useState({ name: '', email: '' });
setForm(prev => ({ ...prev, name: 'John' }));
```

### useReducer: Complex State Logic

When state updates become complex or interconnected, `useReducer` brings order to chaos:

```jsx
const initialState = {
  items: [],
  loading: false,
  error: null,
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload),
      };
    case 'FETCH_START':
      return { ...state, loading: true, error: null };
    case 'FETCH_SUCCESS':
      return { ...state, loading: false, items: action.payload };
    case 'FETCH_ERROR':
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

function ShoppingCart() {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const addItem = (item) => dispatch({ type: 'ADD_ITEM', payload: item });
  const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id });

  return (
    <div>
      {state.loading && <Spinner />}
      {state.error && <Error message={state.error} />}
      {state.items.map(item => (
        <CartItem key={item.id} item={item} onRemove={removeItem} />
      ))}
    </div>
  );
}
```

**When to choose useReducer:**
- Multiple related state values that update together
- Complex state transitions with specific rules
- State logic you want to test independently
- When the next state depends heavily on the previous state

### Context API: Sharing State Across Components

When multiple components need the same state, prop drilling becomes painful. Context provides a way to share values without passing props through every level:

```jsx
// 1. Create context
const AuthContext = createContext(null);

// 2. Create provider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check authentication status on mount
    checkAuth().then(user => {
      setUser(user);
      setLoading(false);
    });
  }, []);

  const login = async (email, password) => {
    const user = await loginAPI(email, password);
    setUser(user);
  };

  const logout = () => {
    logoutAPI();
    setUser(null);
  };

  const value = { user, loading, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Create custom hook for easy access
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

// 4. Use anywhere in the tree
function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav>
      {user ? (
        <>
          <span>Welcome, {user.name}</span>
          <button onClick={logout}>Logout</button>
        </>
      ) : (
        <Link to="/login">Sign In</Link>
      )}
    </nav>
  );
}
```

**Context best practices:**

```jsx
// Split contexts by update frequency
const UserContext = createContext(null);    // Changes rarely
const ThemeContext = createContext(null);   // Changes rarely
const CartContext = createContext(null);    // Changes often

// Memoize context value to prevent unnecessary re-renders
function CartProvider({ children }) {
  const [items, setItems] = useState([]);

  const value = useMemo(() => ({
    items,
    addItem: (item) => setItems(prev => [...prev, item]),
    removeItem: (id) => setItems(prev => prev.filter(i => i.id !== id)),
    total: items.reduce((sum, item) => sum + item.price, 0),
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
```

### When to Reach for External Libraries

Built-in tools handle most cases, but sometimes you need more firepower:

| Scenario | Solution |
|----------|----------|
| Simple global state | Context + useReducer |
| Frequent updates to global state | Zustand, Jotai |
| Complex state with middleware needs | Redux Toolkit |
| Server state (caching, sync) | TanStack Query, SWR |
| Form state | React Hook Form, Formik |

**Zustand - Simple and Powerful:**

```jsx
import { create } from 'zustand';

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}));

// Use in any component - no providers needed
function Counter() {
  const { count, increment, decrement } = useStore();

  return (
    <div>
      <span>{count}</span>
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </div>
  );
}

// Select specific state to prevent unnecessary re-renders
function DisplayCount() {
  const count = useStore((state) => state.count);
  return <span>{count}</span>;
}
```

**Redux Toolkit - For Large Applications:**

```jsx
import { createSlice, configureStore } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], total: 0 },
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
      state.total += action.payload.price;
    },
    removeItem: (state, action) => {
      const index = state.items.findIndex(i => i.id === action.payload);
      if (index !== -1) {
        state.total -= state.items[index].price;
        state.items.splice(index, 1);
      }
    },
  },
});

const store = configureStore({
  reducer: { cart: cartSlice.reducer },
});

// Modern Redux with hooks
function Cart() {
  const items = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();

  return (
    <ul>
      {items.map(item => (
        <li key={item.id}>
          {item.name}
          <button onClick={() => dispatch(cartSlice.actions.removeItem(item.id))}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}
```

### State Colocation: Keep It Close

The most important principle in state management is **colocation** - keeping state as close to where it's used as possible:

```jsx
// BAD: Global state for local concern
const useGlobalStore = create((set) => ({
  isModalOpen: false,  // Only used in one component!
  toggleModal: () => set((s) => ({ isModalOpen: !s.isModalOpen })),
}));

// GOOD: Local state for local concern
function ProductCard({ product }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h3>{product.name}</h3>
      <button onClick={() => setIsModalOpen(true)}>Quick View</button>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <ProductDetails product={product} />
        </Modal>
      )}
    </div>
  );
}
```

**State placement decision tree:**

1. Is it used by only one component? → `useState` in that component
2. Is it used by a parent and few children? → `useState` in parent, pass as props
3. Is it used by many components in a subtree? → Context at subtree root
4. Is it used by unrelated components across the app? → Global state (Zustand/Redux)
5. Is it server data that needs caching? → TanStack Query / SWR

### Common Pitfalls

**1. Storing Derived State**

```jsx
// BAD: Redundant state
const [items, setItems] = useState([]);
const [itemCount, setItemCount] = useState(0); // Derived!

// GOOD: Compute derived values
const [items, setItems] = useState([]);
const itemCount = items.length;
```

**2. Mutating State Directly**

```jsx
// BAD: Direct mutation
const handleAdd = (item) => {
  items.push(item);  // Mutates existing array!
  setItems(items);   // Same reference, no re-render
};

// GOOD: Create new reference
const handleAdd = (item) => {
  setItems([...items, item]);
};
```

**3. Over-globalizing State**

Not everything needs to be global. Form inputs, UI toggles, and component-specific loading states should stay local.

### Key Takeaways

- **Start local** - Use `useState` until you have a reason not to
- **Upgrade to useReducer** for complex, interconnected state logic
- **Use Context** for sharing state across a component subtree without prop drilling
- **Reach for libraries** (Zustand, Redux) only when built-in tools aren't enough
- **Separate server state** - Use TanStack Query or SWR for data fetching and caching
- **Colocate state** - Keep it as close to where it's used as possible
- **Don't store derived values** - Compute them from existing state instead
