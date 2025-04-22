import { useState, useEffect } from "react";
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

interface ShipmentTrackingProps {
  shipment: Shipment;
  onRefresh?: () => void;
}

// Mock location updates for the shipment
const generateMockLocations = (origin: { lat: number, lng: number }, destination: { lat: number, lng: number }, count: number = 10) => {
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
  const [trackingHistory, setTrackingHistory] = useState<any[]>([]);
  const [progressPercent, setProgressPercent] = useState(0);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [currentLocation, setCurrentLocation] = useState<{ lat: number, lng: number } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
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
    
    // Generate mock tracking history
    if (shipment.originLocation && shipment.destinationLocation) {
      const mockData = generateMockLocations(
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
          historyLimit = mockData.length;
          break;
        default:
          historyLimit = 0;
      }
      
      const filteredHistory = mockData.slice(0, historyLimit);
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
      <CardHeader className="pb-2 pt-0">
        <div className="flex justify-between items-center">
          <div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
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
            <div className="border rounded-md p-2 bg-muted/30 h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-muted-foreground mb-2">Interactive Map</div>
                <div className="font-medium mb-2">Current Location</div>
                <div>{formatCoordinates(currentLocation)}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  {(currentLocation && shipment.destinationLocation) && (
                    <span>
                      Approximately {Math.floor(
                        Math.random() * 100
                      )} miles from destination
                    </span>
                  )}
                </div>
              </div>
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
                          <div className="absolute top-3 left-1.5 bottom-0 w-px bg-gray-300 -ml-px h-full" />
                        )}
                      </div>
                      <div className="pb-4 w-full">
                        <div className="flex justify-between text-sm">
                          <div className="font-medium">Location Update</div>
                          <div className="text-muted-foreground">{formatDateTime(event.timestamp)}</div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Coordinates: {formatCoordinates({ lat: event.lat, lng: event.lng })}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <AlertTriangleIcon className="h-10 w-10 text-muted-foreground mb-2 mx-auto" />
                    <p className="text-muted-foreground">No tracking updates available</p>
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