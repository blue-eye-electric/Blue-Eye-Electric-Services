// import type { ReverseGeocodeResult } from "../types/location";

// export const reverseGeocode = async (
//   latitude: number,
//   longitude: number,
// ): Promise<ReverseGeocodeResult> => {
//   const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

//   if (!apiKey) {
//     throw new Error("VITE_OPENROUTESERVICE_API_KEY is not configured");
//   }

//   const url = new URL("https://api.openrouteservice.org/geocode/reverse");
//   url.searchParams.set("api_key", apiKey);
//   url.searchParams.set("point.lat", String(latitude));
//   url.searchParams.set("point.lon", String(longitude));
//   url.searchParams.set("size", "1");

//   const response = await fetch(url.toString());

//   if (!response.ok) {
//     throw new Error(`OpenRouteService error: ${response.status}`);
//   }

//   const data = await response.json();
//   return {
//     address: data.features?.[0]?.properties?.label ?? "",
//   };
// };

// export type PlaceSearchResult = {
//   display_name: string;
//   lat: string;
//   lon: string;
// };

// export const searchPlaces = async (
//   query: string,
// ): Promise<PlaceSearchResult[]> => {
//   if (!query.trim()) return [];

//   const response = await fetch(
//     `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(
//       query,
//     )}`,
//     {
//       headers: {
//         Accept: "application/json",
//       },
//     },
//   );

//   if (!response.ok) {
//     throw new Error("Failed to search location");
//   }

//   return response.json();
// };




// Google
import type { ReverseGeocodeResult } from "../types/location";

export type PlaceSearchResult = {
  display_name: string;
  lat: string;
  lon: string;
  place_id: string;
};

/**
 * Google reverse geocoding
 * Coordinates → Address
 */
export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> => {
  if (!window.google?.maps) {
    throw new Error("Google Maps API is not loaded");
  }

  const geocoder = new google.maps.Geocoder();

  const response = await geocoder.geocode({
    location: {
      lat: latitude,
      lng: longitude,
    },
  });

  const result = response.results?.[0];

  return {
    address: result?.formatted_address ?? "",
  };
};

/**
 * Google Places Autocomplete
 * Search text → Place suggestions
 */
export const searchPlaces = async (
  query: string,
): Promise<PlaceSearchResult[]> => {
  if (!query.trim()) return [];

  if (!window.google?.maps?.places) {
    throw new Error("Google Places API is not loaded");
  }

  const { suggestions } =
    await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
      {
        input: query.trim(),

        // Restrict results to India
        includedRegionCodes: ["in"],
      },
    );

  return suggestions
    .filter((item) => item.placePrediction)
    .map((item) => {
      const prediction = item.placePrediction!;

      return {
        display_name:
          prediction.text?.text ??
          prediction.mainText?.text ??
          "",

        lat: "",
        lon: "",

        place_id: prediction.placeId,
      };
    });
};