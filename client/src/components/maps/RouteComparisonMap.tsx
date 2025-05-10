import { useTheme } from "@/hooks/use-theme";
import { MapIcon } from "lucide-react";

interface RouteComparisonMapProps {
  height?: string;
  optimizationData?: {
    originalRoute?: {
      name: string;
      stops: number;
      waypoints: Array<{lat: number; lng: number}>;
      distance: number;
      duration: number;
    };
    optimizedRoute?: {
      name: string;
      stops: number;
      waypoints: Array<{lat: number; lng: number}>;
      distance: number;
      duration: number;
    };
  };
}

// Mock data for demonstration when no data is provided
const mockOptimizationData = {
  originalRoute: {
    name: "Downtown Circuit (Original)",
    stops: 10,
    waypoints: [
      // San Francisco City Center
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7848, lng: -122.4267 },
      { lat: 37.7963, lng: -122.4041 },
      { lat: 37.7756, lng: -122.4136 },
      { lat: 37.7945, lng: -122.3915 },
      { lat: 37.7834, lng: -122.4078 },
      { lat: 37.7648, lng: -122.4345 },
      { lat: 37.7864, lng: -122.4201 },
      { lat: 37.7925, lng: -122.4382 },
      { lat: 37.7749, lng: -122.4194 }  // Back to start
    ],
    distance: 15.8,
    duration: 87
  },
  optimizedRoute: {
    name: "Downtown Circuit (Optimized)",
    stops: 10,
    waypoints: [
      // San Francisco City Center - Optimized route
      { lat: 37.7749, lng: -122.4194 },
      { lat: 37.7648, lng: -122.4345 },
      { lat: 37.7925, lng: -122.4382 },
      { lat: 37.7963, lng: -122.4041 },
      { lat: 37.7945, lng: -122.3915 },
      { lat: 37.7834, lng: -122.4078 },
      { lat: 37.7864, lng: -122.4201 },
      { lat: 37.7848, lng: -122.4267 },
      { lat: 37.7756, lng: -122.4136 },
      { lat: 37.7749, lng: -122.4194 }  // Back to start
    ],
    distance: 13.2,
    duration: 72
  }
};

// Define colors for the routes
const routeColors = {
  before: "#94a3b8", // Slate color for original route
  after: "#3b82f6",  // Blue color for optimized route
};

export function RouteComparisonMap({ height = "180px", optimizationData }: RouteComparisonMapProps) {
  const { theme } = useTheme();
  const data = optimizationData || mockOptimizationData;
  
  // Calculate savings
  const distanceSaved = data.originalRoute && data.optimizedRoute
    ? ((data.originalRoute.distance - data.optimizedRoute.distance) / data.originalRoute.distance) * 100
    : 0;
  
  // Format time display
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };
  
  return (
    <div className="flex flex-col space-y-2">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Original Route</div>
          <div 
            className="rounded-md border bg-muted flex flex-col items-center justify-center relative"
            style={{ height }}
          >
            {/* Static route representation instead of an actual map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full p-2">
                <div className="h-full w-full relative">
                  {/* Static path representation */}
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    {/* Depot/Start/End */}
                    <circle cx="10" cy="50" r="3" fill={routeColors.before} />
                    
                    {/* Delivery stops */}
                    <circle cx="30" cy="20" r="2" fill={routeColors.before} />
                    <circle cx="40" cy="35" r="2" fill={routeColors.before} />
                    <circle cx="55" cy="15" r="2" fill={routeColors.before} />
                    <circle cx="60" cy="40" r="2" fill={routeColors.before} />
                    <circle cx="75" cy="25" r="2" fill={routeColors.before} />
                    <circle cx="85" cy="50" r="2" fill={routeColors.before} />
                    <circle cx="70" cy="65" r="2" fill={routeColors.before} />
                    <circle cx="50" cy="80" r="2" fill={routeColors.before} />
                    <circle cx="25" cy="70" r="2" fill={routeColors.before} />
                    
                    {/* Route path - less optimized with crossovers */}
                    <path 
                      d="M10,50 L30,20 L40,35 L55,15 L60,40 L75,25 L85,50 L70,65 L50,80 L25,70 L10,50" 
                      fill="none" 
                      stroke={routeColors.before} 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="none"
                    />
                  </svg>
                  
                  <div className="absolute top-2 left-2 bg-background/80 text-xs p-1 rounded">
                    {data.originalRoute?.stops || 10} stops
                  </div>
                  
                  <MapIcon className="absolute right-2 bottom-2 h-4 w-4 text-muted-foreground opacity-50" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{data.originalRoute?.distance.toFixed(1)} mi</span>
            <span>{formatTime(data.originalRoute?.duration || 87)}</span>
          </div>
        </div>
        
        <div className="space-y-1">
          <div className="text-xs font-medium text-muted-foreground">Optimized Route</div>
          <div 
            className="rounded-md border bg-muted flex flex-col items-center justify-center relative"
            style={{ height }}
          >
            {/* Static route representation instead of an actual map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-full p-2">
                <div className="h-full w-full relative">
                  {/* Static path representation - more optimal path */}
                  <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                    {/* Depot/Start/End */}
                    <circle cx="10" cy="50" r="3" fill={routeColors.after} />
                    
                    {/* Same delivery stops */}
                    <circle cx="30" cy="20" r="2" fill={routeColors.after} />
                    <circle cx="40" cy="35" r="2" fill={routeColors.after} />
                    <circle cx="55" cy="15" r="2" fill={routeColors.after} />
                    <circle cx="60" cy="40" r="2" fill={routeColors.after} />
                    <circle cx="75" cy="25" r="2" fill={routeColors.after} />
                    <circle cx="85" cy="50" r="2" fill={routeColors.after} />
                    <circle cx="70" cy="65" r="2" fill={routeColors.after} />
                    <circle cx="50" cy="80" r="2" fill={routeColors.after} />
                    <circle cx="25" cy="70" r="2" fill={routeColors.after} />
                    
                    {/* Route path - optimized with fewer crossovers and better ordering */}
                    <path 
                      d="M10,50 L30,20 L55,15 L75,25 L85,50 L70,65 L50,80 L25,70 L40,35 L60,40 L10,50" 
                      fill="none" 
                      stroke={routeColors.after} 
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeDasharray="none"
                    />
                  </svg>
                  
                  <div className="absolute top-2 left-2 bg-background/80 text-xs p-1 rounded">
                    {data.optimizedRoute?.stops || 10} stops
                  </div>
                  
                  <MapIcon className="absolute right-2 bottom-2 h-4 w-4 text-muted-foreground opacity-50" />
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span>{data.optimizedRoute?.distance.toFixed(1)} mi</span>
            <span>{formatTime(data.optimizedRoute?.duration || 72)}</span>
          </div>
        </div>
      </div>
      
      <div className="flex justify-between items-center text-xs px-1">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: routeColors.before }}></span>
          <span>Original</span>
        </div>
        <div className="text-green-500">
          {distanceSaved > 0 ? `${distanceSaved.toFixed(1)}% distance saved` : null}
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: routeColors.after }}></span>
          <span>Optimized</span>
        </div>
      </div>
    </div>
  );
} 