import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetProviderBookings, useUpdateBookingStatus } from "../../hooks/useBookingMutations";
import type { BookingItem, BookingStatus, BookingFilterTab } from "../../types/booking.types";
import {
  BookingCard,
  BookingCardSkeleton,
  BookingDetailsModal,
  BookingStatusModal
} from "../../components";
import "./ProviderBookings.css";

export const ProviderBookings: React.FC = () => {
  const navigate = useNavigate();
  const { data: responseData, isLoading, error, refetch } = useGetProviderBookings();
  const updateStatusMutation = useUpdateBookingStatus();

  const [activeTab, setActiveTab] = useState<BookingFilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [statusModalBooking, setStatusModalBooking] = useState<BookingItem | null>(null);
  const [targetStatus, setTargetStatus] = useState<BookingStatus | null>(null);

  const bookings: BookingItem[] = responseData?.data?.bookings || [];

  const counts = useMemo(() => {
    return {
      ALL: bookings.length,
      CONFIRMED: bookings.filter((b) => b.status === "CONFIRMED").length,
      IN_PROGRESS: bookings.filter((b) => b.status === "IN_PROGRESS").length,
      COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
      CANCELLED: bookings.filter((b) => b.status === "CANCELLED").length
    };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      const matchTab = activeTab === "ALL" || item.status === activeTab;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        (item.bookingNumber && item.bookingNumber.toLowerCase().includes(q)) ||
        (item.serviceRequestTitle && item.serviceRequestTitle.toLowerCase().includes(q)) ||
        (item.customerName && item.customerName.toLowerCase().includes(q));

      return matchTab && matchSearch;
    });
  }, [bookings, activeTab, searchQuery]);

  const handleOpenDetails = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedBooking(null);
  };

  const handleChat = (booking: BookingItem) => {
    navigate(`/provider/messages?recipientId=${booking.customerId}`, {
      state: {
        recipientId: booking.customerId,
        recipientName: booking.customerName || "Customer",
        requestId: booking.serviceRequestId,
        requestTitle: booking.serviceRequestTitle || "Service Job"
      }
    });
  };

  const handleRequestStatusChange = (booking: BookingItem, newStatus: BookingStatus) => {
    setStatusModalBooking(booking);
    setTargetStatus(newStatus);
  };

  const handleCloseStatusModal = () => {
    setStatusModalBooking(null);
    setTargetStatus(null);
  };

  const handleConfirmStatusChange = (
    booking: BookingItem,
    newStatus: BookingStatus,
    notes?: string
  ) => {
    updateStatusMutation.mutate(
      {
        id: booking.id,
        payload: {
          status: newStatus,
          notes
        }
      },
      {
        onSuccess: () => {
          toast.success(
            newStatus === "IN_PROGRESS"
              ? "Job marked as In Progress"
              : newStatus === "COMPLETED"
              ? "Job marked as Completed"
              : "Booking status updated"
          );
          handleCloseStatusModal();
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message || err?.message || "Failed to update booking status"
          );
        }
      }
    );
  };

  return (
    <div className="provbk-page-container">
      <div className="provbk-hero-section">
        <div className="provbk-hero-content">
          <div className="provbk-breadcrumb">
            <span>Provider Portal</span>
            <span className="sep">/</span>
            <span className="active">Bookings</span>
          </div>
          <h1 className="provbk-title">Booked Jobs & Schedule</h1>
          <p className="provbk-subtitle">
            Manage your awarded jobs, service timelines, client locations, and track job execution.
          </p>
        </div>
      </div>

      <div className="provbk-toolbar">
        <div className="provbk-search-box">
          <i className="fas fa-search provbk-search-icon"></i>
          <input
            type="text"
            className="provbk-search-input"
            placeholder="Search by booking #, requirement title, or customer name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="provbk-search-clear"
              onClick={() => setSearchQuery("")}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="provbk-tabs-bar">
          <button
            type="button"
            className={`provbk-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            <span>All Bookings</span>
            <span className="provbk-tab-count">{counts.ALL}</span>
          </button>

          <button
            type="button"
            className={`provbk-tab-btn ${activeTab === "CONFIRMED" ? "active" : ""}`}
            onClick={() => setActiveTab("CONFIRMED")}
          >
            <span>Confirmed</span>
            <span className="provbk-tab-count">{counts.CONFIRMED}</span>
          </button>

          <button
            type="button"
            className={`provbk-tab-btn ${activeTab === "IN_PROGRESS" ? "active" : ""}`}
            onClick={() => setActiveTab("IN_PROGRESS")}
          >
            <span>In Progress</span>
            <span className="provbk-tab-count">{counts.IN_PROGRESS}</span>
          </button>

          <button
            type="button"
            className={`provbk-tab-btn ${activeTab === "COMPLETED" ? "active" : ""}`}
            onClick={() => setActiveTab("COMPLETED")}
          >
            <span>Completed</span>
            <span className="provbk-tab-count">{counts.COMPLETED}</span>
          </button>

          <button
            type="button"
            className={`provbk-tab-btn ${activeTab === "CANCELLED" ? "active" : ""}`}
            onClick={() => setActiveTab("CANCELLED")}
          >
            <span>Cancelled</span>
            <span className="provbk-tab-count">{counts.CANCELLED}</span>
          </button>
        </div>
      </div>

      <div className="provbk-content-area">
        {isLoading ? (
          <div className="provbk-cards-stack">
            {Array.from({ length: 3 }).map((_, idx) => (
              <BookingCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="provbk-error-state">
            <i className="fas fa-exclamation-triangle provbk-error-icon"></i>
            <h3>Unable to load bookings</h3>
            <p>We encountered an issue fetching your job bookings. Please try again.</p>
            <button
              type="button"
              className="provbk-btn-retry"
              onClick={() => {
                refetch();
                toast.success("Refreshing bookings...");
              }}
            >
              <i className="fas fa-sync-alt"></i>
              <span>Retry</span>
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="provbk-empty-state">
            <div className="provbk-empty-icon">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3 className="provbk-empty-title">
              {searchQuery
                ? "No matching bookings found"
                : activeTab === "ALL"
                ? "No booked jobs yet"
                : `No ${activeTab.toLowerCase().replace("_", " ")} bookings`}
            </h3>
            <p className="provbk-empty-desc">
              {searchQuery
                ? "Try adjusting your search query or clear the filter."
                : "When customers accept your price quotes and complete payment, your awarded jobs appear here."}
            </p>
            {activeTab !== "ALL" || searchQuery ? (
              <button
                type="button"
                className="provbk-btn-primary"
                onClick={() => {
                  setActiveTab("ALL");
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </button>
            ) : (
              <button
                type="button"
                className="provbk-btn-primary"
                onClick={() => navigate("/provider/service-requests")}
              >
                <i className="fas fa-bolt"></i>
                <span>Explore Service Leads</span>
              </button>
            )}
          </div>
        ) : (
          <div className="provbk-cards-stack">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                role="PROVIDER"
                onViewDetails={handleOpenDetails}
                onChat={handleChat}
                onUpdateStatus={handleRequestStatusChange}
              />
            ))}
          </div>
        )}
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsOpen}
        role="PROVIDER"
        onClose={handleCloseDetails}
        onChat={handleChat}
        onUpdateStatus={handleRequestStatusChange}
      />

      <BookingStatusModal
        booking={statusModalBooking}
        targetStatus={targetStatus}
        isOpen={Boolean(statusModalBooking && targetStatus)}
        isLoading={updateStatusMutation.isPending}
        onClose={handleCloseStatusModal}
        onConfirm={handleConfirmStatusChange}
      />
    </div>
  );
};

export default ProviderBookings;
