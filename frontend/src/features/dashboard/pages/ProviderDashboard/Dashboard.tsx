import './Dashboard.css';
import { Link } from 'react-router-dom';
import { useProviderDashboard } from '../../hooks/useDashboard';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useProviderDashboard();

  if (isLoading) {
    return (
      <div className="app-content">
        <div className="card p-8 text-center">
          <i className="fas fa-spinner fa-spin text-2xl text-primary mb-3"></i>
          <p className="text-sm text-secondary mb-0">Loading provider dashboard...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="app-content">
        <div className="card p-8 text-center">
          <i className="fas fa-exclamation-triangle text-2xl text-danger mb-3"></i>
          <p className="text-sm font-semibold text-text mb-1">Failed to load dashboard metrics</p>
          <p className="text-xs text-secondary mb-4">Please check your network connection and try again.</p>
          <button onClick={() => refetch()} className="btn btn-primary text-xs">
            <i className="fas fa-sync-alt mr-1"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  const { provider, stats, opportunities, recentActivity } = data;
  const displayName = provider.businessName || provider.name || 'Provider';
  const locationString = provider.serviceArea || 'Registered Coverage Area';

  return (
    <>
      <div className="app-content">
        <div className="pro-welcome-banner">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`badge ${provider.isVerified ? 'badge-primary' : 'badge-warning'} text-xs`}>
                <i className={`fas ${provider.isVerified ? 'fa-shield-check' : 'fa-clock'} mr-1`}></i>
                {provider.isVerified ? 'Verified Pro' : 'Verification In-Progress'}
              </span>
              <span className="text-xs text-secondary">
                <i className="fas fa-map-marker-alt mr-1"></i> {locationString} (Within {provider.serviceRadiusKm} km)
              </span>
            </div>
            <h1 className="h2 mb-1">Good day, {displayName}</h1>
            <p className="text-secondary text-sm mb-0">
              Find new service requests and grow your business with direct client connections.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/provider/service-requests" className="btn btn-primary">
              <i className="fas fa-search-dollar mr-1"></i> Browse Requests
            </Link>
            <Link to="/provider/kyc" className="btn btn-outline text-xs">
              <i className="fas fa-shield-alt mr-1"></i> {provider.isVerified ? 'Verification Active' : 'Complete KYC'}
            </Link>
          </div>
        </div>

        <div className="card p-4 mb-6 flex justify-between items-center flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <div
              className="icon-circle bg-primary-light text-primary"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem'
              }}
            >
              <i className="fas fa-compass"></i>
            </div>
            <div>
              <div className="text-xs text-secondary uppercase font-semibold">Service Coverage Area</div>
              <div className="text-sm font-bold text-text">📍 {locationString}</div>
              <div className="text-xs text-secondary">
                Within <strong>{provider.serviceRadiusKm} km</strong> radius • Active dispatch zone
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link to="/provider/settings" className="btn btn-secondary btn-xs">
              <i className="fas fa-sliders-h mr-1"></i> Manage Service Area
            </Link>
          </div>
        </div>

        <div className="pro-stats-grid">
          <div className="card stat-widget">
            <div className="stat-icon-wrapper bg-primary-light text-primary">
              <i className="fas fa-search-dollar"></i>
            </div>
            <div className="stat-value">{stats.newRequestsCount}</div>
            <div className="stat-title">New Requests</div>
            <div className="stat-meta text-primary">
              <i className="fas fa-bolt mr-1"></i> Matching your profile
            </div>
          </div>

          <div className="card stat-widget">
            <div className="stat-icon-wrapper bg-warning-light text-warning">
              <i className="fas fa-file-invoice-dollar"></i>
            </div>
            <div className="stat-value">{stats.activeQuotationsCount}</div>
            <div className="stat-title">Active Quotations</div>
            <div className="stat-meta text-warning">
              <i className="fas fa-clock mr-1"></i> Awaiting client review
            </div>
          </div>

          <div className="card stat-widget">
            <div className="stat-icon-wrapper bg-info-light text-info">
              <i className="fas fa-calendar-check"></i>
            </div>
            <div className="stat-value">{stats.acceptedBookingsCount}</div>
            <div className="stat-title">Active Bookings</div>
            <div className="stat-meta text-info">
              <i className="fas fa-calendar-day mr-1"></i> Confirmed &amp; In-progress
            </div>
          </div>

          <div className="card stat-widget">
            <div className="stat-icon-wrapper bg-success-light text-success">
              <i className="fas fa-check-double"></i>
            </div>
            <div className="stat-value">{stats.completedServicesCount}</div>
            <div className="stat-title">Completed Services</div>
            <div className="stat-meta text-success">
              <i className="fas fa-check-circle mr-1"></i> Successfully delivered
            </div>
          </div>

          <div className="card stat-widget">
            <div className="stat-icon-wrapper bg-warning-light text-warning">
              <i className="fas fa-star"></i>
            </div>
            <div className="stat-value">
              {stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} ★` : '—'}
            </div>
            <div className="stat-title">Average Rating</div>
            <div className="stat-meta text-secondary">
              <i className="fas fa-thumbs-up mr-1"></i> {provider.reviewCount} review{provider.reviewCount === 1 ? '' : 's'}
            </div>
          </div>

          <div className="card stat-widget">
            <div className="stat-icon-wrapper bg-primary-light text-primary">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-value">₹{stats.totalEarnings.toLocaleString('en-IN')}</div>
            <div className="stat-title">Completed Volume</div>
            <div className="stat-meta text-muted">Total delivered service value</div>
          </div>
        </div>

        <div className="dashboard-grid-container">
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="h5 mb-0">Opportunities Matching Your Profile</h2>
                <p className="text-xs text-secondary mb-0">
                  Open requests posted recently in your coverage area
                </p>
              </div>
              <Link to="/provider/service-requests" className="btn btn-outline text-xs">
                View All Requests <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>

            {opportunities.length === 0 ? (
              <div className="card p-8 text-center text-secondary">
                <i className="fas fa-inbox text-3xl mb-2 text-muted"></i>
                <p className="text-sm font-semibold mb-1">No open opportunities right now</p>
                <p className="text-xs text-muted mb-0">
                  New service requests in your area will appear here automatically. Check back soon or expand your service radius in settings.
                </p>
              </div>
            ) : (
              opportunities.map((opp) => (
                <div key={opp.id} className="opportunity-card match-lead">
                  <div className="flex justify-between items-start flex-wrap gap-3 mb-2">
                    <div>
                      <div className="opportunity-badge-row">
                        <span className="badge badge-primary text-xs">
                          {opp.urgency.replace('_', ' ')}
                        </span>
                        <span className="badge badge-warning text-xs">
                          <i className="fas fa-clock mr-1"></i> {opp.quotationsCount} Bid{opp.quotationsCount === 1 ? '' : 's'}
                        </span>
                        <span className="text-xs text-muted">
                          ID: #{opp.id.slice(0, 8).toUpperCase()} • {new Date(opp.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <h3 className="h6 mb-1">
                        <Link to="/provider/service-requests" className="text-text hover-primary">
                          {opp.title}
                        </Link>
                      </h3>
                      <div className="text-xs text-secondary flex items-center gap-4 flex-wrap">
                        <span>
                          <i className="fas fa-tag text-primary mr-1"></i> {opp.categoryName}
                        </span>
                        <span>
                          <i className="fas fa-map-marker-alt text-primary mr-1"></i> {opp.location || locationString}
                        </span>
                        <span>
                          <i className="fas fa-clock text-warning mr-1"></i> Urgency: {opp.urgency}
                        </span>
                      </div>
                    </div>
                    <div className="lead-price-box">
                      <div className="text-xs text-secondary uppercase font-semibold">Service Status</div>
                      <div className="lead-budget">Ready for Quotes</div>
                    </div>
                  </div>
                  <p className="text-xs text-secondary mb-3 leading-relaxed">
                    {opp.description || 'No additional description provided.'}
                  </p>
                  <div className="flex justify-between items-center flex-wrap gap-2 pt-2 border-top">
                    <span className="text-xs text-muted">
                      <i className="fas fa-user-circle text-primary mr-1"></i> {opp.customerName}
                    </span>
                    <div className="flex items-center gap-2">
                      <Link to="/provider/service-requests" className="btn btn-primary text-xs">
                        <i className="fas fa-paper-plane mr-1"></i> View &amp; Quote
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col gap-4">
            <div className="card p-5">
              <div className="flex justify-between items-center mb-4">
                <h3 className="h6 mb-0">Recent Activity</h3>
                <span className="text-xs text-muted">Live updates</span>
              </div>

              {recentActivity.length === 0 ? (
                <div className="p-4 text-center text-xs text-muted">
                  No recent activity yet. When you receive quotes, bookings, or reviews, they will show up here.
                </div>
              ) : (
                <div className="activity-feed-list">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="activity-feed-item">
                      <div className="activity-icon-badge bg-primary-light text-primary">
                        <i className="fas fa-bell"></i>
                      </div>
                      <div className="activity-content">
                        <div className="activity-title">
                          <strong>{activity.title}</strong>: {activity.message}
                        </div>
                        <div className="activity-time">
                          {new Date(activity.createdAt).toLocaleString(undefined, {
                            dateStyle: 'short',
                            timeStyle: 'short'
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div
              className="card p-5"
              style={{
                background: 'linear-gradient(135deg, var(--surface) 0%, rgba(99, 102, 241, 0.05) 100%)'
              }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`avatar avatar-sm ${provider.isVerified ? 'bg-success-light text-success' : 'bg-warning-light text-warning'}`}>
                  <i className={`fas ${provider.isVerified ? 'fa-shield-check' : 'fa-shield-alt'} text-lg`}></i>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-text mb-0">
                    {provider.isVerified ? 'Verified Provider' : 'Verification Status'}
                  </h4>
                  <div className="text-xs text-secondary">
                    {provider.isVerified ? 'Full Credential Trust Active' : 'KYC Review Pending / Required'}
                  </div>
                </div>
              </div>
              <p className="text-xs text-secondary mb-3">
                {provider.isVerified
                  ? 'Your verified profile is prominently highlighted to clients across your coverage radius.'
                  : 'Submit and verify your documents to build trust with customers and win more requests.'}
              </p>
              <Link to="/provider/kyc" className="btn btn-outline text-xs w-full text-center">
                {provider.isVerified ? 'View Verification Details' : 'Complete Verification'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
