/**
 * Route to page title mapping
 * Used by Layout component to automatically set page titles
 */
export const routeTitles: Record<string, string> = {
  '/': 'Home',
  '/login': 'Login',
  '/register': 'Register',
  '/verify-otp': 'Verify OTP',
  '/forgot-password': 'Forgot Password',
  '/reset-password': 'Reset Password',
  '/dashboard': 'Dashboard',
  '/books': 'Book Catalog',
  '/my-books': 'My Books',
  '/profile': 'Profile',
  '/admin': 'Admin Dashboard',
  '/admin/books': 'Manage Books',
  '/admin/users': 'Manage Users',
  '/admin/borrowing': 'Borrowing Records',
  '/admin/create-admin': 'Create Admin',
  '/unauthorized': 'Access Denied',
};

/**
 * Get page title for a given pathname
 * Handles dynamic routes (e.g., /reset-password/:token)
 */
export function getPageTitle(pathname: string): string {
  // Check exact match first
  if (routeTitles[pathname]) {
    return routeTitles[pathname];
  }

  // Handle dynamic routes
  if (pathname.startsWith('/reset-password/')) {
    return 'Reset Password';
  }

  // Default to 404 if no match found (for catch-all routes)
  if (pathname !== '/') {
    return 'Page Not Found';
  }

  return 'Library Management System';
}

