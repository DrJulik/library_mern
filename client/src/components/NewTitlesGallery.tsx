import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { BookCard } from '@/components/books';

const BOOKS_PER_PAGE = 20;

type AvailabilityFilter = '' | 'available' | 'unavailable';
type SortOption = 'newest' | 'title' | 'author' | 'price' | 'year';

interface NewTitlesGalleryProps {
  books?: Book[];
  onPlaceHold?: (book: Book) => void;
  loadingBookIds?: string[];
  loading?: boolean;
  error?: string | null;
}

export default function NewTitlesGallery({
  books = [],
  onPlaceHold: _onPlaceHold,
  loadingBookIds: _loadingBookIds = [],
  loading = false,
  error = null,
}: NewTitlesGalleryProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [authorFilter, setAuthorFilter] = useState('');
  const [genreFilter, setGenreFilter] = useState('');
  const [languageFilter, setLanguageFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState<AvailabilityFilter>('');
  const [sortBy, setSortBy] = useState<SortOption>('newest');

  const placeholderBooks: Book[] = Array.from({ length: 10 }, (_, i) => ({
    _id: `book-${i}`,
    title: `Book ${i + 1}`,
    author: 'Author Name',
    description: 'A wonderful book waiting to be discovered.',
    price: 0,
    quantity: 1,
    available: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  const sourceBooks = books.length > 0 ? books : placeholderBooks;

  const uniqueAuthors = useMemo(() => {
    const authors = new Set(sourceBooks.map((b) => b.author.trim()).filter(Boolean));
    return Array.from(authors).sort((a, b) => a.localeCompare(b));
  }, [sourceBooks]);

  const uniqueGenres = useMemo(() => {
    const genres = new Set(sourceBooks.map((b) => b.genre?.trim()).filter(Boolean) as string[]);
    return Array.from(genres).sort((a, b) => a.localeCompare(b));
  }, [sourceBooks]);

  const uniqueLanguages = useMemo(() => {
    const langs = new Set(sourceBooks.map((b) => b.language?.trim()).filter(Boolean) as string[]);
    return Array.from(langs).sort((a, b) => a.localeCompare(b));
  }, [sourceBooks]);

  const filteredAndSortedBooks = useMemo(() => {
    let list = [...sourceBooks];
    if (authorFilter) {
      list = list.filter((b) => b.author.trim() === authorFilter);
    }
    if (genreFilter) {
      list = list.filter((b) => b.genre?.trim() === genreFilter);
    }
    if (languageFilter) {
      list = list.filter((b) => b.language?.trim() === languageFilter);
    }
    if (availabilityFilter === 'available') {
      list = list.filter((b) => b.available);
    } else if (availabilityFilter === 'unavailable') {
      list = list.filter((b) => !b.available);
    }
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'year') {
      list.sort((a, b) => (b.yearPublished ?? 0) - (a.yearPublished ?? 0));
    } else if (sortBy === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'author') {
      list.sort((a, b) => a.author.localeCompare(b.author) || a.title.localeCompare(b.title));
    } else if (sortBy === 'price') {
      list.sort((a, b) => a.price - b.price);
    }
    return list;
  }, [sourceBooks, authorFilter, genreFilter, languageFilter, availabilityFilter, sortBy]);

  const displayBooks = filteredAndSortedBooks;
  const totalPages = Math.max(1, Math.ceil(displayBooks.length / BOOKS_PER_PAGE));
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = displayBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [books.length, authorFilter, genreFilter, languageFilter, availabilityFilter, sortBy]);

  const handleClearFilters = () => {
    setAuthorFilter('');
    setGenreFilter('');
    setLanguageFilter('');
    setAvailabilityFilter('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  if (loading && books.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-library-600" />
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16 text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb and sub-navigation
      <div className="flex justify-between items-center mb-6">
        <div className="text-gray-600">Explore the Catalogue</div>
        <div className="flex gap-4 text-sm">
          <a href="#" className="text-gray-600 hover:text-library-600">Recent Activity</a>
          <a href="#" className="text-library-600 font-semibold">New Titles</a>
          <a href="#" className="text-gray-600 hover:text-library-600">Awards</a>
          <a href="#" className="text-gray-600 hover:text-library-600">Bestsellers</a>
          <a href="#" className="text-gray-600 hover:text-library-600">Staff Picks</a>
          <a href="#" className="text-gray-600 hover:text-library-600">Featured Languages</a>
        </div>
      </div> */}

      {/* Page title */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">New Titles</h1>
          <a href="#" className="text-library-600 hover:underline">Browse All New Titles</a>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex flex-wrap items-center gap-4 p-4 bg-gray-100 rounded">
        <span className="font-medium">Filter by</span>
        <select
          value={authorFilter}
          onChange={(e) => setAuthorFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded bg-white"
          aria-label="Filter by author"
        >
          <option value="">All authors</option>
          {uniqueAuthors.map((author) => (
            <option key={author} value={author}>
              {author}
            </option>
          ))}
        </select>
        <select
          value={genreFilter}
          onChange={(e) => setGenreFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded bg-white"
          aria-label="Filter by genre"
        >
          <option value="">All genres</option>
          {uniqueGenres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded bg-white"
          aria-label="Filter by language"
        >
          <option value="">All languages</option>
          {uniqueLanguages.map((lang) => (
            <option key={lang} value={lang}>
              {lang}
            </option>
          ))}
        </select>
        <select
          value={availabilityFilter}
          onChange={(e) => setAvailabilityFilter(e.target.value as AvailabilityFilter)}
          className="px-4 py-2 border border-gray-300 rounded bg-white"
          aria-label="Filter by availability"
        >
          <option value="">All</option>
          <option value="available">Available</option>
          <option value="unavailable">Checked out</option>
        </select>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as SortOption)}
          className="px-4 py-2 border border-gray-300 rounded bg-white"
          aria-label="Sort by"
        >
          <option value="newest">Newest first</option>
          <option value="year">Year (newest first)</option>
          <option value="title">Title A–Z</option>
          <option value="author">Author A–Z</option>
        </select>
        <button
          type="button"
          onClick={handleClearFilters}
          className="ml-auto px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50"
        >
          Clear filters
        </button>
      </div>

      {/* Book covers grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-6">
        {paginatedBooks.map((book) => (
          <Link key={book._id} to={`/books/${book._id}`}>
            <BookCard book={book} showAction={false} linkToDetail={false} />
          </Link>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            Showing {startIndex + 1}–{Math.min(startIndex + BOOKS_PER_PAGE, displayBooks.length)} of {displayBooks.length} books
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
