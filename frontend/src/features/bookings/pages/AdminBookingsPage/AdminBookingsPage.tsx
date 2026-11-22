import React, { useState, useEffect } from "react";
import { useGetAdminBookings } from "../../hooks/useAdminBookings";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import { AdminBookingDetailModal } from "../../components/AdminBookingDetailModal/AdminBookingDetailModal";
import type { AdminBookingItem } from "../../types/booking.types";
import "./AdminBookingsPage.css";

export const AdminBookingsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<AdminBookingItem | null>(null);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(handler);
  }, [search]);

  const { data, isLoading } = useGetAdminBookings({
    page,
    limit: 10,
    search: debouncedSearch.trim() || undefined,
    status: statusFilter || undefined,
    paymentStatus: paymentStatusFilter || undefined
  });

  const bookings = data?.data?.bookings || [];
  const totalPages = data?.data?.totalPages || 1;

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setPaymentStatusFilter("");
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "CONFIRMED":
        return <span className="admin-bk-pill confirmed"><i className="fas fa-check-circle text-xs"></i>Confirmed</span>;
      case "EN_ROUTE":
      case "INSPECTION":
      case "IN_PROGRESS":
        return <span className="admin-bk-pill progress"><i className="fas fa-spinner text-xs"></i>{status.replace("_", " ")}</span>;
      case "PAYMENT_PENDING":
        return <span className="admin-bk-pill progress"><i className="fas fa-clock text-xs"></i>Payment Pending</span>;
      case "COMPLETED":
        return <span className="admin-bk-pill completed"><i className="fas fa-check-double text-xs"></i>Completed</span>;
      case "CLOSED":
        return <span className="admin-bk-pill closed"><i className="fas fa-archive text-xs"></i>Closed</span>;
      case "CANCELLED":
        return <span className="admin-bk-pill cancelled"><i className="fas fa-ban text-xs"></i>Cancelled</span>;
      default:
        return <span className="admin-bk-pill closed">{status.replace("_", " ")}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="admin-bk-pill pay-paid">Paid</span>;
      case "ADVANCE_PAID":
        return <span className="admin-bk-pill pay-advance">Advance Paid</span>;
      case "REFUNDED":
        return <span className="admin-bk-pill pay-refunded">Refunded</span>;
      default:
        return <span className="admin-bk-pill pay-pending">Pending</span>;
    }
  };

  return (
    <div className="admin-bookings-container">
      <div className="admin-bookings-header">
        <h1 className="admin-bookings-title">
          Bookings Management
        </h1>
        <p className="admin-bookings-subtitle">
          Monitor marketplace bookings, service milestones, payment escrow, and fulfillment statuses.
        </p>
      </div>

      <div className="admin-bookings-filter-bar">
        <div className="admin-search-input" style={{ flex: "1 1 280px" }}>
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

      <div className="admin-bookings-table-card">
        <div className="table-responsive">
          <table className="admin-bookings-table">
            <thead>
              <tr>
                <th style={{ width: "16%", minWidth: "150px" }}>Booking Ref</th>
                <th style={{ width: "18%", minWidth: "170px" }}>Customer</th>
                <th style={{ width: "20%", minWidth: "180px" }}>Provider</th>
                <th style={{ width: "20%", minWidth: "180px" }}>Service & Schedule</th>
                <th style={{ width: "12%", minWidth: "110px" }}>Amounts</th>
                <th style={{ width: "14%", minWidth: "130px" }}>Status</th>
                <th className="text-right" style={{ width: "8%", minWidth: "90px" }}>Action</th>
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
                      <div className="admin-skel-line ml-auto" style={{ width: "60px", height: "28px", borderRadius: "6px" }}></div>
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
                      <div className="admin-bk-ref-cell">
                        <span className="admin-bk-ref-code">#{b.bookingNumber}</span>
                        <span className="admin-bk-ref-date">
                          <i className="far fa-clock"></i>
                          {new Date(b.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-bk-user-cell">
                        <div className="admin-bk-avatar customer">
                          <i className="fas fa-user"></i>
                        </div>
                        <div className="admin-bk-user-meta">
                          <span className="admin-bk-user-name" title={b.customerName || "Customer"}>
                            {b.customerName || "Customer"}
                          </span>
                          <span className="admin-bk-user-sub" title={b.customerEmail || b.customerPhone || ""}>
                            {b.customerPhone || b.customerEmail || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-bk-user-cell">
                        <div className="admin-bk-avatar provider">
                          <i className="fas fa-store"></i>
                        </div>
                        <div className="admin-bk-user-meta">
                          <span
                            className="admin-bk-user-name"
                            title={b.providerBusinessName || b.providerName || "Assigned Provider"}
                          >
                            {b.providerBusinessName || b.providerName || "Assigned Provider"}
                          </span>
                          <span className="admin-bk-user-sub" title={b.providerPhone || b.providerEmail || ""}>
                            {b.providerPhone || b.providerEmail || "N/A"}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="admin-bk-service-cell">
                        <span className="admin-bk-service-title" title={b.serviceRequestTitle || "Service Requirement"}>
                          {b.serviceRequestTitle || "Service Requirement"}
                        </span>
                        <span className="admin-bk-schedule-tag">
                          <i className="far fa-calendar-alt"></i>
                          {b.scheduledDate
                            ? new Date(b.scheduledDate).toLocaleDateString("en-IN", {
                                day: "numeric",
                                month: "short"
                              })
                            : "Flexible"}
                          {b.scheduledTime ? ` · ${b.scheduledTime}` : ""}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-bk-amount-cell">
                        <span className="admin-bk-amount-total">
                          ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                        </span>
                        <span className="admin-bk-amount-fee">
                          Fee: ₹{Number(b.platformFee).toLocaleString("en-IN")}
                        </span>
                      </div>
                    </td>
                    <td>
                      <div className="admin-bk-status-stack">
                        {getStatusBadge(b.status)}
                        {getPaymentStatusBadge(b.paymentStatus)}
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="admin-bk-inspect-btn"
                        title="Inspect Booking Details"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <i className="fas fa-eye"></i>
                        <span>Inspect</span>
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
        onBookingUpdated={(updated) => setSelectedBooking(updated)}
      />
    </div>
  );
};

export default AdminBookingsPage;
