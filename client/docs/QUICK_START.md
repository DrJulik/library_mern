# 🚀 Quick Start Guide

## ✅ What's Been Set Up

Your frontend now has:

1. ✅ **React + TypeScript + Vite** - Modern development setup
2. ✅ **Tailwind CSS** - Utility-first styling
3. ✅ **Zustand** - Global state management
4. ✅ **React Router** - Client-side routing with guards
5. ✅ **Feature-based architecture** - Scalable folder structure
6. ✅ **API Services** - Type-safe backend communication
7. ✅ **Axios** - HTTP client with interceptors

---

## 📦 Installation

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# App will be available at http://localhost:3000
```

---

## 🗂️ Folder Structure

```
src/
├── features/        # Business features (auth, books, etc.)
├── components/      # Shared UI components
├── stores/          # Zustand state stores
├── router/          # React Router configuration
├── shared/          # Utilities, types, API services
└── App.tsx          # Main app with router
```

---

## 🎯 How Everything Works Together

### 1. **State Management (Zustand)**

```typescript
// Import store
import { useAuthStore, selectUser } from '@/stores';

function MyComponent() {
  // Get state
  const user = useAuthStore(selectUser);
  
  // Get actions
  const { login, logout } = useAuthStore();
  
  // Use them
  const handleLogin = async () => {
    await login('email@example.com', 'password');
    // State updates automatically!
  };
}
```

**Available Stores:**
- `useAuthStore` - Authentication (user, login, logout)
- `useUIStore` - UI state (toasts, modals, sidebar, theme)
- `useBooksStore` - Books data with search/filters

---

### 2. **Routing (React Router)**

```typescript
// Navigation
import { useNavigate, Link } from 'react-router-dom';

function MyComponent() {
  const navigate = useNavigate();
  
  return (
    <div>
      {/* Link component */}
      <Link to="/books">View Books</Link>
      
      {/* Programmatic navigation */}
      <button onClick={() => navigate('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  );
}
```

**Routes:**
- Public: `/`, `/login`, `/register`
- Protected: `/dashboard`, `/books`, `/profile`
- Admin: `/admin`, `/admin/books`, `/admin/users`

---

### 3. **API Calls (Services)**

```typescript
// Import service
import bookService from '@/shared/api/bookService';

async function fetchBooks() {
  try {
    const response = await bookService.getAllBooks();
    console.log(response.books); // Fully typed!
  } catch (error) {
    console.error(error);
  }
}
```

**Available Services:**
- `authService` - Login, register, logout, OTP
- `bookService` - Get/add/delete books
- `borrowService` - Borrow/return books
- `userService` - Get users, create admin

---

### 4. **Creating a New Feature**

Let's create a simple "Books" page:

#### Step 1: Create the page

```typescript
// features/books/pages/BookCatalogPage.tsx
import { useEffect } from 'react';
import { useBooksStore, selectFilteredBooks } from '@/stores';
import Button from '@/components/ui/Button';

export default function BookCatalogPage() {
  const books = useBooksStore(selectFilteredBooks);
  const { fetchBooks, isLoading } = useBooksStore();

  useEffect(() => {
    fetchBooks();
  }, []);

  if (isLoading) {
    return <div className="p-8">Loading books...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Book Catalog</h1>
      
      <div className="grid grid-cols-3 gap-6">
        {books.map(book => (
          <div key={book._id} className="card">
            <h3 className="text-xl font-semibold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <p className="text-sm text-gray-500 mt-2">{book.description}</p>
            <div className="mt-4 flex justify-between items-center">
              <span className="text-lg font-bold">${book.price}</span>
              <Button size="sm">Borrow</Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### Step 2: Add route

Already done! The route is in `router/routes.tsx`:

```typescript
{
  path: '/books',
  element: <BookCatalogPage />,
}
```

#### Step 3: Add navigation

```typescript
// In your navbar
<Link to="/books" className="hover:text-primary-600">
  Books
</Link>
```

Done! 🎉

---

## 🎨 Styling with Tailwind

```typescript
// Use Tailwind utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
    Click Me
  </button>
</div>

// Or use custom components
import Button from '@/components/ui/Button';

<Button variant="primary" size="lg">
  Click Me
</Button>
```

**Custom classes available:**
- `.card` - Card container
- `.btn-primary`, `.btn-secondary` - Button styles
- `.input-field` - Form input

---

## 🔥 Common Patterns

### Protected Page with Data Fetching

```typescript
import { useEffect } from 'react';
import { useAuthStore, useBooksStore } from '@/stores';

export default function MyBooksPage() {
  const user = useAuthStore((state) => state.user);
  const { fetchBooks, books, isLoading } = useBooksStore();

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="p-8">
      <h1>Welcome, {user?.name}!</h1>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>{/* Display books */}</div>
      )}
    </div>
  );
}
```

### Form with Validation

```typescript
import { useState } from 'react';
import { useAuthStore } from '@/stores';
import { useUIStore } from '@/stores';
import Button from '@/components/ui/Button';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuthStore();
  const { addToast } = useUIStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await login(email, password);
      addToast({ type: 'success', message: 'Login successful!' });
    } catch (error) {
      // Error is already in store.error
      addToast({ type: 'error', message: 'Login failed' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input-field"
        placeholder="Email"
      />
      
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input-field"
        placeholder="Password"
      />
      
      {error && <p className="text-red-600">{error}</p>}
      
      <Button type="submit" loading={isLoading} className="w-full">
        Login
      </Button>
    </form>
  );
}
```

### Toast Notifications

```typescript
import { useUIStore } from '@/stores';

function MyComponent() {
  const { addToast } = useUIStore();

  const handleSuccess = () => {
    addToast({
      type: 'success',
      message: 'Book added successfully!',
      duration: 3000, // Auto-dismiss after 3 seconds
    });
  };

  const handleError = () => {
    addToast({
      type: 'error',
      message: 'Something went wrong',
    });
  };
}
```

---

## 📚 Next Steps

1. **Read the guides:**
   - `ZUSTAND_GUIDE.md` - State management patterns
   - `ROUTER_GUIDE.md` - Routing examples
   - `FRONTEND_STRUCTURE.md` - Complete architecture

2. **Start building:**
   - Begin with auth feature (`features/auth/`)
   - Then books catalog (`features/books/`)
   - Then user dashboard (`features/user/`)

3. **Create components:**
   - Start with UI components (`components/ui/`)
   - Then layout components (`components/layout/`)

---

## 🎯 Development Workflow

```bash
# 1. Start dev server
pnpm dev

# 2. Open browser to http://localhost:3000

# 3. Make changes (hot reload enabled)

# 4. Build for production
pnpm build

# 5. Preview production build
pnpm preview
```

---

## 🐛 Debugging

### Redux DevTools (for Zustand)

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open DevTools in browser
3. Click on "Redux" tab
4. See all state changes in real-time!

### React DevTools

1. Install [React DevTools](https://react.dev/learn/react-developer-tools)
2. Inspect component tree
3. View props and state

---

## 💡 Pro Tips

1. **Use selectors** to prevent unnecessary re-renders:
   ```typescript
   // ❌ Bad
   const store = useAuthStore();
   
   // ✅ Good
   const user = useAuthStore(selectUser);
   ```

2. **Create custom hooks** for reusable logic:
   ```typescript
   // features/books/hooks/useBooks.ts
   export function useBooks() {
     const books = useBooksStore(selectFilteredBooks);
     const { fetchBooks } = useBooksStore();
     
     useEffect(() => {
       fetchBooks();
     }, []);
     
     return { books };
   }
   ```

3. **Co-locate feature code** - Keep related code together in features/

4. **Use TypeScript** - Let the types guide you!

---

## 🚀 You're All Set!

Your frontend is fully configured and ready to build. Start creating amazing features! 🎨

**Questions?** Check out the detailed guides in the `client/` folder.

Happy coding! 💻

