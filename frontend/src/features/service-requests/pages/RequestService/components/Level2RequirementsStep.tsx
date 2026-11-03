import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ServiceRequestInputType } from "../../../schemas/serviceRequest.schema";
import { getTodayDate, getEndOfWeekDate, getFlexibleDate } from "../../../utils/serviceDate.utils";

interface Level2RequirementsStepProps {
  register: UseFormRegister<ServiceRequestInputType>;
  errors: FieldErrors<ServiceRequestInputType>;
  urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
  titleValue: string;
  descriptionValue: string;
  onSelectUrgency: (urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE") => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Level2RequirementsStep({
  register,
  errors,
  urgency,
  titleValue,
  descriptionValue,
  onSelectUrgency,
  onPrev,
  onNext,
}: Level2RequirementsStepProps) {
  const minDate = getTodayDate();
  const todayDate = getTodayDate();
  const endOfWeekDate = getEndOfWeekDate();
  const flexibleDate = getFlexibleDate();

  return (
    <div className="request-section-card">
      <div className="request-section-header">
        <div className="request-step-badge">2</div>
        <div className="request-section-title-group">
          <h2>Level 2: Requirement Details</h2>
          <p>Provide specific details about the issue or task</p>
        </div>
      </div>

      <div className="request-form-group">
        <label className="request-form-label">
          <span>
            Requirement Title <span className="required-dot">*</span>
          </span>
          <span className="char-count">{(titleValue || "").length}/100</span>
        </label>
        <input
          type="text"
          required
          maxLength={100}
          className={`request-form-input ${errors.title ? "border-danger" : ""}`}
          placeholder="e.g. Washbasin pipe leaking heavily under cabinet"
          {...register("title")}
        />
        {errors.title && (
          <span className="text-danger text-xs mt-1 block">
            {errors.title.message}
          </span>
        )}
      </div>

      <div className="request-form-group">
        <label className="request-form-label">
          <span>
            Detailed Description <span className="required-dot">*</span>
          </span>
          <span className="char-count">{(descriptionValue || "").length}/1000</span>
        </label>
        <textarea
          required
          rows={4}
          maxLength={1000}
          className={`request-form-textarea ${errors.description ? "border-danger" : ""}`}
          placeholder="Describe the issue, work scope, materials available or needed, and any constraints..."
          {...register("description")}
        ></textarea>
        {errors.description && (
          <span className="text-danger text-xs mt-1 block">
            {errors.description.message}
          </span>
        )}
      </div>

      <div className="request-form-group">
        <label className="request-form-label">
          <span>
            When do you need this? <span className="required-dot">*</span>
          </span>
        </label>

        <div className="urgency-grid">
          <div
            className={`urgency-card ${urgency === "TODAY" ? "selected" : ""}`}
            onClick={() => onSelectUrgency("TODAY")}
          >
            <div className="urgency-icon text-primary">
              <i className="fas fa-calendar-day"></i>
            </div>
            <div className="urgency-title">Today</div>
            <div className="urgency-desc">{todayDate}</div>
          </div>

          <div
            className={`urgency-card ${urgency === "THIS_WEEK" ? "selected" : ""}`}
            onClick={() => onSelectUrgency("THIS_WEEK")}
          >
            <div className="urgency-icon text-info">
              <i className="fas fa-calendar-week"></i>
            </div>
            <div className="urgency-title">This Week</div>
            <div className="urgency-desc">By {endOfWeekDate}</div>
          </div>

          <div
            className={`urgency-card ${urgency === "SPECIFIC_DATE" ? "selected" : ""}`}
            onClick={() => onSelectUrgency("SPECIFIC_DATE")}
          >
            <div className="urgency-icon text-warning">
              <i className="fas fa-calendar-alt"></i>
            </div>
            <div className="urgency-title">Specific Date</div>
            <div className="urgency-desc">Choose a date</div>
          </div>

          <div
            className={`urgency-card ${urgency === "FLEXIBLE" ? "selected" : ""}`}
            onClick={() => onSelectUrgency("FLEXIBLE")}
          >
            <div className="urgency-icon text-secondary">
              <i className="fas fa-clock"></i>
            </div>
            <div className="urgency-title">Flexible</div>
            <div className="urgency-desc">By {flexibleDate}</div>
          </div>
        </div>
        {errors.urgency && (
          <span className="text-danger text-xs mt-1 block">
            {errors.urgency.message}
          </span>
        )}

        {urgency === "SPECIFIC_DATE" && (
          <div className="specific-date-selection-box">
            <label className="request-form-label">
              <span>Select Required Date <span className="required-dot">*</span></span>
            </label>
            <input
              type="date"
              min={minDate}
              className={`request-form-input ${errors.specificDate ? "border-danger" : ""}`}
              {...register("specificDate")}
            />
            {errors.specificDate && (
              <span className="text-danger text-xs mt-1 block">
                {errors.specificDate.message}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="level-navigation-bar">
        <button
          type="button"
          className="level-nav-back-btn"
          onClick={onPrev}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Level 1</span>
        </button>
        <button
          type="button"
          className="level-nav-next-btn"
          onClick={onNext}
        >
          <span>Continue to Level 3</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
