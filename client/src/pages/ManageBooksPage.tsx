import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { BookGrid } from '@/components/books';
import AddBookModal from '@/components/books/AddBookModal';
import Button from '@/components/ui/Button';
import { useBooksStore, selectBooks, selectBooksLoading, selectBooksError } from '@/store/useBooksStore';

export default function ManageBooksPage() {
  const fetchBooks = useBooksStore((s) => s.fetchBooks);
  const addBook = useBooksStore((s) => s.addBook);
  const deleteBook = useBooksStore((s) => s.deleteBook);
  const books = useBooksStore(selectBooks);
  const isLoading = useBooksStore(selectBooksLoading);
  const error = useBooksStore(selectBooksError);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  const handleDelete = async (bookId: string) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    setDeletingIds((prev) => new Set(prev).add(bookId));
    try {
      await deleteBook(bookId);
    } finally {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(bookId);
        return next;
      });
    }
  };

  const handleAddSubmit = async (data: Parameters<typeof addBook>[0]) => {
    await addBook(data);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Manage Books</h1>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => setAddModalOpen(true)}>
              <span className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Book
              </span>
            </Button>
            <Link to="/admin/books/bulk">
              <Button variant="secondary">
                <span className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Bulk Upload
                </span>
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline">← Back to Admin</Button>
            </Link>
          </div>
        </div>

        {error && <div className="mb-4 p-4 bg-red-50 text-red-700 rounded">{error}</div>}
        {isLoading && books.length === 0 ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-library-600" />
          </div>
        ) : (
          <BookGrid
            books={books}
            title="Catalog"
            columns={6}
            showAction={false}
            showDeleteButton
            onDelete={(b) => handleDelete(b._id)}
            deletingBookIds={Array.from(deletingIds)}
            emptyMessage="No books in the catalog."
          />
        )}
      </div>

      <AddBookModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddSubmit}
      />
    </Layout>
  );
}

