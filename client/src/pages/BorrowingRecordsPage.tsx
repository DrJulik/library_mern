import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import Button from '@/components/ui/Button';
import borrowService from '@/services/borrowService';
import bookService from '@/services/bookService';
import { BorrowRecord, Book } from '@/types';
import { getApiErrorMessage } from '@/services/api';

type StatusFilter = 'all' | 'borrowed' | 'returned';

export default function BorrowingRecordsPage() {
  const [borrows, setBorrows] = useState<BorrowRecord[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<StatusFilter>('all');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Record checkout form
  const [checkoutBookId, setCheckoutBookId] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  const fetchBorrows = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await borrowService.getAllBorrowedBooks();
      setBorrows(res.borrowedBooks ?? []);
    } catch (err) {
      setError(getApiErrorMessage(err));
      setBorrows([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBooks = async () => {
    try {
      const res = await bookService.getAllBooks();
      setBooks(res.books ?? []);
    } catch {
      setBooks([]);
    }
  };

  useEffect(() => {
    fetchBorrows();
    fetchBooks();
  }, []);

  const filteredBorrows =
    filter === 'all'
      ? borrows
      : borrows.filter((b) => b.status === filter);

  const handleRecordReturn = async (record: BorrowRecord) => {
    const bookId = typeof record.book === 'object' ? record.book._id : record.book;
    const email = typeof record.user === 'object' ? record.user.email : '—';
    if (!email || email === '—') return;

    setActionLoading(record._id);
    setError(null);
    setSuccess(null);
    try {
      await borrowService.recordReturnedBook(bookId, email);
      setSuccess('Book marked as returned.');
      await fetchBorrows();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleRecordCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutBookId.trim() || !checkoutEmail.trim()) {
      setError('Please select a book and enter user email.');
      return;
    }

    setCheckoutLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await borrowService.recordBorrowedBook(checkoutBookId.trim(), checkoutEmail.trim().toLowerCase());
      setSuccess('Book recorded as borrowed.');
      setCheckoutBookId('');
      setCheckoutEmail('');
      await fetchBorrows();
      await fetchBooks();
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setCheckoutLoading(false);
    }
  };

  const userName = (b: BorrowRecord) =>
    typeof b.user === 'object' && b.user ? (b.user as { name?: string }).name : '—';
  const userEmail = (b: BorrowRecord) =>
    typeof b.user === 'object' && b.user ? (b.user as { email?: string }).email : '—';
  const bookTitle = (b: BorrowRecord) =>
    typeof b.book === 'object' && b.book ? (b.book as { title?: string }).title : '—';
  const bookAuthor = (b: BorrowRecord) =>
    typeof b.book === 'object' && b.book ? (b.book as { author?: string }).author : '—';
  const bookId = (b: BorrowRecord) =>
    typeof b.book === 'object' && b.book ? (b.book as { _id?: string })._id : (b.book as string);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '—';
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

  const availableBooks = books.filter((b) => b.available);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Borrowing Records</h1>
          <Link
            to="/admin"
            className="text-library-600 hover:text-library-700 font-medium"
          >
            ← Back to Admin
          </Link>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        {/* Record checkout form */}
        <div className="mb-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Record checkout</h2>
          <form onSubmit={handleRecordCheckout} className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 min-w-0">
              <label htmlFor="checkout-book" className="block text-sm font-medium text-gray-700 mb-1">
                Book
              </label>
              <select
                id="checkout-book"
                value={checkoutBookId}
                onChange={(e) => setCheckoutBookId(e.target.value)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20"
                disabled={checkoutLoading}
              >
                <option value="">Select a book</option>
                {availableBooks.map((book) => (
                  <option key={book._id} value={book._id}>
                    {book.title} by {book.author}
                  </option>
                ))}
                {availableBooks.length === 0 && (
                  <option value="" disabled>
                    No available books
                  </option>
                )}
              </select>
            </div>
            <div className="flex-1 min-w-0">
              <label htmlFor="checkout-email" className="block text-sm font-medium text-gray-700 mb-1">
                User email
              </label>
              <input
                id="checkout-email"
                type="email"
                value={checkoutEmail}
                onChange={(e) => setCheckoutEmail(e.target.value)}
                placeholder="user@example.com"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20"
                disabled={checkoutLoading}
              />
            </div>
            <div className="flex items-end">
              <Button
                type="submit"
                loading={checkoutLoading}
                disabled={checkoutLoading || !checkoutBookId || !checkoutEmail.trim()}
              >
                Record checkout
              </Button>
            </div>
          </form>
        </div>

        {/* Status filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['all', 'borrowed', 'returned'] as const).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === s
                  ? 'bg-library-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-library-600" />
          </div>
        ) : filteredBorrows.length === 0 ? (
          <p className="text-gray-600 py-8">
            {filter === 'all' ? 'No borrowing records found.' : `No ${filter} records found.`}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    User
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Book
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Borrowed
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Due
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Returned
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBorrows.map((b) => (
                  <tr key={b._id}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{userName(b)}</div>
                      <div className="text-sm text-gray-500">{userEmail(b)}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{bookTitle(b)}</div>
                      <div className="text-sm text-gray-500">{bookAuthor(b)}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(b.borrowedDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(b.dueDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {formatDate(b.returnDate)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          b.status === 'borrowed'
                            ? 'bg-blue-100 text-blue-800'
                            : b.status === 'returned'
                              ? 'bg-green-100 text-green-800'
                              : b.status === 'overdue'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {b.status === 'borrowed' ? (
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => handleRecordReturn(b)}
                          loading={actionLoading === b._id}
                          disabled={actionLoading === b._id}
                        >
                          Mark returned
                        </Button>
                      ) : (
                        '—'
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}
