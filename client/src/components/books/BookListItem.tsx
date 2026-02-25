import { Link } from 'react-router-dom';
import { Book } from '@/types';
import BookCover from './BookCover';
import StarRating from './StarRating';

type ActivityType = 'borrowed' | 'returned' | 'rated' | 'commented' | 'added_to_shelf';

interface BookListItemProps {
  book: Book;
  // Activity info
  activityType?: ActivityType;
  activityDate?: Date | string;
  activityLabel?: string;
  // User info for activity
  userName?: string;
  userAvatar?: string;
  userInitial?: string;
  // Book details
  showDescription?: boolean;
  showRating?: boolean;
  rating?: number;
  onRatingChange?: (rating: number) => void;
  // Comment/review info
  comment?: string;
  // Shelf info
  shelfName?: string;
  // Due date info
  dueDate?: Date | string;
  isOverdue?: boolean;
  // Action
  showAction?: boolean;
  actionLabel?: string;
  onAction?: (book: Book) => void;
  isActionLoading?: boolean;
  // Styling
  className?: string;
  linkTo?: string;
}

const activityConfig: Record<ActivityType, { icon: JSX.Element; color: string; defaultLabel: string }> = {
  borrowed: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    color: 'text-library-600',
    defaultLabel: 'Borrowed a book',
  },
  returned: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    color: 'text-green-600',
    defaultLabel: 'Returned a book',
  },
  rated: {
    icon: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
      </svg>
    ),
    color: 'text-amber-500',
    defaultLabel: 'Rated a title',
  },
  commented: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    color: 'text-blue-600',
    defaultLabel: 'Made a comment',
  },
  added_to_shelf: {
    icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
      </svg>
    ),
    color: 'text-library-600',
    defaultLabel: 'Added to shelf',
  },
};

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
}

export default function BookListItem({
  book,
  activityType,
  activityDate,
  activityLabel,
  userName,
  userAvatar,
  userInitial,
  showDescription = true,
  showRating = false,
  rating,
  onRatingChange,
  comment,
  shelfName,
  dueDate,
  isOverdue = false,
  showAction = false,
  actionLabel = 'View details',
  onAction,
  isActionLoading = false,
  className = '',
  linkTo,
}: BookListItemProps) {
  const activity = activityType ? activityConfig[activityType] : null;

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAction?.(book);
  };

  const content = (
    <div className={`p-4 hover:bg-gray-50 transition-colors ${className}`}>
      <div className="flex gap-4">
        {/* User Avatar (for activity feed) */}
        {(userName || userInitial) && (
          <div className="flex-shrink-0">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName} 
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-library-600 text-white flex items-center justify-center text-sm font-medium">
                {userInitial || userName?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
          </div>
        )}
        
        {/* Activity Content */}
        <div className="flex-1 min-w-0">
          {/* Activity header */}
          {activity && (
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
              <span className={`inline-flex items-center gap-1 ${activity.color}`}>
                {activity.icon}
                {activityLabel || activity.defaultLabel}
              </span>
              {activityDate && (
                <>
                  <span className="text-gray-400">•</span>
                  <span>{formatDate(activityDate)}</span>
                </>
              )}
            </div>
          )}
          
          <div className="flex gap-4">
            {/* Book Cover */}
            <div className="flex-shrink-0">
              <BookCover
                title={book.title}
                author={book.author}
                size="sm"
              />
            </div>
            
            {/* Book Info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-library-600 hover:underline cursor-pointer line-clamp-1">
                {book.title}
              </h4>
              <p className="text-sm text-library-500 line-clamp-1">{book.author}</p>
              
              {/* Rating */}
              {showRating && rating !== undefined && (
                <div className="mt-1 flex items-center gap-2">
                  <span className="text-sm text-gray-500">Your rating</span>
                  <StarRating 
                    rating={rating} 
                    size="sm" 
                    interactive={!!onRatingChange}
                    onChange={onRatingChange}
                  />
                </div>
              )}
              
              {/* Comment/Review */}
              {comment && (
                <p className="text-sm text-gray-600 mt-2 italic">
                  "{comment}" <Link to="#" className="text-library-600 hover:underline not-italic">Permalink</Link>
                </p>
              )}
              
              {/* Description */}
              {showDescription && book.description && !comment && (
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                  {book.description}
                </p>
              )}
              
              {/* Shelf info */}
              {shelfName && (
                <p className="text-sm text-gray-500 mt-1">
                  Added to your <Link to="#" className="text-library-600 hover:underline font-medium">{shelfName}</Link> shelf
                </p>
              )}
              
              {/* Due date */}
              {dueDate && (
                <p className={`text-sm mt-1 ${isOverdue ? 'text-red-600 font-medium' : 'text-gray-400'}`}>
                  {isOverdue ? '⚠️ Overdue!' : `Due: ${formatDate(dueDate)}`}
                </p>
              )}
              
              {/* Action button */}
              {showAction && (
                <button
                  onClick={handleAction}
                  disabled={isActionLoading}
                  className="mt-2 px-4 py-1.5 text-sm font-medium text-library-600 border border-library-600 rounded hover:bg-library-50 transition-colors disabled:opacity-50"
                >
                  {isActionLoading ? 'Loading...' : actionLabel}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="block">
        {content}
      </Link>
    );
  }

  return content;
}

