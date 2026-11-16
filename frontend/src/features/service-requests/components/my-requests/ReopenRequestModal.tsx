import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import type { CustomerServiceRequestItem, RequestUrgency } from "../../types/serviceRequest.types";
import type { ReopenServiceRequestPayload } from "../../services/serviceRequest.service";
import {
  getTodayDate,
  getEndOfWeekDate,
  getFlexibleDate,
  computeDateForUrgency
} from "../../utils/serviceDate.utils";

interface ReopenRequestModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  isReopening: boolean;
  onClose: () => void;
  onConfirm: (data: ReopenServiceRequestPayload) => void;
}

export const ReopenRequestModal: React.FC<ReopenRequestModalProps> = ({
  request,
  isOpen,
  isReopening,
  onClose,
  onConfirm
}) => {
  const [urgency, setUrgency] = useState<RequestUrgency>("THIS_WEEK");
  const [specificDate, setSpecificDate] = useState<string>(getEndOfWeekDate());
  const [timeFrom, setTimeFrom] = useState<string>("09:00");
  const [timeTo, setTimeTo] = useState<string>("17:00");

  useEffect(() => {
    if (request) {
      const now = new Date();
      const currentHour = now.getHours();

      if (currentHour >= 17) {
        setUrgency("THIS_WEEK");
        setSpecificDate(getEndOfWeekDate());
        setTimeFrom("09:00");
        setTimeTo("17:00");
      } else {
        setUrgency("TODAY");
        setSpecificDate(getTodayDate());
        const startHour = Math.min(Math.max(currentHour + 1, 9), 20);
        const endHour = Math.min(startHour + 4, 22);
        setTimeFrom(`${String(startHour).padStart(2, "0")}:00`);
        setTimeTo(`${String(endHour).padStart(2, "0")}:00`);
      }
    }
  }, [request]);

  if (!isOpen || !request) return null;

  const minDate = getTodayDate();
  const todayDate = getTodayDate();
  const endOfWeekDate = getEndOfWeekDate();
  const flexibleDate = getFlexibleDate();

  const handleUrgencySelect = (selectedUrgency: RequestUrgency) => {
    setUrgency(selectedUrgency);
    const computed = computeDateForUrgency(selectedUrgency, specificDate);
    setSpecificDate(computed);

    if (selectedUrgency === "TODAY") {
      const now = new Date();
      const currentHour = now.getHours();
      if (currentHour >= 17) {
        setTimeFrom(`${String(currentHour).padStart(2, "0")}:00`);
        setTimeTo("23:00");
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (timeFrom >= timeTo) {
      toast.error("Available end time must be later than start time");
      return;
    }

    const resolvedDate = specificDate || computeDateForUrgency(urgency);
    const today = getTodayDate();

    if (resolvedDate === today) {
      const [hours, minutes] = timeTo.split(":").map(Number);
      const now = new Date();
      const deadline = new Date();
      deadline.setHours(
        !isNaN(hours) ? hours : 23,
        !isNaN(minutes) ? minutes : 59,
        59,
        999
      );

      if (now.getTime() >= deadline.getTime()) {
        toast.error("The selected time for today has already passed. Please choose a future time or date.");
        return;
      }
    } else if (resolvedDate < today) {
      toast.error("Selected date cannot be in the past");
      return;
    }

    onConfirm({
      urgency,
      specificDate: resolvedDate,
      availableTimeFrom: timeFrom,
      availableTimeTo: timeTo
    });
  };

  return (
    <div className="myreq-modal-overlay" onClick={onClose}>
      <div
        className="myreq-modal-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        style={{ maxWidth: 540 }}
      >
        <div className="myreq-modal-header">
          <div className="myreq-modal-header-titles">
            <div className="myreq-modal-header-tag-row">
              <span className="myreq-modal-category">
                <i className="fas fa-redo-alt"></i>
                <span>Reopen Service Request</span>
              </span>
              <span className="myreq-edit-badge restricted">
                <i className="fas fa-history"></i> Expired
              </span>
            </div>
            <h2 className="myreq-modal-title">{request.title}</h2>
          </div>

          <button
            type="button"
            className="myreq-modal-btn-close"
            onClick={onClose}
            disabled={isReopening}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="myreq-edit-form">
          <div className="myreq-modal-content-scroll">
            <div
              className="myreq-restriction-callout"
              style={{
                background: "rgba(255, 121, 0, 0.06)",
                borderColor: "rgba(255, 121, 0, 0.2)",
                color: "var(--text, #09090b)"
              }}
            >
              <i
                className="fas fa-info-circle myreq-restriction-icon"
                style={{ color: "var(--primary, #FF7900)" }}
              ></i>
              <div>
                <strong style={{ color: "var(--text, #09090b)" }}>
                  Select a New Schedule
                </strong>
                <p
                  style={{
                    color: "var(--text-secondary, #71717a)",
                    margin: "0.2rem 0 0 0"
                  }}
                >
                  Updating your timeline will reactivate this request and notify verified providers in your area so you can receive quotes.
                </p>
              </div>
            </div>

            <div className="myreq-edit-field">
              <label className="myreq-edit-label">
                <span>Timeline & Urgency</span>
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    color: "var(--text-muted, #71717a)"
                  }}
                >
                  {urgency === "TODAY" && `Today (${todayDate})`}
                  {urgency === "THIS_WEEK" && `By end of week (${endOfWeekDate})`}
                  {urgency === "FLEXIBLE" && `Flexible (by ${flexibleDate})`}
                  {urgency === "SPECIFIC_DATE" && "Pick date below"}
                </span>
              </label>
              <div className="myreq-urgency-pill-row">
                {(
                  [
                    { key: "TODAY", label: "Today" },
                    { key: "THIS_WEEK", label: "This Week" },
                    { key: "SPECIFIC_DATE", label: "Specific Date" },
                    { key: "FLEXIBLE", label: "Flexible" }
                  ] as const
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`myreq-urgency-tab-btn ${
                      urgency === item.key ? "active" : ""
                    }`}
                    onClick={() => handleUrgencySelect(item.key)}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {urgency === "SPECIFIC_DATE" && (
              <div className="myreq-edit-field">
                <label className="myreq-edit-label">Preferred Date</label>
                <input
                  type="date"
                  value={specificDate}
                  min={minDate}
                  onChange={(e) => setSpecificDate(e.target.value)}
                  className="myreq-edit-input"
                  required
                />
              </div>
            )}

            <div className="myreq-edit-grid-2">
              <div className="myreq-edit-field">
                <label className="myreq-edit-label">Available From</label>
                <input
                  type="time"
                  value={timeFrom}
                  onChange={(e) => setTimeFrom(e.target.value)}
                  className="myreq-edit-input"
                  required
                />
              </div>

              <div className="myreq-edit-field">
                <label className="myreq-edit-label">Available To</label>
                <input
                  type="time"
                  value={timeTo}
                  onChange={(e) => setTimeTo(e.target.value)}
                  className="myreq-edit-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="myreq-modal-footer">
            <button
              type="button"
              className="myreq-btn-subtle"
              onClick={onClose}
              disabled={isReopening}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="myreq-btn-post"
              disabled={isReopening}
            >
              {isReopening ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Reopening...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-redo-alt"></i>
                  <span>Confirm & Reopen</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
