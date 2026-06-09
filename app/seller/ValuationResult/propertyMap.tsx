"use client";

import { useEffect, useRef } from "react";

type Props = {
    address: string;
    municipality: string;
    department: string;
};

const FALLBACK_COORDS: Record<string, [number, number]> = {
    "San Salvador": [13.6929, -89.2182],
    "Santa Tecla": [13.6769, -89.2798],
    "Antiguo Cuscatlán": [13.6697, -89.2492],
    "Soyapango": [13.7099, -89.1517],
    "Mejicanos": [13.7275, -89.2269],
    "Apopa": [13.8026, -89.1789],
    "San Miguel": [13.4796, -88.1796],
    "Santa Ana": [13.9946, -89.5597],
    "Sonsonate": [13.7196, -89.7243],
    "Usulután": [13.3479, -88.4432],
    "Zacatecoluca": [13.5012, -88.8693],
    "Cojutepeque": [13.7172, -88.9368],
    "San Vicente": [13.6419, -88.7854],
    "Chalatenango": [14.0336, -88.9325],
    "La Unión": [13.3369, -87.8439],
    "Ahuachapán": [13.9218, -89.8451],
};

const DEPT_FALLBACK: Record<string, [number, number]> = {
    "San Salvador": [13.6929, -89.2182],
    "Santa Ana": [13.9946, -89.5597],
    "San Miguel": [13.4796, -88.1796],
    "La Libertad": [13.6769, -89.2798],
    "Sonsonate": [13.7196, -89.7243],
    "Usulután": [13.3479, -88.4432],
    "Cuscatlán": [13.7172, -88.9368],
    "San Vicente": [13.6419, -88.7854],
    "Chalatenango": [14.0336, -88.9325],
    "La Unión": [13.3369, -87.8439],
    "Ahuachapán": [13.9218, -89.8451],
    "Cabañas": [13.8833, -88.7500],
    "La Paz": [13.5012, -88.8693],
    "Morazán": [13.7667, -88.1167],
};

export default function PropertyMap({ address, municipality, department }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    const mapInstanceRef = useRef<any>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        let destroyed = false;

        import("leaflet").then((L) => {
            if (destroyed || !containerRef.current) return;

            // --- Safe destroy any pre-existing map on this DOM node ---
            try {
                // Check if Leaflet already owns this container
                const existingMap = (L as any).DomUtil
                    ? undefined
                    : undefined;

                // Use the internal registry Leaflet keeps
                const container = containerRef.current as any;
                if (container._leaflet_id != null) {
                    // Find and remove the existing map instance
                    if (mapInstanceRef.current) {
                        mapInstanceRef.current.remove();
                        mapInstanceRef.current = null;
                    } else {
                        // Force-clear the id so L.map won't throw
                        container._leaflet_id = null;
                    }
                }
            } catch (_) { /* ignore */ }

            if (destroyed || !containerRef.current) return;

            // --- Icon fix (webpack breaks default icons) ---
            delete (L.Icon.Default.prototype as any)._getIconUrl;
            L.Icon.Default.mergeOptions({
                iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
                iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
                shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
            });

            const fallback: [number, number] =
                FALLBACK_COORDS[municipality] ??
                DEPT_FALLBACK[department] ??
                [13.6929, -89.2182];

            // --- Create map ---
            const map = L.map(containerRef.current, {
                center: fallback,
                zoom: 15,
                zoomControl: true,
                scrollWheelZoom: false,
                attributionControl: true,
            });
            mapInstanceRef.current = map;

            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
                attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                maxZoom: 19,
            }).addTo(map);

            // --- Custom navy pin ---
            const customIcon = L.divIcon({
                className: "",
                html: `<div style="width:32px;height:40px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.35));">
                    <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16 0C7.163 0 0 7.163 0 16c0 10.5 16 24 16 24S32 26.5 32 16C32 7.163 24.837 0 16 0z" fill="#0B1E4A"/>
                        <circle cx="16" cy="16" r="6" fill="white"/>
                    </svg>
                </div>`,
                iconSize: [32, 40],
                iconAnchor: [16, 40],
                popupAnchor: [0, -42],
            });

            const marker = L.marker(fallback, { icon: customIcon }).addTo(map);
            marker.bindPopup(
                `<div style="font-family:system-ui;font-size:12px;line-height:1.5;min-width:160px;">
                    <strong style="color:#0B1E4A;">${address || municipality}</strong><br/>
                    <span style="color:#6b7280;">${municipality}, ${department}</span><br/>
                    <span style="color:#6b7280;">El Salvador</span>
                </div>`,
                { closeButton: false }
            );

            // --- Geocode ---
            const geocode = (q: string, zoom: number) =>
                fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=1&countrycodes=sv`,
                    { headers: { "Accept-Language": "en" } }
                ).then((r) => r.json()).then((results: any[]) => {
                    if (destroyed || !mapInstanceRef.current) return false;
                    if (results.length > 0) {
                        const coords: [number, number] = [parseFloat(results[0].lat), parseFloat(results[0].lon)];
                        marker.setLatLng(coords);
                        map.setView(coords, zoom);
                        return true;
                    }
                    return false;
                });

            geocode(`${address}, ${municipality}, ${department}, El Salvador`, 16)
                .then((found) => {
                    if (!found) return geocode(`${municipality}, El Salvador`, 14);
                })
                .catch(() => {/* keep fallback silently */});
        });

        return () => {
            destroyed = true;
            if (mapInstanceRef.current) {
                mapInstanceRef.current.remove();
                mapInstanceRef.current = null;
            }
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);  // Run only once on mount — props are stable from server

    return (
        <>
            <link
                rel="stylesheet"
                href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
                integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
                crossOrigin=""
            />
            <div ref={containerRef} className="w-full h-full rounded-xl" />
        </>
    );
}