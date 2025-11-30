"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapPickerProps {
    initialPosition?: { lat: number; lng: number } | null;
    onLocationSelect: (lat: number, lng: number) => void;
}

const MapPicker = ({ initialPosition, onLocationSelect }: MapPickerProps) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Default center (Hat Yai)
    const defaultCenter: [number, number] = [7.00866, 100.47469];

    useEffect(() => {
        if (!mapContainerRef.current) return;
        if (mapInstanceRef.current) return;

        const startPosition = initialPosition
            ? [initialPosition.lat, initialPosition.lng] as [number, number]
            : defaultCenter;

        const map = L.map(mapContainerRef.current).setView(startPosition, 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        mapInstanceRef.current = map;

        // Add initial marker if exists
        if (initialPosition) {
            const marker = L.marker(startPosition, { draggable: true }).addTo(map);
            markerRef.current = marker;

            marker.on('dragend', (event) => {
                const marker = event.target;
                const position = marker.getLatLng();
                onLocationSelect(position.lat, position.lng);
            });
        }

        // Handle map click
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;

            if (markerRef.current) {
                markerRef.current.setLatLng([lat, lng]);
            } else {
                const marker = L.marker([lat, lng], { draggable: true }).addTo(map);
                markerRef.current = marker;

                marker.on('dragend', (event) => {
                    const marker = event.target;
                    const position = marker.getLatLng();
                    onLocationSelect(position.lat, position.lng);
                });
            }

            onLocationSelect(lat, lng);
        });

        return () => {
            map.remove();
            mapInstanceRef.current = null;
        };
    }, []); // Run once

    // Update marker if initialPosition changes externally (optional, but good for sync)
    useEffect(() => {
        if (!mapInstanceRef.current || !initialPosition) return;

        const newLatLng = new L.LatLng(initialPosition.lat, initialPosition.lng);

        if (markerRef.current) {
            markerRef.current.setLatLng(newLatLng);
        } else {
            const marker = L.marker(newLatLng, { draggable: true }).addTo(mapInstanceRef.current);
            markerRef.current = marker;
            marker.on('dragend', (event) => {
                const marker = event.target;
                const position = marker.getLatLng();
                onLocationSelect(position.lat, position.lng);
            });
        }

        mapInstanceRef.current.panTo(newLatLng);
    }, [initialPosition]);

    return <div ref={mapContainerRef} style={{ height: "100%", width: "100%", zIndex: 0 }} />;
};

export default MapPicker;
