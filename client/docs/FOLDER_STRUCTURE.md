# 📁 Feature-Based Folder Structure

## Current Structure

```
client/src/
│
├── 📂 features/                    # Feature modules (business logic)
│   │
│   ├── 📂 auth/                   # Authentication feature
│   │   ├── 📂 components/         # LoginForm, RegisterForm, OtpInput
│   │   ├── 📂 pages/              # LoginPage, RegisterPage, VerifyOtpPage
│   │   ├── 📂 hooks/              # useLogin, useRegister
│   │   └── 📂 services/           # Auth-specific API logic (optional)
│   │
│   ├── 📂 books/                  # Books catalog feature
│   │   ├── 📂 components/         # BookCard, BookList, BookFilters
│   │   ├── 📂 pages/              # BookCatalogPage, BookDetailsPage
│   │   ├── 📂 hooks/              # useBooks, useBookSearch
│   │   └── 📂 services/           # Book-specific API logic (optional)
│   │
│   ├── 📂 borrowing/              # Borrowing/returning feature
│   │   ├── 📂 components/         # BorrowCard, BorrowHistory, ReturnModal
│   │   ├── 📂 pages/              # MyBooksPage, BorrowHistoryPage
│   │   ├── 📂 hooks/              # useBorrowedBooks, useBorrowBook
│   │   └── 📂 services/           # Borrow-specific API logic (optional)
│   │
│   ├── 📂 admin/                  # Admin management feature
│   │   ├── 📂 components/         # AdminStats, BooksTable, UsersTable
│   │   ├── 📂 pages/              # AdminDashboard, ManageBooksPage
│   │   └── 📂 hooks/              # useAdminStats, useManageBooks
│   │
│   └── 📂 user/                   # User profile feature
│       ├── 📂 components/         # ProfileForm, AvatarUpload, UserStats
│       ├── 📂 pages/              # UserDashboard, ProfilePage
│       └── 📂 hooks/              # useUserProfile, useUserStats
│
├── 📂 components/                  # Shared structural components
│   │
│   ├── 📂 layout/                 # Page structure components
│   │   ├── Layout.tsx             # Main layout wrapper
│   │   ├── Navbar.tsx             # Top navigation bar
│   │   ├── Sidebar.tsx            # Sidebar navigation
│   │   ├── Footer.tsx             # Page footer
│   │   └── MobileNav.tsx          # Mobile navigation
│   │
│   └── 📂 ui/                     # Reusable UI components
│       ├── Button.tsx             ✅ Created
│       ├── Input.tsx              # Form input
│       ├── Modal.tsx              # Modal dialog
│       ├── Card.tsx               # Card container
│       ├── Badge.tsx              # Status badges
│       ├── Table.tsx              # Data table
│       ├── Loader.tsx             # Loading spinner
│       ├── Alert.tsx              # Alert messages
│       └── ...more UI components
│
├── 📂 shared/                      # Shared utilities & configurations
│   │
│   ├── 📂 api/                    # API services
│   │   ├── api.ts                 ✅ Axios instance & interceptors
│   │   ├── authService.ts         ✅ Auth API calls
│   │   ├── bookService.ts         ✅ Book API calls
│   │   ├── borrowService.ts       ✅ Borrow API calls
│   │   └── userService.ts         ✅ User API calls
│   │
│   ├── 📂 context/                # React Context
│   │   └── AuthContext.tsx        ✅ Authentication context
│   │
│   ├── 📂 hooks/                  # Shared custom hooks
│   │   ├── useAuth.ts             ✅ Auth hook
│   │   ├── useDebounce.ts         # Debounce hook
│   │   ├── useLocalStorage.ts     # Local storage hook
│   │   └── useToast.ts            # Toast notification hook
│   │
│   ├── 📂 types/                  # TypeScript type definitions
│   │   └── index.ts               ✅ All interfaces & types
│   │
│   └── 📂 utils/                  # Utility functions
│       ├── constants.ts           ✅ App constants
│       ├── helpers.ts             ✅ Helper functions
│       ├── validators.ts          # Form validators
│       └── formatters.ts          # Date/currency formatters
│
├── 📂 router/                      # Routing configuration
│   ├── index.tsx                  # Main router setup
│   ├── routes.tsx                 # Route definitions
│   └── guards.tsx                 # Route guards (auth, admin)
│
├── 📄 App.tsx                      ✅ Main app component
├── 📄 main.tsx                     ✅ Entry point
├── 📄 index.css                    ✅ Global styles + Tailwind
└── 📄 vite-env.d.ts                ✅ Environment types
```

---

## 🎯 Key Principles

### 1. **Feature Isolation**
Each feature folder contains everything related to that feature:
- Components specific to the feature
- Pages/views for the feature
- Custom hooks for the feature logic
- Optional: Feature-specific services

### 2. **Shared by Default**
If something is used by 2+ features, it belongs in `shared/`:
- API services → `shared/api/`
- Type definitions → `shared/types/`
- Utility functions → `shared/utils/`
- Common hooks → `shared/hooks/`

### 3. **Structural Components**
Generic, reusable components go in `components/`:
- Layout components → `components/layout/`
- UI components → `components/ui/`

### 4. **Avoid Cross-Feature Dependencies**
Features should NOT import from each other:
- ❌ `features/books/` should NOT import from `features/auth/`
- ✅ Both can import from `shared/` or `components/`

---

## 📦 Import Path Examples

### Within the same feature:
```typescript
// In features/books/pages/BookCatalogPage.tsx
import BookCard from '../components/BookCard';
import { useBooks } from '../hooks/useBooks';
```

### From shared utilities:
```typescript
import { useAuth } from '@/shared/hooks/useAuth';
import { Book, User } from '@/shared/types';
import { formatDate } from '@/shared/utils/helpers';
import bookService from '@/shared/api/bookService';
```

### From components:
```typescript
import Button from '@/components/ui/Button';
import Layout from '@/components/layout/Layout';
```

---

## ✅ Benefits

1. **Scalability** - Easy to add new features
2. **Maintainability** - Find and modify feature code easily
3. **Team Collaboration** - Different devs work on different features
4. **Clear Boundaries** - Explicit separation of concerns
5. **Easy Testing** - Test features independently
6. **Code Reusability** - Shared code is explicitly shared

---

## 🚀 Getting Started

Start implementing features in this order:

1. **Shared UI Components** (`components/ui/`)
2. **Layout Components** (`components/layout/`)
3. **Auth Feature** (`features/auth/`)
4. **Books Feature** (`features/books/`)
5. **User Feature** (`features/user/`)
6. **Borrowing Feature** (`features/borrowing/`)
7. **Admin Feature** (`features/admin/`)

---

This structure will scale beautifully as your application grows! 🎉

