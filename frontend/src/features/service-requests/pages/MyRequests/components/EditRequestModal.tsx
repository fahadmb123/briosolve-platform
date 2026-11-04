import React, { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import type {
  CustomerServiceRequestItem,
  RequestUrgency,
  RequestBudgetType
} from "../../../types/serviceRequest.types";
import { checkRequestEditPermission } from "../../../utils/serviceRequestEdit.utils";
import { computeDateForUrgency } from "../../../utils/serviceDate.utils";
import { useUpdateServiceRequest } from "../../../hooks/useServiceRequestMutations";
import { useGetCategoriesService } from "../../../../service-catalog";
import { useGetAddresses, type AddressPayload } from "../../../../addresses";
import type { Category } from "../../RequestService/components";

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
  const [budgetType, setBudgetType] = useState<RequestBudgetType>("OPEN_BID");
  const [budgetAmount, setBudgetAmount] = useState<string>("1500");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [selectedPreviewImage, setSelectedPreviewImage] = useState<string | null>(null);

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
    setBudgetType(request.budget_type || "OPEN_BID");
    setBudgetAmount(request.budget_amount ? String(request.budget_amount) : "");

    const existingImgs = (request.images || []).map((img) => img.image_key);
    setUploadedImages(existingImgs);

    const permission = checkRequestEditPermission(request);
    if (!permission.isRestricted) {
      getCategoriesMutation.mutate(
        { page: 1, limit: 100, filter: "ACTIVE" },
        {
          onSuccess: (res) => {
            const rawCats = (res.data?.categories || []) as Category[];
            setCategories(rawCats);
          }
        }
      );

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

  const handleUrgencyChange = (newUrgency: RequestUrgency) => {
    setUrgency(newUrgency);
    const computed = computeDateForUrgency(newUrgency, specificDate);
    setSpecificDate(computed);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files).slice(0, 5 - uploadedImages.length);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const newImg = event.target.result as string;
          setUploadedImages((prev) => [...prev, newImg]);
        }
      };
      reader.readAsDataURL(file);
    });
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
    if (budgetType === "FIXED") {
      const num = Number(budgetAmount);
      if (isNaN(num) || num < 100) {
        toast.error("Fixed budget must be at least ₹100");
        return;
      }
    }
    if (uploadedImages.length === 0) {
      toast.error("Please provide at least 1 image");
      return;
    }

    const payload = {
      title: title.trim(),
      description: description.trim(),
      urgency,
      specificDate: specificDate || null,
      availableTimeFrom,
      availableTimeTo,
      budgetType,
      budgetAmount: budgetType === "FIXED" ? budgetAmount : null,
      images: uploadedImages,
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
                    Providers have already submitted pricing estimates for this request. Category, subservice, and service location cannot be changed to ensure quotations remain valid. You can adjust the description, schedule hours, budget amount, and attachments.
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
              <label className="myreq-edit-label">Budget Preference</label>
              <div className="myreq-budget-type-row">
                <button
                  type="button"
                  className={`myreq-budget-type-btn ${
                    budgetType === "OPEN_BID" ? "active" : ""
                  }`}
                  onClick={() => setBudgetType("OPEN_BID")}
                >
                  <i className="fas fa-comments-dollar"></i>
                  <span>Open for Bids</span>
                </button>

                <button
                  type="button"
                  className={`myreq-budget-type-btn ${
                    budgetType === "FIXED" ? "active" : ""
                  }`}
                  onClick={() => setBudgetType("FIXED")}
                >
                  <i className="fas fa-tag"></i>
                  <span>Fixed Budget</span>
                </button>
              </div>

              {budgetType === "FIXED" && (
                <div className="myreq-fixed-budget-input-wrapper">
                  <span className="myreq-currency-symbol">₹</span>
                  <input
                    type="number"
                    min="100"
                    step="50"
                    value={budgetAmount}
                    onChange={(e) => setBudgetAmount(e.target.value)}
                    placeholder="Enter fixed amount"
                    className="myreq-edit-input budget-input"
                    required
                  />
                </div>
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
