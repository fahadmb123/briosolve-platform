import { AppRouter } from './app/router';
import './App.css';
import './shared/styles/global.css';
import './shared/styles/user-theme.css';
import './shared/styles/provider-theme.css';
import './shared/styles/admin-theme.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './app/providers/ThemeProvider';
import { useEffect, useState } from 'react';
import { useAuthStore, type IAuthUser } from './shared/stores/auth/auth.store';
import { useGetMe } from './features/authentication/public/model/use-otp-varify';
import { LoadingScreen } from './shared/ui/LoadingScreen/LoadingScreen';






function App() {
  const getMe = useGetMe()
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(()=>{
    (async ()=>{
      try {
        const response = await getMe.mutateAsync()
        const user:IAuthUser = JSON.parse(response.data)
        useAuthStore.getState().setUser(user)
      } catch {
        useAuthStore.getState().clearAuth()
      } finally {
        setTimeout(()=>{setIsInitialLoading(false)},3000)
      }
    })()
  },[])
  return (
    <ThemeProvider>
      <div className="app">
        <LoadingScreen isLoading={getMe.isPending || isInitialLoading} />
        <ToastContainer/>
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
