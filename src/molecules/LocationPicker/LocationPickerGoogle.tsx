import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import { Loader2, MapPin, Search } from "lucide-react";

import { PrimaryButton } from "../../atoms";

import type { LocationPickerProps, Position } from "../../types/location";

const defaultCenter: Position = {
  latitude: 23.0225,
  longitude: 72.5714,
};

const libraries: "places"[] = ["places"];

const placeSearchDebounceMs = 1000;
const minimumSearchCharacters = 3;

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

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

  const [suggestions, setSuggestions] = useState<
    google.maps.places.PlacePrediction[]
  >([]);

  const [isSearching, setIsSearching] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const searchRequestIdRef = useRef(0);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const mapRef = useRef<google.maps.Map | null>(null);

  const handleMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const handleMapUnmount = useCallback(() => {
    mapRef.current = null;
  }, []);

  /*
   * Update position when latitude/longitude
   * are changed from the parent.
   */
  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.setCenter({
      lat: position.latitude,
      lng: position.longitude,
    });
  }, [position]);

  /*
   * Cleanup search timeout when component unmounts.
   */
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }

      searchRequestIdRef.current += 1;
    };
  }, []);

  /*
   * Debounced Google Places Search.
   *
   * API request is made only when:
   * 1. User enters at least 3 characters.
   * 2. User stops typing for 1 second.
   */
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    setSearchValue(value);

    /*
     * Cancel previous debounce timer.
     */
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }

    /*
     * Clear suggestions when search is too short.
     */
    if (value.trim().length < minimumSearchCharacters) {
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    /*
     * Start new debounce timer.
     */
    searchTimeoutRef.current = setTimeout(async () => {
      const requestId = ++searchRequestIdRef.current;

      try {
        setIsSearching(true);

        const { suggestions: results } =
          await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
            {
              input: value.trim(),
              includedRegionCodes: ["in"],
            },
          );

        /*
         * Ignore old requests if a newer request has already started.
         */
        if (requestId !== searchRequestIdRef.current) {
          return;
        }

        const placePredictions = results
          .map((result) => result.placePrediction)
          .filter(
            (prediction): prediction is google.maps.places.PlacePrediction =>
              Boolean(prediction),
          );

        setSuggestions(placePredictions);
      } catch (error) {
        if (requestId !== searchRequestIdRef.current) {
          return;
        }

        console.error("Google Places search failed:", error);

        setSuggestions([]);
      } finally {
        if (requestId === searchRequestIdRef.current) {
          setIsSearching(false);
        }

        searchTimeoutRef.current = null;
      }
    }, placeSearchDebounceMs);
  };

  /*
   * Select Google Place suggestion.
   */
  const handlePlaceSelect = async (
    prediction: google.maps.places.PlacePrediction,
  ) => {
    try {
      setIsLoadingAddress(true);

      /*
       * Clear search suggestions.
       */
      setSuggestions([]);

      const place = prediction.toPlace();

      await place.fetchFields({
        fields: ["displayName", "formattedAddress", "location", "id"],
      });

      if (!place.location) {
        return;
      }

      const lat = place.location.lat();
      const lng = place.location.lng();

      const formattedAddress =
        place.formattedAddress || place.displayName || "";

      const newPosition: Position = {
        latitude: lat,
        longitude: lng,
      };

      /*
       * Update marker.
       */
      setPosition(newPosition);

      /*
       * Update search input with selected address.
       */
      setSearchValue(formattedAddress);

      /*
       * Move map to selected address.
       */
      if (mapRef.current) {
        mapRef.current.setCenter({
          lat,
          lng,
        });

        mapRef.current.setZoom(17);
      }

      /*
       * Update form.
       */
      onChange({
        address: formattedAddress,
        latitude: String(lat),
        longitude: String(lng),
      });
    } catch (error) {
      console.error("Google Places selection failed:", error);
    } finally {
      setIsLoadingAddress(false);
    }
  };

  /*
   * Reverse geocode coordinates.
   */
  const getAddressFromCoordinates = async (lat: number, lng: number) => {
    if (!isLoaded || !window.google) return;

    try {
      setIsLoadingAddress(true);

      const geocoder = new google.maps.Geocoder();

      const response = await geocoder.geocode({
        location: {
          lat,
          lng,
        },
      });

      const formattedAddress = response.results?.[0]?.formatted_address || "";

      setSearchValue(formattedAddress);

      setSuggestions([]);

      onChange({
        address: formattedAddress,
        latitude: String(lat),
        longitude: String(lng),
      });
    } catch (error) {
      console.error("Google reverse geocoding failed:", error);

      onChange({
        address: "",
        latitude: String(lat),
        longitude: String(lng),
      });
    } finally {
      setIsLoadingAddress(false);
    }
  };

  /*
   * Map click.
   */
  const handleMapClick = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setPosition({
      latitude: lat,
      longitude: lng,
    });

    await getAddressFromCoordinates(lat, lng);
  };

  /*
   * Marker drag.
   */
  const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
    if (!event.latLng) return;

    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setPosition({
      latitude: lat,
      longitude: lng,
    });

    await getAddressFromCoordinates(lat, lng);
  };

  /*
   * Google Maps options.
   */
  const mapOptions = useMemo(
    () => ({
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: true,
      clickableIcons: false,
    }),
    [],
  );

  /*
   * Loading Google Maps.
   */
  if (!isLoaded && isOpen) {
    return (
      <>
        <LocationSelector
          address={address}
          latitude={latitude}
          longitude={longitude}
          isLoadingAddress={true}
          onOpen={() => setIsOpen(true)}
        />

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
          <div className="rounded-2xl bg-white px-8 py-6">
            <Loader2 className="mx-auto h-6 w-6 animate-spin" />

            <p className="mt-3 text-sm text-muted">Loading Google Maps...</p>
          </div>
        </div>
      </>
    );
  }

  /*
   * Google Maps error.
   */
  if (loadError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4">
        <p className="text-sm text-red-600">Unable to load Google Maps.</p>

        <p className="mt-1 text-xs text-red-500">
          Please check your Google Maps API key and enabled APIs.
        </p>
      </div>
    );
  }

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
            <div className="border-b border-slate-200 px-5 py-4">
              <h3 className="text-base font-bold text-ink">
                Select Home Location
              </h3>

              <p className="mt-1 text-xs text-muted">
                Search your location, click on the map, or drag the marker to
                your home location.
              </p>
            </div>

            {/* Google Places Search */}
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
                      z-[60]
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
                    {suggestions.map((prediction, index) => {
                      const placeId = prediction.placeId || `place-${index}`;

                      return (
                        <button
                          key={placeId}
                          type="button"
                          onClick={() => handlePlaceSelect(prediction)}
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

                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-ink">
                              {prediction.mainText?.text ||
                                prediction.text?.text ||
                                "Location"}
                            </p>

                            {prediction.secondaryText?.text && (
                              <p className="mt-0.5 truncate text-xs text-muted">
                                {prediction.secondaryText.text}
                              </p>
                            )}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Minimum characters message */}
                {searchValue.trim().length > 0 &&
                  searchValue.trim().length < minimumSearchCharacters && (
                    <p className="mt-2 text-[11px] text-muted">
                      Enter at least {minimumSearchCharacters} characters to
                      search.
                    </p>
                  )}
              </div>
            </div>

            {/* Google Map */}
            <div className="h-[400px] w-full">
              <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={{
                  lat: position.latitude,
                  lng: position.longitude,
                }}
                zoom={15}
                options={mapOptions}
                onLoad={handleMapLoad}
                onUnmount={handleMapUnmount}
                onClick={handleMapClick}
              >
                <Marker
                  position={{
                    lat: position.latitude,
                    lng: position.longitude,
                  }}
                  draggable
                  onDragEnd={handleMarkerDragEnd}
                />
              </GoogleMap>
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
 * Location selector.
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
      <div className="flex min-w-0 items-center gap-3">
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
