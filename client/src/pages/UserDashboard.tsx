import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { useAuthStore } from '@/store/useAuthStore';
import borrowService from '@/services/borrowService';
import readingListService from '@/services/readingListService';
import { BorrowedBook, Book } from '@/types';
import { BookGrid, BookList } from '@/components/books';

/** Build minimal Book from BorrowedBook for display (API returns bookId, bookTitle, not full Book) */
function toDisplayBook(b: BorrowedBook): Book {
  return {
    _id: b.bookId,
    title: b.bookTitle,
    author: '',
    description: '',
    price: 0,
    quantity: 1,
    available: false,
    createdAt: b.borrowedDate,
    updatedAt: b.borrowedDate,
  };
}

type ActivityItem =
  | { book: Book; type: 'borrowed' | 'returned'; date: string; dueDate?: string; isOverdue?: boolean }
  | { book: Book; type: 'added_to_shelf'; date: string; label?: string };

export default function UserDashboard() {
  const { user } = useAuthStore();
  const [borrowedBooks, setBorrowedBooks] = useState<BorrowedBook[]>([]);
  const [readingListItems, setReadingListItems] = useState<{ book: Book; createdAt: string }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [borrowRes, listRes] = await Promise.all([
          borrowService.getMyBorrowedBooks(),
          readingListService.getMine(),
        ]);
        if (borrowRes.success) setBorrowedBooks(borrowRes.borrowedBooks || []);
        if (listRes.success && listRes.items) {
          setReadingListItems(
            listRes.items
              .filter((i) => i.book)
              .map((i) => ({
                book: {
                  ...i.book,
                  description: i.book.description ?? '',
                  price: 0,
                  quantity: 1,
                  available: false,
                  createdAt: i.createdAt,
                  updatedAt: i.createdAt,
                } as Book,
                createdAt: i.createdAt,
              }))
          );
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // API returns BorrowedBook[] with { bookId, returned, bookTitle, borrowedDate, dueDate }
  const now = new Date();
  const checkedOut = borrowedBooks.filter((b) => !b.returned).length;
  const overdue = borrowedBooks.filter((b) => !b.returned && new Date(b.dueDate) < now).length;
  const returned = borrowedBooks.filter((b) => b.returned).length;
  const totalFines = 0; // API doesn't return fine data in user.borrowedBooks

  // Build combined activity: borrows/returns + reading list additions, sorted by date
  const borrowActivities: ActivityItem[] = borrowedBooks.map((record) => ({
    book: toDisplayBook(record),
    type: (record.returned ? 'returned' : 'borrowed') as 'returned' | 'borrowed',
    date: record.borrowedDate,
    dueDate: record.dueDate,
    isOverdue: !record.returned && new Date(record.dueDate) < now,
  }));
  const listActivities: ActivityItem[] = readingListItems.map(({ book, createdAt }) => ({
    book,
    type: 'added_to_shelf' as const,
    date: createdAt,
    label: 'Added to reading list',
  }));
  const allActivities = [...borrowActivities, ...listActivities].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const activityItems = allActivities.slice(0, 10);

  // Currently borrowed - not returned
  const currentlyBorrowedRecords = borrowedBooks.filter((b) => !b.returned);
  const currentlyBorrowedBooks: Book[] = currentlyBorrowedRecords.map(toDisplayBook);

  return (
    <Layout>
      <div className="bg-gray-50 min-h-full">
        {/* Header */}
        {/* <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-library-900">My Library Dashboard</h1>
                <p className="text-gray-600 mt-1">
                  Welcome, <span className="text-library-600 font-medium">{user?.name || 'Reader'}</span>!
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button className="relative p-2 text-gray-500 hover:text-library-600 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  {overdue > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {overdue}
                    </span>
                  )}
                </button>
                <button className="p-2 text-gray-500 hover:text-library-600 hover:bg-gray-100 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div> */}

        {/* Main Content */}
        <div className="container mx-auto px-4 py-6">
          <div className="grid lg:grid-cols-[280px_1fr] gap-6">
            {/* Left Sidebar */}
            <div className="space-y-6">
              {/* My Borrowing Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 bg-library-800 text-white">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h2 className="font-semibold">My Borrowing</h2>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  <Link to="/my-books" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-library-600">Checked Out</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{checkedOut}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                  <Link to="/my-books" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-library-600">Overdue</span>
                    <div className="flex items-center gap-2">
                      {overdue > 0 && (
                        <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                          {overdue}
                        </span>
                      )}
                      <span className="font-semibold text-gray-900">{overdue}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                  <Link to="/my-books" className="flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors group">
                    <span className="text-gray-700 group-hover:text-library-600">Borrowing History</span>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900">{borrowedBooks.length}</span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                  <div className="flex items-center justify-between px-4 py-3">
                    <span className="text-gray-700">Fees</span>
                    <div className="flex items-center gap-2">
                      <span className={`font-semibold ${totalFines > 0 ? 'text-red-600' : 'text-gray-900'}`}>
                        ${totalFines.toFixed(2)}
                      </span>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* My Profile Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <h2 className="font-semibold text-gray-900">My Profile</h2>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-library-600 text-white flex items-center justify-center font-semibold text-lg">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                      <p className="font-medium text-library-600">{user?.name || 'User'}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>
                  </div>
                  <Link 
                    to="/profile" 
                    className="text-sm text-library-600 hover:text-library-700 hover:underline"
                  >
                    View and edit →
                  </Link>
                </div>
                <div className="px-4 py-2 bg-gray-50 border-t border-gray-100">
                  <span className="text-xs font-semibold text-library-600">
                    {returned} BOOKS RETURNED
                  </span>
                </div>
              </div>

              {/* Quick Actions Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <h2 className="font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                </div>
                <div className="p-2">
                  <Link 
                    to="/books" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-library-100 text-library-600 flex items-center justify-center group-hover:bg-library-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-library-600">Browse Catalog</span>
                  </Link>
                  <Link 
                    to="/my-books" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-100 text-green-600 flex items-center justify-center group-hover:bg-green-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-green-600">My Books</span>
                  </Link>
                  <Link 
                    to="/reading-list" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-amber-600">Reading List</span>
                  </Link>
                  <Link 
                    to="/profile" 
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-gray-700 group-hover:text-purple-600">Settings</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="space-y-6">
              {/* Currently Borrowed Section - Using BookGrid */}
              {isLoading ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-library-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              ) : currentlyBorrowedBooks.length > 0 ? (
                <BookGrid
                  books={currentlyBorrowedBooks.slice(0, 6)}
                  title="Currently Borrowed"
                  viewAllLink="/my-books"
                  viewAllLabel="View all"
                  layout="scroll"
                  showAction={false}
                />
              ) : (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-900">Currently Borrowed</h2>
                  </div>
                  <div className="p-8 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">No books borrowed</h3>
                    <p className="text-gray-500 text-sm mb-4">Start exploring our catalog to find your next read!</p>
                    <Link 
                      to="/books" 
                      className="inline-flex items-center gap-2 px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                      Browse Catalog
                    </Link>
                  </div>
                </div>
              )}

              {/* Recent Activity Section - Using BookList */}
              <BookList
                activities={activityItems}
                title="My Recent Activity"
                showPrivacyToggle={true}
                isPublic={true}
                viewAllLink="/my-books"
                viewAllLabel="See all"
                showMoreLink={activityItems.length > 0 ? "/my-books" : undefined}
                showMoreLabel="Show more"
                userName={user?.name}
                userInitial={user?.name?.charAt(0).toUpperCase()}
                isLoading={isLoading}
                emptyMessage="No recent activity"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
