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
    const response = await api.get<BorrowResponse>('/borrow/my-borrowed-books');
    return response.data;
  },

  // Get all borrowed books (admin only)
  getAllBorrowedBooks: async (): Promise<BorrowResponse> => {
    const response = await api.get<BorrowResponse>('/borrow/borrowed-books-by-users');
    return response.data;
  },

  // Record borrowed book (admin only)
  recordBorrowedBook: async (bookId: string, userId: string): Promise<BorrowActionResponse> => {
    const response = await api.post<BorrowActionResponse>(`/borrow/record-borrowed-book/${bookId}`, { userId });
    return response.data;
  },

  // Record returned book (admin only)
  recordReturnedBook: async (bookId: string, userId: string): Promise<BorrowActionResponse> => {
    const response = await api.post<BorrowActionResponse>(`/borrow/record-returned-book/${bookId}`, { userId });
    return response.data;
  },
};

export default borrowService;

