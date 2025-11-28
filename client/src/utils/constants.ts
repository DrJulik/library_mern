// User roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
} as const;

// Borrow status
export const BORROW_STATUS = {
  PENDING: 'pending',
  BORROWED: 'borrowed',
  RETURNED: 'returned',
  OVERDUE: 'overdue',
} as const;

// Status colors for badges
export const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  borrowed: 'bg-blue-100 text-blue-800',
  returned: 'bg-gray-100 text-gray-800',
  overdue: 'bg-red-100 text-red-800',
  available: 'bg-green-100 text-green-800',
};

// API endpoints
export const API_ROUTES = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    VERIFY_OTP: '/auth/verify-otp',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/password/forgot',
    RESET_PASSWORD: '/auth/password/reset',
    UPDATE_PASSWORD: '/auth/password/update',
  },
  BOOKS: {
    ALL: '/books/all',
    ADD: '/books/add',
    DELETE: '/books/delete',
  },
  BORROW: {
    MY_BOOKS: '/borrow/my-borrowed-books',
    ALL_RECORDS: '/borrow/borrowed-books-by-users',
    RECORD_BORROW: '/borrow/record-borrowed-book',
    RECORD_RETURN: '/borrow/record-returned-book',
  },
  USERS: {
    ALL: '/users/all',
    ADD_ADMIN: '/users/add/admin',
  },
} as const;

// Form validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: {
    MIN_LENGTH: 6,
    MAX_LENGTH: 12,
  },
  OTP: {
    LENGTH: 5,
  },
} as const;

// Date format
export const DATE_FORMAT = 'MMM dd, yyyy';
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm';

