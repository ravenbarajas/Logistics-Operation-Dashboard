import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { activeRoutes, scheduledRoutes, completedRoutes } from "@/components/routes/routeData";
import { useTheme } from "@/hooks/use-theme";

// Define marker colors for different route statuses
const statusColors: Record<string, string> = {
  active: "#22c55e", // green
  scheduled: "#3b82f6", // blue
  completed: "#6b7280", // gray
  in_progress: "#f59e0b", // amber
  optimized: "#8b5cf6", // purple
  default: "#64748b", // slate for unknown status
};

interface GeoDistributionProps {
  height?: string;
}

export function GeoDistribution({ height = "300px" }: GeoDistributionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<{[key: string]: L.Marker}>({});
  const { theme } = useTheme();

  // Combine all routes for display
  const allRoutes = [...activeRoutes, ...scheduledRoutes, ...completedRoutes];

  useEffect(() => {
    // Initialize the map if it doesn't exist
    if (!leafletMap.current && mapRef.current) {
      // Create map centered on a default location (San Francisco)
      leafletMap.current = L.map(mapRef.current).setView([37.7749, -122.4194], 7);

      // Add the tile layer (OpenStreetMap)
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(leafletMap.current);

      // Update z-index for all Leaflet containers to prevent them from appearing above modals
      const leafletContainers = document.querySelectorAll('.leaflet-container');
      leafletContainers.forEach(container => {
        if (container instanceof HTMLElement) {
          container.style.zIndex = '10';
        }
      });

      // Also target marker popups and controls
      const leafletPopupPane = document.querySelector('.leaflet-popup-pane');
      if (leafletPopupPane instanceof HTMLElement) {
        leafletPopupPane.style.zIndex = '400';
      }

      const leafletControlPane = document.querySelector('.leaflet-control-container');
      if (leafletControlPane instanceof HTMLElement) {
        leafletControlPane.style.zIndex = '400';
      }
    }

    // Return a cleanup function
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);

  // Update markers when routes change
  useEffect(() => {
    if (!leafletMap.current) return;

    const map = leafletMap.current;
    const existingMarkerIds = Object.keys(markersRef.current);
    const currentMarkerIds = allRoutes.map(r => r.id);

    // Remove markers that are no longer in the routes array
    existingMarkerIds.forEach(id => {
      if (!currentMarkerIds.includes(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    // Add or update markers for each route
    allRoutes.forEach(route => {
      // Generate random coordinates for the route if not available
      // In a real app, these would come from the route data
      const lat = 37.7749 + (Math.random() - 0.5) * 0.5;
      const lng = -122.4194 + (Math.random() - 0.5) * 0.5;

      const status = route.status as string;
      const markerColor = statusColors[status] || statusColors.default;

      const markerOptions = {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 12px;
              height: 12px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
            "></div>
          `,
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
        title: route.name
      };

      const id = route.id;
      const position = new L.LatLng(lat, lng);

      // If marker already exists, update its position
      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng(position);
      } else {
        // Create a new marker
        const marker = L.marker(position, markerOptions).addTo(map);
        
        // Add popup with route info
        marker.bindPopup(`
          <div style="min-width: 150px;">
            <strong>${route.name}</strong>
            <div>Vehicle: ${route.vehicle}</div>
            <div>Driver: ${route.driver}</div>
            <div>Status: <span style="color: ${markerColor}">${route.status}</span></div>
            <div>Stops: ${route.stops}</div>
            <div>Distance: ${route.distance} miles</div>
            <div>Duration: ${route.duration} minutes</div>
          </div>
        `);

        markersRef.current[id] = marker;
      }
    });

    // Fit map bounds to show all markers
    if (Object.keys(markersRef.current).length > 0) {
      const bounds = Object.values(markersRef.current).map(marker => marker.getLatLng());
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] });
    }
  }, [allRoutes]);

  // Update map when theme changes
  useEffect(() => {
    if (leafletMap.current) {
      leafletMap.current.invalidateSize();
    }
  }, [theme]);

  return (
    <div ref={mapRef} style={{ height, width: "100%", zIndex: "10" }} className="rounded-md"></div>
  );
} 