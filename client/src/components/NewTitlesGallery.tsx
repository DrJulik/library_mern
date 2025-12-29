import { Book } from '@/types';

interface NewTitlesGalleryProps {
  books?: Book[];
}

export default function NewTitlesGallery({ books = [] }: NewTitlesGalleryProps) {
  // Placeholder books for now - will be replaced with actual data
  const placeholderBooks = Array.from({ length: 29 }, (_, i) => ({
    _id: `book-${i}`,
    title: `Book ${i + 1}`,
    author: 'Author Name',
    description: '',
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

      {/* Page title and tabs */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold text-gray-900">New Titles</h1>
          <a href="#" className="text-library-600 hover:underline">Browse All New Titles</a>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-300">
          <button className="px-4 py-2 text-library-600 font-semibold border-b-2 border-library-600">
            Just Arrived
          </button>
          <button className="px-4 py-2 text-gray-600 hover:text-library-600">
            On Order
          </button>
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
      <div className="grid grid-cols-6 gap-4 mb-6">
        {displayBooks.map((book) => (
          <div key={book._id} className="cursor-pointer group">
            <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 rounded overflow-hidden mb-2 group-hover:shadow-lg transition-shadow flex items-center justify-center">
              <div className="text-center p-2">
                <div className="text-4xl mb-2">📚</div>
                <span className="text-xs font-medium text-gray-700 line-clamp-2">{book.title}</span>
              </div>
            </div>
            <p className="text-xs text-gray-700 line-clamp-2 mt-1">{book.title}</p>
            {book.author && (
              <p className="text-xs text-gray-500 line-clamp-1">{book.author}</p>
            )}
          </div>
        ))}
      </div>

      {/* View all link */}
      <div className="text-right mb-8">
        <a href="#" className="text-library-600 hover:underline font-semibold">
          View All New Titles &gt;&gt;
        </a>
      </div>

      {/* Also See section */}
      <div className="grid grid-cols-3 gap-8 mt-12 pt-8 border-t border-gray-300">
        <div>
          <h3 className="font-semibold text-gray-900 mb-3">NON-FICTION</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><a href="#" className="hover:text-library-600">Architecture</a></li>
            <li><a href="#" className="hover:text-library-600">Arts & Entertainment</a></li>
            <li><a href="#" className="hover:text-library-600">Biography</a></li>
            <li><a href="#" className="hover:text-library-600">Business</a></li>
            <li><a href="#" className="hover:text-library-600">Computers</a></li>
            <li><a href="#" className="hover:text-library-600">Cooking</a></li>
            <li><a href="#" className="hover:text-library-600">Crafts & Hobbies</a></li>
            <li><a href="#" className="hover:text-library-600">Economics</a></li>
            <li><a href="#" className="hover:text-library-600">Education</a></li>
            <li><a href="#" className="hover:text-library-600">Gardening</a></li>
            <li><a href="#" className="hover:text-library-600">General Information & Media</a></li>
            <li><a href="#" className="hover:text-library-600">Health & Fitness</a></li>
            <li><a href="#" className="hover:text-library-600">History</a></li>
            <li><a href="#" className="hover:text-library-600">History of Canada</a></li>
            <li><a href="#" className="hover:text-library-600">Interior Design</a></li>
            <li><a href="#" className="hover:text-library-600">Language</a></li>
            <li><a href="#" className="hover:text-library-600">Philosophy</a></li>
            <li><a href="#" className="hover:text-library-600">Photography</a></li>
            <li><a href="#" className="hover:text-library-600">Political Science & Law</a></li>
            <li><a href="#" className="hover:text-library-600">Psychology</a></li>
            <li><a href="#" className="hover:text-library-600">Religion</a></li>
            <li><a href="#" className="hover:text-library-600">Science & Mathematics</a></li>
            <li><a href="#" className="hover:text-library-600">Social sciences</a></li>
            <li><a href="#" className="hover:text-library-600">Sports</a></li>
            <li><a href="#" className="hover:text-library-600">Technology</a></li>
            <li><a href="#" className="hover:text-library-600">Travel & Geography</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">FICTION, LITERATURE, FILM & MUSIC</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><a href="#" className="hover:text-library-600">Movies</a></li>
            <li><a href="#" className="hover:text-library-600">Music</a></li>
            <li><a href="#" className="hover:text-library-600">Fiction</a></li>
            <li><a href="#" className="hover:text-library-600">Mystery</a></li>
            <li><a href="#" className="hover:text-library-600">Fantasy</a></li>
            <li><a href="#" className="hover:text-library-600">Large Print</a></li>
            <li><a href="#" className="hover:text-library-600">Graphic Novels</a></li>
            <li><a href="#" className="hover:text-library-600">Poetry</a></li>
            <li><a href="#" className="hover:text-library-600">Drama</a></li>
            <li><a href="#" className="hover:text-library-600">Humour</a></li>
          </ul>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">CHILDREN & TEENS</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li><a href="#" className="hover:text-library-600">Children's Fiction</a></li>
            <li><a href="#" className="hover:text-library-600">Children's Non-fiction</a></li>
            <li><a href="#" className="hover:text-library-600">Children's Movies</a></li>
            <li><a href="#" className="hover:text-library-600">Children's Music</a></li>
            <li><a href="#" className="hover:text-library-600">Teen Material</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}

