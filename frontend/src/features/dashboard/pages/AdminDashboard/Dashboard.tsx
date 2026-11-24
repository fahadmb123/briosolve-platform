import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/useDashboard';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';
import './Dashboard.css';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const [streamFilter, setStreamFilter] = useState<'ALL' | 'KYC' | 'DISPUTE'>('ALL');

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="app-content admin-dash-root">
        <div className="admin-panel text-center" style={{ padding: '3.5rem 1.5rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
              fontSize: '1.5rem',
            }}
          >
            <i className="fas fa-exclamation-triangle"></i>
          </div>
          <h2 className="admin-urgency-headline" style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
            Failed to Load Platform Telemetry
          </h2>
          <p className="admin-urgency-narrative" style={{ maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            We encountered a network or permission issue while retrieving administrative metrics.
          </p>
          <button onClick={() => refetch()} className="admin-btn admin-btn-accent" style={{ margin: '0 auto' }}>
            <i className="fas fa-sync-alt"></i> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { kpis, recentActivity, operationalHealth } = data;

  const totalUsers = (kpis.totalCustomers || 0) + (kpis.totalProviders || 0);
  const customerRatio = totalUsers > 0 ? Math.round(((kpis.totalCustomers || 0) / totalUsers) * 100) : 50;
  const providerRatio = 100 - customerRatio;
  const verificationRatio = (kpis.totalProviders || 0) > 0
    ? Math.round(((kpis.verifiedProviders || 0) / kpis.totalProviders) * 100)
    : 100;
  const quotesPerRequest = (kpis.activeRequests || 0) > 0
    ? ((kpis.totalQuotations || 0) / kpis.activeRequests).toFixed(1)
    : '0';

  const filteredActivity = recentActivity.filter((item) => {
    if (streamFilter === 'KYC') return item.type === 'KYC';
    if (streamFilter === 'DISPUTE') return item.type === 'DISPUTE';
    return true;
  });

  return (
    <div className="app-content admin-dash-root">
      <header className="admin-header-hero">
        <div className="admin-hero-left">
          <div className="admin-hero-tags">
            <span className="admin-tag-pill portal">
              <i className="fas fa-crown"></i>
              Platform Overview
            </span>
            <span className="admin-tag-pill live-status">
              <span className="admin-live-pulse"></span>
              All Systems Operational
            </span>
          </div>
          <h1 className="admin-hero-title">Platform Dashboard</h1>
          <p className="admin-hero-desc">
            Executive oversight of marketplace liquidity, user compliance queues, ongoing bookings, and platform infrastructure.
          </p>
        </div>

        <div className="admin-hero-actions">
          {kpis.pendingVerifications > 0 && (
            <Link to="/admin/verification" className="admin-btn alert-warning">
              <i className="fas fa-shield-alt"></i>
              <span>Verifications</span>
              <span className="admin-btn-badge">{kpis.pendingVerifications}</span>
            </Link>
          )}

          {kpis.openInvestigations > 0 && (
            <Link to="/admin/support" className="admin-btn alert-danger">
              <i className="fas fa-gavel"></i>
              <span>Investigations</span>
              <span className="admin-btn-badge">{kpis.openInvestigations}</span>
            </Link>
          )}

          <button onClick={() => refetch()} className="admin-btn" title="Refresh metrics">
            <i className="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <section className="admin-hero-kpi-grid">
        <Link to="/admin/bookings" className="admin-kpi-tile">
          <div className="admin-kpi-tile-top">
            <div className="admin-kpi-icon-wrap primary">
              <i className="fas fa-calendar-check"></i>
            </div>
            <span className="admin-kpi-pill success">
              <i className="fas fa-bolt"></i> In-Flight
            </span>
          </div>
          <div className="admin-kpi-main">
            <div className="admin-kpi-value">{kpis.activeBookings.toLocaleString()}</div>
            <div className="admin-kpi-title">Active Bookings</div>
            <div className="admin-kpi-subtitle">Confirmed jobs currently in progress</div>
          </div>
          <div className="admin-kpi-footer">
            <span>Manage Fulfillment</span>
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        <Link to="/admin/requests" className="admin-kpi-tile">
          <div className="admin-kpi-tile-top">
            <div className="admin-kpi-icon-wrap info">
              <i className="fas fa-clipboard-list"></i>
            </div>
            <span className="admin-kpi-pill neutral">
              {kpis.totalQuotations} Total Bids
            </span>
          </div>
          <div className="admin-kpi-main">
            <div className="admin-kpi-value">{kpis.activeRequests.toLocaleString()}</div>
            <div className="admin-kpi-title">Marketplace Requests</div>
            <div className="admin-kpi-subtitle">{quotesPerRequest} quotes per open RFQ on average</div>
          </div>
          <div className="admin-kpi-footer">
            <span>Inspect Demands</span>
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        <Link to="/admin/users?tab=providers" className="admin-kpi-tile">
          <div className="admin-kpi-tile-top">
            <div className="admin-kpi-icon-wrap purple">
              <i className="fas fa-user-tie"></i>
            </div>
            <span className="admin-kpi-pill success">
              {verificationRatio}% Verified
            </span>
          </div>
          <div className="admin-kpi-main">
            <div className="admin-kpi-value">{kpis.totalProviders.toLocaleString()}</div>
            <div className="admin-kpi-title">Service Providers</div>
            <div className="admin-kpi-subtitle">{kpis.verifiedProviders} verified • {kpis.pendingVerifications} in queue</div>
          </div>
          <div className="admin-kpi-footer">
            <span>Review Directory</span>
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>

        <Link to="/admin/users?tab=customers" className="admin-kpi-tile">
          <div className="admin-kpi-tile-top">
            <div className="admin-kpi-icon-wrap warning">
              <i className="fas fa-users"></i>
            </div>
            <span className="admin-kpi-pill neutral">
              {customerRatio}% Demand
            </span>
          </div>
          <div className="admin-kpi-main">
            <div className="admin-kpi-value">{kpis.totalCustomers.toLocaleString()}</div>
            <div className="admin-kpi-title">Total Customers</div>
            <div className="admin-kpi-subtitle">Registered buyers across service areas</div>
          </div>
          <div className="admin-kpi-footer">
            <span>Customer Roster</span>
            <i className="fas fa-arrow-right"></i>
          </div>
        </Link>
      </section>

      <div className="admin-dashboard-split">
        <div className="admin-main-stack">
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="admin-panel-title-group">
                <i className="fas fa-tasks admin-panel-icon"></i>
                <h2 className="admin-panel-title">Governance &amp; Attention Queue</h2>
              </div>
              <span className={`admin-panel-count-badge ${kpis.pendingVerifications + kpis.openInvestigations > 0 ? 'has-items' : ''}`}>
                {kpis.pendingVerifications + kpis.openInvestigations} Actions Needed
              </span>
            </div>

            {kpis.pendingVerifications === 0 && kpis.openInvestigations === 0 ? (
              <div className="admin-cleared-queue">
                <div className="admin-cleared-icon-wrap">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3 className="admin-cleared-headline">All Operational Queues are Clear</h3>
                <p className="admin-cleared-subtext">
                  There are no pending provider credentials awaiting verification or open dispute tickets requiring administrative arbitration.
                </p>
              </div>
            ) : (
              <div className="admin-urgency-list">
                {kpis.pendingVerifications > 0 && (
                  <div className="admin-urgency-card">
                    <div className="admin-urgency-left">
                      <div className="admin-urgency-symbol amber">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <div className="admin-urgency-details">
                        <div className="admin-urgency-top-line">
                          <span className="admin-urgency-headline">Provider KYC &amp; Verification Dossiers</span>
                          <span className="admin-urgency-pill amber">
                            {kpis.pendingVerifications} Pending
                          </span>
                        </div>
                        <p className="admin-urgency-narrative">
                          New service providers have submitted business registration and identity documents requiring compliance review.
                        </p>
                      </div>
                    </div>
                    <Link to="/admin/verification" className="admin-urgency-cta">
                      <span>Review Dossiers</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                )}

                {kpis.openInvestigations > 0 && (
                  <div className="admin-urgency-card">
                    <div className="admin-urgency-left">
                      <div className="admin-urgency-symbol rose">
                        <i className="fas fa-balance-scale"></i>
                      </div>
                      <div className="admin-urgency-details">
                        <div className="admin-urgency-top-line">
                          <span className="admin-urgency-headline">Escalated Dispute Investigations</span>
                          <span className="admin-urgency-pill rose">
                            {kpis.openInvestigations} Open Cases
                          </span>
                        </div>
                        <p className="admin-urgency-narrative">
                          Active claims and job disputes escalated to administrator intervention for mediation and financial escrow release.
                        </p>
                      </div>
                    </div>
                    <Link to="/admin/support" className="admin-urgency-cta">
                      <span>Investigate</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="admin-panel-title-group">
                <i className="fas fa-chart-pie admin-panel-icon"></i>
                <h2 className="admin-panel-title">Marketplace Balance &amp; Vetting Ratios</h2>
              </div>
            </div>

            <div className="admin-ratios-container">
              <div className="admin-ratio-card">
                <div className="admin-ratio-header">
                  <span className="admin-ratio-title">User Distribution Ratio</span>
                  <span className="admin-ratio-tag">{totalUsers} Total Accounts</span>
                </div>
                <div className="admin-ratio-bar-wrap">
                  <div className="admin-ratio-fill blue" style={{ width: `${customerRatio}%` }}></div>
                  <div className="admin-ratio-fill purple" style={{ width: `${providerRatio}%` }}></div>
                </div>
                <div className="admin-ratio-legend">
                  <div className="admin-ratio-legend-item">
                    <span className="admin-legend-dot blue"></span>
                    <span>Customers: {kpis.totalCustomers} ({customerRatio}%)</span>
                  </div>
                  <div className="admin-ratio-legend-item">
                    <span className="admin-legend-dot purple"></span>
                    <span>Providers: {kpis.totalProviders} ({providerRatio}%)</span>
                  </div>
                </div>
              </div>

              <div className="admin-ratio-card">
                <div className="admin-ratio-header">
                  <span className="admin-ratio-title">Provider Trust &amp; Certification</span>
                  <span className="admin-ratio-tag">{verificationRatio}% Certified</span>
                </div>
                <div className="admin-ratio-bar-wrap">
                  <div className="admin-ratio-fill green" style={{ width: `${verificationRatio}%` }}></div>
                </div>
                <div className="admin-ratio-legend">
                  <div className="admin-ratio-legend-item">
                    <span className="admin-legend-dot green"></span>
                    <span>Verified: {kpis.verifiedProviders}</span>
                  </div>
                  <div className="admin-ratio-legend-item">
                    <span>Unverified / In Review: {kpis.totalProviders - kpis.verifiedProviders}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="admin-panel-title-group">
                <i className="fas fa-stream admin-panel-icon"></i>
                <h2 className="admin-panel-title">Live Platform Audit Stream</h2>
              </div>

              <div className="admin-filter-tabs">
                <button
                  type="button"
                  className={`admin-filter-tab ${streamFilter === 'ALL' ? 'active' : ''}`}
                  onClick={() => setStreamFilter('ALL')}
                >
                  All ({recentActivity.length})
                </button>
                <button
                  type="button"
                  className={`admin-filter-tab ${streamFilter === 'KYC' ? 'active' : ''}`}
                  onClick={() => setStreamFilter('KYC')}
                >
                  KYC
                </button>
                <button
                  type="button"
                  className={`admin-filter-tab ${streamFilter === 'DISPUTE' ? 'active' : ''}`}
                  onClick={() => setStreamFilter('DISPUTE')}
                >
                  Disputes
                </button>
              </div>
            </div>

            {filteredActivity.length === 0 ? (
              <div className="admin-cleared-queue" style={{ padding: '2rem 1rem' }}>
                <i className="fas fa-inbox" style={{ fontSize: '1.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}></i>
                <h3 className="admin-cleared-headline">No Events in this Category</h3>
                <p className="admin-cleared-subtext">
                  There are no recent platform audit entries matching the selected filter criteria.
                </p>
              </div>
            ) : (
              <div className="admin-stream-list">
                {filteredActivity.map((activity) => {
                  const isDispute = activity.type === 'DISPUTE';
                  const isKyc = activity.type === 'KYC';
                  const iconBoxClass = isDispute ? 'dispute' : isKyc ? 'kyc' : 'general';
                  const iconName = isDispute ? 'fa-gavel' : isKyc ? 'fa-shield-alt' : 'fa-bell';

                  return (
                    <div key={activity.id} className="admin-stream-row">
                      <div className={`admin-stream-icon-box ${iconBoxClass}`}>
                        <i className={`fas ${iconName}`}></i>
                      </div>
                      <div className="admin-stream-content">
                        <div className="admin-stream-top">
                          <span className="admin-stream-title">{activity.title}</span>
                          <span className="admin-stream-time">
                            {new Date(activity.createdAt).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="admin-stream-msg">{activity.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <div className="admin-side-stack">
          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="admin-panel-title-group">
                <i className="fas fa-server admin-panel-icon"></i>
                <h2 className="admin-panel-title">System Infrastructure</h2>
              </div>
            </div>

            <div className="admin-infra-stack">
              <div className="admin-infra-row">
                <div className="admin-infra-identity">
                  <span className="admin-infra-category">Primary Database</span>
                  <span className="admin-infra-title">PostgreSQL Engine</span>
                </div>
                <span className="admin-infra-pill healthy">
                  <i className="fas fa-check-circle"></i>
                  {operationalHealth.dbStatus}
                </span>
              </div>

              <div className="admin-infra-row">
                <div className="admin-infra-identity">
                  <span className="admin-infra-category">In-Memory Cache</span>
                  <span className="admin-infra-title">Redis KV Store</span>
                </div>
                <span className="admin-infra-pill healthy">
                  <i className="fas fa-bolt"></i>
                  {operationalHealth.redisStatus}
                </span>
              </div>

              <div className="admin-infra-row">
                <div className="admin-infra-identity">
                  <span className="admin-infra-category">Engine Uptime</span>
                  <span className="admin-infra-title">Core Services</span>
                </div>
                <span className="admin-infra-pill active">
                  <i className="fas fa-clock"></i>
                  {Math.floor(operationalHealth.uptimeSeconds / 3600)}h {Math.floor((operationalHealth.uptimeSeconds % 3600) / 60)}m
                </span>
              </div>

              <div className="admin-infra-row">
                <div className="admin-infra-identity">
                  <span className="admin-infra-category">Fulfillment Load</span>
                  <span className="admin-infra-title">Active In-Flight Orders</span>
                </div>
                <span className="admin-infra-pill active">
                  <i className="fas fa-tasks"></i>
                  {kpis.activeBookings} Jobs
                </span>
              </div>
            </div>
          </section>

          <section className="admin-panel">
            <div className="admin-panel-head">
              <div className="admin-panel-title-group">
                <i className="fas fa-th-large admin-panel-icon"></i>
                <h2 className="admin-panel-title">Administration Portals</h2>
              </div>
            </div>

            <div className="admin-nav-tiles-grid">
              <Link to="/admin/users" className="admin-nav-tile">
                <div className="admin-nav-tile-icon-box">
                  <i className="fas fa-users-cog"></i>
                </div>
                <span className="admin-nav-tile-label">User Management</span>
                <span className="admin-nav-tile-desc">Audit accounts &amp; suspensions</span>
              </Link>

              <Link to="/admin/categories" className="admin-nav-tile">
                <div className="admin-nav-tile-icon-box">
                  <i className="fas fa-layer-group"></i>
                </div>
                <span className="admin-nav-tile-label">Service Catalog</span>
                <span className="admin-nav-tile-desc">Manage categories &amp; rates</span>
              </Link>

              <Link to="/admin/bookings" className="admin-nav-tile">
                <div className="admin-nav-tile-icon-box">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <span className="admin-nav-tile-label">Bookings Oversight</span>
                <span className="admin-nav-tile-desc">Escrow &amp; milestone tracking</span>
              </Link>

              <Link to="/admin/settings" className="admin-nav-tile">
                <div className="admin-nav-tile-icon-box">
                  <i className="fas fa-sliders-h"></i>
                </div>
                <span className="admin-nav-tile-label">Platform Config</span>
                <span className="admin-nav-tile-desc">Fee tiers &amp; system policies</span>
              </Link>
            </div>
          </section>

          <div className="admin-security-cert-card">
            <i className="fas fa-shield-check admin-security-icon"></i>
            <div className="admin-security-info">
              <span className="admin-security-title">Platform Security &amp; Escrow</span>
              <span className="admin-security-desc">
                Role-based access control active. All sensitive marketplace payments are held securely in escrow until job completion.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
