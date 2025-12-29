import { useEffect } from 'react';

/**
 * Hook to set the page title
 * @param title - The title to set (will be appended to base title)
 * @param baseTitle - Optional base title (defaults to "Library Management System")
 */
export function usePageTitle(title: string, baseTitle = 'Library Management System') {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = title ? `${title} - ${baseTitle}` : baseTitle;

    return () => {
      document.title = previousTitle;
    };
  }, [title, baseTitle]);
}

