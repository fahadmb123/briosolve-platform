import { useState, useEffect, useRef, type FC, type ChangeEvent } from "react";
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
  isEditing?: boolean;
  onSubmit: (data: QuotationFormData) => void;
  isSubmitting?: boolean;
  onCancel?: () => void;
  onFormChange?: (data: Partial<QuotationFormData>) => void;
  onChat?: () => void;
}

const getTodayIso = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const format12Hour = (time24: string): string => {
  if (!time24) return "";
  const parts = time24.split(":");
  let hour = parseInt(parts[0], 10);
  const min = parts[1] || "00";
  if (isNaN(hour)) return time24;
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  return `${hour}:${min} ${ampm}`;
};

const formatDateDisplay = (isoDate: string): string => {
  if (!isoDate) return "";
  try {
    const parts = isoDate.split("-").map(Number);
    if (!parts[0] || !parts[1] || !parts[2]) return isoDate;
    const date = new Date(parts[0], parts[1] - 1, parts[2]);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return isoDate;
  }
};

const normalizeToFrontendValidity = (val?: string): QuotationValidity => {
  if (val === "HOURS_24" || val === "24_HOURS") return "24_HOURS";
  if (val === "HOURS_48" || val === "48_HOURS") return "48_HOURS";
  if (val === "DAYS_3" || val === "3_DAYS") return "3_DAYS";
  if (val === "DAYS_7" || val === "7_DAYS") return "7_DAYS";
  return "24_HOURS";
};

const parseCustomDuration = (dur: string) => {
  const trimmed = dur.trim();
  const match = trimmed.match(/^(\d+)\s*(.*)$/);
  if (match) {
    return { num: match[1], unit: match[2] || "Hours" };
  }
  return { num: "1", unit: "Hours" };
};

const parseAvailableDateTime = (str: string) => {
  let dType = "today";
  let cDate = getTodayIso();
  let tType = "Morning (9 AM – 12 PM)";
  let sTime = "18:00";

  if (!str) return { dType, cDate, tType, sTime };

  const lower = str.toLowerCase();
  if (lower.includes("tomorrow")) {
    dType = "tomorrow";
  } else if (lower.includes("today")) {
    dType = "today";
  } else {
    dType = "custom";
    const dateMatch = str.match(/\d{4}-\d{2}-\d{2}/);
    if (dateMatch) {
      cDate = dateMatch[0];
    }
  }

  const standardTimeSlots = [
    "Evening (6 PM – 9 PM)",
    "Morning (9 AM – 12 PM)",
    "Afternoon (12 PM – 3 PM)",
    "Evening (3 PM – 6 PM)",
    "Any time / Flexible"
  ];

  const matchedSlot = standardTimeSlots.find((slot) => str.includes(slot));
  if (matchedSlot) {
    tType = matchedSlot;
  } else {
    tType = "specific";
    const timeMatch = str.match(/(\d{1,2}):(\d{2})(?:\s*(AM|PM))?/i);
    if (timeMatch) {
      let h = parseInt(timeMatch[1], 10);
      const m = timeMatch[2];
      const meridiem = timeMatch[3]?.toUpperCase();
      if (meridiem === "PM" && h < 12) h += 12;
      if (meridiem === "AM" && h === 12) h = 0;
      sTime = `${String(h).padStart(2, "0")}:${m}`;
    }
  }

  return { dType, cDate, tType, sTime };
};

export const QuotationForm: FC<QuotationFormProps> = ({
  initialValues,
  isEditing = false,
  onSubmit,
  isSubmitting = false,
  onCancel,
  onFormChange,
  onChat
}) => {
  const [includedInput, setIncludedInput] = useState("");
  const [excludedInput, setExcludedInput] = useState("");
  const [tagError, setTagError] = useState<{ included?: string; excluded?: string }>({});

  const lastResetRef = useRef<string>("");

  const standardDurations = [
    "30–45 mins",
    "1–2 hours",
    "2–4 hours",
    "Half day (4–6 hours)",
    "Full day (1 day)",
    "2–3 days",
    "4–7 days",
    "1–2 weeks"
  ];

  const initialDur = initialValues?.estimatedDuration || "";
  const isCustomDurInitial = Boolean(initialDur && !standardDurations.includes(initialDur));
  const parsedDurInitial = parseCustomDuration(initialDur);

  const [isCustomDuration, setIsCustomDuration] = useState<boolean>(isCustomDurInitial);
  const [customDurationNum, setCustomDurationNum] = useState<string>(
    isCustomDurInitial ? parsedDurInitial.num : "1"
  );
  const [customDurationUnit, setCustomDurationUnit] = useState<string>(
    isCustomDurInitial ? parsedDurInitial.unit : "Hours"
  );

  const initialAvail = initialValues?.availableDateTime || "";
  const parsedAvailInitial = parseAvailableDateTime(initialAvail);
  const [dateType, setDateType] = useState<string>(parsedAvailInitial.dType);
  const [customDateVal, setCustomDateVal] = useState<string>(parsedAvailInitial.cDate);
  const [timeType, setTimeType] = useState<string>(parsedAvailInitial.tType);
  const [specificTimeVal, setSpecificTimeVal] = useState<string>(parsedAvailInitial.sTime);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isDirty }
  } = useForm<QuotationInputType>({
    resolver: zodResolver(quotationSchema),
    mode: "onChange",
    defaultValues: {
      amount: initialValues?.amount !== undefined ? initialValues.amount : "",
      quotationType: initialValues?.quotationType || "FIXED",
      workDescription: initialValues?.workDescription || "",
      includedItems: initialValues?.includedItems || [],
      excludedItems: initialValues?.excludedItems || [],
      estimatedDuration: initialValues?.estimatedDuration || "1–2 hours",
      availableDateTime: initialValues?.availableDateTime || "Today · Morning (9 AM – 12 PM)",
      validUntil: normalizeToFrontendValidity(initialValues?.validUntil),
      extraChargePolicy: initialValues?.extraChargePolicy || ""
    }
  });

  const isSubmitDisabled = isSubmitting || (Boolean(isEditing) && !isDirty);

  useEffect(() => {
    if (initialValues) {
      const serialized = JSON.stringify(initialValues);
      if (lastResetRef.current === serialized) {
        return;
      }
      lastResetRef.current = serialized;

      const normalizedValidity = normalizeToFrontendValidity(initialValues.validUntil);
      reset({
        amount: initialValues.amount !== undefined ? initialValues.amount : "",
        quotationType: initialValues.quotationType || "FIXED",
        workDescription: initialValues.workDescription || "",
        includedItems: initialValues.includedItems ? [...initialValues.includedItems] : [],
        excludedItems: initialValues.excludedItems ? [...initialValues.excludedItems] : [],
        estimatedDuration: initialValues.estimatedDuration || "1–2 hours",
        availableDateTime: initialValues.availableDateTime || "Today · Morning (9 AM – 12 PM)",
        validUntil: normalizedValidity,
        extraChargePolicy: initialValues.extraChargePolicy || ""
      });

      const dur = initialValues.estimatedDuration || "";
      if (dur && !standardDurations.includes(dur)) {
        setIsCustomDuration(true);
        const parsed = parseCustomDuration(dur);
        setCustomDurationNum(parsed.num);
        setCustomDurationUnit(parsed.unit);
      } else {
        setIsCustomDuration(false);
      }

      if (initialValues.availableDateTime) {
        const parsedAvail = parseAvailableDateTime(initialValues.availableDateTime);
        setDateType(parsedAvail.dType);
        setCustomDateVal(parsedAvail.cDate);
        setTimeType(parsedAvail.tType);
        setSpecificTimeVal(parsedAvail.sTime);
      }
    }
  }, [initialValues, reset]);

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

  const handleDurationSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomDuration(true);
      setValue("estimatedDuration", `${customDurationNum} ${customDurationUnit}`, {
        shouldValidate: true,
        shouldDirty: true
      });
    } else {
      setIsCustomDuration(false);
      setValue("estimatedDuration", val, {
        shouldValidate: true,
        shouldDirty: true
      });
    }
  };

  const handleCustomNumChange = (e: ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value;
    setCustomDurationNum(num);
    setValue("estimatedDuration", num ? `${num} ${customDurationUnit}` : "", {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleCustomUnitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const unit = e.target.value;
    setCustomDurationUnit(unit);
    setValue("estimatedDuration", customDurationNum ? `${customDurationNum} ${unit}` : "", {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const buildAvailableString = (
    dType: string,
    cDate: string,
    tType: string,
    sTime: string
  ): string => {
    let dateStr = "Today";
    if (dType === "tomorrow") {
      dateStr = "Tomorrow";
    } else if (dType === "custom") {
      dateStr = formatDateDisplay(cDate) || "Selected date";
    }

    let timeStr = "";
    if (tType === "specific") {
      timeStr = sTime ? `at ${format12Hour(sTime)}` : "";
    } else if (tType) {
      timeStr = tType;
    }

    if (dateStr && timeStr) {
      return timeStr.startsWith("at ") ? `${dateStr} ${timeStr}` : `${dateStr}, ${timeStr}`;
    }
    return dateStr || timeStr;
  };

  const handleDateTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setDateType(val);
    const newStr = buildAvailableString(val, customDateVal, timeType, specificTimeVal);
    setValue("availableDateTime", newStr, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleCustomDateValChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomDateVal(val);
    const newStr = buildAvailableString(dateType, val, timeType, specificTimeVal);
    setValue("availableDateTime", newStr, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleTimeTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setTimeType(val);
    const newStr = buildAvailableString(dateType, customDateVal, val, specificTimeVal);
    setValue("availableDateTime", newStr, {
      shouldValidate: true,
      shouldDirty: true
    });
  };

  const handleSpecificTimeValChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setSpecificTimeVal(val);
    const newStr = buildAvailableString(dateType, customDateVal, timeType, val);
    setValue("availableDateTime", newStr, {
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
              <select
                id="estimated-duration"
                className={`quote-control quote-select ${errors.estimatedDuration ? "is-invalid" : ""}`}
                value={isCustomDuration ? "custom" : (formValues.estimatedDuration || "")}
                onChange={handleDurationSelectChange}
              >
                <option value="">Select duration</option>
                {standardDurations.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur}
                  </option>
                ))}
                <option value="custom">Custom duration...</option>
              </select>
              {isCustomDuration && (
                <div className="quote-custom-duration-row">
                  <input
                    type="number"
                    min="1"
                    max="99"
                    className="quote-control quote-custom-duration-num"
                    placeholder="Qty"
                    value={customDurationNum}
                    onChange={handleCustomNumChange}
                  />
                  <select
                    className="quote-control quote-select quote-custom-duration-unit"
                    value={customDurationUnit}
                    onChange={handleCustomUnitChange}
                  >
                    <option value="Hours">Hours</option>
                    <option value="Days">Days</option>
                    <option value="Weeks">Weeks</option>
                    <option value="Minutes">Minutes</option>
                  </select>
                </div>
              )}
              {errors.estimatedDuration ? (
                <span className="quote-error-msg">{errors.estimatedDuration.message}</span>
              ) : (
                <span className="quote-hint-msg">Recommended</span>
              )}
            </div>

            <div className="quote-form-group">
              <label className="quote-label" htmlFor="available-date-select">
                Available Date & Time
              </label>
              <div className="quote-avail-row">
                <div className="quote-avail-col">
                  <select
                    id="available-date-select"
                    className="quote-control quote-select"
                    value={dateType}
                    onChange={handleDateTypeChange}
                  >
                    <option value="today">Today</option>
                    <option value="tomorrow">Tomorrow</option>
                    <option value="custom">Pick specific date...</option>
                  </select>
                  {dateType === "custom" && (
                    <input
                      type="date"
                      min={getTodayIso()}
                      className="quote-control quote-date-input"
                      value={customDateVal}
                      onChange={handleCustomDateValChange}
                    />
                  )}
                </div>

                <div className="quote-avail-col">
                  <select
                    id="available-time-select"
                    className="quote-control quote-select"
                    value={timeType}
                    onChange={handleTimeTypeChange}
                  >
                    <option value="specific">Specific time...</option>
                    <option value="Evening (6 PM – 9 PM)">Evening (6 PM – 9 PM)</option>
                    <option value="Morning (9 AM – 12 PM)">Morning (9 AM – 12 PM)</option>
                    <option value="Afternoon (12 PM – 3 PM)">Afternoon (12 PM – 3 PM)</option>
                    <option value="Evening (3 PM – 6 PM)">Evening (3 PM – 6 PM)</option>
                    <option value="Any time / Flexible">Any time / Flexible</option>
                  </select>
                  {timeType === "specific" && (
                    <input
                      type="time"
                      className="quote-control quote-time-input"
                      value={specificTimeVal}
                      onChange={handleSpecificTimeValChange}
                    />
                  )}
                </div>
              </div>
              {errors.availableDateTime ? (
                <span className="quote-error-msg">{errors.availableDateTime.message}</span>
              ) : (
                <span className="quote-hint-msg">
                  {formValues.availableDateTime ? `Scheduled: ${formValues.availableDateTime}` : "Recommended"}
                </span>
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
          disabled={isSubmitDisabled}
          title={isEditing && !isDirty ? "Make changes to update the quotation" : undefined}
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin"></i>
              <span>{isEditing ? "Updating Quotation..." : "Sending Quotation..."}</span>
            </>
          ) : (
            <>
              <i className={isEditing ? "fas fa-edit" : "fas fa-paper-plane"}></i>
              <span>{isEditing ? "Edit Quotation" : "Send Quotation"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
};
