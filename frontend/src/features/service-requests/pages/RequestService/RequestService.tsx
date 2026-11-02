import React, { useState, useId, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useGetAddresses, type Address, type AddressPayload } from "../../../addresses";
import { VerificationRequiredCard } from "../../../../shared/components/ui/VerificationRequiredCard/VerificationRequiredCard";
import "./RequestService.css";
import { useGetCategoriesService } from "../../../service-catalog";
import { ServiceSelectionSkeleton } from "../../components/ServiceSelectionSkeleton";
import {
  serviceRequestSchema,
  type ServiceRequestInputType
} from "../../schemas/serviceRequest.schema";

interface ServiceItem {
  id: string;
  name: string;
  description?: string | null;
  status?: string;
}

interface Category {
  id: string;
  name: string;
  description?: string;
  image?: string | null;
  status?: string;
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
  const verifications = useAuthStore((state) => state.verifications);
  const fileInputId = useId();
  const user = useAuthStore((s) => s.user);
  const isVerified =
    verifications !== null && Object.values(verifications).every(Boolean);
  const getCategories = useGetCategoriesService();
  const getAddresses = useGetAddresses();
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentLevel, setCurrentLevel] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedSubservice, setSelectedSubservice] = useState<ServiceItem | null>(null);
  const [addresses, setAddresses] = useState<AddressPayload[]>([]);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showSuccessModal, setShowSuccessModal] = useState<boolean>(false);

  const customerAddress =
    typeof user?.current_address_id === "object"
      ? (user.current_address_id as Address | null)
      : null;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    trigger,
    reset,
    formState: { errors }
  } = useForm<ServiceRequestInputType>({
    resolver: zodResolver(serviceRequestSchema),
    mode: "onChange",
    defaultValues: {
      categoryId: "",
      subserviceId: "",
      title: "",
      description: "",
      urgency: "TODAY",
      specificDate: new Date().toISOString().split("T")[0],
      selectedAddressId: (customerAddress?.id as string) || "",
      availableTimeFrom: "09:00",
      availableTimeTo: "17:00",
      budgetType: "OPEN_BID",
      budgetAmount: "1500",
      agreedToPolicy: false,
    }
  });

  const title = watch("title");
  const description = watch("description");
  const urgency = watch("urgency");
  const specificDate = watch("specificDate");
  const selectedAddressId = watch("selectedAddressId");
  const availableTimeFrom = watch("availableTimeFrom");
  const availableTimeTo = watch("availableTimeTo");
  const budgetType = watch("budgetType");
  const budgetAmount = watch("budgetAmount");
  const agreedToPolicy = watch("agreedToPolicy");

  useEffect(() => {
    getCategories.mutate(
      { page: 1, limit: 100, filter: "ACTIVE" },
      {
        onSuccess: (res) => {
          const rawCats = (res.data?.categories || []) as Category[];
          const cats = rawCats.map((cat) => ({
            ...cat,
            services: (cat.services || []).filter(
              (srv) => srv.status !== "INACTIVE"
            ),
          }));
          setCategories(cats);
          if (cats.length > 0) {
            const firstCat = cats[0];
            setSelectedCategory(firstCat);
            setValue("categoryId", firstCat.id, { shouldValidate: true });
            if (firstCat.services && firstCat.services.length > 0) {
              setSelectedSubservice(firstCat.services[0]);
              setValue("subserviceId", firstCat.services[0].id, { shouldValidate: true });
              if (!watch("title")) {
                setValue("title", firstCat.services[0].name, { shouldValidate: true });
              }
            } else {
              setSelectedSubservice(null);
              setValue("subserviceId", "", { shouldValidate: true });
            }
          }
        },
      }
    );
  }, []);

  useEffect(() => {
    getAddresses.mutate(
      { page: 1, search: "", limit: 100 },
      {
        onSuccess: (response) => {
          const addrList = (response.data.addresses || []) as AddressPayload[];
          setAddresses(addrList);
          if (addrList.length > 0 && !watch("selectedAddressId")) {
            const defaultId = (customerAddress?.id as string) || addrList[0].id || "";
            setValue("selectedAddressId", defaultId, { shouldValidate: true });
          }
        },
      }
    );
  }, []);

  const handleCategorySelect = (category: Category) => {
    const activeServices = (category.services || []).filter(
      (srv) => srv.status !== "INACTIVE"
    );
    const categoryWithActiveServices = {
      ...category,
      services: activeServices,
    };
    setSelectedCategory(categoryWithActiveServices);
    setValue("categoryId", category.id, { shouldValidate: true });
    if (activeServices.length > 0) {
      const firstSub = activeServices[0];
      setSelectedSubservice(firstSub);
      setValue("subserviceId", firstSub.id, { shouldValidate: true });
      if (!title) {
        setValue("title", firstSub.name, { shouldValidate: true });
      }
    } else {
      setSelectedSubservice(null);
      setValue("subserviceId", "", { shouldValidate: true });
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
    setValue("budgetAmount", amount, { shouldValidate: true });
  };

  const handleNextLevel = async () => {
    let isValid = false;
    if (currentLevel === 1) {
      isValid = await trigger(["categoryId", "subserviceId"]);
      if (!isValid && errors.categoryId) {
        toast.error(errors.categoryId.message || "Please select a service category");
      }
    } else if (currentLevel === 2) {
      isValid = await trigger(["title", "description", "urgency", "specificDate"]);
    } else if (currentLevel === 3) {
      isValid = await trigger(["selectedAddressId", "availableTimeFrom", "availableTimeTo"]);
    } else if (currentLevel === 4) {
      isValid = await trigger(["budgetType", "budgetAmount", "agreedToPolicy"]);
    }

    if (isValid && currentLevel < 4) {
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

  const handleJumpToLevel = async (targetLevel: number) => {
    if (targetLevel < currentLevel) {
      setCurrentLevel(targetLevel);
      window.scrollTo({ top: 120, behavior: "smooth" });
      return;
    }
    let isValid = false;
    if (currentLevel === 1) {
      isValid = await trigger(["categoryId", "subserviceId"]);
    } else if (currentLevel === 2) {
      isValid = await trigger(["title", "description", "urgency", "specificDate"]);
    } else if (currentLevel === 3) {
      isValid = await trigger(["selectedAddressId", "availableTimeFrom", "availableTimeTo"]);
    } else {
      isValid = true;
    }
    if (isValid) {
      setCurrentLevel(targetLevel);
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  };

  const onSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setShowSuccessModal(true);
    }, 700);
  };

  const selectedAddress =
    addresses.find((address) => address.id === selectedAddressId) ||
    addresses.find((address) => address.id === customerAddress?.id);

  const urgencyLabel = {
    TODAY: "Today",
    THIS_WEEK: "This Week",
    SPECIFIC_DATE: specificDate ? `On ${specificDate}` : "Specific Date",
    FLEXIBLE: "Flexible Date",
  }[urgency];

  const formatTime = (timeStr: string) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":").map(Number);
    if (isNaN(hours) || isNaN(minutes)) return timeStr;
    const period = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 || 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  const hasAnyActiveServices = categories.some(
    (cat) => cat.services && cat.services.length > 0
  );

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

  if (!getCategories.isPending && (!hasAnyActiveServices || categories.length === 0)) {
    return (
      <div className="app-content request-service-container no-services-fullscreen-container">
        <div className="no-services-fallback-card">
          <div className="no-services-icon-badge">
            <i className="fas fa-toolbox"></i>
          </div>
          <h2>We are sorry!</h2>
          <p>
            Currently we don't have any services available at this time. Please check back later.
          </p>
          <div className="no-services-actions">
            <Link to="/dashboard" className="btn btn-primary">
              <i className="fas fa-home mr-2"></i>
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-content request-service-container">
      <div className="request-service-header">
        <div className="request-service-title-row">
          <div className="request-service-title-group">
            <div className="request-step-pill">
              <span className="request-step-pill-dot"></span>
              <span>Level {currentLevel} of 4: {LEVEL_STEPS[currentLevel - 1].title}</span>
            </div>
            <h1>Post a Service Request</h1>
            <p>
              Complete the structured levels below to post your requirement to verified local specialists and receive competitive quotes.
            </p>
          </div>

          <div className="request-guarantee-pill">
            <i className="fas fa-shield-alt"></i>
            <span>Verified Quality & Price Protection</span>
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
              onClick={() => handleJumpToLevel(s.level)}
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

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="request-service-layout">
          <div className="levels-stepper-column">
            <div className="levels-stepper-card">
              <div className="levels-sidebar-header">
                <div>
                  <h3>Levels Roadmap</h3>
                  <p>Step-by-step service posting</p>
                </div>
                <span className="levels-count-pill">{currentLevel}/4</span>
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
                      onClick={() => handleJumpToLevel(s.level)}
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
                    {errors.categoryId && (
                      <div className="text-danger text-xs mt-3">
                        {errors.categoryId.message}
                      </div>
                    )}
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
                                  setValue("subserviceId", sub.id, { shouldValidate: true });
                                  if (!title) {
                                    setValue("title", sub.name, { shouldValidate: true });
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

                      {errors.subserviceId && (
                        <div className="text-danger text-xs mt-3">
                          {errors.subserviceId.message}
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
                          disabled={!selectedCategory || (selectedCategory.services.length > 0 && !selectedSubservice)}
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
                    <span className="char-count">{(title || "").length}/100</span>
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
                    <span className="char-count">{(description || "").length}/1000</span>
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
                      onClick={() => {
                        setValue("urgency", "TODAY", { shouldValidate: true });
                      }}
                    >
                      <div className="urgency-icon text-primary">
                        <i className="fas fa-calendar-day"></i>
                      </div>
                      <div className="urgency-title">Today</div>
                      <div className="urgency-desc">Within today</div>
                    </div>

                    <div
                      className={`urgency-card ${urgency === "THIS_WEEK" ? "selected" : ""}`}
                      onClick={() => {
                        setValue("urgency", "THIS_WEEK", { shouldValidate: true });
                      }}
                    >
                      <div className="urgency-icon text-info">
                        <i className="fas fa-calendar-week"></i>
                      </div>
                      <div className="urgency-title">This Week</div>
                      <div className="urgency-desc">Next 5 to 7 days</div>
                    </div>

                    <div
                      className={`urgency-card ${urgency === "SPECIFIC_DATE" ? "selected" : ""}`}
                      onClick={() => {
                        setValue("urgency", "SPECIFIC_DATE", { shouldValidate: true });
                      }}
                    >
                      <div className="urgency-icon text-warning">
                        <i className="fas fa-calendar-alt"></i>
                      </div>
                      <div className="urgency-title">Specific Date</div>
                      <div className="urgency-desc">Choose a date</div>
                    </div>

                    <div
                      className={`urgency-card ${urgency === "FLEXIBLE" ? "selected" : ""}`}
                      onClick={() => {
                        setValue("urgency", "FLEXIBLE", { shouldValidate: true });
                      }}
                    >
                      <div className="urgency-icon text-secondary">
                        <i className="fas fa-clock"></i>
                      </div>
                      <div className="urgency-title">Flexible</div>
                      <div className="urgency-desc">Anytime soon</div>
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
                        min={new Date().toISOString().split("T")[0]}
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
              getAddresses.isPending ? (
                <ServiceSelectionSkeleton />
              ) : (
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
                          onClick={() => {
                            setValue("selectedAddressId", addr.id!, { shouldValidate: true });
                          }}
                        >
                          <div className="address-radio-indicator">
                            {isSelected && <div className="address-radio-dot"></div>}
                          </div>
                          <div className="address-card-body">
                            <div className="address-card-header">
                              <span className="address-type-tag">{addr.type}</span>
                              <span className="address-text-main">{addr.landmark || addr.area}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    {errors.selectedAddressId && (
                      <div className="text-danger text-xs mt-1 mb-3">
                        {errors.selectedAddressId.message}
                      </div>
                    )}
                  </div>

                  <Link
                    to="/settings"
                    className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1.5 mb-4"
                  >
                    <i className="fas fa-plus-circle"></i>
                    <span>Add new location or manage addresses in Settings</span>
                  </Link>

                  <div className="request-form-group">
                    <label className="request-form-label">Mostly Available Time</label>
                    <div className="time-range-row">
                      <div className="time-range-field">
                        <span className="time-range-label">From</span>
                        <input
                          type="time"
                          className={`request-form-input ${errors.availableTimeFrom ? "border-danger" : ""}`}
                          {...register("availableTimeFrom")}
                        />
                        {errors.availableTimeFrom && (
                          <span className="text-danger text-xs mt-1 block">
                            {errors.availableTimeFrom.message}
                          </span>
                        )}
                      </div>
                      <div className="time-range-field">
                        <span className="time-range-label">To</span>
                        <input
                          type="time"
                          className={`request-form-input ${errors.availableTimeTo ? "border-danger" : ""}`}
                          {...register("availableTimeTo")}
                        />
                        {errors.availableTimeTo && (
                          <span className="text-danger text-xs mt-1 block">
                            {errors.availableTimeTo.message}
                          </span>
                        )}
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
              )
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
                    onClick={() => setValue("budgetType", "OPEN_BID", { shouldValidate: true })}
                  >
                    <i className="fas fa-tags mr-1.5"></i>
                    Open to Bids
                  </button>
                  <button
                    type="button"
                    className={`budget-tab-btn ${budgetType === "FIXED" ? "selected" : ""}`}
                    onClick={() => setValue("budgetType", "FIXED", { shouldValidate: true })}
                  >
                    <i className="fas fa-coins mr-1.5"></i>
                    Fixed Budget
                  </button>
                </div>

                {budgetType === "FIXED" && (
                  <div className="mb-4">
                    <div className="request-form-group">
                      <label className="request-form-label">
                        <span>Target Budget Amount (₹)</span>
                      </label>
                      <input
                        type="number"
                        min={100}
                        max={100000}
                        step={50}
                        className={`request-form-input ${errors.budgetAmount ? "border-danger" : ""}`}
                        {...register("budgetAmount")}
                      />
                      {errors.budgetAmount && (
                        <span className="text-danger text-xs mt-1 block">
                          {errors.budgetAmount.message}
                        </span>
                      )}
                    </div>

                    <div className="budget-presets-row">
                      <span className="text-xs text-secondary self-center mr-1">
                        Quick select:
                      </span>
                      {["500", "1000", "2000", "3500", "5000"].map((amt) => (
                        <button
                          key={amt}
                          type="button"
                          className="budget-preset-chip"
                          onClick={() => handlePresetBudget(amt)}
                        >
                          ₹{amt}
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

                <div className="request-policy-card">
                  <div className="request-policy-header">
                    <i className="fas fa-shield-alt"></i>
                    <span>Marketplace Policy & Workflow</span>
                  </div>
                  <div className="request-policy-steps">
                    <div className="request-policy-step">
                      <span className="policy-step-number">1</span>
                      <p>
                        <strong>Review & Quotations:</strong> Once posted, verified local specialists will review your request and submit quotations detailing their price and availability.
                      </p>
                    </div>
                    <div className="request-policy-step">
                      <span className="policy-step-number">2</span>
                      <p>
                        <strong>Choose & Accept:</strong> Compare received quotes, inspect provider credentials, and accept the offer that fits your preferences.
                      </p>
                    </div>
                    <div className="request-policy-step">
                      <span className="policy-step-number">3</span>
                      <p>
                        <strong>Advance & Platform Fee:</strong> To confirm and seal the contract upon accepting a quotation, you will pay the initial advance amount. Note: This advance includes the 10% platform service fee.
                      </p>
                    </div>
                  </div>

                  <label className="request-policy-checkbox-label">
                    <input
                      type="checkbox"
                      className="request-policy-checkbox"
                      {...register("agreedToPolicy")}
                    />
                    <span>
                      I understand and agree to the request flow, quotation acceptance terms, and the 10% platform fee included in the initial advance payment.
                    </span>
                  </label>
                  {errors.agreedToPolicy && (
                    <span className="text-danger text-xs mt-1 block">
                      {errors.agreedToPolicy.message}
                    </span>
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
                </div>
              </div>
            )}
          </div>

          <div className="request-summary-column">
            <div className="request-summary-card">
              <div className="summary-card-header">
                <div className="summary-status-pulse">
                  <span className="summary-pulse-dot"></span>
                </div>
                <div>
                  <h3 className="summary-card-title">Live Scope Summary</h3>
                  <p className="summary-card-subtext">
                    Real-time preview across all levels
                  </p>
                </div>
              </div>

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
                    {selectedAddress?.landmark || selectedAddress?.area || "Not selected"}
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
                      : `₹${budgetAmount}`}
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
                {currentLevel < 4 ? (
                  <button
                    type="button"
                    onClick={handleNextLevel}
                    className="summary-submit-btn"
                  >
                    <span>Continue to Level {currentLevel + 1}</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                ) : (
                  <button
                    type="submit"
                    disabled={isSubmitting || !agreedToPolicy}
                    className="summary-submit-btn"
                  >
                    {isSubmitting ? (
                      <>
                        <i className="fas fa-spinner fa-spin"></i>
                        <span>Posting Request...</span>
                      </>
                    ) : (
                      <>
                        <i className="fas fa-paper-plane"></i>
                        <span>Post Request</span>
                      </>
                    )}
                  </button>
                )}
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
            <h3>Request Posted Successfully!</h3>
            <p>
              Your requirement has been posted to verified specialists in your area. You will receive notifications as soon as quotes arrive.
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
                  {urgencyLabel} ({formatTime(availableTimeFrom)} - {formatTime(availableTimeTo)})
                </span>
              </div>
              <div className="request-success-info-row">
                <span>Location:</span>
                <span>{selectedAddress?.landmark || selectedAddress?.area || "N/A"}</span>
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
                  reset();
                  setShowSuccessModal(false);
                  setCurrentLevel(1);
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
