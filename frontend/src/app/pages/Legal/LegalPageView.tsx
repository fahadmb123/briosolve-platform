import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import LegalHeroIllustration from './LegalHeroIllustration';

export interface LegalSectionItem {
  id: string;
  title: string;
  subtitle?: string;
  paragraphs: string[];
  listItems?: string[];
  callout?: {
    label: string;
    text: string;
  };
}

export interface LegalSwitchLink {
  to: string;
  label: string;
  icon: string;
}

export interface LegalPageViewProps {
  title: React.ReactNode;
  subtitle: string;
  subtext?: string;
  illustrationSrc?: string;
  illustrationAlt?: string;
  effectiveDate: string;
  lastUpdated: string;
  readTime: string;
  sections: LegalSectionItem[];
  contactTitle: string;
  contactEmail: string;
  switchLink: LegalSwitchLink;
}

export default function LegalPageView({
  title,
  subtitle,
  subtext,
  illustrationSrc,
  illustrationAlt = 'Illustration',
  effectiveDate,
  lastUpdated,
  readTime,
  sections,
  contactTitle,
  contactEmail,
  switchLink,
}: LegalPageViewProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;

    return sections.filter((section) => {
      const matchTitle = section.title.toLowerCase().includes(q);
      const matchSubtitle = section.subtitle?.toLowerCase().includes(q);
      const matchPara = section.paragraphs.some((p) => p.toLowerCase().includes(q));
      const matchList = section.listItems?.some((item) => item.toLowerCase().includes(q));
      const matchCallout = section.callout && (
        section.callout.label.toLowerCase().includes(q) ||
        section.callout.text.toLowerCase().includes(q)
      );
      return matchTitle || matchSubtitle || matchPara || matchList || matchCallout;
    });
  }, [sections, searchQuery]);

  const handleLearnMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById('legal-content');
    if (target) {
      const yOffset = -120;
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="legal-doc-print-header">
        <div className="legal-doc-header-brand">
          <div className="legal-doc-brand-logos">
            <img
              src="/briosolve-logo.svg"
              alt="Briosolve"
              className="legal-doc-logo-icon"
            />
            <img
              src="/briosolve-text-logo.svg"
              alt="Briosolve"
              className="legal-doc-logo-text"
            />
          </div>
          <span className="legal-doc-classification">
            Official Platform Governance &bull; Ratified Policy Document
          </span>
        </div>

        {illustrationSrc && (
          <div className="legal-doc-header-emblem">
            <img
              src={illustrationSrc}
              alt={illustrationAlt}
              className="legal-doc-emblem-img"
            />
          </div>
        )}
      </div>

      <header className="legal-hero-section">
        <div className="legal-hero-left">
          <h1 className="legal-hero-title">{title}</h1>
          <p className="legal-hero-subtitle">{subtitle}</p>
          {subtext && <p className="legal-hero-subtext">{subtext}</p>}

          <div className="legal-hero-actions">
            <a
              href="#legal-content"
              className="legal-learn-btn"
              onClick={handleLearnMore}
            >
              Learn More
            </a>

            <div className="legal-search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                className="legal-search-input"
                placeholder="Search keyword"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  type="button"
                  className="legal-search-clear"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="legal-hero-right">
          <LegalHeroIllustration
            src={illustrationSrc}
            alt={illustrationAlt}
          />
        </div>
      </header>

      <div className="legal-body" id="legal-content">
        <div className="legal-meta-info">
          <span><i className="far fa-calendar-alt"></i> Effective Date: {effectiveDate}</span>
          <span><i className="far fa-clock"></i> Last Updated: {lastUpdated}</span>
          <span><i className="fas fa-book-reader"></i> {readTime}</span>
        </div>

        {filteredSections.length === 0 ? (
          <div className="legal-empty-search">
            <i className="fas fa-search"></i>
            <h3>No matching sections</h3>
            <p>We couldn't find anything matching "{searchQuery}". Try a different keyword.</p>
            <button
              type="button"
              className="legal-empty-reset-btn"
              onClick={() => setSearchQuery('')}
            >
              Reset search
            </button>
          </div>
        ) : (
          filteredSections.map((sec) => (
            <section key={sec.id} id={sec.id} className="legal-section">
              <h2 className="legal-section-title">{sec.title}</h2>
              {sec.subtitle && (
                <h3 className="legal-section-subtitle">{sec.subtitle}</h3>
              )}
              {sec.paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}

              {sec.listItems && sec.listItems.length > 0 && (
                <ul className="legal-list">
                  {sec.listItems.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}

              {sec.callout && (
                <div className="legal-callout">
                  <i className="fas fa-shield-alt"></i>
                  <div>
                    <h4>{sec.callout.label}</h4>
                    <p>{sec.callout.text}</p>
                  </div>
                </div>
              )}
            </section>
          ))
        )}

        <div className="legal-signature-card">
          <div className="legal-signature-header">
            <span className="legal-signature-tag">
              <i className="fas fa-file-signature"></i> Official Ratification & Sign-off
            </span>
            <span className="legal-signature-ref">
              Doc Ref: BS-{effectiveDate.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}-V2
            </span>
          </div>

          <div className="legal-signature-body">
            <div className="legal-signature-col">
              <div className="legal-signature-written">
                Briosolve Compliance Directorate
              </div>
              <div className="legal-signature-meta">
                <strong>Authorized Governance Signatory</strong>
                <span>Office of the General Counsel & Risk Operations</span>
                <span>Ratified & Effective: {effectiveDate}</span>
              </div>
            </div>

            <div className="legal-signature-seal-col">
              <div className="legal-signature-seal">
                <i className="fas fa-shield-alt"></i>
                <div className="legal-seal-details">
                  <span className="legal-seal-title">DIGITALLY VERIFIED</span>
                  <span className="legal-seal-sub">Platform Standard</span>
                  <span className="legal-seal-date">Status: Active & Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="legal-contact-card">
          <div>
            <strong>{contactTitle}</strong>
            <p>{contactEmail}</p>
          </div>
          <div className="legal-contact-actions">
            <Link to={switchLink.to} className="legal-switch-btn">
              <i className={switchLink.icon}></i>
              <span>{switchLink.label}</span>
            </Link>
            <Link to="/" className="legal-contact-btn">
              <i className="fas fa-home"></i>
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
