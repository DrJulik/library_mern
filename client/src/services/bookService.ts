import api from './api';
import { Book, CreateBookData, BooksResponse } from '../types';

interface SingleBookResponse {
  success: boolean;
  book: Book | null;
}

const bookService = {
  // Get all books
  getAllBooks: async (): Promise<BooksResponse> => {
    const response = await api.get<BooksResponse>('/v1/book/all');
    return response.data;
  },

  // Get a single book by ID
  getBookById: async (bookId: string): Promise<SingleBookResponse> => {
    // Since there's no single book endpoint, we fetch all and filter
    const response = await api.get<BooksResponse>('/v1/book/all');
    const book = response.data.books.find(b => b._id === bookId) || null;
    return {
      success: !!book,
      book,
    };
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
};

export default bookService;

