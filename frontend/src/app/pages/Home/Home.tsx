import { useMemo, useState, useLayoutEffect, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/auth.store";
import { CustomerNavbar } from "../../../shared/components/ui/TopNav/TopNav";
import { ProviderNavbar } from "../../../shared/components/ui/ProviderTopNav/ProviderTopNav";
import { useGetCategoriesService, type Category } from "../../../features/service-catalog";
import "./Home.css";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const { data: categoriesRes } = useGetCategoriesService({ page: 1, limit: 100, filter: "ACTIVE" });
  const [catalogCategories, setCatalogCategories] = useState<Category[]>([]);
  const [activeCategoryId, setActiveCategoryId] = useState<string>("");
  const tabsNavRef = useRef<HTMLDivElement>(null);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [activeTabStyle, setActiveTabStyle] = useState<{ left: number; width: number; opacity: number }>({
    left: 0,
    width: 0,
    opacity: 0,
  });

  const dashboardRoute = useMemo(() => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "PROVIDER") return "/provider/dashboard";
    return "/dashboard";
  }, [user]);

  useEffect(() => {
    if (categoriesRes?.data?.categories && categoriesRes.data.categories.length > 0) {
      setCatalogCategories(categoriesRes.data.categories);
      setActiveCategoryId((prev) => {
        const matched = categoriesRes.data.categories.find(
          (c) => c.id === prev || c.name.toLowerCase().includes(prev.toLowerCase())
        );
        return matched ? matched.id : categoriesRes.data.categories[0].id;
      });
    }
  }, [categoriesRes]);

  const categories = useMemo(() => {
    return catalogCategories.map((cat) => {
      const displayName = cat.name.replace(/\b\w/g, (c) => c.toUpperCase());
      return {
        id: cat.id,
        shortName: displayName,
        name: displayName,
        desc: cat.description || "Browse qualified professionals ready to assist with your requirements.",
        image: cat.image,
        icon: "fa-tools",
        link: `/nearby-providers?category=${encodeURIComponent(cat.id)}`,
        subservices:
          cat.services && cat.services.length > 0
            ? cat.services
              .filter((s) => s.status === "ACTIVE" || !s.status)
              .map((sub) => ({
                title: sub.name.replace(/\b\w/g, (c) => c.toUpperCase()),
                desc: sub.description || "Qualified and verified local specialists ready to assist.",
                icon: "fa-check-circle",
                image: sub.image,
              }))
            : [],
      };
    });
  }, [catalogCategories]);

  const currentCategory = useMemo(() => {
    return categories.find((c) => c.id === activeCategoryId) || categories[0] || null;
  }, [activeCategoryId, categories]);

  const steps = [
    {
      num: "01",
      title: "Post Your Requirement",
      desc: "Describe what service you need, specify your location, and set your preferred timeframe.",
    },
    {
      num: "02",
      title: "Receive Direct Quotes",
      desc: "Verified local providers review your job requirements and submit itemized quotes.",
    },
    {
      num: "03",
      title: "Hire & Complete",
      desc: "Review provider ratings, message directly in-app, and pay securely once satisfied.",
    },
  ];

  const benefits = [
    {
      icon: "fa-shield-alt",
      title: "Verified Pros",
      desc: "All service providers undergo government ID and credential checks before quoting.",
    },
    {
      icon: "fa-tags",
      title: "Direct Bidding",
      desc: "Providers compete transparently so you get genuine local market rates without middleman fees.",
    },
    {
      icon: "fa-comments",
      title: "In-App Chat",
      desc: "Discuss project details and share updates directly with your chosen specialist.",
    },
    {
      icon: "fa-bell",
      title: "Real-Time Updates",
      desc: "Get instant notification alerts as soon as quotes, schedule changes, or messages arrive.",
    },
  ];

  useEffect(() => {
    setHasMounted(true);
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!tabsNavRef.current) return;
        const activeEl = tabsNavRef.current.querySelector<HTMLElement>(".home-folder-tab.active");
        if (activeEl) {
          setActiveTabStyle({
            left: activeEl.offsetLeft,
            width: activeEl.offsetWidth,
            opacity: 1,
          });
        }
      });
    }
  }, []);

  useLayoutEffect(() => {
    const updateIndicator = () => {
      if (!tabsNavRef.current) return;
      const activeEl = tabsNavRef.current.querySelector<HTMLElement>(".home-folder-tab.active");
      if (activeEl) {
        setActiveTabStyle({
          left: activeEl.offsetLeft,
          width: activeEl.offsetWidth,
          opacity: 1,
        });
      } else {
        setActiveTabStyle((prev) => ({ ...prev, opacity: 0 }));
      }
    };

    updateIndicator();
    window.addEventListener("resize", updateIndicator);
    return () => window.removeEventListener("resize", updateIndicator);
  }, [activeCategoryId, categories]);

  return (
    <div className="home-top-layout">
      {isAuthenticated && user?.role === "PROVIDER" ? (
        <ProviderNavbar />
      ) : (
        <CustomerNavbar />
      )}
      <main className="home-wrapper">
        <div className="home-top-announcement-bar">
          <div className="home-top-announcement-content">
            <div className="home-announcement-brand">
              <img src="/briosolve-logo.svg" alt="Briosolve" className="home-announcement-logo" />
              <img src="/briosolve-text-logo.svg" alt="Briosolve" className="home-announcement-text-logo" />
            </div>
            <div className="home-announcement-divider" aria-hidden="true" />
            <span className="home-announcement-message">
              SMART MARKETPLACE • DIRECT OFFERS IN MINUTES
            </span>
          </div>
        </div>
        <section className="home-hero-section">
          <div className="home-hero-layout">
            <div className="home-hero-content">
              <div className="home-badge-pill">
                <i className="fas fa-check-circle"></i>
                <span>Verified Local Professionals • Zero Middleman Markup</span>
              </div>

              <h1 className="home-hero-title">
                Connect Your Servicer  <span>any job</span>
              </h1>

              <p className="home-hero-subtitle">
                Post your requirements, receive competitive quotes directly from
                verified local pros, and choose the right expert on your schedule.
              </p>

              <div className="home-hero-cta-group">
                <Link to="/request-service" className="home-btn-primary">
                  <i className="fas fa-plus-circle"></i>
                  <span>Post a Service Request</span>
                </Link>

                <Link to="/nearby-providers" className="home-btn-secondary">
                  <i className="fas fa-search-location"></i>
                  <span>Find Nearby Providers</span>
                </Link>

                {isAuthenticated ? (
                  <Link to={dashboardRoute} className="home-btn-secondary">
                    <i className="fas fa-chart-line"></i>
                    <span>Go to Dashboard</span>
                  </Link>
                ) : (
                  <Link to="/provider/register" className="home-btn-secondary">
                    <i className="fas fa-briefcase"></i>
                    <span>Become a Provider</span>
                  </Link>
                )}
              </div>

              <div className="home-trust-strip">
                <div className="home-trust-item">
                  <div className="home-trust-icon">
                    <i className="fas fa-user-check"></i>
                  </div>
                  <div>
                    <div className="home-trust-label">Verified Providers</div>
                    <p className="home-trust-desc">Government ID & KYC screened</p>
                  </div>
                </div>

                <div className="home-trust-item">
                  <div className="home-trust-icon">
                    <i className="fas fa-file-invoice"></i>
                  </div>
                  <div>
                    <div className="home-trust-label">Transparent Bids</div>
                    <p className="home-trust-desc">Direct upfront pricing</p>
                  </div>
                </div>

                <div className="home-trust-item">
                  <div className="home-trust-icon">
                    <i className="fas fa-bolt"></i>
                  </div>
                  <div>
                    <div className="home-trust-label">Fast Response</div>
                    <p className="home-trust-desc">Receive quotes in minutes</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="home-hero-worker-wrapper">
              <img
                src="/images/hero-blob.svg"
                alt=""
                className="home-hero-worker-blob"
                aria-hidden="true"
              />
              <img
                src="/images/hero-worker.png"
                alt="Verified Specialist"
                className="home-hero-worker-image"
              />
            </div>
          </div>
        </section>

        <section id="services" className="home-section home-services-section">
          <div className="home-section-container">
            <div className="home-services-intro">
              <span className="home-section-label">Service Directory</span>
              <h2 className="home-section-title">Popular Service Categories</h2>
              <p className="home-section-desc">
                Browse qualified professionals ready to assist with common home
                and trade maintenance requirements.
              </p>
            </div>

            {categories.length === 0 ? (
              <div className="home-folder-wrapper home-folder-skeleton-wrapper" aria-hidden="true">
                <div className="home-services-worker-wrapper" aria-hidden="true">
                  <img
                    src="https://res.cloudinary.com/zjhxcdmi/image/upload/e_trim,f_auto,q_auto:good/v1794656365/worker-man-standing-background-removed.png"
                    alt="Service Professional"
                    className="home-services-worker-img"
                  />
                </div>
                <div className="home-folder-tabs">
                  <div className="home-folder-tab-skeleton is-active">
                    <div className="home-folder-skel-bar is-active-bar" />
                  </div>
                  <div className="home-folder-tab-skeleton">
                    <div className="home-folder-skel-bar" />
                  </div>
                  <div className="home-folder-tab-skeleton">
                    <div className="home-folder-skel-bar" />
                  </div>
                  <div className="home-folder-tab-skeleton">
                    <div className="home-folder-skel-bar" />
                  </div>
                  <div className="home-folder-tab-skeleton">
                    <div className="home-folder-skel-bar" />
                  </div>
                </div>

                <div className="home-folder-box is-skeleton">
                  <div className="home-folder-box-header">
                    <div className="home-folder-box-info">
                      <div className="home-folder-box-icon is-skeleton" />
                      <div>
                        <div className="home-folder-skel-title" />
                        <div className="home-folder-skel-desc" />
                      </div>
                    </div>
                  </div>

                  <div className="home-folder-grid">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className="home-folder-card is-skeleton">
                        <div className="home-folder-card-content">
                          <div className="home-folder-skel-card-title" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              currentCategory && (
                <div className="home-folder-wrapper">
                  <div className="home-services-worker-wrapper" aria-hidden="true">
                    <img
                      src="https://res.cloudinary.com/zjhxcdmi/image/upload/e_trim,f_auto,q_auto:good/v1794656365/worker-man-standing-background-removed.png"
                      alt="Service Professional"
                      className="home-services-worker-img"
                    />
                  </div>
                  <div
                    className="home-folder-tabs"
                    role="tablist"
                    aria-label="Service Categories"
                    ref={tabsNavRef}
                  >
                    <div
                      className={`home-folder-active-indicator ${hasMounted ? "is-animated" : ""}`}
                      style={{
                        transform: `translateX(${activeTabStyle.left}px)`,
                        width: `${activeTabStyle.width}px`,
                        opacity: activeTabStyle.opacity,
                      }}
                      aria-hidden="true"
                    />

                    {categories.map((cat) => {
                      const isActive = activeCategoryId === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          role="tab"
                          id={`tab-${cat.id}`}
                          aria-selected={isActive}
                          aria-controls={`panel-${cat.id}`}
                          className={`home-folder-tab ${isActive ? "active" : ""}`}
                          onClick={() => setActiveCategoryId(cat.id)}
                        >
                          <span>{cat.shortName}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div
                    id={`panel-${currentCategory.id}`}
                    role="tabpanel"
                    aria-labelledby={`tab-${currentCategory.id}`}
                    className="home-folder-box"
                  >
                    <div key={currentCategory.id} className="home-folder-content-animated">
                      <div className="home-folder-box-header">
                        <div className="home-folder-box-info">
                          <div className="home-folder-box-icon">
                            {currentCategory.image ? (
                              <img
                                src={currentCategory.image}
                                alt={currentCategory.name}
                                className="home-folder-box-img"
                              />
                            ) : (
                              <i className={`fas ${currentCategory.icon || "fa-tools"}`}></i>
                            )}
                          </div>
                          <div>
                            <h3 className="home-folder-box-title">{currentCategory.name}</h3>
                            <p className="home-folder-box-desc">{currentCategory.desc}</p>
                          </div>
                        </div>
                      </div>

                      <div className="home-folder-grid">
                        {currentCategory.subservices.map((sub, idx) => (
                          <Link
                            key={idx}
                            to={currentCategory.link}
                            className="home-folder-card"
                          >
                            {sub.image ? (
                              <img
                                src={sub.image}
                                alt={sub.title}
                                className="home-folder-card-bg-img"
                              />
                            ) : (
                              <div className="home-folder-card-bg-fallback">
                                <i className={`fas ${sub.icon || "fa-tools"}`}></i>
                              </div>
                            )}
                            <div className="home-folder-card-overlay" />
                            <div className="home-folder-card-content">
                              <h4 className="home-folder-card-title">{sub.title}</h4>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </section>

        <section id="how-it-works" className="home-section home-how-it-works-section">
          <div className="home-section-container">
            <div className="home-section-header">
              <span className="home-section-label">How It Works</span>
              <h2 className="home-section-title">Simple, transparent hiring</h2>
              <p className="home-section-desc">
                Three straightforward steps from specifying your project to
                satisfactory completion.
              </p>
            </div>

            <div className="home-steps-grid">
              {steps.map((step) => (
                <div key={step.num} className="home-step-card">
                  <div className="home-step-num">{step.num}</div>
                  <h3 className="home-step-title">{step.title}</h3>
                  <p className="home-step-desc">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section home-benefits-section">
          <div className="home-section-container">
            <div className="home-section-header">
              <span className="home-section-label">Why Briosolve</span>
              <h2 className="home-section-title">A marketplace designed for trust</h2>
              <p className="home-section-desc">
                Built to eliminate aggressive sales calls, hidden fees, and
                opaque contractor estimates.
              </p>
            </div>

            <div className="home-benefits-grid">
              {benefits.map((benefit) => (
                <div key={benefit.title} className="home-benefit-card">
                  <div className="home-benefit-icon">
                    <i className={`fas ${benefit.icon}`}></i>
                  </div>
                  <h3 className="home-benefit-title">{benefit.title}</h3>
                  <p className="home-benefit-desc">{benefit.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="home-section home-cta-section">
          <div className="home-section-container">
            <div className="home-cta-card">
              <h2 className="home-cta-title">Ready to hire or offer services?</h2>
              <p className="home-cta-desc">
                Connect with vetted local pros in your neighborhood, or register
                as an independent service provider to expand your business.
              </p>
              <div className="home-cta-actions">
                <Link to="/request-service" className="home-btn-primary">
                  <i className="fas fa-plus-circle"></i>
                  <span>Post a Service Request</span>
                </Link>

                <Link to="/nearby-providers" className="home-btn-secondary">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>Find Providers</span>
                </Link>
                {!isAuthenticated && (
                  <Link to="/provider/register" className="home-btn-secondary">
                    <i className="fas fa-user-tie"></i>
                    <span>Register as a Provider</span>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </section>

        <footer className="home-footer">
          <div className="home-footer-container">
            <div className="home-footer-top">
              <div className="home-footer-brand">
                <Link to="/" className="brand-logo-container mb-3" aria-label="Briosolve Home">
                  <img src="/briosolve-logo.svg" alt="Briosolve" className="brand-emblem-logo" />
                  <img src="/briosolve-text-logo.svg" alt="Briosolve" className="brand-text-logo" />
                </Link>
                <p>
                  A modern service marketplace connecting homeowners and
                  businesses with verified local specialists.
                </p>
              </div>

              <div className="home-footer-col">
                <h4>Platform</h4>
                <div className="home-footer-links">
                  <Link to="/nearby-providers" className="home-footer-link">
                    Nearby Providers
                  </Link>
                  <a href="#services" className="home-footer-link">
                    Categories
                  </a>
                  <a href="#how-it-works" className="home-footer-link">
                    How It Works
                  </a>
                </div>
              </div>

              <div className="home-footer-col">
                <h4>Account</h4>
                <div className="home-footer-links">
                  {isAuthenticated ? (
                    <>
                      <Link to={dashboardRoute} className="home-footer-link">
                        Dashboard
                      </Link>
                      <Link to="/profile" className="home-footer-link">
                        Profile
                      </Link>
                      <Link to="/settings" className="home-footer-link">
                        Settings
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link to="/login" className="home-footer-link">
                        Sign In
                      </Link>
                      <Link to="/register" className="home-footer-link">
                        Customer Sign Up
                      </Link>
                      <Link to="/provider/register" className="home-footer-link">
                        Provider Registration
                      </Link>
                    </>
                  )}
                </div>
              </div>

              <div className="home-footer-col">
                <h4>Support</h4>
                <div className="home-footer-links">
                  <Link to="/settings" className="home-footer-link">
                    Help Center
                  </Link>
                  <Link to="/settings" className="home-footer-link">
                    Contact
                  </Link>
                </div>
              </div>
            </div>

            <div className="home-footer-bottom">
              <span>&copy; {new Date().getFullYear()} Briosolve. All rights reserved.</span>

              <div className="home-footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="home-footer-social-icon" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="home-footer-social-icon" aria-label="Twitter">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="home-footer-social-icon" aria-label="X (Twitter)">
                  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="home-footer-social-icon" aria-label="LinkedIn">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="home-footer-social-icon" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>

              <div className="home-footer-legal-links">
                <Link to="/privacy" className="home-footer-link">
                  Privacy
                </Link>
                <Link to="/terms" className="home-footer-link">
                  Terms
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
