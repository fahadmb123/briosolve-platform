import { Link } from "react-router-dom";
import { useCustomerDashboard } from "../../hooks/useDashboard";
import { useAuthStore } from "../../../auth/stores/auth.store";
import "./Dashboard.css";

export default function CustomerDashboard() {
  const { data, isLoading } = useCustomerDashboard();
  const authUser = useAuthStore((state) => state.user);

  const userName = data?.user?.name || authUser?.name || "Customer";
  const stats = data?.stats || {
    activeRequestsCount: 0,
    quotationsReceivedCount: 0,
    upcomingBookingsCount: 0,
    completedServicesCount: 0,
    totalCompletedSpend: 0,
  };
  const activeRequests = data?.activeRequests || [];
  const upcomingBookings = data?.upcomingBookings || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="app-content">
      <div className="welcome-header flex justify-between items-center flex-wrap gap-4 mb-8">
        <div>
          <h1 className="h2 mb-1">Welcome back, {userName} 👋</h1>
          <p className="text-secondary text-sm">
            {stats.quotationsReceivedCount > 0 ? (
              <>
                You have{" "}
                <span className="text-primary font-semibold">
                  {stats.quotationsReceivedCount} quotation{stats.quotationsReceivedCount !== 1 ? "s" : ""}
                </span>{" "}
                waiting for your review across {stats.activeRequestsCount} active request{stats.activeRequestsCount !== 1 ? "s" : ""}.
              </>
            ) : stats.activeRequestsCount > 0 ? (
              <>
                You have{" "}
                <span className="text-primary font-semibold">
                  {stats.activeRequestsCount} active request{stats.activeRequestsCount !== 1 ? "s" : ""}
                </span>{" "}
                live on the marketplace awaiting provider quotes.
              </>
            ) : (
              "Post a service request to start receiving competitive quotes from verified local providers."
            )}
          </p>
        </div>
        <Link to="/request-service" className="btn btn-primary btn-lg cta-pulse-btn">
          <i className="fas fa-plus-circle"></i>
          <span>Post a Service Request</span>
        </Link>
      </div>

      <div className="dashboard-stats-grid mb-8">
        <div className="card stat-widget">
          <div className="stat-icon-wrapper bg-primary-light text-primary">
            <i className="fas fa-file-alt"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{isLoading ? "-" : stats.activeRequestsCount}</div>
            <div className="stat-title">Active Requests</div>
            <div className="stat-meta text-primary">
              <i className="fas fa-layer-group"></i> Marketplace leads
            </div>
          </div>
        </div>

        <div className="card stat-widget">
          <div className="stat-icon-wrapper bg-warning-light text-warning">
            <i className="fas fa-file-invoice-dollar"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{isLoading ? "-" : stats.quotationsReceivedCount}</div>
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
            <div className="stat-value">{isLoading ? "-" : stats.upcomingBookingsCount}</div>
            <div className="stat-title">Upcoming Bookings</div>
            <div className="stat-meta text-secondary">
              <i className="fas fa-clock"></i> Scheduled jobs
            </div>
          </div>
        </div>

        <div className="card stat-widget">
          <div className="stat-icon-wrapper bg-success-light text-success">
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-body">
            <div className="stat-value">{isLoading ? "-" : stats.completedServicesCount}</div>
            <div className="stat-title">Completed Services</div>
            <div className="stat-meta text-muted">
              ₹{stats.totalCompletedSpend.toLocaleString("en-IN")} Total value
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-main-grid">
        <div className="grid-left flex flex-col gap-6">
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <div>
                <h2 className="h5 mb-0">Active Service Requests</h2>
                <p className="text-xs text-secondary mb-0">Track quotes received from competing providers</p>
              </div>
              <Link to="/my-requests" className="btn btn-text text-xs">
                View All <i className="fas fa-chevron-right ml-1"></i>
              </Link>
            </div>

            <div className="table-responsive">
              {activeRequests.length > 0 ? (
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
                    {activeRequests.map((req) => (
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
                            View Quotes ({req.quotationsCount})
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="p-6 text-center">
                  <div className="text-secondary text-sm mb-3">
                    You do not have any active service requests right now.
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
                          {new Date(act.createdAt).toLocaleString()}
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
                <i className="fas fa-lightbulb"></i>
              </div>
              <div>
                <h3 className="h6 mb-1 text-primary">Marketplace Tip</h3>
                <p className="text-xs text-secondary mb-3">
                  Comparing quotations? Don't just look at the price. Check provider completion ratings, warranties offered on workmanship, and scope of included services.
                </p>
                <Link to="/my-requests" className="btn btn-outline text-xs py-1">
                  View Active Quotes
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
