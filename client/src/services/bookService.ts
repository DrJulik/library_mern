import api from './api';
import { Book, CreateBookData, BooksResponse } from '../types';

const bookService = {
  // Get all books
  getAllBooks: async (): Promise<BooksResponse> => {
    const response = await api.get<BooksResponse>('/books/all');
    return response.data;
  },

  // Add book (admin only)
  addBook: async (bookData: CreateBookData): Promise<{ success: boolean; message: string; book: Book }> => {
    const response = await api.post('/books/add', bookData);
    return response.data;
  },

  // Delete book (admin only)
  deleteBook: async (bookId: string): Promise<{ success: boolean; message: string }> => {
    const response = await api.delete(`/books/delete/${bookId}`);
    return response.data;
  },
};

export default bookService;

