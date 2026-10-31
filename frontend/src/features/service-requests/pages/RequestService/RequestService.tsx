import React, { useState, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import type { Address } from "../../../addresses";
import "./RequestService.css";

interface ServiceCategoryItem {
  id: string;
  name: string;
  icon: string;
  desc: string;
  subservices: string[];
}

const SERVICE_CATEGORIES: ServiceCategoryItem[] = [
  {
    id: "plumbing",
    name: "Plumbing",
    icon: "fas fa-wrench",
    desc: "Pipe leaks, tap fixing, drain clearing, sanitary install",
    subservices: [
      "Pipe Leakage",
      "Tap / Faucet Repair",
      "Drain Blockage",
      "Water Heater / Geyser",
      "Toilet / Bathroom Fitting",
      "Water Tank Repair",
    ],
  },
  {
    id: "electrical",
    name: "Electrical",
    icon: "fas fa-bolt",
    desc: "Wiring, switchboard, ceiling fan, light installation",
    subservices: [
      "Wiring & Tripping Fix",
      "Switchboard / Socket Repair",
      "Fan & Light Installation",
      "MCB & Fuse Box Work",
      "Inverter / Generator Setup",
      "Appliance Power Line",
    ],
  },
  {
    id: "cleaning",
    name: "Deep Cleaning",
    icon: "fas fa-broom",
    desc: "Full home sanitization, kitchen, washroom, upholstery",
    subservices: [
      "Full Home Deep Clean",
      "Kitchen & Chimney Clean",
      "Bathroom Sanitization",
      "Sofa & Carpet Shampoo",
      "Post-Construction Cleaning",
      "Balcony / Window Wash",
    ],
  },
  {
    id: "carpentry",
    name: "Carpentry",
    icon: "fas fa-hammer",
    desc: "Furniture repair, locks, doors, custom woodwork",
    subservices: [
      "Furniture Repair & Polish",
      "Door Lock & Latch Fixing",
      "Cupboard / Cabinet Work",
      "Bed & Table Assembly",
      "Wooden Partition",
      "Window Frame Repair",
    ],
  },
  {
    id: "ac-repair",
    name: "AC & Appliances",
    icon: "fas fa-snowflake",
    desc: "AC cooling, gas refill, fridge, washing machine",
    subservices: [
      "AC Filter & Service",
      "AC Gas Leakage Refill",
      "Refrigerator Repair",
      "Washing Machine Repair",
      "Microwave / Oven Fix",
      "RO Water Purifier",
    ],
  },
  {
    id: "painting",
    name: "Painting",
    icon: "fas fa-paint-roller",
    desc: "Interior, exterior, moisture sealing, texture walls",
    subservices: [
      "Interior Wall Painting",
      "Damp Proofing / Waterproof",
      "Exterior House Coating",
      "Wood Polish & Varnish",
      "Wall Stencil / Texture",
      "Touch-up & Patchwork",
    ],
  },
];

interface MockAddressItem {
  id: string;
  type: string;
  title: string;
  details: string;
}

export default function RequestService() {
  const navigate = useNavigate();
  const fileInputId = useId();
  const user = useAuthStore((s) => s.user);

  const customerAddress =
    typeof user?.current_address_id === "object"
      ? (user.current_address_id as Address | null)
      : null;

  const defaultAddresses: MockAddressItem[] = [
    {
      id: customerAddress?.id || "addr-1",
      type: customerAddress?.type || "Home",
      title: customerAddress
        ? `${customerAddress.house_no || ""} ${customerAddress.area}`.trim()
        : "Apartment 4B, Emerald Heights",
      details: customerAddress
        ? `${customerAddress.city}, ${customerAddress.state} - ${customerAddress.pincode}`
        : "Ponnani-Chavakkad Highway, Thrissur, Kerala - 680665",
    },
    {
      id: "addr-2",
      type: "Office",
      title: "Suite 204, Metro Business Hub",
      details: "MG Road, Kochi, Kerala - 682016",
    },
  ];

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryItem>(
    SERVICE_CATEGORIES[0]
  );
  const [selectedSubservice, setSelectedSubservice] = useState<string>(
    SERVICE_CATEGORIES[0].subservices[0]
  );
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [urgency, setUrgency] = useState<
    "EMERGENCY" | "TODAY" | "THIS_WEEK" | "FLEXIBLE"
  >("TODAY");
  const [scheduledDate, setScheduledDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [scheduledSlot, setScheduledSlot] = useState<
    "MORNING" | "AFTERNOON" | "EVENING"
  >("MORNING");
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    defaultAddresses[0].id
  );
  const [budgetType, setBudgetType] = useState<"OPEN_BID" | "FIXED" | "HOURLY">(
    "OPEN_BID"
  );
  const [budgetAmount, setBudgetAmount] = useState<string>("1500");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleCategorySelect = (category: ServiceCategoryItem) => {
    setSelectedCategory(category);
    setSelectedSubservice(category.subservices[0] || "");
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileList = Array.from(files).slice(0, 5 - uploadedImages.length);
    fileList.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedImages((prev) => [...prev, event.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    setUploadedImages((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handlePresetBudget = (amount: string) => {
    setBudgetAmount(amount);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 700);
  };

  const selectedAddress =
    defaultAddresses.find((a) => a.id === selectedAddressId) || defaultAddresses[0];

  const urgencyLabel = {
    EMERGENCY: "Immediate (2-4 hrs)",
    TODAY: "Today",
    THIS_WEEK: "This Week",
    FLEXIBLE: "Flexible Date",
  }[urgency];

  const timeSlotLabel = {
    MORNING: "Morning (8 AM - 12 PM)",
    AFTERNOON: "Afternoon (12 PM - 4 PM)",
    EVENING: "Evening (4 PM - 8 PM)",
  }[scheduledSlot];

  return (
    <div className="app-content request-service-container">
      <div className="request-service-header">
        <div className="request-service-breadcrumb">
          <Link to="/">Home</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <Link to="/dashboard">Dashboard</Link>
          <i className="fas fa-chevron-right text-[10px]"></i>
          <span className="current">Request Service</span>
        </div>

        <div className="request-service-title-row">
          <div className="request-service-title-group">
            <h1>Post a Service Request</h1>
            <p>
              Tell us what you need done. Verified service providers nearby will
              review your requirement and submit competitive quotes.
            </p>
          </div>

          <div className="request-guarantee-pill">
            <i className="fas fa-shield-alt"></i>
            <span>Briosolve Quality & Price Protection</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="request-service-layout">
          <div className="request-form-column">
            <div className="request-section-card">
              <div className="request-section-header">
                <div className="request-step-badge">1</div>
                <div className="request-section-title-group">
                  <h2>Select Service Category</h2>
                  <p>Choose the discipline that matches your requirement</p>
                </div>
              </div>

              <div className="request-categories-grid">
                {SERVICE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory.id === cat.id;
                  return (
                    <div
                      key={cat.id}
                      className={`request-category-card ${isSelected ? "selected" : ""}`}
                      onClick={() => handleCategorySelect(cat)}
                    >
                      <div className="request-category-icon">
                        <i className={cat.icon}></i>
                      </div>
                      <div className="request-category-name">{cat.name}</div>
                      <div className="request-category-subtext">{cat.desc}</div>
                      {isSelected && (
                        <div className="request-category-check">
                          <i className="fas fa-check"></i>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedCategory && (
                <div className="subservice-chips-container">
                  <div className="subservice-chips-title">
                    Common Tasks in {selectedCategory.name}
                  </div>
                  <div className="subservice-chips-list">
                    {selectedCategory.subservices.map((sub) => {
                      const isSubSelected = selectedSubservice === sub;
                      return (
                        <button
                          key={sub}
                          type="button"
                          className={`subservice-chip ${isSubSelected ? "selected" : ""}`}
                          onClick={() => {
                            setSelectedSubservice(sub);
                            if (!title) {
                              setTitle(sub);
                            }
                          }}
                        >
                          {sub}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="request-section-card">
              <div className="request-section-header">
                <div className="request-step-badge">2</div>
                <div className="request-section-title-group">
                  <h2>Requirement Details</h2>
                  <p>Provide specific details about the issue or task</p>
                </div>
              </div>

              <div className="request-form-group">
                <label className="request-form-label">
                  <span>
                    Requirement Title <span className="required-dot">*</span>
                  </span>
                  <span className="char-count">{title.length}/100</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={100}
                  className="request-form-input"
                  placeholder="e.g. Washbasin pipe leaking heavily under cabinet"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="request-form-group">
                <label className="request-form-label">
                  <span>
                    Detailed Description <span className="required-dot">*</span>
                  </span>
                  <span className="char-count">{description.length}/1000</span>
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  className="request-form-textarea"
                  placeholder="Describe the issue, work scope, materials available or needed, and any constraints..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                ></textarea>
              </div>

              <div className="request-form-group">
                <label className="request-form-label">
                  <span>
                    When do you need this? <span className="required-dot">*</span>
                  </span>
                </label>

                <div className="urgency-grid">
                  <div
                    className={`urgency-card ${urgency === "EMERGENCY" ? "selected" : ""}`}
                    onClick={() => setUrgency("EMERGENCY")}
                  >
                    <div className="urgency-icon text-danger">
                      <i className="fas fa-bolt"></i>
                    </div>
                    <div className="urgency-title">Emergency</div>
                    <div className="urgency-desc">Within 2-4 hrs</div>
                  </div>

                  <div
                    className={`urgency-card ${urgency === "TODAY" ? "selected" : ""}`}
                    onClick={() => setUrgency("TODAY")}
                  >
                    <div className="urgency-icon text-primary">
                      <i className="fas fa-calendar-day"></i>
                    </div>
                    <div className="urgency-title">Today</div>
                    <div className="urgency-desc">Within today</div>
                  </div>

                  <div
                    className={`urgency-card ${urgency === "THIS_WEEK" ? "selected" : ""}`}
                    onClick={() => setUrgency("THIS_WEEK")}
                  >
                    <div className="urgency-icon text-info">
                      <i className="fas fa-calendar-week"></i>
                    </div>
                    <div className="urgency-title">This Week</div>
                    <div className="urgency-desc">Next 2-3 days</div>
                  </div>

                  <div
                    className={`urgency-card ${urgency === "FLEXIBLE" ? "selected" : ""}`}
                    onClick={() => setUrgency("FLEXIBLE")}
                  >
                    <div className="urgency-icon text-secondary">
                      <i className="fas fa-clock"></i>
                    </div>
                    <div className="urgency-title">Flexible</div>
                    <div className="urgency-desc">Anytime soon</div>
                  </div>
                </div>
              </div>

              <div className="schedule-row">
                <div className="request-form-group">
                  <label className="request-form-label">Preferred Date</label>
                  <input
                    type="date"
                    className="request-form-input"
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
                  />
                </div>

                <div className="request-form-group">
                  <label className="request-form-label">Preferred Time Window</label>
                  <div className="time-slot-grid">
                    <button
                      type="button"
                      className={`time-slot-btn ${scheduledSlot === "MORNING" ? "selected" : ""}`}
                      onClick={() => setScheduledSlot("MORNING")}
                    >
                      Morning
                    </button>
                    <button
                      type="button"
                      className={`time-slot-btn ${scheduledSlot === "AFTERNOON" ? "selected" : ""}`}
                      onClick={() => setScheduledSlot("AFTERNOON")}
                    >
                      Afternoon
                    </button>
                    <button
                      type="button"
                      className={`time-slot-btn ${scheduledSlot === "EVENING" ? "selected" : ""}`}
                      onClick={() => setScheduledSlot("EVENING")}
                    >
                      Evening
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="request-section-card">
              <div className="request-section-header">
                <div className="request-step-badge">3</div>
                <div className="request-section-title-group">
                  <h2>Service Location</h2>
                  <p>Select the location where the service is needed</p>
                </div>
              </div>

              <div className="addresses-selection-list">
                {defaultAddresses.map((addr) => {
                  const isSelected = selectedAddressId === addr.id;
                  return (
                    <div
                      key={addr.id}
                      className={`address-select-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedAddressId(addr.id)}
                    >
                      <div className="address-radio-indicator">
                        {isSelected && <div className="address-radio-dot"></div>}
                      </div>
                      <div className="address-card-body">
                        <div className="address-card-header">
                          <span className="address-type-tag">{addr.type}</span>
                          <span className="address-text-main">{addr.title}</span>
                        </div>
                        <div className="address-text-sub">{addr.details}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link
                to="/settings"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5"
              >
                <i className="fas fa-plus-circle"></i>
                <span>Add new location or manage addresses in Settings</span>
              </Link>
            </div>

            <div className="request-section-card">
              <div className="request-section-header">
                <div className="request-step-badge">4</div>
                <div className="request-section-title-group">
                  <h2>Budget & Pricing Model</h2>
                  <p>Choose how you would like service providers to quote</p>
                </div>
              </div>

              <div className="budget-type-tabs">
                <button
                  type="button"
                  className={`budget-tab-btn ${budgetType === "OPEN_BID" ? "selected" : ""}`}
                  onClick={() => setBudgetType("OPEN_BID")}
                >
                  <i className="fas fa-tags mr-1.5"></i>
                  Open to Bids
                </button>
                <button
                  type="button"
                  className={`budget-tab-btn ${budgetType === "FIXED" ? "selected" : ""}`}
                  onClick={() => setBudgetType("FIXED")}
                >
                  <i className="fas fa-coins mr-1.5"></i>
                  Fixed Budget
                </button>
                <button
                  type="button"
                  className={`budget-tab-btn ${budgetType === "HOURLY" ? "selected" : ""}`}
                  onClick={() => setBudgetType("HOURLY")}
                >
                  <i className="fas fa-stopwatch mr-1.5"></i>
                  Hourly Rate
                </button>
              </div>

              {budgetType !== "OPEN_BID" && (
                <div>
                  <div className="request-form-group">
                    <label className="request-form-label">
                      <span>
                        {budgetType === "FIXED"
                          ? "Target Budget Amount (₹)"
                          : "Preferred Hourly Rate (₹ / hr)"}
                      </span>
                    </label>
                    <input
                      type="number"
                      min={100}
                      max={100000}
                      step={50}
                      className="request-form-input"
                      value={budgetAmount}
                      onChange={(e) => setBudgetAmount(e.target.value)}
                    />
                  </div>

                  <div className="budget-presets-row">
                    <span className="text-xs text-secondary self-center mr-1">
                      Quick select:
                    </span>
                    {(budgetType === "FIXED"
                      ? ["500", "1000", "2000", "3500", "5000"]
                      : ["200", "350", "500", "750", "1000"]
                    ).map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        className="budget-preset-chip"
                        onClick={() => handlePresetBudget(amt)}
                      >
                        ₹{amt}
                        {budgetType === "HOURLY" ? "/hr" : ""}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="request-section-card">
              <div className="request-section-header">
                <div className="request-step-badge">5</div>
                <div className="request-section-title-group">
                  <h2>Photos & Media (Optional)</h2>
                  <p>Attach clear images to help specialists assess the job accurately</p>
                </div>
              </div>

              <input
                type="file"
                id={fileInputId}
                multiple
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
                onChange={handleFileUpload}
              />

              <label htmlFor={fileInputId} className="file-dropzone">
                <div className="dropzone-icon">
                  <i className="fas fa-cloud-upload-alt"></i>
                </div>
                <div className="dropzone-text-main">
                  Click or drag images here to upload
                </div>
                <div className="dropzone-text-sub">
                  Supports JPG, PNG up to 10MB each (max 5 images)
                </div>
              </label>

              {uploadedImages.length > 0 && (
                <div className="uploaded-preview-grid">
                  {uploadedImages.map((imgSrc, idx) => (
                    <div key={idx} className="uploaded-preview-item">
                      <img src={imgSrc} alt={`Upload ${idx + 1}`} />
                      <button
                        type="button"
                        className="remove-upload-btn"
                        onClick={() => handleRemoveImage(idx)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="request-summary-column">
            <div className="request-summary-card">
              <h3 className="summary-card-title">Request Summary</h3>
              <p className="summary-card-subtext">
                Live preview of your requirement before broadcasting
              </p>

              <div className="summary-items-list">
                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-th-large"></i>
                    Category
                  </span>
                  <span className="summary-item-value">
                    {selectedCategory.name}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-tag"></i>
                    Task
                  </span>
                  <span className="summary-item-value">
                    {selectedSubservice || "General"}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-stopwatch"></i>
                    Timeline
                  </span>
                  <span className="summary-item-value highlight">
                    {urgencyLabel}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-calendar-alt"></i>
                    Slot
                  </span>
                  <span className="summary-item-value">{timeSlotLabel}</span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-map-marker-alt"></i>
                    Location
                  </span>
                  <span className="summary-item-value">
                    {selectedAddress.title}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-wallet"></i>
                    Budget
                  </span>
                  <span className="summary-item-value highlight">
                    {budgetType === "OPEN_BID"
                      ? "Open to Quotes"
                      : budgetType === "FIXED"
                      ? `₹${budgetAmount}`
                      : `₹${budgetAmount}/hr`}
                  </span>
                </div>

                {uploadedImages.length > 0 && (
                  <div className="summary-item">
                    <span className="summary-item-label">
                      <i className="fas fa-camera"></i>
                      Photos
                    </span>
                    <span className="summary-item-value">
                      {uploadedImages.length} attached
                    </span>
                  </div>
                )}
              </div>

              <div className="summary-how-it-works">
                <div className="how-it-works-title">
                  <i className="fas fa-info-circle text-primary"></i>
                  What happens next?
                </div>
                <ul className="how-it-works-steps">
                  <li>
                    <i className="fas fa-check"></i>
                    <span>Verified local pros in your radius receive your brief.</span>
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    <span>Providers send quotes with pricing & availability.</span>
                  </li>
                  <li>
                    <i className="fas fa-check"></i>
                    <span>Compare ratings, chat in-app, and hire with confidence.</span>
                  </li>
                </ul>
              </div>

              <div className="summary-actions">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="summary-submit-btn"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner fa-spin"></i>
                      <span>Broadcasting Request...</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane"></i>
                      <span>Broadcast Service Request</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="summary-draft-btn"
                >
                  Save as Draft
                </button>
              </div>

              <div className="summary-trust-badge">
                <i className="fas fa-lock text-success"></i>
                <span>No upfront booking fee • Free quotes</span>
              </div>
            </div>
          </div>
        </div>
      </form>

      {showSuccessModal && (
        <div className="request-success-modal-overlay">
          <div className="request-success-modal">
            <div className="success-icon-badge">
              <i className="fas fa-check"></i>
            </div>
            <h3>Request Broadcasted Successfully!</h3>
            <p>
              Your requirement has been sent to verified specialists in your
              area. You will receive notifications as soon as quotes arrive.
            </p>

            <div className="request-success-info-box">
              <div className="request-success-info-row">
                <span>Category:</span>
                <span>{selectedCategory.name}</span>
              </div>
              <div className="request-success-info-row">
                <span>Task:</span>
                <span>{selectedSubservice}</span>
              </div>
              <div className="request-success-info-row">
                <span>Schedule:</span>
                <span>
                  {urgencyLabel} ({timeSlotLabel})
                </span>
              </div>
              <div className="request-success-info-row">
                <span>Location:</span>
                <span>{selectedAddress.title}</span>
              </div>
            </div>

            <div className="request-success-actions">
              <Link to="/dashboard" className="btn btn-primary">
                View in Dashboard
              </Link>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setShowSuccessModal(false);
                  setTitle("");
                  setDescription("");
                  setUploadedImages([]);
                }}
              >
                Post Another
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
