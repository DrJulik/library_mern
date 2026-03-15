import { useEffect } from 'react';
import Router from './router';
import Toaster from './components/ui/Toaster';
import { useAuthStore } from './store';

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <>
      <Router />
      <Toaster />
    </>
  );
}

export default App;
