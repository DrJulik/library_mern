import api from './api';
import { Book, CreateBookData, BooksResponse } from '../types';

interface SingleBookResponse {
  success: boolean;
  book: Book | null;
}

const bookService = {
  // Get all books from MERN API (so book._id is MongoDB id for hold/borrow)
  getAllBooks: async (): Promise<BooksResponse> => {
    const response = await api.get<{ success: boolean; books: Book[] }>('/v1/book/all');
    const books = response.data?.books ?? [];
    return { success: true, books };
  },

  // Get a single book by ID from MERN API (so book._id is MongoDB id for hold/borrow)
  getBookById: async (bookId: string): Promise<SingleBookResponse> => {
    try {
      const response = await api.get<{ success: boolean; book: Book }>(`/v1/book/${bookId}`);
      const book = response.data?.book ?? null;
      return { success: !!book, book };
    } catch {
      return { success: false, book: null };
    }
  },

  // Add book (admin only)
  addBook: async (bookData: CreateBookData): Promise<{ success: boolean; message: string; book: Book }> => {
    const response = await api.post('/v1/book/add', bookData);
    return response.data;
  },

  // Delete book (admin only)
  deleteBook: async (bookId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/v1/book/delete/${bookId}`);
    return response.data;
  },

  // Bulk upload books (admin only)
  bulkUploadBooks: async (
    books: Array<{
      title: string;
      author: string;
      description: string;
      price: number;
      quantity: number;
      genre?: string;
      language?: string;
      yearPublished?: number;
      imageLink?: string;
      isbn?: string;
      publisher?: string;
      pages?: number;
      slug?: string;
      subtitle?: string;
    }>
  ): Promise<{ success: boolean; message: string; created: number }> => {
    const response = await api.post('/v1/book/bulk', { books });
    return response.data;
  },
};

export default bookService;

