import { useState, useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quotationSchema,
  type QuotationSchemaType
} from "../schemas/quotation.schema";
import type {
  QuotationFormData,
  QuotationType,
  QuotationValidity
} from "../types/quotation.types";

interface QuotationFormProps {
  initialValues?: Partial<QuotationFormData>;
  onSubmit: (data: QuotationFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onFormChange?: (data: Partial<QuotationFormData>) => void;
}

export const QuotationForm: FC<QuotationFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  onCancel,
  onFormChange
}) => {
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<QuotationSchemaType>({
    resolver: zodResolver(quotationSchema),
    mode: "onChange",
    defaultValues: {
      amount: initialValues?.amount || "",
      quotationType: initialValues?.quotationType || "FIXED",
      workDescription: initialValues?.workDescription || "",
      includedItems: initialValues?.includedItems || [
        "Labour charges",
        "Basic service inspection"
      ],
      excludedItems: initialValues?.excludedItems || [
        "Spare parts & materials"
      ],
      estimatedDuration: initialValues?.estimatedDuration || "1–2 hours",
      availableDateTime: initialValues?.availableDateTime || "Today 6:00 PM",
      messageToCustomer: initialValues?.messageToCustomer || "",
      validUntil: initialValues?.validUntil || "24_HOURS",
      extraChargePolicy:
        initialValues?.extraChargePolicy || "Spare parts at actual cost"
    }
  });

  const formValues = watch();

  useEffect(() => {
    if (onFormChange) {
      onFormChange({
        amount: formValues.amount as number | "",
        quotationType: formValues.quotationType,
        workDescription: formValues.workDescription,
        includedItems: formValues.includedItems,
        excludedItems: formValues.excludedItems,
        estimatedDuration: formValues.estimatedDuration,
        availableDateTime: formValues.availableDateTime,
        messageToCustomer: formValues.messageToCustomer,
        validUntil: formValues.validUntil,
        extraChargePolicy: formValues.extraChargePolicy
      });
    }
  }, [
    formValues.amount,
    formValues.quotationType,
    formValues.workDescription,
    formValues.includedItems,
    formValues.excludedItems,
    formValues.estimatedDuration,
    formValues.availableDateTime,
    formValues.messageToCustomer,
    formValues.validUntil,
    formValues.extraChargePolicy,
    onFormChange
  ]);

  const handleAddIncluded = (itemToAdd?: string) => {
    const text = (itemToAdd || includedInput).trim();
    if (!text) return;
    const current = formValues.includedItems || [];
    if (!current.includes(text)) {
      const updated = [...current, text];
      setValue("includedItems", updated, { shouldValidate: true });
    }
    if (!itemToAdd) {
      setIncludedInput("");
    }
  };

  const handleRemoveIncluded = (idxToRemove: number) => {
    const current = formValues.includedItems || [];
    const updated = current.filter((_, idx) => idx !== idxToRemove);
    setValue("includedItems", updated, { shouldValidate: true });
  };

  const handleAddExcluded = (itemToAdd?: string) => {
    const text = (itemToAdd || excludedInput).trim();
    if (!text) return;
    const current = formValues.excludedItems || [];
    if (!current.includes(text)) {
      const updated = [...current, text];
      setValue("excludedItems", updated, { shouldValidate: true });
    }
    if (!itemToAdd) {
      setExcludedInput("");
    }
  };

  const handleRemoveExcluded = (idxToRemove: number) => {
    const current = formValues.excludedItems || [];
    const updated = current.filter((_, idx) => idx !== idxToRemove);
    setValue("excludedItems", updated, { shouldValidate: true });
  };

  const quotationTypes: {
    type: QuotationType;
    label: string;
    badge: string;
    desc: string;
  }[] = [
    {
      type: "FIXED",
      label: "Fixed Price",
      badge: "Most Popular",
      desc: "Guaranteed final total for the agreed scope."
    },
    {
      type: "ESTIMATED",
      label: "Estimated Price",
      badge: "Flexible",
      desc: "Approximate amount subject to minor on-site variation."
    },
    {
      type: "INSPECTION_REQUIRED",
      label: "Inspection Required",
      badge: "Assessment",
      desc: "On-site visit needed before locking in final cost."
    }
  ];

  const validityOptions: { value: QuotationValidity; label: string }[] = [
    { value: "24_HOURS", label: "24 Hours" },
    { value: "48_HOURS", label: "48 Hours" },
    { value: "3_DAYS", label: "3 Days" },
    { value: "7_DAYS", label: "7 Days" }
  ];

  const durationSuggestions = [
    "30–45 mins",
    "1–2 hours",
    "2–4 hours",
    "Half day",
    "1 full day",
    "2–3 days"
  ];

  const includedSuggestions = [
    "Labour charges",
    "Basic service inspection",
    "Tools & equipment",
    "Post-service cleanup",
    "Gas pressure check"
  ];

  const excludedSuggestions = [
    "Spare parts & materials",
    "Major electrical repairs",
    "Transportation beyond 10km",
    "Civil or structural repair"
  ];

  const policySuggestions = [
    "Spare parts at actual cost",
    "No extra charges unless scope changes",
    "Additional labor charged at ₹250/hour",
    "Material invoice will be provided to customer"
  ];

  const onFormSubmit = (data: QuotationSchemaType) => {
    onSubmit({
      amount: Number(data.amount),
      quotationType: data.quotationType,
      workDescription: data.workDescription,
      includedItems: data.includedItems,
      excludedItems: data.excludedItems,
      estimatedDuration: data.estimatedDuration || "",
      availableDateTime: data.availableDateTime || "",
      messageToCustomer: data.messageToCustomer || "",
      validUntil: data.validUntil,
      extraChargePolicy: data.extraChargePolicy
    });
  };

  return (
    <form className="quote-form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <div className="quote-form-section">
        <div className="quote-section-title-row">
          <div className="quote-section-number">1</div>
          <div>
            <h4 className="quote-section-title">Pricing & Type</h4>
            <p className="quote-section-subtitle">
              Set clear expectations with transparent pricing and quotation structure
            </p>
          </div>
        </div>

        <div className="quote-type-selector">
          <label className="quote-field-label">
            Quotation Type <span className="quote-required-star">*</span>
          </label>
          <div className="quote-type-grid">
            {quotationTypes.map((item) => {
              const isSelected = formValues.quotationType === item.type;
              return (
                <div
                  key={item.type}
                  className={`quote-type-card ${isSelected ? "selected" : ""}`}
                  onClick={() => setValue("quotationType", item.type, { shouldValidate: true })}
                >
                  <div className="quote-type-card-top">
                    <span className="quote-type-name">{item.label}</span>
                    <span className="quote-type-badge">{item.badge}</span>
                  </div>
                  <p className="quote-type-desc">{item.desc}</p>
                  <div className="quote-type-radio-circle">
                    {isSelected && <div className="quote-type-radio-inner" />}
                  </div>
                </div>
              );
            })}
          </div>
          {errors.quotationType && (
            <span className="quote-error-text">{errors.quotationType.message}</span>
          )}
        </div>

        <div className="quote-field-row two-col">
          <div className="quote-field-group">
            <label className="quote-field-label" htmlFor="quotation-amount">
              Quotation Amount <span className="quote-required-star">*</span>
            </label>
            <div className="quote-input-prefix-wrapper">
              <span className="quote-currency-prefix">₹</span>
              <input
                id="quotation-amount"
                type="number"
                min="1"
                step="1"
                placeholder="2500"
                className={`quote-form-input quote-amount-input ${
                  errors.amount ? "has-error" : ""
                }`}
                {...register("amount")}
              />
            </div>
            {errors.amount && (
              <span className="quote-error-text">{errors.amount.message}</span>
            )}
            <span className="quote-field-hint">
              Enter total proposed price or base labor charge
            </span>
          </div>

          <div className="quote-field-group">
            <label className="quote-field-label">
              Quote Valid Until <span className="quote-required-star">*</span>
            </label>
            <div className="quote-validity-options">
              {validityOptions.map((opt) => {
                const isSelected = formValues.validUntil === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`quote-pill-btn ${isSelected ? "active" : ""}`}
                    onClick={() => setValue("validUntil", opt.value, { shouldValidate: true })}
                  >
                    <i className="far fa-clock"></i>
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
            {errors.validUntil && (
              <span className="quote-error-text">{errors.validUntil.message}</span>
            )}
            <span className="quote-field-hint">
              Customer must accept within this timeframe
            </span>
          </div>
        </div>
      </div>

      <div className="quote-form-section">
        <div className="quote-section-title-row">
          <div className="quote-section-number">2</div>
          <div>
            <h4 className="quote-section-title">Scope of Work & Deliverables</h4>
            <p className="quote-section-subtitle">
              Clearly specify what you will do to prevent misunderstandings
            </p>
          </div>
        </div>

        <div className="quote-field-group">
          <label className="quote-field-label" htmlFor="work-description">
            Work Description <span className="quote-required-star">*</span>
          </label>
          <textarea
            id="work-description"
            rows={3}
            placeholder="e.g. AC gas refill and basic service. Full diagnosis, vacuuming, leak check, high-grade refrigerant refilling and filter cleaning."
            className={`quote-form-textarea ${errors.workDescription ? "has-error" : ""}`}
            {...register("workDescription")}
          />
          <div className="quote-textarea-footer">
            {errors.workDescription ? (
              <span className="quote-error-text">{errors.workDescription.message}</span>
            ) : (
              <span className="quote-field-hint">
                Briefly summarize the exact job scope
              </span>
            )}
            <span className="quote-char-counter">
              {(formValues.workDescription || "").length}/1000
            </span>
          </div>
        </div>

        <div className="quote-field-group">
          <label className="quote-field-label">
            What is Included <span className="quote-required-star">*</span>
          </label>
          <div className="quote-tag-builder">
            <div className="quote-tag-input-row">
              <input
                type="text"
                placeholder="Add included item (e.g. Labour, basic service, gas check)"
                value={includedInput}
                onChange={(e) => setIncludedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddIncluded();
                  }
                }}
                className="quote-form-input"
              />
              <button
                type="button"
                className="quote-btn-add-item"
                onClick={() => handleAddIncluded()}
              >
                <i className="fas fa-plus"></i>
                <span>Add Item</span>
              </button>
            </div>

            <div className="quote-chip-suggestions">
              <span className="quote-suggestion-label">Suggestions:</span>
              {includedSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="quote-suggest-chip"
                  onClick={() => handleAddIncluded(item)}
                >
                  + {item}
                </button>
              ))}
            </div>

            <div className="quote-items-list included">
              {formValues.includedItems && formValues.includedItems.length > 0 ? (
                formValues.includedItems.map((item, idx) => (
                  <div key={idx} className="quote-item-badge included">
                    <i className="fas fa-check-circle"></i>
                    <span>{item}</span>
                    <button
                      type="button"
                      className="quote-item-remove-btn"
                      onClick={() => handleRemoveIncluded(idx)}
                      aria-label={`Remove ${item}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              ) : (
                <div className="quote-empty-tags-note">
                  No inclusions added yet. Please add at least one item.
                </div>
              )}
            </div>
            {errors.includedItems && (
              <span className="quote-error-text">{errors.includedItems.message}</span>
            )}
          </div>
        </div>

        <div className="quote-field-group">
          <label className="quote-field-label">
            What is Not Included <span className="quote-required-star">*</span>
          </label>
          <div className="quote-tag-builder">
            <div className="quote-tag-input-row">
              <input
                type="text"
                placeholder="Add excluded item (e.g. Spare parts, major repair)"
                value={excludedInput}
                onChange={(e) => setExcludedInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddExcluded();
                  }
                }}
                className="quote-form-input"
              />
              <button
                type="button"
                className="quote-btn-add-item"
                onClick={() => handleAddExcluded()}
              >
                <i className="fas fa-plus"></i>
                <span>Add Item</span>
              </button>
            </div>

            <div className="quote-chip-suggestions">
              <span className="quote-suggestion-label">Suggestions:</span>
              {excludedSuggestions.map((item) => (
                <button
                  key={item}
                  type="button"
                  className="quote-suggest-chip"
                  onClick={() => handleAddExcluded(item)}
                >
                  + {item}
                </button>
              ))}
            </div>

            <div className="quote-items-list excluded">
              {formValues.excludedItems && formValues.excludedItems.length > 0 ? (
                formValues.excludedItems.map((item, idx) => (
                  <div key={idx} className="quote-item-badge excluded">
                    <i className="fas fa-times-circle"></i>
                    <span>{item}</span>
                    <button
                      type="button"
                      className="quote-item-remove-btn"
                      onClick={() => handleRemoveExcluded(idx)}
                      aria-label={`Remove ${item}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                ))
              ) : (
                <div className="quote-empty-tags-note">
                  No exclusions added yet. Listing exclusions prevents customer complaints.
                </div>
              )}
            </div>
            {errors.excludedItems && (
              <span className="quote-error-text">{errors.excludedItems.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="quote-form-section">
        <div className="quote-section-title-row">
          <div className="quote-section-number">3</div>
          <div>
            <h4 className="quote-section-title">Timeline & Availability</h4>
            <p className="quote-section-subtitle">
              Inform the customer when you can start and how long it takes
            </p>
          </div>
        </div>

        <div className="quote-field-row two-col">
          <div className="quote-field-group">
            <div className="quote-label-with-tag">
              <label className="quote-field-label" htmlFor="estimated-duration">
                Estimated Duration
              </label>
              <span className="quote-recommended-tag">Recommended</span>
            </div>
            <input
              id="estimated-duration"
              type="text"
              placeholder="e.g. 1–2 hours"
              className="quote-form-input"
              {...register("estimatedDuration")}
            />
            <div className="quote-chip-suggestions">
              {durationSuggestions.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  className="quote-suggest-chip"
                  onClick={() => setValue("estimatedDuration", dur, { shouldValidate: true })}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          <div className="quote-field-group">
            <div className="quote-label-with-tag">
              <label className="quote-field-label" htmlFor="available-datetime">
                Available Date / Time
              </label>
              <span className="quote-recommended-tag">Recommended</span>
            </div>
            <input
              id="available-datetime"
              type="text"
              placeholder="e.g. Today 6 PM or Tomorrow 10 AM"
              className="quote-form-input"
              {...register("availableDateTime")}
            />
            <div className="quote-chip-suggestions">
              {["Today 6 PM", "Tomorrow 10 AM", "Tomorrow 4 PM", "This Saturday"].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className="quote-suggest-chip"
                  onClick={() => setValue("availableDateTime", slot, { shouldValidate: true })}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="quote-form-section">
        <div className="quote-section-title-row">
          <div className="quote-section-number">4</div>
          <div>
            <h4 className="quote-section-title">Policies & Note to Customer</h4>
            <p className="quote-section-subtitle">
              Maintain full transparency regarding extra charges and personal note
            </p>
          </div>
        </div>

        <div className="quote-field-group">
          <div className="quote-label-with-tag">
            <label className="quote-field-label" htmlFor="extra-charge-policy">
              Extra-charge Policy <span className="quote-required-star">*</span>
            </label>
            <span className="quote-important-tag">Important</span>
          </div>
          <input
            id="extra-charge-policy"
            type="text"
            placeholder="e.g. Spare parts at actual cost"
            className={`quote-form-input ${errors.extraChargePolicy ? "has-error" : ""}`}
            {...register("extraChargePolicy")}
          />
          <div className="quote-chip-suggestions">
            {policySuggestions.map((pol) => (
              <button
                key={pol}
                type="button"
                className="quote-suggest-chip"
                onClick={() => setValue("extraChargePolicy", pol, { shouldValidate: true })}
              >
                {pol}
              </button>
            ))}
          </div>
          {errors.extraChargePolicy && (
            <span className="quote-error-text">{errors.extraChargePolicy.message}</span>
          )}
        </div>

        <div className="quote-field-group">
          <div className="quote-label-with-tag">
            <label className="quote-field-label" htmlFor="message-to-customer">
              Message to Customer
            </label>
            <span className="quote-recommended-tag">Recommended</span>
          </div>
          <textarea
            id="message-to-customer"
            rows={2}
            placeholder="e.g. I can come today evening. I will bring original refrigerant and tools."
            className="quote-form-textarea"
            {...register("messageToCustomer")}
          />
          <span className="quote-field-hint">
            A polite, professional note increases your chance of getting accepted by 40%
          </span>
        </div>
      </div>

      <div className="quote-form-actions">
        {onCancel && (
          <button
            type="button"
            className="quote-btn-cancel"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="quote-btn-submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Submitting Quote...</span>
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i>
              <span>Send Quotation to Customer</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
