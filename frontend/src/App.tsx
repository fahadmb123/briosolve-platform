import { AppRouter } from './router';
import './App.css';
import './assets/css/global.css';
import './assets/css/user-theme.css';
import './assets/css/provider-theme.css';
import './assets/css/admin-theme.css';

import { ThemeProvider } from './contexts/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="app">
        <AppRouter />
      </div>
    </ThemeProvider>
  );
}

export default App;
