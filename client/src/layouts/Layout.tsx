import { ReactNode, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { getPageTitle } from '@/utils/routeTitles';

interface LayoutProps {
  children: ReactNode;
}

const BASE_TITLE = 'Gotham City Public Library';

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const pageTitle = getPageTitle(location.pathname);

  useEffect(() => {
    if (pageTitle === BASE_TITLE) {
      document.title = BASE_TITLE;
    } else {
      document.title = `${pageTitle} - ${BASE_TITLE}`;
    }
  }, [pageTitle]);

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
      <Footer />
    </div>
  );
}

