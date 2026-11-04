import { Link } from "react-router-dom";
import type { UseFormRegister, FieldErrors } from "react-hook-form";
import type { AddressPayload } from "../../../addresses";
import { ServiceSelectionSkeleton } from "../ServiceSelectionSkeleton";
import type { ServiceRequestInputType } from "../../schemas/serviceRequest.schema";

interface Level3ScheduleStepProps {
  addresses: AddressPayload[];
  selectedAddressId: string;
  isLoadingAddresses: boolean;
  register: UseFormRegister<ServiceRequestInputType>;
  errors: FieldErrors<ServiceRequestInputType>;
  onSelectAddress: (id: string) => void;
  onPrev: () => void;
  onNext: () => void;
}

export function Level3ScheduleStep({
  addresses,
  selectedAddressId,
  isLoadingAddresses,
  register,
  errors,
  onSelectAddress,
  onPrev,
  onNext,
}: Level3ScheduleStepProps) {
  if (isLoadingAddresses) {
    return <ServiceSelectionSkeleton />;
  }

  return (
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
              onClick={() => onSelectAddress(addr.id!)}
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
          onClick={onPrev}
        >
          <i className="fas fa-arrow-left"></i>
          <span>Back to Level 2</span>
        </button>
        <button
          type="button"
          className="level-nav-next-btn"
          onClick={onNext}
        >
          <span>Continue to Level 4</span>
          <i className="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
}
