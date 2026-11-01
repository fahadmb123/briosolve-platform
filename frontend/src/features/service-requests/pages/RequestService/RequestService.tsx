import React, { useState, useId, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useGetAddresses, type Address, type AddressPayload } from "../../../addresses";
import { VerificationRequiredCard } from "../../../../shared/components/ui/VerificationRequiredCard/VerificationRequiredCard";
import "./RequestService.css";
import { useGetCategoriesService } from "../../../service-catalog";
import { ServiceSelectionSkeleton } from "../../components/ServiceSelectionSkeleton";

interface ServiceItem {
  id: string;
  name: string;
  description?: string | null;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  services: ServiceItem[];
}


const LEVEL_STEPS = [
  {
    level: 1,
    label: "Level 1",
    title: "Select Service",
    subtext: "Category & task",
  },
  {
    level: 2,
    label: "Level 2",
    title: "Requirements",
    subtext: "Details & urgency",
  },
  {
    level: 3,
    label: "Level 3",
    title: "Location & Time",
    subtext: "Address & schedule",
  },
  {
    level: 4,
    label: "Level 4",
    title: "Budget & Media",
    subtext: "Pricing & photos",
  },
];

export default function RequestService() {
  const verifications = useAuthStore(state=>state.verifications)
  const fileInputId = useId();
  const user = useAuthStore((s) => s.user);
  const isVerified = verifications !== null && Object.values(verifications).every(Boolean)
  const getCategories = useGetCategoriesService();
  const getAddresses = useGetAddresses()
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubservice, setSelectedSubservice] = useState<ServiceItem | null>(null);
  const [addresses,setAddresses] = useState<AddressPayload[]>([])

  useEffect(() => {
    getCategories.mutate(
      { page: 1, limit: 100, filter: "ACTIVE" },
      {
        onSuccess: (res) => {
          const cats = res.data?.categories || [];
          setCategories(cats);
          if (cats.length > 0) {
            setSelectedCategory(cats[0]);
            if (cats[0].services && cats[0].services.length > 0) {
              setSelectedSubservice(cats[0].services[0]);
            }
          }
        },
      }
    );
  }, []);

  useEffect(()=>{
    (()=>{
      getAddresses.mutate({page:1,search:'',limit:100},{
        onSuccess:(response)=>{
          setAddresses(response.data.addresses as []) 
        }
      })
    })()
  }, [])

  const customerAddress =
    typeof user?.current_address_id === "object"
      ? (user.current_address_id as Address | null)
      : null;

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
    customerAddress?.id as string
  );
  const [budgetType, setBudgetType] = useState<"OPEN_BID" | "FIXED" | "HOURLY">(
    "OPEN_BID"
  );
  const [budgetAmount, setBudgetAmount] = useState<string>("1500");
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    if (category.services && category.services.length > 0) {
      setSelectedSubservice(category.services[0]);
      if (!title) {
        setTitle(category.services[0].name);
      }
    } else {
      setSelectedSubservice(null);
    }
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

  const handleNextLevel = () => {
    if (currentLevel < 4) {
      setCurrentLevel((prev) => prev + 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handlePrevLevel = () => {
    if (currentLevel > 1) {
      setCurrentLevel((prev) => prev - 1);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentLevel < 4) {
      handleNextLevel();
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 700);
  };

  const selectedAddress =
    addresses.find((address)=>address.id === customerAddress?.id)

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


    if (!isVerified) {
    return (
      <div className="app-content request-service-container">
        <VerificationRequiredCard
          title="Complete Verification to Post a Request"
          description="To maintain marketplace trust, prevent spam, and ensure providers can reach you, please complete the required verifications before submitting your service request."
        />
      </div>
    );
  }

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
              Complete the 4 levels to broadcast your requirement to verified local
              service providers and receive competitive quotes.
            </p>
          </div>

          <div className="request-guarantee-pill">
            <i className="fas fa-shield-alt"></i>
            <span>Briosolve Quality & Price Protection</span>
          </div>
        </div>
      </div>

      <div className="levels-mobile-bar">
        {LEVEL_STEPS.map((s) => {
          const isActive = currentLevel === s.level;
          const isCompleted = currentLevel > s.level;
          return (
            <button
              key={s.level}
              type="button"
              className={`mobile-level-pill ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
              onClick={() => setCurrentLevel(s.level)}
            >
              {isCompleted ? (
                <i className="fas fa-check text-[10px]"></i>
              ) : (
                <span>{s.level}</span>
              )}
              <span>{s.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <div className="request-service-layout">
          <div className="levels-stepper-column">
            <div className="levels-stepper-card">
              <div className="levels-sidebar-header">
                <h3>Levels Progress</h3>
                <p>Complete steps 1 to 4</p>
              </div>

              <div className="levels-list">
                {LEVEL_STEPS.map((s, idx) => {
                  const isActive = currentLevel === s.level;
                  const isCompleted = currentLevel > s.level;
                  const isLast = idx === LEVEL_STEPS.length - 1;

                  return (
                    <div
                      key={s.level}
                      className={`level-item ${isActive ? "active" : ""} ${isCompleted ? "completed" : ""}`}
                      onClick={() => setCurrentLevel(s.level)}
                    >
                      <div className="level-item-indicator">
                        <div className="level-bubble">
                          {isCompleted ? (
                            <i className="fas fa-check text-[11px]"></i>
                          ) : (
                            s.level
                          )}
                        </div>
                        {!isLast && (
                          <div
                            className={`level-connector-line ${isCompleted ? "completed" : ""}`}
                          ></div>
                        )}
                      </div>

                      <div className="level-item-body">
                        <div className="level-label">{s.label}</div>
                        <div className="level-title">{s.title}</div>
                        <div className="level-subtext">{s.subtext}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="request-form-column">
            {currentLevel === 1 && (
              getCategories.isPending ? (
                <ServiceSelectionSkeleton />
              ) : (
                <>
                  <div className="request-section-card">
                    <div className="request-section-header">
                      <div className="request-step-badge">1</div>
                      <div className="request-section-title-group">
                        <h2>Select Service Category</h2>
                        <p>Choose the discipline that matches your requirement</p>
                      </div>
                      {selectedCategory && (
                        <div className="request-selected-badge active">
                          <span>{selectedCategory?.name || "N/A"}</span>
                        </div>
                      )}
                    </div>

                    <div className="request-categories-grid">
                      {categories.map((cat) => {
                        const isSelected = selectedCategory?.id === cat.id;
                        return (
                          <div
                            key={cat.id}
                            className={`request-category-card ${isSelected ? "selected" : ""}`}
                            onClick={() => handleCategorySelect(cat)}
                          >
                            <div className="request-category-icon">
                              {cat.image ? (
                                <img
                                  src={cat.image}
                                  alt={cat.name}
                                  className="w-full h-full object-cover rounded"
                                />
                              ) : (
                                <i className="fas fa-tools"></i>
                              )}
                            </div>
                            <div className="request-category-name">{cat.name}</div>
                            {cat.description && (
                              <div className="request-category-subtext">{cat.description}</div>
                            )}
                            {isSelected && (
                              <div className="request-category-check">
                                <i className="fas fa-check"></i>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {selectedCategory && (
                    <div className="request-section-card">
                      <div className="request-section-header">
                        <div className="request-step-badge">
                          <i className="fas fa-tools text-xs"></i>
                        </div>
                        <div className="request-section-title-group">
                          <h2>Select Service in {selectedCategory.name}</h2>
                          <p>Pick the specific task or service you need assistance with</p>
                        </div>
                        {selectedSubservice && (
                          <div className="request-selected-badge active">
                            <i className="fas fa-check-circle"></i>
                            <span>{selectedSubservice.name}</span>
                          </div>
                        )}
                      </div>

                      {selectedCategory.services && selectedCategory.services.length > 0 ? (
                        <div className="request-services-grid">
                          {selectedCategory.services.map((sub) => {
                            const isSubSelected = selectedSubservice?.id === sub.id;
                            return (
                              <div
                                key={sub.id}
                                className={`request-service-item-card ${isSubSelected ? "selected" : ""}`}
                                onClick={() => {
                                  setSelectedSubservice(sub);
                                  if (!title) {
                                    setTitle(sub.name);
                                  }
                                }}
                              >
                                <div className="request-service-item-radio">
                                  {isSubSelected && (
                                    <div className="request-service-item-radio-dot"></div>
                                  )}
                                </div>
                                <div className="request-service-item-content">
                                  <div className="request-service-item-title">{sub.name}</div>
                                  <div className="request-service-item-sub">
                                    {sub.description || (isSubSelected ? "Selected service" : "Click to select")}
                                  </div>
                                </div>
                                <div className="request-service-item-check">
                                  <i className="fas fa-check"></i>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-sm text-secondary">
                          No services available in this category yet.
                        </div>
                      )}

                      <div className="level-navigation-bar">
                        <div className="level-nav-summary">
                          <span>Selected:</span>
                          <strong>
                            {selectedCategory.name}
                            {selectedSubservice ? ` • ${selectedSubservice.name}` : ""}
                          </strong>
                        </div>
                        <button
                          type="button"
                          className="level-nav-next-btn"
                          disabled={!selectedCategory || !selectedSubservice}
                          onClick={handleNextLevel}
                        >
                          <span>Continue to Level 2</span>
                          <i className="fas fa-arrow-right"></i>
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )
            )}

            {currentLevel === 2 && (
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

                <div className="level-navigation-bar">
                  <button
                    type="button"
                    className="level-nav-back-btn"
                    onClick={handlePrevLevel}
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Level 1</span>
                  </button>
                  <button
                    type="button"
                    className="level-nav-next-btn"
                    onClick={handleNextLevel}
                  >
                    <span>Continue to Level 3</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 3 && (
              <div className="request-section-card">
                <div className="request-section-header">
                  <div className="request-step-badge">3</div>
                  <div className="request-section-title-group">
                    <h2>Level 3: Location & Schedule</h2>
                    <p>Select where and when you want the service done</p>
                  </div>
                </div>

                <div className="addresses-selection-list">
                  {addresses.map((addr) => {
                    const isSelected = selectedAddressId === addr.id;
                    return (
                      <div
                        key={addr.id}
                        className={`address-select-card ${isSelected ? "selected" : ""}`}
                        onClick={() => setSelectedAddressId(addr.id!)}
                      >
                        <div className="address-radio-indicator">
                          {isSelected && <div className="address-radio-dot"></div>}
                        </div>
                        <div className="address-card-body">
                          <div className="address-card-header">
                            <span className="address-type-tag">{addr.type}</span>
                            <span className="address-text-main">{addr.landmark}</span>
                          </div>
                         
                        </div>
                      </div>
                    );
                  })}
                </div>

                <Link
                  to="/settings"
                  className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5 mb-4"
                >
                  <i className="fas fa-plus-circle"></i>
                  <span>Add new location or manage addresses in Settings</span>
                </Link>

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

                <div className="level-navigation-bar">
                  <button
                    type="button"
                    className="level-nav-back-btn"
                    onClick={handlePrevLevel}
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Level 2</span>
                  </button>
                  <button
                    type="button"
                    className="level-nav-next-btn"
                    onClick={handleNextLevel}
                  >
                    <span>Continue to Level 4</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            )}

            {currentLevel === 4 && (
              <div className="request-section-card">
                <div className="request-section-header">
                  <div className="request-step-badge">4</div>
                  <div className="request-section-title-group">
                    <h2>Level 4: Budget & Attachments</h2>
                    <p>Choose quotation preference and attach optional photos</p>
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
                  <div className="mb-4">
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

                <div className="request-form-group">
                  <label className="request-form-label">
                    <span>Photos & Media (Optional)</span>
                    <span className="char-count">{uploadedImages.length}/5</span>
                  </label>

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

                <div className="level-navigation-bar">
                  <button
                    type="button"
                    className="level-nav-back-btn"
                    onClick={handlePrevLevel}
                  >
                    <i className="fas fa-arrow-left"></i>
                    <span>Back to Level 3</span>
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="level-nav-next-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Broadcasting...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Broadcast Request</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="request-summary-column">
            <div className="request-summary-card">
              <h3 className="summary-card-title">Request Summary</h3>
              <p className="summary-card-subtext">
                Live preview of your requirement across all levels
              </p>

              <div className="summary-items-list">
                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-th-large"></i>
                    Level 1
                  </span>
                  <span className="summary-item-value">
                    {selectedCategory?.name || "None"} • {selectedSubservice?.name || "General"}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-stopwatch"></i>
                    Level 2
                  </span>
                  <span className="summary-item-value highlight">
                    {urgencyLabel}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-map-marker-alt"></i>
                    Level 3
                  </span>
                  <span className="summary-item-value">
                    {selectedAddress?.landmark}
                  </span>
                </div>

                <div className="summary-item">
                  <span className="summary-item-label">
                    <i className="fas fa-wallet"></i>
                    Level 4
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
                    <span>Nearby verified pros receive your requirement.</span>
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
                <span>{selectedCategory?.name || "N/A"}</span>
              </div>
              <div className="request-success-info-row">
                <span>Task:</span>
                <span>{selectedSubservice?.name || "General"}</span>
              </div>
              <div className="request-success-info-row">
                <span>Schedule:</span>
                <span>
                  {urgencyLabel} ({timeSlotLabel})
                </span>
              </div>
              <div className="request-success-info-row">
                <span>Location:</span>
                <span>{selectedAddress?.landmark}</span>
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
                  setCurrentLevel(1);
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
