import { useEffect } from "react";
import { useMap } from "react-leaflet";

import type { Position } from "../../types/location";

type MapControllerProps = {
  position: Position;
};

const MapController = ({ position }: MapControllerProps) => {
  const map = useMap();

  useEffect(() => {
    map.flyTo([position.latitude, position.longitude], 16, {
      duration: 0.8,
    });
  }, [map, position.latitude, position.longitude]);

  return null;
};

export default MapController;
