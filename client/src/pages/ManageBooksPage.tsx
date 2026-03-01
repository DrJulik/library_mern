import { useEffect } from 'react';
import Layout from '@/layouts/Layout';
import { BookGrid } from '@/components/books';
import { useBooksStore, selectBooks, selectBooksLoading, selectBooksError } from '@/store/useBooksStore';

export default function ManageBooksPage() {
  const fetchBooks = useBooksStore((s) => s.fetchBooks);
  const books = useBooksStore(selectBooks);
  const isLoading = useBooksStore(selectBooksLoading);
  const error = useBooksStore(selectBooksError);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Manage Books</h1>
        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">{error}</div>}
        {isLoading && books.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-library-600" />
          </div>
        ) : (
          <BookGrid books={books} title="Catalog" columns={6} showAction={false} emptyMessage="No books in the catalog." />
        )}
      </div>
    </Layout>
  );
}

