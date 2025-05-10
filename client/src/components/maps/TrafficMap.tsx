import { MapIcon, Map as MapIconOutline } from "lucide-react";
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
type IncidentSeverity = "high" | "medium" | "low";
type CongestionLevel = "high" | "medium" | "low";

// Traffic incident markers for cities
const trafficIncidents = [
  { id: 1, x: 15, y: 25, severity: "high" as IncidentSeverity },
  { id: 2, x: 40, y: 50, severity: "medium" as IncidentSeverity },
  { id: 3, x: 75, y: 35, severity: "low" as IncidentSeverity },
  { id: 4, x: 60, y: 65, severity: "medium" as IncidentSeverity },
  { id: 5, x: 30, y: 80, severity: "high" as IncidentSeverity },
];

// Different road segments with traffic levels
const trafficRoads = [
  // Main horizontal roads
  { id: "h1", path: "M0,25 L100,25", congestion: "high" as CongestionLevel },
  { id: "h2", path: "M0,50 L100,50", congestion: "medium" as CongestionLevel },
  { id: "h3", path: "M0,75 L100,75", congestion: "low" as CongestionLevel },
  
  // Main vertical roads
  { id: "v1", path: "M25,0 L25,100", congestion: "medium" as CongestionLevel },
  { id: "v2", path: "M50,0 L50,100", congestion: "high" as CongestionLevel },
  { id: "v3", path: "M75,0 L75,100", congestion: "low" as CongestionLevel },
  
  // Secondary roads with varying congestion
  { id: "sh1", path: "M0,12.5 L100,12.5", congestion: "low" as CongestionLevel },
  { id: "sh2", path: "M0,37.5 L100,37.5", congestion: "medium" as CongestionLevel },
  { id: "sh3", path: "M0,62.5 L100,62.5", congestion: "high" as CongestionLevel },
  { id: "sh4", path: "M0,87.5 L100,87.5", congestion: "low" as CongestionLevel },
  
  { id: "sv1", path: "M12.5,0 L12.5,100", congestion: "medium" as CongestionLevel },
  { id: "sv2", path: "M37.5,0 L37.5,100", congestion: "low" as CongestionLevel },
  { id: "sv3", path: "M62.5,0 L62.5,100", congestion: "high" as CongestionLevel },
  { id: "sv4", path: "M87.5,0 L87.5,100", congestion: "medium" as CongestionLevel },
];

// Traffic congestion colors
const trafficColors: Record<CongestionLevel, string> = {
  low: "#22c55e",       // Green for low congestion
  medium: "#f59e0b",    // Amber for medium congestion
  high: "#ef4444",      // Red for high congestion
};

interface TrafficMapProps {
  height?: string;
}

export function TrafficMap({ height = "300px" }: TrafficMapProps) {
  const { theme } = useTheme();
  
  // Legend items
  const legendItems = [
    { label: "Low Traffic", color: trafficColors.low },
    { label: "Moderate Traffic", color: trafficColors.medium },
    { label: "Heavy Traffic", color: trafficColors.high },
  ];
  
  return (
    <div className="flex flex-col space-y-2">
      <div 
        className="rounded-md border bg-muted flex flex-col items-center justify-center relative"
        style={{ height }}
      >
        {/* Static traffic map visualization */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-full h-full p-2">
            <div className="h-full w-full relative">
              <svg width="100%" height="100%" viewBox="0 0 100 100" className="absolute inset-0">
                <defs>
                  {mapBackgroundPatterns}
                </defs>
                
                {/* Map background */}
                <rect width="100" height="100" fill={`url(#map-city-${theme === 'dark' ? 'dark' : 'light'})`} />
                
                {/* Traffic roads - drawn with different colors based on congestion */}
                {trafficRoads.map(road => (
                  <path
                    key={road.id}
                    d={road.path}
                    fill="none"
                    stroke={trafficColors[road.congestion]}
                    strokeWidth={road.id.startsWith('s') ? 2 : 4}
                    strokeLinecap="round"
                    strokeOpacity={0.8}
                  />
                ))}
                
                {/* Traffic incident markers */}
                {trafficIncidents.map(incident => (
                  <g key={incident.id}>
                    <circle 
                      cx={incident.x} 
                      cy={incident.y} 
                      r={incident.severity === "high" ? 2.5 : incident.severity === "medium" ? 2 : 1.5} 
                      fill={trafficColors[incident.severity]}
                      stroke="white"
                      strokeWidth="0.5"
                    />
                    <circle 
                      cx={incident.x} 
                      cy={incident.y} 
                      r={incident.severity === "high" ? 4 : incident.severity === "medium" ? 3 : 2} 
                      fill="transparent"
                      stroke={trafficColors[incident.severity]}
                      strokeWidth="0.5"
                      opacity="0.5"
                    >
                      <animate 
                        attributeName="r" 
                        values={`${incident.severity === "high" ? "4;6;4" : incident.severity === "medium" ? "3;5;3" : "2;4;2"}`} 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                      <animate 
                        attributeName="opacity" 
                        values="0.5;0.2;0.5" 
                        dur="2s" 
                        repeatCount="indefinite" 
                      />
                    </circle>
                  </g>
                ))}
              </svg>
              
              <div className="absolute top-2 left-2 bg-background/80 text-xs p-1 rounded">
                Live Traffic
              </div>
              
              {/* Add time indicator */}
              <div className="absolute top-2 right-2 bg-background/80 text-xs p-1 rounded">
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
              
              <MapIcon className="absolute right-2 bottom-2 h-4 w-4 text-muted-foreground opacity-50" />
            </div>
          </div>
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