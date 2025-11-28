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

// API endpoints (v1)
export const API_ROUTES = {
  AUTH: {
    REGISTER: '/v1/auth/register',
    LOGIN: '/v1/auth/login',
    LOGOUT: '/v1/auth/logout',
    VERIFY_OTP: '/v1/auth/verify-otp',
    ME: '/v1/auth/me',
    FORGOT_PASSWORD: '/v1/auth/password/forgot',
    RESET_PASSWORD: '/v1/auth/password/reset',
    UPDATE_PASSWORD: '/v1/auth/password/update',
  },
  BOOKS: {
    ALL: '/v1/book/all',
    ADD: '/v1/book/add',
    DELETE: '/v1/book/delete',
  },
  BORROW: {
    MY_BOOKS: '/v1/borrow/my-borrowed-books',
    ALL_RECORDS: '/v1/borrow/borrowed-books-by-users',
    RECORD_BORROW: '/v1/borrow/record-borrowed-book',
    RECORD_RETURN: '/v1/borrow/record-returned-book',
  },
  USERS: {
    ALL: '/v1/user/all',
    ADD_ADMIN: '/v1/user/add/admin',
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

