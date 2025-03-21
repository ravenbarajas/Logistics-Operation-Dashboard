import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CloudSun, LocateFixed, Settings } from "lucide-react";
import { vehicleLocations, routePoints, geofencePoints } from "@/data/mock-data";
import { useTheme } from "@/hooks/use-theme";

declare global {
  interface Window {
    L: any;
  }
}

export default function RealtimeMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const mapCreatedRef = useRef<boolean>(false);
  const { theme } = useTheme();
  
  // Effect to initialize map only once
  useEffect(() => {
    if (!window.L || !mapRef.current || mapCreatedRef.current) return;
    
    // Initialize map only if it hasn't been created yet
    const map = window.L.map(mapRef.current).setView([37.7749, -122.4194], 7);
    leafletMapRef.current = map;
    mapCreatedRef.current = true;
    
    // Add tile layer
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add vehicle markers
    vehicleLocations.forEach(vehicle => {
      let markerColor;
      switch(vehicle.status) {
        case 'active': markerColor = 'hsl(var(--secondary))'; break;
        case 'idle': markerColor = 'hsl(var(--accent))'; break;
        case 'delayed': markerColor = 'hsl(var(--destructive))'; break;
        default: markerColor = 'hsl(var(--muted-foreground))';
      }
      
      const markerIcon = window.L.divIcon({
        className: 'custom-div-icon',
        html: `<div style="background-color: ${markerColor}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [12, 12],
        iconAnchor: [6, 6]
      });
      
      const marker = window.L.marker([vehicle.lat, vehicle.lng], { icon: markerIcon }).addTo(map);
      marker.bindPopup(`<b>${vehicle.name}</b><br>Status: ${vehicle.status}`);
    });
    
    // Draw route
    const routeLine = window.L.polyline(routePoints, {
      color: 'hsl(var(--primary))',
      weight: 4,
      opacity: 0.7
    }).addTo(map);
    
    // Draw geofence
    const geofence = window.L.polygon(geofencePoints, {
      color: 'hsl(var(--accent))',
      fillColor: 'hsl(var(--accent))',
      fillOpacity: 0.1,
      weight: 2
    }).addTo(map);
    geofence.bindPopup("San Francisco Bay Area Geofence");
    
    // Clean up on component unmount
    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
        mapCreatedRef.current = false;
      }
    };
  }, []); // Only run once on mount

  // Update map when theme changes
  useEffect(() => {
    if (leafletMapRef.current) {
      leafletMapRef.current.invalidateSize();
    }
  }, [theme]);
  
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="px-4 py-4 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Real-time Vehicle Tracking</CardTitle>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <CloudSun className="h-4 w-4 mr-2" />
            Weather
          </Button>
          <Button variant="outline" size="sm">
            <LocateFixed className="h-4 w-4 mr-2" />
            Traffic
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Options
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div 
          ref={mapRef} 
          id="map" 
          className="w-full h-96 rounded-md bg-muted"
          style={{ zIndex: 1 }}
        />
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-secondary mr-2"></span>
              <span className="text-xs">Active (32)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-accent mr-2"></span>
              <span className="text-xs">Idle (8)</span>
            </div>
            <div className="flex items-center">
              <span className="w-3 h-3 rounded-full bg-destructive mr-2"></span>
              <span className="text-xs">Delayed (2)</span>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            Last updated: 2 minutes ago
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
