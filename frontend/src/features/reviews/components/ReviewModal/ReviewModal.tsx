import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { useCreateReviewMutation } from "../../hooks/useReviews";
import { createReviewSchema, type CreateReviewFormData } from "../../schemas/review.schema";
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
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [serverError, setServerError] = useState<string | null>(null);

  const createReviewMutation = useCreateReviewMutation();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<CreateReviewFormData>({
    resolver: zodResolver(createReviewSchema),
    mode: "onChange",
    defaultValues: {
      rating: 5,
      comment: ""
    }
  });

  const rating = watch("rating");
  const comment = watch("comment");

  if (!isOpen) return null;

  const onSubmit = async (data: CreateReviewFormData) => {
    setServerError(null);

    try {
      const response = await createReviewMutation.mutateAsync({
        bookingId,
        rating: data.rating,
        comment: data.comment.trim()
      });

      toast.success("Review posted successfully! Thank you for your feedback.");
      if (onSuccess && response.data) {
        onSuccess(response.data);
      }
      onClose();
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || "Failed to submit review";
      setServerError(msg);
      toast.error(msg);
    }
  };

  const activeRating = hoverRating || rating;

  return (
    <div className="rev-modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="rev-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="rev-modal-header">
          <div className="rev-modal-header-info">
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

        <form onSubmit={handleSubmit(onSubmit)} className="rev-modal-form" noValidate>
          <div className="rev-modal-rating-section">
            <label className="rev-modal-section-label">
              Overall Rating <span className="rev-label-req">*</span>
            </label>
            <div className="rev-stars-picker">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`rev-star-btn ${star <= activeRating ? "active" : ""}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setValue("rating", star, { shouldValidate: true })}
                  aria-label={`${star} star`}
                >
                  <i className={`fa${star <= activeRating ? "s" : "r"} fa-star`} />
                </button>
              ))}
            </div>
            <span className="rev-rating-descriptor">{RATING_LABELS[activeRating] || ""}</span>
            {errors.rating && (
              <span className="rev-field-error">
                <i className="fas fa-exclamation-circle" />
                {errors.rating.message}
              </span>
            )}
          </div>

          <div className="rev-input-group">
            <div className="rev-input-label-wrap">
              <label htmlFor="rev-comment" className="rev-input-label">
                Detailed Review <span className="rev-label-req">*</span>
              </label>
              <span className="rev-char-count">{(comment?.length || 0)}/1000</span>
            </div>
            <textarea
              id="rev-comment"
              className={`rev-textarea ${errors.comment ? "has-error" : ""}`}
              rows={4}
              placeholder="Describe the quality of work, professional attitude, punctuality, and whether you would hire this specialist again..."
              maxLength={1000}
              {...register("comment")}
            />
            {errors.comment && (
              <span className="rev-field-error">
                <i className="fas fa-exclamation-circle" />
                {errors.comment.message}
              </span>
            )}
          </div>

          {serverError && (
            <div className="rev-error-box">
              <i className="fas fa-exclamation-circle" />
              <span>{serverError}</span>
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
              disabled={createReviewMutation.isPending || !isValid}
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
