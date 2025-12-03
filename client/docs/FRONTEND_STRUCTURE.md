# Library Management System - Frontend Structure (Feature-Based)

## 📋 Backend Analysis Summary

Based on your backend, here's what the application handles:

### Authentication System
- User registration with email verification (OTP)
- Login/Logout
- Password management (forgot/reset/update)
- Role-based access (Admin & User)
- Account verification system

### Book Management
- Books have: title, author, description, price, quantity, availability
- Admin can add/delete books
- All users can view books catalog

### Borrowing System
- Users can borrow books
- Track borrowed/due/return dates
- Fine calculation for overdue books
- Status tracking: pending, borrowed, returned, overdue
- Notifications for overdue books
- Admin can record borrow/return transactions

### User Management
- Admin can view all users
- Admin can create new admin accounts
- Users have borrowing history

---

## 🗂️ Feature-Based Folder Structure

```
src/
├── features/                 # Feature modules
│   ├── auth/                # Authentication feature
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   ├── OtpInput.tsx
│   │   │   ├── ForgotPasswordForm.tsx
│   │   │   └── ProtectedRoute.tsx
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── VerifyOtpPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── ResetPasswordPage.tsx
│   │   ├── hooks/
│   │   │   ├── useLogin.ts
│   │   │   ├── useRegister.ts
│   │   │   └── usePasswordReset.ts
│   │   └── services/
│   │       └── authApi.ts      # Auth-specific API calls
│   │
│   ├── books/               # Books catalog feature
│   │   ├── components/
│   │   │   ├── BookCard.tsx
│   │   │   ├── BookList.tsx
│   │   │   ├── BookGrid.tsx
│   │   │   ├── BookDetails.tsx
│   │   │   ├── BookFilters.tsx
│   │   │   ├── BookSearch.tsx
│   │   │   └── AddBookForm.tsx
│   │   ├── pages/
│   │   │   ├── BookCatalogPage.tsx
│   │   │   └── BookDetailsPage.tsx
│   │   ├── hooks/
│   │   │   ├── useBooks.ts
│   │   │   ├── useBookSearch.ts
│   │   │   └── useBookFilters.ts
│   │   └── services/
│   │       └── bookApi.ts
│   │
│   ├── borrowing/           # Borrowing/returning books feature
│   │   ├── components/
│   │   │   ├── BorrowCard.tsx
│   │   │   ├── BorrowHistory.tsx
│   │   │   ├── BorrowList.tsx
│   │   │   ├── ReturnBookModal.tsx
│   │   │   ├── OverdueAlert.tsx
│   │   │   ├── FineCalculator.tsx
│   │   │   └── BorrowStatus.tsx
│   │   ├── pages/
│   │   │   ├── MyBooksPage.tsx
│   │   │   └── BorrowHistoryPage.tsx
│   │   ├── hooks/
│   │   │   ├── useBorrowedBooks.ts
│   │   │   ├── useBorrowBook.ts
│   │   │   └── useReturnBook.ts
│   │   └── services/
│   │       └── borrowApi.ts
│   │
│   ├── admin/               # Admin management feature
│   │   ├── components/
│   │   │   ├── AdminStats.tsx
│   │   │   ├── RecentActivity.tsx
│   │   │   ├── BooksTable.tsx
│   │   │   ├── UsersTable.tsx
│   │   │   ├── BorrowingTable.tsx
│   │   │   ├── CreateAdminForm.tsx
│   │   │   └── AdminSidebar.tsx
│   │   ├── pages/
│   │   │   ├── AdminDashboard.tsx
│   │   │   ├── ManageBooksPage.tsx
│   │   │   ├── ManageUsersPage.tsx
│   │   │   ├── BorrowingRecordsPage.tsx
│   │   │   └── CreateAdminPage.tsx
│   │   └── hooks/
│   │       ├── useAdminStats.ts
│   │       ├── useManageBooks.ts
│   │       └── useManageUsers.ts
│   │
│   └── user/                # User profile & dashboard
│       ├── components/
│       │   ├── UserStats.tsx
│       │   ├── ProfileForm.tsx
│       │   ├── PasswordChangeForm.tsx
│       │   └── DashboardWidget.tsx
│       ├── pages/
│       │   ├── UserDashboard.tsx
│       │   └── ProfilePage.tsx
│       └── hooks/
│           ├── useUserProfile.ts
│           └── useUserStats.ts
│
├── components/              # Shared structural components
│   ├── layout/
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Navbar.tsx       # Top navigation
│   │   ├── Sidebar.tsx      # Sidebar navigation
│   │   ├── Footer.tsx       # Footer
│   │   └── MobileNav.tsx    # Mobile navigation
│   │
│   └── ui/                  # Reusable UI components
│       ├── Button.tsx       ✅
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Card.tsx
│       ├── Badge.tsx
│       ├── Table.tsx
│       ├── Loader.tsx
│       ├── Spinner.tsx
│       ├── Alert.tsx
│       ├── Toast.tsx
│       ├── Dropdown.tsx
│       ├── Tabs.tsx
│       └── Pagination.tsx
│
├── shared/                  # Shared utilities and configurations
│   ├── api/
│   │   ├── api.ts          ✅ Axios instance
│   │   ├── authService.ts  ✅
│   │   ├── bookService.ts  ✅
│   │   ├── borrowService.ts ✅
│   │   └── userService.ts  ✅
│   │
│   ├── context/
│   │   └── AuthContext.tsx ✅
│   │
│   ├── hooks/
│   │   ├── useAuth.ts      ✅
│   │   ├── useDebounce.ts
│   │   ├── useLocalStorage.ts
│   │   └── useToast.ts
│   │
│   ├── types/
│   │   └── index.ts        ✅ All TypeScript types
│   │
│   └── utils/
│       ├── constants.ts    ✅
│       ├── helpers.ts      ✅
│       ├── validators.ts
│       └── formatters.ts
│
├── router/                  # Routing configuration
│   ├── index.tsx           # Main router setup
│   ├── routes.tsx          # Route definitions
│   └── guards.tsx          # Route guards (auth, admin)
│
├── App.tsx                  ✅
├── main.tsx                 ✅
└── index.css                ✅
```

---

## 📄 Features Breakdown

### 1. **Auth Feature** (`features/auth/`)

Everything authentication-related in one place.

#### Pages
- **LoginPage** - Email/password login form
- **RegisterPage** - User registration
- **VerifyOtpPage** - Email verification with OTP
- **ForgotPasswordPage** - Request password reset
- **ResetPasswordPage** - Set new password

#### Components
- **LoginForm** - Login form with validation
- **RegisterForm** - Registration form
- **OtpInput** - 5-digit OTP input
- **ProtectedRoute** - Route guard component

#### Hooks
- **useLogin** - Handle login logic
- **useRegister** - Handle registration
- **usePasswordReset** - Password reset logic

---

### 2. **Books Feature** (`features/books/`)

Everything related to browsing and managing books.

#### Pages
- **BookCatalogPage** - Browse all books with search/filter
- **BookDetailsPage** - Detailed view of a single book

#### Components
- **BookCard** - Individual book display card
- **BookList** - List view of books
- **BookGrid** - Grid view of books
- **BookDetails** - Detailed book information
- **BookFilters** - Filter by availability, author, etc.
- **BookSearch** - Search books by title/author
- **AddBookForm** - Admin form to add new books

#### Hooks
- **useBooks** - Fetch and manage books state
- **useBookSearch** - Search functionality with debounce
- **useBookFilters** - Filter logic

---

### 3. **Borrowing Feature** (`features/borrowing/`)

Everything related to borrowing and returning books.

#### Pages
- **MyBooksPage** - User's currently borrowed books
- **BorrowHistoryPage** - Complete borrowing history

#### Components
- **BorrowCard** - Single borrow record display
- **BorrowHistory** - Timeline of borrow activities
- **BorrowList** - List of borrowed books
- **ReturnBookModal** - Return book interface
- **OverdueAlert** - Alert for overdue books
- **FineCalculator** - Display fine calculations
- **BorrowStatus** - Status badge (borrowed, overdue, etc.)

#### Hooks
- **useBorrowedBooks** - Fetch user's borrowed books
- **useBorrowBook** - Handle borrowing a book
- **useReturnBook** - Handle returning a book

---

### 4. **Admin Feature** (`features/admin/`)

All admin-specific functionality.

#### Pages
- **AdminDashboard** - Overview with stats and charts
- **ManageBooksPage** - CRUD operations for books
- **ManageUsersPage** - View and manage all users
- **BorrowingRecordsPage** - All borrow/return transactions
- **CreateAdminPage** - Create new admin accounts

#### Components
- **AdminStats** - Statistics cards (total users, books, etc.)
- **RecentActivity** - Recent actions feed
- **BooksTable** - Books management table
- **UsersTable** - Users list table
- **BorrowingTable** - Borrowing records table
- **CreateAdminForm** - New admin form
- **AdminSidebar** - Admin navigation sidebar

#### Hooks
- **useAdminStats** - Fetch dashboard statistics
- **useManageBooks** - CRUD operations for books
- **useManageUsers** - User management operations

---

### 5. **User Feature** (`features/user/`)

User profile and personal dashboard.

#### Pages
- **UserDashboard** - User's personal dashboard
- **ProfilePage** - View/edit user profile

#### Components
- **UserStats** - User statistics (books borrowed, fines, etc.)
- **ProfileForm** - Edit profile information
- **PasswordChangeForm** - Change password
- **DashboardWidget** - Dashboard cards/widgets

#### Hooks
- **useUserProfile** - Fetch and update profile
- **useUserStats** - Fetch user statistics

---

## 🧩 Shared Components (`components/`)

### Layout Components (`components/layout/`)

Structural components that define the page structure.

#### Navbar
- Logo and branding
- Navigation links (role-based)
- User dropdown menu
- Notifications badge
- Search bar (optional)

#### Sidebar
- Collapsible sidebar for dashboard views
- Navigation menu items
- Active route highlighting
- User info at bottom

#### Layout
- Main wrapper component
- Combines Navbar, Sidebar (optional), content area, Footer
- Responsive layout handling

---

### UI Components (`components/ui/`)

Reusable, generic UI components used across features.

#### Button ✅
**Props:** `variant`, `size`, `loading`, `disabled`
- Multiple variants (primary, secondary, danger, success, outline)
- Loading state with spinner
- Full TypeScript support

#### Modal
**Props:** `isOpen`, `onClose`, `title`, `children`, `size`
- Backdrop overlay
- Close button and ESC key support
- Scrollable content
- Multiple sizes

#### Card
**Props:** `title`, `children`, `actions`, `className`
- Container with shadow and rounded corners
- Optional header and footer
- Hover effects

#### Badge
**Props:** `status`, `text`, `variant`
- Color-coded status indicators
- Available, Borrowed, Returned, Overdue, Pending

#### Table
**Props:** `columns`, `data`, `loading`, `onSort`, `pagination`
- Sortable columns
- Loading skeleton
- Pagination controls
- Row actions

#### Input
**Props:** `type`, `label`, `error`, `...inputProps`
- Styled input field
- Label and error message
- Validation states

---

## 🔐 Route Structure

```typescript
// Public routes
/                    - Home/Landing page
/login               - Login page
/register            - Register page
/verify-otp          - OTP verification
/forgot-password     - Forgot password
/reset-password/:token - Reset password

// User routes (Protected)
/dashboard           - User dashboard
/books               - Book catalog
/books/:id           - Book details
/my-books            - My borrowed books
/profile             - User profile

// Admin routes (Protected + Admin only)
/admin               - Admin dashboard
/admin/books         - Manage books
/admin/users         - Manage users
/admin/borrowing     - Borrowing records
/admin/create-admin  - Create admin

// Error routes
/unauthorized        - 403 page
*                    - 404 page
```

---

## 🎨 Benefits of Feature-Based Structure

### 1. **Co-location**
- All related code is in one place
- Easy to find and modify feature-specific code
- Reduced cognitive load

### 2. **Scalability**
- Easy to add new features without affecting others
- Clear boundaries between features
- Better team collaboration (different features = different developers)

### 3. **Maintainability**
- Features can be understood independently
- Easier to test features in isolation
- Simpler to refactor or remove features

### 4. **Code Organization**
- Clear separation of concerns
- Shared code is explicitly shared
- Feature-specific code stays in features

---

## 📦 Import Examples

### Importing from the same feature:
```typescript
// In features/books/pages/BookCatalogPage.tsx
import BookCard from '../components/BookCard';
import { useBooks } from '../hooks/useBooks';
```

### Importing shared utilities:
```typescript
// In any feature
import { useAuth } from '@/shared/hooks/useAuth';
import { Book, User } from '@/shared/types';
import { formatDate } from '@/shared/utils/helpers';
import Button from '@/components/ui/Button';
```

### Importing from another feature (avoid when possible):
```typescript
// If absolutely necessary
import { BookCard } from '@/features/books/components/BookCard';
```

---

## 🚀 Implementation Priority

### Phase 1: Foundation
1. Setup routing (`router/`)
2. Shared UI components (`components/ui/`)
3. Layout components (`components/layout/`)

### Phase 2: Authentication
1. Build `features/auth/` completely
2. Test login/register/OTP flow
3. Implement protected routes

### Phase 3: Books
1. Build `features/books/` 
2. Book catalog and details pages
3. Search and filter functionality

### Phase 4: User Features
1. Build `features/user/` dashboard
2. Build `features/borrowing/`
3. User profile management

### Phase 5: Admin Features
1. Build `features/admin/` dashboard
2. Admin management pages
3. Analytics and reports

---

## 🎯 Key Principles

1. **Feature Independence**: Each feature should be as self-contained as possible
2. **Shared by Default**: If used by 2+ features, move to `shared/`
3. **UI Components**: Generic, reusable components go in `components/ui/`
4. **Layout Components**: Structural components go in `components/layout/`
5. **Avoid Cross-Feature Imports**: Features shouldn't import from each other directly

---

This structure scales beautifully and keeps your codebase organized as it grows! 🚀
