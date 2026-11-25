import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useProviderReviewsQuery, useReplyToReviewMutation } from "../../hooks/useReviews";
import { BookingReviewCard } from "../../components/BookingReviewCard/BookingReviewCard";
import type { ReviewItem } from "../../types/review.types";
import "./ProviderReviewsPage.css";

export const ProviderReviewsPage: React.FC = () => {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const profile = useAuthStore((s) => s.profile);
  const providerId = (profile as any)?.id || user?.id;

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<number | "ALL">("ALL");
  const [repliedFilter, setRepliedFilter] = useState<"ALL" | "UNREPLIED" | "REPLIED">("ALL");
  const [page, setPage] = useState(1);
  const limit = 12;

  const [replyingReviewId, setReplyingReviewId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyError, setReplyError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, ratingFilter, repliedFilter]);

  const queryParams = useMemo(
    () => ({
      search: debouncedSearch || undefined,
      rating: ratingFilter !== "ALL" ? ratingFilter : undefined,
      replied: repliedFilter !== "ALL" ? repliedFilter : undefined,
      page,
      limit
    }),
    [debouncedSearch, ratingFilter, repliedFilter, page]
  );

  const {
    data: reviewsRes,
    isLoading,
    isError,
    refetch
  } = useProviderReviewsQuery(providerId, queryParams);

  const replyMutation = useReplyToReviewMutation();

  const payload = reviewsRes?.data;
  const reviews: ReviewItem[] = payload?.reviews || [];
  const totalReviews = payload?.totalReviews ?? payload?.pagination?.total ?? 0;
  const unrepliedCount = payload?.unrepliedCount ?? 0;
  const averageRating = payload?.averageRating ?? 0;
  const ratingCounts = payload?.ratingCounts || {};
  const breakdown = payload?.breakdown || [];
  const totalPages = payload?.pagination?.totalPages ?? 1;

  const handleResetFilters = () => {
    setSearchQuery("");
    setDebouncedSearch("");
    setRatingFilter("ALL");
    setRepliedFilter("ALL");
    setPage(1);
  };

  const handleOpenReply = (reviewId: string) => {
    setReplyingReviewId(reviewId);
    setReplyText("");
    setReplyError(null);
  };

  const handleCancelReply = () => {
    setReplyingReviewId(null);
    setReplyText("");
    setReplyError(null);
  };

  const handleSubmitReply = (reviewId: string) => {
    const trimmed = replyText.trim();
    if (trimmed.length < 2) {
      setReplyError("Reply must be at least 2 characters.");
      return;
    }
    if (trimmed.length > 1500) {
      setReplyError("Reply cannot exceed 1500 characters.");
      return;
    }
    setReplyError(null);
    replyMutation.mutate(
      { reviewId, replyText: trimmed },
      {
        onSuccess: () => {
          toast.success("Response posted to review");
          handleCancelReply();
          refetch();
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to post response");
        }
      }
    );
  };

  const isFiltered = Boolean(debouncedSearch) || ratingFilter !== "ALL" || repliedFilter !== "ALL";

  return (
    <div className="prv-page">
      <div className="prv-hero">
        <div className="prv-hero-left">
          <h1 className="prv-title">Customer Reviews</h1>
          <p className="prv-subtitle">
            Monitor your service ratings, inspect customer feedback, and respond directly to reviews.
          </p>
        </div>

        <div className="prv-stats-row">
          <div className="prv-stat-card rating">
            <div className="prv-stat-icon">
              <i className="fas fa-star" />
            </div>
            <div className="prv-stat-body">
              {isLoading ? (
                <div className="prv-sk-shimmer prv-sk-stat-num" aria-hidden="true" />
              ) : (
                <span className="prv-stat-num">
                  {totalReviews > 0 ? averageRating.toFixed(1) : "—"}
                </span>
              )}
              <span className="prv-stat-label">Avg Rating</span>
            </div>
          </div>

          <div className="prv-stat-card total">
            <div className="prv-stat-icon">
              <i className="fas fa-comments" />
            </div>
            <div className="prv-stat-body">
              {isLoading ? (
                <div className="prv-sk-shimmer prv-sk-stat-num" aria-hidden="true" />
              ) : (
                <span className="prv-stat-num">{totalReviews}</span>
              )}
              <span className="prv-stat-label">Total Reviews</span>
            </div>
          </div>

          <div className="prv-stat-card pending">
            <div className="prv-stat-icon">
              <i className="fas fa-reply" />
            </div>
            <div className="prv-stat-body">
              {isLoading ? (
                <div className="prv-sk-shimmer prv-sk-stat-num" aria-hidden="true" />
              ) : (
                <span className="prv-stat-num">{unrepliedCount}</span>
              )}
              <span className="prv-stat-label">Needs Reply</span>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="prv-breakdown-card prv-skeleton-breakdown" aria-hidden="true">
          <div className="prv-breakdown-summary">
            <div className="prv-sk-shimmer prv-sk-bd-score" />
            <div className="prv-sk-shimmer prv-sk-bd-stars" />
            <div className="prv-sk-shimmer prv-sk-bd-sub" />
          </div>
          <div className="prv-breakdown-bars">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="prv-bar-row prv-bar-row-sk">
                <div className="prv-sk-shimmer prv-sk-bd-label" />
                <div className="prv-bar-track">
                  <div className="prv-sk-shimmer prv-sk-bd-fill" />
                </div>
                <div className="prv-sk-shimmer prv-sk-bd-count" />
              </div>
            ))}
          </div>
        </div>
      ) : (
        totalReviews > 0 &&
        breakdown.length > 0 && (
          <div className="prv-breakdown-card">
            <div className="prv-breakdown-summary">
              <div className="prv-breakdown-score">{averageRating.toFixed(1)}</div>
              <div className="prv-breakdown-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <i
                    key={star}
                    className={`fa${star <= Math.round(averageRating) ? "s" : "r"} fa-star ${
                      star <= Math.round(averageRating) ? "active" : ""
                    }`}
                  />
                ))}
              </div>
              <span className="prv-breakdown-total">
                Based on {totalReviews} {totalReviews === 1 ? "review" : "reviews"}
              </span>
            </div>

            <div className="prv-breakdown-bars">
              {breakdown.map((item) => (
                <button
                  key={item.stars}
                  type="button"
                  className={`prv-bar-row ${ratingFilter === item.stars ? "active" : ""}`}
                  onClick={() =>
                    setRatingFilter((prev) => (prev === item.stars ? "ALL" : item.stars))
                  }
                >
                  <span className="prv-bar-label">{item.stars} ★</span>
                  <div className="prv-bar-track">
                    <div
                      className="prv-bar-fill"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="prv-bar-count">{item.count}</span>
                </button>
              ))}
            </div>
          </div>
        )
      )}

      <div className="prv-toolbar">
        <div className="prv-filters-left">
          <div className="prv-filter-pills" role="group" aria-label="Filter by star rating">
            <button
              type="button"
              className={`prv-filter-pill ${ratingFilter === "ALL" ? "active" : ""}`}
              onClick={() => setRatingFilter("ALL")}
            >
              <span>All</span>
              <span className="prv-filter-count">{isLoading ? "—" : totalReviews}</span>
            </button>
            {[5, 4, 3, 2, 1].map((star) => (
              <button
                key={star}
                type="button"
                className={`prv-filter-pill ${ratingFilter === star ? "active" : ""}`}
                onClick={() => setRatingFilter(star)}
              >
                <span>{star} ★</span>
                <span className="prv-filter-count">
                  {isLoading ? "—" : ratingCounts[star] ?? 0}
                </span>
              </button>
            ))}
          </div>

          <div className="prv-reply-filter-group">
            {(
              [
                { value: "ALL", label: "All Status" },
                { value: "UNREPLIED", label: "Awaiting Reply" },
                { value: "REPLIED", label: "Replied" }
              ] as const
            ).map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`prv-reply-pill ${repliedFilter === opt.value ? "active" : ""}`}
                onClick={() => setRepliedFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="prv-search-box">
          <i className="fas fa-search prv-search-icon" />
          <input
            type="text"
            className="prv-search-input"
            placeholder="Search client, service or #booking..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="prv-search-clear"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
            >
              <i className="fas fa-times" />
            </button>
          )}
        </div>
      </div>

      <div className="prv-content">
        {isLoading ? (
          <div className="prv-grid" aria-hidden="true">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div key={item} className="prv-card prv-skeleton-card">
                <div className="prv-card-header">
                  <div className="prv-customer">
                    <div className="prv-sk-shimmer prv-sk-avatar" />
                    <div className="prv-customer-meta" style={{ flex: 1, gap: "6px" }}>
                      <div className="prv-sk-shimmer prv-sk-title" />
                      <div className="prv-sk-shimmer prv-sk-subtitle" />
                    </div>
                  </div>
                  <div className="prv-sk-shimmer prv-sk-badge" />
                </div>
                <div className="prv-card-body">
                  <div className="prv-sk-review-block">
                    <div className="prv-sk-shimmer prv-sk-stars" />
                    <div className="prv-sk-shimmer prv-sk-line" />
                    <div className="prv-sk-shimmer prv-sk-line-short" />
                    <div className="prv-sk-aspects">
                      <div className="prv-sk-shimmer prv-sk-chip" />
                      <div className="prv-sk-shimmer prv-sk-chip" />
                    </div>
                  </div>
                  <div className="prv-reply-section">
                    <div className="prv-sk-shimmer prv-sk-reply-btn" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : isError ? (
          <div className="prv-error-card">
            <div className="prv-error-icon">
              <i className="fas fa-exclamation-triangle" />
            </div>
            <h3 className="prv-error-title">Unable to Load Reviews</h3>
            <p className="prv-error-desc">
              We encountered a problem retrieving your customer reviews. Please try again.
            </p>
            <button type="button" className="prv-retry-btn" onClick={() => refetch()}>
              <i className="fas fa-redo" />
              <span>Retry</span>
            </button>
          </div>
        ) : reviews.length === 0 ? (
          <div className="prv-empty-card">
            <img
              src="https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png"
              alt="No customer reviews found"
              className="prv-empty-img"
              onError={(e) => {
                e.currentTarget.src = "/images/no-data.png";
              }}
            />
            <h3 className="prv-empty-title">
              {isFiltered ? "No Matching Reviews" : "No Customer Reviews Yet"}
            </h3>
            <p className="prv-empty-desc">
              {isFiltered
                ? "No reviews match your current search or rating filters."
                : "Once customers complete bookings with you and leave feedback, their ratings and reviews will appear here."}
            </p>
            {isFiltered ? (
              <button type="button" className="prv-empty-btn secondary" onClick={handleResetFilters}>
                <i className="fas fa-times-circle" />
                <span>Reset Filters</span>
              </button>
            ) : (
              <button type="button" className="prv-empty-btn" onClick={() => navigate("/provider/bookings")}>
                <i className="fas fa-calendar-check" />
                <span>View Bookings</span>
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="prv-grid">
              {reviews.map((review) => {
                const customerName = review.customerName || "Customer";
                const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=0f172a&color=fff&size=120&bold=true`;
                const avatarSrc = review.customerAvatar || fallbackAvatar;
                const isReplying = replyingReviewId === review.id;

                return (
                  <div key={review.id} className="prv-card">
                    <div className="prv-card-header">
                      <div className="prv-customer">
                        <img
                          src={avatarSrc}
                          alt={customerName}
                          className="prv-customer-avatar"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).src = fallbackAvatar;
                          }}
                        />
                        <div className="prv-customer-meta">
                          <span className="prv-customer-name" title={customerName}>
                            {customerName}
                          </span>
                          {review.serviceTitle && (
                            <span className="prv-service-title" title={review.serviceTitle}>
                              {review.serviceTitle}
                            </span>
                          )}
                        </div>
                      </div>

                      {review.bookingNumber && (
                        <button
                          type="button"
                          className="prv-bk-link"
                          onClick={() => navigate(`/provider/bookings/${review.bookingId}`)}
                        >
                          <span>#{review.bookingNumber}</span>
                          <i className="fas fa-arrow-right" />
                        </button>
                      )}
                    </div>

                    <div className="prv-card-body">
                      <BookingReviewCard review={review} variant="embedded" />

                      {!review.providerReply && (
                        <div className="prv-reply-section">
                          {isReplying ? (
                            <div className="prv-reply-form">
                              <textarea
                                className="prv-reply-textarea"
                                rows={3}
                                placeholder="Write a polite, helpful public response to this customer..."
                                value={replyText}
                                onChange={(e) => {
                                  setReplyText(e.target.value);
                                  if (replyError) setReplyError(null);
                                }}
                                maxLength={1500}
                              />
                              {replyError && <span className="prv-reply-error">{replyError}</span>}
                              <div className="prv-reply-actions">
                                <button
                                  type="button"
                                  className="prv-reply-cancel"
                                  onClick={handleCancelReply}
                                  disabled={replyMutation.isPending}
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  className="prv-reply-submit"
                                  onClick={() => handleSubmitReply(review.id)}
                                  disabled={replyMutation.isPending}
                                >
                                  {replyMutation.isPending ? (
                                    <>
                                      <i className="fas fa-spinner fa-spin" />
                                      <span>Posting...</span>
                                    </>
                                  ) : (
                                    <>
                                      <i className="fas fa-paper-plane" />
                                      <span>Post Reply</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              type="button"
                              className="prv-reply-trigger"
                              onClick={() => handleOpenReply(review.id)}
                            >
                              <i className="fas fa-reply" />
                              <span>Reply to Review</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className="prv-pagination">
                <button
                  type="button"
                  className="prv-page-btn"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <i className="fas fa-chevron-left" />
                  <span>Previous</span>
                </button>
                <span className="prv-page-info">
                  Page {page} of {totalPages}
                </span>
                <button
                  type="button"
                  className="prv-page-btn"
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

export default ProviderReviewsPage;
