import { toast } from "react-toastify";
import { fetchAddressWithCoordinates } from "../../services/external.service";

export const fetchAddressFromCoordinates = async (lat: number, lng: number) => {
  try {
    const data = await fetchAddressWithCoordinates(lat, lng);

    if (data && data.address) {
      const addr = data.address;
      const area = addr.road || addr.neighbourhood || addr.suburb || "";
      const district = addr.city_district || addr.state_district || addr.county || "";
      const city = addr.city || addr.town || addr.village || district || area;
      const state = addr.state || "";
      const country = addr.country || "";
      const pincode = addr.postcode || "";

      return { locality: area, city, district, state, country, pincode };
    }
  } catch (error) {
    toast.error("Failed to fetch address details");
    console.error(error);
  }

  return null;
};
