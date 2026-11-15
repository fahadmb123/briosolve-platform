import { AppRouter } from './router/index';
import { BrowserRouter } from 'react-router-dom';
import '../App.css';
import '../shared/styles/global.css';
import '../shared/styles/user-theme.css';
import '../shared/styles/provider-theme.css';
import '../shared/styles/admin-theme.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../features/auth/stores/auth.store';
import { LoadingScreen } from '../shared/components/ui/LoadingScreen/LoadingScreen';
import { useNotificationSocket } from '../features/notifications/hooks/useNotificationSocket';
import { useChatUnreadSync } from '../features/chat';
import AccountSuspended from './pages/AccountSuspended/AccountSuspended';
import { useCheckNetworkStatus } from '../shared/hooks/useCheckNetworkStatus';
import { CallModalContainer } from '../features/communication';
import { AppToaster } from '../shared/components/ui/Toast';

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [isInitializing, setIsInitializing] = useState(true);
  const suspended = useAuthStore((state) => state.isSuspended);

  useNotificationSocket();
  useCheckNetworkStatus();
  useChatUnreadSync();

  useEffect(() => {
    fetchUser().finally(() => {
      setIsInitializing(false);
    });
  }, [fetchUser]);

  const isVisitingAllowedPage =
    window.location.pathname === '/account/request' ||
    window.location.pathname === '/login';

  if (suspended && !isVisitingAllowedPage) {
    return (
      <ThemeProvider>
        <BrowserRouter>
          <AccountSuspended />
        </BrowserRouter>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="app">
        {isInitializing ? (
          <LoadingScreen isLoading={true} />
        ) : (
          <>
            <AppToaster />
            <CallModalContainer />
            <AppRouter />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
