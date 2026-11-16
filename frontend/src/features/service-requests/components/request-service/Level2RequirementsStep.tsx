import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { ServiceRequestInputType } from "../../schemas/serviceRequest.schema";
import { getTodayDate, getEndOfWeekDate, getFlexibleDate } from "../../utils/serviceDate.utils";
import type { ServiceQuestion } from "./types";

interface Level2RequirementsStepProps {
  register: UseFormRegister<ServiceRequestInputType>;
  errors: FieldErrors<ServiceRequestInputType>;
  urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE";
  titleValue: string;
  descriptionValue: string;
  onSelectUrgency: (urgency: "TODAY" | "THIS_WEEK" | "SPECIFIC_DATE" | "FLEXIBLE") => void;
  onPrev: () => void;
  onNext: () => void;
  questions?: ServiceQuestion[] | null;
  answers: Record<string, any>;
  onAnswerChange: (questionId: string, value: any) => void;
  questionErrors?: Record<string, string>;
  subserviceName?: string;
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
  questions,
  answers,
  onAnswerChange,
  questionErrors,
  subserviceName
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

      {questions && questions.length > 0 && (
        <div className="request-form-group">
          <div className="mb-2">
            <label className="request-form-label mb-0">
              <span>
                Specific Questions ({subserviceName || "Selected Service"})
              </span>
            </label>
            <span className="text-xs text-secondary">
              Please answer these questions to help providers provide accurate quotes.
            </span>
          </div>

          <div className="flex flex-col gap-4 p-4 bg-surface rounded-xl border border-border mt-2">
            {questions.map((q) => {
              const currentVal = answers[q.id];
              const hasError = !!questionErrors?.[q.id];

              return (
                <div key={q.id} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-text flex items-center gap-1">
                    <span>{q.label}</span>
                    {q.is_required && <span className="text-danger">*</span>}
                  </label>

                  {q.type === "TEXT" && (
                    <input
                      type="text"
                      className={`request-form-input ${hasError ? "border-danger" : ""}`}
                      placeholder={q.placeholder || "Enter details..."}
                      value={typeof currentVal === "string" ? currentVal : ""}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    />
                  )}

                  {q.type === "NUMBER" && (
                    <input
                      type="number"
                      className={`request-form-input ${hasError ? "border-danger" : ""}`}
                      placeholder={q.placeholder || "e.g. 2"}
                      value={currentVal !== undefined && currentVal !== null ? currentVal : ""}
                      onChange={(e) => onAnswerChange(q.id, e.target.value === "" ? "" : Number(e.target.value))}
                    />
                  )}

                  {q.type === "SELECT" && (
                    <select
                      className={`request-form-input ${hasError ? "border-danger" : ""}`}
                      value={typeof currentVal === "string" ? currentVal : ""}
                      onChange={(e) => onAnswerChange(q.id, e.target.value)}
                    >
                      <option value="">Select an option...</option>
                      {(q.options || []).map((opt, oIdx) => (
                        <option key={oIdx} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  )}

                  {q.type === "MULTI_SELECT" && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {(q.options || []).map((opt, oIdx) => {
                        const selectedArray = Array.isArray(currentVal) ? currentVal : [];
                        const isChecked = selectedArray.includes(opt);
                        return (
                          <button
                            key={oIdx}
                            type="button"
                            onClick={() => {
                              if (isChecked) {
                                onAnswerChange(q.id, selectedArray.filter((item: string) => item !== opt));
                              } else {
                                onAnswerChange(q.id, [...selectedArray, opt]);
                              }
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                              isChecked
                                ? "bg-primary text-white border-primary"
                                : "bg-surface hover:bg-surface-hover border-border text-text"
                            }`}
                          >
                            <i className={`fas ${isChecked ? "fa-check-square mr-1.5" : "fa-square mr-1.5 opacity-40"}`}></i>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {q.type === "BOOLEAN" && (
                    <div className="flex gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => onAnswerChange(q.id, true)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                          currentVal === true
                            ? "bg-primary text-white border-primary"
                            : "bg-surface hover:bg-surface-hover border-border text-text"
                        }`}
                      >
                        <i className="fas fa-check"></i>
                        <span>Yes</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onAnswerChange(q.id, false)}
                        className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
                          currentVal === false
                            ? "bg-primary text-white border-primary"
                            : "bg-surface hover:bg-surface-hover border-border text-text"
                        }`}
                      >
                        <i className="fas fa-times"></i>
                        <span>No</span>
                      </button>
                    </div>
                  )}

                  {hasError && (
                    <span className="text-danger text-xs mt-0.5 block">
                      {questionErrors[q.id]}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

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
