import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated, selectIsAdmin, selectIsLoading } from '@/stores';

interface AdminRouteProps {
  children?: React.ReactNode;
}

export default function AdminRoute({ children }: AdminRouteProps) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const isAdmin = useAuthStore(selectIsAdmin);
  const isLoading = useAuthStore(selectIsLoading);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children ? <>{children}</> : <Outlet />;
}

