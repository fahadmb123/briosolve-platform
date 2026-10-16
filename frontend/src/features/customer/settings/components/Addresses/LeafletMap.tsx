import React, { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface LeafletMapProps {
  lat: number;
  lng: number;
  onMoveEnd: (lat: number, lng: number) => void;
}

export const LeafletMap: React.FC<LeafletMapProps> = ({ lat, lng, onMoveEnd }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const isProgrammaticMoveRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    if (!mapRef.current) {
      const map = L.map(containerRef.current, {
        center: [lat, lng],
        zoom: 15,
        zoomControl: false,
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      map.on("moveend", () => {
        if (isProgrammaticMoveRef.current) {
          isProgrammaticMoveRef.current = false;
          return;
        }
        const center = map.getCenter();
        onMoveEnd(center.lat, center.lng);
      });

      mapRef.current = map;

      setTimeout(() => {
        map.invalidateSize();
      }, 200);
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const currentCenter = map.getCenter();
    const distance = map.distance(currentCenter, [lat, lng]);

    if (distance > 5) {
      isProgrammaticMoveRef.current = true;
      map.setView([lat, lng], map.getZoom(), { animate: true });
    }
  }, [lat, lng]);

  return <div ref={containerRef} className="w-full h-full" style={{ minHeight: "100%", width: "100%" }} />;
};
