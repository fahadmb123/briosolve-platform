import { AppRouter } from './router/index';
import '../App.css';
import '../shared/styles/global.css';
import '../shared/styles/user-theme.css';
import '../shared/styles/provider-theme.css';
import '../shared/styles/admin-theme.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from './providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../features/auth/stores/auth.store';
import { LoadingScreen } from '../shared/components/ui/LoadingScreen/LoadingScreen';
import { useNotificationSocket } from '../features/notifications/hooks/useNotificationSocket';
import AccountSuspended from './pages/AccountSuspended/AccountSuspended';

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [isInitializing, setIsInitializing] = useState(true);
  const suspended = useAuthStore((state) => state.isSuspended);

  useNotificationSocket();

  useEffect(() => {
    fetchUser().finally(() => {
      setIsInitializing(false);
    });
  }, [fetchUser]);

  const isVisitingAllowedPage =
    window.location.pathname === '/account/request' ||
    window.location.pathname === '/login';

  if (suspended && !isVisitingAllowedPage) {
    return <AccountSuspended />;
  }

  return (
    <ThemeProvider>
      <div className="app">
        {isInitializing ? (
          <LoadingScreen isLoading={true} />
        ) : (
          <>
            <Toaster position="top-center" />
            <AppRouter />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
