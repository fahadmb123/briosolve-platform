import type { Category, ServiceItem } from "./types";

interface RequestSummaryProps {
  currentLevel: number;
  selectedCategory: Category | null;
  selectedSubservice: ServiceItem | null;
  urgencyLabel: string;
  selectedAddressText: string;
  budgetType: "OPEN_BID" | "FIXED";
  budgetAmount: string;
  uploadedImagesCount: number;
  isSubmitting: boolean;
  agreedToPolicy: boolean;
  onNextLevel: () => void;
}

export function RequestSummary({
  currentLevel,
  selectedCategory,
  selectedSubservice,
  urgencyLabel,
  selectedAddressText,
  budgetType,
  budgetAmount,
  uploadedImagesCount,
  isSubmitting,
  agreedToPolicy,
  onNextLevel,
}: RequestSummaryProps) {
  return (
    <div className="request-summary-column">
      <div className="request-summary-card">
        <div className="summary-card-header">
          <div className="summary-status-pulse">
            <span className="summary-pulse-dot"></span>
          </div>
          <div>
            <h3 className="summary-card-title">Live Scope Summary</h3>
            <p className="summary-card-subtext">
              Real-time preview across all levels
            </p>
          </div>
        </div>

        <div className="summary-items-list">
          <div className="summary-item">
            <span className="summary-item-label">
              <i className="fas fa-th-large"></i>
              Level 1
            </span>
            <span className="summary-item-value">
              {selectedCategory?.name || "None"} • {selectedSubservice?.name || "General"}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-item-label">
              <i className="fas fa-stopwatch"></i>
              Level 2
            </span>
            <span className="summary-item-value highlight">
              {urgencyLabel}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-item-label">
              <i className="fas fa-map-marker-alt"></i>
              Level 3
            </span>
            <span className="summary-item-value">
              {selectedAddressText}
            </span>
          </div>

          <div className="summary-item">
            <span className="summary-item-label">
              <i className="fas fa-wallet"></i>
              Level 4
            </span>
            <span className="summary-item-value highlight">
              {budgetType === "OPEN_BID"
                ? "Open to Quotes"
                : `₹${budgetAmount}`}
            </span>
          </div>

          {uploadedImagesCount > 0 && (
            <div className="summary-item">
              <span className="summary-item-label">
                <i className="fas fa-camera"></i>
                Photos
              </span>
              <span className="summary-item-value">
                {uploadedImagesCount} attached
              </span>
            </div>
          )}
        </div>

        <div className="summary-how-it-works">
          <div className="how-it-works-title">
            <i className="fas fa-info-circle text-primary"></i>
            What happens next?
          </div>
          <ul className="how-it-works-steps">
            <li>
              <i className="fas fa-check"></i>
              <span>Nearby verified pros receive your requirement.</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>Providers send quotes with pricing & availability.</span>
            </li>
            <li>
              <i className="fas fa-check"></i>
              <span>Compare ratings, chat in-app, and hire with confidence.</span>
            </li>
          </ul>
        </div>

        <div className="summary-actions">
          {currentLevel < 4 ? (
            <button
              type="button"
              onClick={onNextLevel}
              className="summary-submit-btn"
            >
              <span>Continue to Level {currentLevel + 1}</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          ) : (
            <button
              type="submit"
              disabled={isSubmitting || !agreedToPolicy}
              className="summary-submit-btn"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Posting Request...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane"></i>
                  <span>Post Request</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
