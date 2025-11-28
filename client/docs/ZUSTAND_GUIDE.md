# 🐻 Zustand State Management Guide

## What is Zustand?

Zustand is a small, fast, and scalable state management solution. It's simpler than Redux and requires less boilerplate.

---

## 📦 Available Stores

### 1. **Auth Store** (`useAuthStore`)

Manages authentication state and actions.

#### State:
- `user` - Current user object
- `isAuthenticated` - Authentication status
- `isLoading` - Loading state
- `error` - Error messages

#### Actions:
- `login(email, password)` - Login user
- `register(userData)` - Register new user
- `logout()` - Logout user
- `checkAuth()` - Check authentication status
- `clearError()` - Clear error messages
- `setUser(user)` - Set user manually

#### Usage:

```typescript
import { useAuthStore, selectUser, selectIsAuthenticated } from '@/stores';

function MyComponent() {
  // Get specific values using selectors
  const user = useAuthStore(selectUser);
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  
  // Or get the whole store
  const { login, logout, error } = useAuthStore();

  const handleLogin = async () => {
    try {
      await login('user@example.com', 'password123');
      // Success! User is logged in
    } catch (error) {
      // Error is automatically set in the store
      console.error(error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <button onClick={logout}>Logout {user?.name}</button>
      ) : (
        <button onClick={handleLogin}>Login</button>
      )}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
```

---

### 2. **UI Store** (`useUIStore`)

Manages UI state like sidebar, toasts, modals, and theme.

#### State:
- `sidebarOpen` - Sidebar visibility
- `toasts` - Toast notifications array
- `modals` - Active modals array
- `theme` - Current theme (light/dark)

#### Actions:
- `toggleSidebar()` - Toggle sidebar
- `setSidebarOpen(open)` - Set sidebar state
- `addToast({ type, message, duration })` - Show toast notification
- `removeToast(id)` - Remove toast
- `openModal({ title, content })` - Open modal
- `closeModal(id)` - Close modal
- `toggleTheme()` - Toggle theme
- `setTheme(theme)` - Set theme

#### Usage:

```typescript
import { useUIStore } from '@/stores';

function MyComponent() {
  const { addToast, toggleSidebar, sidebarOpen } = useUIStore();

  const handleSuccess = () => {
    addToast({
      type: 'success',
      message: 'Book added successfully!',
      duration: 3000, // Auto-dismiss after 3s
    });
  };

  const handleError = () => {
    addToast({
      type: 'error',
      message: 'Failed to add book',
    });
  };

  return (
    <div>
      <button onClick={toggleSidebar}>
        Toggle Sidebar ({sidebarOpen ? 'Open' : 'Closed'})
      </button>
      <button onClick={handleSuccess}>Show Success</button>
      <button onClick={handleError}>Show Error</button>
    </div>
  );
}
```

---

### 3. **Books Store** (`useBooksStore`)

Manages books data, search, and filters.

#### State:
- `books` - Array of books
- `selectedBook` - Currently selected book
- `isLoading` - Loading state
- `error` - Error messages
- `searchQuery` - Current search query
- `filters` - Active filters

#### Actions:
- `fetchBooks()` - Fetch all books
- `addBook(bookData)` - Add new book
- `deleteBook(bookId)` - Delete book
- `setSelectedBook(book)` - Select a book
- `setSearchQuery(query)` - Set search query
- `setFilters(filters)` - Set filters
- `clearFilters()` - Clear all filters

#### Usage:

```typescript
import { useBooksStore, selectFilteredBooks } from '@/stores';

function BookCatalog() {
  const books = useBooksStore(selectFilteredBooks); // Get filtered books
  const { fetchBooks, setSearchQuery, isLoading } = useBooksStore();

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <input
        type="text"
        onChange={handleSearch}
        placeholder="Search books..."
      />
      <div className="grid grid-cols-3 gap-4">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </div>
  );
}
```

---

## 🎯 Best Practices

### 1. **Use Selectors**

Instead of getting the entire store, use selectors for better performance:

```typescript
// ❌ Bad - Component re-renders on ANY state change
const store = useAuthStore();

// ✅ Good - Component only re-renders when user changes
const user = useAuthStore(selectUser);
```

### 2. **Create Custom Selectors**

```typescript
// In your component or a separate file
const selectUserName = (state: AuthStore) => state.user?.name;
const selectIsAdmin = (state: AuthStore) => state.user?.role === 'admin';

// Usage
const userName = useAuthStore(selectUserName);
const isAdmin = useAuthStore(selectIsAdmin);
```

### 3. **Combine Multiple Values**

```typescript
// Get multiple values at once
const { user, isAuthenticated, login, logout } = useAuthStore((state) => ({
  user: state.user,
  isAuthenticated: state.isAuthenticated,
  login: state.login,
  logout: state.logout,
}));
```

### 4. **Call Actions Outside Components**

```typescript
import { useAuthStore } from '@/stores';

// You can call store actions anywhere!
export async function handleApiError(error: any) {
  if (error.response?.status === 401) {
    // Logout user
    useAuthStore.getState().logout();
  }
}
```

---

## 🔥 Advanced Features

### Persist State (Already configured for Auth)

The auth store automatically persists to localStorage:

```typescript
// Auth state survives page refreshes
// User stays logged in even after closing browser
```

### DevTools Integration

Zustand stores are integrated with Redux DevTools:

1. Install Redux DevTools extension
2. Open DevTools
3. See state changes in real-time
4. Time-travel debugging

---

## 📚 Creating New Stores

```typescript
// stores/useMyStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface MyState {
  count: number;
  items: string[];
}

interface MyActions {
  increment: () => void;
  addItem: (item: string) => void;
}

type MyStore = MyState & MyActions;

export const useMyStore = create<MyStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      count: 0,
      items: [],

      // Actions
      increment: () => set((state) => ({ count: state.count + 1 })),
      
      addItem: (item: string) =>
        set((state) => ({
          items: [...state.items, item],
        })),
    }),
    { name: 'MyStore' } // DevTools name
  )
);

// Selectors
export const selectCount = (state: MyStore) => state.count;
export const selectItems = (state: MyStore) => state.items;
```

---

## 🆚 Zustand vs Context API

### Why Zustand over Context?

**Context API:**
- ❌ Causes unnecessary re-renders
- ❌ Requires wrapper components
- ❌ No DevTools
- ❌ More boilerplate

**Zustand:**
- ✅ Only re-renders when selected state changes
- ✅ No wrapper components needed
- ✅ DevTools integration
- ✅ Less boilerplate
- ✅ Can be used outside components
- ✅ Better TypeScript support

---

## 🎓 Learn More

- [Zustand Documentation](https://docs.pmnd.rs/zustand/getting-started/introduction)
- [Zustand Examples](https://github.com/pmndrs/zustand)

---

Happy state managing! 🐻

