// import { useEffect, useRef, useState } from "react";
// import { Loader2, MapPin, Search, X } from "lucide-react";
// import { mappls } from "mappls-web-maps";

// // Components
// import { PrimaryButton, SecondaryButton } from "../../atoms";

// // Types
// import type { LocationPickerProps, Position } from "../../types/location";

// // Services
// import { reverseGeocode, searchPlaces } from "../../services/locationService";

// const defaultCenter: Position = {
//   latitude: 25.5941,
//   longitude: 85.1376,
// };

// interface MapplsMapProps {
//   position: Position;
//   onLocationChange: (position: Position) => void;
//   onMapReady?: () => void;
// }

// const MapplsMap = ({
//   position,
//   onLocationChange,
//   onMapReady,
// }: MapplsMapProps) => {
//   const mapRef = useRef<any>(null);
//   const markerRef = useRef<any>(null);
//   const mapContainerRef = useRef<HTMLDivElement | null>(null);
//   const mapIdRef = useRef(
//     `mappls-map-${Math.random().toString(36).slice(2, 11)}`,
//   );

//   const mapplsObjectRef = useRef<any>(null);

//   const onLocationChangeRef = useRef(onLocationChange);

//   useEffect(() => {
//     onLocationChangeRef.current = onLocationChange;
//   }, [onLocationChange]);

//   useEffect(() => {
//     let mounted = true;

//     const initializeMap = async () => {
//       if (!mapContainerRef.current) return;

//       const token = import.meta.env.VITE_MAPPLS_ACCESS_TOKEN;

//       if (!token) {
//         console.error("VITE_MAPPLS_ACCESS_TOKEN is not configured.");
//         return;
//       }

//       try {
//         const mapplsClassObject = new mappls();

//         mapplsObjectRef.current = mapplsClassObject;

//         mapplsClassObject.initialize(
//           token,
//           {
//             map: true,
//           },
//           () => {
//             if (!mounted || !mapContainerRef.current) return;

//             const map = mapplsClassObject.Map({
//               id: mapIdRef.current,
//               properties: {
//                 center: [position.latitude, position.longitude],
//                 zoom: 15,
//               },
//             });

//             mapRef.current = map;

//             /*
//              * Map click
//              */
//             map.addListener("click", (event: any) => {
//               const latitude =
//                 event?.latLng?.lat ??
//                 event?.latlng?.lat ??
//                 event?.coordinates?.lat;

//               const longitude =
//                 event?.latLng?.lng ??
//                 event?.latlng?.lng ??
//                 event?.coordinates?.lng;

//               if (
//                 typeof latitude !== "number" ||
//                 typeof longitude !== "number"
//               ) {
//                 return;
//               }

//               onLocationChangeRef.current({
//                 latitude,
//                 longitude,
//               });
//             });

//             /*
//              * Create marker
//              */
//             const marker = mapplsClassObject.Marker({
//               map,
//               position: {
//                 lat: position.latitude,
//                 lng: position.longitude,
//               },
//               draggable: true,
//               width: 35,
//               height: 45,
//             });

//             markerRef.current = marker;

//             /*
//              * Marker drag end
//              */
//             marker.addListener("dragend", () => {
//               const markerPosition = marker.getPosition?.();

//               if (!markerPosition) return;

//               const latitude = markerPosition.lat ?? markerPosition.latitude;

//               const longitude = markerPosition.lng ?? markerPosition.longitude;

//               if (
//                 typeof latitude !== "number" ||
//                 typeof longitude !== "number"
//               ) {
//                 return;
//               }

//               onLocationChangeRef.current({
//                 latitude,
//                 longitude,
//               });
//             });

//             onMapReady?.();
//           },
//         );
//       } catch (error) {
//         console.error("Mappls initialization failed:", error);
//       }
//     };

//     initializeMap();

//     return () => {
//       mounted = false;

//       try {
//         if (markerRef.current) {
//           markerRef.current.remove?.();
//         }

//         if (mapRef.current) {
//           mapRef.current.remove?.();
//         }
//       } catch (error) {
//         console.error("Mappls cleanup failed:", error);
//       }

//       markerRef.current = null;
//       mapRef.current = null;
//       mapplsObjectRef.current = null;
//     };
//   }, []);

//   /*
//    * Update marker and map whenever position changes.
//    */
//   useEffect(() => {
//     if (!mapRef.current || !markerRef.current) {
//       return;
//     }

//     const newPosition = {
//       lat: position.latitude,
//       lng: position.longitude,
//     };

//     try {
//       markerRef.current.setPosition(newPosition);

//       /*
//        * Mappls supports setCenter on the map object.
//        */
//       mapRef.current.setCenter?.([position.latitude, position.longitude]);

//       /*
//        * Some Mappls versions expose panTo instead.
//        */
//       if (!mapRef.current.setCenter) {
//         mapRef.current.panTo?.([position.latitude, position.longitude]);
//       }
//     } catch (error) {
//       console.error("Unable to update Mappls marker:", error);
//     }
//   }, [position.latitude, position.longitude]);

//   return (
//     <div
//       ref={mapContainerRef}
//       id={mapIdRef.current}
//       className="h-full w-full"
//       style={{ minHeight: "400px" }}
//     />
//   );
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
//    * Sync existing form coordinates.
//    */
//   useEffect(() => {
//     if (!latitude || !longitude) return;

//     setPosition({
//       latitude: Number(latitude),
//       longitude: Number(longitude),
//     });
//   }, [latitude, longitude]);

//   /*
//    * Automatically get current location when
//    * modal is opened and no location exists.
//    */
//   useEffect(() => {
//     if (!isOpen) return;

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
//    * Search debounce.
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
//    * Search Mappls places.
//    */
//   const handleSearch = async (query: string) => {
//     if (!query.trim()) return;

//     try {
//       setIsSearching(true);

//       const results = await searchPlaces(query);

//       setSearchResults(
//         results.map((item: any) => ({
//           address:
//             item.address ??
//             item.formatted_address ??
//             item.display_name ??
//             item.placeName ??
//             "",

//           latitude: Number(
//             item.latitude ?? item.lat ?? item.y ?? item.location?.lat,
//           ),

//           longitude: Number(
//             item.longitude ??
//               item.lng ??
//               item.lon ??
//               item.x ??
//               item.location?.lng,
//           ),
//         })),
//       );
//     } catch (error) {
//       console.error("Mappls search failed:", error);

//       setSearchResults([]);
//     } finally {
//       setIsSearching(false);
//     }
//   };

//   /*
//    * Reverse geocode coordinates.
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
//       console.error("Mappls reverse geocoding failed:", error);

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
//    * Map / marker location change.
//    */
//   const handleLocationChange = async (newPosition: Position) => {
//     setPosition(newPosition);

//     await getAddressFromCoordinates(
//       newPosition.latitude,
//       newPosition.longitude,
//     );
//   };

//   /*
//    * Current browser location.
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

//   return (
//     <>
//       {/* Location Selector */}
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
//             "
//           >
//             <MapPin className="h-5 w-5" />
//           </div>

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

//             {/* Search */}
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

//               {/* Search Results */}
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

//             {/* Current Location */}
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

//             {/* Map */}
//             <div className="h-[400px] w-full">
//               <MapplsMap
//                 position={position}
//                 onLocationChange={handleLocationChange}
//               />
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
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default LocationPicker;
