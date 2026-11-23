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

function getUrgencyBadgeClass(urgency: string): string {
  const u = urgency.toUpperCase();
  if (u.includes("EMERGENCY") || u.includes("URGENT") || u.includes("IMMEDIATE")) return "urgency-urgent";
  if (u.includes("HIGH") || u.includes("TODAY")) return "urgency-high";
  if (u.includes("MEDIUM") || u.includes("SCHEDULED")) return "urgency-medium";
  return "urgency-low";
}

export default function CustomerDashboard() {
  const { data, isLoading, isError, refetch } = useCustomerDashboard();
  const authUser = useAuthStore((state) => state.user);
  const [requestFilter, setRequestFilter] = useState<"ALL" | "WITH_QUOTES" | "AWAITING">("ALL");

  if (isLoading) {
    return <CustomerDashboardSkeleton />;
  }

  if (isError || !data) {
    return (
      <div className="app-content">
        <div className="card p-8 text-center">
          <i className="fas fa-exclamation-triangle text-2xl text-danger mb-3"></i>
          <p className="text-sm font-semibold text-text mb-1">Failed to load dashboard</p>
          <p className="text-xs text-secondary mb-4">An error occurred while fetching your account details.</p>
          <button onClick={() => refetch()} className="btn btn-primary text-xs">
            <i className="fas fa-sync-alt mr-1"></i> Retry
          </button>
        </div>
      </div>
    );
  }

  const hour = new Date().getHours();
  const timeGreeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const userName = data.user?.name || authUser?.name || "Customer";
  const stats = data.stats;
  const activeRequests = data.activeRequests || [];
  const upcomingBookings = data.upcomingBookings || [];
  const recentActivity = data.recentActivity || [];
  const monthlySpending = data.monthlySpending || [];
  const categoryBreakdown = data.categoryBreakdown || [];
  const quickCategories = data.quickCategories || [];

  const maxMonthSpend = Math.max(...monthlySpending.map((m) => m.spend), 1);

  const filteredRequests = activeRequests.filter((req) => {
    if (requestFilter === "WITH_QUOTES") return req.quotationsCount > 0;
    if (requestFilter === "AWAITING") return req.quotationsCount === 0;
    return true;
  });

  return (
    <div className="app-content customer-dashboard-container">
      <div className="dashboard-hero-card">
        <div className="hero-content-row">
          <div>
            <div className="hero-user-badge-row">
              <span className="hero-status-pill">
                <span className="hero-status-dot"></span>
                Marketplace Live
              </span>
              <span className="badge badge-primary text-xs">Verified Customer</span>
            </div>
            <h1 className="welcome-greeting-title">
              {timeGreeting}, {userName} 👋
            </h1>
            <p className="welcome-subtitle">
              {stats.quotationsReceivedCount > 0 ? (
                <>
                  You have{" "}
                  <strong className="text-primary font-bold">
                    {stats.quotationsReceivedCount} quotation{stats.quotationsReceivedCount !== 1 ? "s" : ""}
                  </strong>{" "}
                  ready across {stats.activeRequestsCount} active request{stats.activeRequestsCount !== 1 ? "s" : ""}. Review and hire with 0% platform fee.
                </>
              ) : stats.activeRequestsCount > 0 ? (
                <>
                  <strong className="text-primary font-bold">{stats.activeRequestsCount} service request{stats.activeRequestsCount !== 1 ? "s" : ""}</strong> currently broadcasted to top-rated nearby pros.
                </>
              ) : (
                "Post a service request to receive direct, transparent bids from verified independent professionals."
              )}
            </p>
          </div>

          <div className="hero-actions-group">
            <Link to="/nearby-providers" className="hero-btn-secondary">
              <i className="fas fa-search-location"></i> Find Local Pros
            </Link>
            <Link to="/request-service" className="hero-btn-primary">
              <i className="fas fa-plus-circle"></i> Post a Request
            </Link>
          </div>
        </div>
      </div>

      {quickCategories.length > 0 && (
        <div className="category-compact-ribbon">
          <span className="category-ribbon-label">
            <i className="fas fa-bolt text-primary"></i> Popular:
          </span>
          {quickCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/request-service?category=${encodeURIComponent(cat.id)}`}
              className="category-compact-chip"
            >
              <i className={`fas ${getCategoryIcon(cat.name)} category-chip-icon`}></i>
              <span>{cat.name}</span>
            </Link>
          ))}
          <Link to="/request-service" className="category-compact-chip" style={{ borderColor: "var(--primary)" }}>
            <span className="text-primary font-bold">+ Explore All</span>
          </Link>
        </div>
      )}

      <div className="compact-stats-grid">
        <Link to="/my-requests" className="compact-stat-card">
          <div className="compact-stat-icon stat-icon-primary">
            <i className="fas fa-file-alt"></i>
          </div>
          <div>
            <div className="compact-stat-val">{stats.activeRequestsCount}</div>
            <div className="compact-stat-lbl">Active Requests</div>
            <div className="compact-stat-meta text-primary">Live requirements</div>
          </div>
        </Link>

        <Link to="/my-requests" className="compact-stat-card">
          <div className="compact-stat-icon stat-icon-warning">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div>
            <div className="compact-stat-val">{stats.quotationsReceivedCount}</div>
            <div className="compact-stat-lbl">Quotes Received</div>
            <div className="compact-stat-meta text-warning">Direct provider bids</div>
          </div>
        </Link>

        <Link to="/bookings" className="compact-stat-card">
          <div className="compact-stat-icon stat-icon-info">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <div className="compact-stat-val">{stats.upcomingBookingsCount}</div>
            <div className="compact-stat-lbl">Upcoming Bookings</div>
            <div className="compact-stat-meta text-secondary">Scheduled visits</div>
          </div>
        </Link>

        <div className="compact-stat-card">
          <div className="compact-stat-icon stat-icon-success">
            <i className="fas fa-shield-check"></i>
          </div>
          <div>
            <div className="compact-stat-val">₹{stats.totalCompletedSpend.toLocaleString("en-IN")}</div>
            <div className="compact-stat-lbl">Completed Spend</div>
            <div className="compact-stat-meta text-success">
              {stats.estimatedSavings && stats.estimatedSavings > 0
                ? `Saved ~₹${stats.estimatedSavings.toLocaleString("en-IN")}`
                : `${stats.completedServicesCount} services fulfilled`}
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="flex flex-col gap-5">
          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-header-title">
                  <i className="fas fa-bullhorn text-primary text-sm"></i>
                  Active Service Requests
                </h2>
                <p className="panel-header-subtitle">
                  Live requirements currently receiving bids from independent providers
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="filter-tab-bar">
                  <button
                    onClick={() => setRequestFilter("ALL")}
                    className={`filter-tab-btn ${requestFilter === "ALL" ? "active" : ""}`}
                  >
                    All ({activeRequests.length})
                  </button>
                  <button
                    onClick={() => setRequestFilter("WITH_QUOTES")}
                    className={`filter-tab-btn ${requestFilter === "WITH_QUOTES" ? "active" : ""}`}
                  >
                    Quotes Ready
                  </button>
                  <button
                    onClick={() => setRequestFilter("AWAITING")}
                    className={`filter-tab-btn ${requestFilter === "AWAITING" ? "active" : ""}`}
                  >
                    Awaiting
                  </button>
                </div>
                <Link to="/my-requests" className="btn btn-text text-xs">
                  All Requests <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="modern-request-list">
                {filteredRequests.map((req) => (
                  <div key={req.id} className="modern-request-item">
                    <div className="modern-request-main">
                      <div className="request-cat-avatar">
                        <i className={`fas ${getCategoryIcon(req.categoryName)}`}></i>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Link to={`/my-requests/${req.id}`} className="request-title-link">
                            {req.title}
                          </Link>
                          <span className="badge badge-secondary text-xs">{req.categoryName}</span>
                          <span className={`urgency-badge ${getUrgencyBadgeClass(req.urgency)}`}>
                            <i className="fas fa-bolt text-xs mr-1"></i>
                            {req.urgency.replace(/_/g, " ")}
                          </span>
                        </div>
                        <div className="text-xs text-secondary flex items-center gap-3 flex-wrap">
                          <span>
                            <i className="fas fa-map-marker-alt text-primary mr-1"></i> {req.location}
                          </span>
                          <span>
                            Status: <strong className="text-primary">{req.status}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {req.quotationsCount > 0 ? (
                          <>
                            <div className="bids-badge-pill mb-1">
                              <i className="fas fa-file-invoice-dollar"></i> {req.quotationsCount} Quote{req.quotationsCount !== 1 ? "s" : ""}
                            </div>
                            {req.minQuoteAmount !== undefined && (
                              <div className="text-xs text-secondary">
                                Starting <strong>₹{req.minQuoteAmount.toLocaleString("en-IN")}</strong>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-xs text-muted flex items-center gap-1.5">
                            <span className="radar-ping-dot"></span> Awaiting Bids
                          </div>
                        )}
                      </div>
                      <Link to={`/my-requests/${req.id}`} className="hero-btn-primary py-1 px-3 text-xs">
                        {req.quotationsCount > 0 ? `Review Quotes (${req.quotationsCount}) →` : "View Details →"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-launchpad-card">
                <i className="fas fa-clipboard-list text-3xl mb-2 text-primary"></i>
                <h3 className="text-sm font-bold text-text mb-1">
                  {requestFilter === "ALL"
                    ? "Ready to get things done?"
                    : "No requests found for this filter."}
                </h3>
                <p className="text-xs text-muted max-w-md mx-auto mb-3">
                  Post your requirement in under 60 seconds and receive multiple transparent quotes directly from vetted professionals.
                </p>

                <div className="empty-launchpad-grid">
                  <Link to="/request-service?title=Electrical+Wiring+or+Switch+Repair" className="launchpad-template-btn">
                    <i className="fas fa-bolt launchpad-template-icon"></i>
                    <span className="launchpad-template-title">Electrical Repairs</span>
                  </Link>
                  <Link to="/request-service?title=Plumbing+Leak+or+Tap+Fitting" className="launchpad-template-btn">
                    <i className="fas fa-faucet launchpad-template-icon"></i>
                    <span className="launchpad-template-title">Plumbing &amp; Leak</span>
                  </Link>
                  <Link to="/request-service?title=Deep+Home+Cleaning" className="launchpad-template-btn">
                    <i className="fas fa-broom launchpad-template-icon"></i>
                    <span className="launchpad-template-title">Deep Cleaning</span>
                  </Link>
                  <Link to="/request-service?title=AC+Servicing+and+Filter+Cleaning" className="launchpad-template-btn">
                    <i className="fas fa-snowflake launchpad-template-icon"></i>
                    <span className="launchpad-template-title">AC Servicing</span>
                  </Link>
                </div>

                <Link to="/request-service" className="hero-btn-primary">
                  <i className="fas fa-plus"></i> Post a Custom Request
                </Link>
              </div>
            )}
          </div>

          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <div>
                <h2 className="panel-header-title">
                  <i className="fas fa-calendar-alt text-primary text-sm"></i>
                  Upcoming Bookings
                </h2>
                <p className="panel-header-subtitle">
                  Confirmed and scheduled appointments with assigned service specialists
                </p>
              </div>
              <Link to="/bookings" className="btn btn-text text-xs">
                All Bookings <i className="fas fa-arrow-right ml-1"></i>
              </Link>
            </div>

            {upcomingBookings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {upcomingBookings.map((b) => {
                  const dateObj = b.scheduledDate ? new Date(b.scheduledDate) : null;
                  const monthStr = dateObj ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase() : "SCHED";
                  const dayStr = dateObj ? dateObj.getDate() : "--";

                  return (
                    <div key={b.id} className="modern-booking-item">
                      <div className="flex items-center gap-4 flex-1">
                        <div className="booking-calendar-box">
                          <div className="booking-cal-month">{monthStr}</div>
                          <div className="booking-cal-day">{dayStr}</div>
                          <div className="booking-cal-time">{b.scheduledTime || "Time TBD"}</div>
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <h3 className="h6 mb-0 font-bold text-text">{b.serviceTitle}</h3>
                            <span className="badge badge-info text-xs">{b.status}</span>
                          </div>
                          <div className="text-xs text-secondary mb-1">
                            Booking ID: <strong>#{b.bookingNumber}</strong>
                          </div>

                          <div className="booking-provider-bar">
                            <img
                              src={
                                b.providerAvatar ||
                                `https://ui-avatars.com/api/?name=${encodeURIComponent(b.providerName)}&background=FF7900&color=fff`
                              }
                              alt={b.providerName}
                              className="booking-provider-avatar"
                            />
                            <div>
                              <div className="text-xs font-bold text-text flex items-center gap-1">
                                {b.providerName} <i className="fas fa-check-circle text-success text-xs"></i>
                              </div>
                              <div className="text-xs text-muted">{b.categoryName} Specialist</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="text-xs text-muted uppercase font-semibold">Agreed Price</div>
                          <div className="booking-total-price">
                            ₹{b.totalAmount.toLocaleString("en-IN")}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link
                            to="/messages"
                            className="btn btn-secondary btn-sm"
                            aria-label="Chat with Provider"
                          >
                            <i className="fas fa-comment-dots"></i> Chat
                          </Link>
                          <Link to={`/bookings/${b.id}`} className="btn btn-outline btn-sm">
                            Manage
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="empty-launchpad-card">
                <i className="fas fa-calendar-check text-3xl mb-2 text-primary"></i>
                <h3 className="text-sm font-bold text-text mb-1">No upcoming bookings scheduled</h3>
                <p className="text-xs text-muted max-w-sm mx-auto mb-3">
                  Once you accept a quotation from a service specialist, your confirmed booking timeline and live updates will appear here.
                </p>
                <Link to="/nearby-providers" className="hero-btn-secondary">
                  <i className="fas fa-user-check"></i> Browse Verified Pros
                </Link>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <h3 className="panel-header-title">
                <i className="fas fa-chart-pie text-primary text-sm"></i>
                Spending &amp; Insights
              </h3>
              {stats.estimatedSavings !== undefined && stats.estimatedSavings > 0 ? (
                <span className="badge badge-success text-xs font-bold py-0 px-2">
                  Saved ₹{stats.estimatedSavings.toLocaleString("en-IN")}
                </span>
              ) : (
                <span className="badge badge-outline text-xs">0% Markups</span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex justify-between items-center text-xs mb-2">
                <span className="font-semibold text-secondary uppercase tracking-wider">6-Month Trend</span>
                <span className="text-muted">Total: ₹{stats.totalCompletedSpend.toLocaleString("en-IN")}</span>
              </div>
              <div className="monthly-bars-chart">
                {monthlySpending.length > 0 ? (
                  monthlySpending.map((item, idx) => {
                    const heightPercent = item.spend > 0
                      ? Math.max(16, Math.round((item.spend / maxMonthSpend) * 100))
                      : 8;
                    return (
                      <div key={idx} className="chart-col">
                        <div
                          className="chart-bar-fill"
                          style={{ height: `${heightPercent}%` }}
                          title={`${item.month}: ₹${item.spend.toLocaleString("en-IN")}`}
                        ></div>
                        <span className="chart-col-label">{item.month}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-xs text-muted text-center w-full py-4">No spend recorded.</div>
                )}
              </div>
            </div>

            <div>
              <div className="text-xs font-semibold text-secondary uppercase tracking-wider mb-2">
                Top Categories
              </div>
              {categoryBreakdown.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {categoryBreakdown.slice(0, 3).map((cat, idx) => (
                    <div key={idx} className="text-xs">
                      <div className="flex justify-between mb-1">
                        <span className="font-semibold text-text">{cat.categoryName}</span>
                        <span className="text-muted">₹{cat.amount.toLocaleString("en-IN")} ({cat.percentage}%)</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${cat.percentage}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-muted text-center py-2">
                  Spend breakdown will populate as services are completed.
                </div>
              )}
            </div>
          </div>

          <div className="dashboard-panel-card">
            <div className="panel-header-row">
              <h3 className="panel-header-title">
                <i className="fas fa-bell text-primary text-sm"></i>
                Activity &amp; Updates
              </h3>
              <span className="text-xs text-muted">Live</span>
            </div>

            {recentActivity.length > 0 ? (
              <ul className="activity-feed">
                {recentActivity.map((act) => (
                  <li key={act.id} className="activity-feed-item">
                    <div className="feed-icon">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-xs text-text">
                        {act.title}
                      </div>
                      <div className="text-xs text-secondary mt-1">
                        {act.message}
                      </div>
                      <div className="text-xs text-muted mt-1">
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
              <div className="p-4 text-center text-secondary text-xs">
                <i className="fas fa-lightbulb text-primary text-xl mb-2"></i>
                <p className="font-semibold text-text mb-1">Pro Marketplace Tip</p>
                <p className="text-muted mb-0 leading-relaxed">
                  Adding clear descriptions and photos when posting a request helps local professionals give you precise, competitive estimates faster.
                </p>
              </div>
            )}
          </div>

          <div className="guarantee-card">
            <div className="flex items-start gap-3">
              <div className="text-primary text-2xl mt-0.5">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h4 className="font-bold text-sm text-primary mb-1">100% Direct Marketplace Guarantee</h4>
                <p className="text-xs text-secondary mb-2 leading-relaxed">
                  Zero commission fees charged to customers or hidden in service costs. You pay independent providers directly.
                </p>
                <Link to="/request-service" className="hero-btn-primary py-1 px-3 text-xs">
                  Post Your First Request
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
