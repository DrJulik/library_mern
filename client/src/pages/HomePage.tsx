import { useEffect } from 'react';
import Layout from '@/layouts/Layout';
import NewTitlesGallery from '@/components/NewTitlesGallery';
import { useBooksStore, selectBooks, selectBooksLoading, selectBooksError } from '@/store/useBooksStore';

export default function HomePage() {
  const fetchBooks = useBooksStore((s) => s.fetchBooks);
  const books = useBooksStore(selectBooks);
  const isLoading = useBooksStore(selectBooksLoading);
  const error = useBooksStore(selectBooksError);

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <Layout>
      <NewTitlesGallery books={books} loading={isLoading} error={error} />
    </Layout>
  );
}
