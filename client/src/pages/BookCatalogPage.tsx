import { useEffect, useState, useMemo } from 'react';
import Layout from '@/layouts/Layout';
import { BookGrid } from '@/components/books';
import {
  useBooksStore,
  selectBooks,
  selectBooksLoading,
  selectBooksError,
  selectSearchQuery,
  selectFilters,
} from '@/store/useBooksStore';

const BOOKS_PER_PAGE = 12;

function filterBooks(
  books: ReturnType<typeof selectBooks>,
  searchQuery: string,
  filters: ReturnType<typeof selectFilters>
) {
  let filtered = books;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(
      (b) =>
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.genre && b.genre.toLowerCase().includes(q)) ||
        (b.description && b.description.toLowerCase().includes(q))
    );
  }
  if (filters.available !== undefined) {
    filtered = filtered.filter((b) => b.available === filters.available);
  }
  if (filters.author) {
    filtered = filtered.filter((b) => b.author === filters.author);
  }
  if (filters.genre) {
    filtered = filtered.filter((b) => b.genre === filters.genre);
  }
  if (filters.language) {
    filtered = filtered.filter((b) => b.language === filters.language);
  }
  return filtered;
}

export default function BookCatalogPage() {
  const fetchBooks = useBooksStore((s) => s.fetchBooks);
  const setSearchQuery = useBooksStore((s) => s.setSearchQuery);
  const setFilters = useBooksStore((s) => s.setFilters);
  const clearFilters = useBooksStore((s) => s.clearFilters);

  const allBooks = useBooksStore(selectBooks);
  const searchQuery = useBooksStore(selectSearchQuery);
  const filters = useBooksStore(selectFilters);
  const books = useMemo(
    () => filterBooks(allBooks, searchQuery, filters),
    [allBooks, searchQuery, filters]
  );

  const isLoading = useBooksStore(selectBooksLoading);
  const error = useBooksStore(selectBooksError);
  const authors = useMemo(() => {
    const set = new Set(allBooks.map((b) => b.author).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allBooks]);
  const genres = useMemo(() => {
    const set = new Set(allBooks.map((b) => b.genre).filter(Boolean));
    return Array.from(set).sort((a, b) => (a as string).localeCompare(b as string));
  }, [allBooks]);
  const languages = useMemo(() => {
    const set = new Set(allBooks.map((b) => b.language).filter(Boolean));
    return Array.from(set).sort((a, b) => (a as string).localeCompare(b as string));
  }, [allBooks]);

  const [searchInput, setSearchInput] = useState(() => useBooksStore.getState().searchQuery);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filters.available, filters.author, filters.genre, filters.language]);

  const totalPages = Math.max(1, Math.ceil(books.length / BOOKS_PER_PAGE));
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = books.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  const hasActiveFilters = searchQuery || filters.available !== undefined || filters.author || filters.genre || filters.language;
  const handleSearch = () => setSearchQuery(searchInput.trim());
  const handleClear = () => {
    setSearchInput('');
    clearFilters();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Book Catalog</h1>

        {/* Filter bar */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex flex-wrap items-end gap-4">
            <div className="flex-1 min-w-[200px]">
              <label htmlFor="catalog-search" className="block text-sm font-medium text-gray-700 mb-1">
                Search by title or author
              </label>
              <div className="flex gap-2">
                <input
                  id="catalog-search"
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Type keywords..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-library-500 focus:border-library-500"
                />
                <button
                  type="button"
                  onClick={handleSearch}
                  className="px-4 py-2 bg-library-600 text-white rounded-md hover:bg-library-700 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
            <div>
              <label htmlFor="filter-availability" className="block text-sm font-medium text-gray-700 mb-1">
                Availability
              </label>
              <select
                id="filter-availability"
                value={filters.available === undefined ? '' : String(filters.available)}
                onChange={(e) => {
                  const v = e.target.value;
                  setFilters({ available: v === '' ? undefined : v === 'true' });
                }}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white focus:ring-2 focus:ring-library-500 focus:border-library-500"
              >
                <option value="">All</option>
                <option value="true">Available</option>
                <option value="false">Checked out</option>
              </select>
            </div>
            <div>
              <label htmlFor="filter-author" className="block text-sm font-medium text-gray-700 mb-1">
                Author
              </label>
              <select
                id="filter-author"
                value={filters.author ?? ''}
                onChange={(e) => setFilters({ author: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[160px] focus:ring-2 focus:ring-library-500 focus:border-library-500"
              >
                <option value="">All authors</option>
                {authors.map((author) => (
                  <option key={author} value={author}>
                    {author}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-genre" className="block text-sm font-medium text-gray-700 mb-1">
                Genre
              </label>
              <select
                id="filter-genre"
                value={filters.genre ?? ''}
                onChange={(e) => setFilters({ genre: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[140px] focus:ring-2 focus:ring-library-500 focus:border-library-500"
              >
                <option value="">All genres</option>
                {genres.map((genre) => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="filter-language" className="block text-sm font-medium text-gray-700 mb-1">
                Language
              </label>
              <select
                id="filter-language"
                value={filters.language ?? ''}
                onChange={(e) => setFilters({ language: e.target.value || undefined })}
                className="px-3 py-2 border border-gray-300 rounded-md bg-white min-w-[140px] focus:ring-2 focus:ring-library-500 focus:border-library-500"
              >
                <option value="">All languages</option>
                {languages.map((lang) => (
                  <option key={lang} value={lang}>
                    {lang}
                  </option>
                ))}
              </select>
            </div>
            {hasActiveFilters && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Clear filters
              </button>
            )}
          </div>
          {hasActiveFilters && (
            <p className="mt-3 text-sm text-gray-600">
              Showing {books.length} result{books.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">{error}</div>}
        {isLoading && books.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-library-600" />
          </div>
        ) : (
          <>
            <BookGrid
              books={paginatedBooks}
              title="All books"
              viewAllLink="/books"
              columns={6}
              emptyMessage={hasActiveFilters ? 'No books match your filters. Try changing or clearing them.' : 'No books in the catalog.'}
            />
            {books.length > BOOKS_PER_PAGE && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Showing {startIndex + 1}–{Math.min(startIndex + BOOKS_PER_PAGE, books.length)} of {books.length} books
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <span className="px-3 py-2 text-sm text-gray-600 min-w-[100px] text-center">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}

