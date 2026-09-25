import { AppRouter } from './app/router';
import './App.css';
import './shared/styles/global.css';
import './shared/styles/user-theme.css';
import './shared/styles/provider-theme.css';
import './shared/styles/admin-theme.css';
import { ToastContainer } from 'react-toastify';
import { ThemeProvider } from './app/providers/ThemeProvider';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <ToastContainer/>
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
