import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { useCreateReviewMutation } from "../../hooks/useReviews";
import type { ReviewItem } from "../../types/review.types";
import "./ReviewModal.css";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  bookingNumber?: string | null;
  providerName?: string | null;
  serviceTitle?: string | null;
  onSuccess?: (review: ReviewItem) => void;
}

const RATING_LABELS: Record<number, string> = {
  1: "Poor Experience",
  2: "Fair",
  3: "Good & Satisfactory",
  4: "Very Good",
  5: "Excellent & Highly Recommended"
};

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  bookingId,
  bookingNumber,
  providerName,
  serviceTitle,
  onSuccess
}) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [title, setTitle] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const createReviewMutation = useCreateReviewMutation();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const trimmedComment = comment.trim();
    if (!trimmedComment || trimmedComment.length < 5) {
      setErrorMessage("Please write at least 5 characters sharing your experience.");
      return;
    }

    try {
      const response = await createReviewMutation.mutateAsync({
        bookingId,
        rating,
        title: title.trim() || undefined,
        comment: trimmedComment
      });

      toast.success("Review posted successfully! Thank you for your feedback.");
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to submit review";
      setErrorMessage(msg);
      toast.error(msg);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="rev-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="rev-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="rev-modal-header">
          <div className="rev-modal-header-info">
            <span className="rev-modal-badge">
              <i className="fas fa-star" /> Verified Booking Review
            </span>
            <h2 className="rev-modal-title">Rate Your Specialist</h2>
            <p className="rev-modal-subtitle">
              {providerName ? `How was your service with ${providerName}?` : "Share your experience with the specialist."}
              {bookingNumber && <span className="rev-modal-bk-num"> (Booking #{bookingNumber})</span>}
            </p>
          </div>
          <button
            type="button"
            className="rev-modal-close-btn"
            onClick={onClose}
            aria-label="Close review modal"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        {serviceTitle && (
          <div className="rev-modal-service-pill">
            <i className="fas fa-wrench" />
            <span>{serviceTitle}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="rev-modal-form">
          <div className="rev-modal-rating-section">
            <label className="rev-modal-section-label">Overall Rating</label>
            <div className="rev-stars-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rev-star-btn ${star <= activeRating ? "active" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} star`}
                >
                  <i className={`fa${star <= activeRating ? "s" : "r"} fa-star`} />
                </button>
              ))}
            </div>
            <span className="rev-rating-descriptor">{RATING_LABELS[activeRating] || ""}</span>
          </div>

          <div className="rev-input-group">
            <label htmlFor="rev-title" className="rev-input-label">
              Review Headline <span className="rev-label-opt">(optional)</span>
            </label>
            <input
              id="rev-title"
              type="text"
              className="rev-text-input"
              placeholder="e.g. Prompt arrival and outstanding pipe repair!"
              value={title}
              maxLength={150}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="rev-input-group">
            <div className="rev-input-label-wrap">
              <label htmlFor="rev-comment" className="rev-input-label">
                Detailed Review <span className="rev-label-req">*</span>
              </label>
              <span className="rev-char-count">{comment.length}/2000</span>
            </div>
            <textarea
              id="rev-comment"
              className="rev-textarea"
              rows={4}
              placeholder="Describe the quality of work, professional attitude, and whether you would hire this specialist again..."
              value={comment}
              maxLength={2000}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          {errorMessage && (
            <div className="rev-error-box">
              <i className="fas fa-exclamation-circle" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="rev-modal-actions">
            <button
              type="button"
              className="rev-btn-cancel"
              onClick={onClose}
              disabled={createReviewMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rev-btn-submit"
              disabled={createReviewMutation.isPending || !comment.trim()}
            >
              {createReviewMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin" />
                  <span>Publishing Review...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" />
                  <span>Publish Review</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
