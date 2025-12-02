"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

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
    const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);

    const [isMapReady, setIsMapReady] = useState(false);

    // Initialize Map
    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return; // Prevent double initialization

        // Dynamically import markercluster to ensure Leaflet is ready
        // Ensure L is available globally for markercluster
        if (typeof window !== 'undefined' && !(window as any).L) {
            (window as any).L = L;
        }

        import("leaflet.markercluster").then(() => {
            if (!mapContainerRef.current) return;
            if (mapInstanceRef.current) return; // Prevent double initialization inside async callback

            const map = L.map(mapContainerRef.current).setView(center, zoom);

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            }).addTo(map);

            // Initialize MarkerClusterGroup
            const markerClusterGroup = L.markerClusterGroup({
                showCoverageOnHover: false,
                maxClusterRadius: 50,
                spiderfyOnMaxZoom: true,
                zoomToBoundsOnClick: true
            });

            map.addLayer(markerClusterGroup);
            markerClusterGroupRef.current = markerClusterGroup;
            mapInstanceRef.current = map;

            // Force map resize to ensure tiles load correctly
            setTimeout(() => {
                map.invalidateSize();
            }, 100);

            setIsMapReady(true);

            // Add Fit Bounds Button Control
            const FitBoundsControl = L.Control.extend({
                onAdd: function () {
                    const btn = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
                    btn.innerHTML = '🔍 แสดงทั้งหมด';
                    btn.style.backgroundColor = 'white';
                    btn.style.padding = '5px 10px';
                    btn.style.cursor = 'pointer';
                    btn.style.border = '2px solid rgba(0,0,0,0.2)';
                    btn.style.borderRadius = '4px';
                    btn.style.fontSize = '12px';
                    btn.style.fontWeight = 'bold';
                    btn.style.color = '#333';
                    btn.style.boxShadow = '0 1px 5px rgba(0,0,0,0.65)';

                    btn.onclick = function (e: Event) {
                        e.preventDefault();
                        e.stopPropagation();
                        const group = markerClusterGroupRef.current;
                        // Use the map instance from closure or ref. Closure 'map' is fine here as it's the one created in this scope.

                        if (group && group.getLayers().length > 0) {
                            const bounds = group.getBounds();
                            if (bounds.isValid()) {
                                map.fitBounds(bounds, {
                                    padding: [50, 50],
                                    maxZoom: 16,
                                    animate: true
                                });
                            }
                        }
                    };
                    return btn;
                }
            });

            map.addControl(new FitBoundsControl({ position: 'topright' }));
        });

        // Cleanup on unmount
        return () => {
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
                setIsMapReady(false);
            }
        };
    }, [center, zoom]);

    // Update Markers
    useEffect(() => {
        // Wait for map and cluster group to be ready
        if (!isMapReady || !mapInstanceRef.current || !markerClusterGroupRef.current) return;

        const clusterGroup = markerClusterGroupRef.current;
        clusterGroup.clearLayers();

        const markers: L.Marker[] = [];

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
          <div class="p-2 min-w-[200px]">
            <h3 class="font-bold text-sm mb-1 text-gray-900">${typeLabel}: ${item.title || item.name || item.wasteType || item.resourceType}</h3>
            <p class="text-xs text-gray-600 mb-2 line-clamp-2">${item.description || ''}</p>
            <div class="text-xs text-gray-700">
              <span class="font-semibold">สถานะ:</span> ${item.status || '-'}
            </div>
            <div class="text-xs mt-1 text-gray-700">
              <span class="font-semibold">สถานที่:</span> ${item.location || '-'}
            </div>
          </div>
        `;
                marker.bindPopup(popupContent);
                markers.push(marker);
            }
        });

        clusterGroup.addLayers(markers);

        // Auto-fit bounds if there are markers to show all locations (including outside province)
        // Auto-fit bounds if there are markers to show all locations (including outside province)
        if (markers.length > 0) {
            const timer = setTimeout(() => {
                if (mapInstanceRef.current && markerClusterGroupRef.current) {
                    const bounds = markerClusterGroupRef.current.getBounds();
                    if (bounds.isValid()) {
                        mapInstanceRef.current.fitBounds(bounds, {
                            padding: [50, 50],
                            maxZoom: 15,
                            animate: true
                        });
                    }
                }
            }, 300);

            return () => clearTimeout(timer);
        }
    }, [items, center, isMapReady]);

    return <div ref={mapContainerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
};

export default Map;
