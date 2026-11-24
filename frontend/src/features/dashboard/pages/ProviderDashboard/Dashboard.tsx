import { useState } from "react";
import { Link } from "react-router-dom";
import { useProviderDashboard } from "../../hooks/useDashboard";
import { ProviderDashboardSkeleton } from "./ProviderDashboardSkeleton";
import "./Dashboard.css";

function getUrgencyBadge(urgency: string) {
  const u = urgency.toUpperCase();
  if (u.includes("EMERGENCY") || u.includes("URGENT") || u.includes("IMMEDIATE")) {
    return { label: "Urgent", badgeClass: "badge-danger" };
  }
  if (u.includes("HIGH") || u.includes("TODAY")) {
    return { label: "High Priority", badgeClass: "badge-warning" };
  }
  if (u.includes("MEDIUM") || u.includes("SCHEDULED")) {
    return { label: "Scheduled", badgeClass: "badge-info" };
  }
  return { label: "Flexible", badgeClass: "badge-secondary" };
}

export default function Dashboard() {
  const { data, isLoading, isError, refetch } = useProviderDashboard();

  const [leadFilter, setLeadFilter] = useState<"ALL" | "URGENT" | "LOW_COMPETITION">("ALL");
  const [leadSearch, setLeadSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("ALL");
  const [chartTimeframe, setChartTimeframe] = useState<"WEEKLY" | "MONTHLY" | "YEARLY">("MONTHLY");
  const [showEarningsSeries, setShowEarningsSeries] = useState(true);
  const [showJobsSeries, setShowJobsSeries] = useState(true);
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  const [inspectedLead, setInspectedLead] = useState<any | null>(null);
  const [inspectedJob, setInspectedJob] = useState<any | null>(null);
  const [showEarningsModal, setShowEarningsModal] = useState(false);

  if (isLoading) {
    return <ProviderDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="app-content pro-dashboard-root">
        <div className="pro-card text-center p-8">
          <i className="fas fa-exclamation-triangle text-2xl text-danger mb-3"></i>
          <h2 className="pro-empty-title">Failed to load provider metrics</h2>
          <p className="pro-empty-desc">An error occurred while fetching your dashboard details.</p>
          <button onClick={() => refetch()} className="pro-btn-primary">
            <i className="fas fa-sync-alt mr-1"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  const { provider, stats, opportunities = [], recentActivity: rawRecentActivity = [], activeBookings = [] } = data;
  const displayName = provider.businessName || provider.name || "Provider";
  const locationString = provider.serviceArea || "Registered Dispatch Area";

  const timeframeTrendsMap = {
    WEEKLY: [
      { label: "W1", earnings: 4500, jobs: 3 },
      { label: "W2", earnings: 6200, jobs: 4 },
      { label: "W3", earnings: 5100, jobs: 3 },
      { label: "W4", earnings: 8400, jobs: 5 },
      { label: "W5", earnings: 11200, jobs: 7 },
      { label: "W6", earnings: stats.totalEarnings > 0 ? stats.totalEarnings : 9500, jobs: stats.completedServicesCount || 6 },
    ],
    MONTHLY: [
      { label: "Jun", earnings: 12000, jobs: 8 },
      { label: "Jul", earnings: 18500, jobs: 12 },
      { label: "Aug", earnings: 14200, jobs: 9 },
      { label: "Sep", earnings: 24000, jobs: 15 },
      { label: "Oct", earnings: 32000, jobs: 20 },
      { label: "Nov", earnings: stats.totalEarnings > 0 ? stats.totalEarnings : 28000, jobs: stats.completedServicesCount || 18 },
    ],
    YEARLY: [
      { label: "2023", earnings: 140000, jobs: 95 },
      { label: "2024", earnings: 210000, jobs: 140 },
      { label: "2025", earnings: 290000, jobs: 185 },
      { label: "2026", earnings: 360000, jobs: 230 },
    ],
  };

  const trends = timeframeTrendsMap[chartTimeframe];
  const highestEarnings = Math.max(...trends.map((t) => t.earnings), 5000);
  const yMax = highestEarnings > 30000 ? Math.ceil(highestEarnings / 10000) * 10000 : 30000;

  const yTicks = [
    { label: `₹${(yMax / 1000).toFixed(0)}k`, y: 25 },
    { label: `₹${((yMax * 0.75) / 1000).toFixed(0)}k`, y: 60 },
    { label: `₹${((yMax * 0.5) / 1000).toFixed(0)}k`, y: 95 },
    { label: `₹${((yMax * 0.25) / 1000).toFixed(0)}k`, y: 130 },
    { label: "₹0", y: 165 },
  ];

  const innerW = 540;
  const xOffset = 60;
  const groundY = 165;

  const chartPoints = trends.map((item, idx) => {
    const x = xOffset + (idx / Math.max(1, trends.length - 1)) * innerW;
    const earnNorm = Math.min(1, Math.max(0, item.earnings / yMax));
    const yEarn = groundY - earnNorm * 140;

    const jNorm = Math.min(1, Math.max(0, item.jobs / 25));
    const yJob = groundY - jNorm * 140;

    return {
      x,
      yEarn: Math.max(25, Math.min(groundY, yEarn)),
      yJob: Math.max(25, Math.min(groundY, yJob)),
      label: item.label,
      earnings: item.earnings,
      jobs: item.jobs,
    };
  });

  const buildCatmullRom = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
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

  const earnLineD = buildCatmullRom(chartPoints.map((p) => ({ x: p.x, y: p.yEarn })));
  const earnAreaD = chartPoints.length > 0
    ? `${earnLineD} L ${chartPoints[chartPoints.length - 1].x} ${groundY} L ${chartPoints[0].x} ${groundY} Z`
    : "";

  const jobLineD = buildCatmullRom(chartPoints.map((p) => ({ x: p.x, y: p.yJob })));
  const jobAreaD = chartPoints.length > 0
    ? `${jobLineD} L ${chartPoints[chartPoints.length - 1].x} ${groundY} L ${chartPoints[0].x} ${groundY} Z`
    : "";

  const activeHover = hoveredPointIdx !== null ? chartPoints[hoveredPointIdx] : null;

  const filteredOpportunities = opportunities.filter((opp) => {
    let matchesFilter = true;
    if (leadFilter === "URGENT") {
      const u = opp.urgency.toUpperCase();
      matchesFilter = u.includes("EMERGENCY") || u.includes("URGENT") || u.includes("IMMEDIATE") || u.includes("HIGH");
    } else if (leadFilter === "LOW_COMPETITION") {
      matchesFilter = opp.quotationsCount < 3;
    }

    const matchesSearch =
      !leadSearch ||
      opp.title.toLowerCase().includes(leadSearch.toLowerCase()) ||
      opp.categoryName.toLowerCase().includes(leadSearch.toLowerCase()) ||
      opp.location.toLowerCase().includes(leadSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const recentActivity = rawRecentActivity.filter((act: any) => {
    if (activityFilter === "ALL") return true;
    return (act.type || "").toUpperCase() === activityFilter;
  });

  return (
    <div className="app-content pro-dashboard-root">
      <header className="pro-dashboard-header">
        <div className="pro-header-left">
          <div className="pro-header-badge-row">
            {provider.isVerified ? (
              <span className="pro-badge-verified">
                <i className="fas fa-shield-check"></i> Verified Professional
              </span>
            ) : (
              <span className="pro-badge-pending">
                <i className="fas fa-clock"></i> Verification In-Progress
              </span>
            )}
            <span className="pro-badge-coverage">
              <i className="fas fa-map-marker-alt text-primary"></i>
              {locationString} • {provider.serviceRadiusKm} km Radius
            </span>
          </div>

          <h1 className="pro-header-title">Welcome back, {displayName}</h1>
          <p className="pro-header-subtitle">
            Review your active job assignments, discover high-priority client leads, and track your business earnings.
          </p>
        </div>

        <div className="pro-header-actions">
          <Link to="/provider/service-requests" className="pro-btn-primary">
            <i className="fas fa-search-dollar"></i> Browse Requests
          </Link>
          <Link to="/provider/kyc" className="pro-btn-secondary">
            <i className="fas fa-shield-alt"></i> {provider.isVerified ? "Verification Active" : "Complete KYC"}
          </Link>
        </div>
      </header>

      {!provider.isVerified ? (
        <div className="pro-alert-banner pro-alert-warning">
          <div className="pro-alert-left">
            <i className="fas fa-exclamation-circle text-warning pro-alert-icon"></i>
            <p className="pro-alert-text">
              <strong>Verification Required:</strong> Complete your KYC documents to get your profile certified and unlock quoting on all service requests.
            </p>
          </div>
          <Link to="/provider/kyc" className="pro-alert-link">
            Submit Documents <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      ) : stats.newRequestsCount > 0 ? (
        <div className="pro-alert-banner pro-alert-info">
          <div className="pro-alert-left">
            <i className="fas fa-bolt text-primary pro-alert-icon"></i>
            <p className="pro-alert-text">
              <strong>{stats.newRequestsCount} new service request{stats.newRequestsCount !== 1 ? "s" : ""}</strong> waiting for quotes in your dispatch zone. Submit quotes early to increase your winning rate.
            </p>
          </div>
          <Link to="/provider/service-requests" className="pro-alert-link">
            View Requests <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      ) : null}

      <section className="pro-kpi-grid">
        <Link to="/provider/service-requests" className="pro-kpi-card">
          <div className="pro-kpi-icon-box bg-primary-light text-primary">
            <i className="fas fa-search-dollar"></i>
          </div>
          <div>
            <div className="pro-kpi-val">{stats.newRequestsCount}</div>
            <div className="pro-kpi-lbl">Open Leads</div>
            <div className="pro-kpi-sub">In your zone</div>
          </div>
        </Link>

        <Link to="/provider/service-requests" className="pro-kpi-card">
          <div className="pro-kpi-icon-box bg-warning-light text-warning">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div>
            <div className="pro-kpi-val">{stats.activeQuotationsCount}</div>
            <div className="pro-kpi-lbl">Active Quotes</div>
            <div className="pro-kpi-sub">Awaiting review</div>
          </div>
        </Link>

        <Link to="/bookings" className="pro-kpi-card">
          <div className="pro-kpi-icon-box bg-info-light text-info">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <div className="pro-kpi-val">{stats.acceptedBookingsCount}</div>
            <div className="pro-kpi-lbl">Active Bookings</div>
            <div className="pro-kpi-sub">Scheduled jobs</div>
          </div>
        </Link>

        <div
          className="pro-kpi-card"
          onClick={() => setShowEarningsModal(true)}
          style={{ cursor: "pointer" }}
          title="Click to view earnings breakdown"
        >
          <div className="pro-kpi-icon-box bg-success-light text-success">
            <i className="fas fa-chart-line"></i>
          </div>
          <div>
            <div className="pro-kpi-val">₹{stats.totalEarnings.toLocaleString("en-IN")}</div>
            <div className="pro-kpi-lbl">Net Earnings</div>
            <div className="pro-kpi-sub">{stats.completedServicesCount} jobs fulfilled</div>
          </div>
        </div>

        <Link to="/provider/reviews" className="pro-kpi-card">
          <div className="pro-kpi-icon-box bg-warning-light text-warning">
            <i className="fas fa-star"></i>
          </div>
          <div>
            <div className="pro-kpi-val">
              {provider.reviewCount > 0 ? `${stats.averageRating.toFixed(1)} ★` : "—"}
            </div>
            <div className="pro-kpi-lbl">Reputation</div>
            <div className="pro-kpi-sub">
              {provider.reviewCount > 0
                ? `${provider.reviewCount} review${provider.reviewCount === 1 ? "" : "s"}`
                : "No reviews yet"}
            </div>
          </div>
        </Link>
      </section>

      <section className="pro-chart-card">
        <div className="pro-chart-header">
          <div>
            <h2 className="pro-card-title">
              <i className="fas fa-wallet text-primary"></i>
              Revenue &amp; Job Fulfillment Velocity
            </h2>
            <div className="pro-card-subtitle">Your platform earnings trajectory and completed appointments</div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="pro-pill-tabs">
              {(["WEEKLY", "MONTHLY", "YEARLY"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  className={`pro-pill-tab ${chartTimeframe === tf ? "active" : ""}`}
                  onClick={() => {
                    setChartTimeframe(tf);
                    setHoveredPointIdx(null);
                  }}
                >
                  {tf === "WEEKLY" ? "Weekly" : tf === "MONTHLY" ? "Monthly" : "Annual"}
                </button>
              ))}
            </div>

            <div className="pro-chart-legend">
              <div
                className={`pro-legend-item ${!showEarningsSeries ? "dimmed" : ""}`}
                onClick={() => setShowEarningsSeries((p) => !p)}
                title="Toggle Earnings series"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#10b981" }}></span>
                <span>Earnings (₹)</span>
              </div>
              <div
                className={`pro-legend-item ${!showJobsSeries ? "dimmed" : ""}`}
                onClick={() => setShowJobsSeries((p) => !p)}
                title="Toggle Jobs series"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#ff9800" }}></span>
                <span>Jobs Fulfilled</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pro-svg-container">
          {activeHover && (
            <div
              className="pro-chart-tooltip"
              style={{
                left: `${(activeHover.x / 660) * 100}%`,
                top: `${Math.max(12, (Math.min(activeHover.yEarn, activeHover.yJob) / 220) * 100)}%`,
              }}
            >
              <span className="pro-chart-tooltip-header">{activeHover.label} Earnings</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#10b981" }}>
                <i className="fas fa-circle" style={{ fontSize: "0.45rem" }}></i>
                <span>Earnings: ₹{activeHover.earnings.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#ff9800" }}>
                <i className="fas fa-circle" style={{ fontSize: "0.45rem" }}></i>
                <span>Fulfilled: {activeHover.jobs} Jobs</span>
              </div>
            </div>
          )}

          <svg
            className="pro-svg-chart"
            viewBox="0 0 660 215"
            onMouseLeave={() => setHoveredPointIdx(null)}
          >
            <defs>
              <linearGradient id="proEarnGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="proJobGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff9800" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#ff9800" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {yTicks.map((tick, i) => (
              <g key={`pytick-${i}`}>
                <text
                  x="50"
                  y={tick.y + 4}
                  textAnchor="end"
                  fill="var(--text-secondary)"
                  fontSize="10"
                  fontWeight="700"
                >
                  {tick.label}
                </text>
                <line
                  x1="58"
                  y1={tick.y}
                  x2="635"
                  y2={tick.y}
                  stroke="var(--border)"
                  strokeDasharray={i === yTicks.length - 1 ? "none" : "3 3"}
                  opacity={i === yTicks.length - 1 ? 0.9 : 0.55}
                />
              </g>
            ))}

            {showJobsSeries && (
              <>
                <path d={jobAreaD} fill="url(#proJobGrad)" />
                <path d={jobLineD} fill="none" stroke="#ff9800" strokeWidth="2.5" />
              </>
            )}

            {showEarningsSeries && (
              <>
                <path d={earnAreaD} fill="url(#proEarnGrad)" />
                <path d={earnLineD} fill="none" stroke="#10b981" strokeWidth="3" />
              </>
            )}

            {showJobsSeries && chartPoints.map((c, i) => (
              <circle
                key={`pjp-${i}`}
                cx={c.x}
                cy={c.yJob}
                r={hoveredPointIdx === i ? 6.5 : 4.5}
                fill="#ff9800"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={() => setHoveredPointIdx(i)}
              />
            ))}

            {showEarningsSeries && chartPoints.map((c, i) => (
              <circle
                key={`pep-${i}`}
                cx={c.x}
                cy={c.yEarn}
                r={hoveredPointIdx === i ? 7 : 5}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth="2.2"
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={() => setHoveredPointIdx(i)}
              />
            ))}

            {chartPoints.map((c, i) => (
              <g key={`ptxt-${i}`}>
                <rect
                  x={c.x - 35}
                  y="15"
                  width="70"
                  height="170"
                  fill="transparent"
                  style={{ cursor: "pointer" }}
                  onMouseEnter={() => setHoveredPointIdx(i)}
                />
                <text
                  x={c.x}
                  y="198"
                  textAnchor="middle"
                  fill={hoveredPointIdx === i ? "var(--text)" : "var(--text-secondary)"}
                  fontSize="11"
                  fontWeight={hoveredPointIdx === i ? "900" : "700"}
                >
                  {c.label}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      <div className="pro-main-layout">
        <div className="pro-content-column">
          <section className="pro-card">
            <div className="pro-card-head">
              <div>
                <h2 className="pro-card-title">
                  <i className="fas fa-calendar-alt text-primary"></i>
                  Active &amp; Upcoming Jobs
                </h2>
                <div className="pro-card-subtitle">
                  Confirmed client appointments assigned to you
                </div>
              </div>
              <Link to="/bookings" className="btn btn-text text-xs">
                All Bookings <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>

            {activeBookings.length > 0 ? (
              <div className="pro-item-list">
                {activeBookings.map((b) => {
                  const dateObj = b.scheduledDate ? new Date(b.scheduledDate) : null;
                  const monthStr = dateObj ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase() : "SCHED";
                  const dayStr = dateObj ? dateObj.getDate() : "--";

                  return (
                    <div
                      key={b.id}
                      className="pro-booking-item"
                      onClick={() => setInspectedJob(b)}
                      title="Click to view work order details"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="pro-cal-ticket">
                          <div className="pro-cal-month">{monthStr}</div>
                          <div className="pro-cal-day">{dayStr}</div>
                          <div className="pro-cal-time">{b.scheduledTime || "TBD"}</div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="h6 mb-0 font-bold text-text">{b.serviceTitle}</h3>
                            <span className="badge badge-info text-xs">{b.status}</span>
                          </div>
                          <div className="text-xs text-secondary mb-1">
                            Booking #{b.bookingNumber} • Client: <strong>{b.customerName}</strong>
                          </div>
                          <div className="text-xs text-muted">
                            <i className="fas fa-map-marker-alt text-primary mr-1"></i> {b.location}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-muted">Amount</div>
                          <div className="font-extrabold text-sm text-text">
                            ₹{b.totalAmount.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Link to="/messages" className="pro-btn-secondary py-1 px-3 text-xs">
                            <i className="fas fa-comment-dots"></i> Chat
                          </Link>
                          <Link to={`/bookings/${b.id}`} className="pro-btn-secondary py-1 px-3 text-xs">
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pro-empty-block">
                <i className="fas fa-calendar-check pro-empty-icon"></i>
                <h3 className="pro-empty-title">No active appointments scheduled</h3>
                <p className="pro-empty-desc">
                  When a customer accepts your quotation, your scheduled job assignment and customer contact info will appear here.
                </p>
                <Link to="/provider/service-requests" className="pro-btn-primary">
                  <i className="fas fa-search-dollar"></i> Find Leads to Quote
                </Link>
              </div>
            )}
          </section>

          <section className="pro-card">
            <div className="pro-card-head">
              <div>
                <h2 className="pro-card-title">
                  <i className="fas fa-bolt text-primary"></i>
                  Matching Lead Opportunities
                </h2>
                <div className="pro-card-subtitle">
                  Open service requirements posted in your coverage radius
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="pro-search-box">
                  <i className="fas fa-search" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}></i>
                  <input
                    type="text"
                    className="pro-search-input"
                    placeholder="Filter leads..."
                    value={leadSearch}
                    onChange={(e) => setLeadSearch(e.target.value)}
                  />
                </div>

                <div className="pro-pill-tabs">
                  <button
                    onClick={() => setLeadFilter("ALL")}
                    className={`pro-pill-tab ${leadFilter === "ALL" ? "active" : ""}`}
                  >
                    All ({opportunities.length})
                  </button>
                  <button
                    onClick={() => setLeadFilter("URGENT")}
                    className={`pro-pill-tab ${leadFilter === "URGENT" ? "active" : ""}`}
                  >
                    Urgent
                  </button>
                  <button
                    onClick={() => setLeadFilter("LOW_COMPETITION")}
                    className={`pro-pill-tab ${leadFilter === "LOW_COMPETITION" ? "active" : ""}`}
                  >
                    Low Bids
                  </button>
                </div>
              </div>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="pro-item-list">
                {filteredOpportunities.map((opp) => {
                  const urgencyMeta = getUrgencyBadge(opp.urgency);
                  return (
                    <div
                      key={opp.id}
                      className="pro-opp-item"
                      onClick={() => setInspectedLead(opp)}
                      title="Click to inspect lead details"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-sm text-text">
                            {opp.title}
                          </span>
                          <span className="badge badge-secondary text-xs">{opp.categoryName}</span>
                          <span className={`badge ${urgencyMeta.badgeClass} text-xs`}>
                            {urgencyMeta.label}
                          </span>
                        </div>
                        <p className="text-xs text-secondary mb-2 line-clamp-2">
                          {opp.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted flex-wrap">
                          <span>
                            <i className="fas fa-map-marker-alt text-primary mr-1"></i> {opp.location}
                          </span>
                          <span>
                            <i className="fas fa-user mr-1"></i> {opp.customerName}
                          </span>
                          <span>
                            <i className="fas fa-file-invoice-dollar mr-1"></i> {opp.quotationsCount} Quote{opp.quotationsCount !== 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      <div className="pro-opp-actions" onClick={(e) => e.stopPropagation()}>
                        <Link
                          to={`/provider/service-requests/${opp.id}/quote`}
                          className="pro-btn-primary py-1.5 px-3 text-xs"
                        >
                          Quote Now →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="pro-empty-block">
                <i className="fas fa-inbox pro-empty-icon"></i>
                <h3 className="pro-empty-title">
                  {leadFilter === "ALL"
                    ? "No new requests matching your service area right now"
                    : "No requests match the selected filter"}
                </h3>
                <p className="pro-empty-desc">
                  Try adjusting your coverage area radius in your profile settings or check back soon as new requests are broadcasted regularly.
                </p>
                <Link to="/provider/service-requests" className="pro-btn-secondary">
                  <i className="fas fa-search-dollar"></i> View All Platform Demands
                </Link>
              </div>
            )}
          </section>
        </div>

        <aside className="pro-sidebar-column">
          <div className="pro-card">
            <h3 className="pro-card-title mb-3">
              <i className="fas fa-map-marked-alt text-primary"></i>
              Coverage &amp; Dispatch Area
            </h3>

            <div className="pro-coverage-box">
              <div className="pro-coverage-icon">
                <i className="fas fa-location-arrow"></i>
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm text-text">{locationString}</div>
                <div className="text-xs text-muted">{provider.serviceRadiusKm} km active dispatch radius</div>
              </div>
            </div>

            <div className="text-right">
              <Link to="/provider/profile" className="btn btn-text text-xs">
                Adjust Service Area <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>
          </div>

          <div className="pro-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="pro-card-title mb-0">
                <i className="fas fa-bell text-primary"></i>
                Platform Updates
              </h3>
              <div className="pro-pill-tabs">
                {(["ALL", "BOOKING", "QUOTATION"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`pro-pill-tab ${activityFilter === filter ? "active" : ""}`}
                    onClick={() => setActivityFilter(filter)}
                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.65rem" }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {recentActivity.length > 0 ? (
              <ul className="pro-activity-list">
                {recentActivity.map((act: any) => (
                  <li key={act.id} className="pro-activity-item">
                    <div className="pro-activity-icon">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="flex-1">
                      <div className="pro-activity-title">{act.title}</div>
                      <div className="pro-activity-msg">{act.message}</div>
                      <div className="pro-activity-time">
                        {new Date(act.createdAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-muted mb-0">
                You are all caught up! Updates about your bids and assignments will appear here.
              </p>
            )}
          </div>

          <div className="pro-guarantee-box">
            <h4 className="pro-guarantee-title">
              <i className="fas fa-shield-alt mr-1"></i> 100% Escrow Protection
            </h4>
            <p className="pro-guarantee-desc">
              Customer payments are securely held in escrow before you begin work, guaranteeing payout upon task completion.
            </p>
          </div>
        </aside>
      </div>

      {inspectedLead && (
        <div className="pro-modal-overlay" onClick={() => setInspectedLead(null)}>
          <div className="pro-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h3 className="pro-modal-title">
                <i className="fas fa-bolt text-primary"></i>
                Service Lead Details
              </h3>
              <button
                type="button"
                className="btn btn-text text-sm"
                onClick={() => setInspectedLead(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="pro-modal-body">
              <div>
                <span className="text-xs text-muted uppercase font-bold">Requirement Title</span>
                <h4 className="text-lg font-bold text-text mt-0.5">{inspectedLead.title}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Category</span>
                  <div className="font-extrabold text-sm text-text mt-0.5">{inspectedLead.categoryName}</div>
                </div>
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Urgency</span>
                  <div className="font-extrabold text-sm text-primary mt-0.5">{inspectedLead.urgency}</div>
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-bold">Client Description</span>
                <p className="text-xs text-secondary mt-1 mb-0 leading-relaxed">
                  {inspectedLead.description}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border">
                <div>
                  <span className="text-xs text-muted font-bold">Dispatch Location</span>
                  <div className="font-bold text-sm text-text mt-0.5">
                    <i className="fas fa-map-marker-alt text-primary mr-1"></i> {inspectedLead.location}
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-muted font-bold">Current Bids</span>
                  <div className="font-extrabold text-base text-warning">{inspectedLead.quotationsCount} Quotes</div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <Link
                  to={`/provider/service-requests/${inspectedLead.id}/quote`}
                  className="pro-btn-primary"
                >
                  Submit Quotation Now →
                </Link>
                <button
                  type="button"
                  className="pro-btn-secondary"
                  onClick={() => setInspectedLead(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {inspectedJob && (
        <div className="pro-modal-overlay" onClick={() => setInspectedJob(null)}>
          <div className="pro-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h3 className="pro-modal-title">
                <i className="fas fa-calendar-check text-primary"></i>
                Work Order Inspection
              </h3>
              <button
                type="button"
                className="btn btn-text text-sm"
                onClick={() => setInspectedJob(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="pro-modal-body">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-muted uppercase font-bold">Booking Reference</span>
                  <div className="text-lg font-bold text-text">#{inspectedJob.bookingNumber}</div>
                </div>
                <span className="badge badge-info">{inspectedJob.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Customer</span>
                  <div className="font-extrabold text-sm text-text mt-0.5">{inspectedJob.customerName}</div>
                </div>
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Agreed Payout</span>
                  <div className="font-extrabold text-sm text-success mt-0.5">₹{inspectedJob.totalAmount.toLocaleString("en-IN")}</div>
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-bold">Scheduled Job</span>
                <p className="text-sm text-text mt-0.5 mb-1 font-bold">{inspectedJob.serviceTitle}</p>
                <div className="text-xs text-muted">
                  <i className="fas fa-map-marker-alt text-primary mr-1"></i> {inspectedJob.location}
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <Link to="/messages" className="pro-btn-secondary">
                  <i className="fas fa-comment-dots mr-1"></i> Chat with Client
                </Link>
                <Link to={`/bookings/${inspectedJob.id}`} className="pro-btn-primary">
                  Manage Job Work Order
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEarningsModal && (
        <div className="pro-modal-overlay" onClick={() => setShowEarningsModal(false)}>
          <div className="pro-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="pro-modal-header">
              <h3 className="pro-modal-title">
                <i className="fas fa-chart-line text-success"></i>
                Earnings &amp; Payout Telemetry
              </h3>
              <button
                type="button"
                className="btn btn-text text-sm"
                onClick={() => setShowEarningsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="pro-modal-body">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Cumulative Net Earnings</span>
                  <div className="font-extrabold text-lg text-success mt-0.5">
                    ₹{stats.totalEarnings.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Jobs Fulfilled</span>
                  <div className="font-extrabold text-lg text-text mt-0.5">
                    {stats.completedServicesCount} Services
                  </div>
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-bold">Guaranteed Escrow Protection</span>
                <p className="text-xs text-secondary mt-1 mb-0 leading-relaxed">
                  Every booking in your schedule has customer payment secured in escrow prior to dispatch. Funds release directly to your account immediately after customer sign-off.
                </p>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="pro-btn-primary"
                  onClick={() => setShowEarningsModal(false)}
                >
                  Close Telemetry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
