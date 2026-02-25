import { Link } from 'react-router-dom';
import { Book } from '@/types';
import BookListItem from './BookListItem';

type ActivityType = 'borrowed' | 'returned' | 'rated' | 'commented' | 'added_to_shelf';

interface BookActivity {
  book: Book;
  type: ActivityType;
  date: Date | string;
  label?: string;
  rating?: number;
  comment?: string;
  shelfName?: string;
  dueDate?: Date | string;
  isOverdue?: boolean;
}

interface BookListProps {
  activities: BookActivity[];
  title?: string;
  subtitle?: string;
  showPrivacyToggle?: boolean;
  isPublic?: boolean;
  onTogglePrivacy?: () => void;
  viewAllLink?: string;
  viewAllLabel?: string;
  showMoreLink?: string;
  showMoreLabel?: string;
  // User info for all activities
  userName?: string;
  userInitial?: string;
  // Loading state
  isLoading?: boolean;
  // Empty state
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  className?: string;
}

export default function BookList({
  activities,
  title,
  subtitle,
  showPrivacyToggle = false,
  isPublic = true,
  onTogglePrivacy,
  viewAllLink,
  viewAllLabel = 'See all',
  showMoreLink,
  showMoreLabel = 'Show more',
  userName,
  userInitial,
  isLoading = false,
  emptyMessage = 'No recent activity',
  emptyIcon,
  className = '',
}: BookListProps) {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-library-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center ${className}`}>
        {emptyIcon || (
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
        <h3 className="text-gray-900 font-medium mb-1">{emptyMessage}</h3>
        <p className="text-gray-500 text-sm">Your activity will appear here.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden ${className}`}>
      {/* Header */}
      {(title || showPrivacyToggle) && (
        <div className="px-6 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
              {showPrivacyToggle && (
                <span className="flex items-center gap-1 text-sm text-gray-500">
                  {isPublic ? (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      Your activity feed is public.
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                      Your activity feed is private.
                    </>
                  )}
                  {onTogglePrivacy && (
                    <button 
                      onClick={onTogglePrivacy}
                      className="text-library-600 hover:underline ml-1"
                    >
                      Make {isPublic ? 'private' : 'public'}
                    </button>
                  )}
                </span>
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
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
      )}

      {/* Activity Items */}
      <div className="divide-y divide-gray-100">
        {activities.map((activity, index) => (
          <BookListItem
            key={`${activity.book._id}-${index}`}
            book={activity.book}
            activityType={activity.type}
            activityDate={activity.date}
            activityLabel={activity.label}
            userName={userName}
            userInitial={userInitial}
            showRating={activity.type === 'rated'}
            rating={activity.rating}
            comment={activity.comment}
            shelfName={activity.shelfName}
            dueDate={activity.dueDate}
            isOverdue={activity.isOverdue}
            showDescription={activity.type !== 'rated' && activity.type !== 'commented'}
          />
        ))}
      </div>

      {/* Footer with Show More */}
      {showMoreLink && (
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
          <Link 
            to={showMoreLink}
            className="w-full block text-center py-2 text-sm font-medium text-library-600 hover:text-library-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {showMoreLabel}
          </Link>
        </div>
      )}
    </div>
  );
}

