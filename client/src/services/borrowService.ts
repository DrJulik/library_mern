import api from './api';
import { BorrowRecord } from '../types';

interface BorrowResponse {
  success: boolean;
  borrowedBooks: BorrowRecord[];
}

interface BorrowActionResponse {
  success: boolean;
  message: string;
  borrow?: BorrowRecord;
}

const borrowService = {
  // Get user's borrowed books
  getMyBorrowedBooks: async (): Promise<BorrowResponse> => {
    const response = await api.get<BorrowResponse>('/v1/borrow/my-borrowed-books');
    return response.data;
  },

  // Get all borrowed books (admin only)
  getAllBorrowedBooks: async (): Promise<BorrowResponse> => {
    const response = await api.get<BorrowResponse>('/v1/borrow/borrowed-books-by-users');
    return response.data;
  },

  // Record borrowed book (admin only) - backend expects user email in body
  recordBorrowedBook: async (bookId: string, email: string): Promise<BorrowActionResponse> => {
    const response = await api.post<BorrowActionResponse>(`/v1/borrow/record-borrowed-book/${bookId}`, { email });
    return response.data;
  },

  // Record returned book (admin only) - backend expects user email in body
  recordReturnedBook: async (bookId: string, email: string): Promise<BorrowActionResponse> => {
    const response = await api.post<BorrowActionResponse>(`/v1/borrow/record-returned-book/${bookId}`, { email });
    return response.data;
  },
};

export default borrowService;

