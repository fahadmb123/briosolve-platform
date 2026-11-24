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
  const [searchQuery, setSearchQuery] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
  const [selectedBookingForReview, setSelectedBookingForReview] = useState<BookingItem | null>(null);

  const {
    data: completedBookingsData,
    isLoading: isBookingsLoading,
    isError: isBookingsError,
    refetch: refetchBookings
  } = useGetCustomerBookings({ status: "COMPLETED", limit: 50 });

  const {
    data: reviewsData,
    isLoading: isReviewsLoading,
    isError: isReviewsError,
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
    return list.filter((b) => !b.isReviewed && !reviewedBookingIds.has(b.id));
  }, [completedBookingsData, reviewedBookingIds]);

  const averageRating = useMemo(() => {
    if (myReviews.length === 0) return null;
    const sum = myReviews.reduce((acc, r) => acc + Number(r.rating || 0), 0);
    return Number((sum / myReviews.length).toFixed(1));
  }, [myReviews]);

  const filteredPendingBookings = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    if (!term) return pendingBookings;
    return pendingBookings.filter((b) => {
      return (
        (b.providerName && b.providerName.toLowerCase().includes(term)) ||
        (b.providerBusinessName && b.providerBusinessName.toLowerCase().includes(term)) ||
        (b.serviceRequestTitle && b.serviceRequestTitle.toLowerCase().includes(term)) ||
        (b.categoryName && b.categoryName.toLowerCase().includes(term)) ||
        b.bookingNumber.toLowerCase().includes(term)
      );
    });
  }, [pendingBookings, searchQuery]);

  const filteredReviews = useMemo(() => {
    const term = searchQuery.trim().toLowerCase();
    return myReviews.filter((r) => {
      if (ratingFilter !== "ALL") {
        if (ratingFilter === 2) {
          if (r.rating > 2) return false;
        } else if (r.rating !== ratingFilter) {
          return false;
        }
      }
      if (!term) return true;
      return (
        (r.providerName && r.providerName.toLowerCase().includes(term)) ||
        (r.providerBusinessName && r.providerBusinessName.toLowerCase().includes(term)) ||
        (r.serviceTitle && r.serviceTitle.toLowerCase().includes(term)) ||
        (r.title && r.title.toLowerCase().includes(term)) ||
        r.comment.toLowerCase().includes(term) ||
        (r.bookingNumber && r.bookingNumber.toLowerCase().includes(term))
      );
    });
  }, [myReviews, searchQuery, ratingFilter]);

  const handleReviewSuccess = () => {
    refetchBookings();
    refetchReviews();
    setActiveTab("reviewed");
  };

  const handleResetFilters = () => {
    setSearchQuery("");
    setRatingFilter("ALL");
  };

  const isLoading = isBookingsLoading || isReviewsLoading;
  const hasError = isBookingsError || isReviewsError;
  const isFiltered = Boolean(searchQuery.trim()) || (activeTab === "reviewed" && ratingFilter !== "ALL");

  return (
    <div className="crv-page">
      <div className="crv-hero">
        <div className="crv-hero-left">
          <div className="crv-breadcrumb">
            <span className="crv-role-badge">
              <i className="fas fa-star" /> Customer Portal
            </span>
            <span className="sep">/</span>
            <span className="active">Reviews</span>
          </div>
          <h1 className="crv-title">Service Reviews</h1>
          <p className="crv-subtitle">
            Rate completed services and manage the feedback you have shared with specialists.
          </p>
        </div>

        <div className="crv-stats-row">
          <div className="crv-stat-card pending">
            <div className="crv-stat-icon">
              <i className="fas fa-hourglass-half" />
            </div>
            <div className="crv-stat-body">
              <span className="crv-stat-num">{pendingBookings.length}</span>
              <span className="crv-stat-label">To Review</span>
            </div>
          </div>

          <div className="crv-stat-card submitted">
            <div className="crv-stat-icon">
              <i className="fas fa-check-circle" />
            </div>
            <div className="crv-stat-body">
              <span className="crv-stat-num">{myReviews.length}</span>
              <span className="crv-stat-label">Submitted</span>
            </div>
          </div>

          <div className="crv-stat-card rating">
            <div className="crv-stat-icon">
              <i className="fas fa-star" />
            </div>
            <div className="crv-stat-body">
              <span className="crv-stat-num">{averageRating != null ? averageRating.toFixed(1) : "—"}</span>
              <span className="crv-stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="crv-toolbar">
        <div className="crv-tabs-bar" role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "pending"}
            className={`crv-tab-btn ${activeTab === "pending" ? "active" : ""}`}
            onClick={() => setActiveTab("pending")}
          >
            <i className="fas fa-clock" />
            <span>To Review</span>
            <span className="crv-tab-count">{pendingBookings.length}</span>
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "reviewed"}
            className={`crv-tab-btn ${activeTab === "reviewed" ? "active" : ""}`}
            onClick={() => setActiveTab("reviewed")}
          >
            <i className="fas fa-check-circle" />
            <span>My Reviews</span>
            <span className="crv-tab-count">{myReviews.length}</span>
          </button>
        </div>

        <div className="crv-controls">
          {activeTab === "reviewed" && (
            <div className="crv-filter-pills">
              {(
                [
                  { value: "ALL", label: "All" },
                  { value: 5, label: "5 ★" },
                  { value: 4, label: "4 ★" },
                  { value: 3, label: "3 ★" },
                  { value: 2, label: "1-2 ★" }
                ] as const
              ).map((item) => (
                <button
                  key={String(item.value)}
                  type="button"
                  className={`crv-filter-pill ${ratingFilter === item.value ? "active" : ""}`}
                  onClick={() => setRatingFilter(item.value)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <div className="crv-search-box">
            <i className="fas fa-search crv-search-icon" />
            <input
              type="text"
              className="crv-search-input"
              placeholder="Search specialist, service or #booking..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="crv-search-clear"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
              >
                <i className="fas fa-times" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="crv-content">
        {isLoading ? (
          <div className="crv-cards-grid" aria-hidden="true">
            {[1, 2, 3].map((item) => (
              <div key={item} className="crv-pending-card crv-skeleton-card">
                <div className="crv-pending-card-top">
                  <div className="crv-sk-shimmer crv-sk-badge" />
                  <div className="crv-sk-shimmer crv-sk-date" />
                </div>
                <div className="crv-pending-main">
                  <div className="crv-sk-shimmer crv-sk-avatar" />
                  <div className="crv-pending-info" style={{ flex: 1, gap: "8px" }}>
                    <div className="crv-sk-shimmer crv-sk-title" />
                    <div className="crv-sk-shimmer crv-sk-subtitle" />
                  </div>
                </div>
                <div className="crv-pending-footer">
                  <div className="crv-sk-shimmer crv-sk-btn" />
                  <div className="crv-sk-shimmer crv-sk-btn" />
                </div>
              </div>
            ))}
          </div>
        ) : hasError ? (
          <div className="crv-error-card">
            <div className="crv-error-icon">
              <i className="fas fa-exclamation-triangle" />
            </div>
            <h3 className="crv-error-title">Unable to Load Reviews</h3>
            <p className="crv-error-desc">
              We encountered a problem retrieving your completed bookings and reviews. Please try again.
            </p>
            <button
              type="button"
              className="crv-retry-btn"
              onClick={() => {
                refetchBookings();
                refetchReviews();
              }}
            >
              <i className="fas fa-redo" />
              <span>Retry</span>
            </button>
          </div>
        ) : activeTab === "pending" ? (
          filteredPendingBookings.length === 0 ? (
            <div className="crv-empty-card">
              <div className="crv-empty-icon">
                <i className={isFiltered ? "fas fa-search" : "fas fa-award"} />
              </div>
              <h3 className="crv-empty-title">
                {isFiltered ? "No Matching Bookings Found" : "All Caught Up!"}
              </h3>
              <p className="crv-empty-desc">
                {isFiltered
                  ? "No pending reviews match your current search. Try clearing the search filter."
                  : "You have no completed bookings waiting for review. Once a specialist completes your booking, you can rate them here."}
              </p>
              {isFiltered ? (
                <button type="button" className="crv-empty-btn secondary" onClick={handleResetFilters}>
                  <i className="fas fa-times-circle" />
                  <span>Clear Search</span>
                </button>
              ) : (
                <button type="button" className="crv-empty-btn" onClick={() => navigate("/bookings")}>
                  <i className="fas fa-calendar-alt" />
                  <span>View All Bookings</span>
                </button>
              )}
            </div>
          ) : (
            <div className="crv-cards-grid">
              {filteredPendingBookings.map((booking) => {
                const displayName = booking.providerName || booking.providerBusinessName || "Service Specialist";
                const showBusinessSub =
                  Boolean(booking.providerName && booking.providerBusinessName && booking.providerName !== booking.providerBusinessName);
                const completedDate = new Date(booking.updatedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric"
                });
                const avatarSrc =
                  booking.providerAvatar ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FF7900&color=fff&size=120&bold=true`;

                return (
                  <div key={booking.id} className="crv-pending-card">
                    <div className="crv-pending-card-top">
                      <span className="crv-pending-bk-badge">
                        Booking #{booking.bookingNumber}
                      </span>
                      <span className="crv-pending-date">
                        <i className="far fa-calendar-check" /> {completedDate}
                      </span>
                    </div>

                    <div className="crv-pending-main">
                      <img
                        src={avatarSrc}
                        alt={displayName}
                        className="crv-pending-avatar-img"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=FF7900&color=fff&size=120&bold=true`;
                        }}
                      />
                      <div className="crv-pending-info">
                        <h3 className="crv-pending-provider" title={displayName}>
                          {displayName}
                        </h3>
                        {showBusinessSub && (
                          <span className="crv-pending-business" title={booking.providerBusinessName || undefined}>
                            <i className="fas fa-building" /> {booking.providerBusinessName}
                          </span>
                        )}
                        <p className="crv-pending-service" title={booking.serviceRequestTitle || booking.categoryName || undefined}>
                          <i className="fas fa-tools" /> {booking.serviceRequestTitle || booking.categoryName || "Specialist Service"}
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
        ) : filteredReviews.length === 0 ? (
          <div className="crv-empty-card">
            <div className="crv-empty-icon">
              <i className={isFiltered ? "fas fa-filter" : "fas fa-comment-dots"} />
            </div>
            <h3 className="crv-empty-title">
              {isFiltered ? "No Matching Reviews" : "No Reviews Submitted Yet"}
            </h3>
            <p className="crv-empty-desc">
              {isFiltered
                ? "No reviews match your current search or rating filter."
                : "You haven't posted any reviews yet. Check the \"To Review\" tab to rate your recently completed services."}
            </p>
            {isFiltered ? (
              <button type="button" className="crv-empty-btn secondary" onClick={handleResetFilters}>
                <i className="fas fa-times-circle" />
                <span>Reset Filters</span>
              </button>
            ) : pendingBookings.length > 0 ? (
              <button type="button" className="crv-empty-btn" onClick={() => setActiveTab("pending")}>
                <i className="fas fa-star" />
                <span>Review Completed Bookings ({pendingBookings.length})</span>
              </button>
            ) : (
              <button type="button" className="crv-empty-btn" onClick={() => navigate("/bookings")}>
                <i className="fas fa-calendar-alt" />
                <span>View All Bookings</span>
              </button>
            )}
          </div>
        ) : (
          <div className="crv-reviewed-grid">
            {filteredReviews.map((review) => {
              const specialistName = review.providerName || review.providerBusinessName || "Service Specialist";
              const targetProviderId = review.providerUserId || review.providerId;
              const avatarSrc =
                review.providerAvatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(specialistName)}&background=FF7900&color=fff&size=120&bold=true`;

              return (
                <div key={review.id} className="crv-submitted-card">
                  <div className="crv-submitted-header">
                    <div
                      className="crv-submitted-provider"
                      onClick={() =>
                        targetProviderId &&
                        navigate(`/nearby-providers/${targetProviderId}`, {
                          state: { returnUrl: "/reviews", from: "reviews" }
                        })
                      }
                      style={{ cursor: targetProviderId ? "pointer" : "default" }}
                    >
                      <img
                        src={avatarSrc}
                        alt={specialistName}
                        className="crv-submitted-avatar"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(specialistName)}&background=FF7900&color=fff&size=120&bold=true`;
                        }}
                      />
                      <div className="crv-submitted-meta">
                        <span className="crv-submitted-name" title={specialistName}>
                          {specialistName}
                        </span>
                        {review.serviceTitle && (
                          <span className="crv-submitted-service" title={review.serviceTitle}>
                            {review.serviceTitle}
                          </span>
                        )}
                      </div>
                    </div>

                    {review.bookingNumber && (
                      <button
                        type="button"
                        className="crv-submitted-bk-link"
                        onClick={() => navigate(`/bookings/${review.bookingId}`)}
                      >
                        <span>#{review.bookingNumber}</span>
                        <i className="fas fa-arrow-right" />
                      </button>
                    )}
                  </div>

                  <div className="crv-submitted-body">
                    <BookingReviewCard review={review} variant="embedded" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {selectedBookingForReview && (
        <ReviewModal
          isOpen={Boolean(selectedBookingForReview)}
          onClose={() => setSelectedBookingForReview(null)}
          bookingId={selectedBookingForReview.id}
          bookingNumber={selectedBookingForReview.bookingNumber}
          providerName={selectedBookingForReview.providerName || selectedBookingForReview.providerBusinessName}
          serviceTitle={selectedBookingForReview.serviceRequestTitle || selectedBookingForReview.categoryName}
          onSuccess={handleReviewSuccess}
        />
      )}
    </div>
  );
};

export default CustomerReviewsPage;
