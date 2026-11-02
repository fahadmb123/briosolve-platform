import { ServiceSelectionSkeleton } from "../../../components/ServiceSelectionSkeleton";
import type { Category, ServiceItem } from "./types";

interface Level1ServiceStepProps {
  categories: Category[];
  selectedCategory: Category | null;
  selectedSubservice: ServiceItem | null;
  isLoading: boolean;
  errorCategoryId?: string;
  errorSubserviceId?: string;
  onSelectCategory: (category: Category) => void;
  onSelectSubservice: (service: ServiceItem) => void;
  onNext: () => void;
}

export function Level1ServiceStep({
  categories,
  selectedCategory,
  selectedSubservice,
  isLoading,
  errorCategoryId,
  errorSubserviceId,
  onSelectCategory,
  onSelectSubservice,
  onNext,
}: Level1ServiceStepProps) {
  if (isLoading) {
    return <ServiceSelectionSkeleton />;
  }

  return (
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
                onClick={() => onSelectCategory(cat)}
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
        {errorCategoryId && (
          <div className="text-danger text-xs mt-3">
            {errorCategoryId}
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
                    onClick={() => onSelectSubservice(sub)}
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

          {errorSubserviceId && (
            <div className="text-danger text-xs mt-3">
              {errorSubserviceId}
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
              onClick={onNext}
            >
              <span>Continue to Level 2</span>
              <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
