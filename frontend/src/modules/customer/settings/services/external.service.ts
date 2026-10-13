export interface OsmReverseGeocodeResponse {
  display_name?: string;
  address?: {
    road?: string;
    neighbourhood?: string;
    suburb?: string;
    city?: string;
    town?: string;
    village?: string;
    city_district?: string;
    state_district?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country?: string;
  };
}

export const fetchAddressWithCoordinates = async (
  lat: number,
  lng: number,
): Promise<OsmReverseGeocodeResponse | null> => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
      {
        headers: {
          "Accept-Language": "en",
        },
      }
    );
    if (!response.ok) throw new Error("Nominatim error");
    return await response.json();
  } catch (error) {
    console.warn("Nominatim reverse geocode error, attempting Photon fallback:", error);
    try {
      const fallbackRes = await fetch(
        `https://photon.komoot.io/reverse?lat=${lat}&lon=${lng}`
      );
      const fallbackData = await fallbackRes.json();
      const props = fallbackData.features?.[0]?.properties;
      if (props) {
        return {
          display_name: props.name || props.street || "",
          address: {
            road: props.street || props.name,
            city: props.city,
            state: props.state,
            postcode: props.postcode,
            country: props.country,
            county: props.district,
          },
        };
      }
    } catch (fallbackError) {
      console.error("Photon fallback also failed:", fallbackError);
    }
    return null;
  }
};
