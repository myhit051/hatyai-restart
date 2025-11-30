"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom Icons
const repairIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const wasteIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const resourceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

const needIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

interface MapProps {
    items: any[];
    center?: [number, number];
    zoom?: number;
}

const Map = ({ items, center = [7.00866, 100.47469], zoom = 13 }: MapProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markersLayerRef = useRef<L.LayerGroup | null>(null);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return; // Prevent double initialization

        const map = L.map(mapContainerRef.current).setView(center, zoom);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        // Create a layer group for markers
        const markersLayer = L.layerGroup().addTo(map);
        markersLayerRef.current = markersLayer;
        mapInstanceRef.current = map;

        // Cleanup on unmount
        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, [center, zoom]);

    // Update Markers
    useEffect(() => {
        if (!mapInstanceRef.current || !markersLayerRef.current) return;

        const markersLayer = markersLayerRef.current;
        markersLayer.clearLayers();

        items.forEach((item) => {
            let position: [number, number] | null = null;

            if (item.coordinates) {
                try {
                    const coords = typeof item.coordinates === 'string' ? JSON.parse(item.coordinates) : item.coordinates;
                    if (coords && coords.lat && coords.lng) {
                        position = [coords.lat, coords.lng];
                    }
                } catch (e) {
                    console.error("Error parsing coordinates for item", item.id, e);
                }
            }

            // Fallback for demo if no coordinates (optional, can remove if strict)
            if (!position) {
                const hash = item.id.split('').reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);
                const latOffset = (hash % 100) / 2000 - 0.025;
                const lngOffset = ((hash * 13) % 100) / 2000 - 0.025;
                position = [center[0] + latOffset, center[1] + lngOffset];
            }

            let icon = repairIcon;
            let typeLabel = "Unknown";

            if (item.type === 'waste') {
                icon = wasteIcon;
                typeLabel = "จุดขยะ";
            } else if (item.type === 'job') {
                icon = repairIcon;
                typeLabel = "งานซ่อม";
            } else if (item.type === 'resource') {
                icon = resourceIcon;
                typeLabel = "จุดบริจาค";
            } else if (item.type === 'need') {
                icon = needIcon;
                typeLabel = "ขอความช่วยเหลือ";
            }

            if (position) {
                const marker = L.marker(position, { icon });
                const popupContent = `
          <div class="p-2">
            <h3 class="font-bold text-sm mb-1">${typeLabel}: ${item.title || item.name || item.wasteType || item.resourceType}</h3>
            <p class="text-xs text-gray-600 mb-2">${item.description || ''}</p>
            <div class="text-xs">
              <span class="font-semibold">สถานะ:</span> ${item.status || '-'}
            </div>
            <div class="text-xs mt-1">
              <span class="font-semibold">สถานที่:</span> ${item.location || '-'}
            </div>
          </div>
        `;
                marker.bindPopup(popupContent);
                markersLayer.addLayer(marker);
            }
        });
    }, [items, center]);

    return <div ref={mapContainerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
};

export default Map;
