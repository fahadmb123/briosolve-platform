import React, { useState, useEffect } from "react";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import { useGetAdminBookings } from "../../hooks/useAdminBookings";
import { AdminBookingDetailModal } from "../../components/AdminBookingDetailModal/AdminBookingDetailModal";
import type { AdminBookingItem } from "../../types/booking.types";
import "./AdminBookingsPage.css";

export const AdminBookingsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(handler);
  }, [search]);

  const { data: response, isLoading } = useGetAdminBookings({
    page,
    limit,
    search: debouncedSearch || undefined,
    status: statusFilter || undefined,
    paymentStatus: paymentStatusFilter || undefined
  });

  const bookings = response?.data?.bookings || [];
  const total = response?.data?.total || 0;
  const totalPages = response?.data?.totalPages || 1;
  const stats = response?.data?.stats;

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "COMPLETED":
      case "CLOSED":
        return <span className="badge badge-verified">{status.replace("_", " ")}</span>;
      case "IN_PROGRESS":
      case "EN_ROUTE":
      case "INSPECTION":
        return <span className="badge badge-pending">{status.replace("_", " ")}</span>;
      case "CANCELLED":
        return <span className="badge badge-danger-alert">{status}</span>;
      default:
        return <span className="badge badge-admin">{status.replace("_", " ")}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="badge badge-verified">PAID</span>;
      case "ADVANCE_PAID":
        return <span className="badge badge-pending">ADVANCE PAID</span>;
      case "REFUNDED":
        return <span className="badge badge-danger-alert">REFUNDED</span>;
      default:
        return <span className="badge badge-admin">{status}</span>;
    }
  };

  return (
    <div className="app-content">
      <div className="flex justify-between items-center flex-wrap gap-4 mb-4">
        <div>
          <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: "2rem" }}>
            Bookings Management
          </h1>
          <p className="text-secondary text-sm mb-0">
            Monitor marketplace bookings, service milestones, payment escrow, and fulfillment statuses.
          </p>
        </div>
      </div>

      <div className="admin-kpi-grid">
        <div className="admin-kpi-card">
          <div className="admin-kpi-icon bg-primary-light text-primary">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div>
            <div className="admin-kpi-val">{stats?.total ?? total}</div>
            <div className="admin-kpi-lbl">Total Bookings</div>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon bg-warning-light text-warning">
            <i className="fas fa-tools"></i>
          </div>
          <div>
            <div className="admin-kpi-val">{stats?.inProgress ?? 0}</div>
            <div className="admin-kpi-lbl">In Progress</div>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon bg-success-light text-success">
            <i className="fas fa-award"></i>
          </div>
          <div>
            <div className="admin-kpi-val">{stats?.completed ?? 0}</div>
            <div className="admin-kpi-lbl">Completed</div>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon bg-danger-light text-danger">
            <i className="fas fa-ban"></i>
          </div>
          <div>
            <div className="admin-kpi-val">{stats?.cancelled ?? 0}</div>
            <div className="admin-kpi-lbl">Cancelled</div>
          </div>
        </div>

        <div className="admin-kpi-card">
          <div className="admin-kpi-icon bg-info-light text-info">
            <i className="fas fa-coins"></i>
          </div>
          <div>
            <div className="admin-kpi-val">
              ₹{Number(stats?.totalPlatformFees ?? 0).toLocaleString("en-IN")}
            </div>
            <div className="admin-kpi-lbl">Platform Revenue</div>
          </div>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-input">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search booking #, customer, provider..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filters-group">
          <select
            className="admin-select"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Statuses</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="EN_ROUTE">En Route</option>
            <option value="INSPECTION">Inspection</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PAYMENT_PENDING">Payment Pending</option>
            <option value="COMPLETED">Completed</option>
            <option value="CLOSED">Closed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          <select
            className="admin-select"
            value={paymentStatusFilter}
            onChange={(e) => {
              setPaymentStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Payments</option>
            <option value="ADVANCE_PAID">Advance Paid</option>
            <option value="PAID">Fully Paid</option>
            <option value="PENDING">Pending</option>
            <option value="REFUNDED">Refunded</option>
          </select>

          <button className="btn btn-secondary text-xs py-2" onClick={handleResetFilters}>
            <i className="fas fa-undo mr-1"></i>Reset
          </button>
        </div>
      </div>

      <div className="admin-table-card admin-booking-table-card">
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "16%" }}>Booking Ref</th>
                <th style={{ width: "18%" }}>Customer</th>
                <th style={{ width: "18%" }}>Provider</th>
                <th style={{ width: "18%" }}>Service & Schedule</th>
                <th style={{ width: "14%" }}>Amounts</th>
                <th style={{ width: "10%" }}>Status</th>
                <th className="text-right" style={{ width: "6%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={`skel-${idx}`}>
                    <td>
                      <div className="admin-skel-line" style={{ width: "70%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "40%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "60%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "40%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "60%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "35%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "80%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "50%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "60%", height: "16px", marginBottom: "6px" }}></div>
                      <div className="admin-skel-line" style={{ width: "40%", height: "12px" }}></div>
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "70px", height: "20px", borderRadius: "12px" }}></div>
                    </td>
                    <td className="text-right">
                      <div className="admin-skel-line ml-auto" style={{ width: "32px", height: "32px", borderRadius: "6px" }}></div>
                    </td>
                  </tr>
                ))
              ) : bookings.length === 0 ? (
                <tr>
                  <td colSpan={7} className="admin-empty-ticket-cell">
                    <div className="admin-empty-ticket-box">
                      <img
                        src="/images/admin-no-data.png"
                        alt="No Bookings"
                        className="admin-empty-ticket-img"
                        onError={(e) => {
                          e.currentTarget.src = "https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png";
                        }}
                      />
                      <h3 className="font-semibold text-base mb-1 text-text">No Bookings Found</h3>
                      <p className="text-secondary text-xs mb-0">
                        There are no bookings matching your search query or filters.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                bookings.map((b) => (
                  <tr key={b.id}>
                    <td>
                      <strong className="text-sm font-semibold block">#{b.bookingNumber}</strong>
                      <span className="text-xs text-secondary block mt-0.5">
                        {new Date(b.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </td>
                    <td>
                      <strong className="text-sm block">{b.customerName || "Customer"}</strong>
                      {b.customerEmail && (
                        <span className="text-xs text-secondary block truncate" style={{ maxWidth: "160px" }}>
                          {b.customerEmail}
                        </span>
                      )}
                      {b.customerPhone && (
                        <span className="text-xs text-secondary block">{b.customerPhone}</span>
                      )}
                    </td>
                    <td>
                      <strong className="text-sm block">
                        {b.providerBusinessName || b.providerName || "Assigned Provider"}
                      </strong>
                      {b.providerEmail && (
                        <span className="text-xs text-secondary block truncate" style={{ maxWidth: "160px" }}>
                          {b.providerEmail}
                        </span>
                      )}
                      {b.providerPhone && (
                        <span className="text-xs text-secondary block">{b.providerPhone}</span>
                      )}
                    </td>
                    <td>
                      <div className="text-sm font-medium">{b.serviceRequestTitle || "Service Requirement"}</div>
                      <span className="text-xs text-secondary block mt-0.5">
                        <i className="fas fa-calendar-alt mr-1"></i>
                        {b.scheduledDate
                          ? new Date(b.scheduledDate).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short"
                            })
                          : "Flexible"}
                        {b.scheduledTime ? ` · ${b.scheduledTime}` : ""}
                      </span>
                    </td>
                    <td>
                      <div className="admin-booking-amount-box">
                        <div className="admin-booking-price-tag">
                          ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                        </div>
                        <div className="admin-booking-fee-tag">
                          Fee: ₹{Number(b.platformFee).toLocaleString("en-IN")}
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-booking-badge-stack">
                        {getStatusBadge(b.status)}
                        {getPaymentStatusBadge(b.paymentStatus)}
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        className="btn-icon"
                        title="Inspect Booking"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <i className="fas fa-eye text-primary"></i>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!isLoading && totalPages > 1 && (
        <div className="mt-4">
          <AdminPagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}

      <AdminBookingDetailModal
        booking={selectedBooking}
        isOpen={Boolean(selectedBooking)}
        onClose={() => setSelectedBooking(null)}
      />
    </div>
  );
};

export default AdminBookingsPage;
