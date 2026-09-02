// import { useEffect, useState } from "react";

// // Location
// import { MapContainer, Marker, TileLayer, useMapEvents } from "react-leaflet";
// import L from "leaflet";

// // Icons
// import { Loader2, MapPin, Search, X } from "lucide-react";

// // Components
// import { PrimaryButton, SecondaryButton } from "../../atoms";

// // Services
// import { reverseGeocode, searchPlaces } from "../../services/locationService";

// // Interfaces
// import type { LocationPickerProps, Position } from "../../types/location";

// import MapController from "./MapController";

// const defaultCenter: Position = {
//   latitude: 25.5941,
//   longitude: 85.1376,
// };

// const mapTilerApiKey = import.meta.env.VITE_MAPTILER_API_KEY;

// const markerIcon = L.icon({
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",

//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",

//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",

//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowSize: [41, 41],
// });

// type MapClickHandlerProps = {
//   onLocationChange: (position: Position) => void;
// };

// const MapClickHandler = ({ onLocationChange }: MapClickHandlerProps) => {
//   useMapEvents({
//     click(event) {
//       onLocationChange({
//         latitude: event.latlng.lat,
//         longitude: event.latlng.lng,
//       });
//     },
//   });

//   return null;
// };

// const LocationPicker = ({
//   address,
//   latitude,
//   longitude,
//   onChange,
// }: LocationPickerProps) => {
//   const [isOpen, setIsOpen] = useState(false);

//   const [position, setPosition] = useState<Position>({
//     latitude: latitude ? Number(latitude) : defaultCenter.latitude,

//     longitude: longitude ? Number(longitude) : defaultCenter.longitude,
//   });

//   const [isLoadingAddress, setIsLoadingAddress] = useState(false);

//   const [isSearchFocused, setIsSearchFocused] = useState(false);

//   const [searchQuery, setSearchQuery] = useState("");

//   const [searchResults, setSearchResults] = useState<
//     {
//       address: string;
//       latitude: number;
//       longitude: number;
//     }[]
//   >([]);

//   const [isSearching, setIsSearching] = useState(false);

//   const [isGettingLocation, setIsGettingLocation] = useState(false);

//   /*
//    * --------------------------------------------------
//    * Validate MapTiler API Key
//    * --------------------------------------------------
//    */

//   useEffect(() => {
//     if (!mapTilerApiKey) {
//       console.error("VITE_MAPTILER_API_KEY is not configured.");
//     }
//   }, []);

//   /*
//    * --------------------------------------------------
//    * Get Current Location When Modal Opens
//    * --------------------------------------------------
//    */

//   useEffect(() => {
//     if (!isOpen) return;

//     // If form already has a location,
//     // don't overwrite it.
//     if (latitude && longitude) return;

//     if (!navigator.geolocation) {
//       console.warn("Geolocation is not supported by this browser.");

//       return;
//     }

//     setIsGettingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       async (location) => {
//         const newPosition: Position = {
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         };

//         setPosition(newPosition);

//         await getAddressFromCoordinates(
//           newPosition.latitude,
//           newPosition.longitude,
//         );

//         setIsGettingLocation(false);
//       },

//       (error) => {
//         console.error("Unable to get current location:", error);

//         setIsGettingLocation(false);
//       },

//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       },
//     );
//   }, [isOpen]);

//   /*
//    * --------------------------------------------------
//    * Sync Position With Parent Form
//    * --------------------------------------------------
//    */

//   useEffect(() => {
//     if (!latitude || !longitude) return;

//     setPosition({
//       latitude: Number(latitude),
//       longitude: Number(longitude),
//     });
//   }, [latitude, longitude]);

//   /*
//    * --------------------------------------------------
//    * Search Debounce
//    * --------------------------------------------------
//    */

//   useEffect(() => {
//     const query = searchQuery.trim();

//     if (query.length < 3) {
//       setSearchResults([]);
//       return;
//     }

//     const timer = setTimeout(() => {
//       handleSearch(query);
//     }, 500);

//     return () => clearTimeout(timer);
//   }, [searchQuery]);

//   /*
//    * --------------------------------------------------
//    * Current Location
//    * --------------------------------------------------
//    */

//   const handleCurrentLocation = () => {
//     if (!navigator.geolocation) {
//       console.error("Geolocation is not supported by this browser.");

//       return;
//     }

//     setIsGettingLocation(true);

//     navigator.geolocation.getCurrentPosition(
//       async (location) => {
//         const newPosition: Position = {
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//         };

//         setPosition(newPosition);

//         await getAddressFromCoordinates(
//           newPosition.latitude,
//           newPosition.longitude,
//         );

//         setIsGettingLocation(false);
//       },

//       (error) => {
//         console.error("Unable to get current location:", error);

//         setIsGettingLocation(false);
//       },

//       {
//         enableHighAccuracy: true,
//         timeout: 10000,
//         maximumAge: 0,
//       },
//     );
//   };

//   /*
//    * --------------------------------------------------
//    * Search Places
//    * --------------------------------------------------
//    */

//   const handleSearch = async (query: string) => {
//     if (!query.trim()) return;

//     try {
//       setIsSearching(true);

//       const results = await searchPlaces(query);

//       setSearchResults(
//         results.map((item) => ({
//           address: item.display_name,
//           latitude: Number(item.lat),
//           longitude: Number(item.lon),
//         })),
//       );
//     } catch (error) {
//       console.error("Search failed:", error);

//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * Reverse Geocoding
//    * --------------------------------------------------
//    */

//   const getAddressFromCoordinates = async (
//     latitude: number,
//     longitude: number,
//   ) => {
//     try {
//       setIsLoadingAddress(true);

//       const { address: formattedAddress } = await reverseGeocode(
//         latitude,
//         longitude,
//       );

//       onChange({
//         address: formattedAddress,
//         latitude: String(latitude),
//         longitude: String(longitude),
//       });
//     } catch (error) {
//       console.error("Reverse geocoding failed:", error);

//       onChange({
//         address: "",
//         latitude: String(latitude),
//         longitude: String(longitude),
//       });
//     } finally {
//       setIsLoadingAddress(false);
//     }
//   };

//   /*
//    * --------------------------------------------------
//    * Map Location Change
//    * --------------------------------------------------
//    */

//   const handleLocationChange = async (newPosition: Position) => {
//     setPosition(newPosition);

//     await getAddressFromCoordinates(
//       newPosition.latitude,
//       newPosition.longitude,
//     );
//   };

//   /*
//    * --------------------------------------------------
//    * Marker Drag
//    * --------------------------------------------------
//    */

//   const handleMarkerDrag = async (event: L.DragEndEvent) => {
//     const marker = event.target as L.Marker;

//     const newPosition = marker.getLatLng();

//     await handleLocationChange({
//       latitude: newPosition.lat,
//       longitude: newPosition.lng,
//     });
//   };

//   /*
//    * --------------------------------------------------
//    * Render
//    * --------------------------------------------------
//    */

//   return (
//     <>
//       {/* -------------------------------------------- */}
//       {/* Location Selector */}
//       {/* -------------------------------------------- */}

//       <div
//         onClick={() => setIsOpen(true)}
//         className="
//           flex
//           w-full
//           cursor-pointer
//           items-center
//           justify-between
//           gap-4
//           rounded-xl
//           border
//           border-slate-200
//           bg-slate-50
//           px-4
//           py-3
//           transition
//           hover:border-primary
//           hover:bg-white
//         "
//       >
//         <div className="flex min-w-0 items-center gap-3">
//           {/* Icon */}

//           <div
//             className="
//               flex
//               h-10
//               w-10
//               shrink-0
//               items-center
//               justify-center
//               rounded-xl
//               bg-white
//               text-muted
//               shadow-sm
//               transition
//             "
//           >
//             <MapPin className="h-5 w-5" />
//           </div>

//           {/* Location Info */}

//           <div className="min-w-0 flex-1">
//             <p className="text-sm font-semibold text-ink">Map Location</p>

//             {isLoadingAddress ? (
//               <p className="mt-0.5 text-xs text-muted">Finding address...</p>
//             ) : (
//               <p className="mt-0.5 truncate text-xs text-muted">
//                 {address || "Select your home location"}
//               </p>
//             )}

//             {latitude && longitude && (
//               <p className="mt-1 text-[10px] text-muted">
//                 {Number(latitude).toFixed(6)}, {Number(longitude).toFixed(6)}
//               </p>
//             )}
//           </div>
//         </div>

//         {/* Select / Change */}

//         <PrimaryButton
//           type="button"
//           onClick={(event) => {
//             event.stopPropagation();
//             setIsOpen(true);
//           }}
//         >
//           {latitude && longitude ? "Change" : "Select"}
//         </PrimaryButton>
//       </div>

//       {/* -------------------------------------------- */}
//       {/* Map Modal */}
//       {/* -------------------------------------------- */}

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
//             {/* -------------------------------------- */}
//             {/* Header */}
//             {/* -------------------------------------- */}

//             <div
//               className="
//                 flex
//                 w-full
//                 justify-between
//                 border-b
//                 border-slate-200
//                 px-5
//                 py-4
//               "
//             >
//               <div>
//                 <h3 className="text-base font-bold text-ink">
//                   Select Your Location
//                 </h3>

//                 <p className="mt-1 text-xs text-muted">
//                   Click on the map or drag the marker to your location.
//                 </p>
//               </div>

//               <SecondaryButton type="button" onClick={() => setIsOpen(false)}>
//                 <X className="h-5 w-5" />
//               </SecondaryButton>
//             </div>

//             {/* -------------------------------------- */}
//             {/* Location Search */}
//             {/* -------------------------------------- */}

//             <div
//               className="
//                 relative
//                 border-b
//                 border-slate-200
//                 bg-white
//                 p-4
//               "
//             >
//               <div className="relative flex-1">
//                 <Search
//                   className="
//                     absolute
//                     left-3
//                     top-1/2
//                     h-4
//                     w-4
//                     -translate-y-1/2
//                     text-muted
//                   "
//                 />

//                 <input
//                   type="text"
//                   value={searchQuery}
//                   onChange={(event) => {
//                     setSearchQuery(event.target.value);
//                   }}
//                   onFocus={() => {
//                     setIsSearchFocused(true);
//                   }}
//                   onBlur={() => {
//                     setTimeout(() => {
//                       setIsSearchFocused(false);
//                     }, 150);
//                   }}
//                   placeholder="Search your area, society, street..."
//                   className="
//                     w-full
//                     rounded-xl
//                     border
//                     border-slate-200
//                     bg-slate-50
//                     py-3
//                     pl-10
//                     pr-10
//                     text-sm
//                     text-ink
//                     outline-none
//                     transition
//                     focus:border-primary
//                     focus:bg-white
//                   "
//                 />

//                 {isSearching && (
//                   <Loader2
//                     className="
//                       absolute
//                       right-3
//                       top-1/2
//                       h-4
//                       w-4
//                       -translate-y-1/2
//                       animate-spin
//                       text-muted
//                     "
//                   />
//                 )}
//               </div>

//               {/* ------------------------------------ */}
//               {/* Search Results */}
//               {/* ------------------------------------ */}

//               {isSearchFocused && searchResults.length > 0 && (
//                 <div
//                   className="
//                       absolute
//                       left-4
//                       right-4
//                       z-[2000]
//                       overflow-hidden
//                       rounded-xl
//                       border
//                       border-slate-200
//                       bg-white
//                       shadow-lg
//                     "
//                 >
//                   {searchResults.map((result, index) => (
//                     <button
//                       key={`${result.latitude}-${result.longitude}-${index}`}
//                       type="button"
//                       onMouseDown={(event) => {
//                         event.preventDefault();
//                       }}
//                       onClick={() => {
//                         const newPosition: Position = {
//                           latitude: result.latitude,
//                           longitude: result.longitude,
//                         };

//                         setPosition(newPosition);

//                         onChange({
//                           address: result.address,
//                           latitude: String(result.latitude),
//                           longitude: String(result.longitude),
//                         });

//                         setSearchQuery(result.address);

//                         setSearchResults([]);

//                         setIsSearchFocused(false);
//                       }}
//                       className="
//                             flex
//                             w-full
//                             items-start
//                             gap-3
//                             border-b
//                             border-slate-100
//                             px-4
//                             py-3
//                             text-left
//                             last:border-b-0
//                             hover:bg-slate-50
//                           "
//                     >
//                       <MapPin
//                         className="
//                               mt-0.5
//                               h-4
//                               w-4
//                               shrink-0
//                               text-primary
//                             "
//                       />

//                       <span
//                         className="
//                               text-xs
//                               leading-5
//                               text-ink
//                             "
//                       >
//                         {result.address}
//                       </span>
//                     </button>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* -------------------------------------- */}
//             {/* Current Location Button */}
//             {/* -------------------------------------- */}

//             <div className="p-4">
//               <SecondaryButton
//                 type="button"
//                 onClick={handleCurrentLocation}
//                 disabled={isGettingLocation}
//               >
//                 {isGettingLocation ? (
//                   <>
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                     Finding location...
//                   </>
//                 ) : (
//                   <>
//                     <MapPin className="h-4 w-4" />
//                     Use Current Location
//                   </>
//                 )}
//               </SecondaryButton>
//             </div>

//             {/* -------------------------------------- */}
//             {/* Map */}
//             {/* -------------------------------------- */}

//             <div className="h-[400px] w-full">
//               {mapTilerApiKey ? (
//                 <MapContainer
//                   center={[position.latitude, position.longitude]}
//                   zoom={15}
//                   scrollWheelZoom
//                   className="h-full w-full"
//                 >
//                   {/* MapTiler */}

//                   <TileLayer
//                     url={`https://api.maptiler.com/maps/streets-v4/{z}/{x}/{y}.png?key=${mapTilerApiKey}`}
//                     tileSize={512}
//                     zoomOffset={-1}
//                     minZoom={1}
//                     crossOrigin
//                     attribution='&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>'
//                   />

//                   {/* Move Map */}

//                   <MapController position={position} />

//                   {/* Map Click */}

//                   <MapClickHandler onLocationChange={handleLocationChange} />

//                   {/* Marker */}

//                   <Marker
//                     position={[position.latitude, position.longitude]}
//                     icon={markerIcon}
//                     draggable
//                     eventHandlers={{
//                       dragend: handleMarkerDrag,
//                     }}
//                   />
//                 </MapContainer>
//               ) : (
//                 <div
//                   className="
//                     flex
//                     h-full
//                     w-full
//                     items-center
//                     justify-center
//                     bg-slate-100
//                     text-sm
//                     text-muted
//                   "
//                 >
//                   MapTiler API key is not configured.
//                 </div>
//               )}
//             </div>

//             {/* -------------------------------------- */}
//             {/* Selected Address */}
//             {/* -------------------------------------- */}

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
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default LocationPicker;
