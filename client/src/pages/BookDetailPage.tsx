import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '@/layouts/Layout';
import { Book, Hold } from '@/types';
import bookService from '@/services/bookService';
import holdService from '@/services/holdService';
import ratingService from '@/services/ratingService';
import readingListService from '@/services/readingListService';
import notifyRequestService from '@/services/notifyRequestService';
import BookCover from '@/components/books/BookCover';
import StarRating from '@/components/books/StarRating';
import { useAuthStore, selectIsAuthenticated } from '@/store/useAuthStore';
import { useUIStore } from '@/store/useUIStore';
import { getApiErrorMessage } from '@/services/api';

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const addToast = useUIStore((s) => s.addToast);
  const [book, setBook] = useState<Book | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);
  const [isRatingLoading, setIsRatingLoading] = useState(false);
  const [holdForBook, setHoldForBook] = useState<Hold | null>(null);
  const [holdMessage, setHoldMessage] = useState<string | null>(null);
  const [holdError, setHoldError] = useState<string | null>(null);
  const [inReadingList, setInReadingList] = useState(false);
  const [notifyRequested, setNotifyRequested] = useState(false);
  const [isReadingListLoading, setIsReadingListLoading] = useState(false);
  const [isNotifyLoading, setIsNotifyLoading] = useState(false);

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

  useEffect(() => {
    if (book?.title) {
      document.title = `${book.title} - Gotham City Public Library`;
    }
    return () => {
      document.title = 'Gotham City Public Library';
    };
  }, [book?.title]);

  useEffect(() => {
    if (!book || !isAuthenticated) {
      setHoldForBook(null);
      setInReadingList(false);
      setNotifyRequested(false);
      return;
    }
    const fetchHoldsAndStatus = async () => {
      try {
        const [holdRes, listRes, notifyRes] = await Promise.all([
          holdService.getMyHolds(),
          readingListService.check(book._id),
          notifyRequestService.check(book._id),
        ]);
        const myHold = holdRes.holds?.find(
          (h) => (typeof h.book === 'object' && h.book._id === book._id) || (typeof h.book === 'string' && h.book === book._id)
        );
        setHoldForBook(myHold ?? null);
        setInReadingList(listRes.inList ?? false);
        setNotifyRequested(notifyRes.notified ?? false);
      } catch {
        setHoldForBook(null);
        setInReadingList(false);
        setNotifyRequested(false);
      }
    };
    fetchHoldsAndStatus();
  }, [book?._id, isAuthenticated]);

  const handlePlaceHold = async () => {
    if (!book) return;
    setIsActionLoading(true);
    setHoldError(null);
    setHoldMessage(null);
    try {
      const res = await holdService.placeHold(book._id);
      setHoldMessage(res.message || 'Hold placed; pending admin approval.');
      const res2 = await holdService.getMyHolds();
      const myHold = res2.holds?.find(
        (h) => (typeof h.book === 'object' && h.book._id === book._id) || (typeof h.book === 'string' && h.book === book._id)
      );
      setHoldForBook(myHold ?? null);
    } catch (err) {
      setHoldError(getApiErrorMessage(err));
    } finally {
      setIsActionLoading(false);
    }
  };

  const handleReadingListToggle = async () => {
    if (!book) return;
    setIsReadingListLoading(true);
    try {
      if (inReadingList) {
        await readingListService.remove(book._id);
        setInReadingList(false);
        addToast({ type: 'success', message: 'Removed from reading list' });
      } else {
        await readingListService.add(book._id);
        setInReadingList(true);
        addToast({ type: 'success', message: 'Added to reading list' });
      }
    } catch (err) {
      addToast({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsReadingListLoading(false);
    }
  };

  const handleShare = async () => {
    if (!book) return;
    const url = `${window.location.origin}/books/${book._id}`;
    const shareData = { title: book.title, text: `${book.title} by ${book.author}`, url };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        addToast({ type: 'success', message: 'Shared!' });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(url);
          addToast({ type: 'success', message: 'Link copied to clipboard' });
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
      addToast({ type: 'success', message: 'Link copied to clipboard' });
    }
  };

  const handleNotifyToggle = async () => {
    if (!book) return;
    if (book.available) return;
    setIsNotifyLoading(true);
    try {
      if (notifyRequested) {
        await notifyRequestService.remove(book._id);
        setNotifyRequested(false);
        addToast({ type: 'success', message: 'Notification removed' });
      } else {
        await notifyRequestService.add(book._id);
        setNotifyRequested(true);
        addToast({ type: 'success', message: "We'll email you when it's available" });
      }
    } catch (err) {
      addToast({ type: 'error', message: getApiErrorMessage(err) });
    } finally {
      setIsNotifyLoading(false);
    }
  };

  const handleRateBook = async (rating: number) => {
    if (!book) return;
    setIsRatingLoading(true);
    try {
      await ratingService.submitRating(book._id, rating);
      const response = await bookService.getBookById(book._id);
      if (response.success && response.book) {
        setBook(response.book);
      }
    } catch (err) {
      console.error('Failed to submit rating:', err);
    } finally {
      setIsRatingLoading(false);
    }
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
              <div className="relative w-full group">
                <BookCover
                  title={book.title}
                  author={book.author}
                  coverUrl={book.imageLink}
                  size="xl"
                  className="!w-full lg:w-72 lg:h-96 shadow-2xl"
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
              <div className="flex items-center gap-6 mt-8 text-white/70 w-full justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{book.quantity}</div>
                  <div className="text-xs uppercase tracking-wide">Copies</div>
                </div>
                {/* <div className="w-px h-10 bg-white/20"></div> */}
                {/* <div className="text-center">
                  <div className="text-2xl font-bold text-library-accent">${book.price.toFixed(2)}</div>
                  <div className="text-xs uppercase tracking-wide">Value</div>
                </div> */}
              </div>

              {/* Hold message / error */}
              {holdMessage && (
                <p className="w-full mt-2 text-sm text-emerald-400">{holdMessage}</p>
              )}
              {holdError && (
                <p className="w-full mt-2 text-sm text-red-400">{holdError}</p>
              )}

              {/* Action Buttons */}
              <div className="w-full mt-8 space-y-3">
                {isAuthenticated ? (
                  <button
                    onClick={handlePlaceHold}
                    disabled={
                      !book.available ||
                      isActionLoading ||
                      !!(holdForBook && (holdForBook.status === 'pending' || holdForBook.status === 'approved'))
                    }
                    className={`w-full py-3.5 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2
                      ${book.available && !holdForBook?.status
                        ? 'bg-library-accent hover:bg-library-accent/90 shadow-lg shadow-library-accent/30 hover:shadow-xl hover:shadow-library-accent/40'
                        : (holdForBook?.status === 'pending' || holdForBook?.status === 'approved')
                          ? 'bg-white/10 cursor-not-allowed'
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
                    ) : holdForBook?.status === 'pending' ? (
                      'Pending approval'
                    ) : holdForBook?.status === 'approved' ? (
                      'Hold approved – come pick up'
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                        {book.available ? 'Place Hold' : 'Join Waitlist'}
                      </>
                    )}
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-3.5 rounded-lg font-semibold text-white bg-white/10 border border-white/20 flex items-center justify-center gap-2 hover:bg-white/15 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    Log in to place a hold
                  </Link>
                )}

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
                {book.subtitle && (
                  <p className="text-lg text-white/80 mb-2">{book.subtitle}</p>
                )}
                <p className="text-xl text-library-accent font-medium">
                  by {book.author}
                </p>
              </div>

              {/* Rating Section */}
              <div className="flex flex-wrap items-center gap-4 pb-6 border-b border-white/10">
                {book.averageRating != null && book.ratingCount != null && book.ratingCount > 0 ? (
                  <>
                    <StarRating rating={book.averageRating} size="md" showValue />
                    <span className="text-white/50 text-sm">•</span>
                    <span className="text-white/70 text-sm">
                      {book.ratingCount} {book.ratingCount === 1 ? 'rating' : 'ratings'}
                    </span>
                  </>
                ) : (
                  <span className="text-white/50 text-sm">No ratings yet</span>
                )}
                {isAuthenticated && (
                  <div className="flex items-center gap-2 ml-auto">
                    <span className="text-white/70 text-sm">
                      {book.userRating != null ? 'Your rating:' : 'Rate this book:'}
                    </span>
                    <StarRating
                      rating={book.userRating ?? 0}
                      size="md"
                      showValue={book.userRating != null}
                      interactive={!isRatingLoading}
                      onChange={handleRateBook}
                    />
                  </div>
                )}
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
                  {book.genre && <DetailItem label="Genre" value={book.genre} />}
                  {book.language && <DetailItem label="Language" value={book.language} />}
                  {book.yearPublished != null && <DetailItem label="Year Published" value={String(book.yearPublished)} />}
                  {book.publisher && <DetailItem label="Publisher" value={book.publisher} />}
                  {book.pages != null && <DetailItem label="Pages" value={String(book.pages)} />}
                  {book.isbn && <DetailItem label="ISBN" value={book.isbn} />}
                  <DetailItem label="Added to Catalog" value={formatDate(book.createdAt)} />
                  <DetailItem label="Last Updated" value={formatDate(book.updatedAt)} />
                </div>
              </div>

              {/* Related Actions */}
              <div className="flex flex-wrap gap-3 pt-4">
                <ActionChip
                  disabled={!isAuthenticated}
                  loading={isReadingListLoading}
                  active={inReadingList}
                  onClick={handleReadingListToggle}
                  icon={
                    <svg className="w-4 h-4" fill={inReadingList ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  }
                  label={inReadingList ? 'In Reading List' : 'Add to Reading List'}
                />
                <ActionChip
                  disabled={false}
                  onClick={handleShare}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                    </svg>
                  }
                  label="Share"
                />
                <ActionChip
                  disabled={!isAuthenticated || book.available}
                  loading={isNotifyLoading}
                  active={notifyRequested}
                  onClick={handleNotifyToggle}
                  icon={
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                  }
                  label={
                    book.available
                      ? 'Available now'
                      : notifyRequested
                        ? "We'll notify you"
                        : 'Notify When Available'
                  }
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

function ActionChip({
  icon,
  label,
  disabled = false,
  loading = false,
  active = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
  loading?: boolean;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-full border text-sm transition-all
        ${disabled || loading
          ? 'bg-white/5 border-white/10 text-white/40 cursor-not-allowed'
          : active
            ? 'bg-library-accent/20 border-library-accent/40 text-library-accent hover:bg-library-accent/30'
            : 'bg-white/5 border-white/10 text-white/80 hover:bg-white/10 hover:text-white'
        }`}
      title={disabled ? 'Log in to use this feature' : undefined}
    >
      {loading ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon
      )}
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

