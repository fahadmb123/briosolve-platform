import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../shared/hooks/useTheme';
import './AuthLayout.css';

const heroSlides = [
  {
    title: 'Carpenters',
    image: 'https://res.cloudinary.com/zjhxcdmi/image/upload/v1794674826/carpenters.jpg'
  },
  {
    title: 'Electricians',
    image: 'https://res.cloudinary.com/zjhxcdmi/image/upload/v1794675433/electrician.jpg'
  },
  {
    title: 'Cleaners',
    image: 'https://res.cloudinary.com/zjhxcdmi/image/upload/v1794675817/cleaners-new.jpg'
  },
  {
    title: 'Plumbers',
    image: 'https://res.cloudinary.com/zjhxcdmi/image/upload/v1794675957/plumbers.jpg'
  }
];

const extendedSlides = [
  heroSlides[heroSlides.length - 1],
  ...heroSlides,
  heroSlides[0]
];

export default function AuthLayout() {
  const { toggleTheme } = useTheme();
  const location = useLocation();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const isLogin = location.pathname === '/login' || location.pathname === '/login/';
  const isProviderRegister = location.pathname.startsWith('/provider/register');

  const handleNextSlide = () => {
    setIsTransitioning(true);
    setCurrentSlideIndex((prev) => prev + 1);
  };

  const handlePrevSlide = () => {
    setIsTransitioning(true);
    setCurrentSlideIndex((prev) => prev - 1);
  };

  const handleTransitionEnd = () => {
    if (currentSlideIndex >= heroSlides.length) {
      setIsTransitioning(false);
      setCurrentSlideIndex(0);
    } else if (currentSlideIndex < 0) {
      setIsTransitioning(false);
      setCurrentSlideIndex(heroSlides.length - 1);
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      handleNextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!isTransitioning) {
      const raf = requestAnimationFrame(() => {
        setIsTransitioning(true);
      });
      return () => cancelAnimationFrame(raf);
    }
  }, [isTransitioning]);

  const activeSlide =
    heroSlides[((currentSlideIndex % heroSlides.length) + heroSlides.length) % heroSlides.length];

  return (
    <div className="login-split-page">
      <svg width="0" height="0" style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
        <defs>
          <clipPath id="login-hero-slope" clipPathUnits="objectBoundingBox">
            <path d="M 0.04 0
                     L 0.96 0
                     Q 1 0, 1 0.04
                     L 0.90 0.96
                     Q 0.90 1, 0.86 1
                     L 0.04 1
                     Q 0 1, 0 0.96
                     L 0 0.04
                     Q 0 0, 0.04 0 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="login-split-card">
        <div className="login-hero-showcase">
          <div
            className={`login-hero-slider-track ${isTransitioning ? 'transitioning' : ''}`}
            style={{ transform: `translateX(-${(currentSlideIndex + 1) * 100}%)` }}
            onTransitionEnd={handleTransitionEnd}
          >
            {extendedSlides.map((slide, index) => (
              <div
                key={`${slide.title}-${index}`}
                className="login-hero-bg-slide"
                style={{ backgroundImage: `url("${slide.image}")` }}
              />
            ))}
          </div>
          <div className="login-hero-bg-overlay"></div>

          <div className="login-hero-top-bar">
            <span className="login-hero-tag">Selected Works</span>
            <div className="login-hero-top-actions">
              {isLogin ? (
                <Link to="/register" className="login-hero-link">Sign Up</Link>
              ) : (
                <Link to="/login" className="login-hero-link">Sign In</Link>
              )}
              {isProviderRegister ? (
                <Link to="/register" className="login-hero-join-btn">Join As Customer</Link>
              ) : (
                <Link to="/provider/register" className="login-hero-join-btn">Join As Provider</Link>
              )}
            </div>
          </div>

          <div className="login-hero-bottom-bar">
            <div className="login-hero-creator-badge">
              <span key={activeSlide.title} className="login-hero-creator-name">
                {activeSlide.title}
              </span>
            </div>

            <div className="login-hero-nav-arrows">
              <button
                type="button"
                className="login-hero-arrow-btn"
                aria-label="Previous"
                onClick={handlePrevSlide}
              >
                <i className="fas fa-arrow-left"></i>
              </button>
              <button
                type="button"
                className="login-hero-arrow-btn"
                aria-label="Next"
                onClick={handleNextSlide}
              >
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>

        <div className="login-form-side">
          <div className="login-form-top-bar">
            <Link to="/" className="login-brand" aria-label="Briosolve Home">
              <img src="/briosolve-text-logo.svg" alt="Briosolve" className="login-brand-text-logo" />
            </Link>

            <button
              onClick={toggleTheme}
              className="login-brand-logo-btn"
              aria-label="Toggle Theme"
              title="Toggle Theme"
              type="button"
            >
              <img src="/briosolve-logo.svg" alt="Briosolve" className="login-brand-logo-img" />
            </button>
          </div>

          <div className="login-form-content">
            <React.Suspense fallback={null}>
              <Outlet />
            </React.Suspense>
          </div>

          <div className="login-form-bottom-bar">
            <div className="login-social-footer">
              <span className="login-social-icon"><i className="fab fa-facebook-f"></i></span>
              <span className="login-social-icon"><i className="fab fa-twitter"></i></span>
              <span className="login-social-icon">
                <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </span>
              <span className="login-social-icon"><i className="fab fa-linkedin-in"></i></span>
              <span className="login-social-icon"><i className="fab fa-instagram"></i></span>
            </div>

            <Link to="/" className="login-footer-home-btn" title="Back to Home">
              <i className="fas fa-home"></i>
              <span>Home</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
