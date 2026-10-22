import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "react-toastify";
import { fetchAddressFromCoordinates } from "./fetchAddress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, type AddressInputType, type AddressPayload } from "../schemas/address.schema";

interface PhotonFeature {
  geometry: {
    coordinates: [number, number];
  };
  properties: {
    name?: string;
    street?: string;
    city?: string;
    county?: string;
    district?: string;
    state?: string;
    country?: string;
    postcode?: string;
  };
}

export const useLocationPicker = (
  onSave: (data: AddressPayload) => void,
  onClose: () => void,
  initialData: AddressPayload | null = null,
  isOpen: boolean = false
) => {
  const [step, setStep] = useState<1 | 2>(initialData ? 2 : 1);
  const [isLocating, setIsLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);
  const [coordinates, setCoordinates] = useState<{
    lat: number | null;
    lng: number | null;
  }>({ lat: initialData?.latitude || null, lng: initialData?.longitude || null });
  
  const form = useForm<AddressInputType>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      house_no: initialData?.house_no || "",
      area: initialData?.area || "",
      city: initialData?.city || "",
      district: initialData?.district || "",
      state: initialData?.state || "",
      country: initialData?.country || "",
      pincode: initialData?.pincode || "",
      landmark: initialData?.landmark || "",
    },
  });
  const [addressType, setAddressType] = useState(initialData?.type || "Home");

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        form.reset({
          house_no: initialData.house_no || "",
          area: initialData.area || "",
          city: initialData.city || "",
          district: initialData.district || "",
          state: initialData.state || "",
          country: initialData.country || "",
          pincode: initialData.pincode || "",
          landmark: initialData.landmark || "",
        });
        setAddressType(initialData.type || "Home");
        setCoordinates({ lat: initialData.latitude ?? null, lng: initialData.longitude ?? null });
        setStep(2);
      } else {
        form.reset({
          house_no: "", area: "", city: "", district: "", state: "", country: "", pincode: "", landmark: ""
        });
        setAddressType("Home");
        setCoordinates({ lat: null, lng: null });
        setStep(1);
      }
    }
  }, [initialData, form, isOpen]);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<PhotonFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  const debounceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchQuery.trim().length > 2) {
      const timer = setTimeout(async () => {
        setIsSearching(true);
        setShowDropdown(true);
        try {
          const response = await fetch(
            `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=5`,
          );
          const data = await response.json();
          setSearchResults(data.features || []);
        } catch {
          toast.error("Searching failed");
        } finally {
          setIsSearching(false);
        }
      }, 400);

      return () => clearTimeout(timer);
    } else {
      queueMicrotask(() => {
        setSearchResults([]);
        setShowDropdown(false);
        setIsSearching(false);
      });
    }
  }, [searchQuery]);

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    const addressDetails = await fetchAddressFromCoordinates(lat, lng);
    if (addressDetails) {
      if (addressDetails.locality) form.setValue("area", addressDetails.locality, { shouldValidate: true });
      if (addressDetails.city) form.setValue("city", addressDetails.city, { shouldValidate: true });
      if (addressDetails.district) form.setValue("district", addressDetails.district, { shouldValidate: true });
      if (addressDetails.state) form.setValue("state", addressDetails.state, { shouldValidate: true });
      if (addressDetails.country) form.setValue("country", addressDetails.country, { shouldValidate: true });
      if (addressDetails.pincode) form.setValue("pincode", addressDetails.pincode, { shouldValidate: true });
    }
    setIsGeocoding(false);
  };

  const handleSelectLocation = (feature: PhotonFeature) => {
    const coords = feature.geometry.coordinates;
    const props = feature.properties;

    setCoordinates({ lat: coords[1], lng: coords[0] });
    setLocationAccuracy(null);

    const area = props.name || props.street;
    if (area) form.setValue("area", area, { shouldValidate: true });
    
    const city = props.city || props.county;
    if (city) form.setValue("city", city, { shouldValidate: true });
    
    if (props.district) form.setValue("district", props.district, { shouldValidate: true });
    if (props.state) form.setValue("state", props.state, { shouldValidate: true });
    if (props.country) form.setValue("country", props.country, { shouldValidate: true });
    if (props.postcode) form.setValue("pincode", props.postcode, { shouldValidate: true });

    setSearchQuery("");
    setShowDropdown(false);

    reverseGeocode(coords[1], coords[0]);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation is not supported by your device.");
      return;
    }
    setIsLocating(true);
    setLocationAccuracy(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setCoordinates({ lat, lng });
        setLocationAccuracy(accuracy);
        setIsLocating(false);

        reverseGeocode(lat, lng);
      },
      (error) => {
        setIsLocating(false);
        let message = "Could not retrieve current location.";
        if (error.code === error.PERMISSION_DENIED)
          message = "Location permission denied. Please search instead.";
        if (error.code === error.TIMEOUT)
          message = "Location request timed out. Please try again.";
        toast.error(message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  const handleMapMoveEnd = useCallback((lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    setLocationAccuracy(null);

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      reverseGeocode(lat, lng);
    }, 800);
  }, []);

  const handleConfirmLocation = () => {
    if (!coordinates.lat || !coordinates.lng) {
      toast.error("Please select a location on the map first.");
      return;
    }
    setStep(2);
  };

  const handleBackToMap = () => {
    setStep(1);
  };

  const handleSaveAddress = form.handleSubmit((data) => {
    const apiPayload: AddressPayload = {
      ...data,

      type: addressType,
      latitude: Number(coordinates.lat),
      longitude: Number(coordinates.lng),
    };
    onSave(apiPayload);
    onClose();
  });

  const isEditing = !!initialData;
  const hasChanges = isEditing ? (
    form.formState.isDirty || 
    addressType !== initialData.type ||
    Number(coordinates.lat) !== Number(initialData.latitude) ||
    Number(coordinates.lng) !== Number(initialData.longitude)
  ) : true;

  return {
    step,
    setStep,
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
  };
};
