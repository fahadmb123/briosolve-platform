import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useGetCustomerBookings } from "../../../bookings/hooks/useBookingMutations";
import type { BookingItem } from "../../../bookings/types/booking.types";
import { useMyReviewsQuery } from "../../hooks/useReviews";
import { ReviewModal } from "../../components/ReviewModal/ReviewModal";
import { BookingReviewCard } from "../../components/BookingReviewCard/BookingReviewCard";
import type { ReviewItem } from "../../types/review.types";
import "./CustomerReviewsPage.css";

export const CustomerReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"pending" | "reviewed">("pending");
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingItem | null>(null);

  const {
    data: completedBookingsData,
    isLoading: isBookingsLoading,
    refetch: refetchBookings
  } = useGetCustomerBookings({ status: "COMPLETED", limit: 50 });

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    refetch: refetchReviews
  } = useMyReviewsQuery(1, 50);

  const myReviews: ReviewItem[] = useMemo(() => {
    return reviewsData?.data?.reviews || [];
  }, [reviewsData]);

  const reviewedBookingIds = useMemo(() => {
    return new Set(myReviews.map((r) => r.bookingId));
  }, [myReviews]);

  const pendingBookings: BookingItem[] = useMemo(() => {
    const list = completedBookingsData?.data?.bookings || [];
    return list.filter((b) => !reviewedBookingIds.has(b.id));
  }, [completedBookingsData, reviewedBookingIds]);

  const handleReviewSuccess = () => {
    refetchBookings();
    refetchReviews();
    setActiveTab("reviewed");
  };

  const isLoading = isBookingsLoading || isReviewsLoading;

  return (
    <div className="crv-page">
      <div className="crv-header">
        <div className="crv-header-left">
          <div className="crv-header-badge">
            <i className="fas fa-star" />
            <span>Ratings &amp; Feedback</span>
          </div>
          <h1 className="crv-title">Service Reviews</h1>
          <p className="crv-subtitle">
            Share feedback on your completed services and view your submitted reviews.
          </p>
        </div>

        <div className="crv-stats-row">
          <div className="crv-stat-chip">
            <span className="crv-stat-num">{pendingBookings.length}</span>
            <span className="crv-stat-label">To Review</span>
          </div>
          <div className="crv-stat-chip">
            <span className="crv-stat-num">{myReviews.length}</span>
            <span className="crv-stat-label">Submitted</span>
          </div>
        </div>
      </div>

      <div className="crv-tabs-bar">
        <button
          type="button"
          className={`crv-tab-btn ${activeTab === "pending" ? "active" : ""}`}
          onClick={() => setActiveTab("pending")}
        >
          <i className="fas fa-clock" />
          <span>To Review ({pendingBookings.length})</span>
        </button>
        <button
          type="button"
          className={`crv-tab-btn ${activeTab === "reviewed" ? "active" : ""}`}
          onClick={() => setActiveTab("reviewed")}
        >
          <i className="fas fa-check-circle" />
          <span>My Reviews ({myReviews.length})</span>
        </button>
      </div>

      <div className="crv-content">
        {isLoading ? (
          <div className="crv-loading-wrap">
            <i className="fas fa-spinner fa-spin" />
            <span>Loading reviews and completed bookings...</span>
          </div>
        ) : activeTab === "pending" ? (
          pendingBookings.length === 0 ? (
            <div className="crv-empty-card">
              <div className="crv-empty-icon">
                <i className="fas fa-award" />
              </div>
              <h3 className="crv-empty-title">All Caught Up!</h3>
              <p className="crv-empty-desc">
                You have no completed bookings waiting for review. When specialists finish your service requests, you will be able to rate them here.
              </p>
              <button
                type="button"
                className="crv-empty-btn"
                onClick={() => navigate("/bookings")}
              >
                <i className="fas fa-calendar-alt" />
                <span>View All Bookings</span>
              </button>
            </div>
          ) : (
            <div className="crv-cards-grid">
              {pendingBookings.map((booking) => {
                const completedDate = new Date(booking.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                });

                return (
                  <div key={booking.id} className="crv-pending-card">
                    <div className="crv-pending-card-top">
                      <div className="crv-pending-bk-badge">
                        Booking #{booking.bookingNumber}
                      </div>
                      <span className="crv-pending-date">
                        Completed: {completedDate}
                      </span>
                    </div>

                    <div className="crv-pending-main">
                      <div className="crv-pending-avatar">
                        {(booking.providerBusinessName || booking.providerName || "S").charAt(0).toUpperCase()}
                      </div>
                      <div className="crv-pending-info">
                        <h3 className="crv-pending-provider">
                          {booking.providerBusinessName || booking.providerName || "Service Specialist"}
                        </h3>
                        <p className="crv-pending-service">
                          {booking.serviceRequestTitle || booking.categoryName || "Specialist Service"}
                        </p>
                      </div>
                    </div>

                    <div className="crv-pending-footer">
                      <button
                        type="button"
                        className="crv-btn-details"
                        onClick={() => navigate(`/bookings/${booking.id}`)}
                      >
                        <i className="fas fa-info-circle" />
                        <span>Booking Details</span>
                      </button>
                      <button
                        type="button"
                        className="crv-btn-write"
                        onClick={() => setSelectedBookingForReview(booking)}
                      >
                        <i className="fas fa-star" />
                        <span>Write Review</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )
        ) : (
          myReviews.length === 0 ? (
            <div className="crv-empty-card">
              <div className="crv-empty-icon">
                <i className="fas fa-comment-dots" />
              </div>
              <h3 className="crv-empty-title">No Reviews Submitted Yet</h3>
              <p className="crv-empty-desc">
                You haven't posted any reviews yet. Check the "To Review" tab to rate your recently completed services.
              </p>
            </div>
          ) : (
            <div className="crv-reviewed-list">
              {myReviews.map((review) => (
                <div key={review.id} className="crv-reviewed-card-wrap">
                  <div className="crv-reviewed-card-meta">
                    <span className="crv-reviewed-target">
                      <i className="fas fa-user-check" />
                      Specialist: <strong>{review.providerBusinessName || review.providerName || "Provider"}</strong>
                    </span>
                    {review.bookingNumber && (
                      <span className="crv-reviewed-bk">
                        Booking #{review.bookingNumber}
                      </span>
                    )}
                  </div>
                  <BookingReviewCard review={review} />
                </div>
              ))}
            </div>
          )
        )}
      </div>

      {selectedBookingForReview && (
        <ReviewModal
          isOpen={Boolean(selectedBookingForReview)}
          onClose={() => setSelectedBookingForReview(null)}
          bookingId={selectedBookingForReview.id}
          bookingNumber={selectedBookingForReview.bookingNumber}
          providerName={selectedBookingForReview.providerBusinessName || selectedBookingForReview.providerName}
          serviceTitle={selectedBookingForReview.serviceRequestTitle || selectedBookingForReview.categoryName}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};
export default CustomerReviewsPage;
