"use client";

import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function LocationTableMapInner({ locations }) {
  const bounds = useMemo(() => {
    if (!locations?.length) return null;
    return L.latLngBounds(locations.map((p) => [p.lat, p.lng])).pad(0.12);
  }, [locations]);

  if (!locations?.length || !bounds?.isValid()) {
    return null;
  }

  return (
    <MapContainer
      bounds={bounds}
      className="h-[380px] w-full rounded-md z-0 border border-stone-200 dark:border-stone-700 [&_.leaflet-control-attribution]:text-[10px]"
      scrollWheelZoom={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {locations.map((p) => (
        <Marker key={`${p.index}-${p.lat}`} position={[p.lat, p.lng]} icon={markerIcon}>
          <Popup>
            <div className="text-sm font-semibold text-stone-900">{p.name || p.label}</div>
            <div className="text-xs text-stone-600 mt-1 max-w-[260px] leading-snug">{p.address}</div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
