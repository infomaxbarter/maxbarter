import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

interface MapMarker {
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type?: "product" | "service" | "user";
  link?: string;
  imageUrl?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  center?: [number, number];
  zoom?: number;
  className?: string;
  height?: string;
}

const typeColors: Record<string, string> = {
  product: "#3b82f6",
  service: "#10b981",
  user: "#a855f7",
};

const MapView = ({ markers, center = [39.9334, 32.8597], zoom = 6, className = "", height = "400px" }: MapViewProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
    }

    const map = L.map(mapRef.current).setView(center, zoom);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markers.forEach((m) => {
      const color = typeColors[m.type || "product"] || "#3b82f6";
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="width:28px;height:28px;border-radius:50%;background:${color};border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });

      const marker = L.marker([m.lat, m.lng], { icon }).addTo(map);
      
      const popupContent = `
        <div style="min-width:150px;font-family:system-ui">
          ${m.imageUrl ? `<img src="${m.imageUrl}" style="width:100%;height:80px;object-fit:cover;border-radius:6px;margin-bottom:6px" />` : ""}
          <strong style="font-size:14px">${m.title}</strong>
          ${m.description ? `<p style="font-size:12px;color:#666;margin:4px 0">${m.description}</p>` : ""}
          ${m.link ? `<a href="${m.link}" style="font-size:12px;color:${color}">Detay →</a>` : ""}
        </div>
      `;
      marker.bindPopup(popupContent);
    });

    // Fit bounds if markers exist
    if (markers.length > 0) {
      const bounds = L.latLngBounds(markers.map((m) => [m.lat, m.lng]));
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 12 });
    }

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [markers, center, zoom]);

  return <div ref={mapRef} className={`rounded-xl overflow-hidden ${className}`} style={{ height, width: "100%" }} />;
};

export default MapView;
