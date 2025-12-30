import { createBrowserRouter, RouterProvider, RouteObject } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';
import {
  HomePage,
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  UserDashboard,
  BookCatalogPage,
  MyBooksPage,
  ProfilePage,
  AdminDashboard,
  ManageBooksPage,
  ManageUsersPage,
  BorrowingRecordsPage,
  CreateAdminPage,
  NotFoundPage,
} from './pages';

const routes: RouteObject[] = [
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
        path: '/forgot-password',
        element: <ForgotPasswordPage />,
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
    path: '*',
    element: <NotFoundPage />,
  },
];

const router = createBrowserRouter(routes);

export default function Router() {
  return <RouterProvider router={router} />;
}

export { router, routes };

