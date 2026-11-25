import React from "react";
import type { ReviewItem } from "../../types/review.types";
import "./BookingReviewCard.css";

interface BookingReviewCardProps {
  review: ReviewItem;
  variant?: "standalone" | "embedded";
}

export const BookingReviewCard: React.FC<BookingReviewCardProps> = ({
  review,
  variant = "standalone"
}) => {
  const formattedDate = new Date(review.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className={`bk-review-card ${variant === "embedded" ? "embedded" : ""}`}>
      <div className="bk-review-header">
        <div className="bk-review-stars-wrap">
          <div className="bk-review-stars" aria-label={`Rated ${review.rating} out of 5 stars`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fa${star <= review.rating ? "s" : "r"} fa-star ${
                  star <= review.rating ? "active" : ""
                }`}
              />
            ))}
          </div>
          <span className="bk-review-rating-num">{review.rating}.0 / 5.0</span>
          <span className="bk-review-verified-pill">
            <i className="fas fa-check-circle" /> Verified Review
          </span>
        </div>
        <span className="bk-review-date">{formattedDate}</span>
      </div>

      {review.title && <h4 className="bk-review-title">{review.title}</h4>}

      <p className="bk-review-comment">{review.comment}</p>

      {review.aspectRatings && Object.keys(review.aspectRatings).length > 0 && (
        <div className="bk-review-aspects">
          {review.aspectRatings.punctuality !== undefined && (
            <span className="bk-review-aspect-pill">
              Punctuality: {review.aspectRatings.punctuality}★
            </span>
          )}
          {review.aspectRatings.serviceQuality !== undefined && (
            <span className="bk-review-aspect-pill">
              Quality: {review.aspectRatings.serviceQuality}★
            </span>
          )}
          {review.aspectRatings.communication !== undefined && (
            <span className="bk-review-aspect-pill">
              Communication: {review.aspectRatings.communication}★
            </span>
          )}
          {review.aspectRatings.valueForMoney !== undefined && (
            <span className="bk-review-aspect-pill">
              Value: {review.aspectRatings.valueForMoney}★
            </span>
          )}
        </div>
      )}

      {review.providerReply && (
        <div className="bk-review-reply-box">
          <div className="bk-review-reply-header">
            <span className="bk-review-reply-title">
              <i className="fas fa-reply" /> Specialist Response
            </span>
            {review.providerRepliedAt && (
              <span className="bk-review-reply-time">
                {new Date(review.providerRepliedAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short"
                })}
              </span>
            )}
          </div>
          <p className="bk-review-reply-text">{review.providerReply}</p>
        </div>
      )}
    </div>
  );
};
