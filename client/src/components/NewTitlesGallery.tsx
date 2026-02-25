import { Book } from '@/types';
import { BookGrid } from '@/components/books';

interface NewTitlesGalleryProps {
  books?: Book[];
  onPlaceHold?: (book: Book) => void;
  loadingBookIds?: string[];
}

export default function NewTitlesGallery({ 
  books = [], 
  onPlaceHold,
  loadingBookIds = [],
}: NewTitlesGalleryProps) {
  // Placeholder books for now - will be replaced with actual data
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
      <div className="grid grid-cols-8 gap-4 mb-6">
        {displayBooks.map((book) => (
          <div key={book._id} className="cursor-pointer group">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded overflow-hidden mb-2 group-hover:shadow-lg transition-shadow flex items-center justify-center">
              <div className="text-center p-2">
                <div className="text-4xl mb-2">📚</div>
                <span className="text-xs font-medium text-gray-700 line-clamp-2">{book.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
