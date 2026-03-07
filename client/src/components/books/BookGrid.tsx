import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Book } from '@/types';
import BookCard, { BookCardVariant } from './BookCard';

interface BookGridProps {
  books: Book[];
  title?: string;
  viewAllLink?: string;
  viewAllLabel?: string;
  layout?: 'grid' | 'scroll';
  columns?: 2 | 3 | 4 | 5 | 6;
  variant?: BookCardVariant;
  showRating?: boolean;
  ratings?: Record<string, number>;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: (book: Book) => void;
  loadingBookIds?: string[];
  showDeleteButton?: boolean;
  onDelete?: (book: Book) => void;
  deletingBookIds?: string[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
  headerClassName?: string;
  availableCount?: number;
}

const gridColumnsClass = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 sm:grid-cols-3',
  4: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4',
  5: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5',
  6: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
};

export default function BookGrid({
  books,
  title,
  viewAllLink,
  viewAllLabel = 'View all',
  layout = 'grid',
  columns = 6,
  variant = 'default',
  showRating = false,
  ratings = {},
  showAction = true,
  actionLabel = 'Place hold',
  onAction,
  loadingBookIds = [],
  showDeleteButton = false,
  onDelete,
  deletingBookIds = [],
  emptyMessage = 'No books found',
  emptyIcon,
  className = '',
  headerClassName = '',
  availableCount,
}: BookGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [books.length]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (books.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center ${className}`}>
        {emptyIcon || (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        )}
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      {(title || viewAllLink || availableCount !== undefined) && (
        <div className={`px-6 py-4 border-b border-gray-100 ${headerClassName}`}>
          <div className="flex items-center justify-between">
            <div>
              {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
              {availableCount !== undefined && (
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {availableCount}+ available to borrow now
                </p>
              )}
            </div>
            {viewAllLink && (
              <Link 
                to={viewAllLink} 
                className="text-sm text-library-600 hover:text-library-700 hover:underline font-medium"
              >
                {viewAllLabel} →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {layout === 'scroll' ? (
          <div className="relative">
            {/* Scroll buttons */}
            {canScrollLeft && (
              <button
                onClick={() => scroll('left')}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            {canScrollRight && (
              <button
                onClick={() => scroll('right')}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white shadow-lg rounded-full flex items-center justify-center text-gray-600 hover:text-gray-900 transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}

            {/* Scrollable container */}
            <div
              ref={scrollRef}
              onScroll={checkScroll}
              className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 scroll-smooth"
              style={{ scrollSnapType: 'x mandatory' }}
            >
              {books.map((book) => (
                <div 
                  key={book._id} 
                  className="flex-shrink-0 w-32"
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <BookCard
                    book={book}
                    variant={variant}
                    showRating={showRating}
                    rating={ratings[book._id]}
                    showAction={showAction}
                    actionLabel={actionLabel}
                    onAction={onAction}
                    isActionLoading={loadingBookIds.includes(book._id)}
                    showDeleteButton={showDeleteButton}
                    onDelete={onDelete}
                    isDeleting={deletingBookIds.includes(book._id)}
                    linkTo={`/books/${book._id}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className={`grid ${gridColumnsClass[columns]} gap-4`}>
            {books.map((book) => (
              <BookCard
                key={book._id}
                book={book}
                variant={variant}
                showRating={showRating}
                rating={ratings[book._id]}
                showAction={showAction}
                actionLabel={actionLabel}
                onAction={onAction}
                isActionLoading={loadingBookIds.includes(book._id)}
                showDeleteButton={showDeleteButton}
                onDelete={onDelete}
                isDeleting={deletingBookIds.includes(book._id)}
                linkTo={`/books/${book._id}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

