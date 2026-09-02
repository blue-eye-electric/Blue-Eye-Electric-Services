import type { ReverseGeocodeResult } from "../types/location";

export const reverseGeocode = async (
  latitude: number,
  longitude: number,
): Promise<ReverseGeocodeResult> => {
  const apiKey = import.meta.env.VITE_OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_OPENROUTESERVICE_API_KEY is not configured");
  }

  const url = new URL("https://api.openrouteservice.org/geocode/reverse");
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("point.lat", String(latitude));
  url.searchParams.set("point.lon", String(longitude));
  url.searchParams.set("size", "1");

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`OpenRouteService error: ${response.status}`);
  }

  const data = await response.json();
  return {
    address: data.features?.[0]?.properties?.label ?? "",
  };
};

export type PlaceSearchResult = {
  display_name: string;
  lat: string;
  lon: string;
};

export const searchPlaces = async (
  query: string,
): Promise<PlaceSearchResult[]> => {
  if (!query.trim()) return [];

  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(
      query,
    )}`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Failed to search location");
  }

  return response.json();
};




// Mapple Service
// import type { ReverseGeocodeResult } from "../types/location";

// const MAPPLS_BASE_URL = "https://apis.mappls.com/advancedmaps/v1";

// const getAccessToken = (): string => {
//   const token = import.meta.env.VITE_MAPPLS_ACCESS_TOKEN;

//   if (!token) {
//     throw new Error("VITE_MAPPLS_ACCESS_TOKEN is not configured");
//   }

//   return token;
// };

// /**
//  * Reverse geocode:
//  * latitude + longitude -> address
//  */
// export const reverseGeocode = async (
//   latitude: number,
//   longitude: number,
// ): Promise<ReverseGeocodeResult> => {
//   const token = getAccessToken();

//   const url =
//     `${MAPPLS_BASE_URL}/${token}/rev_geocode` +
//     `?lat=${encodeURIComponent(latitude)}` +
//     `&lng=${encodeURIComponent(longitude)}`;

//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error(`Mappls reverse geocoding error: ${response.status}`);
//   }

//   const data = await response.json();

//   const result = data?.results?.[0];

//   return {
//     address:
//       result?.formatted_address ||
//       result?.formattedAddress ||
//       result?.placeAddress ||
//       result?.address ||
//       "",
//   };
// };

// /**
//  * Search places:
//  * query -> places with latitude/longitude
//  */
// export type PlaceSearchResult = {
//   address: string;
//   latitude: number;
//   longitude: number;
// };

// export const searchPlaces = async (
//   query: string,
// ): Promise<PlaceSearchResult[]> => {
//   const trimmedQuery = query.trim();

//   if (!trimmedQuery) {
//     return [];
//   }

//   const token = getAccessToken();

//   const url =
//     `${MAPPLS_BASE_URL}/${token}/place_search` +
//     `?query=${encodeURIComponent(trimmedQuery)}` +
//     `&region=IND`;

//   const response = await fetch(url);

//   if (!response.ok) {
//     throw new Error(`Mappls place search error: ${response.status}`);
//   }

//   const data = await response.json();

//   const results = data?.suggestedLocations ?? data?.results ?? [];

//   return results
//     .map((item: any) => ({
//       address:
//         item?.placeAddress ||
//         item?.placeName ||
//         item?.formatted_address ||
//         item?.address ||
//         "",

//       latitude: Number(
//         item?.latitude ??
//           item?.lat ??
//           item?.y ??
//           item?.location?.lat,
//       ),

//       longitude: Number(
//         item?.longitude ??
//           item?.lng ??
//           item?.lon ??
//           item?.x ??
//           item?.location?.lng,
//       ),
//     }))
//     .filter(
//       (item: PlaceSearchResult) =>
//         item.address &&
//         Number.isFinite(item.latitude) &&
//         Number.isFinite(item.longitude),
//     )
//     .slice(0, 5);
// };