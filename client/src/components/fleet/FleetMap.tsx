import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { ExtendedVehicle } from "@/types/vehicle";

// Define marker colors for different vehicle statuses
const statusColors: Record<string, string> = {
  active: "#22c55e", // green
  maintenance: "#f59e0b", // amber
  inactive: "#ef4444", // red
  default: "#64748b", // slate for unknown status
};

interface FleetMapProps {
  vehicles: ExtendedVehicle[];
  height?: string;
  onVehicleSelect?: (vehicle: ExtendedVehicle) => void;
}

export function FleetMap({ vehicles, height = "400px", onVehicleSelect }: FleetMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<{[key: string]: L.Marker}>({});

  useEffect(() => {
    // Initialize the map if it doesn't exist
    if (!leafletMap.current && mapRef.current) {
      // Create map centered on average of vehicle positions, or default to a central US location
      const centerLat = vehicles.length > 0 
        ? vehicles.reduce((sum, v) => sum + (v.location?.lat || 0), 0) / vehicles.length 
        : 39.8283;
      const centerLng = vehicles.length > 0 
        ? vehicles.reduce((sum, v) => sum + (v.location?.lng || 0), 0) / vehicles.length 
        : -98.5795;

      leafletMap.current = L.map(mapRef.current).setView([centerLat, centerLng], 5);

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

  // Update markers when vehicles change
  useEffect(() => {
    if (!leafletMap.current) return;

    const map = leafletMap.current;
    const existingMarkerIds = Object.keys(markersRef.current);
    const currentMarkerIds = vehicles.map(v => v.id.toString());

    // Remove markers that are no longer in the vehicles array
    existingMarkerIds.forEach(id => {
      if (!currentMarkerIds.includes(id)) {
        map.removeLayer(markersRef.current[id]);
        delete markersRef.current[id];
      }
    });

    // Add or update markers for each vehicle
    vehicles.forEach(vehicle => {
      // Skip vehicles without location data
      if (!vehicle.location) return;

      const status = vehicle.status as string;
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
        title: vehicle.name
      };

      const id = vehicle.id.toString();
      const position = new L.LatLng(vehicle.location.lat, vehicle.location.lng);

      // If marker already exists, update its position
      if (markersRef.current[id]) {
        markersRef.current[id].setLatLng(position);
      } else {
        // Create a new marker
        const marker = L.marker(position, markerOptions).addTo(map);
        
        // Add popup with vehicle info
        marker.bindPopup(`
          <div style="min-width: 150px;">
            <strong>${vehicle.name}</strong>
            <div>${vehicle.make || ''} ${vehicle.model || ''} ${vehicle.year || ''}</div>
            <div>Status: <span style="color: ${markerColor}">${vehicle.status}</span></div>
            <div>Driver: ${vehicle.assignedDriver || 'Unassigned'}</div>
            ${vehicle.licensePlate ? `<div>Plate: ${vehicle.licensePlate}</div>` : ''}
            <div>Updated: ${new Date(vehicle.location.lastUpdated).toLocaleTimeString()}</div>
          </div>
        `);

        // Add click handler
        if (onVehicleSelect) {
          marker.on('click', () => {
            onVehicleSelect(vehicle);
          });
        }

        markersRef.current[id] = marker;
      }
    });

    // Fit map bounds to show all markers
    if (Object.keys(markersRef.current).length > 0) {
      const bounds = Object.values(markersRef.current).map(marker => marker.getLatLng());
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] });
    }
  }, [vehicles, onVehicleSelect]);

  return (
    <div ref={mapRef} style={{ height, width: "100%", zIndex: "10" }} className="rounded-md"></div>
  );
} 