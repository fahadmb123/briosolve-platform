import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../features/auth/stores/auth.store";
import { TopNav } from "../../../shared/components/ui/TopNav/TopNav";
import { ProviderTopNav } from "../../../shared/components/ui/ProviderTopNav/ProviderTopNav";
import "./Home.css";

export default function Home() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  const dashboardRoute = useMemo(() => {
    if (!user) return "/login";
    if (user.role === "ADMIN") return "/admin/dashboard";
    if (user.role === "PROVIDER") return "/provider/dashboard";
    return "/dashboard";
  }, [user]);

  const services = [
    {
      id: "plumbing",
      icon: "fa-tools",
      name: "Plumbing & Piping",
      desc: "Leak repairs, pipe fittings, tap installations, and drainage solutions.",
      link: "/nearby-providers",
    },
    {
      id: "electrical",
      icon: "fa-bolt",
      name: "Electrical & Wiring",
      desc: "Short circuits, fuse boxes, switchboard setups, and appliance wiring.",
      link: "/nearby-providers",
    },
    {
      id: "ac",
      icon: "fa-snowflake",
      name: "AC Repair & Servicing",
      desc: "Refrigerant refills, jet servicing, breakdown maintenance, and installs.",
      link: "/nearby-providers",
    },
    {
      id: "cleaning",
      icon: "fa-broom",
      name: "Deep Cleaning",
      desc: "Full home sanitization, kitchen degreasing, and upholstery care.",
      link: "/nearby-providers",
    },
    {
      id: "carpentry",
      icon: "fa-hammer",
      name: "Carpentry & Woodwork",
      desc: "Custom furniture repair, door and lock assemblies, and renovations.",
      link: "/nearby-providers",
    },
    {
      id: "painting",
      icon: "fa-paint-roller",
      name: "Painting & Waterproofing",
      desc: "Interior repainting, moisture wall treatment, and texture coating.",
      link: "/nearby-providers",
    },
  ];

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

  return (
    <div className="home-top-layout">
      {isAuthenticated && user?.role === "PROVIDER" ? (
        <ProviderTopNav />
      ) : (
        <TopNav />
      )}
      <main className="home-wrapper">
        <section className="home-hero-section">
        <div className="home-hero-container">
          <div className="home-badge-pill">
            <i className="fas fa-check-circle"></i>
            <span>Verified Local Professionals • Zero Middleman Markup</span>
          </div>

          <h1 className="home-hero-title">
            Connect with skilled local specialists for <span>any job</span>
          </h1>

          <p className="home-hero-subtitle">
            Post your requirements, receive competitive quotes directly from
            verified local pros, and choose the right expert on your schedule.
          </p>

          <div className="home-hero-cta-group">
            <Link to="/nearby-providers" className="home-btn-primary">
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
      </section>

      <section id="services" className="home-section home-services-section">
        <div className="home-section-container">
          <div className="home-section-header">
            <span className="home-section-label">Service Directory</span>
            <h2 className="home-section-title">Popular Service Categories</h2>
            <p className="home-section-desc">
              Browse qualified professionals ready to assist with common home
              and trade maintenance requirements.
            </p>
          </div>

          <div className="home-services-grid">
            {services.map((service) => (
              <Link
                key={service.id}
                to={service.link}
                className="home-service-card"
              >
                <div className="home-service-icon">
                  <i className={`fas ${service.icon}`}></i>
                </div>
                <h3 className="home-service-name">{service.name}</h3>
                <p className="home-service-desc">{service.desc}</p>
                <span className="home-service-link">
                  <span>Explore specialists</span>
                  <i className="fas fa-arrow-right text-xs"></i>
                </span>
              </Link>
            ))}
          </div>
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
            <span className="home-section-label">Why ReverseMarket</span>
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
              <Link to="/nearby-providers" className="home-btn-primary">
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
              <Link to="/" className="home-logo">
                <i className="fas fa-layer-group"></i>
                <span>ReverseMarket</span>
              </Link>
              <p>
                A modern reverse service marketplace connecting homeowners and
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
            <span>&copy; {new Date().getFullYear()} ReverseMarket. All rights reserved.</span>
            <div className="home-footer-legal-links">
              <Link to="/settings" className="home-footer-link">
                Privacy
              </Link>
              <Link to="/settings" className="home-footer-link">
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
