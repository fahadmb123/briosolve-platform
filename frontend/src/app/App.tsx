import { AppRouter } from './router/index';
import '../App.css';
import '../shared/styles/global.css';
import '../shared/styles/user-theme.css';
import '../shared/styles/provider-theme.css';
import '../shared/styles/admin-theme.css';
import { Toaster, ToastBar, toast } from 'react-hot-toast';
import { ThemeProvider } from './providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { useAuthStore } from '../features/auth/stores/auth.store';
import { LoadingScreen } from '../shared/components/ui/LoadingScreen/LoadingScreen';
import { useNotificationSocket } from '../features/notifications/hooks/useNotificationSocket';
import { useChatUnreadSync } from '../features/chat';
import AccountSuspended from './pages/AccountSuspended/AccountSuspended';
import { useCheckNetworkStatus } from '../shared/hooks/useCheckNetworkStatus';
import { CallModalContainer } from '../features/communication';

const origSuccess = toast.success;
const origError = toast.error;
const origLoading = toast.loading;
const origCustom = toast.custom;

toast.success = ((message, opts) => {
  toast.remove();
  return origSuccess(message, opts);
}) as typeof toast.success;

toast.error = ((message, opts) => {
  toast.remove();
  return origError(message, opts);
}) as typeof toast.error;

toast.loading = ((message, opts) => {
  toast.remove();
  return origLoading(message, opts);
}) as typeof toast.loading;

toast.custom = ((message, opts) => {
  toast.remove();
  return origCustom(message, opts);
}) as typeof toast.custom;

function App() {
  const fetchUser = useAuthStore((state) => state.fetchUser);
  const [isInitializing, setIsInitializing] = useState(true);
  const suspended = useAuthStore((state) => state.isSuspended);

  useNotificationSocket();
  useCheckNetworkStatus()
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
    return <AccountSuspended />;
  }

  return (
    <ThemeProvider>
      <div className="app">
        {isInitializing ? (
          <LoadingScreen isLoading={true} />
        ) : (
          <>
            <Toaster
              position="bottom-center"
              containerStyle={{ zIndex: 99999, bottom: 36 }}
              toastOptions={{
                position: 'bottom-center',
                duration: 3500,
                style: {
                  borderRadius: '9999px',
                  padding: '12px 32px',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  letterSpacing: '0.01em',
                  maxWidth: '520px',
                  textAlign: 'center',
                  justifyContent: 'center',
                },
                success: {
                  style: {
                    background: '#22C55E',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 25px -4px rgba(34, 197, 94, 0.45)',
                  },
                },
                error: {
                  style: {
                    background: '#EF4444',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 25px -4px rgba(239, 68, 68, 0.45)',
                  },
                },
                loading: {
                  style: {
                    background: '#1F2937',
                    color: '#FFFFFF',
                    boxShadow: '0 10px 25px -4px rgba(0, 0, 0, 0.35)',
                  },
                },
              }}
            >
              {(t) => (
                <ToastBar toast={t} position={t.position || 'bottom-center'} style={{ ...t.style }}>
                  {({ message }) => message}
                </ToastBar>
              )}
            </Toaster>
            <CallModalContainer />
            <AppRouter />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
