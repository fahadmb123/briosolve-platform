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
  onChat?: () => void;
}

export const QuotationForm: FC<QuotationFormProps> = ({
  initialValues,
  onSubmit,
  isSubmitting = false,
  onCancel,
  onFormChange,
  onChat
}) => {
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");
  const [tagError, setTagError] = useState<{ included?: string; excluded?: string }>({});

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<QuotationInputType>({
    resolver: zodResolver(quotationSchema),
    mode: "onChange",
    defaultValues: {
      amount: initialValues?.amount !== undefined ? initialValues.amount : 2500,
      quotationType: initialValues?.quotationType || "FIXED",
      workDescription:
        initialValues?.workDescription ||
        "AC gas refill and basic service. Complete vacuuming, leak check, refrigerant top-up and filter cleaning.",
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
    desc: string;
  }[] = [
    {
      type: "FIXED",
      label: "Fixed Price",
      desc: "Guaranteed total cost for the defined scope."
    },
    {
      type: "ESTIMATED",
      label: "Estimated Price",
      desc: "Approximate cost, subject to on-site scope review."
    },
    {
      type: "INSPECTION_REQUIRED",
      label: "Inspection Required",
      desc: "Final price confirmed after in-person inspection."
    }
  ];

  const validityOptions: {
    value: QuotationValidity;
    label: string;
  }[] = [
    { value: "24_HOURS", label: "24 Hours" },
    { value: "48_HOURS", label: "48 Hours" },
    { value: "3_DAYS", label: "3 Days" },
    { value: "7_DAYS", label: "7 Days" }
  ];

  const onFormSubmit = (data: QuotationInputType) => {
    onSubmit({
      amount: Number(data.amount),
      quotationType: data.quotationType,
      workDescription: data.workDescription,
      includedItems: data.includedItems,
      excludedItems: data.excludedItems,
      estimatedDuration: data.estimatedDuration || "",
      availableDateTime: data.availableDateTime || "",
      validUntil: data.validUntil,
      extraChargePolicy: data.extraChargePolicy
    });
  };

  return (
    <form className="quote-form-container" onSubmit={handleSubmit(onFormSubmit)} noValidate>
      <div className="quote-section-card">
        <div className="quote-card-header">
          <h2 className="quote-card-title">Pricing & Terms</h2>
          <p className="quote-card-subtitle">
            Specify the quotation amount, billing type, and validity period.
          </p>
        </div>

        <div className="quote-card-body">
          <div className="quote-form-row">
            <div className="quote-form-group">
              <label className="quote-label" htmlFor="quotation-amount">
                Quotation Amount <span className="quote-required">*</span>
              </label>
              <div className="quote-input-affix">
                <span className="quote-currency-prefix">₹</span>
                <input
                  id="quotation-amount"
                  type="number"
                  min="50"
                  max="1000000"
                  step="1"
                  placeholder="2500"
                  className={`quote-control quote-amount-input ${
                    errors.amount ? "is-invalid" : ""
                  }`}
                  {...register("amount")}
                />
              </div>
              {errors.amount ? (
                <span className="quote-error-msg">{errors.amount.message}</span>
              ) : (
                <span className="quote-hint-msg">Minimum amount ₹50</span>
              )}
            </div>

            <div className="quote-form-group">
              <label className="quote-label">
                Valid Until <span className="quote-required">*</span>
              </label>
              <div className="quote-pill-group">
                {validityOptions.map((opt) => {
                  const isSelected = formValues.validUntil === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      className={`quote-pill ${isSelected ? "selected" : ""}`}
                      onClick={() => {
                        setValue("validUntil", opt.value, {
                          shouldValidate: true,
                          shouldDirty: true
                        });
                      }}
                    >
                      {opt.label}
                    </button>
                  );
                })}
              </div>
              {errors.validUntil && (
                <span className="quote-error-msg">{errors.validUntil.message}</span>
              )}
            </div>
          </div>

          <div className="quote-form-group">
            <label className="quote-label">
              Quotation Type <span className="quote-required">*</span>
            </label>
            <div className="quote-type-grid">
              {quotationTypes.map((item) => {
                const isSelected = formValues.quotationType === item.type;
                return (
                  <div
                    key={item.type}
                    className={`quote-type-box ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      setValue("quotationType", item.type, {
                        shouldValidate: true,
                        shouldDirty: true
                      });
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <div className="quote-type-box-header">
                      <span className="quote-type-title">{item.label}</span>
                      <div className="quote-radio-dot">
                        {isSelected && <span className="quote-radio-inner" />}
                      </div>
                    </div>
                    <p className="quote-type-description">{item.desc}</p>
                  </div>
                );
              })}
            </div>
            {errors.quotationType && (
              <span className="quote-error-msg">{errors.quotationType.message}</span>
            )}
          </div>
        </div>
      </div>

      <div className="quote-section-card">
        <div className="quote-card-header">
          <h2 className="quote-card-title">Scope of Work</h2>
          <p className="quote-card-subtitle">
            Clarify exactly what tasks are included and excluded to prevent misunderstandings.
          </p>
        </div>

        <div className="quote-card-body">
          <div className="quote-form-group">
            <div className="quote-label-split">
              <label className="quote-label" htmlFor="work-description">
                Work Description <span className="quote-required">*</span>
              </label>
              <span className="quote-counter">
                {(formValues.workDescription || "").length}/1000
              </span>
            </div>
            <textarea
              id="work-description"
              rows={3}
              placeholder="e.g. AC gas refill and basic service. Complete vacuuming, leak check, and filter cleaning."
              className={`quote-control quote-textarea ${
                errors.workDescription ? "is-invalid" : ""
              }`}
              {...register("workDescription")}
            />
            {errors.workDescription ? (
              <span className="quote-error-msg">{errors.workDescription.message}</span>
            ) : (
              <span className="quote-hint-msg">Minimum 15 characters</span>
            )}
          </div>

          <div className="quote-form-group">
            <label className="quote-label">
              What is Included <span className="quote-required">*</span>
            </label>
            <div className="quote-tag-input-row">
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
                className="quote-control"
              />
              <button
                type="button"
                className="quote-btn-secondary"
                onClick={() => handleAddIncluded()}
              >
                Add Item
              </button>
            </div>
            {tagError.included && (
              <span className="quote-error-msg">{tagError.included}</span>
            )}

            <div className="quote-tags-wrapper">
              {formValues.includedItems && formValues.includedItems.length > 0 ? (
                formValues.includedItems.map((item, idx) => (
                  <span key={idx} className="quote-tag quote-tag-included">
                    <i className="fas fa-check"></i>
                    <span>{item}</span>
                    <button
                      type="button"
                      className="quote-tag-remove"
                      onClick={() => handleRemoveIncluded(idx)}
                      aria-label={`Remove ${item}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))
              ) : (
                <span className="quote-empty-text">No inclusions added yet.</span>
              )}
            </div>
            {errors.includedItems && (
              <span className="quote-error-msg">{errors.includedItems.message}</span>
            )}
          </div>

          <div className="quote-form-group">
            <label className="quote-label">
              What is Not Included <span className="quote-required">*</span>
            </label>
            <div className="quote-tag-input-row">
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
                className="quote-control"
              />
              <button
                type="button"
                className="quote-btn-secondary"
                onClick={() => handleAddExcluded()}
              >
                Add Item
              </button>
            </div>
            {tagError.excluded && (
              <span className="quote-error-msg">{tagError.excluded}</span>
            )}

            <div className="quote-tags-wrapper">
              {formValues.excludedItems && formValues.excludedItems.length > 0 ? (
                formValues.excludedItems.map((item, idx) => (
                  <span key={idx} className="quote-tag quote-tag-excluded">
                    <i className="fas fa-minus"></i>
                    <span>{item}</span>
                    <button
                      type="button"
                      className="quote-tag-remove"
                      onClick={() => handleRemoveExcluded(idx)}
                      aria-label={`Remove ${item}`}
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))
              ) : (
                <span className="quote-empty-text">No exclusions added yet.</span>
              )}
            </div>
            {errors.excludedItems && (
              <span className="quote-error-msg">{errors.excludedItems.message}</span>
            )}
          </div>

          <div className="quote-form-group">
            <label className="quote-label" htmlFor="extra-charge-policy">
              Extra-charge Policy <span className="quote-required">*</span>
            </label>
            <input
              id="extra-charge-policy"
              type="text"
              placeholder="e.g. Spare parts at actual cost"
              className={`quote-control ${errors.extraChargePolicy ? "is-invalid" : ""}`}
              {...register("extraChargePolicy")}
            />
            {errors.extraChargePolicy ? (
              <span className="quote-error-msg">{errors.extraChargePolicy.message}</span>
            ) : (
              <span className="quote-hint-msg">
                Terms for unexpected repairs or materials required during the job
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="quote-section-card">
        <div className="quote-card-header">
          <h2 className="quote-card-title">Schedule & Communication</h2>
          <p className="quote-card-subtitle">
            Provide timing expectations or message the customer directly.
          </p>
        </div>

        <div className="quote-card-body">
          <div className="quote-form-row">
            <div className="quote-form-group">
              <label className="quote-label" htmlFor="estimated-duration">
                Estimated Duration
              </label>
              <input
                id="estimated-duration"
                type="text"
                placeholder="e.g. 1–2 hours"
                className={`quote-control ${errors.estimatedDuration ? "is-invalid" : ""}`}
                {...register("estimatedDuration")}
              />
              {errors.estimatedDuration ? (
                <span className="quote-error-msg">{errors.estimatedDuration.message}</span>
              ) : (
                <span className="quote-hint-msg">Recommended</span>
              )}
            </div>

            <div className="quote-form-group">
              <label className="quote-label" htmlFor="available-datetime">
                Available Date / Time
              </label>
              <input
                id="available-datetime"
                type="text"
                placeholder="e.g. Today 6:00 PM"
                className={`quote-control ${errors.availableDateTime ? "is-invalid" : ""}`}
                {...register("availableDateTime")}
              />
              {errors.availableDateTime ? (
                <span className="quote-error-msg">{errors.availableDateTime.message}</span>
              ) : (
                <span className="quote-hint-msg">Recommended</span>
              )}
            </div>
          </div>

          <div className="quote-chat-action-box">
            <div className="quote-chat-text-col">
              <span className="quote-chat-headline">Have questions before submitting?</span>
              <span className="quote-chat-subheadline">
                Chat directly with the customer to clarify job requirements, address details, or schedule.
              </span>
            </div>
            {onChat && (
              <button
                type="button"
                className="quote-btn-chat"
                onClick={onChat}
              >
                <i className="fas fa-comment-dots"></i>
                <span>Chat with Customer</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="quote-form-footer">
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
          className="quote-btn-primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>Sending Quotation...</span>
            </>
          ) : (
            <>
              <i className="fas fa-paper-plane"></i>
              <span>Send Quotation</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
