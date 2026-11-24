import { useState, useMemo } from 'react';
import { useAdminAnalytics } from '../../../dashboard/hooks/useDashboard';
import './AdminAnalytics.css';

const TIMEFRAMES = [
  { id: '7D', label: '7 Days' },
  { id: '30D', label: '30 Days' },
  { id: '90D', label: '90 Days' },
  { id: '1Y', label: '1 Year' },
  { id: 'ALL', label: 'All Time' },
] as const;

export default function AdminAnalytics() {
  const [timeframe, setTimeframe] = useState<string>('30D');
  const { data, isLoading, isError, refetch } = useAdminAnalytics(timeframe);

  const kpis = data?.kpis;
  const volumeTrends = data?.volumeTrends || [];
  const funnel = data?.funnel || [];
  const categoryShares = data?.categoryShares || [];
  const regionalShares = data?.regionalShares || [];
  const fulfillmentMetrics = data?.fulfillmentMetrics || [];

  const maxVolume = useMemo(() => {
    if (volumeTrends.length === 0) return 1000;
    const maxVal = Math.max(...volumeTrends.map((t) => t.volume));
    return maxVal > 0 ? maxVal * 1.2 : 1000;
  }, [volumeTrends]);

  const chartCoords = useMemo(() => {
    if (volumeTrends.length === 0) return [];
    const width = 640;
    const height = 220;
    const padding = 35;
    const innerW = width - padding * 2;
    const innerH = height - padding * 2;

    return volumeTrends.map((point, idx) => {
      const x = padding + (idx / Math.max(1, volumeTrends.length - 1)) * innerW;
      const normalizedY = point.volume / maxVolume;
      const y = height - padding - normalizedY * innerH;
      return { x, y, point };
    });
  }, [volumeTrends, maxVolume]);

  const svgPaths = useMemo(() => {
    if (chartCoords.length === 0) return { line: '', area: '' };
    const first = chartCoords[0];
    const last = chartCoords[chartCoords.length - 1];

    let linePath = `M ${first.x} ${first.y}`;
    for (let i = 1; i < chartCoords.length; i++) {
      const prev = chartCoords[i - 1];
      const cur = chartCoords[i];
      const cx = (prev.x + cur.x) / 2;
      linePath += ` C ${cx} ${prev.y}, ${cx} ${cur.y}, ${cur.x} ${cur.y}`;
    }

    const groundY = 220 - 35;
    const areaPath = `${linePath} L ${last.x} ${groundY} L ${first.x} ${groundY} Z`;

    return { line: linePath, area: areaPath };
  }, [chartCoords]);

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
                onClick={() => setTimeframe(tf.id)}
              >
                {tf.label}
              </button>
            ))}
          </div>

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
            <div className="ana-kpi-card">
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap pink">
                  <i className="fas fa-wallet"></i>
                </div>
                <span className="ana-kpi-badge">GMV Volume</span>
              </div>
              <h2 className="ana-kpi-value">₹{(kpis?.gmv || 0).toLocaleString('en-IN')}</h2>
              <p className="ana-kpi-label">Gross Marketplace Volume</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-chart-line"></i> Total Transacted Value
              </div>
            </div>

            <div className="ana-kpi-card">
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap purple">
                  <i className="fas fa-coins"></i>
                </div>
                <span className="ana-kpi-badge">Net Revenue</span>
              </div>
              <h2 className="ana-kpi-value">₹{(kpis?.platformRevenue || 0).toLocaleString('en-IN')}</h2>
              <p className="ana-kpi-label">Platform Take &amp; Escrow Fees</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-shield-alt"></i> Guaranteed Escrow Payout
              </div>
            </div>

            <div className="ana-kpi-card">
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap cyan">
                  <i className="fas fa-clipboard-check"></i>
                </div>
                <span className="ana-kpi-badge">Bookings</span>
              </div>
              <h2 className="ana-kpi-value">{kpis?.totalBookings || 0}</h2>
              <p className="ana-kpi-label">Confirmed Service Orders</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-check-circle"></i> {kpis?.completedBookings || 0} Jobs Completed
              </div>
            </div>

            <div className="ana-kpi-card">
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap amber">
                  <i className="fas fa-receipt"></i>
                </div>
                <span className="ana-kpi-badge">AOV</span>
              </div>
              <h2 className="ana-kpi-value">₹{(kpis?.averageOrderValue || 0).toLocaleString('en-IN')}</h2>
              <p className="ana-kpi-label">Average Order Value</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-tags"></i> Per Transaction
              </div>
            </div>

            <div className="ana-kpi-card">
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap emerald">
                  <i className="fas fa-percentage"></i>
                </div>
                <span className="ana-kpi-badge">Conversion</span>
              </div>
              <h2 className="ana-kpi-value">{kpis?.quotationToBookingRate || 0}%</h2>
              <p className="ana-kpi-label">Quote-to-Booking Ratio</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-funnel-dollar"></i> High Intent Flow
              </div>
            </div>

            <div className="ana-kpi-card">
              <div className="ana-kpi-top">
                <div className="ana-kpi-icon-wrap indigo">
                  <i className="fas fa-users-cog"></i>
                </div>
                <span className="ana-kpi-badge">Network</span>
              </div>
              <h2 className="ana-kpi-value">{kpis?.activeProviders || 0}</h2>
              <p className="ana-kpi-label">Verified Providers in Pool</p>
              <div className="ana-kpi-sub">
                <i className="fas fa-user-plus"></i> Customer Growth: +{kpis?.customerGrowthRate || 0}%
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
              <div className="ana-legend-item">
                <span className="ana-legend-dot" style={{ background: '#e91e63' }}></span>
                <span>GMV (₹)</span>
              </div>
              <div className="ana-legend-item">
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
              <svg viewBox="0 0 640 220" className="ana-svg-chart" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="anaVolumeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e91e63" stopOpacity="0.45" />
                    <stop offset="100%" stopColor="#e91e63" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="35" y1="35" x2="605" y2="35" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="35" y1="105" x2="605" y2="105" stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <line x1="35" y1="185" x2="605" y2="185" stroke="rgba(255,255,255,0.12)" />

                {svgPaths.area && <path d={svgPaths.area} fill="url(#anaVolumeGrad)" />}
                {svgPaths.line && (
                  <path
                    d={svgPaths.line}
                    fill="none"
                    stroke="#e91e63"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                )}

                {chartCoords.map((c, i) => (
                  <g key={`pt-${i}`}>
                    <circle cx={c.x} cy={c.y} r="5" fill="#ffffff" stroke="#e91e63" strokeWidth="3" />
                    <text
                      x={c.x}
                      y="208"
                      textAnchor="middle"
                      fill="var(--text-secondary)"
                      fontSize="10"
                      fontWeight="700"
                    >
                      {c.point.label}
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
                <div key={stage.stage} className="ana-funnel-item">
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
                      style={{ width: `${Math.max(8, stage.percentage)}%` }}
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
              <p className="ana-card-subtitle">Volume contribution by service specialty</p>
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
                <div key={cat.categoryId} className="ana-share-row">
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
              <p className="ana-card-subtitle">Geographic activity across active zones</p>
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
                <div key={reg.region} className="ana-share-row">
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
    </div>
  );
}
