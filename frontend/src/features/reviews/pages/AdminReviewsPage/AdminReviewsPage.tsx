import React, { useState, useEffect, useMemo } from "react";
import { toast } from "react-hot-toast";
import { useAdminReviewsQuery, useModerateReviewMutation } from "../../hooks/useReviews";
import { BookingReviewCard } from "../../components/BookingReviewCard/BookingReviewCard";
import { AdminPagination } from "../../../admin/components/AdminPagination";
import { ConfirmModal } from "../../../../shared/components/ui/ConfirmModal/ConfirmModal";
import type { ReviewItem } from "../../types/review.types";
import "./AdminReviewsPage.css";

export const AdminReviewsPage: React.FC = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("");
  const [visibilityFilter, setVisibilityFilter] = useState<"" | "VISIBLE" | "HIDDEN">("");
  const [reportFilter, setReportFilter] = useState<"" | "REPORTED" | "CLEAN">("");
  const [selectedReview, setSelectedReview] = useState<ReviewItem | null>(null);
  const [pendingVisibilityReview, setPendingVisibilityReview] = useState<ReviewItem | null>(null);
  const limit = 10;

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search.trim());
      setPage(1);
    }, 350);
    return () => clearTimeout(timer);
  }, [search]);

  const queryParams = useMemo(
    () => ({
      page,
      limit,
      search: debouncedSearch || undefined,
      rating: ratingFilter ? Number(ratingFilter) : undefined,
      isHidden: visibilityFilter === "HIDDEN" ? true : visibilityFilter === "VISIBLE" ? false : undefined,
      isReported: reportFilter === "REPORTED" ? true : reportFilter === "CLEAN" ? false : undefined
    }),
    [page, limit, debouncedSearch, ratingFilter, visibilityFilter, reportFilter]
  );

  const { data, isLoading, isError, refetch } = useAdminReviewsQuery(queryParams);
  const moderateMutation = useModerateReviewMutation();

  const payload = data?.data;
  const reviews = payload?.reviews || [];
  const reportedCount = payload?.reportedCount ?? 0;
  const totalPages = payload?.pagination?.totalPages ?? 1;
  const totalCount = payload?.pagination?.total ?? 0;

  const isFiltered = Boolean(debouncedSearch || ratingFilter || visibilityFilter || reportFilter);

  const handleResetFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setRatingFilter("");
    setVisibilityFilter("");
    setReportFilter("");
    setPage(1);
  };

  const handleConfirmToggleHidden = () => {
    if (!pendingVisibilityReview) return;
    const review = pendingVisibilityReview;
    moderateMutation.mutate(
      { reviewId: review.id, isHidden: !review.isHidden },
      {
        onSuccess: (res) => {
          toast.success(!review.isHidden ? "Review hidden from public view" : "Review restored to public view");
          if (selectedReview?.id === review.id && res?.data) {
            setSelectedReview(res.data);
          }
          setPendingVisibilityReview(null);
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to update review visibility");
        }
      }
    );
  };

  const handleDismissReport = (review: ReviewItem) => {
    moderateMutation.mutate(
      { reviewId: review.id, isReported: false },
      {
        onSuccess: (res) => {
          toast.success("Report dismissed");
          if (selectedReview?.id === review.id && res?.data) {
            setSelectedReview(res.data);
          }
        },
        onError: (err: any) => {
          toast.error(err?.response?.data?.message || "Failed to dismiss report");
        }
      }
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
    } catch {
      return "—";
    }
  };

  return (
    <div className="app-content">
      <div className="arv-header">
        <div>
          <h1 className="font-extrabold tracking-tight mb-1" style={{ fontSize: "2rem" }}>
            Reviews &amp; Moderation
          </h1>
          <p className="text-secondary text-sm mb-0">
            Inspect marketplace feedback, review flagged comments, and moderate review visibility.
          </p>
        </div>

        <div className="arv-summary-pills">
          <div className="arv-summary-pill">
            <i className="fas fa-star text-warning" />
            <span>{totalCount} Matching</span>
          </div>
          <button
            type="button"
            className={`arv-summary-pill reported ${reportFilter === "REPORTED" ? "active" : ""}`}
            onClick={() => {
              setReportFilter((prev) => (prev === "REPORTED" ? "" : "REPORTED"));
              setPage(1);
            }}
          >
            <i className="fas fa-flag" />
            <span>{reportedCount} Reported</span>
          </button>
        </div>
      </div>

      <div className="admin-filter-bar">
        <div className="admin-search-input">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search customer, provider, service, #booking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="admin-filters-group">
          <select
            className="admin-select"
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>

          <select
            className="admin-select"
            value={visibilityFilter}
            onChange={(e) => {
              setVisibilityFilter(e.target.value as "" | "VISIBLE" | "HIDDEN");
              setPage(1);
            }}
          >
            <option value="">All Visibility</option>
            <option value="VISIBLE">Visible</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          <select
            className="admin-select"
            value={reportFilter}
            onChange={(e) => {
              setReportFilter(e.target.value as "" | "REPORTED" | "CLEAN");
              setPage(1);
            }}
          >
            <option value="">All Reports</option>
            <option value="REPORTED">Reported Only</option>
            <option value="CLEAN">Not Reported</option>
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
                <th style={{ width: "16%" }}>Booking &amp; Date</th>
                <th style={{ width: "16%" }}>Customer</th>
                <th style={{ width: "18%" }}>Provider</th>
                <th style={{ width: "26%" }}>Rating &amp; Feedback</th>
                <th style={{ width: "12%" }}>Status</th>
                <th className="text-right" style={{ width: "12%" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 8 }).map((_, idx) => (
                  <tr key={`skel-${idx}`}>
                    <td>
                      <div className="admin-skel-line" style={{ width: "70%", height: "16px", marginBottom: "6px" }} />
                      <div className="admin-skel-line" style={{ width: "50%", height: "12px" }} />
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "75%", height: "16px", marginBottom: "6px" }} />
                      <div className="admin-skel-line" style={{ width: "45%", height: "12px" }} />
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "80%", height: "16px", marginBottom: "6px" }} />
                      <div className="admin-skel-line" style={{ width: "50%", height: "12px" }} />
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "45%", height: "14px", marginBottom: "6px" }} />
                      <div className="admin-skel-line" style={{ width: "90%", height: "14px" }} />
                    </td>
                    <td>
                      <div className="admin-skel-line" style={{ width: "68px", height: "22px", borderRadius: "9999px" }} />
                    </td>
                    <td className="text-right">
                      <div className="admin-skel-line" style={{ width: "88px", height: "30px", marginLeft: "auto", borderRadius: "8px" }} />
                    </td>
                  </tr>
                ))
              ) : isError ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <div className="text-danger font-semibold mb-2">Failed to load reviews</div>
                    <button type="button" className="btn btn-secondary text-xs" onClick={() => refetch()}>
                      <i className="fas fa-redo mr-1" /> Retry
                    </button>
                  </td>
                </tr>
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="admin-empty-ticket-cell">
                    <div className="admin-empty-ticket-box">
                      <img
                        src="/images/admin-no-data.png"
                        alt="No Reviews Found"
                        className="admin-empty-ticket-img"
                        onError={(e) => {
                          e.currentTarget.src = "https://res.cloudinary.com/zjhxcdmi/image/upload/v1794756715/no-data-found-logo.png";
                        }}
                      />
                      <h3 className="font-semibold text-base mb-1 text-text">
                        {isFiltered ? "No Reviews Found" : "No Reviews Submitted Yet"}
                      </h3>
                      <p className="text-secondary text-xs mb-0">
                        {isFiltered
                          ? "There are no reviews matching your search query or filters."
                          : "Customer reviews and specialist feedback will appear here as bookings are completed."}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                reviews.map((review) => {
                  const customerName = review.customerName || "Customer";
                  const providerName = review.providerBusinessName || review.providerName || "Provider";
                  const customerFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(customerName)}&background=0f172a&color=fff&size=80&bold=true`;
                  const providerFallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(providerName)}&background=6366f1&color=fff&size=80&bold=true`;

                  return (
                    <tr key={review.id}>
                      <td>
                        <div className="font-bold text-sm">
                          {review.bookingNumber ? `#${review.bookingNumber}` : "Booking"}
                        </div>
                        {review.serviceTitle && (
                          <div className="text-xs text-secondary truncate" style={{ maxWidth: "160px" }} title={review.serviceTitle}>
                            {review.serviceTitle}
                          </div>
                        )}
                        <div className="text-xs text-secondary mt-0.5">{formatDate(review.createdAt)}</div>
                      </td>

                      <td>
                        <div className="arv-person-cell">
                          <img
                            src={review.customerAvatar || customerFallback}
                            alt={customerName}
                            className="arv-avatar"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = customerFallback;
                            }}
                          />
                          <span className="font-semibold text-sm truncate" title={customerName}>
                            {customerName}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="arv-person-cell">
                          <img
                            src={review.providerAvatar || providerFallback}
                            alt={providerName}
                            className="arv-avatar"
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).src = providerFallback;
                            }}
                          />
                          <span className="font-semibold text-sm truncate" title={providerName}>
                            {providerName}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="arv-rating-row">
                          <span className="arv-stars">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <i
                                key={star}
                                className={`fa${star <= review.rating ? "s" : "r"} fa-star`}
                              />
                            ))}
                          </span>
                          <span className="font-bold text-xs">{review.rating.toFixed(1)}</span>
                          {review.providerReply && (
                            <span className="arv-replied-chip">Replied</span>
                          )}
                        </div>
                        {review.title && (
                          <div className="font-semibold text-xs mt-1 truncate" style={{ maxWidth: "260px" }}>
                            {review.title}
                          </div>
                        )}
                        <div className="text-xs text-secondary arv-comment-preview" title={review.comment}>
                          {review.comment}
                        </div>
                      </td>

                      <td>
                        <div className="flex flex-col gap-1 items-start">
                          {review.isHidden ? (
                            <span className="badge badge-danger-alert text-xs">Hidden</span>
                          ) : (
                            <span className="badge badge-verified text-xs">Visible</span>
                          )}
                          {review.isReported && (
                            <span className="badge badge-pending text-xs">
                              <i className="fas fa-flag mr-1" /> Reported
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="text-right">
                        <div className="arv-actions">
                          <button
                            type="button"
                            className="arv-icon-btn"
                            title="Inspect review"
                            onClick={() => setSelectedReview(review)}
                          >
                            <i className="fas fa-eye" />
                          </button>
                          <button
                            type="button"
                            className={`arv-icon-btn ${review.isHidden ? "restore" : "hide"}`}
                            title={review.isHidden ? "Restore review" : "Hide review"}
                            disabled={moderateMutation.isPending}
                            onClick={() => setPendingVisibilityReview(review)}
                          >
                            <i className={`fas ${review.isHidden ? "fa-eye-slash" : "fa-ban"}`} />
                          </button>
                          {review.isReported && (
                            <button
                              type="button"
                              className="arv-icon-btn clear-flag"
                              title="Dismiss report"
                              disabled={moderateMutation.isPending}
                              onClick={() => handleDismissReport(review)}
                            >
                              <i className="fas fa-check" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <AdminPagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {selectedReview && (
        <div className="arv-modal-backdrop" onClick={() => setSelectedReview(null)}>
          <div className="arv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="arv-modal-header">
              <div>
                <h3 className="arv-modal-title">Review Details</h3>
                <p className="arv-modal-sub">
                  {selectedReview.bookingNumber ? `Booking #${selectedReview.bookingNumber} · ` : ""}
                  {selectedReview.customerName || "Customer"} → {selectedReview.providerBusinessName || selectedReview.providerName || "Provider"}
                </p>
              </div>
              <button
                type="button"
                className="arv-modal-close"
                onClick={() => setSelectedReview(null)}
                aria-label="Close modal"
              >
                <i className="fas fa-times" />
              </button>
            </div>

            <div className="arv-modal-body">
              <BookingReviewCard review={selectedReview} variant="embedded" />
            </div>

            <div className="arv-modal-footer">
              {selectedReview.isReported && (
                <button
                  type="button"
                  className="btn btn-secondary text-xs"
                  disabled={moderateMutation.isPending}
                  onClick={() => handleDismissReport(selectedReview)}
                >
                  <i className="fas fa-check mr-1" /> Dismiss Report
                </button>
              )}
              <button
                type="button"
                className={`btn text-xs ${selectedReview.isHidden ? "btn-primary" : "btn-danger"}`}
                disabled={moderateMutation.isPending}
                onClick={() => setPendingVisibilityReview(selectedReview)}
              >
                <i className={`fas ${selectedReview.isHidden ? "fa-eye" : "fa-ban"} mr-1`} />
                {selectedReview.isHidden ? "Restore Review" : "Hide Review"}
              </button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={Boolean(pendingVisibilityReview)}
        title={pendingVisibilityReview?.isHidden ? "Restore Review" : "Hide Review"}
        message={
          pendingVisibilityReview?.isHidden
            ? "Are you sure you want to restore this review? It will become publicly visible on the provider's profile and ratings."
            : "Are you sure you want to hide this review? It will be removed from public view and excluded from the provider's rating."
        }
        confirmText={pendingVisibilityReview?.isHidden ? "Restore Review" : "Hide Review"}
        isDanger={!pendingVisibilityReview?.isHidden}
        isLoading={moderateMutation.isPending}
        onConfirm={handleConfirmToggleHidden}
        onCancel={() => {
          if (!moderateMutation.isPending) {
            setPendingVisibilityReview(null);
          }
        }}
      />
    </div>
  );
};

export default AdminReviewsPage;
