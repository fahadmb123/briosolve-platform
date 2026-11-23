import { useState } from "react";
import { Link } from "react-router-dom";
import { useCustomerDashboard } from "../../hooks/useDashboard";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { CustomerDashboardSkeleton } from "./CustomerDashboardSkeleton";
import "./Dashboard.css";

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
      <div className="welcome-header flex justify-between items-center flex-wrap gap-4 mb-6">
        <div>
          <h1 className="h2 mb-1">Welcome back, {userName} 👋</h1>
          <p className="text-secondary text-sm mb-0">
            {stats.quotationsReceivedCount > 0 ? (
              <>
                You have{" "}
                <span className="text-primary font-semibold">
                  {stats.quotationsReceivedCount} quotation{stats.quotationsReceivedCount !== 1 ? "s" : ""}
                </span>{" "}
                ready for review across {stats.activeRequestsCount} active request{stats.activeRequestsCount !== 1 ? "s" : ""}.
              </>
            ) : stats.activeRequestsCount > 0 ? (
              <>
                You have{" "}
                <span className="text-primary font-semibold">
                  {stats.activeRequestsCount} active request{stats.activeRequestsCount !== 1 ? "s" : ""}
                </span>{" "}
                active on the marketplace awaiting competitive quotes.
              </>
            ) : (
              "Post a service request to receive competitive bids from verified providers."
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/nearby-providers" className="btn btn-outline text-xs">
            <i className="fas fa-search-location mr-1"></i> Find Providers
          </Link>
          <Link to="/request-service" className="btn btn-primary">
            <i className="fas fa-plus-circle mr-1"></i> Post a Request
          </Link>
        </div>
      </div>

      {quickCategories.length > 0 && (
        <div className="mb-6">
          <div className="text-xs uppercase font-semibold text-muted mb-2">Quick Request by Category</div>
          <div className="category-quick-bar">
            {quickCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/request-service?category=${encodeURIComponent(cat.id)}`}
                className="category-quick-pill"
              >
                <i className="fas fa-tools text-primary text-xs"></i>
                <span>{cat.name}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="dashboard-stats-grid mb-8">
        <div className="card stat-widget">
          <div className="stat-icon-wrapper bg-primary-light text-primary">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.activeRequestsCount}</div>
            <div className="stat-title">Active Requests</div>
            <div className="stat-meta text-primary">
              <i className="fas fa-layer-group"></i> In marketplace
            </div>
          </div>
        </div>

        <div className="card stat-widget">
          <div className="stat-icon-wrapper bg-warning-light text-warning">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.quotationsReceivedCount}</div>
            <div className="stat-title">Quotations Received</div>
            <div className="stat-meta text-warning">
              <i className="fas fa-balance-scale"></i> Competitive bids
            </div>
          </div>
        </div>

        <div className="card stat-widget">
          <div className="stat-icon-wrapper bg-info-light text-info">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.upcomingBookingsCount}</div>
            <div className="stat-title">Upcoming Bookings</div>
            <div className="stat-meta text-secondary">
              <i className="fas fa-clock"></i> Scheduled services
            </div>
          </div>
        </div>

        <div className="card stat-widget">
          <div className="stat-icon-wrapper bg-success-light text-success">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{stats.completedServicesCount}</div>
            <div className="stat-title">Completed Services</div>
            <div className="stat-meta text-muted">
              ₹{stats.totalCompletedSpend.toLocaleString("en-IN")} Total spend
            </div>
          </div>
        </div>
      </div>

      {(monthlySpending.length > 0 || categoryBreakdown.length > 0) && (
        <div className="card p-5 mb-8">
          <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
            <div>
              <h2 className="h5 mb-0">Spending &amp; Marketplace Savings</h2>
              <p className="text-xs text-secondary mb-0">
                Track your service expenses and competitive price benefits
              </p>
            </div>
            {stats.estimatedSavings !== undefined && stats.estimatedSavings > 0 && (
              <span className="badge badge-success text-xs font-semibold py-1 px-3">
                <i className="fas fa-shield-alt mr-1"></i> Saved ₹{stats.estimatedSavings.toLocaleString("en-IN")} via reverse bidding
              </span>
            )}
          </div>

          <div className="analytics-card-grid">
            <div className="p-4 bg-surface-elevated rounded border">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold text-secondary uppercase">6-Month Spending History</span>
                <span className="text-xs text-muted">Total: ₹{stats.totalCompletedSpend.toLocaleString("en-IN")}</span>
              </div>
              <div className="monthly-bars-chart">
                {monthlySpending.map((item, idx) => {
                  const heightPercent = Math.max(8, Math.round((item.spend / maxMonthSpend) * 100));
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
                })}
              </div>
            </div>

            <div className="p-4 bg-surface-elevated rounded border flex flex-col justify-between">
              <div className="text-xs font-semibold text-secondary uppercase mb-3">Spend by Category</div>
              {categoryBreakdown.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {categoryBreakdown.slice(0, 4).map((cat, idx) => (
                    <div key={idx} className="category-spend-item">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-text">{cat.categoryName}</span>
                        <span className="text-secondary">
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
                <div className="text-xs text-muted text-center py-4">
                  No completed service categories recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="dashboard-main-grid">
        <div className="grid-left flex flex-col gap-6">
          <div className="card">
            <div className="card-header flex justify-between items-center flex-wrap gap-3">
              <div>
                <h2 className="h5 mb-0">Active Service Requests</h2>
                <p className="text-xs text-secondary mb-0">Track quotes received from verified providers</p>
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
                    Quotes Received
                  </button>
                  <button
                    onClick={() => setRequestFilter("AWAITING")}
                    className={`filter-tab-btn ${requestFilter === "AWAITING" ? "active" : ""}`}
                  >
                    Awaiting
                  </button>
                </div>
                <Link to="/my-requests" className="btn btn-text text-xs">
                  View All <i className="fas fa-chevron-right ml-1"></i>
                </Link>
              </div>
            </div>

            <div className="table-responsive">
              {filteredRequests.length > 0 ? (
                <table className="table mb-0">
                  <thead>
                    <tr>
                      <th>Requirement</th>
                      <th>Category</th>
                      <th>Urgency</th>
                      <th>Quotations</th>
                      <th>Status</th>
                      <th className="text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRequests.map((req) => (
                      <tr key={req.id}>
                        <td>
                          <Link to="/my-requests" className="font-semibold text-text hover-primary">
                            {req.title}
                          </Link>
                          <div className="text-xs text-secondary mt-1">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {req.location}
                          </div>
                        </td>
                        <td>
                          <span className="badge badge-secondary">{req.categoryName}</span>
                        </td>
                        <td className="font-medium text-xs">
                          {req.urgency.replace(/_/g, " ")}
                        </td>
                        <td>
                          {req.quotationsCount > 0 ? (
                            <div className="flex items-center gap-2">
                              <span className="badge badge-warning font-semibold">
                                {req.quotationsCount} Bid{req.quotationsCount !== 1 ? "s" : ""}
                              </span>
                              {req.minQuoteAmount !== undefined && (
                                <span className="text-xs text-secondary">
                                  from ₹{req.minQuoteAmount.toLocaleString("en-IN")}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-muted">Awaiting bids</span>
                          )}
                        </td>
                        <td>
                          <span className="badge badge-primary">{req.status}</span>
                        </td>
                        <td className="text-right">
                          <Link to="/my-requests" className="btn btn-secondary text-xs py-1">
                            {req.quotationsCount > 0 ? `Review (${req.quotationsCount})` : "Details"}
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-secondary text-sm mb-3">
                    {requestFilter === "ALL"
                      ? "You do not have any active service requests right now."
                      : "No service requests match this filter."}
                  </div>
                  <Link to="/request-service" className="btn btn-outline text-xs">
                    <i className="fas fa-plus mr-1"></i> Create a Request
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center">
              <div>
                <h2 className="h5 mb-0">Upcoming Bookings</h2>
                <p className="text-xs text-secondary mb-0">Services confirmed and scheduled with providers</p>
              </div>
              <Link to="/bookings" className="btn btn-text text-xs">
                All Bookings <i className="fas fa-chevron-right ml-1"></i>
              </Link>
            </div>

            <div className="card-body">
              {upcomingBookings.length > 0 ? (
                <div className="flex flex-col gap-3">
                  {upcomingBookings.map((b) => {
                    const dateObj = b.scheduledDate ? new Date(b.scheduledDate) : null;
                    const monthStr = dateObj ? dateObj.toLocaleString("en-US", { month: "short" }).toUpperCase() : "SCHED";
                    const dayStr = dateObj ? dateObj.getDate() : "--";

                    return (
                      <div
                        key={b.id}
                        className="booking-card-item p-4 bg-surface-elevated rounded border flex justify-between items-center flex-wrap gap-4"
                      >
                        <div className="flex items-center gap-4">
                          <div className="date-badge-box text-center">
                            <div className="date-month text-xs text-uppercase font-semibold text-primary">
                              {monthStr}
                            </div>
                            <div className="date-day font-bold text-lg">{dayStr}</div>
                          </div>

                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="h6 mb-0">{b.serviceTitle}</h3>
                              <span className="badge badge-info">{b.status}</span>
                            </div>
                            <div className="text-xs text-secondary mb-2">
                              {b.scheduledTime && (
                                <>
                                  Scheduled Time: <strong>{b.scheduledTime}</strong> •{" "}
                                </>
                              )}
                              Booking ID: #{b.bookingNumber}
                            </div>

                            <div className="flex items-center gap-2">
                              <img
                                src={
                                  b.providerAvatar ||
                                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                    b.providerName
                                  )}&background=334155&color=fff`
                                }
                                alt={b.providerName}
                                className="avatar avatar-sm"
                              />
                              <span className="text-xs font-semibold">{b.providerName}</span>
                              <span className="badge badge-secondary text-xs py-0 px-2">{b.categoryName}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs text-secondary">Total Agreed</div>
                            <div className="font-bold text-base text-text">
                              ₹{b.totalAmount.toLocaleString("en-IN")}
                            </div>
                          </div>
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
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center text-secondary text-sm">
                  No upcoming bookings. Confirmed services will appear here.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid-right flex flex-col gap-6">
          <div className="card">
            <div className="card-header">
              <h2 className="h5 mb-0">Recent Activity</h2>
            </div>
            <div className="card-body p-0">
              {recentActivity.length > 0 ? (
                <ul className="activity-feed">
                  {recentActivity.map((act) => (
                    <li key={act.id} className="activity-feed-item">
                      <div className="feed-icon bg-primary-light text-primary">
                        <i className="fas fa-bell"></i>
                      </div>
                      <div className="feed-content">
                        <div className="feed-title">
                          <strong>{act.title}</strong>
                        </div>
                        <div className="feed-preview text-xs text-secondary mt-1">
                          {act.message}
                        </div>
                        <div className="feed-meta text-xs text-muted mt-1">
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
                <div className="p-5 text-center text-secondary text-xs">
                  No recent activity recorded yet.
                </div>
              )}
            </div>
          </div>

          <div className="card p-5 border-primary">
            <div className="flex items-start gap-3">
              <div className="tip-icon text-primary">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div>
                <h3 className="h6 mb-1 text-primary">Zero Commission Guarantee</h3>
                <p className="text-xs text-secondary mb-3">
                  All providers compete directly with zero commissions, meaning you get the most honest and transparent pricing directly from independent owners.
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
