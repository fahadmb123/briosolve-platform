export interface GoogleGeocodeResponse {
  status: string;
  results: {
    formatted_address: string;
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
}

export const fetchAddressWithCoordinates = async (
  lat: number,
  lng: number,
): Promise<GoogleGeocodeResponse> => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`,
  );

  const data = await response.json();
  return data;
};
