import { useEffect } from 'react';
import Router from './router';
import { useAuthStore } from './stores';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Check authentication status on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return <Router />;
}

export default App;

