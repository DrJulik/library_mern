import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '@/store';

interface PublicRouteProps {
  children?: React.ReactNode;
  redirectTo?: string;
}

/**
 * PublicRoute - For pages like login/register
 * Redirects authenticated users to dashboard
 */
export default function PublicRoute({ children, redirectTo = '/dashboard' }: PublicRouteProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

