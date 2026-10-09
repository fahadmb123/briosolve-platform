import { AppRouter } from './router/index';
import '../App.css';
import '../shared/styles/global.css';
import '../shared/styles/user-theme.css';
import '../shared/styles/provider-theme.css';
import '../shared/styles/admin-theme.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { useAuthStore, type IAuthUser } from '../store/auth/auth.store';
import { useGetMe } from '../modules/auth/hooks/mutations/use-otp-varify';
import { LoadingScreen } from '../shared/components/ui/LoadingScreen/LoadingScreen';






function App() {
  const getMe = useGetMe()
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const response = await getMe.mutateAsync()
        const userData = response.data;
        useAuthStore.getState().setUser(userData)
        useAuthStore.getState().setProfile(userData.customer_profile || null)
      } catch {
        useAuthStore.getState().clearAuth()
      } finally {
        setIsInitializing(false);
      }
    })()
  },[])
  return (
    <ThemeProvider>
      <div className="app">
        {isInitializing ? (<LoadingScreen isLoading={true}/>) : (
          <>
            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover toastClassName="custom-premium-toast" closeButton={false} stacked />
            <AppRouter />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
