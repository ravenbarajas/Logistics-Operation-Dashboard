import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteTable, RouteData } from "@/components/routes/RouteTable";
import { RouteDetails } from "@/components/routes/RouteDetails";
import { RoutePlanModal } from "@/components/routes/RoutePlanModal";
import { activeRoutes, scheduledRoutes, completedRoutes, routeTemplates } from "@/components/routes/routeData";
import { 
  AlertCircle, BarChart3, Clock, Fuel as FuelIcon, LineChart, PlusCircle, Route, 
  TrendingDown, Wind, Truck, Calendar, CheckCircle, Copy, RefreshCw, Settings,
  Zap, DollarSign, Compass, MapPin, Calculator, ChevronLeft, ChevronRight, Search, ChevronsLeft, ChevronsRight, Save, Play, Map as MapIcon,
  TrafficCone, Activity, User
} from "lucide-react";
import { BarChart as CustomBarChart } from "@/components/ui/bar-chart";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { LineChart as LineChartComponent } from "@/components/ui/line-chart";
import { routeService, RouteSummary } from "@/services/routeService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GeoDistribution } from "@/components/maps/GeoDistribution";
import { RouteComparisonMap } from "@/components/maps/RouteComparisonMap";
import { TrafficMap, TrafficIncident, TrafficRoad, CongestionLevel, IncidentSeverity } from "@/components/maps/TrafficMap";
import { useLocation } from "wouter";
import { useTheme } from "@/hooks/use-theme";
import { TrafficLiveMap } from "@/components/maps/TrafficLiveMap";

// Mock data for charts
const optimizationSummaryData = [
  { name: "Distance", before: 1250, after: 1100 },
  { name: "Fuel", before: 180, after: 145 },
  { name: "Time", before: 1650, after: 1380 },
  { name: "CO₂", before: 1840, after: 1485 }
];

// Mock route optimization comparison data
const routeComparisonData = {
  originalRoute: {
    name: "Downtown Express Delivery (Original)",
    stops: 18,
    waypoints: [
      // San Francisco City Center area coordinates
      { lat: 37.7749, lng: -122.4194 }, // Start/End
      { lat: 37.7848, lng: -122.4267 },
      { lat: 37.7963, lng: -122.4041 },
      { lat: 37.7756, lng: -122.4136 },
      { lat: 37.7945, lng: -122.3915 },
      { lat: 37.7834, lng: -122.4078 },
      { lat: 37.7648, lng: -122.4345 },
      { lat: 37.7864, lng: -122.4201 },
      { lat: 37.7925, lng: -122.4382 },
      { lat: 37.7827, lng: -122.4423 },
      { lat: 37.7634, lng: -122.4253 },
      { lat: 37.7837, lng: -122.4320 },
      { lat: 37.7697, lng: -122.4088 },
      { lat: 37.7881, lng: -122.4013 },
      { lat: 37.7793, lng: -122.3898 },
      { lat: 37.7824, lng: -122.3977 },
      { lat: 37.7712, lng: -122.4298 },
      { lat: 37.7749, lng: -122.4194 }, // Back to start
    ],
    distance: 28.6,
    duration: 195
  },
  optimizedRoute: {
    name: "Downtown Express Delivery (Optimized)",
    stops: 18,
    waypoints: [
      // San Francisco City Center area - optimized path
      { lat: 37.7749, lng: -122.4194 }, // Start/End
      { lat: 37.7712, lng: -122.4298 },
      { lat: 37.7634, lng: -122.4253 },
      { lat: 37.7648, lng: -122.4345 },
      { lat: 37.7827, lng: -122.4423 },
      { lat: 37.7925, lng: -122.4382 },
      { lat: 37.7864, lng: -122.4201 },
      { lat: 37.7837, lng: -122.4320 },
      { lat: 37.7834, lng: -122.4078 },
      { lat: 37.7848, lng: -122.4267 },
      { lat: 37.7824, lng: -122.3977 },
      { lat: 37.7793, lng: -122.3898 },
      { lat: 37.7881, lng: -122.4013 },
      { lat: 37.7945, lng: -122.3915 },
      { lat: 37.7963, lng: -122.4041 },
      { lat: 37.7697, lng: -122.4088 },
      { lat: 37.7756, lng: -122.4136 },
      { lat: 37.7749, lng: -122.4194 }, // Back to start
    ],
    distance: 22.8,
    duration: 165
  }
};

const efficiencyImprovementData = [
  { name: "Route 1", distance: 14.7, time: 32, fuel: 1.2, emissions: 12.3 },
  { name: "Route 2", distance: 9.3, time: 17, fuel: 0.8, emissions: 8.1 },
  { name: "Route 3", distance: 22.5, time: 45, fuel: 2.7, emissions: 27.5 },
  { name: "Route 4", distance: 11.2, time: 23, fuel: 1.4, emissions: 14.2 },
];

const monthlyTrendData = [
  { month: "Jan", distance: 4200, fuel: 540, emissions: 5620 },
  { month: "Feb", distance: 4350, fuel: 562, emissions: 5810 },
  { month: "Mar", distance: 4100, fuel: 527, emissions: 5460 },
  { month: "Apr", distance: 4550, fuel: 581, emissions: 6050 },
  { month: "May", distance: 4720, fuel: 605, emissions: 6280 },
  { month: "Jun", distance: 3950, fuel: 502, emissions: 5240 },
  { month: "Jul", distance: 3850, fuel: 493, emissions: 5120 },
  { month: "Aug", distance: 3950, fuel: 512, emissions: 5340 },
];

const routePerformanceData = [
  { name: "Route 1", distance: 18.3, time: 35, fuel: 2.2, emissions: 19.8 },
  { name: "Route 2", distance: 15.7, time: 30, fuel: 1.9, emissions: 17.1 },
  { name: "Route 3", distance: 22.5, time: 45, fuel: 2.7, emissions: 27.5 },
  { name: "Route 4", distance: 11.2, time: 23, fuel: 1.4, emissions: 14.2 },
];

// Add traffic incident data (moved from TrafficMap component)
const liveTrafficIncidents: TrafficIncident[] = [
  { 
    id: 1, 
    x: 15, 
    y: 25, 
    lat: 37.7869, 
    lng: -122.4000, 
    severity: "high", 
    type: "Major Accident",
    location: "I-95 Northbound, Exit 23",
    description: "Multiple vehicle collision blocking 2 lanes",
    duration: "2+ hours", 
    affectedRoutes: ["RT-1043", "RT-3842"] 
  },
  { 
    id: 2, 
    x: 40, 
    y: 50, 
    lat: 37.7749, 
    lng: -122.4194, 
    severity: "medium", 
    type: "Road Construction",
    location: "Main St & 5th Ave",
    description: "Lane closures due to utility work",
    duration: "3 days", 
    affectedRoutes: ["RT-5621", "RT-8954"] 
  },
  { 
    id: 3, 
    x: 75, 
    y: 35, 
    lat: 37.7529, 
    lng: -122.4270, 
    severity: "low", 
    type: "Lane Closure",
    location: "Highway 101, Mile 36",
    description: "Right shoulder closed for maintenance",
    duration: "6 hours", 
    affectedRoutes: ["RT-4567"] 
  },
  { 
    id: 4, 
    x: 60, 
    y: 65, 
    lat: 37.7900, 
    lng: -122.4330, 
    severity: "medium", 
    type: "Traffic Jam",
    location: "Downtown Bridge",
    description: "Heavy congestion due to rush hour",
    duration: "1 hour", 
    affectedRoutes: ["RT-7689"] 
  },
  { 
    id: 5, 
    x: 30, 
    y: 80, 
    lat: 37.7660, 
    lng: -122.4100, 
    severity: "high", 
    type: "Road Closure",
    location: "Westbound Freeway",
    description: "Full closure due to hazardous material spill",
    duration: "4 hours", 
    affectedRoutes: ["RT-2354", "RT-9812"] 
  },
];

// Create road segments with varying congestion levels
const liveTrafficRoads: TrafficRoad[] = [
  // Main horizontal roads with varying congestion
  { id: "h1", path: "M0,25 L100,25", congestion: "high" },
  { id: "h2", path: "M0,50 L100,50", congestion: "medium" },
  { id: "h3", path: "M0,75 L100,75", congestion: "low" },
  
  // Main vertical roads
  { id: "v1", path: "M25,0 L25,100", congestion: "medium" },
  { id: "v2", path: "M50,0 L50,100", congestion: "high" },
  { id: "v3", path: "M75,0 L75,100", congestion: "low" },
  
  // Secondary roads
  { id: "sh1", path: "M0,12.5 L100,12.5", congestion: "low" },
  { id: "sh2", path: "M0,37.5 L100,37.5", congestion: "medium" },
  { id: "sh3", path: "M0,62.5 L100,62.5", congestion: "high" },
  { id: "sh4", path: "M0,87.5 L100,87.5", congestion: "low" },
  
  { id: "sv1", path: "M12.5,0 L12.5,100", congestion: "medium" },
  { id: "sv2", path: "M37.5,0 L37.5,100", congestion: "low" },
  { id: "sv3", path: "M62.5,0 L62.5,100", congestion: "high" },
  { id: "sv4", path: "M87.5,0 L87.5,100", congestion: "medium" },
];

// Add automated traffic actions data
const trafficAutomatedActions = [
  { action: "Route RT-1043 rerouted", icon: "refresh", color: "blue", time: "2 minutes ago" },
  { action: "Route RT-3842 rerouted", icon: "refresh", color: "blue", time: "4 minutes ago" },
  { action: "ETA updated for 3 deliveries", icon: "clock", color: "amber", time: "7 minutes ago" },
  { action: "Driver notifications sent", icon: "user", color: "green", time: "12 minutes ago" },
];

// Add Live Traffic Map component directly in this file
interface LiveTrafficMapProps {
  incidents: TrafficIncident[];
  title: string;
  height?: string;
}

// Simple wrapper component that displays a map but uses GeoDistribution's implementation
function LiveTrafficMapComponent({ incidents, title, height = "300px" }: LiveTrafficMapProps) {
  // Use the GeoDistribution component which already implements Leaflet correctly
  return (
    <div className="flex flex-col space-y-2">
      <div className="relative" style={{ height }}>
        {/* GeoDistribution map */}
        <GeoDistribution height={height} />
        
        {/* Map title overlay */}
        <div className="absolute top-2 left-2 z-[500] bg-background/80 text-xs p-1 rounded">
          {title}
        </div>
        
        {/* Current time indicator */}
        <div className="absolute top-2 right-2 z-[500] bg-background/80 text-xs p-1 rounded">
          {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      
      {/* Legend for traffic conditions */}
      <div className="flex justify-between items-center text-xs px-1">
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
          <span>Low Impact</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-amber-500"></span>
          <span>Medium Impact</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="inline-block w-3 h-3 rounded-full bg-red-500"></span>
          <span>High Impact</span>
        </div>
      </div>
    </div>
  );
}

// Define a type for driver performance data
interface DriverPerformanceData {
  name: string;
  performance: number;
}

// Define a type for the performance data object with specific keys
type PerformanceAreaKey = 'overall' | 'fuelEfficiency' | 'onTimeDelivery' | 'customerRating';

const driverPerformanceData: Record<PerformanceAreaKey, DriverPerformanceData[]> = {
  overall: [
    { name: 'Alex K.', performance: 98.3 },
    { name: 'Sarah M.', performance: 97.8 },
    { name: 'David W.', performance: 96.2 },
    { name: 'Robert J.', performance: 82.4 },
    { name: 'Lisa T.', performance: 83.7 },
    { name: 'Mark P.', performance: 84.1 },
  ],
  fuelEfficiency: [
    { name: 'Alex K.', performance: 18.0 }, // in MPG
    { name: 'Sarah M.', performance: 17.5 },
    { name: 'David W.', performance: 17.0 },
    { name: 'Robert J.', performance: 14.0 },
    { name: 'Lisa T.', performance: 14.5 },
    { name: 'Mark P.', performance: 15.0 },
  ],
  onTimeDelivery: [
    { name: 'Alex K.', performance: 99 }, // in %
    { name: 'Sarah M.', performance: 98 },
    { name: 'David W.', performance: 97 },
    { name: 'Robert J.', performance: 88 },
    { name: 'Lisa T.', performance: 89 },
    { name: 'Mark P.', performance: 90 },
  ],
  customerRating: [
    { name: 'Alex K.', performance: 4.9 }, // on a 5.0 scale
    { name: 'Sarah M.', performance: 4.8 },
    { name: 'David W.', performance: 4.7 },
    { name: 'Robert J.', performance: 4.2 },
    { name: 'Lisa T.', performance: 4.3 },
    { name: 'Mark P.', performance: 4.4 },
  ],
};

export default function RouteOptimization() {
  const [location] = useLocation();
  const [routes, setRoutes] = useState({
    active: [...activeRoutes],
    scheduled: [...scheduledRoutes],
    completed: [...completedRoutes],
    templates: [...routeTemplates]
  });
  
  const [selectedRoute, setSelectedRoute] = useState<RouteData | undefined>(undefined);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("active");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<RouteSummary | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [routeType, setRouteType] = useState("all");
  const [pageSize, setPageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  
  // For in-page navigation
  const [mainTabValue, setMainTabValue] = useState(getTabFromUrl);

  // Get tab from URL query parameter
  function getTabFromUrl() {
    const path = location;
    if (path.includes("/routes/traffic")) {
      return "traffic";
    } else if (path.includes("/routes/insights")) {
      return "insights";
    } else if (path.includes("/routes/optimization")) {
      return "optimization";
    } else if (path.includes("/routes/management")) {
      return "management";
    } else if (path === "/routes") {
      return "management";
    } else {
      // Default to management
      return "management";
    }
  }

  // Update tab value whenever location changes (handles sidebar navigation)
  useEffect(() => {
    const newTabValue = getTabFromUrl();
    setMainTabValue(newTabValue);
    
    // Ensure URL is consistent with the tab
    const currentPath = window.location.pathname;
    if (newTabValue === "optimization" && !currentPath.includes("/routes/optimization")) {
      window.history.pushState({}, "", "/routes/optimization");
    } else if (newTabValue === "traffic" && !currentPath.includes("/routes/traffic")) {
      window.history.pushState({}, "", "/routes/traffic");
    } else if (newTabValue === "insights" && !currentPath.includes("/routes/insights")) {
      window.history.pushState({}, "", "/routes/insights");
    } else if (newTabValue === "management" && !currentPath.includes("/routes/management")) {
      window.history.pushState({}, "", "/routes/management");
    }
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    // Set the tab state
    setMainTabValue(value);
    
    // Update URL without full page reload using path-based navigation
    if (value === "optimization") {
      window.history.pushState({}, "", "/routes/optimization");
    } else if (value === "management") {
      window.history.pushState({}, "", "/routes/management");
    } else if (value === "traffic") {
      window.history.pushState({}, "", "/routes/traffic");
    } else if (value === "insights") {
      window.history.pushState({}, "", "/routes/insights");
    }
  };

  // Get the current page name for the heading
  const getCurrentPageName = () => {
    switch (mainTabValue) {
      case "optimization": return "Route Optimization";
      case "management": return "Route Management";
      case "traffic": return "Traffic Analysis";
      case "insights": return "Route Insights";
      default: return "Routes";
    }
  };

  const fetchSummaryData = async () => {
    try {
      setLoading(true);
      const data = await routeService.getRouteSummary();
      setSummary(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch route summary');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchSummaryData();
    
    // Listen for popstate events (back/forward navigation)
    const handlePopState = () => {
      // When browser back/forward is used, we need to update our tab state
      // based on the new URL
      setMainTabValue(getTabFromUrl());
    };
    
    // Listen for URL changes to update the active tab
    window.addEventListener("popstate", handlePopState);
    
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  
  // Reset to first page when tab, search query, or route type changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchQuery, routeType]);
  
  // Handle pagination page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Handle viewing route details
  const handleViewDetails = (route: RouteData) => {
    setSelectedRoute(route);
    setIsDetailsModalOpen(true);
  };
  
  // Handle creating a new route
  const handleAddRoute = (routeData: RouteData) => {
    setRoutes({
      ...routes,
      scheduled: [routeData, ...routes.scheduled]
    });
  };
  
  // Handle starting a scheduled route
  const handleStartRoute = (route: RouteData) => {
    const updatedRoute = {
      ...route,
      status: "active",
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completionRate: 0
    };
    
    setRoutes({
      ...routes,
      active: [updatedRoute, ...routes.active],
      scheduled: routes.scheduled.filter(r => r.id !== route.id)
    });
  };
  
  // Handle completing an active route
  const handleCompleteRoute = (route: RouteData) => {
    const updatedRoute = {
      ...route,
      status: "completed",
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completionRate: 100,
      actualDuration: Math.floor(route.duration * (Math.random() > 0.5 ? (1 + Math.random() * 0.2) : (1 - Math.random() * 0.15)))
    };
    
    setRoutes({
      ...routes,
      completed: [updatedRoute, ...routes.completed],
      active: routes.active.filter(r => r.id !== route.id)
    });
  };
  
  // Handle duplicate route
  const handleDuplicateRoute = (route: RouteData) => {
    const newRoute = {
      ...route,
      id: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
      name: `${route.name} (Copy)`,
      status: "scheduled",
      departureDate: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
    };
    
    setRoutes({
      ...routes,
      scheduled: [newRoute, ...routes.scheduled]
    });
  };
  
  // Handle delete route
  const handleDeleteRoute = (route: RouteData) => {
    if (route.status === "active" || route.status === "in_progress") {
      setRoutes({
        ...routes,
        active: routes.active.filter(r => r.id !== route.id)
      });
    } else if (route.status === "scheduled" || route.status === "planned" || route.status === "optimized") {
      setRoutes({
        ...routes,
        scheduled: routes.scheduled.filter(r => r.id !== route.id)
      });
    } else if (route.status === "completed") {
      setRoutes({
        ...routes,
        completed: routes.completed.filter(r => r.id !== route.id)
      });
    } else if (route.status === "template") {
      setRoutes({
        ...routes,
        templates: routes.templates.filter(r => r.id !== route.id)
      });
    }
  };

  // Filter routes based on search query
  const filterRoutes = (routeList: RouteData[]) => {
    // First filter by search query
    let filteredList = routeList;
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filteredList = filteredList.filter(route => 
        route.id.toLowerCase().includes(query) ||
        route.name.toLowerCase().includes(query) ||
        route.driver.toLowerCase().includes(query) ||
        route.vehicle.toLowerCase().includes(query)
      );
    }
    
    // Then filter by route type
    if (routeType !== 'all') {
      filteredList = filteredList.filter(route => route.routeType === routeType);
    }
    
    return filteredList;
  };

  // Get the appropriate filtered routes based on current tab
  const getFilteredRoutes = () => {
    switch (activeTab) {
      case "active": return filterRoutes(routes.active);
      case "scheduled": return filterRoutes(routes.scheduled);
      case "completed": return filterRoutes(routes.completed);
      case "templates": return filterRoutes(routes.templates);
      default: return [];
    }
  };

  const filteredRoutes = getFilteredRoutes();
  const totalPages = Math.max(1, Math.ceil(filteredRoutes.length / pageSize));
  const currentRoutes = filteredRoutes.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalRoutes = activeTab === "active" ? routes.active.length : 
                      activeTab === "scheduled" ? routes.scheduled.length :
                      activeTab === "completed" ? routes.completed.length :
                      routes.templates.length;

  // New states for traffic data
  const [trafficIncidents, setTrafficIncidents] = useState<TrafficIncident[]>(liveTrafficIncidents);
  const [filteredIncidents, setFilteredIncidents] = useState<TrafficIncident[]>(liveTrafficIncidents);
  const [currentIncidentPage, setCurrentIncidentPage] = useState(1);
  const [trafficRoads, setTrafficRoads] = useState<TrafficRoad[]>(liveTrafficRoads);
  const incidentsPerPage = 3;
  
  // State for performance tabs/dropdown
  const [performanceTab, setPerformanceTab] = useState('overall');
  
  // Filter incidents function
  const filterIncidentsBySeverity = (severity: IncidentSeverity | 'all') => {
    if (severity === 'all') {
      setFilteredIncidents(trafficIncidents);
    } else {
      setFilteredIncidents(trafficIncidents.filter(incident => incident.severity === severity));
    }
    setCurrentIncidentPage(1);
  };
  
  // Calculate current incidents to display
  const indexOfLastIncident = currentIncidentPage * incidentsPerPage;
  const indexOfFirstIncident = indexOfLastIncident - incidentsPerPage;
  const currentIncidents = filteredIncidents.slice(indexOfFirstIncident, indexOfLastIncident);
  
  // Function to generate real geographic coordinates from SVG path data
  const generateCoordinatesFromPath = (path: string, id: string): Array<{lat: number, lng: number}> => {
    // Base coordinates (San Francisco area)
    const baseLatitude = 37.7749;
    const baseLongitude = -122.4194;
    
    // Parse the path to extract coordinates
    // Example path format: "M0,25 L100,25" or "M25,0 L25,100"
    const coordinates: Array<{lat: number, lng: number}> = [];
    
    try {
      // Simple parser for M (move to) and L (line to) commands in SVG path
      const parts = path.split(' ');
      
      for (const part of parts) {
        if (part.startsWith('M') || part.startsWith('L')) {
          const coords = part.substring(1).split(',').map(Number);
          if (coords.length === 2) {
            // Convert the 0-100 range to a small area on the map
            // Scale factor determines the size of the area
            const scaleFactor = 0.002;
            const latOffset = ((coords[1] / 100) - 0.5) * scaleFactor * 10;
            const lngOffset = ((coords[0] / 100) - 0.5) * scaleFactor * 10;
            
            coordinates.push({
              lat: baseLatitude + latOffset,
              lng: baseLongitude + lngOffset
            });
          }
        }
      }
      
      // If it's a specific type of road, add some randomness to make it look more realistic
      if (id.startsWith('h')) {
        // Horizontal roads can have slight north-south variations
        coordinates.forEach(coord => {
          coord.lat += (Math.random() - 0.5) * 0.0005;
        });
      } else if (id.startsWith('v')) {
        // Vertical roads can have slight east-west variations
        coordinates.forEach(coord => {
          coord.lng += (Math.random() - 0.5) * 0.0005;
        });
      }
      
      // For longer roads, add some intermediate points to make them curve naturally
      if (coordinates.length === 2) {
        const start = coordinates[0];
        const end = coordinates[1];
        const newCoords: Array<{lat: number, lng: number}> = [start];
        
        // Add 1-3 intermediate points
        const pointCount = Math.floor(Math.random() * 3) + 1;
        for (let i = 1; i <= pointCount; i++) {
          const ratio = i / (pointCount + 1);
          const lat = start.lat + (end.lat - start.lat) * ratio;
          const lng = start.lng + (end.lng - start.lng) * ratio;
          
          // Add some randomness to the intermediate points
          const jitter = 0.0003;
          newCoords.push({
            lat: lat + (Math.random() - 0.5) * jitter,
            lng: lng + (Math.random() - 0.5) * jitter
          });
        }
        
        newCoords.push(end);
        return newCoords;
      }
    } catch (e) {
      console.error("Failed to parse path:", path);
      // Return a fallback if parsing fails
      return [
        { lat: baseLatitude, lng: baseLongitude },
        { lat: baseLatitude + 0.01, lng: baseLongitude + 0.01 }
      ];
    }
    
    // If we don't have at least 2 points, return a default line
    if (coordinates.length < 2) {
      return [
        { lat: baseLatitude, lng: baseLongitude },
        { lat: baseLatitude + 0.01, lng: baseLongitude + 0.01 }
      ];
    }
    
    return coordinates;
  };
  
  // Function to refresh traffic data (simulated)
  const refreshTrafficData = () => {
    // In a real app, this would fetch fresh data from an API
    // For now, we'll just simulate new traffic data
    
    // Generate a random traffic incident (simulate a new detection)
    const newIncident: TrafficIncident = {
      id: Math.floor(Math.random() * 1000) + 100,
      x: Math.floor(Math.random() * 100),
      y: Math.floor(Math.random() * 100),
      lat: 37.7749 + (Math.random() - 0.5) * 0.05,
      lng: -122.4194 + (Math.random() - 0.5) * 0.05,
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as IncidentSeverity,
      type: ["Traffic Congestion", "Minor Accident", "Vehicle Breakdown", "Road Work", "Weather Impact"][Math.floor(Math.random() * 5)],
      location: ["Market Street", "Mission District", "Financial District", "Downtown", "Embarcadero"][Math.floor(Math.random() * 5)],
      duration: `${Math.floor(Math.random() * 3) + 1} hours`,
      affectedRoutes: [`RT-${Math.floor(Math.random() * 9000) + 1000}`]
    };
    
    // Simulate some incidents resolving and new ones appearing
    const updatedIncidents = [...trafficIncidents];
    
    // 20% chance to remove a random incident (simulate resolution)
    if (Math.random() < 0.2 && updatedIncidents.length > 3) {
      const indexToRemove = Math.floor(Math.random() * updatedIncidents.length);
      updatedIncidents.splice(indexToRemove, 1);
    }
    
    // Always add one new incident to show activity
    updatedIncidents.push(newIncident);
    
    // Update the state with new traffic data
    setTrafficIncidents(updatedIncidents);
    setFilteredIncidents(updatedIncidents);
  };
  
  // State for selected performance area in dropdown
  const [performanceArea, setPerformanceArea] = useState<PerformanceAreaKey>('overall');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Route Management System</h1>
          <div className="flex items-center mt-2 text-sm text-muted-foreground">
            <span>Current section: </span>
            <Badge className="ml-2">
              {getCurrentPageName()}
            </Badge>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchSummaryData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Summary Cards - Different for each tab */}
      {summary && (
        <>
          {/* Optimization Tab KPIs */}
          {mainTabValue === "optimization" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{summary.totalRoutes}</div>
                  <div className="flex items-center">
                    <Route className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">All planned routes</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">{summary.activeRoutes}</div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{Math.round((summary.activeRoutes / summary.totalRoutes) * 100)}% currently active</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Completed Routes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">{summary.completedRoutes}</div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">{Math.round((summary.completedRoutes / summary.totalRoutes) * 100)}% completion rate</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Distance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">{summary.averageRouteDistance} mi</div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Total: {summary.totalDistance.toLocaleString()} miles</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Management Tab KPIs */}
          {mainTabValue === "management" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Route Templates</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">{routes.templates.length}</div>
                  <div className="flex items-center">
                    <Copy className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Reusable route templates</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Schedule Adherence</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">92%</div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Routes following schedule</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Driver Assignments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">26</div>
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Drivers currently assigned</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Vehicle Utilization</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">87%</div>
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Fleet capacity utilization</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Traffic Tab KPIs */}
          {mainTabValue === "traffic" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Traffic Congestion</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">42%</div>
                  <div className="flex items-center">
                    <TrafficCone className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average urban congestion</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Speed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">34 mph</div>
                  <div className="flex items-center">
                    <LineChart className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average route speed</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Delay Impact</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">+18%</div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Added time from traffic</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Rerouting Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-500">127</div>
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Real-time route adjustments</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
          
          {/* Insights Tab KPIs */}
          {mainTabValue === "insights" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Efficiency Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">86.3</div>
                  <div className="flex items-center">
                    <Activity className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Overall system efficiency</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Cost Per Mile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-500">$1.24</div>
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Average operational cost</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-amber-500">6.8 mpg</div>
                  <div className="flex items-center">
                    <FuelIcon className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Fleet average consumption</p>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">CO₂ Reduction</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">-12%</div>
                  <div className="flex items-center">
                    <Wind className="h-4 w-4 mr-1 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">YoY emissions improvement</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}

      {/* Main Tabs Navigation */}
      <Tabs value={mainTabValue} onValueChange={handleTabChange} className="mb-8 space-y-6">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="management" className="flex items-center">
            <MapIcon className="h-4 w-4 mr-2" />
            Management
          </TabsTrigger>
          <TabsTrigger value="optimization" className="flex items-center">
            <Route className="h-4 w-4 mr-2" />
            Optimization
          </TabsTrigger>
          <TabsTrigger value="traffic" className="flex items-center">
            <TrafficCone className="h-4 w-4 mr-2" />
            Traffic
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            Insights
          </TabsTrigger>
        </TabsList>

        {/* Management Tab */}
        <TabsContent value="management" className="space-y-4">
          <Card className="mb-6 p-0">
            <CardHeader className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <CardTitle>
                    Route Management
                  </CardTitle>
                  <CardDescription>Oversee and control all delivery routes</CardDescription>
                </div>
                <Button variant="outline" onClick={() => setIsRouteModalOpen(true)} className="border-black dark:border-white hover:bg-black/10 dark:hover:bg-white/10">
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Route
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Route Optimization Table */}
              <div>

                <div className="p-4 pt-6 bg-white dark:bg-[rgb(9,9,11)]">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-2">
                      <Select value={activeTab} onValueChange={setActiveTab}>
                        <SelectTrigger className="w-[180px] bg-background">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">
                            <div className="flex items-center">
                              <div className="mr-2 h-2 w-2 rounded-full bg-green-500" />
                              Active Routes
                              <Badge variant="outline" className="ml-2 bg-background">
                                {routes.active.length}
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="scheduled">
                            <div className="flex items-center">
                              <div className="mr-2 h-2 w-2 rounded-full bg-gray-400" />
                              Scheduled Routes
                              <Badge variant="outline" className="ml-2 bg-background">
                                {routes.scheduled.length}
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="completed">
                            <div className="flex items-center">
                              <div className="mr-2 h-2 w-2 rounded-full bg-gray-500" />
                              Completed Routes
                              <Badge variant="outline" className="ml-2 bg-background">
                                {routes.completed.length}
                              </Badge>
                            </div>
                          </SelectItem>
                          <SelectItem value="templates">
                            <div className="flex items-center">
                              <div className="mr-2 h-2 w-2 rounded-full bg-gray-600" />
                              Route Templates
                              <Badge variant="outline" className="ml-2 bg-background">
                                {routes.templates.length}
                              </Badge>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={routeType} onValueChange={setRouteType}>
                        <SelectTrigger className="w-[180px] bg-background">
                          <SelectValue placeholder="Filter by type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Route Types</SelectItem>
                          <SelectItem value="delivery">Delivery Routes</SelectItem>
                          <SelectItem value="pickup">Pickup Routes</SelectItem>
                          <SelectItem value="transfer">Transfer Routes</SelectItem>
                          <SelectItem value="return">Return Routes</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      <div className="relative w-[240px]">
                        <Input 
                          placeholder="Search routes..." 
                          className="pl-8 bg-background"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground whitespace-nowrap">Rows per page</span>
                        <Select
                          value={pageSize.toString()}
                          onValueChange={(value) => setPageSize(parseInt(value))}
                        >
                          <SelectTrigger className="h-9 w-[70px]">
                            <SelectValue placeholder={pageSize.toString()} />
                          </SelectTrigger>
                          <SelectContent>
                            {[5, 10, 15, 20, 50].map((size) => (
                              <SelectItem key={size} value={size.toString()}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <Button variant="outline" size="icon" className="bg-background hover:bg-black/10 dark:hover:bg-white/10">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Route Optimization Table */}
                <div className="bg-white dark:bg-[rgb(9,9,11)] transition-colors">
                  {activeTab === "active" && (
                    <>
                      <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                        <RouteTable 
                          routes={currentRoutes}
                          status="active"
                          pageSize={pageSize}
                          onPageSizeChange={setPageSize}
                          onViewDetails={handleViewDetails}
                          onComplete={handleCompleteRoute}
                          onDuplicate={handleDuplicateRoute}
                          onDelete={handleDeleteRoute}
                        />
                      </div>
                      <div className="pt-2 pb-4 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-sm text-muted-foreground">
                            {currentRoutes.length === 0 ? (
                              <span>No routes found</span>
                            ) : (
                              <>
                                Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, filteredRoutes.length)}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredRoutes.length)}</span> of <span className="font-medium">{filteredRoutes.length}</span> {filteredRoutes.length === 1 ? 'route' : 'routes'}
                                {searchQuery && <span> for "<span className="font-medium">{searchQuery}</span>"</span>}
                              </>
                            )}
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {totalPages <= 5 ? (
                                // Show all pages if 5 or fewer
                                [...Array(totalPages)].map((_, i) => (
                                  <Button
                                    key={`page-${i+1}`}
                                    variant={currentPage === i+1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(i+1)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${i+1}`}
                                    aria-current={currentPage === i+1 ? "page" : undefined}
                                  >
                                    {i+1}
                                  </Button>
                                ))
                              ) : (
                                // Show limited pages with ellipsis
                                <>
                                  <Button
                                    variant={currentPage === 1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(1)}
                                    className="h-8 w-8"
                                    aria-label="Page 1"
                                  >
                                    1
                                  </Button>
                                  
                                  {currentPage > 3 && <span className="mx-1">...</span>}
                                  
                                  {currentPage > 2 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage - 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage - 1}`}
                                    >
                                      {currentPage - 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage !== 1 && currentPage !== totalPages && (
                                    <Button
                                      variant="default"
                                      size="icon"
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage}`}
                                      aria-current="page"
                                    >
                                      {currentPage}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 1 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage + 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage + 1}`}
                                    >
                                      {currentPage + 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                                  
                                  <Button
                                    variant={currentPage === totalPages ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(totalPages)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${totalPages}`}
                                  >
                                    {totalPages}
                                  </Button>
                                </>
                              )}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex justify-end">

                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeTab === "scheduled" && (
                    <>
                      <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                        <RouteTable 
                          routes={currentRoutes}
                          status="scheduled"
                          pageSize={pageSize}
                          onPageSizeChange={setPageSize}
                          onViewDetails={handleViewDetails}
                          onStart={handleStartRoute}
                          onEdit={() => {}}
                          onOptimize={() => {}}
                          onDuplicate={handleDuplicateRoute}
                          onDelete={handleDeleteRoute}
                        />
                      </div>
                      <div className="pt-2 pb-4 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-sm text-muted-foreground">
                            {currentRoutes.length === 0 ? (
                              <span>No routes found</span>
                            ) : (
                              <>
                                Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, filteredRoutes.length)}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredRoutes.length)}</span> of <span className="font-medium">{filteredRoutes.length}</span> {filteredRoutes.length === 1 ? 'route' : 'routes'}
                                {searchQuery && <span> for "<span className="font-medium">{searchQuery}</span>"</span>}
                              </>
                            )}
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {totalPages <= 5 ? (
                                // Show all pages if 5 or fewer
                                [...Array(totalPages)].map((_, i) => (
                                  <Button
                                    key={`page-${i+1}`}
                                    variant={currentPage === i+1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(i+1)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${i+1}`}
                                    aria-current={currentPage === i+1 ? "page" : undefined}
                                  >
                                    {i+1}
                                  </Button>
                                ))
                              ) : (
                                // Show limited pages with ellipsis
                                <>
                                  <Button
                                    variant={currentPage === 1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(1)}
                                    className="h-8 w-8"
                                    aria-label="Page 1"
                                  >
                                    1
                                  </Button>
                                  
                                  {currentPage > 3 && <span className="mx-1">...</span>}
                                  
                                  {currentPage > 2 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage - 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage - 1}`}
                                    >
                                      {currentPage - 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage !== 1 && currentPage !== totalPages && (
                                    <Button
                                      variant="default"
                                      size="icon"
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage}`}
                                      aria-current="page"
                                    >
                                      {currentPage}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 1 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage + 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage + 1}`}
                                    >
                                      {currentPage + 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                                  
                                  <Button
                                    variant={currentPage === totalPages ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(totalPages)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${totalPages}`}
                                  >
                                    {totalPages}
                                  </Button>
                                </>
                              )}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex justify-end">

                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeTab === "completed" && (
                    <>
                      <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                        <RouteTable 
                          routes={currentRoutes}
                          status="completed"
                          pageSize={pageSize}
                          onPageSizeChange={setPageSize}
                          onViewDetails={handleViewDetails}
                          onDuplicate={handleDuplicateRoute}
                          onDelete={handleDeleteRoute}
                        />
                      </div>
                      <div className="pt-2 pb-4 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-sm text-muted-foreground">
                            {currentRoutes.length === 0 ? (
                              <span>No routes found</span>
                            ) : (
                              <>
                                Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, filteredRoutes.length)}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredRoutes.length)}</span> of <span className="font-medium">{filteredRoutes.length}</span> {filteredRoutes.length === 1 ? 'route' : 'routes'}
                                {searchQuery && <span> for "<span className="font-medium">{searchQuery}</span>"</span>}
                              </>
                            )}
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {totalPages <= 5 ? (
                                // Show all pages if 5 or fewer
                                [...Array(totalPages)].map((_, i) => (
                                  <Button
                                    key={`page-${i+1}`}
                                    variant={currentPage === i+1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(i+1)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${i+1}`}
                                    aria-current={currentPage === i+1 ? "page" : undefined}
                                  >
                                    {i+1}
                                  </Button>
                                ))
                              ) : (
                                // Show limited pages with ellipsis
                                <>
                                  <Button
                                    variant={currentPage === 1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(1)}
                                    className="h-8 w-8"
                                    aria-label="Page 1"
                                  >
                                    1
                                  </Button>
                                  
                                  {currentPage > 3 && <span className="mx-1">...</span>}
                                  
                                  {currentPage > 2 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage - 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage - 1}`}
                                    >
                                      {currentPage - 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage !== 1 && currentPage !== totalPages && (
                                    <Button
                                      variant="default"
                                      size="icon"
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage}`}
                                      aria-current="page"
                                    >
                                      {currentPage}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 1 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage + 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage + 1}`}
                                    >
                                      {currentPage + 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                                  
                                  <Button
                                    variant={currentPage === totalPages ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(totalPages)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${totalPages}`}
                                  >
                                    {totalPages}
                                  </Button>
                                </>
                              )}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex justify-end">

                          </div>
                        </div>
                      </div>
                    </>
                  )}
                  
                  {activeTab === "templates" && (
                    <>
                      <div className="max-h-[calc(100vh-32rem)] overflow-y-auto">
                        <RouteTable 
                          routes={currentRoutes}
                          status="template"
                          pageSize={pageSize}
                          onPageSizeChange={setPageSize}
                          onViewDetails={handleViewDetails}
                          onEdit={() => {}}
                          onOptimize={() => {}}
                          onDuplicate={handleDuplicateRoute}
                          onDelete={handleDeleteRoute}
                        />
                      </div>
                      <div className="pt-2 pb-4 px-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1 text-sm text-muted-foreground">
                            {currentRoutes.length === 0 ? (
                              <span>No routes found</span>
                            ) : (
                              <>
                                Showing <span className="font-medium">{Math.min((currentPage - 1) * pageSize + 1, filteredRoutes.length)}</span> to <span className="font-medium">{Math.min(currentPage * pageSize, filteredRoutes.length)}</span> of <span className="font-medium">{filteredRoutes.length}</span> {filteredRoutes.length === 1 ? 'route' : 'routes'}
                                {searchQuery && <span> for "<span className="font-medium">{searchQuery}</span>"</span>}
                              </>
                            )}
                          </div>
                          
                          <div className="flex-1 flex justify-center">
                            <div className="flex items-center gap-1">
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="First page"
                              >
                                <ChevronsLeft className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="h-8 w-8"
                                aria-label="Previous page"
                              >
                                <ChevronLeft className="h-4 w-4" />
                              </Button>
                              
                              {totalPages <= 5 ? (
                                // Show all pages if 5 or fewer
                                [...Array(totalPages)].map((_, i) => (
                                  <Button
                                    key={`page-${i+1}`}
                                    variant={currentPage === i+1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(i+1)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${i+1}`}
                                    aria-current={currentPage === i+1 ? "page" : undefined}
                                  >
                                    {i+1}
                                  </Button>
                                ))
                              ) : (
                                // Show limited pages with ellipsis
                                <>
                                  <Button
                                    variant={currentPage === 1 ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(1)}
                                    className="h-8 w-8"
                                    aria-label="Page 1"
                                  >
                                    1
                                  </Button>
                                  
                                  {currentPage > 3 && <span className="mx-1">...</span>}
                                  
                                  {currentPage > 2 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage - 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage - 1}`}
                                    >
                                      {currentPage - 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage !== 1 && currentPage !== totalPages && (
                                    <Button
                                      variant="default"
                                      size="icon"
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage}`}
                                      aria-current="page"
                                    >
                                      {currentPage}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 1 && (
                                    <Button
                                      variant="outline"
                                      size="icon"
                                      onClick={() => handlePageChange(currentPage + 1)}
                                      className="h-8 w-8"
                                      aria-label={`Page ${currentPage + 1}`}
                                    >
                                      {currentPage + 1}
                                    </Button>
                                  )}
                                  
                                  {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                                  
                                  <Button
                                    variant={currentPage === totalPages ? "default" : "outline"}
                                    size="icon"
                                    onClick={() => handlePageChange(totalPages)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${totalPages}`}
                                  >
                                    {totalPages}
                                  </Button>
                                </>
                              )}
                              
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Next page"
                              >
                                <ChevronRight className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                                className="h-8 w-8"
                                aria-label="Last page"
                              >
                                <ChevronsRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="flex-1 flex justify-end">

                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-6 p- border-none">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 my-6">
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Resource Allocation</CardTitle>
                  <CardDescription>Driver and vehicle assignment status</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Drivers Assigned</span>
                      <span className="text-sm font-medium">26/32</span>
                    </div>
                    <Progress value={81} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>81% allocated</span>
                      <span>6 available</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Vehicles Deployed</span>
                      <span className="text-sm font-medium">42/48</span>
                    </div>
                    <Progress value={87.5} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>87.5% allocated</span>
                      <span>6 available</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Load Capacity Utilized</span>
                      <span className="text-sm font-medium">74%</span>
                    </div>
                    <Progress value={74} className="h-2" />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Average across fleet</span>
                      <span>26% remaining</span>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Driver Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">Active: 26</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                        <span className="text-sm">On Break: 3</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Available: 6</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm">Off Duty: 2</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Vehicle Status</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                        <span className="text-sm">In Service: 42</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm">Available: 6</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                        <span className="text-sm">Maintenance: 3</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-gray-500"></div>
                        <span className="text-sm">Inactive: 1</span>
                      </div>
                    </div>
                  </div>

                   {/* New Vehicle Utilization Metrics */}
                   <div className="space-y-4">
                    <h4 className="text-sm font-medium">Vehicle Utilization Metrics</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground">Average Fuel Efficiency</div>
                        <div className="text-xl font-bold mt-1">15 MPG</div>
                        <div className="text-xs text-muted-foreground mt-1">Across all vehicles</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground">Maintenance Frequency</div>
                        <div className="text-xl font-bold mt-1">Every 5,000 miles</div>
                        <div className="text-xs text-muted-foreground mt-1">Standard for fleet</div>
                      </div>
                    </div>
                  </div>

                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Schedule Compliance</CardTitle>
                  <CardDescription>Delivery performance metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="pt-2 pb-4">
                      <div className="rounded-full h-32 w-32 mx-auto relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="h-32 w-32" viewBox="0 0 100 100">
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              fill="none" 
                              stroke="currentColor" 
                              className="text-muted stroke-1" 
                            />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              fill="none" 
                              stroke="currentColor" 
                              className="text-green-500 stroke-2" 
                              strokeDasharray="283" 
                              strokeDashoffset="23" 
                              transform="rotate(-90 50 50)" 
                            />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">92%</div>
                          <div className="text-xs text-muted-foreground mt-1">ON-TIME DELIVERY</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="text-sm font-medium">Delivery Status Breakdown</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-sm">On Time</span>
                          </div>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                            <span className="text-sm">Delayed (&lt; 30min)</span>
                          </div>
                          <span className="text-sm font-medium">6%</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-red-500"></div>
                            <span className="text-sm">Late (&gt; 30min)</span>
                          </div>
                          <span className="text-sm font-medium">2%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-2" />
                  
                  <div className="space-y-3">
                    <h4 className="text-sm font-medium">Performance Trends</h4>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Weekly Trend</span>
                          <span className="text-sm text-green-500">+2.3%</span>
                        </div>
                        <div className="h-1 bg-muted rounded-full grid grid-cols-7 gap-1">
                          <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                          <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                          <div className="bg-amber-500 rounded-full" style={{ height: "4px" }}></div>
                          <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                          <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                          <div className="bg-amber-500 rounded-full" style={{ height: "4px" }}></div>
                          <div className="bg-green-500 rounded-full" style={{ height: "4px" }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Monthly Average</span>
                          <span className="text-sm text-green-500">91.2%</span>
                        </div>
                        <Progress value={91.2} className="h-1" />
                      </div>

                      {/* New Year-to-Date Performance */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Year-to-Date Performance</span>
                          <span className="text-sm text-green-500">89.5%</span>
                        </div>
                        <Progress value={89.5} className="h-1" />
                      </div>

                    </div>
                  </div>
                  
                  <div className="p-3 rounded-md bg-muted/30 mt-2">
                    <h4 className="text-sm font-medium mb-2">Service Level Agreement</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex justify-between">
                        <span>Target SLA:</span>
                        <span>95% on-time delivery</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Current Performance:</span>
                        <span className="text-amber-500">92% (-3%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Action Required:</span>
                        <span>Route optimization</span>
                      </div>
                    </div>
                  </div>

                  {/* New Schedule Compliance Section */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Schedule Compliance</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground">On-Time Schedule Adherence</div>
                        <div className="text-xl font-bold mt-1">88%</div>
                        <div className="text-xs text-muted-foreground mt-1">Based on last month</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-md">
                        <div className="text-xs text-muted-foreground">Average Delay</div>
                        <div className="text-xl font-bold mt-1">12 mins</div>
                        <div className="text-xs text-muted-foreground mt-1">Across all routes</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="col-span-1">
                <CardHeader>
                  <CardTitle>Route Template Analytics</CardTitle>
                  <CardDescription>Template usage and effectiveness</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-md bg-muted/30">
                        <div className="text-sm text-muted-foreground">Total Templates</div>
                        <div className="text-2xl font-bold">{routes.templates.length}</div>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30">
                        <div className="text-sm text-muted-foreground">Usage Rate</div>
                        <div className="text-2xl font-bold">76%</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Top Templates by Usage</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Downtown Loop</span>
                            <span className="text-sm font-medium">42 uses</span>
                          </div>
                          <Progress value={84} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">North District</span>
                            <span className="text-sm font-medium">36 uses</span>
                          </div>
                          <Progress value={72} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">South District</span>
                            <span className="text-sm font-medium">28 uses</span>
                          </div>
                          <Progress value={56} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">East Suburban</span>
                            <span className="text-sm font-medium">22 uses</span>
                          </div>
                          <Progress value={44} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <Separator className="my-2" />
                    
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Template Efficiency</h4>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Time Saved</span>
                            <span className="text-sm font-medium text-green-500">+18%</span>
                          </div>
                          <Progress value={18} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Fuel Reduction</span>
                            <span className="text-sm font-medium text-green-500">+12%</span>
                          </div>
                          <Progress value={12} className="h-2" />
                        </div>
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm">Error Reduction</span>
                            <span className="text-sm font-medium text-green-500">+24%</span>
                          </div>
                          <Progress value={24} className="h-2" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-3 rounded-md bg-muted/30">
                      <h4 className="text-sm font-medium mb-2">Recommendations</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        <li className="flex items-start">
                          <div className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0"></div>
                          <span>Create 3 new templates for West Region routes</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0"></div>
                          <span>Optimize Downtown Loop for rush hour traffic</span>
                        </li>
                        <li className="flex items-start">
                          <div className="h-3 w-3 rounded-full bg-blue-500 mt-0.5 mr-2 flex-shrink-0"></div>
                          <span>Review and update 4 underutilized templates</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* Optimization Tab (main routes page) */}
        <TabsContent value="optimization" className="space-y-4">
          {/* Route Optimization Tools & Analytics */}
          <Card className="border-none mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-0">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      <CardTitle>Route Optimization Engine</CardTitle>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-8">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                      </Button>
                      <Button variant="outline" size="sm" className="h-8">
                        <Save className="h-4 w-4 mr-2" />
                        Save Settings
                      </Button>
                      <Button size="sm" className="h-8">
                        <Play className="h-4 w-4 mr-2" />
                        Run Optimization
                      </Button>
                    </div>
                  </div>
                  <CardDescription>
                    Advanced route optimization with machine learning algorithms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Optimization Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="optimization-strategy">Optimization Strategy</Label>
                        <Select defaultValue="balanced">
                          <SelectTrigger id="optimization-strategy">
                            <SelectValue placeholder="Select strategy" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="distance">Minimize Distance (Dijkstra's Algorithm)</SelectItem>
                            <SelectItem value="time">Minimize Time (A* Search)</SelectItem>
                            <SelectItem value="fuel">Minimize Fuel (Genetic Algorithm)</SelectItem>
                            <SelectItem value="balanced">Balanced (Multi-Objective Optimization)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="vehicle-type">Vehicle Type</Label>
                        <Select defaultValue="box-truck">
                          <SelectTrigger id="vehicle-type">
                            <SelectValue placeholder="Select vehicle" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delivery-van">Delivery Van (2.5T)</SelectItem>
                            <SelectItem value="box-truck">26ft Box Truck (12T)</SelectItem>
                            <SelectItem value="semi-truck">53ft Semi-Truck (40T)</SelectItem>
                            <SelectItem value="electric-van">Electric Delivery Van (3T)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Basic Parameters */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="max-stops">Maximum Stops</Label>
                        <Input id="max-stops" type="number" defaultValue="10" min="1" max="50" />
                        <p className="text-xs text-muted-foreground">Capacity: 50 stops per route</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="max-distance">Maximum Distance (mi)</Label>
                        <Input id="max-distance" type="number" defaultValue="500" min="1" max="2000" />
                        <p className="text-xs text-muted-foreground">Range: 1-2000 miles</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="departure-time">Departure Time</Label>
                        <Input id="departure-time" type="time" defaultValue="08:00" />
                        <p className="text-xs text-muted-foreground">24-hour format</p>
                      </div>
                    </div>
                    
                    {/* Optimization Constraints */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Optimization Constraints</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="time-window">Time Window (hrs)</Label>
                          <Input id="time-window" type="number" defaultValue="8" min="1" max="24" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="load-capacity">Load Capacity (%)</Label>
                          <Input id="load-capacity" type="number" defaultValue="85" min="0" max="100" />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-4">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="avoid-tolls" />
                          <label htmlFor="avoid-tolls" className="text-sm font-medium leading-none">
                            Avoid Tolls
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="avoid-highways" />
                          <label htmlFor="avoid-highways" className="text-sm font-medium leading-none">
                            Avoid Highways
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="prioritize-deliveries" defaultChecked />
                          <label htmlFor="prioritize-deliveries" className="text-sm font-medium leading-none">
                            Prioritize Time-Sensitive Deliveries
                          </label>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="consider-traffic" defaultChecked />
                          <label htmlFor="consider-traffic" className="text-sm font-medium leading-none">
                            Consider Real-time Traffic
                          </label>
                        </div>
                      </div>
                    </div>
                    
                    {/* Advanced Settings */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Advanced Settings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="algorithm-complexity">Algorithm Complexity</Label>
                          <Select defaultValue="medium">
                            <SelectTrigger id="algorithm-complexity">
                              <SelectValue placeholder="Select complexity" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="low">Low (Faster, Less Optimal)</SelectItem>
                              <SelectItem value="medium">Medium (Balanced)</SelectItem>
                              <SelectItem value="high">High (Slower, More Optimal)</SelectItem>
                              <SelectItem value="extreme">Extreme (Maximum Optimization)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="optimization-timeout">Optimization Timeout (s)</Label>
                          <Input id="optimization-timeout" type="number" defaultValue="30" min="5" max="300" />
                          <p className="text-xs text-muted-foreground">Maximum time to find solution</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="optimization-weights">Optimization Weights</Label>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Distance</span>
                              <span className="text-sm font-medium">40%</span>
                            </div>
                            <Progress value={40} className="h-2 [&>div]:bg-blue-500" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Time</span>
                              <span className="text-sm font-medium">35%</span>
                            </div>
                            <Progress value={35} className="h-2 [&>div]:bg-green-500" />
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm">Cost</span>
                              <span className="text-sm font-medium">25%</span>
                            </div>
                            <Progress value={25} className="h-2 [&>div]:bg-amber-500" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Traffic Data Sources</Label>
                        <div className="flex flex-wrap gap-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="google-traffic" defaultChecked />
                            <label htmlFor="google-traffic" className="text-sm font-medium leading-none">
                              Google Maps
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox id="tomtom-traffic" defaultChecked />
                            <label htmlFor="tomtom-traffic" className="text-sm font-medium leading-none">
                              TomTom
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox id="here-traffic" />
                            <label htmlFor="here-traffic" className="text-sm font-medium leading-none">
                              HERE Maps
                            </label>
                          </div>
                          
                          <div className="flex items-center space-x-2">
                            <Checkbox id="historical-traffic" defaultChecked />
                            <label htmlFor="historical-traffic" className="text-sm font-medium leading-none">
                              Historical Data
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Optimization Preview */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Optimization Preview</h4>
                      <div className="border rounded-md p-4 bg-muted/30">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="text-sm font-medium mb-2">Current Route</div>
                            <div className="h-24 bg-background rounded-md flex items-center justify-center border">
                              <div className="text-center">
                                <div className="text-sm text-muted-foreground">12 stops</div>
                                <div className="text-sm text-muted-foreground">342 miles</div>
                                <div className="text-sm text-muted-foreground">6.2 hours</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-2">Optimized Route</div>
                            <div className="h-24 bg-background rounded-md flex items-center justify-center border border-green-500/30">
                              <div className="text-center">
                                <div className="text-sm text-green-500">12 stops</div>
                                <div className="text-sm text-green-500">298 miles (-12.9%)</div>
                                <div className="text-sm text-green-500">5.1 hours (-17.7%)</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Algorithm Performance Metrics */}
                    <div className="space-y-4">
                      <h4 className="text-sm font-medium">Algorithm Performance</h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Computation Time</div>
                          <div className="text-2xl font-bold">1.2s</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Memory Usage</div>
                          <div className="text-2xl font-bold">256MB</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Iterations</div>
                          <div className="text-2xl font-bold">1,245</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Convergence</div>
                          <div className="text-2xl font-bold">98.5%</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline">Reset to Defaults</Button>
                  <Button className="flex items-center">
                    <Zap className="mr-2 h-4 w-4" />
                    Optimize Routes
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingDown className="h-5 w-5 text-green-500" />
                    Optimization Impact
                  </CardTitle>
                  <CardDescription>Real-time optimization metrics</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Key Performance Indicators */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Total Routes</div>
                      <div className="text-2xl font-bold">186</div>
                      <div className="text-xs text-green-500">+12% from last week</div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm text-muted-foreground">Active Vehicles</div>
                      <div className="text-2xl font-bold">42</div>
                      <div className="text-xs text-green-500">92% utilization</div>
                    </div>
                  </div>
                  
                  {/* Optimization Metrics */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Distance Reduction</span>
                        <span className="text-sm text-green-500 font-medium">12%</span>
                      </div>
                      <Progress value={12} className="h-2 [&>div]:bg-green-500" />
                      <div className="text-xs text-muted-foreground mt-1">Saved 1,245 miles this week</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Fuel Savings</span>
                        <span className="text-sm text-green-500 font-medium">19.2%</span>
                      </div>
                      <Progress value={19.2} className="h-2 [&>div]:bg-green-500" />
                      <div className="text-xs text-muted-foreground mt-1">Saved 342 gallons this week</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">Time Efficiency</span>
                        <span className="text-sm text-green-500 font-medium">16.4%</span>
                      </div>
                      <Progress value={16.4} className="h-2 [&>div]:bg-green-500" />
                      <div className="text-xs text-muted-foreground mt-1">Saved 124 hours this week</div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium">CO₂ Emissions</span>
                        <span className="text-sm text-green-500 font-medium">19.3%</span>
                      </div>
                      <Progress value={19.3} className="h-2 [&>div]:bg-green-500" />
                      <div className="text-xs text-muted-foreground mt-1">Reduced by 3.2 tons this week</div>
                    </div>
                  </div>
                  
                  {/* Cost Analysis */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Cost Analysis</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Fuel Cost</div>
                        <div className="text-2xl font-bold">$8,245</div>
                        <div className="text-xs text-green-500">Saved $1,945</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Labor Cost</div>
                        <div className="text-2xl font-bold">$12,480</div>
                        <div className="text-xs text-green-500">Saved $2,080</div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Maintenance</div>
                        <div className="text-2xl font-bold">$3,560</div>
                        <div className="text-xs text-green-500">Saved $720</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Tolls & Fees</div>
                        <div className="text-2xl font-bold">$1,850</div>
                        <div className="text-xs text-green-500">Saved $580</div>
                      </div>
                    </div>
                    
                    <div className="mt-4 py-3 px-4 bg-muted rounded-md">
                      <div className="text-sm font-medium mb-2 flex items-center">
                        <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                        Total Monthly Savings
                      </div>
                      <div className="text-2xl font-bold">$14,325</div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Based on 186 optimized routes
                      </div>
                    </div>
                  </div>
                  
                  {/* Savings Forecast */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Savings Forecast</h4>
                    <div className="grid grid-cols-3 gap-2 text-center mb-2">
                      <div className="text-xs text-muted-foreground">Monthly</div>
                      <div className="text-xs text-muted-foreground">Quarterly</div>
                      <div className="text-xs text-muted-foreground">Yearly</div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="text-lg font-bold">$14,325</div>
                      <div className="text-lg font-bold">$42,975</div>
                      <div className="text-lg font-bold">$171,900</div>
                    </div>
                    <Separator className="my-3" />
                    <div className="text-xs text-center text-muted-foreground pt-1">
                      Projections based on current optimization patterns and route volume
                    </div>
                  </div>
                  
                  {/* Environmental Impact */}
                  <div className="space-y-4">
                    <h4 className="text-sm font-medium">Environmental Impact</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">CO₂ Reduction</div>
                        <div className="text-2xl font-bold">3.2 tons</div>
                        <div className="text-xs text-green-500">19.3% reduction</div>
                      </div>
                      <div className="space-y-2">
                        <div className="text-sm text-muted-foreground">Fuel Efficiency</div>
                        <div className="text-2xl font-bold">18.4 mpg</div>
                        <div className="text-xs text-green-500">+2.1 mpg improvement</div>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Equivalent to planting 42 trees or removing 1.2 cars from the road annually
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>

          <Card className="border-none">   
            {/* Optimization Results Dashboard - New Component */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <Card className="lg:col-span-7">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingDown className="h-5 w-5 text-green-500" />
                      Optimization Results
                    </CardTitle>
                    <Badge variant="outline" className="bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                      Live
                    </Badge>
                  </div>
                  <CardDescription>Real-time savings and improvements</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Distance Saved</div>
                        <div className="text-2xl font-bold">152 mi</div>
                        <div className="text-xs text-green-500">12.9% improvement</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Time Saved</div>
                        <div className="text-2xl font-bold">18.2 hrs</div>
                        <div className="text-xs text-green-500">17.7% improvement</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">Fuel Saved</div>
                        <div className="text-2xl font-bold">36.5 gal</div>
                        <div className="text-xs text-green-500">19.4% improvement</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-xs text-muted-foreground">CO₂ Reduced</div>
                        <div className="text-2xl font-bold">356 kg</div>
                        <div className="text-xs text-green-500">19.3% improvement</div>
                      </div>
                    </div>
                  
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium mb-2">Route Comparison</div>
                      <div className="h-[180px] relative">
                        <RouteComparisonMap height="160px" optimizationData={routeComparisonData} />
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium mb-2">Routes Optimized</div>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 h-2 w-2 rounded-full p-0" />
                            <span className="text-sm">RT-1043: Downtown Circuit</span>
                          </div>
                          <span className="text-sm text-green-500">+24% efficiency</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 h-2 w-2 rounded-full p-0" />
                            <span className="text-sm">RT-3842: North District</span>
                          </div>
                          <span className="text-sm text-green-500">+19% efficiency</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-500 h-2 w-2 rounded-full p-0" />
                            <span className="text-sm">RT-5621: East Suburban</span>
                          </div>
                          <span className="text-sm text-green-500">+16% efficiency</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-5">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calculator className="h-5 w-5 text-blue-500" />
                    Cost Analysis
                  </CardTitle>
                  <CardDescription>Financial impact of optimizations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-3 rounded-md bg-muted/30">
                        <div className="text-xs text-muted-foreground">Monthly Savings</div>
                        <div className="text-2xl font-bold">$14,325</div>
                        <div className="text-xs text-green-500">+8.2% from last month</div>
                      </div>
                      <div className="p-3 rounded-md bg-muted/30">
                        <div className="text-xs text-muted-foreground">Yearly Projection</div>
                        <div className="text-2xl font-bold">$171,900</div>
                        <div className="text-xs text-green-500">+12.4% YoY</div>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Fuel Cost Savings</span>
                          <span className="text-sm font-medium">$5,840</span>
                        </div>
                        <Progress value={42} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">42% of total savings</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Labor Cost Savings</span>
                          <span className="text-sm font-medium">$6,325</span>
                        </div>
                        <Progress value={45} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">45% of total savings</div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm">Maintenance Savings</span>
                          <span className="text-sm font-medium">$1,830</span>
                        </div>
                        <Progress value={13} className="h-2" />
                        <div className="text-xs text-muted-foreground mt-1">13% of total savings</div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium mb-2">ROI Analysis</div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <div className="text-xs text-muted-foreground">Implementation Cost</div>
                          <div className="text-xl font-medium">$42,500</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Break-even Point</div>
                          <div className="text-xl font-medium">3.2 months</div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="border-t pt-4">
                      <div className="text-sm font-medium mb-2">Efficiency Metrics</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Cost per mile reduced by</span>
                        </div>
                        <span className="text-sm font-medium text-green-500">$0.18 (16.4%)</span>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="h-4 w-4 text-green-500" />
                          <span className="text-sm">Cost per delivery reduced by</span>
                        </div>
                        <span className="text-sm font-medium text-green-500">$1.24 (12.8%)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </Card>
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <Card className="mb-6 border-none">
            <CardContent className="p-0">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-0">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Optimization Comparison
                    </CardTitle>
                    <CardDescription>Before vs. After Optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <CustomBarChart
                        data={optimizationSummaryData} 
                        index="name" 
                        categories={["before", "after"]} 
                        colors={["#94a3b8", "#3b82f6"]} 
                        valueFormatter={(value: number) => `${value} hrs`}
                        yAxisWidth={48}
                      />
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Total Distance</div>
                          <div className="text-2xl font-bold">1,100 km</div>
                          <div className="text-xs text-green-500">-12% from baseline</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Total Time</div>
                          <div className="text-2xl font-bold">18.8 hrs</div>
                          <div className="text-xs text-green-500">-16.4% from baseline</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Fuel Usage</div>
                          <div className="text-2xl font-bold">145 gal</div>
                          <div className="text-xs text-green-500">-19.4% from baseline</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">CO₂ Emissions</div>
                          <div className="text-2xl font-bold">1,485 kg</div>
                          <div className="text-xs text-green-500">-19.3% from baseline</div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Efficiency Improvements</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Route Consolidation</span>
                            <span className="text-sm font-medium text-green-500">+15%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Load Balancing</span>
                            <span className="text-sm font-medium text-green-500">+12%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Traffic Avoidance</span>
                            <span className="text-sm font-medium text-green-500">+8%</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Route Performance</div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Urban Routes</span>
                              <span className="text-sm font-medium text-amber-500">Medium</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: "65%" }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>65% Utilized</span>
                              <span>42 Deliveries</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Suburban Routes</span>
                              <span className="text-sm font-medium text-green-500">Optimal</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-green-500" style={{ width: "85%" }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>85% Utilized</span>
                              <span>68 Deliveries</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Highway Routes</span>
                              <span className="text-sm font-medium text-red-500">Congested</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: "92%" }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>92% Utilized</span>
                              <span>74 Deliveries</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      Traffic Pattern Analysis
                    </CardTitle>
                    <CardDescription>Average travel times across time periods</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <LineChartComponent
                        data={[
                          { time: "6 AM", urban: 22, suburban: 18, highway: 13 },
                          { time: "9 AM", urban: 36, suburban: 24, highway: 15 },
                          { time: "12 PM", urban: 30, suburban: 22, highway: 14 },
                          { time: "3 PM", urban: 32, suburban: 23, highway: 14 },
                          { time: "6 PM", urban: 37, suburban: 26, highway: 15 },
                          { time: "9 PM", urban: 24, suburban: 19, highway: 13 }
                        ]}
                        index="time"
                        categories={["urban", "suburban", "highway"]}
                        colors={["#ef4444", "#f97316", "#3b82f6"]}
                        valueFormatter={(value: number) => `${value} min`}
                        yAxisWidth={40}
                      />
                      
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Urban Routes</div>
                          <div className="text-2xl font-bold">32 min</div>
                          <div className="text-xs text-muted-foreground">Peak: 37 min</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Suburban Routes</div>
                          <div className="text-2xl font-bold">22 min</div>
                          <div className="text-xs text-muted-foreground">Peak: 26 min</div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm font-medium">Highway Routes</div>
                          <div className="text-2xl font-bold">14 min</div>
                          <div className="text-xs text-muted-foreground">Peak: 15 min</div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Traffic Insights</div>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge className="w-2 h-2 rounded-full bg-red-500 p-0" />
                            <span className="text-sm">Urban routes show highest variability</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="w-2 h-2 rounded-full bg-orange-500 p-0" />
                            <span className="text-sm">Suburban routes peak during rush hours</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className="w-2 h-2 rounded-full bg-blue-500 p-0" />
                            <span className="text-sm">Highway routes remain most consistent</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-muted/30 p-3 rounded-md">
                        <div className="text-sm font-medium mb-1">Recommendations</div>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          <li>• Schedule urban deliveries outside peak hours (10 AM - 3 PM)</li>
                          <li>• Optimize suburban routes for morning/evening commutes</li>
                          <li>• Prioritize highway routes during rush hours</li>
                        </ul>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Traffic Congestion Index</div>
                        <div className="space-y-4">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Morning Rush (7-9 AM)</span>
                              <span className="text-sm font-medium text-red-500">High</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: "85%" }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>85% Congestion</span>
                              <span>+12% from baseline</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Midday (11 AM - 3 PM)</span>
                              <span className="text-sm font-medium text-amber-500">Medium</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-amber-500" style={{ width: "65%" }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>65% Congestion</span>
                              <span>-5% from baseline</span>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-sm">Evening Rush (4-7 PM)</span>
                              <span className="text-sm font-medium text-red-500">High</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-red-500" style={{ width: "90%" }}></div>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground mt-1">
                              <span>90% Congestion</span>
                              <span>+18% from baseline</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Weather Impact</div>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="text-sm">Rainy Conditions</div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-blue-500" style={{ width: "75%" }}></div>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>+25% delay</span>
                                <span>Affects 15% of routes</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="text-sm">Clear Conditions</div>
                              <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <div className="h-full bg-green-500" style={{ width: "95%" }}></div>
                              </div>
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>+5% delay</span>
                                <span>Affects 85% of routes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4">
                        <div className="text-sm font-medium mb-2">Traffic Prediction</div>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Short-term (24h)</span>
                            <span className="text-sm font-medium text-green-500">92% accuracy</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Medium-term (7d)</span>
                            <span className="text-sm font-medium text-amber-500">78% accuracy</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Long-term (30d)</span>
                            <span className="text-sm font-medium text-red-500">65% accuracy</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardHeader>
              <CardTitle>
              Traffic Incident Analysis
              </CardTitle>
              <CardDescription>Active incidents affecting current routes</CardDescription>
            </CardHeader>
            {/* Traffic Incident Analysis Component */}
            <CardContent>
              <div className="space-y-6">
                {/* Incident Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-muted/30 p-3 rounded-md flex flex-col">
                    <span className="text-xs text-muted-foreground">Total Incidents</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-bold">12</span>
                      <span className="text-xs text-red-500">+3 from yesterday</span>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md flex flex-col">
                    <span className="text-xs text-muted-foreground">Routes Affected</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-bold">7</span>
                      <span className="text-xs text-amber-500">16% of active routes</span>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md flex flex-col">
                    <span className="text-xs text-muted-foreground">Avg. Delay</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-bold">18 min</span>
                      <span className="text-xs text-green-500">-4 min from average</span>
                    </div>
                  </div>
                  <div className="bg-muted/30 p-3 rounded-md flex flex-col">
                    <span className="text-xs text-muted-foreground">Rerouting</span>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="text-2xl font-bold">5</span>
                      <span className="text-xs text-blue-500">routes currently</span>
                    </div>
                  </div>
                </div>
                
                {/* Incident Map */}
                <div className="relative h-64 md:h-80 bg-muted rounded-md overflow-hidden">
                  <TrafficLiveMap 
                    height="100%" 
                    incidents={trafficIncidents}
                    roads={trafficRoads.map(road => {
                      // Function to generate map coordinates from SVG path
                      // Inside this component to access the function properly
                      const coords = generateCoordinatesFromPath(road.path, road.id);
                      
                      return {
                        ...road,
                        name: road.id.startsWith('h') ? `Horizontal Road ${road.id.slice(1)}` :
                              road.id.startsWith('v') ? `Vertical Road ${road.id.slice(1)}` :
                              road.id.startsWith('sh') ? `Secondary Horizontal ${road.id.slice(2)}` :
                              `Secondary Vertical ${road.id.slice(2)}`,
                        coordinates: coords
                      };
                    })}
                  />
                  
                  <div className="absolute top-2 left-2 z-[500] bg-background/80 text-xs p-1 rounded">
                    Live Traffic Monitoring
                  </div>
                  
                  <div className="absolute bottom-4 right-4 flex gap-2">
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="h-8 text-xs bg-white dark:bg-black"
                      onClick={refreshTrafficData}
                    >
                      <RefreshCw className="h-3 w-3 mr-1" />
                      Refresh
                    </Button>
                    <Button variant="secondary" size="sm" className="h-8 text-xs bg-white dark:bg-black">
                      <MapPin className="h-3 w-3 mr-1" />
                      Filter
                    </Button>
                  </div>
                </div>
                
                {/* Active Incidents Table */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-muted/30 px-4 py-2 text-sm font-medium">Active Incidents</div>
                  <div className="divide-y">
                    {currentIncidents.map(incident => (
                      <div key={incident.id} className="grid grid-cols-12 px-4 py-3 items-center">
                        <div className="col-span-1">
                          <Badge className={incident.severity === 'high' 
                            ? "bg-red-500 h-6 w-6 p-1 flex items-center justify-center rounded-full"
                            : incident.severity === 'medium' 
                              ? "bg-amber-500 h-6 w-6 p-1 flex items-center justify-center rounded-full"
                              : "bg-blue-500 h-6 w-6 p-1 flex items-center justify-center rounded-full"
                          }>
                            <TrafficCone className="h-4 w-4 text-white" />
                          </Badge>
                        </div>
                        <div className="col-span-4">
                          <div className="font-medium text-sm">{incident.type}</div>
                          <div className="text-xs text-muted-foreground">{incident.location}</div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="text-xs text-muted-foreground">Severity</div>
                          <div className={incident.severity === 'high' 
                            ? "text-sm font-medium text-red-500"
                            : incident.severity === 'medium' 
                              ? "text-sm font-medium text-amber-500"
                              : "text-sm font-medium text-blue-500"
                          }>
                            {incident.severity.charAt(0).toUpperCase() + incident.severity.slice(1)}
                          </div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="text-xs text-muted-foreground">Est. Duration</div>
                          <div className="text-sm font-medium">{incident.duration}</div>
                        </div>
                        <div className="col-span-2 text-center">
                          <div className="text-xs text-muted-foreground">Routes Affected</div>
                          <div className="text-sm font-medium">{incident.affectedRoutes?.join(", ")}</div>
                        </div>
                        <div className="col-span-1 flex justify-end">
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MapPin className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-muted/10 px-4 py-2 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Showing {indexOfFirstIncident + 1} to {Math.min(indexOfLastIncident, filteredIncidents.length)} of {filteredIncidents.length} incidents
                    </span>
                    <div className="flex gap-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => setCurrentIncidentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentIncidentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-7 w-7 p-0"
                        onClick={() => setCurrentIncidentPage(prev => 
                          Math.min(prev + 1, Math.ceil(filteredIncidents.length / incidentsPerPage))
                        )}
                        disabled={currentIncidentPage >= Math.ceil(filteredIncidents.length / incidentsPerPage)}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Automated Actions */}
                <div className="border rounded-md p-4">
                  <h4 className="text-sm font-medium mb-3">Automated Actions</h4>
                  <div className="space-y-2">
                    {trafficAutomatedActions.map((action, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <div className="flex items-center gap-2">
                          {action.icon === 'refresh' && <RefreshCw className={action.color === 'blue' ? "h-4 w-4 text-blue-500" : action.color === 'amber' ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-green-500"} />}
                          {action.icon === 'clock' && <Clock className={action.color === 'blue' ? "h-4 w-4 text-blue-500" : action.color === 'amber' ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-green-500"} />}
                          {action.icon === 'user' && <User className={action.color === 'blue' ? "h-4 w-4 text-blue-500" : action.color === 'amber' ? "h-4 w-4 text-amber-500" : "h-4 w-4 text-green-500"} />}
                          <span>{action.action}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">{action.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card className="border-none">
            {/* Driver Performance Analytics */}
            <CardContent className="p-0 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5 text-primary" />
                      Route Efficiency Improvements
                    </CardTitle>
                    <CardDescription>Savings per route after optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CustomBarChart
                      data={efficiencyImprovementData}
                      index="name"
                      categories={["distance", "time", "fuel", "emissions"]}
                      colors={["indigo", "rose", "amber", "emerald"]}
                      valueFormatter={(value: number) => value.toLocaleString()}
                      yAxisWidth={48}
                    />
                    <div className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                      <div className="flex items-center">
                        <Badge className="w-2 h-2 rounded-full bg-blue-500 mr-1 p-0" />
                        <span>Distance Saved</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="w-2 h-2 rounded-full bg-orange-500 mr-1 p-0" />
                        <span>Time Saved</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="w-2 h-2 rounded-full bg-green-600 mr-1 p-0" />
                        <span>Fuel Saved</span>
                      </div>
                      <div className="flex items-center">
                        <Badge className="w-2 h-2 rounded-full bg-gray-500 mr-1 p-0" />
                        <span>Emissions Reduced</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Compass className="h-5 w-5 text-primary" />
                      Geo-Spatial Distribution
                    </CardTitle>
                    <CardDescription>Route density and geographic distribution</CardDescription>
                  </CardHeader>
                  <CardContent className="min-h-[300px]">
                    <GeoDistribution height="370px" />
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5 text-primary" />
                      Vehicle Utilization
                    </CardTitle>
                    <CardDescription>Fleet allocation efficiency</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">26ft Box Trucks</span>
                          <span className="text-sm font-medium">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Delivery Vans</span>
                          <span className="text-sm font-medium">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">53ft Semi-Trucks</span>
                          <span className="text-sm font-medium">65%</span>
                        </div>
                        <Progress value={65} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Electric Vans</span>
                          <span className="text-sm font-medium">84%</span>
                        </div>
                        <Progress value={84} className="h-2" />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Refrigerated Trucks</span>
                          <span className="text-sm font-medium">71%</span>
                        </div>
                        <Progress value={71} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      Time Window Analysis
                    </CardTitle>
                    <CardDescription>Delivery time slot optimization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="pt-3">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Morning (6AM-10AM)</span>
                          <span className="text-sm font-medium text-amber-500">Medium</span>
                        </div>
                        <Progress value={65} className="h-2 bg-muted" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>65% Utilized</span>
                          <span>42 Deliveries</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Midday (10AM-2PM)</span>
                          <span className="text-sm font-medium text-green-500">Optimal</span>
                        </div>
                        <Progress value={85} className="h-2 bg-muted" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>85% Utilized</span>
                          <span>68 Deliveries</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Afternoon (2PM-6PM)</span>
                          <span className="text-sm font-medium text-red-500">Congested</span>
                        </div>
                        <Progress value={92} className="h-2 bg-muted" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>92% Utilized</span>
                          <span>74 Deliveries</span>
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Evening (6PM-10PM)</span>
                          <span className="text-sm font-medium text-blue-500">Low Traffic</span>
                        </div>
                        <Progress value={55} className="h-2 bg-muted" />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>55% Utilized</span>
                          <span>38 Deliveries</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FuelIcon className="h-5 w-5 text-primary" />
                      Energy & Emissions
                    </CardTitle>
                    <CardDescription>Environmental impact analysis</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="pt-2 pb-6">
                      <div className="rounded-full h-36 w-36 mx-auto relative flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center justify-center">
                          <svg className="h-36 w-36" viewBox="0 0 100 100">
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              fill="none" 
                              stroke="currentColor" 
                              className="text-muted stroke-1" 
                            />
                            <circle 
                              cx="50" 
                              cy="50" 
                              r="45" 
                              fill="none" 
                              stroke="currentColor" 
                              className="text-green-500 stroke-2" 
                              strokeDasharray="283" 
                              strokeDashoffset="70" 
                              transform="rotate(-90 50 50)" 
                            />
                          </svg>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl font-bold">-25%</div>
                          <div className="text-xs text-muted-foreground mt-1">CO₂ REDUCTION</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4">
                        <div className="text-center p-2 bg-muted/50 rounded-md">
                          <div className="text-lg font-bold">78%</div>
                          <div className="text-xs text-muted-foreground">Route Efficiency</div>
                        </div>
                        <div className="text-center p-2 bg-muted/50 rounded-md">
                          <div className="text-lg font-bold">22%</div>
                          <div className="text-xs text-muted-foreground">Electric Vehicles</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="p-0">
            <CardHeader>
              <CardTitle>
                Driver Performance
              </CardTitle>
              <CardDescription>Advanced driver efficiency metrics and benchmarking</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Advanced Driver Performance Dashboard */}
                <Card className="border-none">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-xs text-muted-foreground">Top Driver</div>
                      <div className="text-xl font-bold mt-1">Alex K.</div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-green-500 font-medium">98.3%</span>
                        <TrendingDown className="h-3 w-3 ml-1 text-green-500" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">42 completed routes</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-xs text-muted-foreground">Fleet Efficiency</div>
                      <div className="text-xl font-bold mt-1">86.4%</div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-green-500 font-medium">+3.2%</span>
                        <TrendingDown className="h-3 w-3 ml-1 text-green-500" />
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">From last month</div>
                    </div>
                    <div className="p-3 bg-muted/30 rounded-md">
                      <div className="text-xs text-muted-foreground">Training Needs</div>
                      <div className="text-xl font-bold mt-1">4 Drivers</div>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-amber-500 font-medium">Efficiency training</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">Below 85% performance</div>
                    </div>
                  </div>
                </Card>
                {/* Performance Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="col-span-1 h-full">
                    <div className="rounded-md border p-4 h-full">
                      <h4 className="text-sm font-medium mb-3">Performance Overview</h4>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="p-2 rounded-md bg-muted/30">
                            <div className="text-xs text-muted-foreground">Top Driver</div>
                            <div className="text-xl font-bold mt-1">Alex Kim</div>
                            <div className="text-xs text-green-500">98.3% rating</div>
                          </div>
                          <div className="p-2 rounded-md bg-muted/30">
                            <div className="text-xs text-muted-foreground">Efficiency</div>
                            <div className="text-xl font-bold mt-1">92.6%</div>
                            <div className="text-xs text-green-500">+4.8% this month</div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">On-time Deliveries</span>
                            <span className="text-sm font-medium">94%</span>
                          </div>
                          <Progress value={94} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Last 30 days</span>
                            <span>Target: 95%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Fuel Efficiency</span>
                            <span className="text-sm font-medium">89%</span>
                          </div>
                          <Progress value={89} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Last 30 days</span>
                            <span>Target: 90%</span>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-sm">Customer Satisfaction</span>
                            <span className="text-sm font-medium">97%</span>
                          </div>
                          <Progress value={97} className="h-2" />
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Last 30 days</span>
                            <span>Target: 95%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="col-span-2">
                    <div className="rounded-md border p-4 h-full">
                      {/* Header and Dropdown for Performance Area */}
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium">Driver Performance Comparison</h4>
                        <Select value={performanceArea} onValueChange={setPerformanceArea}>
                          <SelectTrigger className="w-[180px] h-8 text-xs">
                            <SelectValue placeholder="Select performance area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="overall">Overall Performance</SelectItem>
                            <SelectItem value="fuelEfficiency">Fuel Efficiency</SelectItem>
                            <SelectItem value="onTimeDelivery">On-time Delivery</SelectItem>
                            <SelectItem value="customerRating">Customer Rating</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      {/* Chart component */}
                      <div className="h-[250px] border-b mb-2">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsBarChart
                            data={driverPerformanceData[performanceArea]}
                          >
                            <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis
                              stroke="#888888"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              // Dynamically format YAxis based on selected area
                              tickFormatter={(value) => {
                                switch (performanceArea) {
                                  case 'fuelEfficiency':
                                    return `${value} MPG`;
                                  case 'customerRating':
                                    return value.toFixed(1);
                                  case 'onTimeDelivery':
                                    return `${value}%`;
                                  default:
                                    return `${value}%`;
                                }
                              }}
                              domain={performanceArea === 'customerRating' ? [0, 5] : [0, 100]} // Adjust domain for rating
                            />
                            <Tooltip 
                              // Dynamically format Tooltip based on selected area
                              formatter={(value: number) => {
                                switch (performanceArea) {
                                  case 'fuelEfficiency':
                                    return [`${value} MPG`, 'Fuel Efficiency'];
                                  case 'customerRating':
                                    return [value.toFixed(1), 'Customer Rating'];
                                  case 'onTimeDelivery':
                                    return [`${value}%`, 'On-time Delivery'];
                                  default:
                                    return [`${value}%`, 'Overall Performance'];
                                }
                              }}
                            />
                            {/* Adjust Bar fill color based on performance area */}
                            <Bar dataKey="performance" fill={
                              performanceArea === 'fuelEfficiency' ? '#82ca9d' :
                              performanceArea === 'onTimeDelivery' ? '#ffc658' :
                              performanceArea === 'customerRating' ? '#a4de6c' :
                              '#8884d8'
                            } radius={[4, 4, 0, 0]} />
                          </RechartsBarChart>
                        </ResponsiveContainer>
                      </div>
                      
                      {/* Leaderboards remain below the chart */}
                      <div className="grid grid-cols-3 gap-4 mt-4">
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Top Performers</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-medium">Alex K. (98.3%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-medium">Sarah M. (97.8%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-medium">David W. (96.2%)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Improvement Needed</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span className="text-xs font-medium">Robert J. (82.4%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span className="text-xs font-medium">Lisa T. (83.7%)</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                              <span className="text-xs font-medium">Mark P. (84.1%)</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs text-muted-foreground">Performance Areas</div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                              <span className="text-xs font-medium">Fuel Efficiency</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-green-500"></div>
                              <span className="text-xs font-medium">On-time Delivery</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-2 rounded-full bg-purple-500"></div>
                              <span className="text-xs font-medium">Customer Rating</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <RoutePlanModal 
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSave={handleAddRoute}
      />
      
      {isDetailsModalOpen && selectedRoute && (
        <RouteDetails 
          route={selectedRoute} 
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedRoute(undefined);
          }} 
        />
      )}
    </div>
  );
}