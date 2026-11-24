import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/useDashboard';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';
import './Dashboard.css';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="app-content admin-dash-root">
        <div className="admin-card text-center" style={{ padding: '3.5rem 1.5rem' }}>
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
          <h2 className="admin-stat-label" style={{ fontSize: '1.15rem', marginBottom: '0.4rem' }}>
            Failed to Load Platform Metrics
          </h2>
          <p className="admin-stat-desc" style={{ maxWidth: '420px', margin: '0 auto 1.5rem' }}>
            We encountered a network or authentication problem while querying administrative telemetry.
          </p>
          <button onClick={() => refetch()} className="admin-action-btn" style={{ margin: '0 auto' }}>
            <i className="fas fa-sync-alt"></i> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const { kpis, recentActivity, operationalHealth } = data;
  const verificationRatio = Math.round(
    ((kpis.verifiedProviders || 0) / (kpis.totalProviders || 1)) * 100
  );

  return (
    <div className="app-content admin-dash-root">
      <header className="admin-dash-header">
        <div className="admin-dash-title-wrap">
          <div className="admin-dash-badge-row">
            <span className="admin-portal-pill">
              <i className="fas fa-crown" style={{ marginRight: '0.35rem' }}></i>
              Platform Control
            </span>
            <span className="admin-health-pill">
              <span className="admin-pulse-dot"></span>
              All Systems Operational
            </span>
          </div>
          <h1 className="admin-dash-title">Platform Dashboard</h1>
          <p className="admin-dash-subtitle">
            Live overview of marketplace liquidity, user verification queues, active operations, and core infrastructure health.
          </p>
        </div>

        <div className="admin-dash-actions">
          {kpis.pendingVerifications > 0 && (
            <Link to="/admin/verification" className="admin-action-btn warning-alert">
              <i className="fas fa-shield-alt"></i>
              <span>Verifications</span>
              <span className="admin-btn-badge">{kpis.pendingVerifications}</span>
            </Link>
          )}

          {kpis.openInvestigations > 0 && (
            <Link to="/admin/support" className="admin-action-btn danger-alert">
              <i className="fas fa-gavel"></i>
              <span>Disputes</span>
              <span className="admin-btn-badge">{kpis.openInvestigations}</span>
            </Link>
          )}

          <button onClick={() => refetch()} className="admin-action-btn" title="Refresh metrics">
            <i className="fas fa-sync-alt"></i>
            <span>Refresh</span>
          </button>
        </div>
      </header>

      <section className="admin-metrics-section">
        <h2 className="admin-metrics-title">Marketplace Ecosystem &amp; Telemetry</h2>
        <div className="admin-kpi-grid-modern">
          <Link to="/admin/users?tab=customers" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box blue">
                <i className="fas fa-users"></i>
              </div>
              <span className="admin-stat-trend">Directory</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.totalCustomers.toLocaleString()}</div>
              <div className="admin-stat-label">Total Customers</div>
              <div className="admin-stat-desc">Registered marketplace demand accounts</div>
            </div>
          </Link>

          <Link to="/admin/users?tab=providers" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box purple">
                <i className="fas fa-user-tie"></i>
              </div>
              <span className="admin-stat-trend">Supply</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.totalProviders.toLocaleString()}</div>
              <div className="admin-stat-label">Total Providers</div>
              <div className="admin-stat-desc">Registered service professionals</div>
            </div>
          </Link>

          <Link to="/admin/users?tab=providers" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box green">
                <i className="fas fa-check-circle"></i>
              </div>
              <span className="admin-stat-trend">{verificationRatio}% Verified</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.verifiedProviders.toLocaleString()}</div>
              <div className="admin-stat-label">Verified Providers</div>
              <div className="admin-stat-desc">Passed KYC &amp; credential vetting</div>
            </div>
          </Link>

          <Link to="/admin/verification" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box amber">
                <i className="fas fa-user-clock"></i>
              </div>
              <span className="admin-stat-trend">Action Req</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.pendingVerifications.toLocaleString()}</div>
              <div className="admin-stat-label">Pending Reviews</div>
              <div className="admin-stat-desc">Provider applications awaiting audit</div>
            </div>
          </Link>

          <Link to="/admin/requests" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box orange">
                <i className="fas fa-clipboard-list"></i>
              </div>
              <span className="admin-stat-trend">Active</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.activeRequests.toLocaleString()}</div>
              <div className="admin-stat-label">Active Requests</div>
              <div className="admin-stat-desc">Open customer job postings in market</div>
            </div>
          </Link>

          <Link to="/admin/requests" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box blue">
                <i className="fas fa-file-invoice-dollar"></i>
              </div>
              <span className="admin-stat-trend">Bids</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.totalQuotations.toLocaleString()}</div>
              <div className="admin-stat-label">Total Quotations</div>
              <div className="admin-stat-desc">Competitive provider proposals submitted</div>
            </div>
          </Link>

          <Link to="/admin/bookings" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box green">
                <i className="fas fa-calendar-check"></i>
              </div>
              <span className="admin-stat-trend">Fulfillment</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.activeBookings.toLocaleString()}</div>
              <div className="admin-stat-label">Active Bookings</div>
              <div className="admin-stat-desc">Confirmed and in-progress jobs</div>
            </div>
          </Link>

          <Link to="/admin/support" className="admin-stat-card">
            <div className="admin-stat-card-top">
              <div className="admin-stat-icon-box rose">
                <i className="fas fa-gavel"></i>
              </div>
              <span className="admin-stat-trend">Resolution</span>
            </div>
            <div className="admin-stat-body">
              <div className="admin-stat-value">{kpis.openInvestigations.toLocaleString()}</div>
              <div className="admin-stat-label">Dispute Tickets</div>
              <div className="admin-stat-desc">Escalated disputes and report cases</div>
            </div>
          </Link>
        </div>
      </section>

      <div className="admin-main-grid">
        <div className="admin-feed-column">
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-header-left">
                <i className="fas fa-tasks admin-card-icon"></i>
                <h2 className="admin-card-title">Priority Governance Queue</h2>
              </div>
              <span className="admin-stat-trend">
                {kpis.pendingVerifications + kpis.openInvestigations} Pending
              </span>
            </div>

            {kpis.pendingVerifications === 0 && kpis.openInvestigations === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-shield-alt admin-empty-icon"></i>
                <h3 className="admin-empty-title">Governance Queue is Empty</h3>
                <p className="admin-empty-subtitle">
                  There are no pending provider verification dossiers or escalated dispute tickets requiring administrative action.
                </p>
              </div>
            ) : (
              <div className="admin-queue-list">
                {kpis.pendingVerifications > 0 && (
                  <div className="admin-queue-item">
                    <div className="admin-queue-item-left">
                      <div className="admin-queue-icon-circle amber">
                        <i className="fas fa-id-card"></i>
                      </div>
                      <div className="admin-queue-meta">
                        <div className="admin-queue-title-row">
                          <span className="admin-queue-title">KYC &amp; Onboarding Approvals</span>
                          <span className="admin-queue-count amber">
                            {kpis.pendingVerifications} Pending
                          </span>
                        </div>
                        <div className="admin-queue-desc">
                          Provider identity and qualification dossiers waiting for compliance verification.
                        </div>
                      </div>
                    </div>
                    <Link to="/admin/verification" className="admin-queue-btn">
                      <span>Review Queue</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                )}

                {kpis.openInvestigations > 0 && (
                  <div className="admin-queue-item">
                    <div className="admin-queue-item-left">
                      <div className="admin-queue-icon-circle rose">
                        <i className="fas fa-balance-scale"></i>
                      </div>
                      <div className="admin-queue-meta">
                        <div className="admin-queue-title-row">
                          <span className="admin-queue-title">Escalated Support &amp; Disputes</span>
                          <span className="admin-queue-count rose">
                            {kpis.openInvestigations} Open
                          </span>
                        </div>
                        <div className="admin-queue-desc">
                          Customer or provider disputes flagged for administrative mediation and resolution.
                        </div>
                      </div>
                    </div>
                    <Link to="/admin/support" className="admin-queue-btn">
                      <span>Investigate</span>
                      <i className="fas fa-arrow-right"></i>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-header-left">
                <i className="fas fa-stream admin-card-icon"></i>
                <h2 className="admin-card-title">Recent Platform Events</h2>
              </div>
              <Link to="/admin/support" className="admin-queue-btn">
                <span>Support Center</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            {recentActivity.length === 0 ? (
              <div className="admin-empty-state">
                <i className="fas fa-inbox admin-empty-icon" style={{ color: 'var(--text-secondary)' }}></i>
                <h3 className="admin-empty-title">No Recent Events</h3>
                <p className="admin-empty-subtitle">
                  Activity log is clean. New registrations, verifications, and disputes will stream here in real-time.
                </p>
              </div>
            ) : (
              <div className="admin-activity-stream">
                {recentActivity.map((activity) => {
                  const isDispute = activity.type === 'DISPUTE';
                  const isKyc = activity.type === 'KYC';
                  const avatarClass = isDispute ? 'rose' : isKyc ? 'amber' : 'blue';
                  const iconName = isDispute ? 'fa-gavel' : isKyc ? 'fa-shield-alt' : 'fa-bell';

                  return (
                    <div key={activity.id} className="admin-activity-row">
                      <div className={`admin-activity-avatar ${avatarClass}`}>
                        <i className={`fas ${iconName}`}></i>
                      </div>
                      <div className="admin-activity-info">
                        <div className="admin-activity-header">
                          <span className="admin-activity-item-title">{activity.title}</span>
                          <span className="admin-activity-time">
                            {new Date(activity.createdAt).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                        <p className="admin-activity-message">{activity.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="admin-side-column">
          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-header-left">
                <i className="fas fa-server admin-card-icon"></i>
                <h2 className="admin-card-title">System Infrastructure</h2>
              </div>
            </div>

            <div className="admin-infra-grid">
              <div className="admin-infra-cell">
                <div className="admin-infra-meta">
                  <span className="admin-infra-label">Primary Database</span>
                  <span className="admin-infra-name">PostgreSQL Engine</span>
                </div>
                <span className="admin-infra-status healthy">
                  <i className="fas fa-check-circle"></i>
                  {operationalHealth.dbStatus}
                </span>
              </div>

              <div className="admin-infra-cell">
                <div className="admin-infra-meta">
                  <span className="admin-infra-label">Cache &amp; Sessions</span>
                  <span className="admin-infra-name">Redis Cache Store</span>
                </div>
                <span className="admin-infra-status healthy">
                  <i className="fas fa-bolt"></i>
                  {operationalHealth.redisStatus}
                </span>
              </div>

              <div className="admin-infra-cell">
                <div className="admin-infra-meta">
                  <span className="admin-infra-label">Server Telemetry</span>
                  <span className="admin-infra-name">System Uptime</span>
                </div>
                <span className="admin-infra-status active">
                  <i className="fas fa-clock"></i>
                  {Math.floor(operationalHealth.uptimeSeconds / 3600)}h {Math.floor((operationalHealth.uptimeSeconds % 3600) / 60)}m
                </span>
              </div>

              <div className="admin-infra-cell">
                <div className="admin-infra-meta">
                  <span className="admin-infra-label">Order Pipeline</span>
                  <span className="admin-infra-name">Active Bookings</span>
                </div>
                <span className="admin-infra-status active">
                  <i className="fas fa-tasks"></i>
                  {kpis.activeBookings} In-Flight
                </span>
              </div>
            </div>
          </div>

          <div className="admin-card">
            <div className="admin-card-header">
              <div className="admin-card-header-left">
                <i className="fas fa-compass admin-card-icon"></i>
                <h2 className="admin-card-title">Admin Management</h2>
              </div>
            </div>

            <div className="admin-shortcuts-grid">
              <Link to="/admin/users" className="admin-shortcut-tile">
                <div className="admin-shortcut-icon">
                  <i className="fas fa-users-cog"></i>
                </div>
                <span className="admin-shortcut-name">User Management</span>
              </Link>

              <Link to="/admin/categories" className="admin-shortcut-tile">
                <div className="admin-shortcut-icon">
                  <i className="fas fa-th-list"></i>
                </div>
                <span className="admin-shortcut-name">Catalog &amp; Categories</span>
              </Link>

              <Link to="/admin/bookings" className="admin-shortcut-tile">
                <div className="admin-shortcut-icon">
                  <i className="fas fa-calendar-alt"></i>
                </div>
                <span className="admin-shortcut-name">Bookings Oversight</span>
              </Link>

              <Link to="/admin/settings" className="admin-shortcut-tile">
                <div className="admin-shortcut-icon">
                  <i className="fas fa-sliders-h"></i>
                </div>
                <span className="admin-shortcut-name">System Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
