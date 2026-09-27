import { AppRouter } from './app/router';
import './App.css';
import './shared/styles/global.css';
import './shared/styles/user-theme.css';
import './shared/styles/provider-theme.css';
import './shared/styles/admin-theme.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { useEffect } from 'react';
import { useAuthStore, type IAuthUser } from './shared/stores/auth/auth.store';
import { useGetMe } from './features/authentication/public/model/use-otp-varify';
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen';






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
        {getMe.isPending ? (<LoadingScreen isLoading={true}/>):null }
        <ToastContainer/>
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
