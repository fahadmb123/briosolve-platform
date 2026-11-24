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

  const { provider, stats, opportunities, recentActivity, activeBookings = [] } = data;
  const displayName = provider.businessName || provider.name || "Provider";
  const locationString = provider.serviceArea || "Registered Dispatch Area";

  const filteredOpportunities = opportunities.filter((opp) => {
    if (leadFilter === "URGENT") {
      const u = opp.urgency.toUpperCase();
      return u.includes("EMERGENCY") || u.includes("URGENT") || u.includes("IMMEDIATE") || u.includes("HIGH");
    }
    if (leadFilter === "LOW_COMPETITION") {
      return opp.quotationsCount < 3;
    }
    return true;
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

        <div className="pro-kpi-card">
          <div className="pro-kpi-icon-box bg-success-light text-success">
            <i className="fas fa-chart-line"></i>
          </div>
          <div>
            <div className="pro-kpi-val">₹{stats.totalEarnings.toLocaleString("en-IN")}</div>
            <div className="pro-kpi-lbl">Net Earnings</div>
            <div className="pro-kpi-sub">{stats.completedServicesCount} jobs fulfilled</div>
          </div>
        </div>

        <div className="pro-kpi-card">
          <div className="pro-kpi-icon-box bg-warning-light text-warning">
            <i className="fas fa-star"></i>
          </div>
          <div>
            <div className="pro-kpi-val">
              {stats.averageRating > 0 ? `${stats.averageRating.toFixed(1)} ★` : "5.0 ★"}
            </div>
            <div className="pro-kpi-lbl">Reputation</div>
            <div className="pro-kpi-sub">{provider.reviewCount} review{provider.reviewCount === 1 ? "" : "s"}</div>
          </div>
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
                    <div key={b.id} className="pro-booking-item">
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
                        <div className="flex items-center gap-2">
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

              <div className="flex items-center gap-3">
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
                <Link to="/provider/service-requests" className="btn btn-text text-xs">
                  View All <i className="fas fa-arrow-right ml-1"></i>
                </Link>
              </div>
            </div>

            {filteredOpportunities.length > 0 ? (
              <div className="pro-item-list">
                {filteredOpportunities.map((opp) => {
                  const urgencyMeta = getUrgencyBadge(opp.urgency);
                  return (
                    <div key={opp.id} className="pro-lead-item">
                      <div className="pro-lead-main">
                        <div className="pro-lead-badge-row">
                          <span className="badge badge-secondary text-xs">{opp.categoryName}</span>
                          <span className={`badge ${urgencyMeta.badgeClass} text-xs`}>
                            {urgencyMeta.label}
                          </span>
                          <span className="text-xs text-muted">
                            Posted {new Date(opp.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <h3 className="pro-lead-title">
                          <Link to="/provider/service-requests" className="pro-lead-title-link">
                            {opp.title}
                          </Link>
                        </h3>

                        <p className="pro-lead-desc">
                          {opp.description || "No specific details provided. Check request for full scope."}
                        </p>

                        <div className="pro-lead-meta-row">
                          <span>
                            <i className="fas fa-user text-primary mr-1"></i> {opp.customerName}
                          </span>
                          <span>
                            <i className="fas fa-map-marker-alt text-primary mr-1"></i> {opp.location}
                          </span>
                        </div>
                      </div>

                      <div className="pro-lead-action-col">
                        <div className="pro-bids-pill">
                          <i className="fas fa-file-invoice-dollar"></i> {opp.quotationsCount} Bid{opp.quotationsCount === 1 ? "" : "s"}
                        </div>
                        <Link to="/provider/service-requests" className="pro-btn-primary py-1 px-3 text-xs">
                          Send Quote →
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
                    ? "No open opportunities in your area right now"
                    : "No opportunities match this filter"}
                </h3>
                <p className="pro-empty-desc">
                  New service requests in your area will appear here automatically. You can also expand your service radius to receive more leads.
                </p>
                <Link to="/provider/settings" className="pro-btn-secondary">
                  <i className="fas fa-sliders-h"></i> Adjust Service Area
                </Link>
              </div>
            )}
          </section>
        </div>

        <aside className="pro-sidebar-column">
          <div className="pro-card">
            <h3 className="pro-card-title mb-3">
              <i className="fas fa-compass text-primary"></i>
              Coverage &amp; Dispatch Area
            </h3>

            <div className="pro-coverage-box">
              <div className="pro-coverage-icon">
                <i className="fas fa-crosshairs"></i>
              </div>
              <div>
                <div className="text-xs text-secondary uppercase font-semibold">Active Zone</div>
                <div className="text-sm font-bold text-text">{locationString}</div>
                <div className="text-xs text-secondary mt-0.5">
                  Within <strong>{provider.serviceRadiusKm} km</strong> radius
                </div>
              </div>
            </div>

            <Link to="/provider/settings" className="pro-btn-secondary w-full text-center text-xs py-2">
              <i className="fas fa-sliders-h mr-1"></i> Manage Service Area
            </Link>
          </div>

          <div className="pro-card">
            <h3 className="pro-card-title mb-3">
              <i className="fas fa-bell text-primary"></i>
              Recent Activity
            </h3>

            {recentActivity.length > 0 ? (
              <ul className="pro-activity-list">
                {recentActivity.map((act) => (
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
                No recent activity yet. When you receive quotes, bookings, or reviews, they will show up here.
              </p>
            )}
          </div>

          <div className="pro-guarantee-box">
            <h4 className="pro-guarantee-title">
              <i className="fas fa-shield-alt mr-1"></i> 100% Direct Marketplace
            </h4>
            <p className="pro-guarantee-desc">
              Independent professionals keep 100% of their agreed quotation price with zero middleman deductions. Quote competitively and build direct customer relationships.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
