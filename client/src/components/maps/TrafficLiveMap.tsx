import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { TrafficIncident, IncidentSeverity, CongestionLevel } from "@/components/maps/TrafficMap";
import { useTheme } from "@/hooks/use-theme";

// Define marker colors for different severity levels
const severityColors: Record<string, string> = {
  high: "#ef4444",    // red
  medium: "#f59e0b",  // amber
  low: "#3b82f6",     // blue
  default: "#64748b", // slate for unknown severity
};

// Define colors for different congestion levels
const congestionColors: Record<string, string> = {
  high: "#ef4444",    // red
  medium: "#f59e0b",  // amber
  low: "#22c55e",     // green
  default: "#64748b", // slate for unknown level
};

// Extend the TrafficRoad interface to include needed properties
interface ExtendedTrafficRoad {
  id: string;
  path: string;
  congestion: CongestionLevel;
  name?: string;
  coordinates?: Array<{lat: number, lng: number}>; 
}

interface TrafficLiveMapProps {
  height?: string;
  incidents?: TrafficIncident[];
  roads?: ExtendedTrafficRoad[];
}

export function TrafficLiveMap({ height = "300px", incidents = [], roads = [] }: TrafficLiveMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const incidentMarkersRef = useRef<{[key: string]: L.Marker}>({});
  const roadLinesRef = useRef<{[key: string]: L.Polyline}>({});
  const { theme } = useTheme();

  useEffect(() => {
    // Initialize the map if it doesn't exist
    if (!leafletMap.current && mapRef.current) {
      // Create map centered on a default location (San Francisco)
      leafletMap.current = L.map(mapRef.current).setView([37.7749, -122.4194], 13);

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

  // Update traffic incident markers
  useEffect(() => {
    if (!leafletMap.current) return;

    const map = leafletMap.current;
    const existingMarkerIds = Object.keys(incidentMarkersRef.current);
    const currentMarkerIds = incidents.map(i => `incident-${i.id}`);

    // Remove markers that are no longer in the incidents array
    existingMarkerIds.forEach(id => {
      if (!currentMarkerIds.includes(id)) {
        map.removeLayer(incidentMarkersRef.current[id]);
        delete incidentMarkersRef.current[id];
      }
    });

    // Add or update markers for each incident
    incidents.forEach(incident => {
      // Use provided coordinates or calculate from x,y
      const lat = incident.lat ?? (37.7749 + (incident.y / 100 - 0.5) * 0.2);
      const lng = incident.lng ?? (-122.4194 + (incident.x / 100 - 0.5) * 0.2);

      const severity = incident.severity as string;
      const markerColor = severityColors[severity] || severityColors.default;

      const markerOptions = {
        icon: L.divIcon({
          className: 'custom-incident-icon',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 16px;
              height: 16px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.5);
            "></div>
          `,
          iconSize: [16, 16],
          iconAnchor: [8, 8],
        }),
        title: incident.type || `Traffic incident (${incident.severity})`
      };

      const id = `incident-${incident.id}`;
      const position = new L.LatLng(lat, lng);

      // If marker already exists, update its position
      if (incidentMarkersRef.current[id]) {
        incidentMarkersRef.current[id].setLatLng(position);
      } else {
        // Create a new marker
        const marker = L.marker(position, markerOptions).addTo(map);
        
        // Add popup with incident info
        marker.bindPopup(`
          <div style="min-width: 200px;">
            <strong>${incident.type || 'Traffic Incident'}</strong>
            <div><strong>Location:</strong> ${incident.location || 'Unknown'}</div>
            <div><strong>Severity:</strong> <span style="color: ${markerColor}">${severity.charAt(0).toUpperCase() + severity.slice(1)}</span></div>
            <div><strong>Description:</strong> ${incident.description || 'No details provided'}</div>
            <div><strong>Duration:</strong> ${incident.duration || 'Unknown'}</div>
            <div><strong>Routes Affected:</strong> ${incident.affectedRoutes?.join(', ') || 'None'}</div>
          </div>
        `);

        incidentMarkersRef.current[id] = marker;
      }
    });

    // Update road lines if provided
    if (roads && roads.length > 0) {
      // Clear existing road lines
      Object.values(roadLinesRef.current).forEach(line => {
        map.removeLayer(line);
      });
      roadLinesRef.current = {};

      // Add road lines for roads with coordinates
      roads.forEach(road => {
        // Skip roads without valid coordinates
        if (!road.coordinates || road.coordinates.length < 2) return;

        const congestion = road.congestion as string;
        const congestionColor = congestionColors[congestion] || congestionColors.default;
        
        // Convert coordinates to Leaflet LatLng objects
        const latLngs = road.coordinates.map(coord => {
          if ('lat' in coord && 'lng' in coord) {
            return new L.LatLng(coord.lat, coord.lng);
          }
          return null;
        }).filter(Boolean) as L.LatLng[];

        if (latLngs.length >= 2) {
          // Create polyline
          const polyline = L.polyline(latLngs, {
            color: congestionColor,
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
          }).addTo(map);
          
          // Add popup with road info
          polyline.bindPopup(`
            <div>
              <strong>${road.name || road.id}</strong>
              <div>Traffic: <span style="color: ${congestionColor}; font-weight: bold;">
                ${congestion.charAt(0).toUpperCase() + congestion.slice(1)} Congestion
              </span></div>
            </div>
          `);
          
          roadLinesRef.current[`road-${road.id}`] = polyline;
        }
      });
    }

    // Fit map bounds to show all markers and roads
    const allBounds: L.LatLng[] = [];
    
    // Add incident markers to bounds
    Object.values(incidentMarkersRef.current).forEach(marker => {
      allBounds.push(marker.getLatLng());
    });
    
    // Add road endpoints to bounds if we have any
    Object.values(roadLinesRef.current).forEach(line => {
      // Safely extract coordinates from polylines, which might have different structures
      try {
        // Get raw LatLngs
        const latLngs = line.getLatLngs();
        
        // Handle both LatLng[] and LatLng[][] cases
        if (Array.isArray(latLngs)) {
          if (latLngs.length > 0) {
            // If it's a simple polyline (flat array of LatLng)
            if (latLngs[0] instanceof L.LatLng) {
              allBounds.push(latLngs[0] as L.LatLng);
              allBounds.push(latLngs[latLngs.length - 1] as L.LatLng);
            } 
            // If it's a multi-polyline (nested array of LatLng[])
            else if (Array.isArray(latLngs[0]) && latLngs[0].length > 0) {
              const firstArr = latLngs[0] as L.LatLng[];
              const lastArr = latLngs[latLngs.length - 1] as L.LatLng[];
              
              if (firstArr[0]) allBounds.push(firstArr[0]);
              if (lastArr[lastArr.length - 1]) allBounds.push(lastArr[lastArr.length - 1]);
            }
          }
        }
      } catch (e) {
        // Silently fail if there's an issue with the coords
        console.error("Failed to process polyline coordinates", e);
      }
    });
    
    // Fit bounds if we have any points
    if (allBounds.length > 0) {
      map.fitBounds(L.latLngBounds(allBounds), { padding: [30, 30] });
    }
  }, [incidents, roads]);

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