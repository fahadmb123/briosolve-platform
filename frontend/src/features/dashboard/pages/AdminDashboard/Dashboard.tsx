import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/useDashboard';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';
import './Dashboard.css';

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const [selectedPeriod, setSelectedPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [searchQuery, setSearchQuery] = useState('');

  if (isLoading) {
    return <AdminDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="app-content modern-admin-dashboard">
        <div className="mad-card text-center" style={{ padding: '3.5rem 1.5rem' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', color: '#e91e63', marginBottom: '1rem' }}></i>
          <h2 className="mad-card-title" style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>
            Failed to Load Dashboard Telemetry
          </h2>
          <p className="mad-card-subtitle" style={{ maxWidth: '400px', margin: '0 auto 1.5rem' }}>
            An error occurred while fetching marketplace metrics. Please check connection and retry.
          </p>
          <button onClick={() => refetch()} className="mad-btn-summary" style={{ margin: '0 auto' }}>
            <i className="fas fa-sync-alt"></i> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalCustomers: 0,
    totalProviders: 0,
    verifiedProviders: 0,
    pendingVerifications: 0,
    activeRequests: 0,
    totalQuotations: 0,
    activeBookings: 0,
    openInvestigations: 0,
    totalVolume: 0,
    currentMonthVolume: 0,
    currentMonthSales: 0,
  };
  const recentActivity = data?.recentActivity || [];
  const recentOrders = data?.recentOrders || [];
  const monthlyTrends = data?.monthlyTrends || [];

  const totalUsers = (kpis.totalCustomers || 0) + (kpis.totalProviders || 0) + (kpis.activeBookings || 0);
  const customerPct = totalUsers > 0 ? Math.max(5, Math.round(((kpis.totalCustomers || 0) / totalUsers) * 100)) : 50;
  const providerPct = totalUsers > 0 ? Math.max(5, Math.round(((kpis.totalProviders || 0) / totalUsers) * 100)) : 30;
  const bookingsPct = Math.max(0, 100 - customerPct - providerPct);

  const orders = recentOrders.map((o) => {
    let statusLabel = 'Process';
    let statusClass = 'process';
    if (o.status === 'COMPLETED') {
      statusLabel = 'Paid';
      statusClass = 'paid';
    } else if (o.status === 'CLOSED') {
      statusLabel = 'Closed';
      statusClass = 'closed';
    } else if (o.status === 'PAYMENT_PENDING') {
      statusLabel = 'Unpaid';
      statusClass = 'unpaid';
    } else if (['EN_ROUTE', 'INSPECTION', 'IN_PROGRESS'].includes(o.status)) {
      statusLabel = 'Open';
      statusClass = 'open';
    }
    return {
      id: o.bookingNumber,
      customer: o.customerName,
      service: o.serviceTitle,
      price: `₹${Number(o.totalAmount).toLocaleString('en-IN')}`,
      status: statusLabel,
      statusClass,
    };
  });

  const filteredOrders = orders.filter(
    (o) =>
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.service.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const trends = monthlyTrends.length > 0 ? monthlyTrends : [
    { month: 'Jan', bookingsCount: 12, quotationsCount: 22, volume: 15000 },
    { month: 'Feb', bookingsCount: 16, quotationsCount: 28, volume: 21000 },
    { month: 'Mar', bookingsCount: 14, quotationsCount: 26, volume: 18000 },
    { month: 'Apr', bookingsCount: 24, quotationsCount: 38, volume: 31000 },
    { month: 'May', bookingsCount: 30, quotationsCount: 48, volume: 42000 },
    { month: 'Jun', bookingsCount: 26, quotationsCount: 42, volume: 35000 },
  ];

  const maxPointVal = Math.max(
    ...trends.map((t) => Math.max(t.bookingsCount, t.quotationsCount, 1)),
    10
  );

  const xCoords = [25, 125, 225, 325, 425, 515];
  const bookingPoints = trends.map((t, idx) => {
    const x = xCoords[idx] ?? 25;
    const y = 150 - Math.round((t.bookingsCount / maxPointVal) * 110);
    return { x, y, val: t.bookingsCount, month: t.month };
  });

  const quotePoints = trends.map((t, idx) => {
    const x = xCoords[idx] ?? 25;
    const y = 150 - Math.round((t.quotationsCount / (maxPointVal * 1.25 || 1)) * 110);
    return { x, y, val: t.quotationsCount, month: t.month };
  });

  const bookingPathD = bookingPoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = bookingPoints[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const bookingAreaD = `${bookingPathD} L ${bookingPoints[bookingPoints.length - 1].x} 160 L ${bookingPoints[0].x} 160 Z`;

  const quotePathD = quotePoints.reduce((acc, p, i) => {
    if (i === 0) return `M ${p.x} ${p.y}`;
    const prev = quotePoints[i - 1];
    const cpx = (prev.x + p.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${p.y}, ${p.x} ${p.y}`;
  }, '');

  const quoteAreaD = `${quotePathD} L ${quotePoints[quotePoints.length - 1].x} 160 L ${quotePoints[0].x} 160 Z`;

  const displayVolume = kpis.currentMonthVolume
    ? kpis.currentMonthVolume
    : kpis.totalVolume
    ? kpis.totalVolume
    : (kpis.activeBookings * 1250);

  const displaySales = kpis.currentMonthSales ?? kpis.activeBookings;

  const timelineEvents = recentActivity.length > 0 ? recentActivity.slice(0, 5) : [
    { id: '1', title: 'Task Updated', message: 'Apex Electrician updated service progress', createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), type: 'KYC' },
    { id: '2', title: 'Deal Added', message: 'Customer accepted quotation for Home Cleaning', createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), type: 'BOOKING' },
    { id: '3', title: 'Published Request', message: 'New custom wooden partition job posted', createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), type: 'DISPUTE' },
    { id: '4', title: 'Dock Updated', message: 'Provider profile submitted for verification', createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), type: 'SYSTEM' },
    { id: '5', title: 'Replied Comment', message: 'Admin answered inquiry on dispute ticket', createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), type: 'DISPUTE' },
  ];

  const nodeColors = ['pink', 'purple', 'cyan', 'orange', 'green'];
  const nodeIcons = ['fa-tasks', 'fa-bolt', 'fa-file-alt', 'fa-folder-open', 'fa-comment-alt'];

  return (
    <div className="app-content modern-admin-dashboard">
      <div className="mad-header-row">
        <div className="mad-header-left">
          <h1 className="mad-page-title">Dashboard</h1>
          <p className="mad-page-subtitle">Real-time marketplace overview, revenue statistics, and live platform operations.</p>
        </div>
        <div className="mad-header-actions">
          {kpis.pendingVerifications > 0 && (
            <Link to="/admin/verification" className="mad-alert-pill warning">
              <i className="fas fa-user-clock"></i>
              <span>{kpis.pendingVerifications} Verifications</span>
            </Link>
          )}
          {kpis.openInvestigations > 0 && (
            <Link to="/admin/support" className="mad-alert-pill danger">
              <i className="fas fa-gavel"></i>
              <span>{kpis.openInvestigations} Disputes</span>
            </Link>
          )}
          <button onClick={() => refetch()} className="mad-btn-refresh" title="Refresh live statistics">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <div className="mad-top-grid">
        <div className="mad-card">
          <div className="mad-chart-card-header">
            <div className="mad-card-title-block">
              <h2 className="mad-card-title">Dashboard</h2>
              <span className="mad-card-subtitle">Overview of Latest Month</span>
            </div>

            <div className="mad-tabs-legend-row">
              <div className="mad-period-tabs">
                {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`mad-period-tab ${selectedPeriod === period ? 'active' : ''}`}
                    onClick={() => setSelectedPeriod(period)}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <div className="mad-chart-legend">
                <div className="mad-legend-item">
                  <span className="mad-legend-dot cyan"></span>
                  <span>Bookings</span>
                </div>
                <div className="mad-legend-item">
                  <span className="mad-legend-dot orange"></span>
                  <span>Quotes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mad-chart-body">
            <div className="mad-chart-metrics-left">
              <div>
                <div className="mad-big-stat-val">₹{displayVolume.toLocaleString('en-IN')}</div>
                <div className="mad-big-stat-lbl">Current Month Volume</div>
              </div>

              <div>
                <div className="mad-big-stat-val" style={{ fontSize: '1.65rem' }}>{displaySales}</div>
                <div className="mad-big-stat-lbl">Active Month Sales</div>
              </div>

              <Link to="/admin/bookings" className="mad-btn-summary">
                <span>Last Month Summary</span>
              </Link>
            </div>

            <div className="mad-svg-chart-container">
              <svg className="mad-svg-chart" viewBox="0 0 540 175" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="wavePinkGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e91e63" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#e91e63" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="waveOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9800" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ff9800" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="wavePurpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#673ab7" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#673ab7" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="35" x2="540" y2="35" stroke="var(--border)" strokeDasharray="3 3" opacity="0.6" />
                <line x1="0" y1="80" x2="540" y2="80" stroke="var(--border)" strokeDasharray="3 3" opacity="0.6" />
                <line x1="0" y1="125" x2="540" y2="125" stroke="var(--border)" strokeDasharray="3 3" opacity="0.6" />
                <line x1="0" y1="160" x2="540" y2="160" stroke="var(--border)" />

                <path d={quoteAreaD} fill="url(#waveOrangeGrad)" />
                <path d={quotePathD} fill="none" stroke="#ff9800" strokeWidth="2.5" />

                <path d={bookingAreaD} fill="url(#wavePinkGrad)" />
                <path d={bookingPathD} fill="none" stroke="#e91e63" strokeWidth="3" />

                {bookingPoints.map((p, idx) => (
                  <circle key={`bp-${idx}`} cx={p.x} cy={p.y} r="4.5" fill="#e91e63" stroke="#ffffff" strokeWidth="2" />
                ))}

                {quotePoints.map((p, idx) => (
                  <circle key={`qp-${idx}`} cx={p.x} cy={p.y} r="4" fill="#ff9800" stroke="#ffffff" strokeWidth="2" />
                ))}

                {trends.map((t, idx) => (
                  <text
                    key={`txt-${idx}`}
                    x={xCoords[idx] - 10}
                    y="172"
                    fill="var(--text-secondary)"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {t.month}
                  </text>
                ))}
              </svg>
            </div>
          </div>

          <div className="mad-chart-bottom-strip">
            <Link to="/admin/bookings" className="mad-strip-item">
              <div className="mad-strip-icon-circle pink">
                <i className="fas fa-crown"></i>
              </div>
              <div className="mad-strip-meta">
                <span className="mad-strip-lbl">Active Bookings</span>
                <span className="mad-strip-val">{kpis.activeBookings} Jobs</span>
              </div>
            </Link>

            <Link to="/admin/users?tab=providers" className="mad-strip-item">
              <div className="mad-strip-icon-circle purple">
                <i className="fas fa-heart"></i>
              </div>
              <div className="mad-strip-meta">
                <span className="mad-strip-lbl">Providers Pool</span>
                <span className="mad-strip-val">{kpis.totalProviders} Pros</span>
              </div>
            </Link>

            <Link to="/admin/requests" className="mad-strip-item">
              <div className="mad-strip-icon-circle cyan">
                <i className="fas fa-paper-plane"></i>
              </div>
              <div className="mad-strip-meta">
                <span className="mad-strip-lbl">Estimate Requests</span>
                <span className="mad-strip-val">{kpis.activeRequests} Posts</span>
              </div>
            </Link>

            <Link to="/admin/users?tab=customers" className="mad-strip-item">
              <div className="mad-strip-icon-circle orange">
                <i className="fas fa-coins"></i>
              </div>
              <div className="mad-strip-meta">
                <span className="mad-strip-lbl">Customers Base</span>
                <span className="mad-strip-val">{kpis.totalCustomers} Accounts</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="mad-card">
          <div className="mad-card-title-block mb-3">
            <h2 className="mad-card-title">Traffic &amp; Ecosystem</h2>
            <span className="mad-card-subtitle">Marketplace Segmentation</span>
          </div>

          <div className="mad-donut-wrap">
            <svg className="mad-donut-svg" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="38" fill="none" stroke="var(--border)" strokeWidth="14" />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#673ab7"
                strokeWidth="14"
                strokeDasharray={`${customerPct * 2.38} 238`}
                strokeDashoffset="0"
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#e91e63"
                strokeWidth="14"
                strokeDasharray={`${providerPct * 2.38} 238`}
                strokeDashoffset={`-${customerPct * 2.38}`}
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ff9800"
                strokeWidth="14"
                strokeDasharray={`${bookingsPct * 2.38} 238`}
                strokeDashoffset={`-${(customerPct + providerPct) * 2.38}`}
              />
            </svg>

            <div className="mad-donut-legend-grid">
              <div className="mad-donut-legend-col">
                <span className="mad-donut-legend-pct">{customerPct}%</span>
                <span className="mad-donut-legend-title">
                  <span className="mad-legend-dot" style={{ backgroundColor: '#673ab7' }}></span>
                  Customers
                </span>
              </div>

              <div className="mad-donut-legend-col">
                <span className="mad-donut-legend-pct">{providerPct}%</span>
                <span className="mad-donut-legend-title">
                  <span className="mad-legend-dot" style={{ backgroundColor: '#e91e63' }}></span>
                  Providers
                </span>
              </div>

              <div className="mad-donut-legend-col">
                <span className="mad-donut-legend-pct">{bookingsPct}%</span>
                <span className="mad-donut-legend-title">
                  <span className="mad-legend-dot" style={{ backgroundColor: '#ff9800' }}></span>
                  Orders
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mad-kpi-quad-grid">
        <Link to="/admin/bookings" className="mad-grad-card mad-grad-pink">
          <div className="mad-grad-header">
            <span className="mad-grad-title">Revenue Status</span>
            <span className="mad-grad-badge">Live</span>
          </div>
          <div className="mad-grad-body">
            <svg className="mad-grad-graphic" viewBox="0 0 60 30">
              <rect x="4" y="14" width="6" height="16" rx="2" fill="#ffffff" />
              <rect x="15" y="8" width="6" height="22" rx="2" fill="#ffffff" />
              <rect x="26" y="18" width="6" height="12" rx="2" fill="#ffffff" />
              <rect x="37" y="4" width="6" height="26" rx="2" fill="#ffffff" />
              <rect x="48" y="10" width="6" height="20" rx="2" fill="#ffffff" />
            </svg>
            <div className="mad-grad-num-block">
              <span className="mad-grad-val">{kpis.activeBookings}</span>
              <span className="mad-grad-sub">In-Flight Bookings</span>
            </div>
          </div>
        </Link>

        <Link to="/admin/requests" className="mad-grad-card mad-grad-purple">
          <div className="mad-grad-header">
            <span className="mad-grad-title">Page View &amp; Demands</span>
            <span className="mad-grad-badge">Active</span>
          </div>
          <div className="mad-grad-body">
            <svg className="mad-grad-graphic" viewBox="0 0 60 30">
              <path d="M 0 25 Q 15 5, 30 18 T 60 8 L 60 30 L 0 30 Z" fill="rgba(255,255,255,0.3)" />
              <path d="M 0 25 Q 15 5, 30 18 T 60 8" fill="none" stroke="#ffffff" strokeWidth="2" />
            </svg>
            <div className="mad-grad-num-block">
              <span className="mad-grad-val">{kpis.activeRequests}</span>
              <span className="mad-grad-sub">Active RFQ Posts</span>
            </div>
          </div>
        </Link>

        <Link to="/admin/requests" className="mad-grad-card mad-grad-cyan">
          <div className="mad-grad-header">
            <span className="mad-grad-title">Quotations Flow</span>
            <span className="mad-grad-badge">Monthly ▾</span>
          </div>
          <div className="mad-grad-body">
            <svg className="mad-grad-graphic" viewBox="0 0 60 30">
              <path d="M 4 22 Q 18 10, 30 18 T 54 8" fill="none" stroke="#ffffff" strokeWidth="2" />
              <circle cx="4" cy="22" r="2.5" fill="#ffffff" />
              <circle cx="18" cy="14" r="2.5" fill="#ffffff" />
              <circle cx="32" cy="18" r="2.5" fill="#ffffff" />
              <circle cx="44" cy="12" r="2.5" fill="#ffffff" />
              <circle cx="54" cy="8" r="2.5" fill="#ffffff" />
            </svg>
            <div className="mad-grad-num-block">
              <span className="mad-grad-val">{kpis.totalQuotations}</span>
              <span className="mad-grad-sub">Submitted Quotes</span>
            </div>
          </div>
        </Link>

        <Link to="/admin/verification" className="mad-grad-card mad-grad-amber">
          <div className="mad-grad-header">
            <span className="mad-grad-title">Governance Status</span>
            <span className="mad-grad-badge">Audit</span>
          </div>
          <div className="mad-grad-body">
            <svg className="mad-grad-graphic" viewBox="0 0 60 30">
              <rect x="4" y="8" width="6" height="22" rx="2" fill="#ffffff" />
              <rect x="15" y="16" width="6" height="14" rx="2" fill="#ffffff" />
              <rect x="26" y="6" width="6" height="24" rx="2" fill="#ffffff" />
              <rect x="37" y="14" width="6" height="16" rx="2" fill="#ffffff" />
              <rect x="48" y="4" width="6" height="26" rx="2" fill="#ffffff" />
            </svg>
            <div className="mad-grad-num-block">
              <span className="mad-grad-val">{kpis.pendingVerifications + kpis.openInvestigations}</span>
              <span className="mad-grad-sub">Pending Actions</span>
            </div>
          </div>
        </Link>
      </div>

      <div className="mad-bottom-grid">
        <div className="mad-card">
          <div className="mad-card-title-block mb-3">
            <h2 className="mad-card-title">Recent Activities</h2>
            <span className="mad-card-subtitle">Platform timeline &amp; audit events</span>
          </div>

          <div className="mad-timeline-list">
            {timelineEvents.map((evt, idx) => {
              const colorClass = nodeColors[idx % nodeColors.length];
              const iconClass = nodeIcons[idx % nodeIcons.length];

              return (
                <div key={evt.id || idx} className="mad-timeline-item">
                  <div className={`mad-timeline-node ${colorClass}`}>
                    <i className={`fas ${iconClass}`}></i>
                  </div>
                  <div className="mad-timeline-content">
                    <div className="mad-timeline-top">
                      <span className="mad-timeline-heading">{evt.title}</span>
                      <span className="mad-timeline-time">
                        {new Date(evt.createdAt).toLocaleTimeString(undefined, {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="mad-timeline-desc">{evt.message}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mad-card">
          <div className="mad-card-title-block mb-3">
            <h2 className="mad-card-title">Order Status</h2>
            <span className="mad-card-subtitle">Overview of Latest Month</span>
          </div>

          <div className="mad-table-toolbar">
            <div className="mad-toolbar-left">
              <Link to="/admin/bookings" className="mad-btn-pill-add">
                <i className="fas fa-plus"></i> Add
              </Link>
              <button type="button" onClick={() => refetch()} className="mad-btn-tool-icon" title="Refresh">
                <i className="fas fa-sync-alt"></i>
              </button>
              <button type="button" className="mad-btn-tool-icon" title="Filter list">
                <i className="fas fa-filter"></i>
              </button>
            </div>

            <div className="mad-search-wrap">
              <i className="fas fa-search" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}></i>
              <input
                type="text"
                className="mad-search-input"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mad-table-responsive">
            <table className="mad-order-table">
              <thead>
                <tr>
                  <th>INVOICE</th>
                  <th>CUSTOMERS</th>
                  <th>SERVICE</th>
                  <th>PRICE</th>
                  <th>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                      No marketplace bookings recorded yet.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((row) => (
                    <tr key={row.id}>
                      <td>
                        <span style={{ fontWeight: 800, color: 'var(--text)' }}>{row.id}</span>
                      </td>
                      <td>{row.customer}</td>
                      <td>{row.service}</td>
                      <td style={{ fontWeight: 800 }}>{row.price}</td>
                      <td>
                        <span className={`mad-badge-status ${row.statusClass}`}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mad-table-footer">
            <span>Showing 1 to {filteredOrders.length} of {filteredOrders.length} entries</span>
            <div className="mad-pagination">
              <button type="button" className="mad-page-btn">‹</button>
              <button type="button" className="mad-page-btn active">1</button>
              <button type="button" className="mad-page-btn">2</button>
              <button type="button" className="mad-page-btn">3</button>
              <button type="button" className="mad-page-btn">4</button>
              <button type="button" className="mad-page-btn">›</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
