import { toast } from "react-toastify";
import { fetchAddressWithCoordinates } from "../../services/external.service";

interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

interface GeocodeResult {
  address_components: AddressComponent[];
}

export const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    const data = await fetchAddressWithCoordinates(lat, lng);

    if (data.status === "OK" && data.results && data.results.length > 0) {
      let area = "";
      let city = "";
      let district = "";
      let state = "";
      let country = "";
      let pincode = "";

      for (const result of data.results as GeocodeResult[]) {
        for (const component of result.address_components) {
          const types = component.types;

          if (
            types.includes("sublocality") ||
            types.includes("route") ||
            types.includes("neighborhood")
          ) {
            if (!area) area = component.long_name;
          }
          if (types.includes("locality")) {
            if (!city) city = component.long_name;
          }
          if (types.includes("administrative_area_level_2")) {
            if (!district) district = component.long_name;
          }
          if (types.includes("administrative_area_level_1")) {
            if (!state) state = component.long_name;
          }
          if (types.includes("country")) {
            if (!country) country = component.long_name;
          }
          if (types.includes("postal_code")) {
            if (!pincode) pincode = component.long_name;
          }
        }
      }

      if (!district) {
        for (const result of data.results as GeocodeResult[]) {
          for (const component of result.address_components) {
            if (component.types.includes("administrative_area_level_3")) {
              district = component.long_name;
            }
          }
        }
      }

      if (!city) {
        city = district || area;
      }

      return { locality: area, city, district, state, country, pincode };
    }
  } catch (error) {
    toast.error("Failed tofetch address");
    console.log(error);
  }

  return null;
};
