import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { Book } from '@/types';
import bookService from '@/services/bookService';
import BookCover from '@/components/books/BookCover';
import StarRating from '@/components/books/StarRating';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    const fetchBook = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await bookService.getBookById(id);
        if (response.success && response.book) {
          setBook(response.book);
        } else {
          setError('Book not found');
        }
      } catch (err) {
        console.error('Failed to fetch book:', err);
        setError('Failed to load book details');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  const handlePlaceHold = async () => {
    if (!book) return;
    setIsActionLoading(true);
    // TODO: Implement place hold functionality when borrow service supports it
    setTimeout(() => {
      setIsActionLoading(false);
      // Show success message or handle the action
    }, 1000);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-library-900 via-library-800 to-library-700">
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
                <p className="mt-4 text-white/70">Loading book details...</p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !book) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-b from-library-900 via-library-800 to-library-700">
          <div className="container mx-auto px-4 py-12">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mb-6">
                <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Book Not Found</h2>
              <p className="text-white/60 mb-6">{error || "The book you're looking for doesn't exist."}</p>
              <Link 
                to="/books" 
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-library-accent text-white rounded-lg hover:bg-library-accent/90 transition-colors font-medium"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Catalog
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-library-900 via-library-800 to-library-700">
        {/* Breadcrumb */}
        <div className="bg-library-900/50 border-b border-white/10">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center gap-2 text-sm">
              <Link to="/books" className="text-white/60 hover:text-white transition-colors">
                Catalog
              </Link>
              <svg className="w-4 h-4 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="text-white/90 font-medium truncate max-w-[200px]">{book.title}</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8 lg:py-12">
          <div className="grid lg:grid-cols-[320px_1fr] gap-8 lg:gap-12">
            {/* Left Column - Book Cover */}
            <div className="flex flex-col items-center lg:items-start">
              <div className="relative group">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverUrl={book.imageLink}
                  size="xl"
                  className="w-64 h-80 lg:w-72 lg:h-96 shadow-2xl"
                />
                
                {/* Availability Badge */}
                <div className={`absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-sm font-medium shadow-lg
                  ${book.available 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-red-500 text-white'
                  }`}
                >
                  {book.available ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Available
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Checked Out
                    </span>
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-6 mt-8 text-white/70">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{book.quantity}</div>
                  <div className="text-xs uppercase tracking-wide">Copies</div>
                </div>
                <div className="w-px h-10 bg-white/20"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-library-accent">${book.price.toFixed(2)}</div>
                  <div className="text-xs uppercase tracking-wide">Value</div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-full mt-8 space-y-3">
                <button
                  onClick={handlePlaceHold}
                  disabled={!book.available || isActionLoading}
                  className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2
                    ${book.available 
                      ? 'bg-library-accent hover:bg-library-accent/90 shadow-lg shadow-library-accent/30 hover:shadow-xl hover:shadow-library-accent/40' 
                      : 'bg-white/10 cursor-not-allowed'
                    }
                    ${isActionLoading ? 'opacity-70 cursor-wait' : ''}
                  `}
                >
                  {isActionLoading ? (
                    <>
                      <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      {book.available ? 'Place Hold' : 'Join Waitlist'}
                    </>
                  )}
                </button>

                <button
                  onClick={() => navigate(-1)}
                  className="w-full py-3 rounded-lg font-medium text-white/80 bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Go Back
                </button>
              </div>
            </div>

            {/* Right Column - Book Details */}
            <div className="space-y-8">
              {/* Title Section */}
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white leading-tight mb-3">
                  {book.title}
                </h1>
                <p className="text-xl text-library-accent font-medium">
                  by {book.author}
                </p>
              </div>

              {/* Rating Section - Placeholder for now */}
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <StarRating rating={4.5} size="md" showValue />
                <span className="text-white/50 text-sm">•</span>
                <span className="text-white/70 text-sm">Based on library ratings</span>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-library-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
                  </svg>
                  Description
                </h2>
                <p className="text-white/80 leading-relaxed">
                  {book.description || 'No description available for this book.'}
                </p>
              </div>

              {/* Book Details Grid */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-library-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Book Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <DetailItem label="Author" value={book.author} />
                  <DetailItem label="Availability" value={book.available ? 'Available' : 'Checked Out'} />
                  <DetailItem label="Copies in Library" value={book.quantity.toString()} />
                  <DetailItem label="Price Value" value={`$${book.price.toFixed(2)}`} />
                  <DetailItem label="Added to Catalog" value={formatDate(book.createdAt)} />
                  <DetailItem label="Last Updated" value={formatDate(book.updatedAt)} />
                </div>
              </div>

              {/* Related Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <ActionChip 
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  }
                  label="Add to Reading List"
                />
                <ActionChip 
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  }
                  label="Share"
                />
                <ActionChip 
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  }
                  label="Notify When Available"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Helper Components
function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col">
      <span className="text-white/50 text-sm mb-1">{label}</span>
      <span className="text-white font-medium">{value}</span>
    </div>
  );
}

function ActionChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 hover:text-white transition-all text-sm">
      {icon}
      {label}
    </button>
  );
}

function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return 'Unknown';
  }
}

