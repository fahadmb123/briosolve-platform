import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/useDashboard';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();

  if (isLoading) {
    return (
      <div className="app-content">
        <div className="card p-8 text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-primary mb-3"></i>
          <p className="text-sm text-secondary mb-0">Loading admin marketplace metrics...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="app-content">
        <div className="card p-8 text-center">
          <i className="fas fa-exclamation-triangle text-2xl text-danger mb-3"></i>
          <p className="text-sm font-semibold text-text mb-1">Failed to load platform dashboard</p>
          <p className="text-xs text-secondary mb-4">An error occurred while fetching system health metrics.</p>
          <button onClick={() => refetch()} className="btn btn-primary text-xs">
            <i className="fas fa-sync-alt mr-1"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  const { kpis, recentActivity, operationalHealth } = data;

  return (
    <>
      <div className="app-content">
        <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
          <div>
            <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: '2rem' }}>
              Platform Dashboard
            </h1>
            <p className="text-secondary text-sm mb-0">
              Platform health, marketplace metrics, and pending governance actions.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/admin/verification" className="btn btn-warning text-xs">
              <i className="fas fa-user-check mr-1"></i>
              {kpis.pendingVerifications} Verifications Pending
            </Link>
            <Link to="/admin/reports" className="btn btn-danger text-xs">
              <i className="fas fa-gavel mr-1"></i>
              {kpis.openInvestigations} Open Investigations
            </Link>
          </div>
        </div>

        <div className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-primary-light text-primary">
              <i className="fas fa-users"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.totalCustomers.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Total Customers</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-info-light text-info">
              <i className="fas fa-user-tie"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.totalProviders.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Total Providers</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-success-light text-success">
              <i className="fas fa-shield-alt"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.verifiedProviders.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Verified Providers</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-warning-light text-warning">
              <i className="fas fa-user-clock"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.pendingVerifications.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Pending Verifications</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-primary-light text-primary">
              <i className="fas fa-file-invoice"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.activeRequests.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Active Requests</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-info-light text-info">
              <i className="fas fa-calculator"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.totalQuotations.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Total Quotations</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-success-light text-success">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.activeBookings.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Active Bookings</div>
            </div>
          </div>

          <div className="admin-kpi-card">
            <div className="admin-kpi-icon bg-danger-light text-danger">
              <i className="fas fa-gavel"></i>
            </div>
            <div>
              <div className="admin-kpi-val">{kpis.openInvestigations.toLocaleString()}</div>
              <div className="admin-kpi-lbl">Open Investigations</div>
            </div>
          </div>
        </div>

        <div className="dashboard-layout-grid">
          <div>
            <div className="card p-5 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="h5 mb-0">
                  <i className="fas fa-bolt text-warning mr-2"></i>Recent Platform Activity
                </h2>
                <Link to="/admin/reports" className="text-xs text-primary font-medium">
                  View Reports <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>

              {recentActivity.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted">
                  <i className="fas fa-stream text-2xl mb-2 text-muted"></i>
                  <p className="mb-0">No recent governance or system events recorded.</p>
                </div>
              ) : (
                <div className="activity-feed-list">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-feed-item">
                      <div className="activity-icon-badge bg-primary-light text-primary">
                        <i
                          className={`fas ${
                            activity.type === 'DISPUTE'
                              ? 'fa-gavel text-danger'
                              : activity.type === 'KYC'
                              ? 'fa-shield-alt text-warning'
                              : 'fa-bell text-primary'
                          }`}
                        ></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-semibold text-text">{activity.title}</span>
                          <span className="text-xs text-muted">
                            {new Date(activity.createdAt).toLocaleTimeString(undefined, {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-secondary mt-1 mb-0">{activity.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="card p-5">
              <h2 className="h5 mb-3">
                <i className="fas fa-server text-info mr-2"></i>Platform Operational Health
              </h2>
              <div className="health-grid">
                <div className="p-3 bg-surface-elevated rounded-md border">
                  <div className="text-xs text-muted">Database Engine</div>
                  <div className="text-base font-bold text-success mt-1">{operationalHealth.dbStatus}</div>
                  <div className="text-xs text-secondary mt-1">PostgreSQL • Optimal Status</div>
                </div>
                <div className="p-3 bg-surface-elevated rounded-md border">
                  <div className="text-xs text-muted">Active In-Flight Bookings</div>
                  <div className="text-base font-bold text-text mt-1">{kpis.activeBookings} active</div>
                  <div className="text-xs text-secondary mt-1">Confirmed &amp; In-progress</div>
                </div>
                <div className="p-3 bg-surface-elevated rounded-md border">
                  <div className="text-xs text-muted">Verification Queue</div>
                  <div className="text-base font-bold text-primary mt-1">{kpis.pendingVerifications} awaiting</div>
                  <div className="text-xs text-secondary mt-1">Provider KYC submissions</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="card p-5">
              <div className="flex justify-between items-center mb-4">
                <h2 className="h5 mb-0">
                  <i className="fas fa-clock text-warning mr-2"></i>Pending Actions Queue
                </h2>
                <span className="badge badge-warning">
                  {kpis.pendingVerifications + kpis.openInvestigations} Total
                </span>
              </div>

              <p className="text-xs text-secondary mb-4">
                Operational tasks requiring administrator intervention and review.
              </p>

              {kpis.pendingVerifications === 0 && kpis.openInvestigations === 0 ? (
                <div className="p-6 text-center text-xs text-muted">
                  <i className="fas fa-check-circle text-2xl text-success mb-2"></i>
                  <p className="font-semibold text-text mb-0">Queue is completely clear!</p>
                  <p className="mb-0">No pending verifications or open dispute cases.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {kpis.pendingVerifications > 0 && (
                    <div className="pending-action-card">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-warning text-xs">KYC Verification</span>
                          <span className="text-xs font-semibold text-text">
                            {kpis.pendingVerifications} Submission{kpis.pendingVerifications === 1 ? '' : 's'}
                          </span>
                        </div>
                        <div className="text-xs text-secondary mt-1">
                          Provider identity and credential verification dossiers
                        </div>
                      </div>
                      <Link to="/admin/verification" className="btn btn-secondary text-xs">
                        Review
                      </Link>
                    </div>
                  )}

                  {kpis.openInvestigations > 0 && (
                    <div className="pending-action-card">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="badge badge-danger text-xs">Investigation</span>
                          <span className="text-xs font-semibold text-text">
                            {kpis.openInvestigations} Case{kpis.openInvestigations === 1 ? '' : 's'}
                          </span>
                        </div>
                        <div className="text-xs text-secondary mt-1">
                          Escalated customer or provider dispute reports
                        </div>
                      </div>
                      <Link to="/admin/reports" className="btn btn-secondary text-xs">
                        Investigate
                      </Link>
                    </div>
                  )}
                </div>
              )}

              <div className="mt-4 pt-3 border-top text-center">
                <span className="text-xs text-muted">
                  <i className="fas fa-shield-alt mr-1"></i>Security Audit Log Status: Active
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
