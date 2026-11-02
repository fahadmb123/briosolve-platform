import { useState, useId, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../../auth/stores/auth.store";
import { useGetAddresses, type Address, type AddressPayload } from "../../../addresses";
import { VerificationRequiredCard } from "../../../../shared/components/ui/VerificationRequiredCard/VerificationRequiredCard";
import "./RequestService.css";
import { useGetCategoriesService } from "../../../service-catalog";
import {
  serviceRequestSchema,
  type ServiceRequestInputType
} from "../../schemas/serviceRequest.schema";
import {
  type Category,
  type ServiceItem,
  LEVEL_STEPS,
  LevelsMobileBar,
  LevelsSidebar,
  Level1ServiceStep,
  Level2RequirementsStep,
  Level3ScheduleStep,
  Level4BudgetStep,
  RequestSummary,
  RequestSuccessModal
} from "./components";

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
    let isValid:boolean;
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

  const getUrgencyLabel = (
    urg: ServiceRequestInputType["urgency"],
    date?: string
  ) => {
    switch (urg) {
      case "TODAY":
        return "Today";
      case "THIS_WEEK":
        return "This Week";
      case "SPECIFIC_DATE":
        return date ? `On ${date}` : "Specific Date";
      case "FLEXIBLE":
        return "Flexible Date";
      default:
        return "Today";
    }
  };

  const urgencyLabel = getUrgencyLabel(
    urgency as ServiceRequestInputType["urgency"],
    specificDate
  );

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

      <LevelsMobileBar
        currentLevel={currentLevel}
        onSelectLevel={handleJumpToLevel}
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="request-service-layout">
          <LevelsSidebar
            currentLevel={currentLevel}
            onSelectLevel={handleJumpToLevel}
          />

          <div className="request-form-column">
            {currentLevel === 1 && (
              <Level1ServiceStep
                categories={categories}
                selectedCategory={selectedCategory}
                selectedSubservice={selectedSubservice}
                isLoading={getCategories.isPending}
                errorCategoryId={errors.categoryId?.message}
                errorSubserviceId={errors.subserviceId?.message}
                onSelectCategory={handleCategorySelect}
                onSelectSubservice={(sub) => {
                  setSelectedSubservice(sub);
                  setValue("subserviceId", sub.id, { shouldValidate: true });
                  if (!title) {
                    setValue("title", sub.name, { shouldValidate: true });
                  }
                }}
                onNext={handleNextLevel}
              />
            )}

            {currentLevel === 2 && (
              <Level2RequirementsStep
                register={register}
                errors={errors}
                urgency={urgency}
                titleValue={title}
                descriptionValue={description}
                onSelectUrgency={(u) => setValue("urgency", u, { shouldValidate: true })}
                onPrev={handlePrevLevel}
                onNext={handleNextLevel}
              />
            )}

            {currentLevel === 3 && (
              <Level3ScheduleStep
                addresses={addresses}
                selectedAddressId={selectedAddressId}
                isLoadingAddresses={getAddresses.isPending}
                register={register}
                errors={errors}
                onSelectAddress={(id) => setValue("selectedAddressId", id, { shouldValidate: true })}
                onPrev={handlePrevLevel}
                onNext={handleNextLevel}
              />
            )}

            {currentLevel === 4 && (
              <Level4BudgetStep
                fileInputId={fileInputId}
                budgetType={budgetType}
                uploadedImages={uploadedImages}
                register={register}
                errors={errors}
                onSelectBudgetType={(bt) => setValue("budgetType", bt, { shouldValidate: true })}
                onPresetBudget={handlePresetBudget}
                onFileUpload={handleFileUpload}
                onRemoveImage={handleRemoveImage}
                onPrev={handlePrevLevel}
              />
            )}
          </div>

          <RequestSummary
            currentLevel={currentLevel}
            selectedCategory={selectedCategory}
            selectedSubservice={selectedSubservice}
            urgencyLabel={urgencyLabel}
            selectedAddressText={selectedAddress?.landmark || selectedAddress?.area || "Not selected"}
            budgetType={budgetType}
            budgetAmount={budgetAmount || ""}
            uploadedImagesCount={uploadedImages.length}
            isSubmitting={isSubmitting}
            agreedToPolicy={agreedToPolicy}
            onNextLevel={handleNextLevel}
          />
        </div>
      </form>

      <RequestSuccessModal
        isOpen={showSuccessModal}
        categoryName={selectedCategory?.name}
        subserviceName={selectedSubservice?.name}
        urgencyLabel={urgencyLabel}
        availableTimeFrom={availableTimeFrom}
        availableTimeTo={availableTimeTo}
        locationLandmark={selectedAddress?.landmark || selectedAddress?.area}
        onCloseAndReset={() => {
          reset();
          setShowSuccessModal(false);
          setCurrentLevel(1);
          setUploadedImages([]);
        }}
      />
    </div>
  );
}
