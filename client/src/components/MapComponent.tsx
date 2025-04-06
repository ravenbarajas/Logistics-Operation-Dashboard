import { Map, Navigation } from "lucide-react";
import { LocationData } from "./VehicleDetailsHelper";

interface MapComponentProps {
  location: LocationData;
  locationName?: string;
}

export function MapComponent({ location, locationName }: MapComponentProps) {
  // Use either lat/lng or latitude/longitude based on what's available
  const latitude = location.lat || location.latitude || 0;
  const longitude = location.lng || location.longitude || 0;
  
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-muted/10">
        {/* Map placeholder with location marker */}
        <div className="h-full w-full bg-gradient-to-b from-blue-50 to-blue-100 dark:from-blue-950 dark:to-slate-900 bg-cover bg-center relative">
          <div className="absolute inset-0 flex flex-col">
            {/* Grid lines for map appearance */}
            <div className="absolute inset-0 grid grid-cols-12 gap-4 opacity-10">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={`vline-${i}`} className="h-full w-px bg-slate-500" />
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-6 gap-4 opacity-10">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={`hline-${i}`} className="w-full h-px bg-slate-500" />
              ))}
            </div>
            
            {/* Location marker */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-8 h-8">
                  <div className="absolute top-0 left-0 w-full h-full bg-primary/20 rounded-full animate-ping"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-full">
                    <Navigation className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Location info box */}
          <div className="absolute bottom-4 left-4 right-4 bg-white dark:bg-gray-800 rounded-md p-3 shadow-md">
            <div className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <Map className="h-4 w-4 text-primary" />
              </div>
              <div className="ml-3">
                <h4 className="text-sm font-medium">{locationName || "Current Location"}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {latitude.toFixed(6)}, {longitude.toFixed(6)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Last updated: {typeof location.lastUpdated === 'string' 
                    ? new Date(location.lastUpdated).toLocaleString() 
                    : location.lastUpdated.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 