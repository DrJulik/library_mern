import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import bookService from '@/shared/api/bookService';
import { Book, CreateBookData } from '@/shared/types';

interface BooksState {
  books: Book[];
  selectedBook: Book | null;
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  filters: {
    available?: boolean;
    author?: string;
  };
}

interface BooksActions {
  fetchBooks: () => Promise<void>;
  addBook: (bookData: CreateBookData) => Promise<void>;
  deleteBook: (bookId: string) => Promise<void>;
  setSelectedBook: (book: Book | null) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<BooksState['filters']>) => void;
  clearFilters: () => void;
}

type BooksStore = BooksState & BooksActions;

export const useBooksStore = create<BooksStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      books: [],
      selectedBook: null,
      isLoading: false,
      error: null,
      searchQuery: '',
      filters: {},

      // Actions
      fetchBooks: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await bookService.getAllBooks();
          
          if (response.success) {
            set({ books: response.books, isLoading: false });
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to fetch books',
            isLoading: false,
          });
        }
      },

      addBook: async (bookData: CreateBookData) => {
        try {
          set({ isLoading: true, error: null });
          const response = await bookService.addBook(bookData);
          
          if (response.success && response.book) {
            set((state) => ({
              books: [...state.books, response.book],
              isLoading: false,
            }));
          }
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to add book',
            isLoading: false,
          });
          throw error;
        }
      },

      deleteBook: async (bookId: string) => {
        try {
          set({ isLoading: true, error: null });
          await bookService.deleteBook(bookId);
          
          set((state) => ({
            books: state.books.filter((book) => book._id !== bookId),
            isLoading: false,
          }));
        } catch (error: any) {
          set({
            error: error.response?.data?.message || 'Failed to delete book',
            isLoading: false,
          });
          throw error;
        }
      },

      setSelectedBook: (book: Book | null) => set({ selectedBook: book }),

      setSearchQuery: (query: string) => set({ searchQuery: query }),

      setFilters: (filters: Partial<BooksState['filters']>) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      clearFilters: () => set({ filters: {}, searchQuery: '' }),
    }),
    { name: 'BooksStore' }
  )
);

// Selectors
export const selectBooks = (state: BooksStore) => state.books;
export const selectFilteredBooks = (state: BooksStore) => {
  let filtered = state.books;

  // Apply search query
  if (state.searchQuery) {
    const query = state.searchQuery.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query)
    );
  }

  // Apply filters
  if (state.filters.available !== undefined) {
    filtered = filtered.filter((book) => book.available === state.filters.available);
  }

  if (state.filters.author) {
    filtered = filtered.filter((book) => book.author === state.filters.author);
  }

  return filtered;
};

export const selectSelectedBook = (state: BooksStore) => state.selectedBook;
export const selectBooksLoading = (state: BooksStore) => state.isLoading;
export const selectBooksError = (state: BooksStore) => state.error;

