import './NotFound.css';
import { Link } from 'react-router-dom';
import { useTheme } from '../../../shared/hooks/useTheme';

export default function NotFound() {
  const { toggleTheme } = useTheme();

  return (
    <div className="notfound-wrapper">
      <div className="notfound-header">
        <Link to="/" className="notfound-brand-link" aria-label="Briosolve Home">
          <img src="/briosolve-text-logo.svg" alt="Briosolve" className="notfound-brand-text-logo" />
        </Link>

        <button
          onClick={toggleTheme}
          className="notfound-logo-btn"
          aria-label="Toggle Theme"
          title="Toggle Theme"
          type="button"
        >
          <img src="/briosolve-logo.svg" alt="Briosolve" className="notfound-brand-logo-img" />
        </button>
      </div>

      <div className="notfound-content">
        <div className="notfound-image-container">
          <img
            src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794737367/404.png"
            alt="404 Page Not Found"
            className="notfound-image"
          />
        </div>

        <h1 className="notfound-title">Uh-oh, page not found...</h1>

        <div className="notfound-actions">
          <Link to="/" className="notfound-home-btn">
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
