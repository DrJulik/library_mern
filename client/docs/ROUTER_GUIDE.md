# 🚦 React Router Guide

## Routes Overview

Your app has three types of routes:

### 1. **Public Routes** (Anyone can access)
- `/` - Home page
- `/login` - Login page
- `/register` - Register page
- `/verify-otp` - OTP verification
- `/forgot-password` - Forgot password
- `/reset-password/:token` - Reset password

### 2. **Protected Routes** (Authenticated users only)
- `/dashboard` - User dashboard
- `/books` - Book catalog
- `/my-books` - My borrowed books
- `/profile` - User profile

### 3. **Admin Routes** (Admin users only)
- `/admin` - Admin dashboard
- `/admin/books` - Manage books
- `/admin/users` - Manage users
- `/admin/borrowing` - Borrowing records
- `/admin/create-admin` - Create new admin

### 4. **Error Routes**
- `/unauthorized` - 403 Forbidden page
- `*` - 404 Not Found page

---

## 🛡️ Route Guards

### ProtectedRoute

Redirects unauthenticated users to login page.

```typescript
// router/ProtectedRoute.tsx
<ProtectedRoute>
  <UserDashboard />
</ProtectedRoute>

// Or with Outlet
<Route element={<ProtectedRoute />}>
  <Route path="/dashboard" element={<UserDashboard />} />
</Route>
```

### AdminRoute

Requires user to be authenticated AND admin role.

```typescript
<AdminRoute>
  <AdminDashboard />
</AdminRoute>
```

### PublicRoute

Redirects authenticated users away from login/register pages.

```typescript
<PublicRoute redirectTo="/dashboard">
  <LoginPage />
</PublicRoute>
```

---

## 📝 Adding New Routes

### 1. Create Your Page Component

```typescript
// features/books/pages/BookDetailsPage.tsx
export default function BookDetailsPage() {
  return (
    <div>
      <h1>Book Details</h1>
    </div>
  );
}
```

### 2. Add Route to `router/routes.tsx`

```typescript
import BookDetailsPage from '@/features/books/pages/BookDetailsPage';

// In the routes array:
{
  element: <ProtectedRoute />,
  children: [
    // ... other routes
    {
      path: '/books/:id',
      element: <BookDetailsPage />,
    },
  ],
}
```

---

## 🔗 Navigation

### Using Links

```typescript
import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/books">Books</Link>
      <Link to="/dashboard">Dashboard</Link>
    </nav>
  );
}
```

### Programmatic Navigation

```typescript
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    await login(email, password);
    navigate('/dashboard'); // Redirect after login
  };

  return <button onClick={handleLogin}>Login</button>;
}
```

### NavLink (Active Link)

```typescript
import { NavLink } from 'react-router-dom';

function Sidebar() {
  return (
    <nav>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          isActive ? 'text-primary-600' : 'text-gray-600'
        }
      >
        Dashboard
      </NavLink>
    </nav>
  );
}
```

---

## 📊 Route Parameters

### URL Parameters

```typescript
// Route definition
{
  path: '/books/:id',
  element: <BookDetailsPage />,
}

// In component
import { useParams } from 'react-router-dom';

function BookDetailsPage() {
  const { id } = useParams<{ id: string }>();
  
  return <div>Book ID: {id}</div>;
}
```

### Query Parameters

```typescript
import { useSearchParams } from 'react-router-dom';

function BookCatalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const search = searchParams.get('search') || '';
  const page = searchParams.get('page') || '1';

  const handleSearch = (query: string) => {
    setSearchParams({ search: query, page: '1' });
  };

  return <input onChange={(e) => handleSearch(e.target.value)} />;
}
```

---

## 🎣 Useful Hooks

### useNavigate

Navigate programmatically.

```typescript
const navigate = useNavigate();

navigate('/books'); // Go to /books
navigate(-1); // Go back
navigate(1); // Go forward
navigate('/dashboard', { replace: true }); // Replace history
```

### useLocation

Get current location info.

```typescript
import { useLocation } from 'react-router-dom';

function MyComponent() {
  const location = useLocation();
  
  console.log(location.pathname); // '/books'
  console.log(location.search); // '?page=1'
  console.log(location.state); // Custom state passed via navigate
}
```

### useParams

Get URL parameters.

```typescript
const { id, category } = useParams<{ id: string; category: string }>();
```

### useSearchParams

Manage query parameters.

```typescript
const [searchParams, setSearchParams] = useSearchParams();

const search = searchParams.get('search');
setSearchParams({ search: 'new value' });
```

---

## 🔄 Redirects

### Declarative Redirect

```typescript
import { Navigate } from 'react-router-dom';

function SomeComponent() {
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <div>Protected Content</div>;
}
```

### Programmatic Redirect

```typescript
const navigate = useNavigate();

useEffect(() => {
  if (!isAuthenticated) {
    navigate('/login', { replace: true });
  }
}, [isAuthenticated]);
```

---

## 🎨 Layout Routes

Create a layout that wraps multiple routes:

```typescript
// components/layout/DashboardLayout.tsx
export default function DashboardLayout() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
      <Footer />
    </div>
  );
}

// router/routes.tsx
{
  element: <DashboardLayout />,
  children: [
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/books', element: <Books /> },
    { path: '/profile', element: <Profile /> },
  ],
}
```

---

## 🔒 Protected Route with Layout

```typescript
{
  element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
  children: [
    { path: '/dashboard', element: <Dashboard /> },
    { path: '/books', element: <Books /> },
  ],
}
```

---

## 🎯 Best Practices

### 1. **Lazy Loading**

Load routes on demand for better performance:

```typescript
import { lazy, Suspense } from 'react';

const BookCatalog = lazy(() => import('@/features/books/pages/BookCatalogPage'));

// In routes:
{
  path: '/books',
  element: (
    <Suspense fallback={<div>Loading...</div>}>
      <BookCatalog />
    </Suspense>
  ),
}
```

### 2. **Type-Safe Routes**

Create route constants:

```typescript
// router/paths.ts
export const PATHS = {
  HOME: '/',
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  BOOKS: '/books',
  BOOK_DETAILS: (id: string) => `/books/${id}`,
  ADMIN: {
    DASHBOARD: '/admin',
    BOOKS: '/admin/books',
    USERS: '/admin/users',
  },
} as const;

// Usage
navigate(PATHS.BOOKS);
navigate(PATHS.BOOK_DETAILS('123'));
```

### 3. **Handle 404s**

Always have a catch-all route at the end:

```typescript
{
  path: '*',
  element: <NotFoundPage />,
}
```

### 4. **Loading States**

Show loading indicators during route changes:

```typescript
function ProtectedRoute() {
  const isLoading = useAuthStore(selectIsLoading);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // ... rest of logic
}
```

---

## 📚 Learn More

- [React Router Documentation](https://reactrouter.com/)
- [React Router Tutorial](https://reactrouter.com/en/main/start/tutorial)

---

Happy routing! 🚦

