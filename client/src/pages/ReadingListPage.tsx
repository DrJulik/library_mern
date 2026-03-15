import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import readingListService from '@/services/readingListService';
import { getApiErrorMessage } from '@/services/api';
import BookCover from '@/components/books/BookCover';

interface ReadingListBook {
  _id: string;
  title: string;
  author: string;
  imageLink?: string;
}

export default function ReadingListPage() {
  const [books, setBooks] = useState<ReadingListBook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await readingListService.getMine();
        setBooks(res.books ?? []);
      } catch (err) {
        setError(getApiErrorMessage(err));
        setBooks([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetch();
  }, []);

  if (isLoading) {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Reading List</h1>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {books.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your reading list is empty</h2>
            <p className="text-gray-600 mb-6">Browse the catalog and add books you want to read.</p>
            <Link
              to="/books"
              className="inline-flex items-center gap-2 px-4 py-2 bg-library-600 text-white rounded-lg hover:bg-library-700 transition-colors"
            >
              Browse catalog
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {books.map((book) => (
              <Link
                key={book._id}
                to={`/books/${book._id}`}
                className="bg-white rounded-xl border border-gray-200 p-4 hover:border-library-300 hover:shadow-md transition-all flex gap-4"
              >
                <div className="flex-shrink-0 w-16 h-24 overflow-hidden rounded">
                  <BookCover title={book.title} author={book.author} coverUrl={book.imageLink} size="md" className="w-full h-full" fillContainer />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-medium text-gray-900 line-clamp-2">{book.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{book.author}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
