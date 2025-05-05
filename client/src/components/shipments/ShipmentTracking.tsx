import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TruckIcon, 
  PackageIcon, 
  MapPinIcon, 
  ClockIcon, 
  AlertTriangleIcon,
  RefreshCwIcon,
  CalendarIcon,
  RulerIcon
} from "lucide-react";
import { Shipment } from "@shared/schema";
import { Progress } from "@/components/ui/progress";

// Import Leaflet directly instead of using react-leaflet
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface ShipmentTrackingProps {
  shipment: Shipment;
  onRefresh?: () => void;
}

interface TrackingLocation {
  lat: number;
  lng: number;
  timestamp: string;
}

// Generate locations between origin and destination for tracking
const generateLocations = (origin: { lat: number, lng: number }, destination: { lat: number, lng: number }, count: number = 10): TrackingLocation[] => {
  const locations = [];
  
  for (let i = 0; i <= count; i++) {
    const ratio = i / count;
    locations.push({
      lat: origin.lat + (destination.lat - origin.lat) * ratio,
      lng: origin.lng + (destination.lng - origin.lng) * ratio,
      timestamp: new Date(Date.now() - (count - i) * 3600000).toISOString(), // 1 hour intervals
    });
  }
  
  return locations;
};

export function ShipmentTracking({ shipment, onRefresh }: ShipmentTrackingProps) {
  const [activeTab, setActiveTab] = useState("map");
  const [trackingHistory, setTrackingHistory] = useState<TrackingLocation[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Refs for Leaflet map
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMap = useRef<L.Map | null>(null);
  const markersRef = useRef<{[key: string]: L.Marker}>({});
  
  // Calculate the progress percentage based on shipment status
  useEffect(() => {
    if (!shipment) return;
    
    switch (shipment.status) {
      case "pending":
        setProgressPercent(10);
        break;
      case "processing":
        setProgressPercent(25);
        break;
      case "in-transit":
        setProgressPercent(60);
        break;
      case "delivered":
        setProgressPercent(100);
        break;
      case "cancelled":
        setProgressPercent(0);
        break;
      default:
        setProgressPercent(0);
    }
    
    // Generate tracking history
    if (shipment.originLocation && shipment.destinationLocation) {
      const locations = generateLocations(
        shipment.originLocation as { lat: number, lng: number },
        shipment.destinationLocation as { lat: number, lng: number }
      );
      
      // Filter history based on shipment status
      let historyLimit = 0;
      switch (shipment.status) {
        case "pending":
          historyLimit = 0;
          break;
        case "processing":
          historyLimit = 2;
          break;
        case "in-transit":
          historyLimit = 7;
          break;
        case "delivered":
          historyLimit = locations.length;
          break;
        default:
          historyLimit = 0;
      }
      
      const filteredHistory = locations.slice(0, historyLimit);
      setTrackingHistory(filteredHistory);
      
      // Set current location to the last tracked position
      if (filteredHistory.length > 0) {
        setCurrentLocation({
          lat: filteredHistory[filteredHistory.length - 1].lat,
          lng: filteredHistory[filteredHistory.length - 1].lng
        });
        setLastUpdate(filteredHistory[filteredHistory.length - 1].timestamp);
      } else if (shipment.originLocation) {
        setCurrentLocation(shipment.originLocation as { lat: number, lng: number });
      }
    }
  }, [shipment]);

  // Initialize and update map
  useEffect(() => {
    // Only initialize map when activeTab is "map" and mapRef is available
    if (activeTab !== "map" || !mapRef.current || !currentLocation) return;
    
    // Always recreate the map when the tab becomes active - this is the key fix
    if (leafletMap.current) {
      leafletMap.current.remove();
      leafletMap.current = null;
    }
    
    // Create a new map instance
    leafletMap.current = L.map(mapRef.current).setView([currentLocation.lat, currentLocation.lng], 10);
    
    // Add the tile layer (OpenStreetMap)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(leafletMap.current);
    
    // Clear existing markers
    markersRef.current = {};
    
    // Add marker for current location
    if (currentLocation) {
      const marker = L.marker([currentLocation.lat, currentLocation.lng])
        .bindPopup(`<div>Current Location: ${formatCoordinates(currentLocation)}</div>`)
        .addTo(leafletMap.current);
      markersRef.current['current'] = marker;
    }
    
    // Add marker for origin location
    if (shipment?.originLocation && typeof shipment.originLocation === 'object' && 'lat' in shipment.originLocation && 'lng' in shipment.originLocation) {
      const originLocation = shipment.originLocation as { lat: number, lng: number };
      const greenIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });
      
      const marker = L.marker([originLocation.lat, originLocation.lng], { icon: greenIcon })
        .bindPopup(`<div>Origin: ${formatCoordinates(originLocation)}</div>`)
        .addTo(leafletMap.current);
      markersRef.current['origin'] = marker;
    }
    
    // Add marker for destination location
    if (shipment?.destinationLocation && typeof shipment.destinationLocation === 'object' && 'lat' in shipment.destinationLocation && 'lng' in shipment.destinationLocation) {
      const destLocation = shipment.destinationLocation as { lat: number, lng: number };
      const redIcon = new L.Icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
        shadowSize: [41, 41],
      });
      
      const marker = L.marker([destLocation.lat, destLocation.lng], { icon: redIcon })
        .bindPopup(`<div>Destination: ${formatCoordinates(destLocation)}</div>`)
        .addTo(leafletMap.current);
      markersRef.current['destination'] = marker;
    }
    
    // Create bounds to fit all markers
    if (Object.keys(markersRef.current).length > 1) {
      const bounds = Object.values(markersRef.current).map(marker => marker.getLatLng());
      leafletMap.current.fitBounds(L.latLngBounds(bounds), { padding: [30, 30] });
    }
  }, [activeTab, currentLocation, shipment?.originLocation, shipment?.destinationLocation]);
  
  // Add a cleanup effect for component unmount
  useEffect(() => {
    // This cleanup only runs when the component unmounts
    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, []);
  
  const handleRefresh = () => {
    setIsLoading(true);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      if (onRefresh) {
        onRefresh();
      }
    }, 1000);
  };
  
  // Format coordinates for display
  const formatCoordinates = (coords: { lat: number, lng: number } | null) => {
    if (!coords) return "N/A";
    return `${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)}`;
  };
  
  // Format the status with appropriate styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>;
      case "processing":
        return <Badge variant="secondary">Processing</Badge>;
      case "in-transit":
        return <Badge className="bg-blue-500">In Transit</Badge>;
      case "delivered":
        return <Badge className="bg-green-500">Delivered</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  const formatDateTime = (dateString: string | null | Date) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString();
  };
  
  if (!shipment) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No shipment selected</p>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div>
      <CardContent className="p-6 py-0 mb-6">
        <CardTitle className="flex items-center mb-1">
          Shipments Details
        </CardTitle>
        <CardDescription className="mb-6">In-depth information for your current shipments</CardDescription>
        <div className="mb-4">
          <div className="flex justify-between mb-2">
            <div className="flex items-center">
              {getStatusBadge(shipment.status)}
              <span className="text-sm text-muted-foreground ml-2">
                Last updated: {formatDateTime(lastUpdate || shipment.updatedAt)}
              </span>
            </div>
            <div className="text-sm text-muted-foreground">
              {progressPercent}% complete
            </div>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="p-3 border rounded">
            <div className="text-sm font-medium mb-1 flex items-center">
              <PackageIcon className="h-4 w-4 mr-1" />
              Origin
            </div>
            <div className="text-sm text-muted-foreground">{(shipment as any).origin || formatCoordinates(shipment.originLocation as any)}</div>
          </div>
          
          <div className="p-3 border rounded">
            <div className="text-sm font-medium mb-1 flex items-center">
              <MapPinIcon className="h-4 w-4 mr-1" />
              Destination
            </div>
            <div className="text-sm text-muted-foreground">{(shipment as any).destination || formatCoordinates(shipment.destinationLocation as any)}</div>
          </div>
          
          <div className="p-3 border rounded">
            <div className="text-sm font-medium mb-1 flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              Estimated Delivery
            </div>
            <div className="text-sm text-muted-foreground">{formatDateTime(shipment.estimatedDelivery)}</div>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="map">Map View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>
          
          <TabsContent value="map" className="pt-2">
            <div className="border rounded-md p-2 bg-muted/30 h-80 relative">
              {currentLocation ? (
                <div ref={mapRef} style={{ height: "100%", width: "100%" }} className="rounded-md"></div>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-muted-foreground">No location data available</p>
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="timeline" className="pt-2">
            <div className="border rounded-md p-4 max-h-80 overflow-y-auto">
              <div className="space-y-4">
                {trackingHistory.length > 0 ? (
                  trackingHistory.map((event, index) => (
                    <div key={index} className="flex">
                      <div className="mr-4 relative">
                        <div className={`w-3 h-3 rounded-full ${index === trackingHistory.length - 1 ? 'bg-primary' : 'bg-gray-300'}`} />
                        {index < trackingHistory.length - 1 && (
                          <div className="absolute top-3 left-1.5 w-0.5 h-full -ml-0.5 bg-gray-200" />
                        )}
                      </div>
                      <div className="pb-4 w-full">
                        <div className="text-sm font-medium">{index === 0 ? 'Shipment Departed' : 
                                                               index === trackingHistory.length - 1 ? 'Current Location' : 
                                                               `Checkpoint ${index}`}</div>
                        <div className="text-xs text-muted-foreground mb-1">{formatDateTime(event.timestamp)}</div>
                        <div className="text-xs">Location: {formatCoordinates({lat: event.lat, lng: event.lng})}</div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-6 text-center text-muted-foreground">
                    <div className="mb-2">No tracking updates available</div>
                    <div className="text-xs">
                      {shipment.status === "pending" ? "Shipment is pending processing" : 
                       shipment.status === "cancelled" ? "Shipment has been cancelled" :
                       "Tracking information will appear here"}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Ordered:</span>
              <span>{formatDateTime(shipment.createdAt).split(',')[0]}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <RulerIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Distance:</span>
              <span>{(shipment as any).distance || '~'} miles</span>
            </div>
            
            <div className="flex items-center text-sm">
              <TruckIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Vehicle:</span>
              <span>{(shipment as any).vehicle || 'Unassigned'}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <PackageIcon className="h-4 w-4 mr-1 text-muted-foreground" />
              <span className="text-muted-foreground mr-1">Description:</span>
              <span className="truncate">{(shipment as any).description || 'N/A'}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </div>
  );
} 