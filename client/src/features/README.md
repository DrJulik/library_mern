# Features

This directory contains all feature modules for the application. Each feature is self-contained and organized by business domain.

## 📂 Available Features

### 🔐 Auth (`auth/`)
Authentication and authorization
- Login, Register, OTP Verification
- Password reset and recovery
- Protected routes

### 📚 Books (`books/`)
Book catalog and management
- Browse books catalog
- Search and filter books
- Book details view
- Add/edit/delete books (admin)

### 📖 Borrowing (`borrowing/`)
Borrow and return books
- View borrowed books
- Borrow history
- Return books
- Overdue tracking and fines

### 👤 User (`user/`)
User profile and dashboard
- User dashboard with stats
- Profile management
- Password change

### 👑 Admin (`admin/`)
Admin management
- Admin dashboard with analytics
- Manage books
- Manage users
- View all borrowing records
- Create new admins

---

## 🏗️ Feature Structure

Each feature follows this structure:

```
feature-name/
├── components/      # Feature-specific components
├── pages/          # Feature pages/views
├── hooks/          # Feature-specific hooks
└── services/       # Feature-specific API logic (optional)
```

---

## 📖 How to Use

### Creating a new feature component:

```typescript
// features/books/components/BookCard.tsx
import { Book } from '@/shared/types';
import Button from '@/components/ui/Button';

interface BookCardProps {
  book: Book;
  onBorrow?: (bookId: string) => void;
}

export default function BookCard({ book, onBorrow }: BookCardProps) {
  return (
    <div className="card">
      <h3>{book.title}</h3>
      <p>{book.author}</p>
      <Button onClick={() => onBorrow?.(book._id)}>
        Borrow
      </Button>
    </div>
  );
}
```

### Creating a feature page:

```typescript
// features/books/pages/BookCatalogPage.tsx
import BookCard from '../components/BookCard';
import { useBooks } from '../hooks/useBooks';
import Layout from '@/components/layout/Layout';

export default function BookCatalogPage() {
  const { books, loading } = useBooks();

  return (
    <Layout>
      <h1>Book Catalog</h1>
      <div className="grid grid-cols-3 gap-4">
        {books.map(book => (
          <BookCard key={book._id} book={book} />
        ))}
      </div>
    </Layout>
  );
}
```

### Creating a feature hook:

```typescript
// features/books/hooks/useBooks.ts
import { useState, useEffect } from 'react';
import bookService from '@/shared/api/bookService';
import { Book } from '@/shared/types';

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBooks() {
      try {
        const response = await bookService.getAllBooks();
        setBooks(response.books);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchBooks();
  }, []);

  return { books, loading };
}
```

---

## ✅ Best Practices

1. **Keep features independent** - Don't import from other features
2. **Use shared utilities** - Import from `@/shared/` for common code
3. **Use shared components** - Import from `@/components/` for UI
4. **Co-locate related code** - Keep feature code together
5. **Export cleanly** - Use index files if needed

---

## 🚫 Don'ts

❌ Don't import from other features:
```typescript
// BAD
import BookCard from '@/features/books/components/BookCard';
```

❌ Don't put shared code in features:
```typescript
// BAD - helper used in multiple features
features/books/utils/formatDate.ts
```

✅ Do use shared utilities:
```typescript
// GOOD
import { formatDate } from '@/shared/utils/helpers';
```

---

## 🎯 Getting Started

Implement features in this recommended order:

1. **Auth** - Foundation for user management
2. **Books** - Core functionality
3. **User** - User dashboard and profile
4. **Borrowing** - Book borrowing functionality
5. **Admin** - Admin management features

Happy coding! 🚀

