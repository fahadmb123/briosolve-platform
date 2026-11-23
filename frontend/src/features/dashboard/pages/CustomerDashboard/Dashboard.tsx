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
    <div className="app-content">
      <div className="customer-hero-banner mb-6">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="badge badge-primary text-xs">Customer Portal</span>
              <span className="text-xs text-secondary">
                <i className="fas fa-shield-alt text-success mr-1"></i> 100% Direct Marketplace
              </span>
            </div>
            <h1 className="h2 mb-1">Welcome back, {userName} 👋</h1>
            <p className="text-secondary text-sm mb-0">
              {stats.quotationsReceivedCount > 0 ? (
                <>
                  You have{" "}
                  <strong className="text-primary font-bold">
                    {stats.quotationsReceivedCount} competitive quote{stats.quotationsReceivedCount !== 1 ? "s" : ""}
                  </strong>{" "}
                  ready for your review across {stats.activeRequestsCount} active service request{stats.activeRequestsCount !== 1 ? "s" : ""}.
                </>
              ) : stats.activeRequestsCount > 0 ? (
                <>
                  You have{" "}
                  <strong className="text-primary font-bold">
                    {stats.activeRequestsCount} active request{stats.activeRequestsCount !== 1 ? "s" : ""}
                  </strong>{" "}
                  live on the marketplace awaiting competitive quotes.
                </>
              ) : (
                "Post a service request to start receiving competitive, zero-commission bids from verified local providers."
              )}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/nearby-providers" className="btn btn-outline text-xs">
              <i className="fas fa-search-location mr-1"></i> Browse Providers
            </Link>
            <Link to="/request-service" className="btn btn-primary">
              <i className="fas fa-plus-circle mr-1"></i> Post a Request
            </Link>
          </div>
        </div>
      </div>

      {quickCategories.length > 0 && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase font-extrabold text-muted tracking-wider">
                Services &amp; Immediate Requests
              </span>
              <span className="badge badge-secondary text-xs">Zero Markup</span>
            </div>
            <Link to="/request-service" className="text-xs text-primary font-bold hover:underline flex items-center gap-1">
              All Categories <i className="fas fa-arrow-right text-xs"></i>
            </Link>
          </div>

          <div className="modern-category-grid">
            {quickCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/request-service?category=${encodeURIComponent(cat.id)}`}
                className="modern-category-card"
              >
                <div className="cat-card-icon">
                  <i className={`fas ${getCategoryIcon(cat.name)}`}></i>
                </div>
                <div className="cat-card-name">{cat.name}</div>
                <div className="cat-card-action">
                  Post Request <i className="fas fa-arrow-right ml-1"></i>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-stats-grid mb-8">
        <div className="stat-widget">
          <div className="stat-icon-wrapper bg-primary-light text-primary">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.activeRequestsCount}</div>
            <div className="stat-title">Active Requests</div>
            <div className="stat-meta text-primary">
              <i className="fas fa-layer-group mr-1"></i> In marketplace
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-wrapper bg-warning-light text-warning">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.quotationsReceivedCount}</div>
            <div className="stat-title">Quotations Received</div>
            <div className="stat-meta text-warning">
              <i className="fas fa-balance-scale mr-1"></i> Competitive bids
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-wrapper bg-info-light text-info">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.upcomingBookingsCount}</div>
            <div className="stat-title">Upcoming Bookings</div>
            <div className="stat-meta text-secondary">
              <i className="fas fa-clock mr-1"></i> Scheduled services
            </div>
          </div>
        </div>

        <div className="stat-widget">
          <div className="stat-icon-wrapper bg-success-light text-success">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.completedServicesCount}</div>
            <div className="stat-title">Completed Services</div>
            <div className="stat-meta text-muted">
              ₹{stats.totalCompletedSpend.toLocaleString("en-IN")} Total value
            </div>
          </div>
        </div>
      </div>

      <div className="modern-analytics-card mb-8">
        <div className="analytics-header">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h2 className="h5 mb-0 font-bold">Spending Insights &amp; Marketplace Savings</h2>
              <span className="badge badge-primary text-xs">Analytics Hub</span>
            </div>
            <p className="text-xs text-secondary mb-0">
              Real-time expenditure tracking and reverse bidding value savings
            </p>
          </div>
          {stats.estimatedSavings !== undefined && stats.estimatedSavings > 0 ? (
            <div className="savings-pill-banner">
              <div className="savings-pill-icon">
                <i className="fas fa-piggy-bank"></i>
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-success">Direct Savings</div>
                <div className="text-sm font-extrabold text-success">
                  ₹{stats.estimatedSavings.toLocaleString("en-IN")} saved
                </div>
              </div>
            </div>
          ) : (
            <div className="savings-pill-banner">
              <div className="savings-pill-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <div>
                <div className="text-xs uppercase font-bold text-primary">Direct Bids</div>
                <div className="text-sm font-extrabold text-text">Zero Platform Markup</div>
              </div>
            </div>
          )}
        </div>

        <div className="analytics-body-grid">
          <div className="chart-panel">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                <i className="fas fa-chart-bar text-primary mr-1"></i> 6-Month Spending Trend
              </span>
              <span className="text-xs text-muted font-medium">
                Total: <strong className="text-text">₹{stats.totalCompletedSpend.toLocaleString("en-IN")}</strong>
              </span>
            </div>
            <div className="monthly-bars-chart">
              {monthlySpending.length > 0 ? (
                monthlySpending.map((item, idx) => {
                  const heightPercent = item.spend > 0
                    ? Math.max(14, Math.round((item.spend / maxMonthSpend) * 100))
                    : 6;
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
                <div className="text-xs text-muted text-center w-full py-6">
                  No monthly spending recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="category-panel flex flex-col justify-between">
            <div className="text-xs font-bold text-secondary uppercase tracking-wider mb-3">
              <i className="fas fa-pie-chart text-primary mr-1"></i> Spend by Category
            </div>
            {categoryBreakdown.length > 0 ? (
              <div className="flex flex-col gap-3">
                {categoryBreakdown.slice(0, 4).map((cat, idx) => (
                  <div key={idx} className="category-spend-item">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-semibold text-text flex items-center gap-1">
                        <i className={`fas ${getCategoryIcon(cat.categoryName)} text-primary text-xs`}></i>
                        {cat.categoryName}
                      </span>
                      <span className="text-secondary font-medium">
                        ₹{cat.amount.toLocaleString("en-IN")} ({cat.percentage}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill" style={{ width: `${cat.percentage}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-muted text-center py-6">
                <i className="fas fa-chart-pie text-2xl mb-2 text-muted"></i>
                <p className="mb-0">Completed service categories will be mapped here.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="grid-left flex flex-col gap-6">
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
              <div>
                <h2 className="h5 mb-0 font-bold">Active Service Requests</h2>
                <p className="text-xs text-secondary mb-0">Live marketplace requirements receiving competitive quotes</p>
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
                  View All <i className="fas fa-arrow-right ml-1"></i>
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
                          <Link to={`/my-requests/${req.id}`} className="font-bold text-text hover-primary text-sm">
                            {req.title}
                          </Link>
                          <span className="badge badge-secondary text-xs">{req.categoryName}</span>
                          <span className="badge badge-outline text-xs">
                            <i className="fas fa-bolt text-warning mr-1"></i> {req.urgency.replace(/_/g, " ")}
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

                    <div className="modern-request-actions">
                      <div className="text-right">
                        {req.quotationsCount > 0 ? (
                          <>
                            <div className="bids-badge-pill mb-1">
                              <i className="fas fa-file-invoice-dollar"></i> {req.quotationsCount} Quote{req.quotationsCount !== 1 ? "s" : ""}
                            </div>
                            {req.minQuoteAmount !== undefined && (
                              <div className="text-xs text-secondary">
                                From <strong>₹{req.minQuoteAmount.toLocaleString("en-IN")}</strong>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-xs text-muted flex items-center gap-1">
                            <span className="radar-ping-dot"></span> Awaiting Quotes
                          </div>
                        )}
                      </div>
                      <Link to={`/my-requests/${req.id}`} className="btn btn-primary btn-sm">
                        {req.quotationsCount > 0 ? `Review Quotes (${req.quotationsCount}) →` : "View Details →"}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center bg-surface-elevated rounded border">
                <i className="fas fa-inbox text-3xl mb-2 text-muted"></i>
                <p className="text-sm font-semibold text-text mb-1">
                  {requestFilter === "ALL"
                    ? "You do not have any active service requests right now."
                    : "No service requests match this filter."}
                </p>
                <p className="text-xs text-muted mb-4">Post a request to receive competitive quotes directly from independent providers.</p>
                <Link to="/request-service" className="btn btn-primary text-xs">
                  <i className="fas fa-plus mr-1"></i> Post a Service Request
                </Link>
              </div>
            )}
          </div>

          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h2 className="h5 mb-0 font-bold">Upcoming Bookings</h2>
                <p className="text-xs text-secondary mb-0">Confirmed and in-progress service appointments</p>
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
                      <div className="flex items-center gap-4 flex-1 min-width-[240px]">
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
                          <div className="text-xs text-secondary mb-2">
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
              <div className="p-8 text-center bg-surface-elevated rounded border">
                <i className="fas fa-calendar-times text-3xl mb-2 text-muted"></i>
                <p className="text-sm font-semibold text-text mb-1">No upcoming bookings scheduled</p>
                <p className="text-xs text-muted mb-0">When you accept a quotation, your scheduled service will appear here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid-right flex flex-col gap-6">
          <div className="card p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="h6 mb-0 font-bold">
                <i className="fas fa-bell text-primary mr-2"></i>Recent Activity
              </h2>
              <span className="text-xs text-muted">Live Feed</span>
            </div>

            {recentActivity.length > 0 ? (
              <ul className="activity-feed">
                {recentActivity.map((act) => (
                  <li key={act.id} className="activity-feed-item">
                    <div className="feed-icon bg-primary-light text-primary">
                      <i className="fas fa-bell"></i>
                    </div>
                    <div className="feed-content">
                      <div className="feed-title font-bold text-xs">
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
              <div className="p-6 text-center text-secondary text-xs">
                <i className="fas fa-stream text-2xl mb-2 text-muted"></i>
                <p className="mb-0">No recent activity recorded yet.</p>
              </div>
            )}
          </div>

          <div className="card p-5 border-primary">
            <div className="flex items-start gap-3">
              <div className="text-primary text-2xl mt-1">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h3 className="h6 mb-1 text-primary font-bold">100% Direct Marketplace</h3>
                <p className="text-xs text-secondary mb-3 leading-relaxed">
                  Independent professionals own their services with zero middleman commissions, delivering higher quality and competitive transparent rates.
                </p>
                <Link to="/request-service" className="btn btn-outline text-xs py-1">
                  Post Another Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
