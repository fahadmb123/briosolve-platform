import { useState, useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  quotationSchema,
  type QuotationInputType
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
  const [tagError, setTagError] = useState<{ included?: string; excluded?: string }>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isValid }
  } = useForm<QuotationInputType>({
    resolver: zodResolver(quotationSchema),
    mode: "onChange",
    defaultValues: {
      amount: initialValues?.amount !== undefined ? initialValues.amount : 2500,
      quotationType: initialValues?.quotationType || "FIXED",
      workDescription:
        initialValues?.workDescription ||
        "AC gas refill and basic service. Complete vacuuming, leak check, high-grade refrigerant refilling and filter cleaning.",
      includedItems: initialValues?.includedItems || [
        "Labour charges",
        "Basic service inspection",
        "Gas check"
      ],
      excludedItems: initialValues?.excludedItems || [
        "Spare parts & materials",
        "Major repair"
      ],
      estimatedDuration: initialValues?.estimatedDuration || "1–2 hours",
      availableDateTime: initialValues?.availableDateTime || "Today 6:00 PM",
      messageToCustomer: initialValues?.messageToCustomer || "I can come today evening.",
      validUntil: (initialValues?.validUntil as QuotationValidity) || "24_HOURS",
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
    if (!text) {
      setTagError((prev) => ({
        ...prev,
        included: "Please enter an item name"
      }));
      return;
    }
    if (text.length < 2) {
      setTagError((prev) => ({
        ...prev,
        included: "Item must be at least 2 characters"
      }));
      return;
    }
    setTagError((prev) => ({ ...prev, included: undefined }));
    const current = formValues.includedItems || [];
    if (!current.includes(text)) {
      const updated = [...current, text];
      setValue("includedItems", updated, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
    if (!itemToAdd) {
      setIncludedInput("");
    }
  };

  const handleRemoveIncluded = (idxToRemove: number) => {
    const current = formValues.includedItems || [];
    const updated = current.filter((_, idx) => idx !== idxToRemove);
    setValue("includedItems", updated, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleAddExcluded = (itemToAdd?: string) => {
    const text = (itemToAdd || excludedInput).trim();
    if (!text) {
      setTagError((prev) => ({
        ...prev,
        excluded: "Please enter an item name"
      }));
      return;
    }
    if (text.length < 2) {
      setTagError((prev) => ({
        ...prev,
        excluded: "Item must be at least 2 characters"
      }));
      return;
    }
    setTagError((prev) => ({ ...prev, excluded: undefined }));
    const current = formValues.excludedItems || [];
    if (!current.includes(text)) {
      const updated = [...current, text];
      setValue("excludedItems", updated, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
    if (!itemToAdd) {
      setExcludedInput("");
    }
  };

  const handleRemoveExcluded = (idxToRemove: number) => {
    const current = formValues.excludedItems || [];
    const updated = current.filter((_, idx) => idx !== idxToRemove);
    setValue("excludedItems", updated, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const quotationTypes: {
    type: QuotationType;
    label: string;
    icon: string;
    badge: string;
    desc: string;
  }[] = [
    {
      type: "FIXED",
      label: "Fixed Price",
      icon: "fa-tag",
      badge: "Guaranteed",
      desc: "Final guaranteed price for the defined job scope."
    },
    {
      type: "ESTIMATED",
      label: "Estimated Price",
      icon: "fa-sliders-h",
      badge: "Flexible",
      desc: "Approximate price subject to minor on-site variation."
    },
    {
      type: "INSPECTION_REQUIRED",
      label: "Inspection Required",
      icon: "fa-search-location",
      badge: "Assessment",
      desc: "Requires visiting the site before finalizing the total."
    }
  ];

  const validityOptions: {
    value: QuotationValidity;
    label: string;
    hint: string;
  }[] = [
    { value: "24_HOURS", label: "24 Hours", hint: "Recommended for fast response" },
    { value: "48_HOURS", label: "48 Hours", hint: "Gives customer 2 days" },
    { value: "3_DAYS", label: "3 Days", hint: "Good for large scope" },
    { value: "7_DAYS", label: "7 Days", hint: "Maximum validity" }
  ];

  const durationSuggestions = [
    "30–45 mins",
    "1–2 hours",
    "2–4 hours",
    "Half day (4–5 hrs)",
    "1 full day",
    "2–3 days"
  ];

  const timeSlotSuggestions = [
    "Today 6:00 PM",
    "Tomorrow morning (9 AM–12 PM)",
    "Tomorrow afternoon (2 PM–5 PM)",
    "Tomorrow evening (6 PM–8 PM)",
    "This Saturday morning",
    "Immediate / Within 2 hours"
  ];

  const includedSuggestions = [
    "Labour charges",
    "Basic service inspection",
    "Gas check & top-up",
    "Required equipment & tools",
    "Post-service cleanup",
    "30-day service warranty"
  ];

  const excludedSuggestions = [
    "Spare parts & materials",
    "Major component repair",
    "Transportation beyond 10km",
    "Structural & civil work",
    "High-voltage wiring changes"
  ];

  const policySuggestions = [
    "Spare parts at actual cost",
    "No extra charges unless scope changes",
    "Material bill with GST provided to customer",
    "Additional labor charged at ₹250/hour"
  ];

  const presetAmounts = [1500, 2500, 3500, 5000];

  const onFormSubmit = (data: QuotationInputType) => {
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

  const isSection1Complete = Boolean(
    !errors.amount &&
    !errors.quotationType &&
    !errors.validUntil &&
    formValues.amount &&
    Number(formValues.amount) >= 50
  );

  const isSection2Complete = Boolean(
    !errors.workDescription &&
    !errors.includedItems &&
    !errors.excludedItems &&
    (formValues.workDescription || "").trim().length >= 15 &&
    (formValues.includedItems || []).length > 0 &&
    (formValues.excludedItems || []).length > 0
  );

  const isSection3Complete = Boolean(
    !errors.estimatedDuration &&
    !errors.availableDateTime &&
    (formValues.estimatedDuration || formValues.availableDateTime)
  );

  const isSection4Complete = Boolean(
    !errors.extraChargePolicy &&
    !errors.messageToCustomer &&
    (formValues.extraChargePolicy || "").trim().length >= 5
  );

  return (
    <form className="quote-form" onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <div className={`quote-form-section ${isSection1Complete ? "section-complete" : ""}`}>
        <div className="quote-section-title-row">
          <div className="quote-section-number">
            {isSection1Complete ? <i className="fas fa-check"></i> : "1"}
          </div>
          <div className="quote-section-meta">
            <div className="quote-section-badge-row">
              <span className="quote-section-pill">Step 1 of 4</span>
              {isSection1Complete ? (
                <span className="quote-status-pill ready">Completed</span>
              ) : (
                <span className="quote-status-pill pending">Required Fields</span>
              )}
            </div>
            <h4 className="quote-section-title">Quotation Pricing & Type</h4>
            <p className="quote-section-subtitle">
              Define your quotation type, amount, and how long this offer stays valid
            </p>
          </div>
        </div>

        <div className="quote-field-group">
          <div className="quote-label-with-tag">
            <label className="quote-field-label">
              Quotation Type <span className="quote-required-star">*</span>
            </label>
            <span className="quote-field-help">Choose the billing model</span>
          </div>

          <div className="quote-type-grid">
            {quotationTypes.map((item) => {
              const isSelected = formValues.quotationType === item.type;
              return (
                <div
                  key={item.type}
                  className={`quote-type-card ${isSelected ? "selected" : ""}`}
                  onClick={() => {
                    setValue("quotationType", item.type, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                  role="button"
                  tabIndex={0}
                >
                  <div className="quote-type-card-top">
                    <div className="quote-type-icon-name">
                      <i className={`fas ${item.icon} quote-type-main-icon`}></i>
                      <span className="quote-type-name">{item.label}</span>
                    </div>
                    <span className="quote-type-badge">{item.badge}</span>
                  </div>
                  <p className="quote-type-desc">{item.desc}</p>
                  <div className="quote-type-radio-circle">
                    {isSelected && <i className="fas fa-check quote-type-check-icon"></i>}
                  </div>
                </div>
              );
            })}
          </div>
          {errors.quotationType && (
            <div className="quote-field-error-msg">
              <i className="fas fa-circle-exclamation"></i>
              <span>{errors.quotationType.message}</span>
            </div>
          )}
        </div>

        <div className="quote-field-row two-col">
          <div className="quote-field-group">
            <div className="quote-label-with-tag">
              <label className="quote-field-label" htmlFor="quotation-amount">
                Quotation Amount <span className="quote-required-star">*</span>
              </label>
              <span className="quote-important-tag">In INR (₹)</span>
            </div>
            <div className="quote-input-prefix-wrapper">
              <span className="quote-currency-prefix">₹</span>
              <input
                id="quotation-amount"
                type="number"
                min="50"
                max="1000000"
                step="1"
                placeholder="2500"
                className={`quote-form-input quote-amount-input ${
                  errors.amount ? "has-error is-invalid" : formValues.amount ? "is-valid" : ""
                }`}
                {...register("amount")}
              />
              {formValues.amount && !errors.amount && (
                <i className="fas fa-check-circle quote-input-success-icon"></i>
              )}
            </div>

            <div className="quote-amount-presets">
              <span className="quote-preset-label">Quick set:</span>
              {presetAmounts.map((amt) => (
                <button
                  key={amt}
                  type="button"
                  className={`quote-amt-chip ${Number(formValues.amount) === amt ? "active" : ""}`}
                  onClick={() => {
                    setValue("amount", amt, { shouldValidate: true, shouldDirty: true });
                  }}
                >
                  ₹{amt.toLocaleString("en-IN")}
                </button>
              ))}
            </div>

            {errors.amount ? (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{errors.amount.message}</span>
              </div>
            ) : formValues.amount ? (
              <span className="quote-field-hint success-hint">
                <i className="fas fa-info-circle"></i>
                Total quotation: ₹{Number(formValues.amount).toLocaleString("en-IN")}
              </span>
            ) : (
              <span className="quote-field-hint">
                Minimum amount is ₹50, maximum is ₹10,00,000
              </span>
            )}
          </div>

          <div className="quote-field-group">
            <div className="quote-label-with-tag">
              <label className="quote-field-label">
                Valid Until <span className="quote-required-star">*</span>
              </label>
              <span className="quote-field-help">Quote expiry</span>
            </div>

            <div className="quote-validity-grid">
              {validityOptions.map((opt) => {
                const isSelected = formValues.validUntil === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    className={`quote-validity-btn ${isSelected ? "active" : ""}`}
                    onClick={() => {
                      setValue("validUntil", opt.value, {
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                  >
                    <div className="quote-validity-btn-top">
                      <i className="far fa-clock"></i>
                      <span className="quote-validity-title">{opt.label}</span>
                    </div>
                    <span className="quote-validity-hint">{opt.hint}</span>
                  </button>
                );
              })}
            </div>

            {errors.validUntil && (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{errors.validUntil.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`quote-form-section ${isSection2Complete ? "section-complete" : ""}`}>
        <div className="quote-section-title-row">
          <div className="quote-section-number">
            {isSection2Complete ? <i className="fas fa-check"></i> : "2"}
          </div>
          <div className="quote-section-meta">
            <div className="quote-section-badge-row">
              <span className="quote-section-pill">Step 2 of 4</span>
              {isSection2Complete ? (
                <span className="quote-status-pill ready">Completed</span>
              ) : (
                <span className="quote-status-pill pending">Required Fields</span>
              )}
            </div>
            <h4 className="quote-section-title">Work Description & Scope Deliverables</h4>
            <p className="quote-section-subtitle">
              Clearly spell out the work scope and list exact inclusions and exclusions
            </p>
          </div>
        </div>

        <div className="quote-field-group">
          <div className="quote-label-with-tag">
            <label className="quote-field-label" htmlFor="work-description">
              Work Description <span className="quote-required-star">*</span>
            </label>
            <span className="quote-char-counter">
              {(formValues.workDescription || "").length}/1000 characters
            </span>
          </div>

          <textarea
            id="work-description"
            rows={3}
            placeholder="e.g. AC gas refill and basic service. Complete vacuuming, leak check, high-grade refrigerant refilling and filter cleaning."
            className={`quote-form-textarea ${
              errors.workDescription ? "has-error is-invalid" : formValues.workDescription ? "is-valid" : ""
            }`}
            {...register("workDescription")}
          />

          {errors.workDescription ? (
            <div className="quote-field-error-msg">
              <i className="fas fa-circle-exclamation"></i>
              <span>{errors.workDescription.message}</span>
            </div>
          ) : (
            <span className="quote-field-hint">
              Be specific about the diagnostic and servicing steps you will take
            </span>
          )}
        </div>

        <div className="quote-field-group">
          <div className="quote-label-with-tag">
            <label className="quote-field-label">
              What is Included <span className="quote-required-star">*</span>
            </label>
            <span className="quote-badge-count-tag">
              {(formValues.includedItems || []).length} included
            </span>
          </div>

          <div className="quote-tag-builder">
            <div className="quote-tag-input-row">
              <div className="quote-tag-input-icon-wrap">
                <i className="fas fa-check-circle text-green"></i>
                <input
                  type="text"
                  placeholder="e.g. Labour, basic service, gas check"
                  value={includedInput}
                  onChange={(e) => {
                    setIncludedInput(e.target.value);
                    if (tagError.included) {
                      setTagError((prev) => ({ ...prev, included: undefined }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddIncluded();
                    }
                  }}
                  className="quote-form-input tag-input"
                />
              </div>
              <button
                type="button"
                className="quote-btn-add-item primary"
                onClick={() => handleAddIncluded()}
              >
                <i className="fas fa-plus"></i>
                <span>Add Inclusion</span>
              </button>
            </div>

            {tagError.included && (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{tagError.included}</span>
              </div>
            )}

            <div className="quote-chip-suggestions">
              <span className="quote-suggestion-label">Suggested Inclusions:</span>
              {includedSuggestions
                .filter((item) => !(formValues.includedItems || []).includes(item))
                .slice(0, 4)
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="quote-suggest-chip included"
                    onClick={() => handleAddIncluded(item)}
                  >
                    <i className="fas fa-plus"></i>
                    <span>{item}</span>
                  </button>
                ))}
            </div>

            <div className="quote-items-list included">
              {formValues.includedItems && formValues.includedItems.length > 0 ? (
                formValues.includedItems.map((item, idx) => (
                  <div key={idx} className="quote-item-badge included">
                    <i className="fas fa-check-circle text-green"></i>
                    <span className="quote-item-text">{item}</span>
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
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>No inclusions specified yet. Please add at least 1 item.</span>
                </div>
              )}
            </div>

            {errors.includedItems && (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{errors.includedItems.message}</span>
              </div>
            )}
          </div>
        </div>

        <div className="quote-field-group">
          <div className="quote-label-with-tag">
            <label className="quote-field-label">
              What is Not Included <span className="quote-required-star">*</span>
            </label>
            <span className="quote-badge-count-tag excluded">
              {(formValues.excludedItems || []).length} excluded
            </span>
          </div>

          <div className="quote-tag-builder">
            <div className="quote-tag-input-row">
              <div className="quote-tag-input-icon-wrap">
                <i className="fas fa-minus-circle text-amber"></i>
                <input
                  type="text"
                  placeholder="e.g. Spare parts, major repair"
                  value={excludedInput}
                  onChange={(e) => {
                    setExcludedInput(e.target.value);
                    if (tagError.excluded) {
                      setTagError((prev) => ({ ...prev, excluded: undefined }));
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddExcluded();
                    }
                  }}
                  className="quote-form-input tag-input"
                />
              </div>
              <button
                type="button"
                className="quote-btn-add-item secondary"
                onClick={() => handleAddExcluded()}
              >
                <i className="fas fa-plus"></i>
                <span>Add Exclusion</span>
              </button>
            </div>

            {tagError.excluded && (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{tagError.excluded}</span>
              </div>
            )}

            <div className="quote-chip-suggestions">
              <span className="quote-suggestion-label">Suggested Exclusions:</span>
              {excludedSuggestions
                .filter((item) => !(formValues.excludedItems || []).includes(item))
                .slice(0, 4)
                .map((item) => (
                  <button
                    key={item}
                    type="button"
                    className="quote-suggest-chip excluded"
                    onClick={() => handleAddExcluded(item)}
                  >
                    <i className="fas fa-plus"></i>
                    <span>{item}</span>
                  </button>
                ))}
            </div>

            <div className="quote-items-list excluded">
              {formValues.excludedItems && formValues.excludedItems.length > 0 ? (
                formValues.excludedItems.map((item, idx) => (
                  <div key={idx} className="quote-item-badge excluded">
                    <i className="fas fa-times-circle text-red"></i>
                    <span className="quote-item-text">{item}</span>
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
                <div className="quote-empty-tags-note warning">
                  <i className="fas fa-info-circle"></i>
                  <span>Please list at least 1 exclusion to protect yourself against extra unpaid work.</span>
                </div>
              )}
            </div>

            {errors.excludedItems && (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{errors.excludedItems.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`quote-form-section ${isSection3Complete ? "section-complete" : ""}`}>
        <div className="quote-section-title-row">
          <div className="quote-section-number">
            {isSection3Complete ? <i className="fas fa-check"></i> : "3"}
          </div>
          <div className="quote-section-meta">
            <div className="quote-section-badge-row">
              <span className="quote-section-pill">Step 3 of 4</span>
              <span className="quote-status-pill optional">Recommended</span>
            </div>
            <h4 className="quote-section-title">Schedule & Estimated Duration</h4>
            <p className="quote-section-subtitle">
              Give the customer confidence by specifying when you will arrive and job turnaround time
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
            <div className="quote-input-with-icon">
              <i className="far fa-hourglass quote-input-left-icon"></i>
              <input
                id="estimated-duration"
                type="text"
                placeholder="e.g. 1–2 hours"
                className={`quote-form-input with-left-icon ${
                  errors.estimatedDuration ? "has-error is-invalid" : ""
                }`}
                {...register("estimatedDuration")}
              />
            </div>

            <div className="quote-chip-suggestions compact">
              {durationSuggestions.map((dur) => (
                <button
                  key={dur}
                  type="button"
                  className={`quote-suggest-chip ${
                    formValues.estimatedDuration === dur ? "active" : ""
                  }`}
                  onClick={() => {
                    setValue("estimatedDuration", dur, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                >
                  {dur}
                </button>
              ))}
            </div>

            {errors.estimatedDuration && (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{errors.estimatedDuration.message}</span>
              </div>
            )}
          </div>

          <div className="quote-field-group">
            <div className="quote-label-with-tag">
              <label className="quote-field-label" htmlFor="available-datetime">
                Available Date / Time
              </label>
              <span className="quote-recommended-tag">Recommended</span>
            </div>
            <div className="quote-input-with-icon">
              <i className="far fa-calendar-alt quote-input-left-icon"></i>
              <input
                id="available-datetime"
                type="text"
                placeholder="e.g. Today 6 PM"
                className={`quote-form-input with-left-icon ${
                  errors.availableDateTime ? "has-error is-invalid" : ""
                }`}
                {...register("availableDateTime")}
              />
            </div>

            <div className="quote-chip-suggestions compact">
              {timeSlotSuggestions.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`quote-suggest-chip ${
                    formValues.availableDateTime === slot ? "active" : ""
                  }`}
                  onClick={() => {
                    setValue("availableDateTime", slot, {
                      shouldValidate: true,
                      shouldDirty: true
                    });
                  }}
                >
                  {slot}
                </button>
              ))}
            </div>

            {errors.availableDateTime && (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{errors.availableDateTime.message}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={`quote-form-section ${isSection4Complete ? "section-complete" : ""}`}>
        <div className="quote-section-title-row">
          <div className="quote-section-number">
            {isSection4Complete ? <i className="fas fa-check"></i> : "4"}
          </div>
          <div className="quote-section-meta">
            <div className="quote-section-badge-row">
              <span className="quote-section-pill">Step 4 of 4</span>
              {isSection4Complete ? (
                <span className="quote-status-pill ready">Completed</span>
              ) : (
                <span className="quote-status-pill pending">Required Policy</span>
              )}
            </div>
            <h4 className="quote-section-title">Extra-Charge Policy & Message</h4>
            <p className="quote-section-subtitle">
              Prevent pricing conflicts and leave a courteous note for the customer
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

          <div className="quote-policy-info-box">
            <i className="fas fa-shield-alt quote-policy-icon"></i>
            <div className="quote-policy-info-text">
              <strong>Transparency Guarantee:</strong> Stating extra-charge terms upfront builds customer trust and guarantees platform support if unforeseen costs arise during the job.
            </div>
          </div>

          <input
            id="extra-charge-policy"
            type="text"
            placeholder="e.g. Spare parts at actual cost"
            className={`quote-form-input ${
              errors.extraChargePolicy ? "has-error is-invalid" : formValues.extraChargePolicy ? "is-valid" : ""
            }`}
            {...register("extraChargePolicy")}
          />

          <div className="quote-chip-suggestions">
            <span className="quote-suggestion-label">Common Policies:</span>
            {policySuggestions.map((pol) => (
              <button
                key={pol}
                type="button"
                className={`quote-suggest-chip policy ${
                  formValues.extraChargePolicy === pol ? "active" : ""
                }`}
                onClick={() => {
                  setValue("extraChargePolicy", pol, {
                    shouldValidate: true,
                    shouldDirty: true
                  });
                }}
              >
                {pol}
              </button>
            ))}
          </div>

          {errors.extraChargePolicy ? (
            <div className="quote-field-error-msg">
              <i className="fas fa-circle-exclamation"></i>
              <span>{errors.extraChargePolicy.message}</span>
            </div>
          ) : (
            <span className="quote-field-hint">
              Examples: "Spare parts at actual cost", "Material bill with GST provided"
            </span>
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
            placeholder="e.g. I can come today evening. I will carry all necessary equipment and diagnostic gauges."
            className={`quote-form-textarea ${
              errors.messageToCustomer ? "has-error is-invalid" : ""
            }`}
            {...register("messageToCustomer")}
          />

          <div className="quote-textarea-footer">
            {errors.messageToCustomer ? (
              <div className="quote-field-error-msg">
                <i className="fas fa-circle-exclamation"></i>
                <span>{errors.messageToCustomer.message}</span>
              </div>
            ) : (
              <span className="quote-field-hint">
                A courteous message with your arrival readiness increases acceptance rate significantly
              </span>
            )}
            <span className="quote-char-counter">
              {(formValues.messageToCustomer || "").length}/500
            </span>
          </div>
        </div>
      </div>

      <div className="quote-form-actions-card">
        <div className="quote-actions-left">
          <span className="quote-review-note">
            <i className="fas fa-info-circle"></i>
            Review the live preview on the right before sending to ensure accuracy.
          </span>
        </div>
        <div className="quote-actions-right">
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
            disabled={isSubmitting || !isValid}
          >
            {isSubmitting ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                <span>Submitting Quotation...</span>
              </>
            ) : (
              <>
                <i className="fas fa-paper-plane"></i>
                <span>Send Quotation to Customer</span>
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
