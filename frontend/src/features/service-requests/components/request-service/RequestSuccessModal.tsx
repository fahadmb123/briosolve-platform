import { Link } from "react-router-dom";

interface RequestSuccessModalProps {
  isOpen: boolean;
  categoryName?: string;
  subserviceName?: string;
  urgencyLabel: string;
  availableTimeFrom: string;
  availableTimeTo: string;
  locationLandmark?: string;
  onCloseAndReset: () => void;
}

export function RequestSuccessModal({
  isOpen,
  categoryName,
  subserviceName,
  urgencyLabel,
  availableTimeFrom,
  availableTimeTo,
  locationLandmark,
  onCloseAndReset,
}: RequestSuccessModalProps) {
  if (!isOpen) return null;

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="request-success-modal-overlay">
      <div className="request-success-modal">
        <div className="success-icon-badge">
          <i className="fas fa-check"></i>
        </div>
        <h3>Request Posted Successfully!</h3>
        <p>
          Your requirement has been posted to verified specialists in your area. You will receive notifications as soon as quotes arrive.
        </p>

        <div className="request-success-info-box">
          <div className="request-success-info-row">
            <span>Category:</span>
            <span>{categoryName || "N/A"}</span>
          </div>
          <div className="request-success-info-row">
            <span>Task:</span>
            <span>{subserviceName || "General"}</span>
          </div>
          <div className="request-success-info-row">
            <span>Schedule:</span>
            <span>
              {urgencyLabel} ({formatTime(availableTimeFrom)} - {formatTime(availableTimeTo)})
            </span>
          </div>
          <div className="request-success-info-row">
            <span>Location:</span>
            <span>{locationLandmark || "N/A"}</span>
          </div>
        </div>

        <div className="request-success-actions">
          <Link to="/dashboard" className="btn btn-primary">
            View in Dashboard
          </Link>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onCloseAndReset}
          >
            Post Another
          </button>
        </div>
      </div>
    </div>
  );
}
