import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import type {
  CustomerServiceRequestItem,
  RequestUrgency
} from "../../types/serviceRequest.types";
import { checkRequestEditPermission } from "../../utils/serviceRequestEdit.utils";
import { computeDateForUrgency } from "../../utils/serviceDate.utils";
import { useUpdateServiceRequest } from "../../hooks/useServiceRequestMutations";
import { useGetCategoriesService } from "../../../service-catalog";
import { useGetAddresses, type AddressPayload } from "../../../addresses";
import type { Category, ServiceQuestion } from "../request-service";

interface EditRequestModalProps {
  request: CustomerServiceRequestItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updated: CustomerServiceRequestItem) => void;
}

export const EditRequestModal: React.FC<EditRequestModalProps> = ({
  request,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [subserviceId, setSubserviceId] = useState<string>("");
  const [urgency, setUrgency] = useState<RequestUrgency>("TODAY");
  const [specificDate, setSpecificDate] = useState<string>("");
  const [selectedAddressId, setSelectedAddressId] = useState<string>("");
  const [availableTimeFrom, setAvailableTimeFrom] = useState<string>("09:00");
  const [availableTimeTo, setAvailableTimeTo] = useState<string>("17:00");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [questionErrors, setQuestionErrors] = useState<Record<string, string>>({});

  const [categories, setCategories] = useState<Category[]>([]);
  const [addresses, setAddresses] = useState<AddressPayload[]>([]);

  const getCategoriesMutation = useGetCategoriesService();
  const getAddressesMutation = useGetAddresses();
  const updateMutation = useUpdateServiceRequest();

  useEffect(() => {
    if (!isOpen || !request) return;

    setTitle(request.title || "");
    setDescription(request.description || "");
    setCategoryId(request.category_id || "");
    setSubserviceId(request.subservice_id || "");
    setUrgency(request.urgency || "TODAY");
    setSpecificDate(
      request.specific_date
        ? new Date(request.specific_date).toISOString().split("T")[0]
        : ""
    );
    setSelectedAddressId(request.address_id || "");
    setAvailableTimeFrom(request.available_time_from?.slice(0, 5) || "09:00");
    setAvailableTimeTo(request.available_time_to?.slice(0, 5) || "17:00");

    const existingImgs = (request.images || []).map((img) => img.image_key);
    setUploadedImages(existingImgs);

    const initialAnswers: Record<string, any> = {};
    if (request.answers && Array.isArray(request.answers)) {
      for (const a of request.answers) {
        initialAnswers[a.question_id] = a.answer;
      }
    }
    setAnswers(initialAnswers);
    setQuestionErrors({});

    getCategoriesMutation.mutate(
      { page: 1, limit: 100, filter: "ACTIVE" },
      {
        onSuccess: (res) => {
          const rawCats = (res.data?.categories || []) as Category[];
          setCategories(rawCats);
        }
      }
    );

    const permission = checkRequestEditPermission(request);
    if (!permission.isRestricted) {
      getAddressesMutation.mutate(
        { page: 1, search: "", limit: 100 },
        {
          onSuccess: (res) => {
            const list = (res.data.addresses || []) as AddressPayload[];
            setAddresses(list);
          }
        }
      );
    }
  }, [isOpen, request]);

  if (!isOpen || !request) return null;

  const permission = checkRequestEditPermission(request);

  if (!permission.canEdit) {
    return (
      <div className="myreq-modal-overlay" onClick={onClose}>
        <div
          className="myreq-modal-dialog"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
        >
          <div className="myreq-modal-header">
            <h3 className="myreq-modal-title">Editing Not Allowed</h3>
            <button
              type="button"
              className="myreq-modal-btn-close"
              onClick={onClose}
              aria-label="Close"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="myreq-modal-content-scroll">
            <div className="myreq-callout-notice text-danger">
              <i className="fas fa-ban"></i>
              <div>
                <strong>{permission.statusLabel}</strong>
                <p>{permission.reason}</p>
              </div>
            </div>
          </div>
          <div className="myreq-modal-footer">
            <button type="button" className="myreq-btn-subtle" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  const isRestricted = permission.isRestricted;

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);
  const activeSubservices = selectedCategoryObj?.services || [];
  const selectedSubservice = activeSubservices.find((s) => s.id === subserviceId);
  const currentQuestions: ServiceQuestion[] = selectedSubservice?.questions || [];

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value
    }));
    setQuestionErrors((prev) => {
      if (prev[questionId]) {
        const next = { ...prev };
        delete next[questionId];
        return next;
      }
      return prev;
    });
  };

  const validateCustomQuestions = (): boolean => {
    if (!currentQuestions || currentQuestions.length === 0) return true;

    const newErrors: Record<string, string> = {};
    for (const q of currentQuestions) {
      if (q.is_required) {
        const val = answers[q.id];
        if (
          val === undefined ||
          val === null ||
          val === "" ||
          (Array.isArray(val) && val.length === 0)
        ) {
          newErrors[q.id] = `"${q.label}" is required`;
        }
      }
    }

    setQuestionErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstError = Object.values(newErrors)[0];
      toast.error(firstError);
      return false;
    }
    return true;
  };

  const handleUrgencyChange = (newUrgency: RequestUrgency) => {
    setUrgency(newUrgency);
    const computed = computeDateForUrgency(newUrgency, specificDate);
    setSpecificDate(computed);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const MAX_FILE_SIZE = 10 * 1024 * 1024;
    const currentCount = uploadedImages.length;

    if (currentCount >= 5) {
      toast.error("Maximum 5 images allowed");
      e.target.value = "";
      return;
    }

    const rawFiles = Array.from(files);
    const validFiles: File[] = [];

    for (const file of rawFiles) {
      if (!file.type.startsWith("image/")) {
        toast.error(`"${file.name}" is not a supported image file`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`"${file.name}" exceeds the 10MB size limit`);
        continue;
      }
      validFiles.push(file);
    }

    const availableSlots = 5 - currentCount;
    if (validFiles.length > availableSlots) {
      toast.error(`You can only upload up to 5 images. Only the first ${availableSlots} will be added.`);
    }

    const filesToRead = validFiles.slice(0, availableSlots);
    if (filesToRead.length === 0) {
      e.target.value = "";
      return;
    }

    const readPromises = filesToRead.map(
      (file) =>
        new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              resolve(event.target.result as string);
            }
          };
          reader.readAsDataURL(file);
        })
    );

    const newImages = await Promise.all(readPromises);
    setUploadedImages((prev) => [...prev, ...newImages].slice(0, 5));

    e.target.value = "";
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (title.trim().length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }
    if (description.trim().length < 15) {
      toast.error("Description must be at least 15 characters");
      return;
    }
    if (urgency === "SPECIFIC_DATE" && !specificDate) {
      toast.error("Please pick a specific date");
      return;
    }
    if (uploadedImages.length === 0) {
      toast.error("Please provide at least 1 image");
      return;
    }

    if (!validateCustomQuestions()) {
      return;
    }

    const formattedAnswers = currentQuestions.length > 0
      ? currentQuestions
          .filter(
            (q) =>
              answers[q.id] !== undefined &&
              answers[q.id] !== null &&
              answers[q.id] !== "" &&
              (!Array.isArray(answers[q.id]) || answers[q.id].length > 0)
          )
          .map((q) => ({
            question_id: q.id,
            question_label: q.label,
            answer: answers[q.id]
          }))
      : [];

    const payload = {
      title: title.trim(),
      description: description.trim(),
      urgency,
      specificDate: specificDate || null,
      availableTimeFrom,
      availableTimeTo,
      images: uploadedImages,
      answers: formattedAnswers,
      ...(!isRestricted && {
        categoryId,
        subserviceId: subserviceId || null,
        selectedAddressId
      })
    };

    updateMutation.mutate(
      { id: request.id, data: payload },
      {
        onSuccess: (res) => {
          toast.success("Service request updated successfully");
          if (res.data) {
            onSuccess(res.data);
          }
          onClose();
        },
        onError: (err: any) => {
          const message =
            err?.response?.data?.message || err?.message || "Failed to update request";
          toast.error(message);
        }
      }
    );
  };

  const addressSummary = request.address_details
    ? `${request.address_details.area}, ${request.address_details.city} (${request.address_details.pincode})`
    : "Current address on file";

  return (
    <div className="myreq-modal-overlay" onClick={onClose}>
      <div
        className="myreq-modal-dialog myreq-edit-dialog"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="myreq-modal-header">
          <div className="myreq-modal-header-titles">
            <div className="myreq-modal-header-tag-row">
              <span className="myreq-modal-category">
                <i className="fas fa-edit"></i>
                <span>Edit Service Request</span>
              </span>
              {isRestricted ? (
                <span className="myreq-edit-badge restricted">
                  <i className="fas fa-lock"></i> Restricted (Quotes Received)
                </span>
              ) : (
                <span className="myreq-edit-badge full">Full Editing Allowed</span>
              )}
            </div>
            <h2 className="myreq-modal-title">{request.title}</h2>
          </div>

          <button
            type="button"
            className="myreq-modal-btn-close"
            onClick={onClose}
            aria-label="Close"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="myreq-edit-form">
          <div className="myreq-modal-content-scroll">
            {isRestricted && (
              <div className="myreq-restriction-callout">
                <i className="fas fa-shield-alt myreq-restriction-icon"></i>
                <div>
                  <strong>Quotes Received — Core Trade Locked</strong>
                  <p>
                    Providers have already submitted pricing estimates for this request. Category, subservice, and service location cannot be changed to ensure quotations remain valid. You can adjust the description, schedule hours, and attachments.
                  </p>
                </div>
              </div>
            )}

            <div className="myreq-edit-grid-2">
              <div className="myreq-edit-field">
                <label className="myreq-edit-label">
                  Service Category
                  {isRestricted && (
                    <span className="myreq-locked-pill">
                      <i className="fas fa-lock"></i> Locked
                    </span>
                  )}
                </label>
                {isRestricted ? (
                  <input
                    type="text"
                    disabled
                    value={request.category_name || "Category"}
                    className="myreq-edit-input locked"
                  />
                ) : (
                  <select
                    value={categoryId}
                    onChange={(e) => {
                      setCategoryId(e.target.value);
                      const cat = categories.find((c) => c.id === e.target.value);
                      if (cat && cat.services && cat.services.length > 0) {
                        setSubserviceId(cat.services[0].id);
                      } else {
                        setSubserviceId("");
                      }
                    }}
                    className="myreq-edit-select"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="myreq-edit-field">
                <label className="myreq-edit-label">
                  Subservice / Type
                  {isRestricted && (
                    <span className="myreq-locked-pill">
                      <i className="fas fa-lock"></i> Locked
                    </span>
                  )}
                </label>
                {isRestricted ? (
                  <input
                    type="text"
                    disabled
                    value={request.subservice_name || "General Service"}
                    className="myreq-edit-input locked"
                  />
                ) : (
                  <select
                    value={subserviceId}
                    onChange={(e) => setSubserviceId(e.target.value)}
                    className="myreq-edit-select"
                  >
                    {activeSubservices.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            </div>

            {currentQuestions && currentQuestions.length > 0 && (
              <div className="myreq-edit-field">
                <label className="myreq-edit-label">
                  <span>Specific Questions ({selectedSubservice?.name || "Selected Service"})</span>
                  <span className="text-xs text-secondary font-normal">
                    Please answer the questions below
                  </span>
                </label>
                <div className="flex flex-col gap-3 p-3 bg-surface rounded-lg border border-border mt-1">
                  {currentQuestions.map((q) => {
                    const currentVal = answers[q.id];
                    const hasError = !!questionErrors[q.id];

                    return (
                      <div key={q.id} className="flex flex-col gap-1">
                        <label className="text-xs font-semibold text-text flex items-center justify-between">
                          <span>
                            {q.label} {q.is_required && <span className="text-danger">*</span>}
                          </span>
                          {hasError && (
                            <span className="text-danger text-[11px] font-normal">
                              {questionErrors[q.id]}
                            </span>
                          )}
                        </label>

                        {q.type === "TEXT" && (
                          <input
                            type="text"
                            className={`myreq-edit-input ${hasError ? "border-danger" : ""}`}
                            placeholder={q.placeholder || "Enter details..."}
                            value={typeof currentVal === "string" ? currentVal : ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
                          />
                        )}

                        {q.type === "NUMBER" && (
                          <input
                            type="number"
                            className={`myreq-edit-input ${hasError ? "border-danger" : ""}`}
                            placeholder={q.placeholder || "e.g. 2"}
                            value={currentVal !== undefined && currentVal !== null ? currentVal : ""}
                            onChange={(e) =>
                              handleAnswerChange(
                                q.id,
                                e.target.value === "" ? "" : Number(e.target.value)
                              )
                            }
                          />
                        )}

                        {q.type === "SELECT" && (
                          <select
                            className={`myreq-edit-select ${hasError ? "border-danger" : ""}`}
                            value={typeof currentVal === "string" ? currentVal : ""}
                            onChange={(e) => handleAnswerChange(q.id, e.target.value)}
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
                                      handleAnswerChange(
                                        q.id,
                                        selectedArray.filter((item: string) => item !== opt)
                                      );
                                    } else {
                                      handleAnswerChange(q.id, [...selectedArray, opt]);
                                    }
                                  }}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                    isChecked
                                      ? "bg-primary text-white border-primary"
                                      : "bg-surface hover:bg-surface-hover border-border text-text"
                                  }`}
                                >
                                  <i
                                    className={`fas ${
                                      isChecked ? "fa-check-square mr-1.5" : "fa-square mr-1.5 opacity-40"
                                    }`}
                                  ></i>
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
                              onClick={() => handleAnswerChange(q.id, true)}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
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
                              onClick={() => handleAnswerChange(q.id, false)}
                              className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold border transition-colors flex items-center justify-center gap-1.5 ${
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
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="myreq-edit-field">
              <label className="myreq-edit-label">Request Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="E.g. Leaking pipe under kitchen sink"
                className="myreq-edit-input"
                maxLength={100}
                required
              />
            </div>

            <div className="myreq-edit-field">
              <label className="myreq-edit-label">Detailed Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your issue or job requirements in detail..."
                className="myreq-edit-textarea"
                rows={4}
                maxLength={1000}
                required
              />
              <span className="myreq-char-count">{description.length}/1000</span>
            </div>

            <div className="myreq-edit-field">
              <label className="myreq-edit-label">Timeline & Urgency</label>
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
                    onClick={() => handleUrgencyChange(item.key)}
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
                  min={new Date().toISOString().split("T")[0]}
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
                  value={availableTimeFrom}
                  onChange={(e) => setAvailableTimeFrom(e.target.value)}
                  className="myreq-edit-input"
                  required
                />
              </div>

              <div className="myreq-edit-field">
                <label className="myreq-edit-label">Available To</label>
                <input
                  type="time"
                  value={availableTimeTo}
                  onChange={(e) => setAvailableTimeTo(e.target.value)}
                  className="myreq-edit-input"
                  required
                />
              </div>
            </div>

            <div className="myreq-edit-field">
              <label className="myreq-edit-label">
                Service Location
                {isRestricted && (
                  <span className="myreq-locked-pill">
                    <i className="fas fa-lock"></i> Locked
                  </span>
                )}
              </label>
              {isRestricted ? (
                <input
                  type="text"
                  disabled
                  value={addressSummary}
                  className="myreq-edit-input locked"
                />
              ) : (
                <select
                  value={selectedAddressId}
                  onChange={(e) => setSelectedAddressId(e.target.value)}
                  className="myreq-edit-select"
                >
                  {addresses.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.area}, {a.city} - {a.pincode} {a.landmark ? `(${a.landmark})` : ""}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="myreq-edit-field">
              <label className="myreq-edit-label">
                Attached Photos ({uploadedImages.length}/5)
              </label>
              <div className="myreq-edit-photos-grid">
                {uploadedImages.map((img, idx) => (
                  <div
                    key={idx}
                    className="myreq-edit-photo-card"
                    onClick={() => setSelectedPreviewImage(img)}
                    title="Click to view image"
                  >
                    <img src={img} alt={`Preview ${idx + 1}`} />
                    <div className="myreq-edit-photo-overlay">
                      <i className="fas fa-search-plus"></i>
                    </div>
                    {uploadedImages.length > 1 && (
                      <button
                        type="button"
                        className="myreq-edit-photo-remove"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage(idx);
                        }}
                        title="Remove image"
                        aria-label="Remove image"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))}

                {uploadedImages.length < 5 && (
                  <label className="myreq-edit-add-photo">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: "none" }}
                    />
                    <i className="fas fa-camera"></i>
                    <span>Add Photo</span>
                  </label>
                )}
              </div>
            </div>
          </div>

          <div className="myreq-modal-footer">
            <button
              type="button"
              className="myreq-btn-subtle"
              onClick={onClose}
              disabled={updateMutation.isPending}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="myreq-btn-post"
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <i className="fas fa-check"></i>
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {selectedPreviewImage && (
        <div
          className="myreq-lightbox-overlay"
          onClick={() => setSelectedPreviewImage(null)}
        >
          <div
            className="myreq-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedPreviewImage}
              alt="Full view"
              className="myreq-lightbox-img"
            />
            <button
              type="button"
              className="myreq-lightbox-close"
              onClick={() => setSelectedPreviewImage(null)}
              aria-label="Close image preview"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
