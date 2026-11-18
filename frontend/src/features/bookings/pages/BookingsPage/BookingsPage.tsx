import React, { useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import {
  useGetCustomerBookings,
  useGetProviderBookings,
  useUpdateBookingStatus
} from "../../hooks/useBookingMutations";
import type { BookingItem, BookingStatus, BookingFilterTab } from "../../types/booking.types";
import {
  BookingCard,
  BookingCardSkeleton,
  BookingDetailsModal,
  BookingStatusModal
} from "../../components";
import "./BookingsPage.css";

interface BookingsPageProps {
  role?: "customer" | "provider";
}

export const BookingsPage: React.FC<BookingsPageProps> = ({ role: roleProp }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const role: "customer" | "provider" =
    roleProp || (location.pathname.startsWith("/provider") ? "provider" : "customer");
  const isProvider = role === "provider";

  const customerQuery = useGetCustomerBookings({ enabled: !isProvider });
  const providerQuery = useGetProviderBookings({ enabled: isProvider });
  const updateStatusMutation = useUpdateBookingStatus();

  const { data: responseData, isLoading, error, refetch } = isProvider
    ? providerQuery
    : customerQuery;

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
        (item.categoryName && item.categoryName.toLowerCase().includes(q)) ||
        (!isProvider && item.providerBusinessName && item.providerBusinessName.toLowerCase().includes(q)) ||
        (!isProvider && item.providerName && item.providerName.toLowerCase().includes(q)) ||
        (isProvider && item.customerName && item.customerName.toLowerCase().includes(q));

      return matchTab && matchSearch;
    });
  }, [bookings, activeTab, searchQuery, isProvider]);

  const handleOpenDetails = (booking: BookingItem) => {
    setSelectedBooking(booking);
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
    setSelectedBooking(null);
  };

  const handleChat = (booking: BookingItem) => {
    if (isProvider) {
      navigate(`/provider/messages?recipientId=${booking.customerId}`, {
        state: {
          recipientId: booking.customerId,
          recipientName: booking.customerName || "Customer",
          requestId: booking.serviceRequestId,
          requestTitle: booking.serviceRequestTitle || "Service Job"
        }
      });
    } else {
      navigate(`/messages?recipientId=${booking.providerId}`, {
        state: {
          recipientId: booking.providerId,
          recipientName: booking.providerBusinessName || booking.providerName || "Service Provider",
          requestId: booking.serviceRequestId,
          requestTitle: booking.serviceRequestTitle || "Service Booking"
        }
      });
    }
  };

  const handleViewServiceRequest = (serviceRequestId: string) => {
    if (isProvider) {
      navigate(`/provider/service-requests/${serviceRequestId}`);
    } else {
      navigate(`/my-requests/${serviceRequestId}`);
    }
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

  const cardRole: "CUSTOMER" | "PROVIDER" = isProvider ? "PROVIDER" : "CUSTOMER";

  return (
    <div className={`bk-page-container ${isProvider ? "is-provider" : "is-customer"}`}>
      <div className="bk-hero-section">
        <div className="bk-hero-content">
          <div className="bk-breadcrumb">
            <span className={`bk-role-badge ${isProvider ? "provider" : "customer"}`}>
              {isProvider ? "Provider Portal" : "Customer"}
            </span>
            <span className="sep">/</span>
            <span className="active">Bookings</span>
          </div>
          <h1 className="bk-title">
            {isProvider ? "Booked Jobs & Schedule" : "My Bookings"}
          </h1>
          <p className="bk-subtitle">
            {isProvider
              ? "Manage your awarded jobs, service timelines, client locations, and track job execution."
              : "Track confirmed jobs, service schedules, verified providers, and escrow protected payments."}
          </p>
        </div>
      </div>

      <div className="bk-toolbar">
        <div className="bk-tabs-bar">
          <button
            type="button"
            className={`bk-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            <span>All Bookings</span>
            <span className="bk-tab-count">{counts.ALL}</span>
          </button>

          <button
            type="button"
            className={`bk-tab-btn ${activeTab === "CONFIRMED" ? "active" : ""}`}
            onClick={() => setActiveTab("CONFIRMED")}
          >
            <span>Confirmed</span>
            <span className="bk-tab-count">{counts.CONFIRMED}</span>
          </button>

          <button
            type="button"
            className={`bk-tab-btn ${activeTab === "IN_PROGRESS" ? "active" : ""}`}
            onClick={() => setActiveTab("IN_PROGRESS")}
          >
            <span>In Progress</span>
            <span className="bk-tab-count">{counts.IN_PROGRESS}</span>
          </button>

          <button
            type="button"
            className={`bk-tab-btn ${activeTab === "COMPLETED" ? "active" : ""}`}
            onClick={() => setActiveTab("COMPLETED")}
          >
            <span>Completed</span>
            <span className="bk-tab-count">{counts.COMPLETED}</span>
          </button>

          <button
            type="button"
            className={`bk-tab-btn ${activeTab === "CANCELLED" ? "active" : ""}`}
            onClick={() => setActiveTab("CANCELLED")}
          >
            <span>Cancelled</span>
            <span className="bk-tab-count">{counts.CANCELLED}</span>
          </button>
        </div>

        <div className="bk-search-box">
          <i className="fas fa-search bk-search-icon"></i>
          <input
            type="text"
            className="bk-search-input"
            placeholder={
              isProvider
                ? "Search booking #, title, customer..."
                : "Search booking #, title, provider..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="bk-search-clear"
              onClick={() => setSearchQuery("")}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
      </div>

      <div className="bk-content-area">
        {isLoading ? (
          <div className="bk-cards-stack">
            {Array.from({ length: 3 }).map((_, idx) => (
              <BookingCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="bk-error-state">
            <i className="fas fa-exclamation-triangle bk-error-icon"></i>
            <h3 className="bk-error-title">Failed to load bookings</h3>
            <p className="bk-error-desc">
              Unable to retrieve booking records right now. Please try again.
            </p>
            <button
              type="button"
              className="bk-retry-btn"
              onClick={() => refetch()}
            >
              <i className="fas fa-redo"></i>
              <span>Retry</span>
            </button>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bk-empty-card">
            <div className="bk-empty-icon-wrap">
              <i className="fas fa-calendar-check"></i>
            </div>
            <h3 className="bk-empty-title">
              {searchQuery
                ? "No matching bookings found"
                : activeTab !== "ALL"
                ? `No ${activeTab.toLowerCase().replace("_", " ")} bookings`
                : "No bookings found"}
            </h3>
            <p className="bk-empty-desc">
              {searchQuery
                ? `No booking records match "${searchQuery}". Clear your search query or switch filters.`
                : isProvider
                ? "When customers accept your quotations and complete payment, your confirmed jobs will show up here."
                : "When you accept quotes from service providers and make payments, your active bookings will appear here."}
            </p>
            {searchQuery ? (
              <button
                type="button"
                className="bk-empty-action-btn secondary"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            ) : isProvider ? (
              <button
                type="button"
                className="bk-empty-action-btn"
                onClick={() => navigate("/provider/job-leads")}
              >
                <i className="fas fa-search"></i>
                <span>Find Job Leads</span>
              </button>
            ) : (
              <button
                type="button"
                className="bk-empty-action-btn"
                onClick={() => navigate("/service-catalog")}
              >
                <i className="fas fa-plus"></i>
                <span>Explore Services</span>
              </button>
            )}
          </div>
        ) : (
          <div className="bk-cards-stack">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                role={cardRole}
                onViewDetails={handleOpenDetails}
                onChat={handleChat}
                onViewServiceRequest={handleViewServiceRequest}
                onUpdateStatus={isProvider ? handleRequestStatusChange : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsOpen}
        onClose={handleCloseDetails}
        role={cardRole}
        onChat={handleChat}
        onViewServiceRequest={handleViewServiceRequest}
      />

      {isProvider && (
        <BookingStatusModal
          booking={statusModalBooking}
          targetStatus={targetStatus}
          isOpen={Boolean(statusModalBooking && targetStatus)}
          onClose={handleCloseStatusModal}
          onConfirm={handleConfirmStatusChange}
          isLoading={updateStatusMutation.isPending}
        />
      )}
    </div>
  );
};
