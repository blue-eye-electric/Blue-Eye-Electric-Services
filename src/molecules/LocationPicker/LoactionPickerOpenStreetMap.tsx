import { useCallback, useEffect, useRef, useState } from "react";

import {
  MapContainer,
  Marker,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

import { Loader2, MapPin, Search } from "lucide-react";

import { PrimaryButton } from "../../atoms";

import { reverseGeocode, searchPlaces } from "../../services/locationService";

import type { LocationPickerProps, Position } from "../../types/location";

/*
|--------------------------------------------------------------------------
| Default Location
|--------------------------------------------------------------------------
*/

const defaultCenter: Position = {
  latitude: 23.0225,
  longitude: 72.5714,
};

/*
|--------------------------------------------------------------------------
| Search Configuration
|--------------------------------------------------------------------------
*/

const placeSearchDebounceMs = 1000;

const minimumSearchCharacters = 3;

/*
|--------------------------------------------------------------------------
| Types
|--------------------------------------------------------------------------
*/

type SearchSuggestion = {
  placeId: string;
  displayName: string;
  latitude: number;
  longitude: number;
};

/*
|--------------------------------------------------------------------------
| Fix Leaflet Default Marker Icon
|--------------------------------------------------------------------------
*/

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],

  iconAnchor: [12, 41],

  popupAnchor: [1, -34],

  shadowSize: [41, 41],
});

/*
|--------------------------------------------------------------------------
| Map Controller
|--------------------------------------------------------------------------
*/

type MapControllerProps = {
  position: Position;
};

const MapController = ({ position }: MapControllerProps) => {
  const map = useMap();

  useEffect(() => {
    map.setView([position.latitude, position.longitude], map.getZoom());
  }, [map, position.latitude, position.longitude]);

  return null;
};

/*
|--------------------------------------------------------------------------
| Map Events
|--------------------------------------------------------------------------
*/

type MapEventsProps = {
  onLocationChange: (latitude: number, longitude: number) => void;
};

const MapEvents = ({ onLocationChange }: MapEventsProps) => {
  useMapEvents({
    click(event) {
      onLocationChange(event.latlng.lat, event.latlng.lng);
    },
  });

  return null;
};

/*
|--------------------------------------------------------------------------
| Main Component
|--------------------------------------------------------------------------
*/

const LocationPicker = ({
  address,
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const [position, setPosition] = useState<Position>({
    latitude: latitude ? Number(latitude) : defaultCenter.latitude,

    longitude: longitude ? Number(longitude) : defaultCenter.longitude,
  });

  const [isLoadingAddress, setIsLoadingAddress] = useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const [isSearching, setIsSearching] = useState(false);

  const [isSearchFocused, setIsSearchFocused] = useState(false);

  /*
  |--------------------------------------------------------------------------
  | Refs
  |--------------------------------------------------------------------------
  */

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchRequestIdRef = useRef(0);

  /*
  |--------------------------------------------------------------------------
  | Sync Position From Parent
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (!latitude || !longitude) {
      return;
    }

    setPosition({
      latitude: Number(latitude),

      longitude: Number(longitude),
    });
  }, [latitude, longitude]);

  /*
  |--------------------------------------------------------------------------
  | Cleanup
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      searchRequestIdRef.current += 1;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Reverse Geocode
  |--------------------------------------------------------------------------
  */

  const getAddressFromCoordinates = useCallback(
    async (lat: number, lng: number) => {
      try {
        setIsLoadingAddress(true);

        const result = await reverseGeocode(lat, lng);

        const formattedAddress = result.address;

        setSearchValue(formattedAddress);

        setSuggestions([]);

        onChange({
          address: formattedAddress,

          latitude: String(lat),

          longitude: String(lng),
        });
      } catch (error) {
        console.error("Reverse geocoding failed:", error);

        onChange({
          address: "",

          latitude: String(lat),

          longitude: String(lng),
        });
      } finally {
        setIsLoadingAddress(false);
      }
    },

    [onChange],
  );

  /*
  |--------------------------------------------------------------------------
  | Search Location
  |--------------------------------------------------------------------------
  */

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchValue(value);

    /*
    | Cancel previous debounce
    */

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);

      searchTimeoutRef.current = null;
    }

    /*
    | Clear suggestions
    */

    if (value.trim().length < minimumSearchCharacters) {
      searchRequestIdRef.current += 1;

      setSuggestions([]);

      setIsSearching(false);

      return;
    }

    /*
    | Start debounce
    */

    searchTimeoutRef.current = setTimeout(
      async () => {
        const requestId = ++searchRequestIdRef.current;

        try {
          setIsSearching(true);

          const results = await searchPlaces(value.trim());

          /*
            | Ignore old request
            */

          if (requestId !== searchRequestIdRef.current) {
            return;
          }

          const formattedResults: SearchSuggestion[] = results.map((item) => ({
            placeId: item.place_id,

            displayName: item.display_name,

            latitude: Number(item.lat),

            longitude: Number(item.lon),
          }));

          setSuggestions(formattedResults);
        } catch (error) {
          if (requestId !== searchRequestIdRef.current) {
            return;
          }

          console.error("Location search failed:", error);

          setSuggestions([]);
        } finally {
          if (requestId === searchRequestIdRef.current) {
            setIsSearching(false);
          }

          searchTimeoutRef.current = null;
        }
      },

      placeSearchDebounceMs,
    );
  };

  /*
  |--------------------------------------------------------------------------
  | Select Search Suggestion
  |--------------------------------------------------------------------------
  */

  const handlePlaceSelect = (suggestion: SearchSuggestion) => {
    const newPosition: Position = {
      latitude: suggestion.latitude,

      longitude: suggestion.longitude,
    };

    setPosition(newPosition);

    setSearchValue(suggestion.displayName);

    setSuggestions([]);

    setIsSearchFocused(false);

    onChange({
      address: suggestion.displayName,

      latitude: String(suggestion.latitude),

      longitude: String(suggestion.longitude),
    });
  };

  /*
  |--------------------------------------------------------------------------
  | Map Click / Marker Drag
  |--------------------------------------------------------------------------
  */

  const handleMapLocationChange = async (lat: number, lng: number) => {
    setPosition({
      latitude: lat,
      longitude: lng,
    });

    await getAddressFromCoordinates(lat, lng);
  };

  return (
    <>
      {/* Location Selector */}

      <LocationSelector
        address={address}
        latitude={latitude}
        longitude={longitude}
        isLoadingAddress={isLoadingAddress}
        onOpen={() => setIsOpen(true)}
      />

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

            <div
              className="
                border-b
                border-slate-200
                px-5
                py-4
              "
            >
              <h3
                className="
                  text-base
                  font-bold
                  text-ink
                "
              >
                Select Home Location
              </h3>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted
                "
              >
                Search your location, click on the map, or drag the marker to
                your home location.
              </p>
            </div>

            {/* Search */}

            <div
              className="
                border-b
                border-slate-200
                bg-white
                p-4
              "
            >
              <div className="relative w-full">
                <div className="relative">
                  <Search
                    className="
                      pointer-events-none
                      absolute
                      left-3
                      top-1/2
                      h-4
                      w-4
                      -translate-y-1/2
                      text-muted
                    "
                  />

                  <input
                    type="text"
                    value={searchValue}
                    onChange={handleSearchChange}
                    placeholder="Search for a place"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => {
                      setTimeout(() => {
                        setIsSearchFocused(false);
                      }, 200);
                    }}
                    className="
                      w-full
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      py-3
                      pl-10
                      pr-10
                      text-sm
                      text-ink
                      outline-none
                      transition
                      focus:border-primary
                      focus:ring-2
                      focus:ring-primary/10
                    "
                  />

                  {isSearching && (
                    <Loader2
                      className="
                        absolute
                        right-3
                        top-1/2
                        h-4
                        w-4
                        -translate-y-1/2
                        animate-spin
                        text-muted
                      "
                    />
                  )}
                </div>

                {/* Suggestions */}

                {isSearchFocused && suggestions.length > 0 && (
                  <div
                    className="
                        absolute
                        left-0
                        right-0
                        top-full
                        z-[1000]
                        mt-2
                        max-h-64
                        overflow-y-auto
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        shadow-lg
                      "
                  >
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.placeId}
                        type="button"
                        onClick={() => handlePlaceSelect(suggestion)}
                        className="
                              flex
                              w-full
                              items-start
                              gap-3
                              border-b
                              border-slate-100
                              px-4
                              py-3
                              text-left
                              transition
                              last:border-b-0
                              hover:bg-slate-50
                            "
                      >
                        <MapPin
                          className="
                                mt-0.5
                                h-4
                                w-4
                                shrink-0
                                text-muted
                              "
                        />

                        <p
                          className="
                                text-sm
                                text-ink
                              "
                        >
                          {suggestion.displayName}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Minimum Characters */}

                {searchValue.trim().length > 0 &&
                  searchValue.trim().length < minimumSearchCharacters && (
                    <p
                      className="
                        mt-2
                        text-[11px]
                        text-muted
                      "
                    >
                      Enter at least {minimumSearchCharacters} characters to
                      search.
                    </p>
                  )}
              </div>
            </div>

            {/* Map */}

            <div className="h-[400px] w-full">
              <MapContainer
                center={[position.latitude, position.longitude]}
                zoom={15}
                className="
                  h-full
                  w-full
                "
                scrollWheelZoom
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <MapController position={position} />

                <MapEvents onLocationChange={handleMapLocationChange} />

                <Marker
                  position={[position.latitude, position.longitude]}
                  icon={markerIcon}
                  draggable
                  eventHandlers={{
                    dragend: (event) => {
                      const marker = event.target as L.Marker;

                      const newPosition = marker.getLatLng();

                      handleMapLocationChange(newPosition.lat, newPosition.lng);
                    },
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
              <p
                className="
                  text-sm
                  font-semibold
                  text-ink
                "
              >
                Selected Location
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  text-muted
                "
              >
                {isLoadingAddress
                  ? "Finding address..."
                  : address || "Select a location on the map"}
              </p>

              {latitude && longitude && (
                <p
                  className="
                      mt-1
                      text-[10px]
                      text-muted
                    "
                >
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
              <PrimaryButton
                type="button"
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

/*
|--------------------------------------------------------------------------
| Location Selector
|--------------------------------------------------------------------------
*/

type LocationSelectorProps = {
  address: string;
  latitude: string;
  longitude: string;
  isLoadingAddress: boolean;
  onOpen: () => void;
};

const LocationSelector = ({
  address,
  latitude,
  longitude,
  isLoadingAddress,
  onOpen,
}: LocationSelectorProps) => {
  return (
    <div
      onClick={onOpen}
      className="
        flex
        w-full
        cursor-pointer
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
      "
    >
      <div
        className="
          flex
          min-w-0
          items-center
          gap-3
        "
      >
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
          "
        >
          <MapPin className="h-5 w-5" />
        </div>

        <div className="min-w-0 flex-1">
          <p
            className="
              text-sm
              font-semibold
              text-ink
            "
          >
            Map Location
          </p>

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

      <PrimaryButton
        type="button"
        onClick={(event) => {
          event.stopPropagation();

          onOpen();
        }}
      >
        {latitude && longitude ? "Change" : "Select"}
      </PrimaryButton>
    </div>
  );
};

export default LocationPicker;
