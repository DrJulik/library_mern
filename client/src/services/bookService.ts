import axios from 'axios';
import api from './api';
import { Book, CreateBookData, BooksResponse } from '../types';

const JSON_SERVER_URL = import.meta.env.VITE_JSON_SERVER_URL || 'http://localhost:3004';

interface JsonServerBook {
  id?: number;
  author?: string;
  country?: string;
  imageLink?: string;
  language?: string;
  link?: string;
  pages?: number;
  title?: string;
  year?: number;
  [key: string]: unknown;
}

function mapJsonBookToAppBook(raw: JsonServerBook, index: number): Book {
  const id = raw.id ?? index + 1;
  const now = new Date().toISOString();
  const description =
    typeof raw.description === 'string'
      ? raw.description
      : `${raw.pages ?? 0} pages. ${raw.language ?? ''}. ${raw.country ?? ''}.`;
  const imageLink =
    typeof raw.imageLink === 'string' && raw.imageLink
      ? raw.imageLink.startsWith('/') || raw.imageLink.startsWith('http')
        ? raw.imageLink
        : `/${raw.imageLink.replace(/^\//, '')}`
      : undefined;

  return {
    _id: String(id),
    title: raw.title ?? '',
    author: raw.author ?? '',
    description,
    price: typeof raw.price === 'number' ? raw.price : 0,
    quantity: typeof raw.quantity === 'number' ? raw.quantity : 1,
    available: raw.available !== false,
    createdAt: now,
    updatedAt: now,
    imageLink,
  };
}

interface SingleBookResponse {
  success: boolean;
  book: Book | null;
}

const bookService = {
  // Get all books from JSON Server
  getAllBooks: async (): Promise<BooksResponse> => {
    const response = await axios.get<JsonServerBook[]>(`${JSON_SERVER_URL}/books`);
    const list = Array.isArray(response.data) ? response.data : [];
    const books = list.map(mapJsonBookToAppBook);
    return { success: true, books };
  },

  // Get a single book by ID from JSON Server
  getBookById: async (bookId: string): Promise<SingleBookResponse> => {
    try {
      const response = await axios.get<JsonServerBook>(`${JSON_SERVER_URL}/books/${bookId}`);
      const book = response.data ? mapJsonBookToAppBook(response.data, Number(bookId) || 0) : null;
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
};

export default bookService;

