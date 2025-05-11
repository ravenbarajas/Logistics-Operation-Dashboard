import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapIcon, TrafficCone, AlertCircle } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";

// Map background patterns with road networks
const mapBackgroundPatterns = `
  <!-- City map pattern for light mode -->
  <pattern id="map-city-light" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(1)">
    <rect width="100" height="100" fill="#f8fafc" />
    <!-- Main roads -->
    <line x1="0" y1="25" x2="100" y2="25" stroke="#e2e8f0" stroke-width="3" />
    <line x1="0" y1="50" x2="100" y2="50" stroke="#e2e8f0" stroke-width="3" />
    <line x1="0" y1="75" x2="100" y2="75" stroke="#e2e8f0" stroke-width="3" />
    <line x1="25" y1="0" x2="25" y2="100" stroke="#e2e8f0" stroke-width="3" />
    <line x1="50" y1="0" x2="50" y2="100" stroke="#e2e8f0" stroke-width="3" />
    <line x1="75" y1="0" x2="75" y2="100" stroke="#e2e8f0" stroke-width="3" />
    
    <!-- Secondary roads -->
    <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#e2e8f0" stroke-width="1" />
    <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#e2e8f0" stroke-width="1" />
    <line x1="0" y1="62.5" x2="100" y2="62.5" stroke="#e2e8f0" stroke-width="1" />
    <line x1="0" y1="87.5" x2="100" y2="87.5" stroke="#e2e8f0" stroke-width="1" />
    <line x1="12.5" y1="0" x2="12.5" y2="100" stroke="#e2e8f0" stroke-width="1" />
    <line x1="37.5" y1="0" x2="37.5" y2="100" stroke="#e2e8f0" stroke-width="1" />
    <line x1="62.5" y1="0" x2="62.5" y2="100" stroke="#e2e8f0" stroke-width="1" />
    <line x1="87.5" y1="0" x2="87.5" y2="100" stroke="#e2e8f0" stroke-width="1" />
    
    <!-- Buildings -->
    <rect x="5" y="5" width="8" height="8" fill="#e2e8f0" />
    <rect x="30" y="5" width="6" height="8" fill="#e2e8f0" />
    <rect x="55" y="5" width="10" height="6" fill="#e2e8f0" />
    <rect x="80" y="5" width="7" height="7" fill="#e2e8f0" />
    <rect x="5" y="30" width="10" height="6" fill="#e2e8f0" />
    <rect x="80" y="30" width="8" height="8" fill="#e2e8f0" />
    <rect x="5" y="55" width="7" height="9" fill="#e2e8f0" />
    <rect x="30" y="55" width="8" height="6" fill="#e2e8f0" />
    <rect x="55" y="55" width="6" height="10" fill="#e2e8f0" />
    <rect x="80" y="55" width="9" height="6" fill="#e2e8f0" />
    <rect x="5" y="80" width="6" height="8" fill="#e2e8f0" />
    <rect x="30" y="80" width="9" height="7" fill="#e2e8f0" />
    <rect x="55" y="80" width="7" height="9" fill="#e2e8f0" />
    <rect x="80" y="80" width="8" height="8" fill="#e2e8f0" />
  </pattern>
  
  <!-- City map pattern for dark mode -->
  <pattern id="map-city-dark" patternUnits="userSpaceOnUse" width="100" height="100" patternTransform="scale(1)">
    <rect width="100" height="100" fill="#0f172a" />
    <!-- Main roads -->
    <line x1="0" y1="25" x2="100" y2="25" stroke="#1e293b" stroke-width="3" />
    <line x1="0" y1="50" x2="100" y2="50" stroke="#1e293b" stroke-width="3" />
    <line x1="0" y1="75" x2="100" y2="75" stroke="#1e293b" stroke-width="3" />
    <line x1="25" y1="0" x2="25" y2="100" stroke="#1e293b" stroke-width="3" />
    <line x1="50" y1="0" x2="50" y2="100" stroke="#1e293b" stroke-width="3" />
    <line x1="75" y1="0" x2="75" y2="100" stroke="#1e293b" stroke-width="3" />
    
    <!-- Secondary roads -->
    <line x1="0" y1="12.5" x2="100" y2="12.5" stroke="#1e293b" stroke-width="1" />
    <line x1="0" y1="37.5" x2="100" y2="37.5" stroke="#1e293b" stroke-width="1" />
    <line x1="0" y1="62.5" x2="100" y2="62.5" stroke="#1e293b" stroke-width="1" />
    <line x1="0" y1="87.5" x2="100" y2="87.5" stroke="#1e293b" stroke-width="1" />
    <line x1="12.5" y1="0" x2="12.5" y2="100" stroke="#1e293b" stroke-width="1" />
    <line x1="37.5" y1="0" x2="37.5" y2="100" stroke="#1e293b" stroke-width="1" />
    <line x1="62.5" y1="0" x2="62.5" y2="100" stroke="#1e293b" stroke-width="1" />
    <line x1="87.5" y1="0" x2="87.5" y2="100" stroke="#1e293b" stroke-width="1" />
    
    <!-- Buildings -->
    <rect x="5" y="5" width="8" height="8" fill="#1e293b" />
    <rect x="30" y="5" width="6" height="8" fill="#1e293b" />
    <rect x="55" y="5" width="10" height="6" fill="#1e293b" />
    <rect x="80" y="5" width="7" height="7" fill="#1e293b" />
    <rect x="5" y="30" width="10" height="6" fill="#1e293b" />
    <rect x="80" y="30" width="8" height="8" fill="#1e293b" />
    <rect x="5" y="55" width="7" height="9" fill="#1e293b" />
    <rect x="30" y="55" width="8" height="6" fill="#1e293b" />
    <rect x="55" y="55" width="6" height="10" fill="#1e293b" />
    <rect x="80" y="55" width="9" height="6" fill="#1e293b" />
    <rect x="5" y="80" width="6" height="8" fill="#1e293b" />
    <rect x="30" y="80" width="9" height="7" fill="#1e293b" />
    <rect x="55" y="80" width="7" height="9" fill="#1e293b" />
    <rect x="80" y="80" width="8" height="8" fill="#1e293b" />
  </pattern>
`;

// Define severity and congestion types
export type IncidentSeverity = "high" | "medium" | "low";
export type CongestionLevel = "high" | "medium" | "low";

// Traffic congestion colors
const trafficColors: Record<CongestionLevel, string> = {
  low: "#22c55e",       // Green for low congestion
  medium: "#f59e0b",    // Amber for medium congestion
  high: "#ef4444",      // Red for high congestion
};

// Define Road interface
export interface TrafficRoad {
  id: string;
  path: string;
  congestion: CongestionLevel;
  coordinates?: [number, number][]; // For actual map coordinates
}

// Define Incident interface
export interface TrafficIncident {
  id: number;
  x: number;
  y: number;
  severity: IncidentSeverity;
  location?: string;
  description?: string;
  type?: string;
  duration?: string;
  affectedRoutes?: string[];
  // For actual map coordinates
  lat?: number;
  lng?: number;
}

// Default traffic incident markers for a city (San Francisco example)
const defaultTrafficIncidents: TrafficIncident[] = [
  { 
    id: 1, 
    x: 15, y: 25, 
    lat: 37.7869, lng: -122.4000, 
    severity: "high", 
    type: "Major Accident",
    location: "I-95 Northbound, Exit 23",
    description: "Multiple vehicle collision blocking 2 lanes",
    duration: "2+ hours", 
    affectedRoutes: ["RT-1043", "RT-3842"] 
  },
  { 
    id: 2, 
    x: 40, y: 50, 
    lat: 37.7749, lng: -122.4194, 
    severity: "medium", 
    type: "Road Construction",
    location: "Main St & 5th Ave",
    description: "Lane closures due to utility work",
    duration: "3 days", 
    affectedRoutes: ["RT-5621", "RT-8954"] 
  },
  { 
    id: 3, 
    x: 75, y: 35, 
    lat: 37.7529, lng: -122.4270, 
    severity: "low", 
    type: "Lane Closure",
    location: "Highway 101, Mile 36",
    description: "Right shoulder closed for maintenance",
    duration: "6 hours", 
    affectedRoutes: ["RT-4567"] 
  },
  { 
    id: 4, 
    x: 60, y: 65, 
    lat: 37.7900, lng: -122.4330, 
    severity: "medium", 
    type: "Traffic Jam",
    location: "Downtown Bridge",
    description: "Heavy congestion due to rush hour",
    duration: "1 hour", 
    affectedRoutes: ["RT-7689"] 
  },
  { 
    id: 5, 
    x: 30, y: 80, 
    lat: 37.7660, lng: -122.4100, 
    severity: "high", 
    type: "Road Closure",
    location: "Westbound Freeway",
    description: "Full closure due to hazardous material spill",
    duration: "4 hours", 
    affectedRoutes: ["RT-2354", "RT-9812"] 
  },
];

interface TrafficMapProps {
  height?: string;
  incidents?: TrafficIncident[];
  roads?: TrafficRoad[];
  title?: string;
  showTime?: boolean;
}

export function TrafficMap({
  height = "300px",
  incidents = defaultTrafficIncidents,
  roads = [],
  title = "Live Traffic",
  showTime = true
}: TrafficMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<{[key: string]: L.Marker}>({});
  const { theme } = useTheme();

  // Initialize the map
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

  // Update traffic incidents on the map
  useEffect(() => {
    if (!leafletMap.current) return;
    const map = leafletMap.current;
    
    // Clear existing markers
    Object.values(markersRef.current).forEach(marker => {
      map.removeLayer(marker);
    });
    markersRef.current = {};
    
    // Add traffic incident markers
    incidents.forEach(incident => {
      // Use provided coordinates or default to SVG coordinates
      const lat = incident.lat ?? (37.7749 + (incident.y / 100 - 0.5) * 0.2);
      const lng = incident.lng ?? (-122.4194 + (incident.x / 100 - 0.5) * 0.2);
      
      const markerColor = trafficColors[incident.severity];
      
      const markerOptions = {
        icon: L.divIcon({
          className: 'custom-div-icon',
          html: `
            <div style="
              background-color: ${markerColor};
              width: 14px;
              height: 14px;
              border-radius: 50%;
              border: 2px solid white;
              box-shadow: 0 0 4px rgba(0,0,0,0.3);
              display: flex;
              align-items: center;
              justify-content: center;
            ">
            </div>
          `,
          iconSize: [14, 14],
          iconAnchor: [7, 7],
        }),
        title: incident.type || `Traffic incident (${incident.severity})`
      };
      
      const position = new L.LatLng(lat, lng);
      const marker = L.marker(position, markerOptions).addTo(map);
      
      // Add popup with incident info
      marker.bindPopup(`
        <div style="min-width: 150px;">
          <strong>${incident.type || 'Traffic Incident'}</strong>
          <div>${incident.location || 'Unknown location'}</div>
          <div style="color: ${markerColor}">Severity: ${incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}</div>
          <div>Duration: ${incident.duration || 'Unknown'}</div>
          ${incident.description ? `<div>${incident.description}</div>` : ''}
          ${incident.affectedRoutes?.length ? `<div>Routes affected: ${incident.affectedRoutes.join(', ')}</div>` : ''}
        </div>
      `);
      
      markersRef.current[`incident-${incident.id}`] = marker;
    });
    
    // Fit map bounds to show all markers
    if (Object.keys(markersRef.current).length > 0) {
      const bounds = Object.values(markersRef.current).map(marker => marker.getLatLng());
      map.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] });
    }
  }, [incidents]);
  
  // Update map when theme changes
  useEffect(() => {
    if (leafletMap.current) {
      leafletMap.current.invalidateSize();
    }
  }, [theme]);
  
  // Legend items
  const legendItems = [
    { label: "Low Impact", color: trafficColors.low },
    { label: "Moderate Impact", color: trafficColors.medium },
    { label: "High Impact", color: trafficColors.high },
  ];

  return (
    <div className="flex flex-col space-y-2">
      <div className="relative rounded-md border bg-muted" style={{ height }}>
        {/* Map title overlay */}
        <div className="absolute top-2 left-2 z-[500] bg-background/80 text-xs p-1 rounded">
          {title}
        </div>
        
        {/* Time indicator */}
        {showTime && (
          <div className="absolute top-2 right-2 z-[500] bg-background/80 text-xs p-1 rounded">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        )}
        
        {/* Leaflet map */}
        <div 
          ref={mapRef} 
          style={{ height: "100%", width: "100%" }} 
          className="rounded-md"
        ></div>
        
        <div className="absolute right-2 bottom-2 z-[500]">
          <MapIcon className="h-4 w-4 text-muted-foreground opacity-50" />
        </div>
      </div>
      
      {/* Legend for traffic conditions */}
      <div className="flex justify-between items-center text-xs px-1">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-1">
            <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
} 