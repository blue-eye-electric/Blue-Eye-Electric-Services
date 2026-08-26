type Coordinates = {
  latitude: number;
  longitude: number;
};

type DrivingDistanceResult = {
  distanceKm: number;
  durationMinutes: number;
};

const ORS_API_URL =
  "https://api.openrouteservice.org/v2/directions/driving-car";

const ORS_API_KEY =
  import.meta.env.VITE_ORS_API_KEY;

export async function getDrivingDistance(
  from: Coordinates,
  to: Coordinates,
): Promise<DrivingDistanceResult> {
  if (!ORS_API_KEY) {
    throw new Error(
      "OpenRouteService API key is not configured.",
    );
  }

  const response = await fetch(
    `${ORS_API_URL}?api_key=${encodeURIComponent(
      ORS_API_KEY,
    )}&start=${from.longitude},${from.latitude}&end=${to.longitude},${to.latitude}`,
  );

  if (!response.ok) {
    throw new Error(
      `Distance API failed with status ${response.status}.`,
    );
  }

  const data = await response.json();

  const summary =
    data?.features?.[0]?.properties?.summary;

  if (!summary) {
    throw new Error(
      "Driving distance could not be calculated.",
    );
  }

  return {
    distanceKm: Number(
      (summary.distance / 1000).toFixed(2),
    ),

    durationMinutes: Math.ceil(
      summary.duration / 60,
    ),
  };
}