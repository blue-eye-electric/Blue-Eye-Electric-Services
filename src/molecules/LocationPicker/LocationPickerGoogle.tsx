// import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

// import { Loader2, MapPin } from "lucide-react";

// import { PrimaryButton, SecondaryButton } from "../../atoms";

// import type { LocationPickerProps, Position } from "../../types/location";

// const defaultCenter: Position = {
//   lat: 23.0225,
//   lng: 72.5714,
// };

// const libraries: "places"[] = ["places"];

// const mapContainerStyle = {
//   width: "100%",
//   height: "400px",
// };

// const LocationPicker = ({
//   address,
//   latitude,
//   longitude,
//   onChange,
// }: LocationPickerProps) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const [position, setPosition] = useState<Position>({
//     lat: latitude ? Number(latitude) : defaultCenter.lat,
//     lng: longitude ? Number(longitude) : defaultCenter.lng,
//   });

//   const [isLoadingAddress, setIsLoadingAddress] = useState(false);

//   const autocompleteContainerRef = useRef<HTMLDivElement | null>(null);

//   const autocompleteElementRef = useRef<any>(null);

//   const { isLoaded, loadError } = useJsApiLoader({
//     googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
//     libraries,
//   });

//   const mapRef = useRef<google.maps.Map | null>(null);

//   const handleMapLoad = useCallback((map: google.maps.Map) => {
//     mapRef.current = map;
//   }, []);

//   const handleMapUnmount = useCallback(() => {
//     mapRef.current = null;
//   }, []);
//   /*
//    * Update position when latitude/longitude
//    * are changed from the parent.
//    */
//   useEffect(() => {
//     if (!mapRef.current) return;

//     mapRef.current.panTo({
//       lat: position.lat,
//       lng: position.lng,
//     });
//   }, [position]);

//   /*
//    * Create Google PlaceAutocompleteElement
//    */
//   useEffect(() => {
//     if (!isLoaded || !isOpen) return;
//     if (!autocompleteContainerRef.current) return;

//     /*
//      * Avoid creating the element more than once.
//      */
//     if (autocompleteElementRef.current) return;

//     const autocomplete = new google.maps.places.PlaceAutocompleteElement({});

//     /*
//      * Placeholder.
//      */
//     autocomplete.setAttribute("placeholder", "Search for a place");

//     /*
//      * Listen for selected place.
//      */
//     const handlePlaceSelect = async (event: Event) => {
//       try {
//         setIsLoadingAddress(true);

//         const customEvent = event as CustomEvent;

//         const placePrediction = customEvent.detail?.placePrediction;

//         if (!placePrediction) {
//           return;
//         }

//         const place = placePrediction.toPlace();

//         /*
//          * Request only the fields we need.
//          */
//         await place.fetchFields({
//           fields: ["displayName", "formattedAddress", "location", "id"],
//         });

//         if (!place.location) {
//           return;
//         }

//         const lat = place.location.lat();
//         const lng = place.location.lng();

//         const formattedAddress =
//           place.formattedAddress || place.displayName || "";

//         const newPosition = {
//           lat,
//           lng,
//         };

//         setPosition(newPosition);

//         // if (mapRef.current) {
//         //   mapRef.current.panTo({
//         //     lat,
//         //     lng,
//         //   });

//         //   mapRef.current.setZoom(17);
//         // }

//         onChange({
//           address: formattedAddress,
//           latitude: String(lat),
//           longitude: String(lng),
//         });
//       } catch (error) {
//         console.error("Google Places selection failed:", error);
//       } finally {
//         setIsLoadingAddress(false);
//       }
//     };

//     autocomplete.addEventListener("gmp-select", handlePlaceSelect);

//     autocompleteContainerRef.current.appendChild(autocomplete);

//     autocompleteElementRef.current = autocomplete;

//     return () => {
//       autocomplete.removeEventListener("gmp-select", handlePlaceSelect);

//       autocompleteElementRef.current = null;

//       if (autocompleteContainerRef.current?.contains(autocomplete)) {
//         autocompleteContainerRef.current.removeChild(autocomplete);
//       }
//     };
//   }, [isLoaded, isOpen, onChange]);

//   /*
//    * Reverse geocode coordinates.
//    */
//   const getAddressFromCoordinates = async (lat: number, lng: number) => {
//     if (!isLoaded || !window.google) return;

//     try {
//       setIsLoadingAddress(true);

//       const geocoder = new google.maps.Geocoder();

//       const response = await geocoder.geocode({
//         location: {
//           lat,
//           lng,
//         },
//       });

//       const formattedAddress = response.results?.[0]?.formatted_address || "";

//       console.log("Google address:", formattedAddress);
//       console.log("Google coordinates:", lat, lng);

//       onChange({
//         address: formattedAddress,
//         latitude: String(lat),
//         longitude: String(lng),
//       });
//     } catch (error) {
//       console.error("Google reverse geocoding failed:", error);

//       onChange({
//         address: "",
//         latitude: String(lat),
//         longitude: String(lng),
//       });
//     } finally {
//       setIsLoadingAddress(false);
//     }
//   };

//   /*
//    * Map click.
//    */
//   const handleMapClick = async (event: google.maps.MapMouseEvent) => {
//     if (!event.latLng) return;

//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();

//     setPosition({
//       lat,
//       lng,
//     });

//     await getAddressFromCoordinates(lat, lng);
//   };

//   /*
//    * Marker drag.
//    */
//   const handleMarkerDragEnd = async (event: google.maps.MapMouseEvent) => {
//     if (!event.latLng) return;

//     const lat = event.latLng.lat();
//     const lng = event.latLng.lng();

//     setPosition({
//       lat,
//       lng,
//     });

//     await getAddressFromCoordinates(lat, lng);
//   };

//   /*
//    * Google Maps options.
//    */
//   const mapOptions = useMemo(
//     () => ({
//       streetViewControl: false,
//       mapTypeControl: false,
//       fullscreenControl: true,
//       clickableIcons: false,
//     }),
//     [],
//   );

//   /*
//    * Loading Google Maps.
//    */
//   if (!isLoaded && isOpen) {
//     return (
//       <>
//         <LocationSelector
//           address={address}
//           latitude={latitude}
//           longitude={longitude}
//           isLoadingAddress={true}
//           onOpen={() => setIsOpen(true)}
//         />

//         <div
//           className="
//             fixed
//             inset-0
//             z-50
//             flex
//             items-center
//             justify-center
//             bg-black/50
//             p-4
//           "
//         >
//           <div className="rounded-2xl bg-white px-8 py-6">
//             <Loader2 className="mx-auto h-6 w-6 animate-spin" />

//             <p className="mt-3 text-sm text-muted">Loading Google Maps...</p>
//           </div>
//         </div>
//       </>
//     );
//   }

//   /*
//    * Google Maps error.
//    */
//   if (loadError) {
//     return (
//       <div className="rounded-xl border border-red-200 bg-red-50 p-4">
//         <p className="text-sm text-red-600">Unable to load Google Maps.</p>

//         <p className="mt-1 text-xs text-red-500">
//           Please check your Google Maps API key and enabled APIs.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <>
//       {/* Location Selector */}
//       <LocationSelector
//         address={address}
//         latitude={latitude}
//         longitude={longitude}
//         isLoadingAddress={isLoadingAddress}
//         onOpen={() => setIsOpen(true)}
//       />

//       {/* Map Modal */}
//       {isOpen && (
//         <div
//           className="
//             fixed
//             inset-0
//             z-50
//             flex
//             items-center
//             justify-center
//             bg-black/50
//             p-4
//           "
//         >
//           <div
//             className="
//               w-full
//               max-w-3xl
//               overflow-hidden
//               rounded-3xl
//               border
//               border-slate-200
//               bg-white
//               shadow-xl
//             "
//           >
//             {/* Header */}
//             <div className="border-b border-slate-200 px-5 py-4">
//               <h3 className="text-base font-bold text-ink">
//                 Select Home Location
//               </h3>

//               <p className="mt-1 text-xs text-muted">
//                 Search your location, click on the map, or drag the marker to
//                 your home location.
//               </p>
//             </div>

//             {/* Google Places Search */}
//             <div
//               className="
//                 border-b
//                 border-slate-200
//                 bg-white
//                 p-4
//               "
//             >
//               <div
//                 ref={autocompleteContainerRef}
//                 className="
//                   google-place-autocomplete
//                   w-full
//                 "
//               />
//             </div>

//             {/* Google Map */}
//             <div className="h-[400px] w-full">
//               <GoogleMap
//                 mapContainerStyle={mapContainerStyle}
//                 center={{
//                   lat: position.lat,
//                   lng: position.lng,
//                 }}
//                 zoom={15}
//                 options={mapOptions}
//                 onLoad={handleMapLoad}
//                 onUnmount={handleMapUnmount}
//                 onClick={handleMapClick}
//               >
//                 <Marker
//                   position={{
//                     lat: position.lat,
//                     lng: position.lng,
//                   }}
//                   draggable
//                   onDragEnd={handleMarkerDragEnd}
//                 />
//               </GoogleMap>
//             </div>

//             {/* Selected Address */}
//             <div
//               className="
//                 border-t
//                 border-slate-200
//                 bg-slate-50
//                 px-5
//                 py-4
//               "
//             >
//               <p className="text-sm font-semibold text-ink">
//                 Selected Location
//               </p>

//               <p className="mt-1 text-xs text-muted">
//                 {isLoadingAddress
//                   ? "Finding address..."
//                   : address || "Select a location on the map"}
//               </p>

//               {latitude && longitude && (
//                 <p className="mt-1 text-[10px] text-muted">
//                   {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
//                 </p>
//               )}
//             </div>

//             {/* Actions */}
//             <div
//               className="
//                 flex
//                 justify-end
//                 gap-3
//                 border-t
//                 border-slate-200
//                 px-5
//                 py-4
//               "
//             >
//               <SecondaryButton type="button" onClick={() => setIsOpen(false)}>
//                 Cancel
//               </SecondaryButton>

//               <PrimaryButton
//                 type="button"
//                 onClick={() => setIsOpen(false)}
//                 disabled={!latitude || !longitude || isLoadingAddress}
//               >
//                 Confirm Location
//               </PrimaryButton>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// /*
//  * Location selector.
//  */
// type LocationSelectorProps = {
//   address: string;
//   latitude: string;
//   longitude: string;
//   isLoadingAddress: boolean;
//   onOpen: () => void;
// };

// const LocationSelector = ({
//   address,
//   latitude,
//   longitude,
//   isLoadingAddress,
//   onOpen,
// }: LocationSelectorProps) => {
//   return (
//     <div
//       onClick={onOpen}
//       className="
//         flex
//         w-full
//         cursor-pointer
//         items-center
//         justify-between
//         gap-4
//         rounded-xl
//         border
//         border-slate-200
//         bg-slate-50
//         px-4
//         py-3
//         transition
//         hover:border-primary
//         hover:bg-white
//       "
//     >
//       <div className="flex min-w-0 items-center gap-3">
//         <div
//           className="
//             flex
//             h-10
//             w-10
//             shrink-0
//             items-center
//             justify-center
//             rounded-xl
//             bg-white
//             text-muted
//             shadow-sm
//           "
//         >
//           <MapPin className="h-5 w-5" />
//         </div>

//         <div className="min-w-0 flex-1">
//           <p className="text-sm font-semibold text-ink">Map Location</p>

//           {isLoadingAddress ? (
//             <p className="mt-0.5 text-xs text-muted">Finding address...</p>
//           ) : (
//             <p className="mt-0.5 truncate text-xs text-muted">
//               {address || "Select your home location"}
//             </p>
//           )}

//           {latitude && longitude && (
//             <p className="mt-1 text-[10px] text-muted">
//               {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
//             </p>
//           )}
//         </div>
//       </div>

//       <PrimaryButton
//         type="button"
//         onClick={(event) => {
//           event.stopPropagation();
//           onOpen();
//         }}
//       >
//         {latitude && longitude ? "Change" : "Select"}
//       </PrimaryButton>
//     </div>
//   );
// };

// export default LocationPicker;
