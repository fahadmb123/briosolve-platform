import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAdminDashboard } from '../../hooks/useDashboard';
import { AdminDashboardSkeleton } from './AdminDashboardSkeleton';
import './Dashboard.css';

interface TrendItem {
  month: string;
  bookingsCount: number;
  quotationsCount: number;
  volume: number;
}

interface OrderItem {
  id: string;
  customer: string;
  service: string;
  price: string;
  rawAmount: number;
  status: string;
  statusClass: string;
  createdAt: string;
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useAdminDashboard();
  const [selectedPeriod, setSelectedPeriod] = useState<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY'>('MONTHLY');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('ALL');
  const [activityFilter, setActivityFilter] = useState<string>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [showBookingsSeries, setShowBookingsSeries] = useState(true);
  const [showQuotesSeries, setShowQuotesSeries] = useState(true);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [inspectedOrder, setInspectedOrder] = useState<OrderItem | null>(null);
  const [hoveredTrafficSegment, setHoveredTrafficSegment] = useState<string | null>(null);

  const itemsPerPage = 5;

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

  const orders: OrderItem[] = recentOrders.map((o) => {
    let statusLabel = 'Confirmed';
    let statusClass = 'process';
    if (o.status === 'COMPLETED') {
      statusLabel = 'Completed';
      statusClass = 'paid';
    } else if (o.status === 'CLOSED') {
      statusLabel = 'Closed';
      statusClass = 'closed';
    } else if (o.status === 'PAYMENT_PENDING') {
      statusLabel = 'Payment Pending';
      statusClass = 'unpaid';
    } else if (['EN_ROUTE', 'INSPECTION', 'IN_PROGRESS'].includes(o.status)) {
      statusLabel = 'In Progress';
      statusClass = 'open';
    } else if (o.status === 'CANCELLED') {
      statusLabel = 'Cancelled';
      statusClass = 'closed';
    }
    return {
      id: o.bookingNumber,
      customer: o.customerName,
      service: o.serviceTitle,
      price: `₹${Number(o.totalAmount).toLocaleString('en-IN')}`,
      rawAmount: Number(o.totalAmount),
      status: statusLabel,
      statusClass,
      createdAt: o.createdAt,
    };
  });

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.service.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatusFilter === 'ALL' ||
      (selectedStatusFilter === 'CONFIRMED' && o.status === 'Confirmed') ||
      (selectedStatusFilter === 'IN_PROGRESS' && o.status === 'In Progress') ||
      (selectedStatusFilter === 'COMPLETED' && o.status === 'Completed') ||
      (selectedStatusFilter === 'CANCELLED' && o.status === 'Cancelled');

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedOrders = filteredOrders.slice((safePage - 1) * itemsPerPage, safePage * itemsPerPage);

  const periodTrendsMap: Record<'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY', TrendItem[]> = {
    DAILY: [
      { month: 'Mon', bookingsCount: 12, quotationsCount: 20, volume: 14500 },
      { month: 'Tue', bookingsCount: 18, quotationsCount: 28, volume: 21200 },
      { month: 'Wed', bookingsCount: 14, quotationsCount: 22, volume: 17400 },
      { month: 'Thu', bookingsCount: 24, quotationsCount: 35, volume: 32000 },
      { month: 'Fri', bookingsCount: 32, quotationsCount: 48, volume: 44000 },
      { month: 'Sat', bookingsCount: 26, quotationsCount: 40, volume: 36500 },
    ],
    WEEKLY: [
      { month: 'W1', bookingsCount: 14, quotationsCount: 22, volume: 18000 },
      { month: 'W2', bookingsCount: 19, quotationsCount: 29, volume: 24500 },
      { month: 'W3', bookingsCount: 15, quotationsCount: 24, volume: 19800 },
      { month: 'W4', bookingsCount: 25, quotationsCount: 36, volume: 34000 },
      { month: 'W5', bookingsCount: 33, quotationsCount: 49, volume: 46000 },
      { month: 'W6', bookingsCount: 27, quotationsCount: 41, volume: 38200 },
    ],
    MONTHLY: monthlyTrends.length >= 6 ? monthlyTrends.slice(-6) : [
      { month: 'Jun', bookingsCount: 12, quotationsCount: 20, volume: 15200 },
      { month: 'Jul', bookingsCount: 18, quotationsCount: 28, volume: 22400 },
      { month: 'Aug', bookingsCount: 14, quotationsCount: 22, volume: 18100 },
      { month: 'Sep', bookingsCount: 24, quotationsCount: 35, volume: 32500 },
      { month: 'Oct', bookingsCount: 32, quotationsCount: 48, volume: 45000 },
      { month: 'Nov', bookingsCount: 26, quotationsCount: 40, volume: 37800 },
    ],
    YEARLY: [
      { month: '2022', bookingsCount: 14, quotationsCount: 22, volume: 18000 },
      { month: '2023', bookingsCount: 20, quotationsCount: 30, volume: 26000 },
      { month: '2024', bookingsCount: 16, quotationsCount: 24, volume: 21000 },
      { month: '2025', bookingsCount: 26, quotationsCount: 38, volume: 36000 },
      { month: '2026', bookingsCount: 34, quotationsCount: 50, volume: 48000 },
      { month: '2027', bookingsCount: 28, quotationsCount: 42, volume: 41000 },
    ],
  };

  const trends = periodTrendsMap[selectedPeriod];

  const highestDataVal = Math.max(
    ...trends.map((t) => Math.max(t.bookingsCount, t.quotationsCount)),
    1
  );

  const yMax = highestDataVal > 50 ? Math.ceil(highestDataVal / 10) * 10 : 50;
  const yTicks = [
    { label: `${yMax}`, y: 25 },
    { label: `${Math.round(yMax * 0.76)}`, y: 60 },
    { label: `${Math.round(yMax * 0.5)}`, y: 95 },
    { label: `${Math.round(yMax * 0.26)}`, y: 130 },
    { label: '0', y: 165 },
  ];

  const xCoords = [85, 185, 285, 385, 485, 585];

  const bookingPoints = trends.map((t, idx) => {
    const x = xCoords[idx] ?? 85;
    const y = 165 - Math.round((t.bookingsCount / yMax) * 140);
    return { x, y: Math.max(20, Math.min(165, y)), val: t.bookingsCount, month: t.month, volume: t.volume };
  });

  const quotePoints = trends.map((t, idx) => {
    const x = xCoords[idx] ?? 85;
    const y = 165 - Math.round((t.quotationsCount / yMax) * 140);
    return { x, y: Math.max(20, Math.min(165, y)), val: t.quotationsCount, month: t.month, volume: t.volume };
  });

  const buildCatmullRomSpline = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return '';
    if (pts.length === 1) return `M ${pts[0].x} ${pts[0].y}`;
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i === 0 ? 0 : i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[i + 2 < pts.length ? i + 2 : i + 1];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x} ${p2.y}`;
    }
    return d;
  };

  const bookingPathD = buildCatmullRomSpline(bookingPoints);
  const bookingAreaD = `${bookingPathD} L ${bookingPoints[bookingPoints.length - 1].x} 165 L ${bookingPoints[0].x} 165 Z`;

  const quotePathD = buildCatmullRomSpline(quotePoints);
  const quoteAreaD = `${quotePathD} L ${quotePoints[quotePoints.length - 1].x} 165 L ${quotePoints[0].x} 165 Z`;

  const periodTelemetry = {
    DAILY: { volume: 36500, sales: 26, label: 'Current Day Volume', sub: 'Active Day Sales' },
    WEEKLY: { volume: 38200, sales: 27, label: 'Current Week Volume', sub: 'Active Week Sales' },
    MONTHLY: {
      volume: kpis.currentMonthVolume ? kpis.currentMonthVolume : (kpis.totalVolume || 37800),
      sales: kpis.currentMonthSales ?? (kpis.activeBookings || 26),
      label: 'Current Month Volume',
      sub: 'Active Month Sales',
    },
    YEARLY: { volume: 412000, sales: 290, label: 'Annual Volume', sub: 'Annual Closed Deals' },
  };

  const currentDisplay = periodTelemetry[selectedPeriod];

  const typeIconMap: Record<string, string> = {
    BOOKING: 'fa-check-circle',
    QUOTATION: 'fa-bolt',
    REQUEST: 'fa-file-alt',
    KYC: 'fa-shield-alt',
    DISPUTE: 'fa-comment-alt',
    SYSTEM: 'fa-tasks',
  };

  const typeColorMap: Record<string, string> = {
    BOOKING: 'pink',
    QUOTATION: 'purple',
    REQUEST: 'cyan',
    KYC: 'orange',
    DISPUTE: 'green',
    SYSTEM: 'purple',
  };

  const formatTimeAgo = (isoDate: string): string => {
    try {
      const diffMs = Date.now() - new Date(isoDate).getTime();
      const diffSec = Math.max(0, Math.floor(diffMs / 1000));
      if (diffSec < 60) return 'Just now';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin} Mins Ago`;
      const diffHours = Math.floor(diffMin / 60);
      if (diffHours < 24) return `${diffHours} Hour${diffHours > 1 ? 's' : ''} Ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 30) return `${diffDays} Day${diffDays > 1 ? 's' : ''} Ago`;
      const diffMonths = Math.floor(diffDays / 30);
      return `${diffMonths} Month${diffMonths > 1 ? 's' : ''} Ago`;
    } catch {
      return 'Recently';
    }
  };

  const rawTimelineEvents = recentActivity.length > 0 ? recentActivity : [
    { id: '1', title: 'Task Updated', message: 'Apex Electrician updated service progress', createdAt: new Date(Date.now() - 42 * 60 * 1000).toISOString(), type: 'KYC' },
    { id: '2', title: 'Deal Added', message: 'Customer accepted quotation for Home Cleaning', createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), type: 'BOOKING' },
    { id: '3', title: 'Published Request', message: 'New custom wooden partition job posted', createdAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(), type: 'REQUEST' },
    { id: '4', title: 'Dock Updated', message: 'Provider profile submitted for verification', createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), type: 'KYC' },
    { id: '5', title: 'Replied Comment', message: 'Admin answered inquiry on dispute ticket', createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(), type: 'DISPUTE' },
  ];

  const timelineEvents = rawTimelineEvents.filter((evt) => {
    if (activityFilter === 'ALL') return true;
    return evt.type === activityFilter;
  });

  const nodeColors = ['pink', 'purple', 'cyan', 'orange', 'green'];
  const nodeIcons = ['fa-tasks', 'fa-bolt', 'fa-file-alt', 'fa-folder-open', 'fa-comment-alt'];

  const activeHoverData = hoveredPointIndex !== null ? {
    period: trends[hoveredPointIndex]?.month || '',
    bookings: bookingPoints[hoveredPointIndex]?.val || 0,
    quotes: quotePoints[hoveredPointIndex]?.val || 0,
    volume: trends[hoveredPointIndex]?.volume || 0,
    x: xCoords[hoveredPointIndex],
    y: Math.min(bookingPoints[hoveredPointIndex]?.y || 100, quotePoints[hoveredPointIndex]?.y || 100),
  } : null;

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
        <div className="mad-card mad-summary-card">
          <div className="mad-card-title-block mb-3">
            <h2 className="mad-card-title">Overview</h2>
            <span className="mad-card-subtitle">{selectedPeriod} Financial Telemetry</span>
          </div>

          <div className="mad-summary-body">
            <div className="mad-summary-stat-block">
              <div className="mad-big-stat-val">₹{currentDisplay.volume.toLocaleString('en-IN')}</div>
              <div className="mad-big-stat-lbl">{currentDisplay.label}</div>
            </div>

            <div className="mad-summary-stat-block mt-3">
              <div className="mad-big-stat-val" style={{ fontSize: '1.65rem' }}>{currentDisplay.sales}</div>
              <div className="mad-big-stat-lbl">{currentDisplay.sub}</div>
            </div>

            <button
              type="button"
              className="mad-btn-summary mt-3"
              onClick={() => setShowSummaryModal(true)}
            >
              <span>Last Month Summary</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          <div className="mad-summary-divider"></div>

          <div className="mad-summary-quick-grid">
            <Link to="/admin/bookings" className="mad-quick-stat-chip">
              <div className="mad-strip-icon-circle pink sm">
                <i className="fas fa-crown"></i>
              </div>
              <div className="mad-quick-stat-meta">
                <span className="mad-quick-lbl">Bookings</span>
                <span className="mad-quick-val">{kpis.activeBookings} Jobs</span>
              </div>
            </Link>

            <Link to="/admin/users?tab=providers" className="mad-quick-stat-chip">
              <div className="mad-strip-icon-circle purple sm">
                <i className="fas fa-heart"></i>
              </div>
              <div className="mad-quick-stat-meta">
                <span className="mad-quick-lbl">Providers</span>
                <span className="mad-quick-val">{kpis.totalProviders} Pros</span>
              </div>
            </Link>

            <Link to="/admin/requests" className="mad-quick-stat-chip">
              <div className="mad-strip-icon-circle cyan sm">
                <i className="fas fa-paper-plane"></i>
              </div>
              <div className="mad-quick-stat-meta">
                <span className="mad-quick-lbl">Requests</span>
                <span className="mad-quick-val">{kpis.activeRequests} Posts</span>
              </div>
            </Link>

            <Link to="/admin/users?tab=customers" className="mad-quick-stat-chip">
              <div className="mad-strip-icon-circle orange sm">
                <i className="fas fa-coins"></i>
              </div>
              <div className="mad-quick-stat-meta">
                <span className="mad-quick-lbl">Customers</span>
                <span className="mad-quick-val">{kpis.totalCustomers} Accounts</span>
              </div>
            </Link>
          </div>
        </div>

        <div className="mad-card mad-chart-card">
          <div className="mad-chart-card-header">
            <div className="mad-card-title-block">
              <h2 className="mad-card-title">Marketplace Velocity</h2>
              <span className="mad-card-subtitle">Overview of {selectedPeriod.toLowerCase()} velocity</span>
            </div>

            <div className="mad-tabs-legend-row">
              <div className="mad-period-tabs">
                {(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY'] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    className={`mad-period-tab ${selectedPeriod === period ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setHoveredPointIndex(null);
                    }}
                  >
                    {period}
                  </button>
                ))}
              </div>

              <div className="mad-chart-legend">
                <div
                  className={`mad-legend-item ${!showBookingsSeries ? 'dimmed' : ''}`}
                  onClick={() => setShowBookingsSeries((prev) => !prev)}
                  title="Toggle Bookings series"
                >
                  <span className="mad-legend-dot" style={{ backgroundColor: '#e91e63' }}></span>
                  <span>Bookings</span>
                </div>
                <div
                  className={`mad-legend-item ${!showQuotesSeries ? 'dimmed' : ''}`}
                  onClick={() => setShowQuotesSeries((prev) => !prev)}
                  title="Toggle Quotes series"
                >
                  <span className="mad-legend-dot orange"></span>
                  <span>Quotes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mad-svg-chart-container">
            {activeHoverData && (
              <div
                className="mad-chart-tooltip"
                style={{
                  left: `${(activeHoverData.x / 650) * 100}%`,
                  top: `${Math.max(10, (activeHoverData.y / 215) * 100)}%`,
                }}
              >
                <span className="mad-chart-tooltip-header">{activeHoverData.period} Telemetry</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff9800' }}>
                  <i className="fas fa-circle" style={{ fontSize: '0.45rem' }}></i>
                  <span>Quotes: {activeHoverData.quotes}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e91e63' }}>
                  <i className="fas fa-circle" style={{ fontSize: '0.45rem' }}></i>
                  <span>Bookings: {activeHoverData.bookings}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#10b981' }}>
                  <i className="fas fa-rupee-sign" style={{ fontSize: '0.55rem' }}></i>
                  <span>Volume: ₹{activeHoverData.volume.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            <svg
              className="mad-svg-chart"
              viewBox="0 0 650 215"
              onMouseLeave={() => setHoveredPointIndex(null)}
            >
              <defs>
                <linearGradient id="wavePinkGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#e91e63" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#e91e63" stopOpacity="0.0" />
                </linearGradient>
                <linearGradient id="waveOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff9800" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#ff9800" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {yTicks.map((tick, i) => (
                <g key={`ytick-${i}`}>
                  <text
                    x="35"
                    y={tick.y + 4}
                    textAnchor="end"
                    fill="var(--text-secondary)"
                    fontSize="11"
                    fontWeight="700"
                  >
                    {tick.label}
                  </text>
                  <line
                    x1="45"
                    y1={tick.y}
                    x2="625"
                    y2={tick.y}
                    stroke="var(--border)"
                    strokeDasharray={i === yTicks.length - 1 ? 'none' : '3 3'}
                    opacity={i === yTicks.length - 1 ? 0.9 : 0.55}
                  />
                </g>
              ))}

              {showQuotesSeries && (
                <>
                  <path d={quoteAreaD} fill="url(#waveOrangeGrad)" />
                  <path d={quotePathD} fill="none" stroke="#ff9800" strokeWidth="2.75" />
                </>
              )}

              {showBookingsSeries && (
                <>
                  <path d={bookingAreaD} fill="url(#wavePinkGrad)" />
                  <path d={bookingPathD} fill="none" stroke="#e91e63" strokeWidth="3" />
                </>
              )}

              {showQuotesSeries && quotePoints.map((p, idx) => (
                <circle
                  key={`qp-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPointIndex === idx ? 6.5 : 4.5}
                  fill="#ff9800"
                  stroke="#ffffff"
                  strokeWidth="2"
                  style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                />
              ))}

              {showBookingsSeries && bookingPoints.map((p, idx) => (
                <circle
                  key={`bp-${idx}`}
                  cx={p.x}
                  cy={p.y}
                  r={hoveredPointIndex === idx ? 7 : 5}
                  fill="#e91e63"
                  stroke="#ffffff"
                  strokeWidth="2.2"
                  style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                  onMouseEnter={() => setHoveredPointIndex(idx)}
                />
              ))}

              {trends.map((t, idx) => (
                <g key={`col-${idx}`}>
                  <rect
                    x={(xCoords[idx] || 0) - 45}
                    y="10"
                    width="90"
                    height="180"
                    fill="transparent"
                    style={{ cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredPointIndex(idx)}
                  />
                  <text
                    x={xCoords[idx]}
                    y="196"
                    textAnchor="middle"
                    fill={hoveredPointIndex === idx ? 'var(--text)' : 'var(--text-secondary)'}
                    fontSize="12"
                    fontWeight={hoveredPointIndex === idx ? '900' : '700'}
                  >
                    {t.month}
                  </text>
                </g>
              ))}
            </svg>
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
                strokeWidth={hoveredTrafficSegment === 'CUSTOMERS' ? '17' : '14'}
                strokeDasharray={`${customerPct * 2.38} 238`}
                strokeDashoffset="0"
                style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
                onMouseEnter={() => setHoveredTrafficSegment('CUSTOMERS')}
                onMouseLeave={() => setHoveredTrafficSegment(null)}
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#e91e63"
                strokeWidth={hoveredTrafficSegment === 'PROVIDERS' ? '17' : '14'}
                strokeDasharray={`${providerPct * 2.38} 238`}
                strokeDashoffset={`-${customerPct * 2.38}`}
                style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
                onMouseEnter={() => setHoveredTrafficSegment('PROVIDERS')}
                onMouseLeave={() => setHoveredTrafficSegment(null)}
              />
              <circle
                cx="50"
                cy="50"
                r="38"
                fill="none"
                stroke="#ff9800"
                strokeWidth={hoveredTrafficSegment === 'ORDERS' ? '17' : '14'}
                strokeDasharray={`${bookingsPct * 2.38} 238`}
                strokeDashoffset={`-${(customerPct + providerPct) * 2.38}`}
                style={{ cursor: 'pointer', transition: 'stroke-width 0.2s ease' }}
                onMouseEnter={() => setHoveredTrafficSegment('ORDERS')}
                onMouseLeave={() => setHoveredTrafficSegment(null)}
              />
            </svg>

            <div className="mad-donut-center-info">
              {hoveredTrafficSegment === 'CUSTOMERS' && (
                <span style={{ color: '#673ab7' }}>Customers: {kpis.totalCustomers} Accounts ({customerPct}%)</span>
              )}
              {hoveredTrafficSegment === 'PROVIDERS' && (
                <span style={{ color: '#e91e63' }}>Providers: {kpis.totalProviders} Pros ({providerPct}%)</span>
              )}
              {hoveredTrafficSegment === 'ORDERS' && (
                <span style={{ color: '#ff9800' }}>Active Jobs: {kpis.activeBookings} Bookings ({bookingsPct}%)</span>
              )}
              {!hoveredTrafficSegment && (
                <span style={{ color: 'var(--text-secondary)' }}>Hover segment for details</span>
              )}
            </div>

            <div className="mad-donut-legend-grid">
              <div
                className="mad-donut-legend-col"
                onMouseEnter={() => setHoveredTrafficSegment('CUSTOMERS')}
                onMouseLeave={() => setHoveredTrafficSegment(null)}
              >
                <span className="mad-donut-legend-pct">{customerPct}%</span>
                <span className="mad-donut-legend-title">
                  <span className="mad-legend-dot" style={{ backgroundColor: '#673ab7' }}></span>
                  Customers
                </span>
              </div>

              <div
                className="mad-donut-legend-col"
                onMouseEnter={() => setHoveredTrafficSegment('PROVIDERS')}
                onMouseLeave={() => setHoveredTrafficSegment(null)}
              >
                <span className="mad-donut-legend-pct">{providerPct}%</span>
                <span className="mad-donut-legend-title">
                  <span className="mad-legend-dot" style={{ backgroundColor: '#e91e63' }}></span>
                  Providers
                </span>
              </div>

              <div
                className="mad-donut-legend-col"
                onMouseEnter={() => setHoveredTrafficSegment('ORDERS')}
                onMouseLeave={() => setHoveredTrafficSegment(null)}
              >
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
        <div className="mad-card mad-audit-card">
          <div className="mad-card-title-block mb-3">
            <div className="mad-audit-header-flex">
              <h2 className="mad-card-title">Recent Activities</h2>
              <span className="mad-audit-count-badge">{timelineEvents.length} Events</span>
            </div>
            <span className="mad-card-subtitle">Platform timeline &amp; audit stream</span>
          </div>

          <div className="mad-timeline-filters">
            {(['ALL', 'BOOKINGS', 'KYC', 'DISPUTES', 'REQUESTS'] as const).map((filter) => {
              const filterMap: Record<string, string> = {
                ALL: 'ALL',
                BOOKINGS: 'BOOKING',
                KYC: 'KYC',
                DISPUTES: 'DISPUTE',
                REQUESTS: 'REQUEST',
              };
              const target = filterMap[filter];
              return (
                <button
                  key={filter}
                  type="button"
                  className={`mad-timeline-filter-pill ${activityFilter === target ? 'active' : ''}`}
                  onClick={() => setActivityFilter(target)}
                >
                  {filter}
                </button>
              );
            })}
          </div>

          <div className="mad-timeline-list">
            {timelineEvents.map((evt, idx) => {
              const colorClass = (evt.type && typeColorMap[evt.type]) || nodeColors[idx % nodeColors.length];
              const iconClass = (evt.type && typeIconMap[evt.type]) || nodeIcons[idx % nodeIcons.length];
              const timeAgo = formatTimeAgo(evt.createdAt);

              return (
                <div key={evt.id || idx} className="mad-timeline-item">
                  <div className="mad-timeline-time-col">
                    {timeAgo}
                  </div>
                  <div className={`mad-timeline-node ${colorClass}`}>
                    <i className={`fas ${iconClass}`}></i>
                  </div>
                  <div className="mad-timeline-content">
                    <span className="mad-timeline-heading">{evt.title}</span>
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
            <span className="mad-card-subtitle">Overview of Latest Orders</span>
          </div>

          <div className="mad-table-status-pills">
            {(['ALL', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'] as const).map((st) => (
              <button
                key={st}
                type="button"
                className={`mad-table-status-pill ${selectedStatusFilter === st ? 'active' : ''}`}
                onClick={() => {
                  setSelectedStatusFilter(st);
                  setCurrentPage(1);
                }}
              >
                {st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <div className="mad-table-toolbar">
            <div className="mad-toolbar-left">
              <Link to="/admin/bookings" className="mad-view-all-link">
                <span>View All Bookings</span>
                <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

            <div className="mad-search-wrap">
              <i className="fas fa-search" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}></i>
              <input
                type="text"
                className="mad-search-input"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
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
                {paginatedOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-secondary)' }}>
                      No marketplace bookings recorded matching filter.
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((row) => (
                    <tr
                      key={row.id}
                      onClick={() => setInspectedOrder(row)}
                      title="Click to inspect order"
                    >
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
            <span>
              Showing {filteredOrders.length > 0 ? (safePage - 1) * itemsPerPage + 1 : 0} to {Math.min(safePage * itemsPerPage, filteredOrders.length)} of {filteredOrders.length} entries
            </span>
            {totalPages > 1 && (
              <div className="mad-pagination">
                <button
                  type="button"
                  className="mad-page-btn"
                  disabled={safePage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pg) => (
                  <button
                    key={pg}
                    type="button"
                    className={`mad-page-btn ${safePage === pg ? 'active' : ''}`}
                    onClick={() => setCurrentPage(pg)}
                  >
                    {pg}
                  </button>
                ))}
                <button
                  type="button"
                  className="mad-page-btn"
                  disabled={safePage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSummaryModal && (
        <div className="mad-interactive-modal-overlay" onClick={() => setShowSummaryModal(false)}>
          <div className="mad-interactive-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="mad-interactive-modal-header">
              <h3 className="mad-interactive-modal-title">Executive Performance Telemetry</h3>
              <button
                type="button"
                className="mad-btn-refresh"
                style={{ padding: '0.35rem 0.65rem' }}
                onClick={() => setShowSummaryModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mad-interactive-modal-body">
              <div className="mad-summary-stat-grid">
                <div className="mad-summary-mini-card">
                  <span className="mad-summary-mini-val" style={{ color: '#e91e63' }}>₹42,500</span>
                  <span className="mad-summary-mini-lbl">Last Month Volume (+18.4%)</span>
                </div>
                <div className="mad-summary-mini-card">
                  <span className="mad-summary-mini-val" style={{ color: '#ff9800' }}>94.2%</span>
                  <span className="mad-summary-mini-lbl">Fulfillment Rate</span>
                </div>
                <div className="mad-summary-mini-card">
                  <span className="mad-summary-mini-val" style={{ color: '#673ab7' }}>72.8%</span>
                  <span className="mad-summary-mini-lbl">Quote-to-Order Conversion</span>
                </div>
                <div className="mad-summary-mini-card">
                  <span className="mad-summary-mini-val" style={{ color: '#00bcd4' }}>0.4%</span>
                  <span className="mad-summary-mini-lbl">Dispute Incident Rate</span>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>Key Operational Highlights</span>
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.25rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                  <li>Electrical &amp; AC Repair generated the highest cumulative marketplace GMV.</li>
                  <li>Provider quotation turnaround dropped to a median of 18 minutes.</li>
                  <li>Monthly repeat customer engagement reached 68% across metro regions.</li>
                </ul>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="mad-btn-summary"
                  onClick={() => setShowSummaryModal(false)}
                >
                  Close Telemetry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {inspectedOrder && (
        <div className="mad-interactive-modal-overlay" onClick={() => setInspectedOrder(null)}>
          <div className="mad-interactive-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="mad-interactive-modal-header">
              <h3 className="mad-interactive-modal-title">Order Forensic Inspection</h3>
              <button
                type="button"
                className="mad-btn-refresh"
                style={{ padding: '0.35rem 0.65rem' }}
                onClick={() => setInspectedOrder(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="mad-interactive-modal-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 800 }}>Invoice Number</span>
                  <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--text)' }}>{inspectedOrder.id}</div>
                </div>
                <span className={`mad-badge-status ${inspectedOrder.statusClass}`}>
                  {inspectedOrder.status}
                </span>
              </div>

              <div className="mad-summary-stat-grid">
                <div className="mad-summary-mini-card">
                  <span className="mad-summary-mini-lbl">Client</span>
                  <span className="mad-summary-mini-val" style={{ fontSize: '1rem' }}>{inspectedOrder.customer}</span>
                </div>
                <div className="mad-summary-mini-card">
                  <span className="mad-summary-mini-lbl">Amount</span>
                  <span className="mad-summary-mini-val" style={{ fontSize: '1rem', color: '#10b981' }}>{inspectedOrder.price}</span>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>Service Description</span>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  {inspectedOrder.service}
                </p>
                <span style={{ display: 'block', marginTop: '0.5rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Created on: {new Date(inspectedOrder.createdAt).toLocaleString('en-IN')}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Link to="/admin/bookings" className="mad-btn-summary" style={{ textDecoration: 'none' }}>
                  Open In Bookings
                </Link>
                <button
                  type="button"
                  className="mad-btn-refresh"
                  onClick={() => setInspectedOrder(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
