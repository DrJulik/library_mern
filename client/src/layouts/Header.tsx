import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { useBooksStore } from '@/store/useBooksStore';

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuthStore();
  const isAdmin = user?.role === 'admin';
  const setSearchQuery = useBooksStore((s) => s.setSearchQuery);
  const [headerSearch, setHeaderSearch] = useState('');
  const isOnCatalog = location.pathname === '/books' || location.pathname.startsWith('/books/');

  const handleHeaderSearch = () => {
    const q = headerSearch.trim();
    setSearchQuery(q);
    if (!isOnCatalog) navigate('/books');
  };

  return (
    <header>
      {/* Top bar with Help and Login */}
      <div className="bg-library-900 text-white py-2">
        <div className="container mx-auto px-4 flex justify-end gap-4 text-sm">
          {isAuthenticated && user ? (
            <>
              <Link to="/dashboard" className="hover:underline">Hi, {user.name}</Link>
              {isAdmin && (
                <Link to="/admin" className="hover:underline">Admin</Link>
              )}
              <button
                type="button"
                onClick={async () => {
                  await logout();
                  navigate('/');
                }}
                className="hover:underline"
              >
                Log Out
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:underline">Log In</Link>
          )}
        </div>
      </div>

      {/* Main header with logo and search */}
      <div className="bg-library-700 text-white py-4">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-4 mb-4">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Link to="/" className="text-xl font-semibold">Gotham City Public Library</Link>
            </div>

            {/* Search bar */}
            <div className="flex-1 max-w-2xl">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={headerSearch}
                  onChange={(e) => setHeaderSearch(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleHeaderSearch()}
                  placeholder="Search the Catalogue by Keyword"
                  className="flex-1 px-4 py-2 text-gray-900 rounded"
                />
                <button
                  type="button"
                  onClick={handleHeaderSearch}
                  className="bg-library-900 px-6 py-2 rounded hover:bg-library-800 flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation menu */}
      {/* <nav className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <ul className="flex gap-6">
            <li>
              <Link to="/" className="block py-4 px-2 text-library-600 font-semibold border-b-2 border-library-600">
                Explore
              </Link>
            </li>
            <li>
              <a href="#" className="block py-4 px-2 text-gray-700 hover:text-library-600">
                Digital Library
              </a>
            </li>
            <li>
              <a href="#" className="block py-4 px-2 text-gray-700 hover:text-library-600">
                Submit a Suggestion for Purchase
              </a>
            </li>
            <li>
              <a href="#" className="block py-4 px-2 text-gray-700 hover:text-library-600">
                Programs/Events
              </a>
            </li>
            <li>
              <a href="#" className="block py-4 px-2 text-gray-700 hover:text-library-600">
                About BPL
              </a>
            </li>
            <li>
              <a href="#" className="block py-4 px-2 text-gray-700 hover:text-library-600">
                Library Website
              </a>
            </li>
          </ul>
        </div>
      </nav> */}
    </header>
  );
}

