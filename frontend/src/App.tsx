import { AppRouter } from './router';
import './App.css';
import './assets/css/global.css';
import './assets/css/user-theme.css';
import './assets/css/provider-theme.css';
import './assets/css/admin-theme.css';

function App() {
  return (
    <div className="app">
      <AppRouter />
    </div>
  );
}

export default App;
