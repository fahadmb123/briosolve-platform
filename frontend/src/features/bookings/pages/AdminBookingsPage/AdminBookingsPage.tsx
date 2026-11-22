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
        return <span className="badge badge-confirmed text-xs">Confirmed</span>;
      case "EN_ROUTE":
      case "INSPECTION":
      case "IN_PROGRESS":
        return <span className="badge badge-pending text-xs">{status.replace("_", " ")}</span>;
      case "PAYMENT_PENDING":
        return <span className="badge badge-pending text-xs">Payment Pending</span>;
      case "COMPLETED":
        return <span className="badge badge-verified text-xs">Completed</span>;
      case "CLOSED":
        return <span className="badge badge-neutral text-xs">Closed</span>;
      case "CANCELLED":
        return <span className="badge badge-danger-alert text-xs">Cancelled</span>;
      default:
        return <span className="badge badge-neutral text-xs">{status.replace("_", " ")}</span>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case "PAID":
        return <span className="badge badge-verified text-xs mt-1">Paid</span>;
      case "ADVANCE_PAID":
        return <span className="badge badge-advance text-xs mt-1">Advance Paid</span>;
      case "REFUNDED":
        return <span className="badge badge-danger-alert text-xs mt-1">Refunded</span>;
      default:
        return <span className="badge badge-neutral text-xs mt-1">Pending</span>;
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

      <div className="admin-table-card" style={{ position: "relative", overflow: "hidden" }}>
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "14%" }}>Booking Ref</th>
                <th style={{ width: "17%" }}>Customer</th>
                <th style={{ width: "19%" }}>Provider</th>
                <th style={{ width: "19%" }}>Service & Schedule</th>
                <th style={{ width: "11%" }}>Amounts</th>
                <th style={{ width: "11%" }}>Status</th>
                <th className="text-right" style={{ width: "9%" }}>Action</th>
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
                      <div className="admin-skel-line" style={{ width: "70px", height: "20px", borderRadius: "4px" }}></div>
                      <div className="admin-skel-line mt-1" style={{ width: "60px", height: "18px", borderRadius: "4px" }}></div>
                    </td>
                    <td className="text-right">
                      <div className="admin-skel-line ml-auto" style={{ width: "75px", height: "28px", borderRadius: "6px" }}></div>
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
                      {(b.customerPhone || b.customerEmail) && (
                        <span
                          className="text-xs text-secondary block truncate"
                          style={{ maxWidth: "160px" }}
                          title={b.customerEmail || b.customerPhone || ""}
                        >
                          {b.customerPhone || b.customerEmail}
                        </span>
                      )}
                    </td>
                    <td>
                      <strong
                        className="text-sm block truncate"
                        style={{ maxWidth: "180px" }}
                        title={b.providerBusinessName || b.providerName || "Assigned Provider"}
                      >
                        {b.providerBusinessName || b.providerName || "Assigned Provider"}
                      </strong>
                      {(b.providerPhone || b.providerEmail) && (
                        <span
                          className="text-xs text-secondary block truncate"
                          style={{ maxWidth: "180px" }}
                          title={b.providerEmail || b.providerPhone || ""}
                        >
                          {b.providerPhone || b.providerEmail}
                        </span>
                      )}
                    </td>
                    <td>
                      <strong
                        className="text-sm block truncate"
                        style={{ maxWidth: "190px" }}
                        title={b.serviceRequestTitle || "Service Requirement"}
                      >
                        {b.serviceRequestTitle || "Service Requirement"}
                      </strong>
                      <span className="text-xs text-secondary block mt-0.5">
                        <i className="far fa-calendar-alt mr-1"></i>
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
                      <strong className="text-sm block">
                        ₹{Number(b.totalAmount).toLocaleString("en-IN")}
                      </strong>
                      <span className="text-xs text-secondary block mt-0.5">
                        Fee: ₹{Number(b.platformFee).toLocaleString("en-IN")}
                      </span>
                    </td>
                    <td>
                      <div className="flex flex-col items-start">
                        {getStatusBadge(b.status)}
                        {getPaymentStatusBadge(b.paymentStatus)}
                      </div>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn btn-secondary text-xs py-1.5 px-3"
                        title="Inspect Booking Details"
                        onClick={() => setSelectedBooking(b)}
                      >
                        <i className="fas fa-eye mr-1"></i>
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
