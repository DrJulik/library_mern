// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  accountVerified: boolean;
  borrowedBooks: BorrowedBook[];
  createdAt: string;
  updatedAt: string;
}

export interface BorrowedBook {
  bookId: string;
  returned: boolean;
  bookTitle: string;
  borrowedDate: string;
  dueDate: string;
}

// Book types
export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  price: number;
  quantity: number;
  available: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBookData {
  title: string;
  author: string;
  description: string;
  price: number;
  quantity: number;
}

// Borrow types
export interface BorrowRecord {
  _id: string;
  user: string | User;
  book: string | Book;
  borrowedDate: string;
  dueDate: string;
  returnDate: string | null;
  fine: number;
  notified: boolean;
  status: 'pending' | 'borrowed' | 'returned' | 'overdue';
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user?: User;
  token?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface BooksResponse {
  success: boolean;
  books: Book[];
}

export interface UsersResponse {
  success: boolean;
  users: User[];
}

export interface BorrowResponse {
  success: boolean;
  borrowedBooks: BorrowRecord[];
}

// Component prop types
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface BadgeProps {
  status: 'pending' | 'borrowed' | 'returned' | 'overdue' | 'available';
  text?: string;
  className?: string;
}

// Context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<AuthResponse>;
  checkAuth: () => Promise<void>;
}

