import { useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import Button from '@/components/ui/Button';
import bookService from '@/services/bookService';
import { getApiErrorMessage } from '@/services/api';

interface BulkBook {
  title: string;
  author: string;
  description: string;
  price: number;
  quantity: number;
  genre?: string;
  language?: string;
  yearPublished?: number;
  imageLink?: string;
  isbn?: string;
  publisher?: string;
  pages?: number;
  subtitle?: string;
}

const EXAMPLE_JSON = `[
  {
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "description": "A story of decadence and excess in the Jazz Age.",
    "price": 12.99,
    "quantity": 5
  },
  {
    "title": "To Kill a Mockingbird",
    "author": "Harper Lee",
    "description": "A novel about racial injustice in the American South.",
    "price": 14.99,
    "quantity": 3
  }
]`;

export default function BulkUploadPage() {
  const [jsonInput, setJsonInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<{ created: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    let books: BulkBook[];
    try {
      const parsed = JSON.parse(jsonInput.trim());
      if (!Array.isArray(parsed)) {
        setError('Input must be a JSON array of book objects');
        return;
      }
      books = parsed;
    } catch {
      setError('Invalid JSON. Please check the format.');
      return;
    }

    if (books.length === 0) {
      setError('The array is empty. Add at least one book.');
      return;
    }

    if (books.length > 500) {
      setError('Maximum 500 books per upload.');
      return;
    }

    for (let i = 0; i < books.length; i++) {
      const b = books[i];
      if (!b || typeof b !== 'object') {
        setError(`Invalid object at index ${i}`);
        return;
      }
      if (!b.title || typeof b.title !== 'string' || !b.title.trim()) {
        setError(`Book at index ${i}: "title" is required and must be a non-empty string`);
        return;
      }
      if (!b.author || typeof b.author !== 'string' || !b.author.trim()) {
        setError(`Book at index ${i}: "author" is required and must be a non-empty string`);
        return;
      }
      if (!b.description || typeof b.description !== 'string' || !b.description.trim()) {
        setError(`Book at index ${i}: "description" is required and must be a non-empty string`);
        return;
      }
      const price = Number(b.price);
      if (Number.isNaN(price) || price < 0) {
        setError(`Book at index ${i}: "price" must be a non-negative number`);
        return;
      }
      const qty = Number(b.quantity);
      if (Number.isNaN(qty) || qty < 0 || !Number.isInteger(qty)) {
        setError(`Book at index ${i}: "quantity" must be a non-negative integer`);
        return;
      }
    }

    const payload = books.map((b) => ({
      title: String(b.title).trim(),
      author: String(b.author).trim(),
      description: String(b.description).trim(),
      price: Number(b.price),
      quantity: Math.floor(Number(b.quantity)),
      ...(b.genre && { genre: String(b.genre).trim() }),
      ...(b.language && { language: String(b.language).trim() }),
      ...(b.yearPublished != null && !Number.isNaN(Number(b.yearPublished)) && { yearPublished: Number(b.yearPublished) }),
      ...(b.imageLink && { imageLink: String(b.imageLink).trim() }),
      ...(b.isbn && { isbn: String(b.isbn).trim() }),
      ...(b.publisher && { publisher: String(b.publisher).trim() }),
      ...(b.pages != null && !Number.isNaN(Number(b.pages)) && { pages: Number(b.pages) }),
      ...(b.subtitle && { subtitle: String(b.subtitle).trim() }),
    }));

    setIsLoading(true);
    try {
      const res = await bookService.bulkUploadBooks(payload);
      setSuccess({ created: res.created });
      setJsonInput('');
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadExample = () => {
    setJsonInput(EXAMPLE_JSON);
    setError(null);
    setSuccess(null);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Bulk Upload Books</h1>
          <Link
            to="/admin/books"
            className="text-library-600 hover:text-library-700 font-medium"
          >
            ← Back to Manage Books
          </Link>
        </div>

        <p className="text-gray-600 mb-6">
          Paste a JSON array of book objects. Each book must have: <code className="bg-gray-100 px-1 rounded">title</code>,{' '}
          <code className="bg-gray-100 px-1 rounded">author</code>, <code className="bg-gray-100 px-1 rounded">description</code>,{' '}
          <code className="bg-gray-100 px-1 rounded">price</code>, <code className="bg-gray-100 px-1 rounded">quantity</code>.
          Maximum 500 books per upload.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700">
              {error}
            </div>
          )}
          {success && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-700">
              Successfully added {success.created} book{success.created !== 1 ? 's' : ''}.
            </div>
          )}

          <div>
            <label htmlFor="json" className="block text-sm font-semibold text-gray-700 mb-2">
              JSON array
            </label>
            <textarea
              id="json"
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full h-64 px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-library-600 focus:ring-2 focus:ring-library-600/20 font-mono text-sm"
              placeholder='[{"title":"...","author":"...","description":"...","price":0,"quantity":1}]'
              disabled={isLoading}
            />
          </div>

          <div className="flex flex-wrap gap-3">
            <Button type="submit" loading={isLoading} disabled={isLoading || !jsonInput.trim()}>
              Upload Books
            </Button>
            <Button type="button" variant="secondary" onClick={loadExample} disabled={isLoading}>
              Load example
            </Button>
            <Link
              to="/admin/books"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </Layout>
  );
}
