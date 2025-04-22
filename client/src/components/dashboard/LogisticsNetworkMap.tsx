import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { vehicleLocations, routePoints, geofencePoints } from "@/data/mock-data";
import { Filter, Layers, MapPin, Truck, AlertTriangle, Route, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface LogisticsNetworkMapProps {
  isDataLoaded: boolean;
  period: string;
}

export default function LogisticsNetworkMap({ isDataLoaded, period }: LogisticsNetworkMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const routeLayerRef = useRef<any>(null);
  const geofenceLayerRef = useRef<any>(null);
  const warehouseMarkersRef = useRef<any[]>([]);
  
  const [mapView, setMapView] = useState<"satellite" | "streets">("streets");
  const [activeFilters, setActiveFilters] = useState<string[]>(["active", "delayed", "idle"]);
  const [visibleLayers, setVisibleLayers] = useState<string[]>(["vehicles", "routes", "geofences"]);
  const [isMapReady, setIsMapReady] = useState(false);
  
  // Simulated warehouse locations
  const warehouseLocations = [
    { id: "W1", name: "San Francisco Distribution Center", lat: 37.7749, lng: -122.4194, status: "operational" },
    { id: "W2", name: "Seattle Fulfillment Center", lat: 47.6062, lng: -122.3321, status: "operational" },
    { id: "W3", name: "Los Angeles Logistics Hub", lat: 34.0522, lng: -118.2437, status: "maintenance" },
    { id: "W4", name: "Chicago Distribution Center", lat: 41.8781, lng: -87.6298, status: "operational" },
    { id: "W5", name: "New York Fulfillment Center", lat: 40.7128, lng: -74.0060, status: "operational" }
  ];

  // Initialize and set up map
  useEffect(() => {
    if (!isDataLoaded || !mapRef.current || !window.L) return;
    
    if (!mapInstance.current) {
      // Initialize map
      mapInstance.current = window.L.map(mapRef.current).setView([39.8283, -98.5795], 4);
      
      // Set up tile layer (map style)
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
      
      setIsMapReady(true);
    }
    
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [isDataLoaded]);
  
  // Update map style when mapView changes
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;
    
    // Remove existing tile layer
    mapInstance.current.eachLayer((layer: any) => {
      if (layer instanceof window.L.TileLayer) {
        mapInstance.current.removeLayer(layer);
      }
    });
    
    // Add new tile layer based on selected view
    if (mapView === "satellite") {
      window.L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
      }).addTo(mapInstance.current);
    } else {
      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(mapInstance.current);
    }
  }, [mapView, isMapReady]);
  
  // Manage vehicle markers based on filters
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;
    
    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    markersRef.current = [];
    
    // Only add vehicle markers if the vehicles layer is visible
    if (visibleLayers.includes("vehicles")) {
      // Filter vehicles based on status
      const filteredVehicles = vehicleLocations.filter(vehicle => 
        activeFilters.includes(vehicle.status)
      );
      
      // Add filtered vehicle markers
      filteredVehicles.forEach(vehicle => {
        const statusColors: Record<string, string> = {
          active: "#10b981", // green
          idle: "#f59e0b",   // amber
          delayed: "#ef4444" // red
        };
        
        const iconHtml = `
          <div class="relative flex items-center justify-center">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${statusColors[vehicle.status]}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="3" width="15" height="13" rx="2" ry="2"></rect>
              <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
              <circle cx="5.5" cy="18.5" r="2.5"></circle>
              <circle cx="18.5" cy="18.5" r="2.5"></circle>
            </svg>
            ${vehicle.status === "delayed" ? '<span class="absolute top-0 right-0 h-2 w-2 bg-destructive rounded-full animate-ping"></span>' : ''}
          </div>
        `;
        
        const icon = window.L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        const marker = window.L.marker([vehicle.lat, vehicle.lng], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div class="p-2">
              <div class="font-bold">${vehicle.name}</div>
              <div>Status: <span class="font-semibold text-${vehicle.status === 'active' ? 'green' : vehicle.status === 'delayed' ? 'red' : 'amber'}-500">${vehicle.status}</span></div>
              <div>ID: ${vehicle.id}</div>
              <div>Position: ${vehicle.lat.toFixed(4)}, ${vehicle.lng.toFixed(4)}</div>
            </div>
          `);
        
        markersRef.current.push(marker);
      });
    }
  }, [activeFilters, visibleLayers, isMapReady]);
  
  // Manage route layer
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;
    
    // Remove existing route layer
    if (routeLayerRef.current) {
      mapInstance.current.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }
    
    // Add route layer if visible
    if (visibleLayers.includes("routes")) {
      routeLayerRef.current = window.L.polyline(routePoints, {
        color: 'hsl(var(--primary))',
        weight: 4,
        opacity: 0.7,
        lineJoin: 'round',
        dashArray: '5, 10'
      }).addTo(mapInstance.current);
    }
  }, [visibleLayers, isMapReady]);
  
  // Manage geofence layer
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;
    
    // Remove existing geofence layer
    if (geofenceLayerRef.current) {
      mapInstance.current.removeLayer(geofenceLayerRef.current);
      geofenceLayerRef.current = null;
    }
    
    // Add geofence layer if visible
    if (visibleLayers.includes("geofences")) {
      geofenceLayerRef.current = window.L.polygon(geofencePoints, {
        color: 'hsl(var(--secondary))',
        fillColor: 'hsl(var(--secondary))',
        fillOpacity: 0.2,
        weight: 2
      }).addTo(mapInstance.current);
    }
  }, [visibleLayers, isMapReady]);
  
  // Manage warehouse markers
  useEffect(() => {
    if (!isMapReady || !mapInstance.current) return;
    
    // Remove existing warehouse markers
    warehouseMarkersRef.current.forEach(marker => {
      mapInstance.current.removeLayer(marker);
    });
    warehouseMarkersRef.current = [];
    
    // Add warehouse markers if warehouses layer is visible
    if (visibleLayers.includes("warehouses")) {
      warehouseLocations.forEach(warehouse => {
        const statusColor = warehouse.status === "operational" ? "#10b981" : "#f59e0b";
        
        const iconHtml = `
          <div>
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="${statusColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 8.35V20a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8.35A2 2 0 0 1 3.26 6.5l8-3.2a2 2 0 0 1 1.48 0l8 3.2A2 2 0 0 1 22 8.35Z"></path>
              <path d="M6 18h12"></path>
              <path d="M6 14h12"></path>
              <rect x="6" y="10" width="12" height="12"></rect>
            </svg>
          </div>
        `;
        
        const icon = window.L.divIcon({
          html: iconHtml,
          className: '',
          iconSize: [30, 30],
          iconAnchor: [15, 15]
        });
        
        const marker = window.L.marker([warehouse.lat, warehouse.lng], { icon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div class="p-2">
              <div class="font-bold">${warehouse.name}</div>
              <div>Status: <span class="font-semibold text-${warehouse.status === 'operational' ? 'green' : 'amber'}-500">${warehouse.status}</span></div>
              <div>ID: ${warehouse.id}</div>
            </div>
          `);
        
        warehouseMarkersRef.current.push(marker);
      });
    }
  }, [visibleLayers, isMapReady]);
  
  const toggleFilter = (value: string) => {
    setActiveFilters(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value) 
        : [...prev, value]
    );
  };
  
  const toggleLayer = (value: string) => {
    setVisibleLayers(prev => 
      prev.includes(value) 
        ? prev.filter(v => v !== value) 
        : [...prev, value]
    );
  };
  
  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 pb-0">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-2 sm:space-y-0">
          <CardTitle className="text-lg font-semibold">Logistics Network Map</CardTitle>
          <div className="flex items-center space-x-2">
            <ToggleGroup type="multiple" variant="outline" size="sm">
              <ToggleGroupItem value="streets" aria-label="Map View" 
                               className={mapView === "streets" ? "bg-primary/10" : ""}
                               onClick={() => setMapView("streets")}>
                <MapPin className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Streets</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="satellite" aria-label="Satellite View" 
                               className={mapView === "satellite" ? "bg-primary/10" : ""}
                               onClick={() => setMapView("satellite")}>
                <Layers className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Satellite</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 pt-4">
        <div className="px-4 mb-3 flex flex-wrap gap-2 justify-between">
          {/* Vehicle Filters */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="mr-1 flex items-center">
              <Filter className="h-3 w-3 mr-1" />
              Filters:
            </span>
            <Badge variant="outline" 
                   className={`cursor-pointer ${activeFilters.includes("active") ? "bg-primary/10" : ""}`}
                   onClick={() => toggleFilter("active")}>
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span> Active
            </Badge>
            <Badge variant="outline"
                   className={`cursor-pointer ${activeFilters.includes("idle") ? "bg-primary/10" : ""}`}
                   onClick={() => toggleFilter("idle")}>
              <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span> Idle
            </Badge>
            <Badge variant="outline"
                   className={`cursor-pointer ${activeFilters.includes("delayed") ? "bg-primary/10" : ""}`}
                   onClick={() => toggleFilter("delayed")}>
              <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span> Delayed
            </Badge>
          </div>
          
          {/* Layer Controls */}
          <div className="flex flex-wrap items-center gap-1 text-xs">
            <span className="mr-1 flex items-center">
              <Layers className="h-3 w-3 mr-1" />
              Layers:
            </span>
            <Badge variant="outline"
                   className={`cursor-pointer ${visibleLayers.includes("vehicles") ? "bg-primary/10" : ""}`}
                   onClick={() => toggleLayer("vehicles")}>
              <Truck className="h-3 w-3 mr-1" /> Vehicles
            </Badge>
            <Badge variant="outline"
                   className={`cursor-pointer ${visibleLayers.includes("routes") ? "bg-primary/10" : ""}`}
                   onClick={() => toggleLayer("routes")}>
              <Route className="h-3 w-3 mr-1" /> Routes
            </Badge>
            <Badge variant="outline"
                   className={`cursor-pointer ${visibleLayers.includes("geofences") ? "bg-primary/10" : ""}`}
                   onClick={() => toggleLayer("geofences")}>
              <AlertTriangle className="h-3 w-3 mr-1" /> Geofences
            </Badge>
            <Badge variant="outline"
                   className={`cursor-pointer ${visibleLayers.includes("warehouses") ? "bg-primary/10" : ""}`}
                   onClick={() => toggleLayer("warehouses")}>
              <Warehouse className="h-3 w-3 mr-1" /> Warehouses
            </Badge>
          </div>
        </div>
        
        {/* Map Container */}
        <div className="h-[400px] w-full relative">
          {!isMapReady ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
              <div className="text-center">
                <Skeleton className="h-8 w-8 rounded-full mx-auto mb-2" />
                <div className="text-sm font-medium text-muted-foreground">Loading map...</div>
              </div>
            </div>
          ) : null}
          <div ref={mapRef} className="h-full w-full z-0" />
          
          {/* Map Legend */}
          <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-md p-2 shadow-md border text-xs">
            <div className="font-medium mb-1">Map Legend</div>
            <div className="grid grid-cols-1 gap-1">
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-green-500 mr-1"></span>
                <span>Active Vehicle</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-amber-500 mr-1"></span>
                <span>Idle Vehicle</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-full bg-red-500 mr-1"></span>
                <span>Delayed Vehicle</span>
              </div>
              <div className="flex items-center">
                <span className="h-2 w-2 rounded-md bg-secondary/20 border border-secondary mr-1"></span>
                <span>Geofence Area</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Map Stats */}
        <div className="grid grid-cols-4 gap-px bg-muted/20 border-t">
          <div className="bg-card p-2 text-center">
            <div className="text-sm font-medium">{vehicleLocations.filter(v => v.status === "active").length}</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </div>
          <div className="bg-card p-2 text-center">
            <div className="text-sm font-medium">{vehicleLocations.filter(v => v.status === "delayed").length}</div>
            <div className="text-xs text-muted-foreground">Delayed</div>
          </div>
          <div className="bg-card p-2 text-center">
            <div className="text-sm font-medium">{vehicleLocations.filter(v => v.status === "idle").length}</div>
            <div className="text-xs text-muted-foreground">Idle</div>
          </div>
          <div className="bg-card p-2 text-center">
            <div className="text-sm font-medium text-secondary">96.7%</div>
            <div className="text-xs text-muted-foreground">Coverage</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 