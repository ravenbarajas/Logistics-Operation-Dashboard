import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteData, RouteDetails as IRouteDetails } from "@/components/routes/RouteTable";
import { RouteDetails } from "@/components/routes/RouteDetails";
import { RoutePlanModal } from "@/components/routes/RoutePlanModal";
import { RefreshCw, Map as MapIcon, Route, TrafficCone, Activity } from "lucide-react";
import { routeService, RouteSummary } from "@/services/routeService";
import { useLocation } from "wouter";
import { 
  MergedRouteData, 
  TrafficIncident,
  TrafficRoad,
  PerformanceAreaKey,
  DriverPerformanceData as IDriverPerformanceData,
  AutomatedAction
} from "@/components/routes/types";
import { SummaryCards } from "@/components/routes/common/SummaryCards";

// Import tab components
import { ManagementTab } from "@/components/routes/ManagementTab";
import { OptimizationTab } from "@/components/routes/OptimizationTab";
import { TrafficTab } from "@/components/routes/TrafficTab";
import { InsightsTab } from "@/components/routes/InsightsTab";

// Import mock data from the consolidated index file
import {
  activeRoutes,
  scheduledRoutes,
  completedRoutes,
  routeTemplates,
  optimizationSummaryData,
  routeComparisonData,
  efficiencyImprovementData,
  trafficIncidents as liveTrafficIncidents,
  trafficRoads as liveTrafficRoads,
  trafficAutomatedActions,
  driverPerformanceData,
} from "@/mockData/routes";

export default function RouteOptimization() {
  const [location] = useLocation();
  
  // Set up state for routes
  const [routes, setRoutes] = useState<{
    active: MergedRouteData[];
    scheduled: MergedRouteData[];
    completed: MergedRouteData[];
    templates: MergedRouteData[];
  }>({
    active: activeRoutes,
    scheduled: scheduledRoutes,
    completed: completedRoutes,
    templates: routeTemplates
  });
  
  const [selectedRoute, setSelectedRoute] = useState<RouteData | undefined>(undefined);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<RouteSummary | null>(null);
  
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
  
  // Handle viewing route details
  const handleViewDetails = (route: RouteData) => {
    setSelectedRoute(route);
    setIsDetailsModalOpen(true);
  };
  
  // Handle creating a new route
  const handleAddRoute = (routeData: RouteData) => {
    // Ensure route data has both property sets
    const mappedRouteData: MergedRouteData = {
      ...routeData,
      startLocation: routeData.startLocation,
      endLocation: routeData.endLocation,
      origin: routeData.startLocation || routeData.origin || "",
      destination: routeData.endLocation || routeData.destination || ""
    };
    
    setRoutes({
      ...routes,
      scheduled: [mappedRouteData, ...routes.scheduled]
    });
  };
  
  // Handle starting a scheduled route
  const handleStartRoute = (route: RouteData) => {
    const updatedRoute: MergedRouteData = {
      ...route,
      status: "active",
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      completionRate: 0,
      startLocation: route.origin || route.startLocation || "",
      endLocation: route.destination || route.endLocation || "",
      origin: route.origin || route.startLocation || "",
      destination: route.destination || route.endLocation || ""
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
      actualDuration: Math.floor(route.duration * (Math.random() > 0.5 ? (1 + Math.random() * 0.2) : (1 - Math.random() * 0.15))),
      startLocation: route.origin || route.startLocation || "",
      endLocation: route.destination || route.endLocation || "",
      origin: route.origin || route.startLocation || "",
      destination: route.destination || route.endLocation || ""
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
      startLocation: route.startLocation || "",
      endLocation: route.endLocation || ""
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

  // State for traffic data
  const [trafficIncidents, setTrafficIncidents] = useState<TrafficIncident[]>(liveTrafficIncidents);
  const [trafficRoads, setTrafficRoads] = useState<TrafficRoad[]>(liveTrafficRoads);
  
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
      severity: ["low", "medium", "high"][Math.floor(Math.random() * 3)] as "low" | "medium" | "high",
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
  };

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

      {/* Summary Cards */}
      <SummaryCards summary={summary} activeTab={mainTabValue} />

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
          <ManagementTab 
            routes={routes}
            onViewDetails={handleViewDetails}
            onStartRoute={handleStartRoute}
            onCompleteRoute={handleCompleteRoute}
            onDuplicateRoute={handleDuplicateRoute}
            onDeleteRoute={handleDeleteRoute}
            onAddRoute={() => setIsRouteModalOpen(true)}
          />
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <OptimizationTab 
            routeComparisonData={routeComparisonData} 
          />
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <TrafficTab
            optimizationSummaryData={optimizationSummaryData}
            trafficIncidents={trafficIncidents}
            trafficRoads={trafficRoads}
            trafficAutomatedActions={trafficAutomatedActions as AutomatedAction[]}
            refreshTrafficData={refreshTrafficData}
            generateCoordinatesFromPath={generateCoordinatesFromPath}
          />
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <InsightsTab 
            efficiencyImprovementData={efficiencyImprovementData}
            driverPerformanceData={driverPerformanceData as Record<PerformanceAreaKey, IDriverPerformanceData[]>}
          />
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