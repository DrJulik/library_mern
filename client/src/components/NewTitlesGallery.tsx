import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import { BookCard } from '@/components/books';

const BOOKS_PER_PAGE = 20;

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

  const displayBooks = books.length > 0 ? books : placeholderBooks;
  const totalPages = Math.max(1, Math.ceil(displayBooks.length / BOOKS_PER_PAGE));
  const startIndex = (currentPage - 1) * BOOKS_PER_PAGE;
  const paginatedBooks = displayBooks.slice(startIndex, startIndex + BOOKS_PER_PAGE);

  useEffect(() => {
    setCurrentPage(1);
  }, [books.length]);

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
      {/* Breadcrumb and sub-navigation */}
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
      </div>

      {/* Page title */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">New Titles</h1>
          <a href="#" className="text-library-600 hover:underline">Browse All New Titles</a>
        </div>
      </div>

      {/* Filter bar */}
      <div className="mb-6 flex items-center gap-4 p-4 bg-gray-100 rounded">
        <span className="font-medium">Filter by</span>
        <select className="px-4 py-2 border border-gray-300 rounded bg-white">
          <option>Nothing selected</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded bg-white">
          <option>Nothing selected</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded bg-white">
          <option>Nothing selected</option>
        </select>
        <select className="px-4 py-2 border border-gray-300 rounded bg-white">
          <option>Nothing selected</option>
        </select>
        <button className="ml-auto px-6 py-2 bg-library-900 text-white rounded hover:bg-library-800">
          Apply
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
