import { useMemo, useState, useEffect } from 'react';

interface BookCoverProps {
  title: string;
  author?: string;
  coverUrl?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showOverlay?: boolean;
  overlayContent?: React.ReactNode;
  /** When true, cover fills its container (e.g. grid cell with aspect ratio) instead of fixed size */
  fillContainer?: boolean;
}

// Generate a consistent color based on the book title
const generateBookColor = (title: string): { from: string; to: string; accent: string } => {
  const colors = [
    { from: '#1e3a5f', to: '#0d1b2a', accent: '#4a90a4' },  // Deep navy
    { from: '#2d4a3e', to: '#1a2e25', accent: '#5a9178' },  // Forest green
    { from: '#4a3728', to: '#2a1f17', accent: '#8b7355' },  // Rich brown
    { from: '#3d2c4a', to: '#1f1628', accent: '#7a5c8a' },  // Deep purple
    { from: '#4a2c2c', to: '#2a1a1a', accent: '#8a5c5c' },  // Burgundy
    { from: '#2c3a4a', to: '#1a242e', accent: '#5c7a9a' },  // Slate blue
    { from: '#4a3d2c', to: '#2e2519', accent: '#9a8a5c' },  // Olive gold
    { from: '#2c4a4a', to: '#1a2e2e', accent: '#5c9a9a' },  // Teal
  ];
  
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

// Size configurations
const sizeConfig = {
  xs: { wrapper: 'w-12 h-16', title: 'text-[8px]', icon: 'text-lg' },
  sm: { wrapper: 'w-16 h-20', title: 'text-[9px]', icon: 'text-xl' },
  md: { wrapper: 'w-24 h-32', title: 'text-xs', icon: 'text-2xl' },
  lg: { wrapper: 'w-32 h-44', title: 'text-sm', icon: 'text-3xl' },
  xl: { wrapper: 'w-40 h-56', title: 'text-base', icon: 'text-4xl' },
};

export default function BookCover({
  title,
  author,
  coverUrl,
  size = 'md',
  className = '',
  showOverlay = false,
  overlayContent,
  fillContainer = false,
}: BookCoverProps) {
  const colors = useMemo(() => generateBookColor(title), [title]);
  const config = sizeConfig[size];
  const wrapperClass = fillContainer ? 'w-full h-full' : config.wrapper;
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [coverUrl]);

  if (coverUrl && !imageFailed) {
    return (
      <div className={`${wrapperClass} relative rounded-sm overflow-hidden ${className}`}>
        <img
          src={coverUrl}
          alt={`${title} cover`}
          className="w-full h-full object-cover"
          onError={() => setImageFailed(true)}
        />
        {showOverlay && overlayContent && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            {overlayContent}
          </div>
        )}
      </div>
    );
  }

  return (
    <div 
      className={`${wrapperClass} relative rounded-sm overflow-hidden flex flex-col ${className}`}
      style={{
        background: `linear-gradient(135deg, ${colors.from} 0%, ${colors.to} 100%)`,
      }}
    >
      {/* Decorative spine effect */}
      <div 
        className="absolute left-0 top-0 bottom-0 w-[3px]"
        style={{ backgroundColor: colors.accent }}
      />
      
      {/* Book content */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 text-center">
        <div 
          className={`${config.icon} mb-1 opacity-30`}
          style={{ color: colors.accent }}
        >
          📖
        </div>
        <span 
          className={`${config.title} font-medium text-white/90 line-clamp-2 leading-tight`}
        >
          {title}
        </span>
        {author && size !== 'xs' && size !== 'sm' && (
          <span className={`${config.title} text-white/60 line-clamp-1 mt-1`}>
            {author}
          </span>
        )}
      </div>
      
      {/* Decorative bottom accent */}
      <div 
        className="h-1 w-full"
        style={{ backgroundColor: colors.accent }}
      />
      
      {showOverlay && overlayContent && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          {overlayContent}
        </div>
      )}
    </div>
  );
}

