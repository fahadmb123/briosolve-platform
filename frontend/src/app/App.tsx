import { AppRouter } from './router/index';
import '../App.css';
import '../shared/styles/global.css';
import '../shared/styles/user-theme.css';
import '../shared/styles/provider-theme.css';
import '../shared/styles/admin-theme.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ThemeProvider } from './providers/ThemeProvider';
import { useEffect } from 'react';
import { useAuthStore, type IAuthUser } from '../store/auth/auth.store';
import { useGetMe } from '../modules/auth/hooks/mutations/use-otp-varify';
import { LoadingScreen } from '../shared/components/ui/LoadingScreen/LoadingScreen';






function App() {
  const getMe = useGetMe()

  useEffect(()=>{
    (async ()=>{
      try {
        const response = await getMe.mutateAsync()
        useAuthStore.getState().setUser(response.data as unknown as IAuthUser)
      } catch {
        useAuthStore.getState().clearAuth()
      }
    })()
  },[])
  return (
    <ThemeProvider>
      <div className="app">
        {getMe.isPending ? (<LoadingScreen isLoading={true}/>) : (
          <>
            <ToastContainer position="top-center" autoClose={1000} hideProgressBar={true} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover toastClassName="custom-premium-toast" closeButton={false} />
            <AppRouter />
          </>
        )}
      </div>
    </ThemeProvider>
  );
}

export default App;
