import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMyReviewsQuery } from "../../hooks/useReviews";
import { BookingReviewCard } from "../../components/BookingReviewCard/BookingReviewCard";
import type { ReviewItem } from "../../types/review.types";
import "./CustomerReviewsPage.css";

export const CustomerReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, ratingFilter]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      rating: ratingFilter !== "ALL" ? ratingFilter : undefined,
      page,
      limit
    }),
    [debouncedSearch, ratingFilter, page]
  );

  const {
    data: reviewsData,
    isLoading,
    isError,
    refetch
  } = useMyReviewsQuery(queryParams);

  const payload = reviewsData?.data;
  const myReviews: ReviewItem[] = payload?.reviews || [];
  const totalReviews = payload?.totalReviews ?? payload?.pagination?.total ?? 0;
  const averageRating = payload?.averageRating ?? 0;
  const ratingCounts = payload?.ratingCounts || {};
  const totalPages = payload?.pagination?.totalPages ?? 1;

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setRatingFilter("ALL");
    setPage(1);
  };

  const isFiltered = Boolean(debouncedSearch) || ratingFilter !== "ALL";

  return (
    <div className="crv-page">
      <div className="crv-hero">
        <div className="crv-hero-left">
          <h1 className="crv-title">My Reviews</h1>
          <p className="crv-subtitle">
            View and filter the ratings and feedback you have shared with service specialists.
          </p>
        </div>

        <div className="crv-stats-row">
          <div className="crv-stat-card submitted">
            <div className="crv-stat-icon">
              <i className="fas fa-check-circle" />
            </div>
            <div className="crv-stat-body">
              <span className="crv-stat-num">{totalReviews}</span>
              <span className="crv-stat-label">Total Reviews</span>
            </div>
          </div>

          <div className="crv-stat-card rating">
            <div className="crv-stat-icon">
              <i className="fas fa-star" />
            </div>
            <div className="crv-stat-body">
              <span className="crv-stat-num">
                {totalReviews > 0 ? averageRating.toFixed(1) : "—"}
              </span>
              <span className="crv-stat-label">Avg Rating</span>
            </div>
          </div>
        </div>
      </div>

      <div className="crv-toolbar">
        <div className="crv-filter-pills" role="group" aria-label="Filter by star rating">
          <button
            type="button"
            className={`crv-filter-pill ${ratingFilter === "ALL" ? "active" : ""}`}
            onClick={() => setRatingFilter("ALL")}
          >
            <span>All</span>
            <span className="crv-filter-count">{totalReviews}</span>
          </button>
          {[5, 4, 3, 2, 1].map((star) => (
            <button
              key={star}
              type="button"
              className={`crv-filter-pill ${ratingFilter === star ? "active" : ""}`}
              onClick={() => setRatingFilter(star)}
            >
              <span>{star} ★</span>
              <span className="crv-filter-count">{ratingCounts[star] ?? 0}</span>
            </button>
          ))}
        </div>

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

      <div className="crv-content">
        {isLoading ? (
          <div className="crv-reviewed-grid" aria-hidden="true">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="crv-submitted-card crv-skeleton-card">
                <div className="crv-submitted-header">
                  <div className="crv-submitted-provider">
                    <div className="crv-sk-shimmer crv-sk-avatar" />
                    <div className="crv-submitted-meta" style={{ flex: 1, gap: "6px" }}>
                      <div className="crv-sk-shimmer crv-sk-title" />
                      <div className="crv-sk-shimmer crv-sk-subtitle" />
                    </div>
                  </div>
                  <div className="crv-sk-shimmer crv-sk-badge" />
                </div>
                <div className="crv-submitted-body" style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div className="crv-sk-shimmer crv-sk-stars" />
                  <div className="crv-sk-shimmer crv-sk-line" />
                  <div className="crv-sk-shimmer crv-sk-line-short" />
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="crv-error-card">
            <div className="crv-error-icon">
              <i className="fas fa-exclamation-triangle" />
            </div>
            <h3 className="crv-error-title">Unable to Load Reviews</h3>
            <p className="crv-error-desc">
              We encountered a problem retrieving your reviews. Please try again.
            </p>
            <button
              type="button"
              className="crv-retry-btn"
              onClick={() => refetch()}
            >
              <i className="fas fa-redo" />
              <span>Retry</span>
            </button>
          </div>
        ) : myReviews.length === 0 ? (
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
                : "You haven't posted any reviews yet. Visit your completed bookings to rate a specialist."}
            </p>
            {isFiltered ? (
              <button type="button" className="crv-empty-btn secondary" onClick={handleResetFilters}>
                <i className="fas fa-times-circle" />
                <span>Reset Filters</span>
              </button>
            ) : (
              <button type="button" className="crv-empty-btn" onClick={() => navigate("/bookings")}>
                <i className="fas fa-calendar-alt" />
                <span>View All Bookings</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="crv-reviewed-grid">
              {myReviews.map((review) => {
                const specialistName = review.providerName || review.providerBusinessName || "Service Specialist";
                const targetProviderId = review.providerUserId || review.providerId;
                const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(specialistName)}&background=FF7900&color=fff&size=120&bold=true`;
                const avatarSrc = review.providerAvatar || fallbackAvatar;

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
                            (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
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

            {totalPages > 1 && (
              <div className="crv-pagination">
                <button
                  type="button"
                  className="crv-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <i className="fas fa-chevron-left" />
                  <span>Previous</span>
                </button>
                <span className="crv-page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="crv-page-btn"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                >
                  <span>Next</span>
                  <i className="fas fa-chevron-right" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerReviewsPage;
