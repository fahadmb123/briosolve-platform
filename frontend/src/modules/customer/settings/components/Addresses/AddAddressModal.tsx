import React from "react";
import { useLocationPicker } from "../../hooks/useLocationPicker";
import { type AddressPayload } from "../../schemas/validation";
import { APIProvider, Map, useMap } from "@vis.gl/react-google-maps";

const MapUpdater = ({lat,lng,}: {lat: number | null;lng: number | null;}) => {

  const map = useMap();
  React.useEffect(() => {
    if (map && lat && lng) {
      map.panTo({ lat, lng });
    }
  }, [map, lat, lng]);
  return null;
}

interface AddAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (data: AddressPayload) => void;
  initialData?: AddressPayload | null;
}

export const AddAddressModal: React.FC<AddAddressModalProps> = ({
  isOpen,
  onClose,
  onSave = () => {},
  initialData = null,
}) => {
  const {
    step,
    isLocating,
    locationAccuracy,
    coordinates,
    form,
    addressType,
    setAddressType,
    handleCurrentLocation,
    handleMapMoveEnd,
    handleConfirmLocation,
    handleBackToMap,
    handleSaveAddress,
    searchQuery,
    setSearchQuery,
    searchResults,
    isSearching,
    showDropdown,
    setShowDropdown,
    handleSelectLocation,
    isGeocoding,
    hasChanges,
  } = useLocationPicker(onSave, onClose, initialData, isOpen);

  const { register, formState: { errors }, watch } = form;
  const { area, city, pincode } = watch();

  if (!isOpen) return null;

  return (
    <APIProvider
      apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "YOUR_API_KEY"}
    >
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity cursor-pointer"
          onClick={onClose}
        ></div>

        {/* Modal Container */}
        <div className="relative bg-surface rounded-t-2xl sm:rounded-2xl w-full max-w-lg shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-8 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-300 max-h-[95vh] sm:max-h-[90vh] mt-16 sm:mt-0">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-surface-variant">
            <div className="flex items-center gap-3">
              {step === 2 && (
                <button
                  onClick={handleBackToMap}
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest border-none cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">
                    arrow_back
                  </span>
                </button>
              )}
              <div>
                <h3 className="font-headline-md text-headline-md font-semibold text-on-surface m-0">
                  {step === 1
                    ? "Where is this address?"
                    : "Add Address Details"}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 m-0">
                  {step === 1
                    ? "Search or drag the map to your location."
                    : "Enter the details for your new location."}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-container-highest text-on-surface-variant hover:text-on-surface transition-colors border-none cursor-pointer"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto flex flex-col">
            {step === 1 && (
              <div className="flex flex-col gap-4 p-5 sm:p-6 pb-0 flex-1">
                {/* Search Bar */}
                <div className="relative z-20">
                  <span
                    className={`material-symbols-outlined absolute left-3 top-2.5 text-on-surface-variant text-[20px] ${isSearching ? "animate-spin" : ""}`}
                  >
                    {isSearching ? "sync" : "search"}
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => {
                      if (searchQuery.trim().length > 2) setShowDropdown(true);
                    }}
                    className="w-full h-11 pl-10 pr-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Search area, street, landmark..."
                  />

                  {/* Autocomplete Dropdown */}
                  {showDropdown &&
                    (searchResults.length > 0 ||
                      (searchQuery.trim().length > 2 && !isSearching)) && (
                      <ul className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-surface-variant rounded-lg shadow-xl max-h-60 overflow-y-auto z-30 m-0 p-0 list-none">
                        {searchResults.length > 0 ? (
                          searchResults.map((result, idx) => (
                            <li
                              key={idx}
                              onClick={() => handleSelectLocation(result)}
                              className="px-4 py-3 hover:bg-surface-container cursor-pointer border-b border-surface-variant last:border-0 transition-colors"
                            >
                              <div className="font-label-md text-label-md text-on-surface font-medium">
                                {result.properties.name ||
                                  result.properties.street ||
                                  "Unknown Location"}
                              </div>
                              <div className="font-body-sm text-[11px] text-on-surface-variant mt-0.5">
                                {[
                                  result.properties.city,
                                  result.properties.state,
                                  result.properties.country,
                                ]
                                  .filter(Boolean)
                                  .join(", ")}
                              </div>
                            </li>
                          ))
                        ) : (
                          <li className="px-4 py-3 border-b border-surface-variant last:border-0 text-center">
                            <div className="font-label-md text-label-md text-on-surface font-bold">
                              No results found.
                            </div>
                          </li>
                        )}
                      </ul>
                    )}
                </div>

                {/* Current Location Button */}
                <button
                  onClick={handleCurrentLocation}
                  disabled={isLocating}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg border border-primary text-primary font-label-md text-label-md font-semibold hover:bg-primary/5 transition-colors cursor-pointer bg-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLocating ? (
                    <span className="material-symbols-outlined text-[18px] animate-spin">
                      sync
                    </span>
                  ) : (
                    <span className="material-symbols-outlined text-[18px]">
                      my_location
                    </span>
                  )}
                  <span>
                    {isLocating
                      ? "Getting your location..."
                      : "Use Current Location"}
                  </span>
                </button>

                {locationAccuracy && locationAccuracy > 200 && (
                  <div className="bg-orange-50 border border-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm flex gap-2 items-start mt-2">
                    <span className="material-symbols-outlined text-[18px] text-orange-500">
                      warning
                    </span>
                    <span>
                      Location may not be precise (
                      {Math.round(locationAccuracy)}m radius). Please adjust the
                      map manually.
                    </span>
                  </div>
                )}

                {/* Map Area */}
                <div className="relative w-full h-[300px] bg-slate-200 dark:bg-slate-800 border border-surface-variant rounded-xl overflow-hidden">
                  {coordinates.lat && coordinates.lng ? (
                    <>
                      <Map
                        defaultCenter={{
                          lat: Number(coordinates.lat),
                          lng: Number(coordinates.lng),
                        }}
                        defaultZoom={14}
                        onIdle={(ev) => {
                          const center = ev.map.getCenter();
                          if (center) {
                            handleMapMoveEnd(center.lat(), center.lng());
                          }
                        }}
                        disableDefaultUI={true}
                        gestureHandling={"greedy"}
                        style={{ width: "100%", height: "100%" }}
                      />
                      <MapUpdater lat={Number(coordinates.lat)} lng={Number(coordinates.lng)} />
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl mb-2">
                        map
                      </span>
                      <p className="text-sm">Search or use current location</p>
                    </div>
                  )}

                  {/* Fixed Center Pin Overlay */}
                  {coordinates.lat && coordinates.lng && (
                    <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center pb-8">
                      <span
                        className="material-symbols-outlined text-[42px] text-red-500 drop-shadow-md"
                        style={{ fontVariationSettings: "'FILL' 1" }}
                      >
                        location_on
                      </span>
                      <div className="w-3 h-1 bg-black/20 rounded-full blur-[1px] -mt-1"></div>
                    </div>
                  )}
                </div>

                {/* Display Reverse Geocoded Address */}
                <div className="min-h-[60px] flex items-center bg-surface-container-lowest p-3 rounded-xl border border-surface-variant mt-2 mb-4">
                  <span className="material-symbols-outlined text-primary mr-3">
                    location_city
                  </span>
                  <div className="flex-1">
                    {isGeocoding ? (
                      <div className="text-sm text-on-surface-variant animate-pulse">
                        Detecting address...
                      </div>
                    ) : (
                      <div className="text-sm font-medium text-on-surface">
                        {[
                          area,
                          city,
                          pincode,
                        ]
                          .filter(Boolean)
                          .join(", ") || "Move map to select location"}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="flex flex-col gap-5 p-5 sm:p-6 pt-5">
                
                {/* Location Map Preview / Edit Button */}
                <div className="flex items-center justify-between p-3.5 bg-surface-container-lowest border border-primary/20 rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-primary text-2xl">location_on</span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-on-surface">Map Location Pinned</span>
                      <span className="text-xs text-on-surface-variant">
                        {coordinates.lat ? Number(coordinates.lat).toFixed(5) : '0'}°, {coordinates.lng ? Number(coordinates.lng).toFixed(5) : '0'}°
                      </span>
                    </div>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleBackToMap}
                    className="text-xs font-semibold px-3 py-2 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg transition-colors border-none cursor-pointer flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[16px]">map</span>
                    Adjust Pin
                  </button>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-medium text-on-surface">
                    House / Flat / Block No.{" "}
                    <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("house_no")}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="E.g. Flat 3B, Block A"
                  />
                  {errors.house_no && <span className="text-error text-xs">{errors.house_no.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-medium text-on-surface">
                    Area / Locality <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("area")}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="Enter your area"
                  />
                  {errors.area && <span className="text-error text-xs">{errors.area.message}</span>}
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md font-medium text-on-surface">
                      City <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("city")}
                      className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="City"
                    />
                    {errors.city && <span className="text-error text-xs">{errors.city.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md font-medium text-on-surface">
                      District <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("district")}
                      className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="District"
                    />
                    {errors.district && <span className="text-error text-xs">{errors.district.message}</span>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md font-medium text-on-surface">
                      State <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("state")}
                      className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="State"
                    />
                    {errors.state && <span className="text-error text-xs">{errors.state.message}</span>}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label-md text-label-md font-medium text-on-surface">
                      Country <span className="text-error">*</span>
                    </label>
                    <input
                      type="text"
                      {...register("country")}
                      className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                      placeholder="Country"
                    />
                    {errors.country && <span className="text-error text-xs">{errors.country.message}</span>}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-medium text-on-surface">
                    Pincode <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("pincode")}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="6 digits"
                  />
                  {errors.pincode && <span className="text-error text-xs">{errors.pincode.message}</span>}
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="font-label-md text-label-md font-medium text-on-surface">
                    Nearby Landmark <span className="text-error">*</span>
                  </label>
                  <input
                    type="text"
                    {...register("landmark")}
                    className="w-full h-11 px-4 rounded-lg bg-surface-container-lowest border border-surface-variant text-on-surface font-body-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    placeholder="E.g. Opposite Central Mall"
                  />
                  {errors.landmark && <span className="text-error text-xs">{errors.landmark.message}</span>}
                </div>

                {/* Section 3: Address Tags & Save */}
                <div className="pt-2">
                  <label className="block font-label-md text-label-md font-medium text-on-surface mb-3">
                    Save As
                  </label>
                  <div className="flex gap-3">
                    <label className="cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="addressType"
                        checked={addressType === "Home"}
                        onChange={() => setAddressType("Home")}
                        className="peer sr-only"
                      />
                      <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-surface-variant bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary text-on-surface-variant peer-checked:text-on-primary transition-all">
                        <span className="font-label-md text-label-md font-semibold">
                          Home
                        </span>
                      </div>
                    </label>
                    <label className="cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="addressType"
                        checked={addressType === "Work"}
                        onChange={() => setAddressType("Work")}
                        className="peer sr-only"
                      />
                      <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-surface-variant bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary text-on-surface-variant peer-checked:text-on-primary transition-all">
                        <span className="font-label-md text-label-md font-semibold">
                          Work
                        </span>
                      </div>
                    </label>
                    <label className="cursor-pointer flex-1">
                      <input
                        type="radio"
                        name="addressType"
                        checked={addressType === "Other"}
                        onChange={() => setAddressType("Other")}
                        className="peer sr-only"
                      />
                      <div className="flex items-center justify-center gap-2 py-2 px-3 rounded-full border border-surface-variant bg-surface-container-lowest peer-checked:border-primary peer-checked:bg-primary text-on-surface-variant peer-checked:text-on-primary transition-all">
                        <span className="font-label-md text-label-md font-semibold">
                          Other
                        </span>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-surface-variant bg-surface sticky bottom-0 z-10 w-full rounded-b-2xl shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
            {step === 1 ? (
              <button
                onClick={handleConfirmLocation}
                disabled={!coordinates.lat || isGeocoding}
                className="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center shadow-lg transition-all active:scale-[0.99] border-none cursor-pointer disabled:opacity-50"
              >
                {isGeocoding ? "Detecting address..." : "Confirm Location"}
              </button>
            ) : (
              <button
                onClick={handleSaveAddress}
                disabled={!hasChanges}
                className="w-full py-3.5 rounded-xl bg-primary hover:opacity-90 text-on-primary font-label-lg text-label-lg font-semibold flex items-center justify-center shadow-lg transition-all active:scale-[0.99] border-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Address
              </button>
            )}
          </div>
        </div>
      </div>
    </APIProvider>
  );
};
