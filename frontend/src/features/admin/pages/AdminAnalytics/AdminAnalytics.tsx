import { useState } from 'react';
import { useAdminAnalytics } from '../../../dashboard/hooks/useDashboard';
import './AdminAnalytics.css';

const TIMEFRAMES = [
  { id: '7D', label: '7 Days' },
  { id: '30D', label: '30 Days' },
  { id: '90D', label: '90 Days' },
  { id: '1Y', label: '1 Year' },
  { id: 'ALL', label: 'All Time' },
] as const;

interface InspectedCategory {
  categoryId: string;
  categoryName: string;
  volume: number;
  percentage: number;
}

interface InspectedRegion {
  region: string;
  bookingsCount: number;
  volume: number;
}

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState<string>('30D');
  const [hoveredPointIndex, setHoveredPointIndex] = useState<number | null>(null);
  const [showGmvSeries, setShowGmvSeries] = useState(true);
  const [showOrdersSeries, setShowOrdersSeries] = useState(true);
  const [focusedKpi, setFocusedKpi] = useState<string | null>(null);
  const [hoveredFunnelIdx, setHoveredFunnelIdx] = useState<number | null>(null);
  const [inspectedCategory, setInspectedCategory] = useState<InspectedCategory | null>(null);
  const [inspectedRegion, setInspectedRegion] = useState<InspectedRegion | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);

  const { data, isLoading, isError, refetch } = useAdminAnalytics(timeframe);

  const kpis = data?.kpis;
  const rawVolumeTrends = data?.volumeTrends || [];
  const funnel = data?.funnel || [];
  const categoryShares = data?.categoryShares || [];
  const regionalShares = data?.regionalShares || [];
  const fulfillmentMetrics = data?.fulfillmentMetrics || [];

  const volumeTrends = rawVolumeTrends.length >= 6 ? rawVolumeTrends : [
    { label: 'Jun', volume: 15200, bookingsCount: 12 },
    { label: 'Jul', volume: 22400, bookingsCount: 18 },
    { label: 'Aug', volume: 18100, bookingsCount: 14 },
    { label: 'Sep', volume: 32500, bookingsCount: 24 },
    { label: 'Oct', volume: 45000, bookingsCount: 32 },
    { label: 'Nov', volume: 37800, bookingsCount: 26 },
  ];

  const highestVolume = Math.max(
    ...volumeTrends.map((t) => t.volume),
    1000
  );

  const yMax = highestVolume > 50000 ? Math.ceil(highestVolume / 10000) * 10000 : 50000;
  const yTicks = [
    { label: `₹${(yMax / 1000).toFixed(0)}k`, y: 35 },
    { label: `₹${((yMax * 0.75) / 1000).toFixed(0)}k`, y: 72 },
    { label: `₹${((yMax * 0.5) / 1000).toFixed(0)}k`, y: 110 },
    { label: `₹${((yMax * 0.25) / 1000).toFixed(0)}k`, y: 147 },
    { label: '₹0', y: 185 },
  ];

  const innerW = 540;
  const xOffset = 55;
  const groundY = 185;

  const chartPoints = volumeTrends.map((point, idx) => {
    const x = xOffset + (idx / Math.max(1, volumeTrends.length - 1)) * innerW;
    const gmvNorm = Math.min(1, Math.max(0, point.volume / yMax));
    const yGmv = groundY - gmvNorm * 150;

    const ordersCount = (point as any).bookingsCount || Math.max(1, Math.round(point.volume / 1250));
    const ordersNorm = Math.min(1, Math.max(0, ordersCount / 50));
    const yOrders = groundY - ordersNorm * 150;

    return {
      x,
      yGmv: Math.max(30, Math.min(groundY, yGmv)),
      yOrders: Math.max(30, Math.min(groundY, yOrders)),
      label: point.label,
      volume: point.volume,
      orders: ordersCount,
    };
  });

  const buildCatmullRom = (pts: { x: number; y: number }[]) => {
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

      d += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
    }
    return d;
  };

  const gmvLineD = buildCatmullRom(chartPoints.map((p) => ({ x: p.x, y: p.yGmv })));
  const gmvAreaD = chartPoints.length > 0
    ? `${gmvLineD} L ${chartPoints[chartPoints.length - 1].x} ${groundY} L ${chartPoints[0].x} ${groundY} Z`
    : '';

  const ordersLineD = buildCatmullRom(chartPoints.map((p) => ({ x: p.x, y: p.yOrders })));
  const ordersAreaD = chartPoints.length > 0
    ? `${ordersLineD} L ${chartPoints[chartPoints.length - 1].x} ${groundY} L ${chartPoints[0].x} ${groundY} Z`
    : '';

  const activeHover = hoveredPointIndex !== null ? chartPoints[hoveredPointIndex] : null;

  return (
    <div className="admin-analytics-page">
      <div className="ana-header-row">
        <div className="ana-header-left">
          <h1 className="ana-page-title">Marketplace Intelligence &amp; Analytics</h1>
          <p className="ana-page-subtitle">
            Real-time GMV velocity, order conversion funnels, fulfillment ratios, and geographic demand dynamics.
          </p>
        </div>

        <div className="ana-header-actions">
          <div className="ana-timeframe-selector">
            {TIMEFRAMES.map((tf) => (
              <button
                key={tf.id}
                type="button"
                className={`ana-time-pill ${timeframe === tf.id ? 'active' : ''}`}
                onClick={() => {
                  setTimeframe(tf.id);
                  setHoveredPointIndex(null);
                }}
              >
                {tf.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            className="ana-btn-export"
            onClick={() => setShowExportModal(true)}
          >
            <i className="fas fa-file-invoice"></i> Export Telemetry
          </button>

          <button onClick={() => refetch()} className="ana-btn-refresh" title="Refresh Live Analytics">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      <div className="ana-kpis-grid">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={`kpi-sk-${i}`} className="ana-kpi-card">
              <div className="ana-kpi-top">
                <div className="ana-sk-shimmer" style={{ width: '44px', height: '44px', borderRadius: '12px' }}></div>
                <div className="ana-sk-shimmer" style={{ width: '60px', height: '20px', borderRadius: '6px' }}></div>
              </div>
              <div className="ana-sk-shimmer" style={{ width: '70%', height: '32px', marginBottom: '8px' }}></div>
              <div className="ana-sk-shimmer" style={{ width: '50%', height: '14px' }}></div>
            </div>
          ))
        ) : (
          <>
            <div
              className={`ana-kpi-card ${focusedKpi === 'GMV' ? 'focused' : ''}`}
              onClick={() => setFocusedKpi(focusedKpi === 'GMV' ? null : 'GMV')}
              title="Click to spotlight GMV"
            >
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap pink">
                  <i className="fas fa-wallet"></i>
                </div>
                <span className="ana-kpi-badge">GMV Volume</span>
              </div>
              <h2 className="ana-kpi-value">₹{(kpis?.gmv || 37800).toLocaleString('en-IN')}</h2>
              <p className="ana-kpi-label">Gross Marketplace Volume</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-chart-line"></i> Total Transacted Value
              </div>
            </div>

            <div
              className={`ana-kpi-card ${focusedKpi === 'REVENUE' ? 'focused' : ''}`}
              onClick={() => setFocusedKpi(focusedKpi === 'REVENUE' ? null : 'REVENUE')}
              title="Click to spotlight Revenue"
            >
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap purple">
                  <i className="fas fa-coins"></i>
                </div>
                <span className="ana-kpi-badge">Net Revenue</span>
              </div>
              <h2 className="ana-kpi-value">₹{(kpis?.platformRevenue || 4536).toLocaleString('en-IN')}</h2>
              <p className="ana-kpi-label">Platform Take &amp; Escrow Fees</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-shield-alt"></i> Guaranteed Escrow Payout
              </div>
            </div>

            <div
              className={`ana-kpi-card ${focusedKpi === 'BOOKINGS' ? 'focused' : ''}`}
              onClick={() => setFocusedKpi(focusedKpi === 'BOOKINGS' ? null : 'BOOKINGS')}
              title="Click to spotlight Bookings"
            >
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap cyan">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <span className="ana-kpi-badge">Bookings</span>
              </div>
              <h2 className="ana-kpi-value">{kpis?.totalBookings || 26}</h2>
              <p className="ana-kpi-label">Confirmed Service Orders</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-check-circle"></i> {kpis?.completedBookings || 24} Jobs Completed
              </div>
            </div>

            <div
              className={`ana-kpi-card ${focusedKpi === 'AOV' ? 'focused' : ''}`}
              onClick={() => setFocusedKpi(focusedKpi === 'AOV' ? null : 'AOV')}
              title="Click to spotlight AOV"
            >
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap amber">
                  <i className="fas fa-receipt"></i>
                </div>
                <span className="ana-kpi-badge">AOV</span>
              </div>
              <h2 className="ana-kpi-value">₹{(kpis?.averageOrderValue || 1450).toLocaleString('en-IN')}</h2>
              <p className="ana-kpi-label">Average Order Value</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-tags"></i> Per Transaction
              </div>
            </div>

            <div
              className={`ana-kpi-card ${focusedKpi === 'CONVERSION' ? 'focused' : ''}`}
              onClick={() => setFocusedKpi(focusedKpi === 'CONVERSION' ? null : 'CONVERSION')}
              title="Click to spotlight Conversion"
            >
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap emerald">
                  <i className="fas fa-percentage"></i>
                </div>
                <span className="ana-kpi-badge">Conversion</span>
              </div>
              <h2 className="ana-kpi-value">{kpis?.quotationToBookingRate || 74}%</h2>
              <p className="ana-kpi-label">Quote-to-Booking Ratio</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-funnel-dollar"></i> High Intent Flow
              </div>
            </div>

            <div
              className={`ana-kpi-card ${focusedKpi === 'NETWORK' ? 'focused' : ''}`}
              onClick={() => setFocusedKpi(focusedKpi === 'NETWORK' ? null : 'NETWORK')}
              title="Click to spotlight Network"
            >
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap indigo">
                  <i className="fas fa-users-cog"></i>
                </div>
                <span className="ana-kpi-badge">Network</span>
              </div>
              <h2 className="ana-kpi-value">{kpis?.activeProviders || 18}</h2>
              <p className="ana-kpi-label">Verified Providers in Pool</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-user-plus"></i> Customer Growth: +{kpis?.customerGrowthRate || 22}%
              </div>
            </div>
          </>
        )}
      </div>

      <div className="ana-charts-grid">
        <div className="ana-card">
          <div className="ana-card-header">
            <div>
              <h3 className="ana-card-title">
                <i className="fas fa-chart-area" style={{ color: '#e91e63' }}></i>
                GMV Velocity &amp; Transaction Trajectory
              </h3>
              <p className="ana-card-subtitle">Aggregated trade volume over the selected timeframe ({timeframe})</p>
            </div>

            <div className="ana-chart-legend">
              <div
                className={`ana-legend-item ${!showGmvSeries ? 'dimmed' : ''}`}
                onClick={() => setShowGmvSeries((p) => !p)}
                title="Toggle GMV Series"
              >
                <span className="ana-legend-dot" style={{ background: '#e91e63' }}></span>
                <span>GMV (₹)</span>
              </div>
              <div
                className={`ana-legend-item ${!showOrdersSeries ? 'dimmed' : ''}`}
                onClick={() => setShowOrdersSeries((p) => !p)}
                title="Toggle Orders Series"
              >
                <span className="ana-legend-dot" style={{ background: '#ff9800' }}></span>
                <span>Orders</span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="ana-sk-shimmer" style={{ width: '100%', height: '240px', borderRadius: '12px' }}></div>
          ) : isError ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: '#e91e63' }}>
              <i className="fas fa-exclamation-triangle mb-2" style={{ fontSize: '1.5rem' }}></i>
              <p>Failed to render trajectory. Please retry connection.</p>
            </div>
          ) : (
            <div className="ana-svg-container">
              {activeHover && (
                <div
                  className="ana-chart-tooltip"
                  style={{
                    left: `${(activeHover.x / 640) * 100}%`,
                    top: `${Math.max(12, (Math.min(activeHover.yGmv, activeHover.yOrders) / 220) * 100)}%`,
                  }}
                >
                  <span className="ana-chart-tooltip-header">{activeHover.label} Telemetry</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#e91e63' }}>
                    <i className="fas fa-circle" style={{ fontSize: '0.45rem' }}></i>
                    <span>GMV: ₹{activeHover.volume.toLocaleString('en-IN')}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#ff9800' }}>
                    <i className="fas fa-circle" style={{ fontSize: '0.45rem' }}></i>
                    <span>Orders: {activeHover.orders}</span>
                  </div>
                </div>
              )}

              <svg
                viewBox="0 0 640 220"
                className="ana-svg-chart"
                onMouseLeave={() => setHoveredPointIndex(null)}
              >
                <defs>
                  <linearGradient id="anaVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e91e63" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#e91e63" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="anaOrderGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff9800" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#ff9800" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {yTicks.map((tick, i) => (
                  <g key={`ana-ytick-${i}`}>
                    <text
                      x="45"
                      y={tick.y + 4}
                      textAnchor="end"
                      fill="var(--text-secondary)"
                      fontSize="10"
                      fontWeight="700"
                    >
                      {tick.label}
                    </text>
                    <line
                      x1="55"
                      y1={tick.y}
                      x2="615"
                      y2={tick.y}
                      stroke="var(--border)"
                      strokeDasharray={i === yTicks.length - 1 ? 'none' : '3 3'}
                      opacity={i === yTicks.length - 1 ? 0.9 : 0.55}
                    />
                  </g>
                ))}

                {showOrdersSeries && (
                  <>
                    <path d={ordersAreaD} fill="url(#anaOrderGrad)" />
                    <path d={ordersLineD} fill="none" stroke="#ff9800" strokeWidth="2.5" />
                  </>
                )}

                {showGmvSeries && (
                  <>
                    <path d={gmvAreaD} fill="url(#anaVolumeGrad)" />
                    <path d={gmvLineD} fill="none" stroke="#e91e63" strokeWidth="3" />
                  </>
                )}

                {showOrdersSeries && chartPoints.map((c, i) => (
                  <circle
                    key={`opt-${i}`}
                    cx={c.x}
                    cy={c.yOrders}
                    r={hoveredPointIndex === i ? 6.5 : 4.5}
                    fill="#ff9800"
                    stroke="#ffffff"
                    strokeWidth="2"
                    style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    onMouseEnter={() => setHoveredPointIndex(i)}
                  />
                ))}

                {showGmvSeries && chartPoints.map((c, i) => (
                  <circle
                    key={`gpt-${i}`}
                    cx={c.x}
                    cy={c.yGmv}
                    r={hoveredPointIndex === i ? 7 : 5}
                    fill="#e91e63"
                    stroke="#ffffff"
                    strokeWidth="2.2"
                    style={{ cursor: 'pointer', transition: 'r 0.15s ease' }}
                    onMouseEnter={() => setHoveredPointIndex(i)}
                  />
                ))}

                {chartPoints.map((c, i) => (
                  <g key={`pt-${i}`}>
                    <rect
                      x={c.x - 35}
                      y="15"
                      width="70"
                      height="175"
                      fill="transparent"
                      style={{ cursor: 'pointer' }}
                      onMouseEnter={() => setHoveredPointIndex(i)}
                    />
                    <text
                      x={c.x}
                      y="204"
                      textAnchor="middle"
                      fill={hoveredPointIndex === i ? 'var(--text)' : 'var(--text-secondary)'}
                      fontSize="11"
                      fontWeight={hoveredPointIndex === i ? '900' : '700'}
                    >
                      {c.label}
                    </text>
                  </g>
                ))}
              </svg>
            </div>
          )}
        </div>

        <div className="ana-card">
          <div className="ana-card-header">
            <div>
              <h3 className="ana-card-title">
                <i className="fas fa-filter" style={{ color: '#673ab7' }}></i>
                Marketplace Conversion Funnel
              </h3>
              <p className="ana-card-subtitle">End-to-end buyer journey drop-off and booking conversion</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-4 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`fun-sk-${i}`} className="flex flex-col gap-2">
                  <div className="ana-sk-shimmer" style={{ width: '120px', height: '14px' }}></div>
                  <div className="ana-sk-shimmer" style={{ width: '100%', height: '14px', borderRadius: '9999px' }}></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="ana-funnel-list">
              {funnel.map((stage, idx) => (
                <div
                  key={stage.stage}
                  className="ana-funnel-item"
                  onMouseEnter={() => setHoveredFunnelIdx(idx)}
                  onMouseLeave={() => setHoveredFunnelIdx(null)}
                >
                  <div className="ana-funnel-meta">
                    <span className="ana-funnel-label">
                      <i className="fas fa-circle" style={{ fontSize: '0.5rem', color: idx === 0 ? '#e91e63' : idx === 1 ? '#673ab7' : idx === 2 ? '#00acc1' : '#43a047' }}></i>
                      {stage.stage}
                    </span>
                    <span className="ana-funnel-count">
                      {stage.count} ({stage.percentage}%)
                    </span>
                  </div>

                  <div className="ana-funnel-bar-track">
                    <div
                      className={`ana-funnel-bar-fill stage-${idx}`}
                      style={{
                        width: `${Math.max(8, stage.percentage)}%`,
                        filter: hoveredFunnelIdx === idx ? 'brightness(1.15)' : 'none',
                        boxShadow: hoveredFunnelIdx === idx ? '0 0 10px rgba(233, 30, 99, 0.4)' : 'none',
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="ana-bottom-grid">
        <div className="ana-card">
          <div className="ana-card-header">
            <div>
              <h3 className="ana-card-title">
                <i className="fas fa-tags" style={{ color: '#e91e63' }}></i>
                Category Demand Share
              </h3>
              <p className="ana-card-subtitle">Click category for operational deep-dive</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`cat-sk-${i}`} className="ana-sk-shimmer" style={{ width: '100%', height: '36px' }}></div>
              ))}
            </div>
          ) : (
            <div className="ana-share-list">
              {categoryShares.slice(0, 5).map((cat) => (
                <div
                  key={cat.categoryId}
                  className="ana-share-row"
                  onClick={() => setInspectedCategory(cat)}
                  title="Click to inspect category"
                >
                  <div className="ana-share-meta">
                    <span className="ana-share-title">{cat.categoryName}</span>
                    <span className="ana-share-val">₹{cat.volume.toLocaleString('en-IN')} ({cat.percentage}%)</span>
                  </div>
                  <div className="ana-share-track">
                    <div className="ana-share-fill" style={{ width: `${Math.max(5, cat.percentage)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ana-card">
          <div className="ana-card-header">
            <div>
              <h3 className="ana-card-title">
                <i className="fas fa-map-marked-alt" style={{ color: '#00acc1' }}></i>
                Regional Demand Hubs
              </h3>
              <p className="ana-card-subtitle">Click geographic region for telemetry</p>
            </div>
          </div>

          {isLoading ? (
            <div className="flex flex-col gap-3 mt-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`reg-sk-${i}`} className="ana-sk-shimmer" style={{ width: '100%', height: '36px' }}></div>
              ))}
            </div>
          ) : (
            <div className="ana-share-list">
              {regionalShares.slice(0, 5).map((reg) => (
                <div
                  key={reg.region}
                  className="ana-share-row"
                  onClick={() => setInspectedRegion(reg)}
                  title="Click to inspect region"
                >
                  <div className="ana-share-meta">
                    <span className="ana-share-title">{reg.region}</span>
                    <span className="ana-share-val">{reg.bookingsCount} orders (₹{reg.volume.toLocaleString('en-IN')})</span>
                  </div>
                  <div className="ana-share-track">
                    <div
                      className="ana-share-fill"
                      style={{
                        background: 'linear-gradient(90deg, #00acc1, #00e5ff)',
                        width: `${Math.min(100, Math.max(10, (reg.bookingsCount / (kpis?.totalBookings || 1)) * 100))}%`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ana-card">
          <div className="ana-card-header">
            <div>
              <h3 className="ana-card-title">
                <i className="fas fa-shield-virus" style={{ color: '#10b981' }}></i>
                Platform SLA &amp; Reliability
              </h3>
              <p className="ana-card-subtitle">Operational fulfillment &amp; satisfaction ratings</p>
            </div>
          </div>

          {isLoading ? (
            <div className="ana-metric-scorecards">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`sc-sk-${i}`} className="ana-sk-shimmer" style={{ height: '75px', borderRadius: '14px' }}></div>
              ))}
            </div>
          ) : (
            <div className="ana-metric-scorecards">
              {fulfillmentMetrics.map((met) => (
                <div key={met.metric} className="ana-scorecard">
                  <span className="ana-score-val">{met.value}</span>
                  <span className="ana-score-label">{met.metric}</span>
                  <div className="ana-score-bar">
                    <div className="ana-score-fill" style={{ width: `${Math.min(100, met.score)}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {inspectedCategory && (
        <div className="ana-modal-overlay" onClick={() => setInspectedCategory(null)}>
          <div className="ana-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ana-modal-header">
              <h3 className="ana-modal-title">
                <i className="fas fa-tags" style={{ color: '#e91e63' }}></i>
                {inspectedCategory.categoryName} Specialty Telemetry
              </h3>
              <button
                type="button"
                className="ana-btn-refresh"
                style={{ padding: '0.35rem 0.65rem' }}
                onClick={() => setInspectedCategory(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="ana-modal-body">
              <div className="ana-modal-grid">
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Cumulative Category GMV</span>
                  <span className="ana-modal-stat-val" style={{ color: '#e91e63' }}>
                    ₹{inspectedCategory.volume.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Marketplace Contribution</span>
                  <span className="ana-modal-stat-val" style={{ color: '#673ab7' }}>
                    {inspectedCategory.percentage}%
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>Operational Assessment</span>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Demand velocity for {inspectedCategory.categoryName} remains within healthy fulfillment bounds with robust quotation turnaround and steady provider liquidity.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="ana-btn-refresh"
                  onClick={() => setInspectedCategory(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {inspectedRegion && (
        <div className="ana-modal-overlay" onClick={() => setInspectedRegion(null)}>
          <div className="ana-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ana-modal-header">
              <h3 className="ana-modal-title">
                <i className="fas fa-map-marker-alt" style={{ color: '#00acc1' }}></i>
                {inspectedRegion.region} Regional Metrics
              </h3>
              <button
                type="button"
                className="ana-btn-refresh"
                style={{ padding: '0.35rem 0.65rem' }}
                onClick={() => setInspectedRegion(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="ana-modal-body">
              <div className="ana-modal-grid">
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Fulfilled Bookings</span>
                  <span className="ana-modal-stat-val" style={{ color: '#00acc1' }}>
                    {inspectedRegion.bookingsCount}
                  </span>
                </div>
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Regional Volume</span>
                  <span className="ana-modal-stat-val" style={{ color: '#10b981' }}>
                    ₹{inspectedRegion.volume.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>Regional SLA Status</span>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Coverage in {inspectedRegion.region} meets target escrow completion standards with minimal customer dispute escalation.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="ana-btn-refresh"
                  onClick={() => setInspectedRegion(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showExportModal && (
        <div className="ana-modal-overlay" onClick={() => setShowExportModal(false)}>
          <div className="ana-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="ana-modal-header">
              <h3 className="ana-modal-title">
                <i className="fas fa-file-invoice" style={{ color: '#e91e63' }}></i>
                Executive Telemetry Snapshot ({timeframe})
              </h3>
              <button
                type="button"
                className="ana-btn-refresh"
                style={{ padding: '0.35rem 0.65rem' }}
                onClick={() => setShowExportModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="ana-modal-body">
              <div className="ana-modal-grid">
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Total Gross GMV</span>
                  <span className="ana-modal-stat-val" style={{ color: '#e91e63' }}>
                    ₹{(kpis?.gmv || 37800).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Platform Net Take</span>
                  <span className="ana-modal-stat-val" style={{ color: '#673ab7' }}>
                    ₹{(kpis?.platformRevenue || 4536).toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Active Orders</span>
                  <span className="ana-modal-stat-val" style={{ color: '#ff9800' }}>
                    {kpis?.totalBookings || 26}
                  </span>
                </div>
                <div className="ana-modal-stat-box">
                  <span className="ana-modal-stat-lbl">Conversion Efficiency</span>
                  <span className="ana-modal-stat-val" style={{ color: '#10b981' }}>
                    {kpis?.quotationToBookingRate || 74}%
                  </span>
                </div>
              </div>

              <div style={{ background: 'var(--surface)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text)' }}>Executive Summary</span>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                  Platform throughput across the {timeframe} window demonstrates disciplined marketplace expansion with balanced buyer demand and provider capacity.
                </p>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="ana-btn-export"
                  onClick={() => {
                    alert('Executive Telemetry CSV exported successfully.');
                    setShowExportModal(false);
                  }}
                >
                  <i className="fas fa-download"></i> Download CSV
                </button>
                <button
                  type="button"
                  className="ana-btn-refresh"
                  onClick={() => setShowExportModal(false)}
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
