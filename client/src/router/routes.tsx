import { RouteObject } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminRoute from './AdminRoute';
import PublicRoute from './PublicRoute';

// Placeholder components (you'll replace these with actual components)
const HomePage = () => <div className="p-8"><h1 className="text-3xl font-bold">Welcome to Library Management System</h1></div>;
const LoginPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Login Page</h1></div>;
const RegisterPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Register Page</h1></div>;
const VerifyOtpPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Verify OTP</h1></div>;
const ForgotPasswordPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Forgot Password</h1></div>;
const ResetPasswordPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Reset Password</h1></div>;

// User pages (protected)
const UserDashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">User Dashboard</h1></div>;
const BookCatalogPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Book Catalog</h1></div>;
const MyBooksPage = () => <div className="p-8"><h1 className="text-3xl font-bold">My Books</h1></div>;
const ProfilePage = () => <div className="p-8"><h1 className="text-3xl font-bold">Profile</h1></div>;

// Admin pages (protected + admin only)
const AdminDashboard = () => <div className="p-8"><h1 className="text-3xl font-bold">Admin Dashboard</h1></div>;
const ManageBooksPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Manage Books</h1></div>;
const ManageUsersPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Manage Users</h1></div>;
const BorrowingRecordsPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Borrowing Records</h1></div>;
const CreateAdminPage = () => <div className="p-8"><h1 className="text-3xl font-bold">Create Admin</h1></div>;

// Error pages
const NotFoundPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-4">Page not found</p>
      <a href="/" className="text-primary-600 hover:text-primary-700">Go back home</a>
    </div>
  </div>
);

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-6xl font-bold text-gray-900 mb-4">403</h1>
      <p className="text-xl text-gray-600 mb-4">Access Denied</p>
      <p className="text-gray-500 mb-4">You don't have permission to access this page</p>
      <a href="/dashboard" className="text-primary-600 hover:text-primary-700">Go to dashboard</a>
    </div>
  </div>
);

export const routes: RouteObject[] = [
  // Public routes
  {
    path: '/',
    element: <HomePage />,
  },
  {
    element: <PublicRoute />,
    children: [
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/verify-otp',
        element: <VerifyOtpPage />,
      },
      {
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/reset-password/:token',
        element: <ResetPasswordPage />,
      },
    ],
  },

  // Protected user routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/dashboard',
        element: <UserDashboard />,
      },
      {
        path: '/books',
        element: <BookCatalogPage />,
      },
      {
        path: '/my-books',
        element: <MyBooksPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
    ],
  },

  // Protected admin routes
  {
    path: '/admin',
    element: <AdminRoute />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'books',
        element: <ManageBooksPage />,
      },
      {
        path: 'users',
        element: <ManageUsersPage />,
      },
      {
        path: 'borrowing',
        element: <BorrowingRecordsPage />,
      },
      {
        path: 'create-admin',
        element: <CreateAdminPage />,
      },
    ],
  },

  // Error routes
  {
    path: '/unauthorized',
    element: <UnauthorizedPage />,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

