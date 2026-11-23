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
  const recentActivity = data.recentActivity || [];
  const categoryBreakdown = data.categoryBreakdown || [];
  const quickCategories = data.quickCategories || [];

  const filteredRequests = activeRequests.filter((req) => {
    if (requestFilter === "WITH_QUOTES") return req.quotationsCount > 0;
    if (requestFilter === "AWAITING") return req.quotationsCount === 0;
    return true;
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

        <div className="cust-kpi-card">
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

              <div className="flex items-center gap-3">
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
                <Link to="/my-requests" className="btn btn-text text-xs">
                  View All <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </div>

            {filteredRequests.length > 0 ? (
              <div className="cust-req-list">
                {filteredRequests.map((req) => {
                  const urgencyMeta = getUrgencyBadge(req.urgency);
                  return (
                    <div key={req.id} className="cust-req-item">
                      <div className="cust-req-info">
                        <div className="cust-req-avatar">
                          <i className={`fas ${getCategoryIcon(req.categoryName)}`}></i>
                        </div>
                        <div className="cust-req-details">
                          <div className="cust-req-title-row">
                            <Link to={`/my-requests/${req.id}`} className="cust-req-title-link">
                              {req.title}
                            </Link>
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
                        <Link to={`/my-requests/${req.id}`} className="cust-btn-primary py-1 px-3 text-xs">
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
                    <div key={b.id} className="cust-booking-item">
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
                        <div className="flex items-center gap-2">
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
            <h3 className="cust-card-title mb-3">
              <i className="fas fa-bell text-primary"></i>
              Recent Updates
            </h3>

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
    </div>
  );
}
