import { Link } from 'react-router-dom';
import { Book } from '@/types';
import BookCover from './BookCover';
import StarRating from './StarRating';

export type BookCardVariant = 'default' | 'compact' | 'detailed';

interface BookCardProps {
  book: Book;
  variant?: BookCardVariant;
  showRating?: boolean;
  rating?: number;
  showAction?: boolean;
  actionLabel?: string;
  onAction?: (book: Book) => void;
  isActionLoading?: boolean;
  badge?: {
    text: string;
    color: 'red' | 'green' | 'blue' | 'amber' | 'gray';
  };
  className?: string;
  linkTo?: string;
  linkToDetail?: boolean;
}

const badgeColors = {
  red: 'bg-red-500 text-white',
  green: 'bg-green-500 text-white',
  blue: 'bg-library-600 text-white',
  amber: 'bg-amber-500 text-white',
  gray: 'bg-gray-500 text-white',
};

export default function BookCard({
  book,
  variant = 'default',
  showRating = false,
  rating,
  showAction = true,
  actionLabel = 'Place hold',
  onAction,
  isActionLoading = false,
  badge,
  className = '',
  linkTo,
  linkToDetail = true,
}: BookCardProps) {
  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAction?.(book);
  };

  const coverSize = variant === 'compact' ? 'sm' : variant === 'detailed' ? 'lg' : 'md';

  const cardContent = (
    <div className={`group flex flex-col ${className}`}>
      {/* Book Cover - portrait aspect ratio (3:4) */}
      <div className="relative mb-2 w-full aspect-[3/4] overflow-hidden rounded-sm shadow-md group-hover:shadow-lg transition-shadow duration-200">
        <BookCover
          title={book.title}
          author={book.author}
          coverUrl={book.imageLink}
          size={coverSize}
          fillContainer
          className="absolute inset-0 w-full h-full rounded-sm"
        />
        
        {/* Badge overlay */}
        {badge && (
          <div className={`absolute top-2 right-2 px-2 py-0.5 text-xs font-medium rounded ${badgeColors[badge.color]}`}>
            {badge.text}
          </div>
        )}
      </div>

      {/* Book Info - min-height keeps button aligned when titles vary */}
      <div className="flex-1 min-w-0 min-h-[3.5rem] flex flex-col">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-library-600 transition-colors">
          {book.title}
        </h3>
        <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">
          {book.author}
        </p>
        {book.genre && (
          <span className="inline-block mt-1 text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 w-fit">
            {book.genre}
          </span>
        )}
        
        {/* Rating */}
        {showRating && rating !== undefined && (
          <div className="mt-1">
            <StarRating rating={rating} size="xs" />
          </div>
        )}
        
        {/* Description for detailed variant */}
        {variant === 'detailed' && book.description && (
          <p className="text-xs text-gray-500 line-clamp-2 mt-2">
            {book.description}
          </p>
        )}
      </div>

      {/* Action Button */}
      {showAction && (
        <button
          onClick={handleAction}
          disabled={isActionLoading || !book.available}
          className={`mt-2 w-full py-1.5 text-xs font-medium rounded transition-colors
            ${book.available 
              ? 'bg-library-600 text-white hover:bg-library-700' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }
            ${isActionLoading ? 'opacity-50 cursor-wait' : ''}
          `}
        >
          {isActionLoading ? (
            <span className="flex items-center justify-center gap-1">
              <svg className="animate-spin w-3 h-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Loading...
            </span>
          ) : (
            actionLabel
          )}
        </button>
      )}
    </div>
  );

  const targetLink = linkTo || (linkToDetail ? `/books/${book._id}` : null);

  if (targetLink) {
    return (
      <Link to={targetLink} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
}

