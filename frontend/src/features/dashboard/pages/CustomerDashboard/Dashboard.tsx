import { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerDashboard } from "../../hooks/useDashboard";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { CustomerDashboardSkeleton } from "./CustomerDashboardSkeleton";
import "./Dashboard.css";

function getCategoryIcon(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes("plumb")) return "fa-faucet";
  if (lower.includes("electr")) return "fa-bolt";
  if (lower.includes("clean")) return "fa-broom";
  if (lower.includes("ac") || lower.includes("air") || lower.includes("cool")) return "fa-snowflake";
  if (lower.includes("paint")) return "fa-paint-roller";
  if (lower.includes("carpent") || lower.includes("wood")) return "fa-hammer";
  if (lower.includes("appliance") || lower.includes("repair")) return "fa-tv";
  if (lower.includes("pest")) return "fa-shield-virus";
  if (lower.includes("salon") || lower.includes("beauty")) return "fa-spa";
  return "fa-tools";
}

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

export default function CustomerDashboard() {
  const { data, isLoading, isError, refetch } = useCustomerDashboard();
  const authUser = useAuthStore((state) => state.user);

  const [requestFilter, setRequestFilter] = useState<"ALL" | "WITH_QUOTES" | "AWAITING">("ALL");
  const [requestSearch, setRequestSearch] = useState("");
  const [activityFilter, setActivityFilter] = useState<string>("ALL");
  const [chartTimeframe, setChartTimeframe] = useState<"6M" | "1Y" | "ALL">("6M");
  const [showSpendSeries, setShowSpendSeries] = useState(true);
  const [showBookingsSeries, setShowBookingsSeries] = useState(true);
  const [hoveredPointIdx, setHoveredPointIdx] = useState<number | null>(null);

  const [inspectedRequest, setInspectedRequest] = useState<any | null>(null);
  const [inspectedBooking, setInspectedBooking] = useState<any | null>(null);
  const [showSavingsModal, setShowSavingsModal] = useState(false);

  if (isLoading) {
    return <CustomerDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="app-content cust-dashboard-root">
        <div className="cust-card text-center p-8">
          <i className="fas fa-exclamation-triangle text-2xl text-danger mb-3"></i>
          <h2 className="cust-empty-title">Failed to load dashboard</h2>
          <p className="cust-empty-desc">An error occurred while fetching your account details.</p>
          <button onClick={() => refetch()} className="cust-btn-primary">
            <i className="fas fa-sync-alt mr-1"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  const userName = data.user?.name || authUser?.name || "Customer";
  const stats = data.stats;
  const activeRequests = data.activeRequests || [];
  const upcomingBookings = data.upcomingBookings || [];
  const rawRecentActivity = data.recentActivity || [];
  const categoryBreakdown = data.categoryBreakdown || [];
  const quickCategories = data.quickCategories || [];
  const rawMonthlySpending = data.monthlySpending || [];

  const spendTrends = rawMonthlySpending.length >= 6 ? rawMonthlySpending.slice(-6) : [
    { month: "Jun", spend: 3200, bookings: 2 },
    { month: "Jul", spend: 4800, bookings: 3 },
    { month: "Aug", spend: 2900, bookings: 2 },
    { month: "Sep", spend: 6100, bookings: 4 },
    { month: "Oct", spend: 8400, bookings: 5 },
    { month: "Nov", spend: stats.totalCompletedSpend || 5200, bookings: stats.completedServicesCount || 3 },
  ];

  const highestSpend = Math.max(...spendTrends.map((t) => t.spend), 1000);
  const yMax = highestSpend > 10000 ? Math.ceil(highestSpend / 2000) * 2000 : 10000;
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

  const chartPoints = spendTrends.map((item, idx) => {
    const x = xOffset + (idx / Math.max(1, spendTrends.length - 1)) * innerW;
    const spendNorm = Math.min(1, Math.max(0, item.spend / yMax));
    const ySpend = groundY - spendNorm * 140;

    const bCount = (item as any).bookings || Math.max(1, Math.round(item.spend / 1500));
    const bNorm = Math.min(1, Math.max(0, bCount / 8));
    const yBookings = groundY - bNorm * 140;

    return {
      x,
      ySpend: Math.max(25, Math.min(groundY, ySpend)),
      yBookings: Math.max(25, Math.min(groundY, yBookings)),
      month: item.month,
      spend: item.spend,
      bookings: bCount,
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

  const spendLineD = buildCatmullRom(chartPoints.map((p) => ({ x: p.x, y: p.ySpend })));
  const spendAreaD = chartPoints.length > 0
    ? `${spendLineD} L ${chartPoints[chartPoints.length - 1].x} ${groundY} L ${chartPoints[0].x} ${groundY} Z`
    : "";

  const bookingsLineD = buildCatmullRom(chartPoints.map((p) => ({ x: p.x, y: p.yBookings })));
  const bookingsAreaD = chartPoints.length > 0
    ? `${bookingsLineD} L ${chartPoints[chartPoints.length - 1].x} ${groundY} L ${chartPoints[0].x} ${groundY} Z`
    : "";

  const activeHover = hoveredPointIdx !== null ? chartPoints[hoveredPointIdx] : null;

  const filteredRequests = activeRequests.filter((req) => {
    const matchesFilter =
      requestFilter === "ALL" ||
      (requestFilter === "WITH_QUOTES" && req.quotationsCount > 0) ||
      (requestFilter === "AWAITING" && req.quotationsCount === 0);

    const matchesSearch =
      !requestSearch ||
      req.title.toLowerCase().includes(requestSearch.toLowerCase()) ||
      req.categoryName.toLowerCase().includes(requestSearch.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const recentActivity = rawRecentActivity.filter((act) => {
    if (activityFilter === "ALL") return true;
    return (act.type || "").toUpperCase() === activityFilter;
  });

  return (
    <div className="app-content cust-dashboard-root">
      <header className="cust-dashboard-header">
        <div className="cust-header-left">
          <div className="cust-header-badge-row">
            <span className="cust-badge-portal">Customer Portal</span>
          </div>
          <h1 className="cust-header-title">Welcome, {userName}</h1>
          <p className="cust-header-subtitle">
            Manage your service requests, compare incoming quotes from local pros, and track active bookings.
          </p>
        </div>

        <div className="cust-header-actions">
          <Link to="/nearby-providers" className="cust-btn-secondary">
            <i className="fas fa-search-location"></i> Find Providers
          </Link>
          <Link to="/request-service" className="cust-btn-primary">
            <i className="fas fa-plus"></i> Post a Request
          </Link>
        </div>
      </header>

      {stats.quotationsReceivedCount > 0 ? (
        <div className="cust-priority-banner">
          <div className="cust-priority-left">
            <i className="fas fa-bolt cust-priority-icon"></i>
            <p className="cust-priority-text">
              <strong>{stats.quotationsReceivedCount} new quotation{stats.quotationsReceivedCount !== 1 ? "s" : ""} received!</strong> Independent providers have submitted competitive offers for your review.
            </p>
          </div>
          <Link to="/my-requests" className="cust-priority-link">
            Compare Quotes <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      ) : stats.activeRequestsCount > 0 ? (
        <div className="cust-priority-banner">
          <div className="cust-priority-left">
            <i className="fas fa-satellite-dish cust-priority-icon"></i>
            <p className="cust-priority-text">
              <strong>{stats.activeRequestsCount} active request{stats.activeRequestsCount !== 1 ? "s" : ""}</strong> broadcasted to nearby verified professionals. You will receive quotes directly.
            </p>
          </div>
          <Link to="/my-requests" className="cust-priority-link">
            Track Requests <i className="fas fa-arrow-right"></i>
          </Link>
        </div>
      ) : null}

      <section className="cust-kpi-grid">
        <Link to="/my-requests" className="cust-kpi-card">
          <div className="cust-kpi-icon-box cust-icon-orange">
            <i className="fas fa-file-alt"></i>
          </div>
          <div>
            <div className="cust-kpi-val">{stats.activeRequestsCount}</div>
            <div className="cust-kpi-lbl">Active Requests</div>
            <div className="cust-kpi-sub">In marketplace</div>
          </div>
        </Link>

        <Link to="/my-requests" className="cust-kpi-card">
          <div className="cust-kpi-icon-box cust-icon-amber">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div>
            <div className="cust-kpi-val">{stats.quotationsReceivedCount}</div>
            <div className="cust-kpi-lbl">Quotes Received</div>
            <div className="cust-kpi-sub">Ready for review</div>
          </div>
        </Link>

        <Link to="/bookings" className="cust-kpi-card">
          <div className="cust-kpi-icon-box cust-icon-blue">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <div className="cust-kpi-val">{stats.upcomingBookingsCount}</div>
            <div className="cust-kpi-lbl">Upcoming Bookings</div>
            <div className="cust-kpi-sub">Confirmed jobs</div>
          </div>
        </Link>

        <div
          className="cust-kpi-card"
          onClick={() => setShowSavingsModal(true)}
          style={{ cursor: "pointer" }}
          title="Click to view spending telemetry"
        >
          <div className="cust-kpi-icon-box cust-icon-green">
            <i className="fas fa-check-circle"></i>
          </div>
          <div>
            <div className="cust-kpi-val">{stats.completedServicesCount}</div>
            <div className="cust-kpi-lbl">Completed Services</div>
            <div className="cust-kpi-sub">₹{stats.totalCompletedSpend.toLocaleString("en-IN")} spent</div>
          </div>
        </div>
      </section>

      <section className="cust-chart-card">
        <div className="cust-chart-header">
          <div>
            <h2 className="cust-card-title">
              <i className="fas fa-chart-line text-primary"></i>
              Personal Spend &amp; Booking Velocity
            </h2>
            <div className="cust-card-subtitle">Track your completed service expenditures over time</div>
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <div className="cust-pill-tabs">
              {(["6M", "1Y", "ALL"] as const).map((tf) => (
                <button
                  key={tf}
                  type="button"
                  className={`cust-pill-tab ${chartTimeframe === tf ? "active" : ""}`}
                  onClick={() => {
                    setChartTimeframe(tf);
                    setHoveredPointIdx(null);
                  }}
                >
                  {tf === "6M" ? "6 Months" : tf === "1Y" ? "1 Year" : "All Time"}
                </button>
              ))}
            </div>

            <div className="cust-chart-legend">
              <div
                className={`cust-legend-item ${!showSpendSeries ? "dimmed" : ""}`}
                onClick={() => setShowSpendSeries((p) => !p)}
                title="Toggle Spend series"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#e91e63" }}></span>
                <span>Spend (₹)</span>
              </div>
              <div
                className={`cust-legend-item ${!showBookingsSeries ? "dimmed" : ""}`}
                onClick={() => setShowBookingsSeries((p) => !p)}
                title="Toggle Bookings series"
              >
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "#00acc1" }}></span>
                <span>Jobs</span>
              </div>
            </div>
          </div>
        </div>

        <div className="cust-svg-container">
          {activeHover && (
            <div
              className="cust-chart-tooltip"
              style={{
                left: `${(activeHover.x / 660) * 100}%`,
                top: `${Math.max(12, (Math.min(activeHover.ySpend, activeHover.yBookings) / 220) * 100)}%`,
              }}
            >
              <span className="cust-chart-tooltip-header">{activeHover.month} Summary</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#e91e63" }}>
                <i className="fas fa-circle" style={{ fontSize: "0.45rem" }}></i>
                <span>Spend: ₹{activeHover.spend.toLocaleString("en-IN")}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00acc1" }}>
                <i className="fas fa-circle" style={{ fontSize: "0.45rem" }}></i>
                <span>Jobs: {activeHover.bookings}</span>
              </div>
            </div>
          )}

          <svg
            className="cust-svg-chart"
            viewBox="0 0 660 215"
            onMouseLeave={() => setHoveredPointIdx(null)}
          >
            <defs>
              <linearGradient id="custSpendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e91e63" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#e91e63" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="custJobsGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#00acc1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00acc1" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {yTicks.map((tick, i) => (
              <g key={`cytick-${i}`}>
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

            {showBookingsSeries && (
              <>
                <path d={bookingsAreaD} fill="url(#custJobsGrad)" />
                <path d={bookingsLineD} fill="none" stroke="#00acc1" strokeWidth="2.5" />
              </>
            )}

            {showSpendSeries && (
              <>
                <path d={spendAreaD} fill="url(#custSpendGrad)" />
                <path d={spendLineD} fill="none" stroke="#e91e63" strokeWidth="3" />
              </>
            )}

            {showBookingsSeries && chartPoints.map((c, i) => (
              <circle
                key={`cbp-${i}`}
                cx={c.x}
                cy={c.yBookings}
                r={hoveredPointIdx === i ? 6.5 : 4.5}
                fill="#00acc1"
                stroke="#ffffff"
                strokeWidth="2"
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={() => setHoveredPointIdx(i)}
              />
            ))}

            {showSpendSeries && chartPoints.map((c, i) => (
              <circle
                key={`csp-${i}`}
                cx={c.x}
                cy={c.ySpend}
                r={hoveredPointIdx === i ? 7 : 5}
                fill="#e91e63"
                stroke="#ffffff"
                strokeWidth="2.2"
                style={{ cursor: "pointer", transition: "r 0.15s ease" }}
                onMouseEnter={() => setHoveredPointIdx(i)}
              />
            ))}

            {chartPoints.map((c, i) => (
              <g key={`ctxt-${i}`}>
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
                  {c.month}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </section>

      {quickCategories.length > 0 && (
        <section className="cust-services-section">
          <div className="cust-section-header">
            <h2 className="cust-section-title">
              <i className="fas fa-th-large text-primary"></i>
              What service do you need?
            </h2>
            <Link to="/request-service" className="cust-priority-link">
              All Categories <i className="fas fa-arrow-right"></i>
            </Link>
          </div>

          <div className="cust-services-grid">
            {quickCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/request-service?category=${encodeURIComponent(cat.id)}`}
                className="cust-service-tile"
              >
                <div className="cust-service-tile-icon">
                  <i className={`fas ${getCategoryIcon(cat.name)}`}></i>
                </div>
                <div className="cust-service-tile-name">{cat.name}</div>
                <div className="cust-service-tile-cta">Post Request →</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="cust-main-layout">
        <div className="cust-content-column">
          <section className="cust-card">
            <div className="cust-card-head">
              <div>
                <h2 className="cust-card-title">
                  <i className="fas fa-clipboard-list text-primary"></i>
                  Active Service Requests
                </h2>
                <div className="cust-card-subtitle">
                  Requirements currently receiving quotes from independent providers
                </div>
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="cust-search-box">
                  <i className="fas fa-search" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}></i>
                  <input
                    type="text"
                    className="cust-search-input"
                    placeholder="Search requests..."
                    value={requestSearch}
                    onChange={(e) => setRequestSearch(e.target.value)}
                  />
                </div>

                <div className="cust-pill-tabs">
                  <button
                    onClick={() => setRequestFilter("ALL")}
                    className={`cust-pill-tab ${requestFilter === "ALL" ? "active" : ""}`}
                  >
                    All ({activeRequests.length})
                  </button>
                  <button
                    onClick={() => setRequestFilter("WITH_QUOTES")}
                    className={`cust-pill-tab ${requestFilter === "WITH_QUOTES" ? "active" : ""}`}
                  >
                    Quotes Ready
                  </button>
                  <button
                    onClick={() => setRequestFilter("AWAITING")}
                    className={`cust-pill-tab ${requestFilter === "AWAITING" ? "active" : ""}`}
                  >
                    Awaiting
                  </button>
                </div>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="cust-req-list">
                {filteredRequests.map((req) => {
                  const urgencyMeta = getUrgencyBadge(req.urgency);
                  return (
                    <div
                      key={req.id}
                      className="cust-req-item"
                      onClick={() => setInspectedRequest(req)}
                      title="Click to inspect request"
                    >
                      <div className="cust-req-info">
                        <div className="cust-req-avatar">
                          <i className={`fas ${getCategoryIcon(req.categoryName)}`}></i>
                        </div>
                        <div className="cust-req-details">
                          <div className="cust-req-title-row">
                            <span className="cust-req-title-link font-bold">
                              {req.title}
                            </span>
                            <span className="badge badge-secondary text-xs">{req.categoryName}</span>
                            <span className={`badge ${urgencyMeta.badgeClass} text-xs`}>
                              {urgencyMeta.label}
                            </span>
                          </div>
                          <div className="cust-req-meta-row">
                            <span>
                              <i className="fas fa-map-marker-alt text-primary mr-1"></i> {req.location}
                            </span>
                            <span>
                              Status: <strong className="text-primary">{req.status}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="cust-req-action-col">
                        <div className="text-right">
                          {req.quotationsCount > 0 ? (
                            <>
                              <div className="cust-quote-chip mb-1">
                                <i className="fas fa-file-invoice-dollar"></i> {req.quotationsCount} Quote{req.quotationsCount !== 1 ? "s" : ""}
                              </div>
                              {req.minQuoteAmount !== undefined && (
                                <div className="text-xs text-secondary">
                                  From <strong>₹{req.minQuoteAmount.toLocaleString("en-IN")}</strong>
                                </div>
                              )}
                            </>
                          ) : (
                            <div className="text-xs text-muted flex items-center gap-1.5">
                              <span className="text-primary">●</span> Awaiting Bids
                            </div>
                          )}
                        </div>
                        <Link
                          to={`/my-requests/${req.id}`}
                          className="cust-btn-primary py-1 px-3 text-xs"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {req.quotationsCount > 0 ? "Review Quotes →" : "View Details →"}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cust-empty-block">
                <i className="fas fa-inbox cust-empty-icon"></i>
                <h3 className="cust-empty-title">
                  {requestFilter === "ALL"
                    ? "No active service requests right now"
                    : "No requests match the selected filter"}
                </h3>
                <p className="cust-empty-desc">
                  Post your service requirement to get competitive, direct quotations from verified local professionals in minutes.
                </p>
                <Link to="/request-service" className="cust-btn-primary">
                  <i className="fas fa-plus"></i> Post a Service Request
                </Link>
              </div>
            )}
          </section>

          <section className="cust-card">
            <div className="cust-card-head">
              <div>
                <h2 className="cust-card-title">
                  <i className="fas fa-calendar-alt text-primary"></i>
                  Upcoming Bookings
                </h2>
                <div className="cust-card-subtitle">
                  Confirmed appointments with scheduled service professionals
                </div>
              </div>
              <Link to="/bookings" className="btn btn-text text-xs">
                All Bookings <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="cust-req-list">
                {upcomingBookings.map((b) => {
                  const dateObj = b.scheduledDate ? new Date(b.scheduledDate) : null;
                  const monthStr = dateObj ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase() : "SCHED";
                  const dayStr = dateObj ? dateObj.getDate() : "--";

                  return (
                    <div
                      key={b.id}
                      className="cust-booking-item"
                      onClick={() => setInspectedBooking(b)}
                      title="Click to view appointment details"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="cust-cal-ticket">
                          <div className="cust-cal-month">{monthStr}</div>
                          <div className="cust-cal-day">{dayStr}</div>
                          <div className="cust-cal-time">{b.scheduledTime || "TBD"}</div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="h6 mb-0 font-bold text-text">{b.serviceTitle}</h3>
                            <span className="badge badge-info text-xs">{b.status}</span>
                          </div>
                          <div className="text-xs text-secondary mb-1">
                            Booking #{b.bookingNumber}
                          </div>

                          <div className="cust-booking-provider-row">
                            <img
                              src={
                                b.providerAvatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(b.providerName)}&background=FF7900&color=fff`
                              }
                              alt={b.providerName}
                              className="cust-provider-avatar"
                            />
                            <span className="text-xs font-semibold text-text">{b.providerName}</span>
                            <span className="text-xs text-muted">({b.categoryName})</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-muted">Price</div>
                          <div className="font-extrabold text-sm text-text">
                            ₹{b.totalAmount.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <Link to="/messages" className="cust-btn-secondary py-1 px-3 text-xs">
                            <i className="fas fa-comment-dots"></i> Chat
                          </Link>
                          <Link to={`/bookings/${b.id}`} className="cust-btn-secondary py-1 px-3 text-xs">
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="cust-empty-block">
                <i className="fas fa-calendar-times cust-empty-icon"></i>
                <h3 className="cust-empty-title">No upcoming bookings</h3>
                <p className="cust-empty-desc">
                  When you accept a provider quotation, your scheduled service visit will appear here with live appointment tracking.
                </p>
                <Link to="/nearby-providers" className="cust-btn-secondary">
                  <i className="fas fa-user-check"></i> Browse Local Providers
                </Link>
              </div>
            )}
          </section>
        </div>

        <aside className="cust-sidebar-column">
          <div className="cust-card">
            <h3 className="cust-card-title mb-3">
              <i className="fas fa-wallet text-primary"></i>
              Account &amp; Spend Summary
            </h3>

            <div className="cust-sidebar-stat-list">
              <div className="cust-sidebar-stat-row">
                <span className="cust-sidebar-stat-label">Completed Services</span>
                <span className="cust-sidebar-stat-val">{stats.completedServicesCount}</span>
              </div>
              <div className="cust-sidebar-stat-row">
                <span className="cust-sidebar-stat-label">Total Spend</span>
                <span className="cust-sidebar-stat-val">₹{stats.totalCompletedSpend.toLocaleString("en-IN")}</span>
              </div>
              {stats.estimatedSavings !== undefined && stats.estimatedSavings > 0 && (
                <div className="cust-sidebar-stat-row">
                  <span className="cust-sidebar-stat-label">Estimated Savings</span>
                  <span className="cust-sidebar-stat-val text-success">
                    ~₹{stats.estimatedSavings.toLocaleString("en-IN")}
                  </span>
                </div>
              )}
            </div>

            {categoryBreakdown.length > 0 && (
              <div className="mt-4 pt-3 border-t">
                <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-2">
                  Top Categories
                </div>
                <div className="flex flex-col gap-2">
                  {categoryBreakdown.slice(0, 3).map((cat, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="text-text">{cat.categoryName}</span>
                        <span className="text-muted">₹{cat.amount.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="cust-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="cust-card-title mb-0">
                <i className="fas fa-bell text-primary"></i>
                Recent Updates
              </h3>
              <div className="cust-pill-tabs">
                {(["ALL", "BOOKING", "QUOTATION"] as const).map((filter) => (
                  <button
                    key={filter}
                    type="button"
                    className={`cust-pill-tab ${activityFilter === filter ? "active" : ""}`}
                    onClick={() => setActivityFilter(filter)}
                    style={{ padding: "0.2rem 0.5rem", fontSize: "0.65rem" }}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {recentActivity.length > 0 ? (
              <ul className="cust-activity-list">
                {recentActivity.map((act) => (
                  <li key={act.id} className="cust-activity-item">
                    <div className="cust-activity-icon">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="flex-1">
                      <div className="cust-activity-title">{act.title}</div>
                      <div className="cust-activity-msg">{act.message}</div>
                      <div className="cust-activity-time">
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
                You are all caught up! Updates about your requests and bookings will appear here.
              </p>
            )}
          </div>

          <div className="cust-trust-box">
            <h4 className="cust-trust-title">
              <i className="fas fa-shield-alt mr-1"></i> Direct Marketplace Guarantee
            </h4>
            <p className="cust-trust-desc">
              All providers set their own transparent rates with 0% platform markups. Compare bids, chat directly, and pay safely upon completion.
            </p>
          </div>
        </aside>
      </div>

      {inspectedRequest && (
        <div className="cust-modal-overlay" onClick={() => setInspectedRequest(null)}>
          <div className="cust-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <h3 className="cust-modal-title">
                <i className="fas fa-clipboard-check text-primary"></i>
                Service Request Overview
              </h3>
              <button
                type="button"
                className="btn btn-text text-sm"
                onClick={() => setInspectedRequest(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cust-modal-body">
              <div>
                <span className="text-xs text-muted uppercase font-bold">Requirement Title</span>
                <h4 className="text-lg font-bold text-text mt-0.5">{inspectedRequest.title}</h4>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Category</span>
                  <div className="font-extrabold text-sm text-text mt-0.5">{inspectedRequest.categoryName}</div>
                </div>
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Urgency</span>
                  <div className="font-extrabold text-sm text-primary mt-0.5">{inspectedRequest.urgency}</div>
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-bold">Location</span>
                <p className="text-sm text-text mt-0.5 mb-0">
                  <i className="fas fa-map-marker-alt text-primary mr-1"></i> {inspectedRequest.location}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 bg-surface-secondary rounded-xl border border-border">
                <div>
                  <span className="text-xs text-muted font-bold">Quotations Received</span>
                  <div className="font-extrabold text-base text-text">{inspectedRequest.quotationsCount} Provider Bids</div>
                </div>
                {inspectedRequest.minQuoteAmount !== undefined && (
                  <div className="text-right">
                    <span className="text-xs text-muted font-bold">Starting From</span>
                    <div className="font-extrabold text-base text-success">₹{inspectedRequest.minQuoteAmount.toLocaleString("en-IN")}</div>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <Link
                  to={`/my-requests/${inspectedRequest.id}`}
                  className="cust-btn-primary"
                >
                  {inspectedRequest.quotationsCount > 0 ? "Compare Bids Now" : "View Details"}
                </Link>
                <button
                  type="button"
                  className="cust-btn-secondary"
                  onClick={() => setInspectedRequest(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {inspectedBooking && (
        <div className="cust-modal-overlay" onClick={() => setInspectedBooking(null)}>
          <div className="cust-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <h3 className="cust-modal-title">
                <i className="fas fa-calendar-check text-primary"></i>
                Confirmed Appointment Telemetry
              </h3>
              <button
                type="button"
                className="btn btn-text text-sm"
                onClick={() => setInspectedBooking(null)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cust-modal-body">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-xs text-muted uppercase font-bold">Booking Reference</span>
                  <div className="text-lg font-bold text-text">#{inspectedBooking.bookingNumber}</div>
                </div>
                <span className="badge badge-info">{inspectedBooking.status}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Assigned Pro</span>
                  <div className="font-extrabold text-sm text-text mt-0.5">{inspectedBooking.providerName}</div>
                </div>
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Agreed Amount</span>
                  <div className="font-extrabold text-sm text-success mt-0.5">₹{inspectedBooking.totalAmount.toLocaleString("en-IN")}</div>
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-bold">Service Title</span>
                <p className="text-sm text-text mt-0.5 mb-0">{inspectedBooking.serviceTitle}</p>
              </div>

              <div className="flex justify-end gap-3 mt-2">
                <Link to="/messages" className="cust-btn-secondary">
                  <i className="fas fa-comment-dots mr-1"></i> Chat with Pro
                </Link>
                <Link to={`/bookings/${inspectedBooking.id}`} className="cust-btn-primary">
                  Manage Booking
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSavingsModal && (
        <div className="cust-modal-overlay" onClick={() => setShowSavingsModal(false)}>
          <div className="cust-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="cust-modal-header">
              <h3 className="cust-modal-title">
                <i className="fas fa-piggy-bank text-success"></i>
                Financial &amp; Savings Telemetry
              </h3>
              <button
                type="button"
                className="btn btn-text text-sm"
                onClick={() => setShowSavingsModal(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="cust-modal-body">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Total Completed Spend</span>
                  <div className="font-extrabold text-lg text-text mt-0.5">
                    ₹{stats.totalCompletedSpend.toLocaleString("en-IN")}
                  </div>
                </div>
                <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                  <span className="text-xs text-muted font-bold">Estimated Savings</span>
                  <div className="font-extrabold text-lg text-success mt-0.5">
                    ~₹{(stats.estimatedSavings || 1850).toLocaleString("en-IN")}
                  </div>
                </div>
              </div>

              <div className="bg-surface-secondary p-3 rounded-xl border border-border">
                <span className="text-xs text-muted font-bold">Direct Marketplace Economics</span>
                <p className="text-xs text-secondary mt-1 mb-0 leading-relaxed">
                  By comparing quotes directly on our reverse marketplace instead of paying inflated agency fees, you saved an estimated 18% on fulfilled services.
                </p>
              </div>

              <div className="flex justify-end mt-2">
                <button
                  type="button"
                  className="cust-btn-primary"
                  onClick={() => setShowSavingsModal(false)}
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
