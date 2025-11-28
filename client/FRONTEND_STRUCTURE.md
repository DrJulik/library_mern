# Library Management System - Frontend Structure

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
- Users have avatars and borrowing history

---

## 🗂️ Recommended Folder Structure

```
src/
├── pages/                    # Page components
│   ├── auth/
│   │   ├── Login.jsx        # Login page
│   │   ├── Register.jsx     # Registration page
│   │   ├── VerifyOtp.jsx    # OTP verification page
│   │   ├── ForgotPassword.jsx
│   │   └── ResetPassword.jsx
│   │
│   ├── user/
│   │   ├── Dashboard.jsx    # User dashboard
│   │   ├── Profile.jsx      # User profile
│   │   ├── MyBooks.jsx      # User's borrowed books
│   │   └── BookCatalog.jsx  # Browse all books
│   │
│   ├── admin/
│   │   ├── AdminDashboard.jsx    # Admin overview
│   │   ├── ManageBooks.jsx       # Add/edit/delete books
│   │   ├── ManageUsers.jsx       # View all users
│   │   ├── BorrowingRecords.jsx  # All borrow/return records
│   │   └── CreateAdmin.jsx       # Create new admin
│   │
│   ├── Home.jsx             # Landing page
│   ├── NotFound.jsx         # 404 page
│   └── Unauthorized.jsx     # 403 page
│
├── components/
│   ├── layout/
│   │   ├── Navbar.jsx       # Main navigation
│   │   ├── Sidebar.jsx      # Admin/User sidebar
│   │   ├── Footer.jsx       # Footer component
│   │   └── Layout.jsx       # Main layout wrapper
│   │
│   ├── books/
│   │   ├── BookCard.jsx     # Individual book display card
│   │   ├── BookList.jsx     # Grid/list of books
│   │   ├── BookDetails.jsx  # Detailed book view modal
│   │   ├── AddBookForm.jsx  # Form to add new book (admin)
│   │   └── BookFilters.jsx  # Search/filter books
│   │
│   ├── borrow/
│   │   ├── BorrowHistory.jsx      # User's borrowing history
│   │   ├── BorrowCard.jsx         # Single borrow record card
│   │   ├── ReturnBookModal.jsx    # Return book interface
│   │   └── OverdueAlert.jsx       # Overdue notification
│   │
│   ├── users/
│   │   ├── UserTable.jsx    # Admin view of all users
│   │   ├── UserCard.jsx     # User information card
│   │   └── UserStats.jsx    # User statistics
│   │
│   ├── common/
│   │   ├── Button.jsx       # Reusable button component
│   │   ├── Input.jsx        # Form input component
│   │   ├── Modal.jsx        # Modal wrapper
│   │   ├── Card.jsx         # Card wrapper
│   │   ├── Table.jsx        # Table component
│   │   ├── Badge.jsx        # Status badges
│   │   ├── Loader.jsx       # Loading spinner
│   │   ├── Alert.jsx        # Alert/notification
│   │   └── SearchBar.jsx    # Search component
│   │
│   └── auth/
│       ├── ProtectedRoute.jsx    # Route guard
│       ├── AdminRoute.jsx        # Admin-only route guard
│       └── AuthGuard.jsx         # General auth guard
│
├── context/
│   ├── AuthContext.jsx      # Authentication state
│   ├── BookContext.jsx      # Books state management
│   └── NotificationContext.jsx  # Notifications
│
├── hooks/
│   ├── useAuth.js           # Authentication hook
│   ├── useBooks.js          # Books CRUD hook
│   ├── useBorrow.js         # Borrowing operations hook
│   └── useDebounce.js       # Debounce for search
│
├── services/
│   ├── api.js               # Axios instance & interceptors
│   ├── authService.js       # Auth API calls
│   ├── bookService.js       # Book API calls
│   ├── borrowService.js     # Borrow API calls
│   └── userService.js       # User API calls
│
├── utils/
│   ├── constants.js         # App constants
│   ├── helpers.js           # Helper functions
│   ├── validators.js        # Form validation
│   └── dateFormatter.js     # Date formatting utilities
│
├── App.jsx                  # Main app component with routes
├── main.jsx                 # Entry point
└── index.css                # Global styles with Tailwind
```

---

## 📄 Pages Breakdown

### 1. **Public Pages**

#### Home Page (`Home.jsx`)
- Landing page with app overview
- Features showcase
- Call-to-action (Register/Login)
- Quick stats (total books, active users, etc.)

#### Login (`Login.jsx`)
- Email & password form
- Link to register
- Link to forgot password
- "Remember me" checkbox

#### Register (`Register.jsx`)
- Name, email, password fields
- Password strength indicator
- Terms & conditions checkbox
- Redirect to OTP verification

#### Verify OTP (`VerifyOtp.jsx`)
- 5-digit OTP input
- Resend OTP option
- Timer for OTP expiry

#### Forgot Password (`ForgotPassword.jsx`)
- Email input to receive reset link

#### Reset Password (`ResetPassword.jsx`)
- New password form with confirmation
- Token validation

---

### 2. **User Pages**

#### User Dashboard (`user/Dashboard.jsx`)
**Features:**
- Welcome message with user name
- Quick stats cards:
  - Currently borrowed books count
  - Books due soon
  - Total books borrowed
  - Fines owed (if any)
- Recent borrowing activity
- Quick access to catalog
- Overdue books alert (if any)

#### Book Catalog (`user/BookCatalog.jsx`)
**Features:**
- Grid/list view of all available books
- Search by title/author
- Filter by availability
- Sort by title, author, price
- Book cards with:
  - Book cover (placeholder)
  - Title, author, description
  - Price, quantity available
  - "Borrow" button (if available)
- Pagination

#### My Books (`user/MyBooks.jsx`)
**Features:**
- List of currently borrowed books
- Show borrowed date and due date
- Days remaining indicator
- Overdue warning
- Fine amount (if overdue)
- Filter: Active, Returned, Overdue
- Book return status

#### User Profile (`user/Profile.jsx`)
**Features:**
- View/edit profile information
- Avatar upload
- Change password option
- Borrowing statistics
- Account settings

---

### 3. **Admin Pages**

#### Admin Dashboard (`admin/AdminDashboard.jsx`)
**Features:**
- Overview statistics:
  - Total users
  - Total books
  - Currently borrowed books
  - Overdue books count
  - Total fines collected
- Recent activities chart
- Quick actions (add book, view users)
- Alerts for overdue books
- Recent registrations

#### Manage Books (`admin/ManageBooks.jsx`)
**Features:**
- Table of all books with:
  - Title, author, quantity, price, availability
  - Edit/Delete actions
- "Add New Book" button
- Search and filter
- Bulk actions (future: bulk delete)
- Export to CSV (future)

#### Borrowing Records (`admin/BorrowingRecords.jsx`)
**Features:**
- Table of all borrow transactions:
  - User name/email
  - Book title
  - Borrowed date, due date, return date
  - Status (pending, borrowed, returned, overdue)
  - Fine amount
- Filter by status
- Search by user or book
- "Mark as Returned" action
- Record new borrow transaction
- Export records

#### Manage Users (`admin/ManageUsers.jsx`)
**Features:**
- Table of all registered users:
  - Name, email, role
  - Account verified status
  - Number of borrowed books
  - Registration date
- Search users
- View user details modal
- Option to create new admin

#### Create Admin (`admin/CreateAdmin.jsx`)
**Features:**
- Form to register new admin
- Name, email, password fields
- Confirmation modal

---

## 🧩 Key Components Breakdown

### Layout Components

#### Navbar (`layout/Navbar.jsx`)
- Logo
- Navigation links (changes based on role)
- User dropdown menu (profile, logout)
- Notifications icon with badge
- Search bar (optional)

#### Sidebar (`layout/Sidebar.jsx`)
- Collapsible sidebar for dashboard
- Navigation menu items
- User info at bottom
- Active route highlighting

---

### Book Components

#### BookCard (`books/BookCard.jsx`)
**Props:** `book`, `onBorrow`, `showActions`
- Book thumbnail
- Title, author
- Price, availability badge
- Quick view button
- Borrow/Edit/Delete actions (role-based)

#### BookList (`books/BookList.jsx`)
**Props:** `books`, `loading`, `viewMode`
- Renders multiple BookCards
- Grid or list view
- Loading skeleton
- Empty state

#### BookDetails (`books/BookDetails.jsx`)
**Props:** `book`, `isOpen`, `onClose`
- Modal with full book details
- All book information
- Borrow button
- Close button

#### AddBookForm (`books/AddBookForm.jsx`)
**Props:** `onSubmit`, `initialData`, `isEditing`
- Form fields: title, author, description, price, quantity
- Validation
- Submit/Cancel buttons

---

### Borrow Components

#### BorrowHistory (`borrow/BorrowHistory.jsx`)
**Props:** `userId`
- Timeline of borrow activities
- Borrowed date, due date, return date
- Status badges
- Fine information

#### BorrowCard (`borrow/BorrowCard.jsx`)
**Props:** `borrowRecord`
- Book title and details
- Borrowed/due dates
- Days remaining or overdue
- Status badge
- Fine amount (if overdue)
- Return button (if applicable)

#### OverdueAlert (`borrow/OverdueAlert.jsx`)
**Props:** `overdueBooks`
- Alert banner for overdue books
- List of overdue books
- Total fine amount
- Action button

---

### User Components

#### UserTable (`users/UserTable.jsx`)
**Props:** `users`, `onViewUser`
- Sortable table
- Search functionality
- Pagination
- Row actions (view, edit)

#### UserStats (`users/UserStats.jsx`)
**Props:** `userId`
- Statistics cards
- Borrowing history chart
- Activity timeline

---

### Common Components

#### Button (`common/Button.jsx`)
**Props:** `variant`, `size`, `loading`, `disabled`, `onClick`, `children`
- Variants: primary, secondary, danger, success
- Sizes: sm, md, lg
- Loading state with spinner

#### Modal (`common/Modal.jsx`)
**Props:** `isOpen`, `onClose`, `title`, `children`, `size`
- Backdrop overlay
- Close button
- Header, body, footer sections
- Animation

#### Badge (`common/Badge.jsx`)
**Props:** `status`, `text`
- Color-coded status badges
- Available, Borrowed, Returned, Overdue, Pending

#### Table (`common/Table.jsx`)
**Props:** `columns`, `data`, `loading`, `pagination`
- Sortable columns
- Loading skeleton
- Pagination controls
- Empty state

---

## 🔐 Route Structure

```jsx
// Public routes
/ - Home
/login - Login
/register - Register
/verify-otp - OTP Verification
/forgot-password - Forgot Password
/reset-password/:token - Reset Password

// User routes (Protected)
/dashboard - User Dashboard
/books - Book Catalog
/my-books - My Borrowed Books
/profile - User Profile

// Admin routes (Protected + Admin only)
/admin/dashboard - Admin Dashboard
/admin/books - Manage Books
/admin/users - Manage Users
/admin/borrowing - Borrowing Records
/admin/create-admin - Create Admin

// Error routes
/unauthorized - 403 Page
* - 404 Page
```

---

## 🎨 Design Considerations

### Color Scheme (using Tailwind)
- **Primary:** Blue (sky-500, blue-600)
- **Success:** Green (emerald-500)
- **Warning:** Amber (amber-500)
- **Danger:** Red (red-500)
- **Info:** Cyan (cyan-500)

### Status Colors
- Available: Green
- Borrowed: Blue
- Returned: Gray
- Overdue: Red
- Pending: Yellow

### Key UI Elements
- Cards with hover effects
- Smooth transitions
- Loading skeletons
- Toast notifications
- Confirmation modals for destructive actions
- Responsive tables
- Mobile-friendly navigation

---

## 🚀 Priority Implementation Order

### Phase 1: Authentication & Core Layout
1. Setup routing with React Router
2. Create AuthContext and API services
3. Build Login & Register pages
4. OTP Verification
5. Navbar & Layout components
6. Protected routes

### Phase 2: Book Catalog (Public/User)
1. Book API integration
2. BookCard & BookList components
3. Book Catalog page
4. Search and filter functionality
5. BookDetails modal

### Phase 3: User Features
1. User Dashboard
2. Borrow functionality
3. My Books page
4. BorrowHistory component
5. User Profile

### Phase 4: Admin Features
1. Admin Dashboard
2. Manage Books (CRUD)
3. Borrowing Records management
4. User management
5. Create Admin functionality

### Phase 5: Polish & Enhancement
1. Notifications system
2. Fine calculation display
3. Advanced filters and search
4. Charts and analytics
5. Mobile responsiveness
6. Error handling and validation
7. Loading states and skeletons

---

## 📦 Additional Libraries to Consider

```json
{
  "react-router-dom": "^6.x", // ✅ Already added - Routing
  "axios": "^1.x",           // ✅ Already added - API calls
  "react-hot-toast": "^2.x",  // Toast notifications
  "react-icons": "^5.x",      // Icons
  "date-fns": "^3.x",         // Date formatting
  "formik": "^2.x",           // Form handling (optional)
  "yup": "^1.x",              // Form validation (optional)
  "recharts": "^2.x",         // Charts for dashboard (optional)
  "react-table": "^8.x"       // Advanced tables (optional)
}
```

---

This structure gives you a complete, professional library management application with all the features your backend supports!

