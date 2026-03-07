import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import borrowService from '@/services/borrowService';
import holdService from '@/services/holdService';
import { BorrowedBook, Hold } from '@/types';
import { getApiErrorMessage } from '@/services/api';
import BookCover from '@/components/books/BookCover';

export default function MyBooksPage() {
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [holds, setHolds] = useState<Hold[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [borrowRes, holdRes] = await Promise.all([
        borrowService.getMyBorrowedBooks(),
        holdService.getMyHolds(),
      ]);
      setBorrowedBooks(borrowRes.borrowedBooks ?? []);
      setHolds(holdRes.holds ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setBorrowedBooks([]);
      setHolds([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const currentlyBorrowed = borrowedBooks.filter((b) => !b.returned);
  const activeHolds = holds.filter((h) => h.status === 'pending' || h.status === 'approved');

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return '—';
    }
  };

  const isOverdue = (dueDate: string) => new Date(dueDate) < new Date();

  const holdStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pending approval';
      case 'approved':
        return 'Approved – come pick up';
      case 'fulfilled':
        return 'Fulfilled';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const bookTitle = (h: Hold) =>
    typeof h.book === 'object' && h.book ? (h.book as { title?: string }).title : '—';
  const bookAuthor = (h: Hold) =>
    typeof h.book === 'object' && h.book ? (h.book as { author?: string }).author : '—';
  const bookId = (h: Hold) =>
    typeof h.book === 'object' && h.book ? (h.book as { _id?: string })._id : (h.book as string);

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-library-600" />
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Books</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="space-y-10">
          {/* Borrowed Books Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-library-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              Currently Borrowed
            </h2>

            {currentlyBorrowed.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">You have no books checked out.</p>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700 font-medium transition-colors"
                >
                  Browse catalog
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {currentlyBorrowed.map((b) => (
                  <Link
                    key={b.bookId}
                    to={`/books/${b.bookId}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-library-300 hover:shadow-md transition-all flex gap-4"
                  >
                    <div className="flex-shrink-0 w-16 h-20 overflow-hidden rounded">
                      <BookCover title={b.bookTitle} size="sm" className="w-full h-full" fillContainer />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{b.bookTitle}</h3>
                      <p className="text-sm text-gray-500 mt-1">Due {formatDate(b.dueDate)}</p>
                      {isOverdue(b.dueDate) && (
                        <span className="inline-block mt-2 px-2 py-0.5 text-xs font-medium bg-red-100 text-red-800 rounded">
                          Overdue
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Holds Section */}
          <section>
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-library-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              My Holds
            </h2>

            {activeHolds.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-gray-600 mb-4">You have no active holds.</p>
                <Link
                  to="/books"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700 font-medium transition-colors"
                >
                  Browse catalog
                </Link>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {activeHolds.map((h) => (
                  <Link
                    key={h._id}
                    to={`/books/${bookId(h)}`}
                    className="bg-white rounded-xl border border-gray-200 p-4 hover:border-library-300 hover:shadow-md transition-all flex gap-4"
                  >
                    <div className="flex-shrink-0 w-16 h-20 overflow-hidden rounded">
                      <BookCover
                        title={bookTitle(h)}
                        author={bookAuthor(h)}
                        size="sm"
                        className="w-full h-full"
                        fillContainer
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-gray-900 line-clamp-2">{bookTitle(h)}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{bookAuthor(h)}</p>
                      <span
                        className={`inline-block mt-2 px-2 py-0.5 text-xs font-medium rounded ${
                          h.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : h.status === 'approved'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {holdStatusLabel(h.status)}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </Layout>
  );
}
