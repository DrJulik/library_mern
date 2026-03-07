import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';
import {
  HomePage,
  PrivacyStatementPage,
  TermsOfUsePage,
  AccessibilityStatementPage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  VerifyOtpPage,
  ResetPasswordPage,
  UserDashboard,
  BookCatalogPage,
  BookDetailPage,
  MyBooksPage,
  ProfilePage,
  AdminDashboard,
  ManageBooksPage,
  ManageUsersPage,
  BorrowingRecordsPage,
  ManageHoldsPage,
  CreateAdminPage,
  NotFoundPage,
} from './pages';

const routes: RouteObject[] = [
  // Public routes (no auth required)
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/books',
    element: <BookCatalogPage />,
  },
  {
    path: '/books/:id',
    element: <BookDetailPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyStatementPage />,
  },
  {
    path: '/terms',
    element: <TermsOfUsePage />,
  },
  {
    path: '/accessibility',
    element: <AccessibilityStatementPage />,
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
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: '/verify-otp',
        element: <VerifyOtpPage />,
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
        path: 'holds',
        element: <ManageHoldsPage />,
      },
      {
        path: 'create-admin',
        element: <CreateAdminPage />,
      },
    ],
  },

  // Error routes
  {
    path: '*',
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}

export { router, routes };

