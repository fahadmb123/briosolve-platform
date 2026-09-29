import './NotFound.css';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../shared/hooks/useTheme';


export default function NotFound() {
  const { toggleTheme } = useTheme();

  return (
    <div className="notfound-wrapper">
        <button onClick={toggleTheme} id="theme-toggle" className="btn-icon auth-theme-toggle" aria-label="Toggle Theme">
            <i className="fas fa-sun"></i>
        </button>

        <div className="notfound-bg-text">404</div>

        <div className="notfound-content">
            <h1 className="notfound-title">404</h1>
            <h2 className="notfound-subtitle">Page Not Found</h2>
            <p className="notfound-description">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>

            <div className="notfound-actions">
                <Link to="/" className="btn btn-primary btn-lg">
                    <i className="fas fa-home mr-2"></i> Back to Home
                </Link>
                <button onClick={() => window.history.back()} className="btn btn-outline btn-lg">
                    <i className="fas fa-arrow-left mr-2"></i> Go Back
                </button>
            </div>
        </div>
    </div>
  );
}
