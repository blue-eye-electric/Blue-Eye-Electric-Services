import { MapPin } from "lucide-react";
import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import { PrimaryButton, SecondaryButton } from "../atoms";
import { reverseGeocode } from "../services/locationService";

type LocationPickerProps = {
  address: string;
  latitude: string;
  longitude: string;
  onChange: (location: {
    address: string;
    latitude: string;
    longitude: string;
  }) => void;
};

type Position = {
  lat: number;
  lng: number;
};

const defaultCenter: Position = {
  lat: 25.5941,
  lng: 85.1376,
};

const markerIcon = L.icon({
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type MapClickHandlerProps = {
  onLocationChange: (position: Position) => void;
};

const MapClickHandler = ({ onLocationChange }: MapClickHandlerProps) => {
  useMapEvents({
    click(event) {
      onLocationChange({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    },
  });

  return null;
};

const LocationPicker = ({
  address,
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [position, setPosition] = useState<Position>({
    lat: latitude ? Number(latitude) : defaultCenter.lat,
    lng: longitude ? Number(longitude) : defaultCenter.lng,
  });

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  useEffect(() => {
    if (!latitude || !longitude) return;

    setPosition({
      lat: Number(latitude),
      lng: Number(longitude),
    });
  }, [latitude, longitude]);

  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    try {
      setIsLoadingAddress(true);

      const { address: formattedAddress } = await reverseGeocode(lat, lng);

      onChange({
        address: formattedAddress,
        latitude: String(lat),
        longitude: String(lng),
      });
    } catch (error) {
      console.error("OpenRouteService reverse geocoding failed:", error);

      onChange({
        address: "",
        latitude: String(lat),
        longitude: String(lng),
      });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  const handleLocationChange = async (newPosition: Position) => {
    setPosition(newPosition);

    await getAddressFromCoordinates(newPosition.lat, newPosition.lng);
  };

  const handleMarkerDrag = async (event: L.DragEndEvent) => {
    const marker = event.target as L.Marker;

    const newPosition = marker.getLatLng();

    await handleLocationChange({
      lat: newPosition.lat,
      lng: newPosition.lng,
    });
  };

  return (
    <>
      {/* Location Selector */}
      <div
        onClick={() => setIsOpen(true)}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          rounded-xl
          border
          border-slate-200
          bg-slate-50
          px-4
          py-3
          transition
          hover:border-primary
          hover:bg-white
          cursor-pointer
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          {/* Icon */}
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-white
              text-muted
              shadow-sm
              transition
            "
          >
            <MapPin className="h-5 w-5" />
          </div>

          {/* Location Info */}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-ink">Map Location</p>

            {isLoadingAddress ? (
              <p className="mt-0.5 text-xs text-muted">Finding address...</p>
            ) : (
              <p className="mt-0.5 truncate text-xs text-muted">
                {address || "Select your home location"}
              </p>
            )}

            {latitude && longitude && (
              <p className="mt-1 text-[10px] text-muted">
                {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* Select / Change */}
        <PrimaryButton type="button" onClick={() => setIsOpen(true)}>
          {latitude && longitude ? "Change" : "Select"}
        </PrimaryButton>
      </div>

      {/* Map Modal */}
      {isOpen && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/50
            p-4
          "
        >
          <div
            className="
              w-full
              max-w-3xl
              overflow-hidden
              rounded-3xl
              border
              border-slate-200
              bg-white
              shadow-xl
            "
          >
            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-ink">
                Select Home Location
              </h3>

              <p className="mt-1 text-xs text-muted">
                Click on the map or drag the marker to your home location.
              </p>
            </div>

            {/* Map */}
            <div className="h-[400px] w-full">
              <MapContainer
                center={[position.lat, position.lng]}
                zoom={15}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapClickHandler onLocationChange={handleLocationChange} />

                <Marker
                  position={[position.lat, position.lng]}
                  icon={markerIcon}
                  draggable
                  eventHandlers={{
                    dragend: handleMarkerDrag,
                  }}
                />
              </MapContainer>
            </div>

            {/* Selected Address */}
            <div
              className="
                border-t
                border-slate-200
                bg-slate-50
                px-5
                py-4
              "
            >
              <p className="text-sm font-semibold text-ink">
                Selected Location
              </p>

              <p className="mt-1 text-xs text-muted">
                {isLoadingAddress
                  ? "Finding address..."
                  : address || "Select a location on the map"}
              </p>

              {latitude && longitude && (
                <p className="mt-1 text-[10px] text-muted">
                  {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
                </p>
              )}
            </div>

            {/* Actions */}
            <div
              className="
                flex
                justify-end
                gap-3
                border-t
                border-slate-200
                px-5
                py-4
              "
            >
              <SecondaryButton onClick={() => setIsOpen(false)}>
                Cancel
              </SecondaryButton>

              <PrimaryButton
                onClick={() => setIsOpen(false)}
                disabled={!latitude || !longitude || isLoadingAddress}
              >
                Confirm Location
              </PrimaryButton>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default LocationPicker;
