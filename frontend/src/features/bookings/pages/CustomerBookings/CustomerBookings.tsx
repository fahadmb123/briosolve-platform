import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGetCustomerBookings } from "../../hooks/useBookingMutations";
import type { BookingItem, BookingFilterTab } from "../../types/booking.types";
import { BookingCard, BookingCardSkeleton, BookingDetailsModal } from "../../components";
import "./CustomerBookings.css";

export const CustomerBookings: React.FC = () => {
  const navigate = useNavigate();
  const { data: responseData, isLoading, error, refetch } = useGetCustomerBookings();

  const [activeTab, setActiveTab] = useState<BookingFilterTab>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<BookingItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

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
        (item.providerBusinessName && item.providerBusinessName.toLowerCase().includes(q)) ||
        (item.providerName && item.providerName.toLowerCase().includes(q));

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
    navigate(`/messages?recipientId=${booking.providerId}`, {
      state: {
        recipientId: booking.providerId,
        recipientName: booking.providerBusinessName || booking.providerName || "Service Provider",
        requestId: booking.serviceRequestId,
        requestTitle: booking.serviceRequestTitle || "Service Booking"
      }
    });
  };

  const handleViewServiceRequest = (serviceRequestId: string) => {
    navigate(`/my-requests/${serviceRequestId}`);
  };

  return (
    <div className="custbk-page-container">
      <div className="custbk-hero-section">
        <div className="custbk-hero-content">
          <div className="custbk-breadcrumb">
            <span>Home</span>
            <span className="sep">/</span>
            <span className="active">Bookings</span>
          </div>
          <h1 className="custbk-title">My Bookings</h1>
          <p className="custbk-subtitle">
            Track confirmed jobs, service schedules, verified providers, and escrow protected payments.
          </p>
        </div>
      </div>

      <div className="custbk-toolbar">
        <div className="custbk-search-box">
          <i className="fas fa-search custbk-search-icon"></i>
          <input
            type="text"
            className="custbk-search-input"
            placeholder="Search by booking #, service title, or provider name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="custbk-search-clear"
              onClick={() => setSearchQuery("")}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>

        <div className="custbk-tabs-bar">
          <button
            type="button"
            className={`custbk-tab-btn ${activeTab === "ALL" ? "active" : ""}`}
            onClick={() => setActiveTab("ALL")}
          >
            <span>All Bookings</span>
            <span className="custbk-tab-count">{counts.ALL}</span>
          </button>

          <button
            type="button"
            className={`custbk-tab-btn ${activeTab === "CONFIRMED" ? "active" : ""}`}
            onClick={() => setActiveTab("CONFIRMED")}
          >
            <span>Confirmed</span>
            <span className="custbk-tab-count">{counts.CONFIRMED}</span>
          </button>

          <button
            type="button"
            className={`custbk-tab-btn ${activeTab === "IN_PROGRESS" ? "active" : ""}`}
            onClick={() => setActiveTab("IN_PROGRESS")}
          >
            <span>In Progress</span>
            <span className="custbk-tab-count">{counts.IN_PROGRESS}</span>
          </button>

          <button
            type="button"
            className={`custbk-tab-btn ${activeTab === "COMPLETED" ? "active" : ""}`}
            onClick={() => setActiveTab("COMPLETED")}
          >
            <span>Completed</span>
            <span className="custbk-tab-count">{counts.COMPLETED}</span>
          </button>

          <button
            type="button"
            className={`custbk-tab-btn ${activeTab === "CANCELLED" ? "active" : ""}`}
            onClick={() => setActiveTab("CANCELLED")}
          >
            <span>Cancelled</span>
            <span className="custbk-tab-count">{counts.CANCELLED}</span>
          </button>
        </div>
      </div>

      <div className="custbk-content-area">
        {isLoading ? (
          <div className="custbk-cards-stack">
            {Array.from({ length: 3 }).map((_, idx) => (
              <BookingCardSkeleton key={idx} />
            ))}
          </div>
        ) : error ? (
          <div className="custbk-error-state">
            <i className="fas fa-exclamation-triangle custbk-error-icon"></i>
            <h3>Unable to load bookings</h3>
            <p>We encountered an issue fetching your service bookings. Please try again.</p>
            <button
              type="button"
              className="custbk-btn-retry"
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
          <div className="custbk-empty-state">
            <div className="custbk-empty-icon">
              <i className="fas fa-calendar-times"></i>
            </div>
            <h3 className="custbk-empty-title">
              {searchQuery
                ? "No matching bookings found"
                : activeTab === "ALL"
                ? "No bookings yet"
                : `No ${activeTab.toLowerCase().replace("_", " ")} bookings`}
            </h3>
            <p className="custbk-empty-desc">
              {searchQuery
                ? "Try adjusting your search criteria or clear your search query."
                : "When you accept a quotation and verify payment, your confirmed booking will appear here."}
            </p>
            {activeTab !== "ALL" || searchQuery ? (
              <button
                type="button"
                className="custbk-btn-primary"
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
                className="custbk-btn-primary"
                onClick={() => navigate("/my-requests")}
              >
                <i className="fas fa-clipboard-list"></i>
                <span>View My Requests</span>
              </button>
            )}
          </div>
        ) : (
          <div className="custbk-cards-stack">
            {filteredBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                role="CUSTOMER"
                onViewDetails={handleOpenDetails}
                onChat={handleChat}
                onViewServiceRequest={handleViewServiceRequest}
              />
            ))}
          </div>
        )}
      </div>

      <BookingDetailsModal
        booking={selectedBooking}
        isOpen={isDetailsOpen}
        role="CUSTOMER"
        onClose={handleCloseDetails}
        onChat={handleChat}
        onViewServiceRequest={handleViewServiceRequest}
      />
    </div>
  );
};

export default CustomerBookings;
