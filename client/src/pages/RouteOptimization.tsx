import { useState, useEffect } from "react";
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
import { BarChart } from "@/components/ui/bar-chart";
import { LineChart as LineChartComponent } from "@/components/ui/line-chart";
import { routeService, RouteSummary } from "@/services/routeService";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { GeoDistribution } from "@/components/maps/GeoDistribution";
import { useLocation } from "wouter";

// Mock data for charts
const optimizationSummaryData = [
  { name: "Distance", before: 1250, after: 1100 },
  { name: "Fuel", before: 180, after: 145 },
  { name: "Time", before: 22.5, after: 18.8 },
  { name: "CO2", before: 1840, after: 1485 },
];

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
    } else if (path.includes("/routes/management")) {
      return "management";
    } else {
      // Default to optimization (main routes page)
      return "optimization";
    }
  }

  // Update tab value whenever location changes (handles sidebar navigation)
  useEffect(() => {
    setMainTabValue(getTabFromUrl());
  }, [location]);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    // Set the tab state
    setMainTabValue(value);
    
    // Update URL without full page reload using path-based navigation
    if (value === "management") {
      window.history.pushState({}, "", "/routes/management");
    } else if (value === "optimization") {
      window.history.pushState({}, "", "/routes");
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

  return (
    <div className="container px-4 py-8">
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
          <Card className="mb-6 p-6">
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
          </Card>
        </TabsContent>

        {/* Optimization Tab (main routes page) */}
        <TabsContent value="optimization" className="space-y-4">
          {/* Route Optimization Tools & Analytics */}
          <Card className="mb-6 p-6">
            <div className="flex flex-col gap-1 mb-6">
              <CardTitle>
                Route Optimization
              </CardTitle>
              <CardDescription>Improve routes for speed and efficiency</CardDescription>
            </div>
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
        </TabsContent>

        {/* Traffic Tab */}
        <TabsContent value="traffic" className="space-y-4">
          <Card className="mb-6 p-6">
        <div className="flex flex-col gap-1 mb-6">
          <CardTitle>
            Traffic Analysis
          </CardTitle>
          <CardDescription>Understand traffic patterns and delays</CardDescription>
        </div>
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
                <BarChart
                  data={optimizationSummaryData} 
                  index="name" 
                  categories={["before", "after"]} 
                  colors={["#94a3b8", "#3b82f6"]} 
                  valueFormatter={(value: number) => `${value}${value > 1000 ? ' km' : value > 100 ? ' hr' : value > 30 ? ' gal' : ' kg'}`}
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
          </Card>
        </TabsContent>

        {/* Insights Tab */}
        <TabsContent value="insights" className="space-y-4">
          <Card className="mb-6 p-6">
        <div className="flex flex-col gap-1 mb-6">
          <CardTitle>
            Route Insights
          </CardTitle>
          <CardDescription>Gain data-driven route performance views</CardDescription>
        </div>
        <div className="mb-0">
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
                <BarChart
                  data={efficiencyImprovementData} 
                  index="name" 
                  categories={["distance", "time", "fuel", "emissions"]} 
                  colors={["#3b82f6", "#f97316", "#16a34a", "#6b7280"]} 
                  valueFormatter={(value: number) => `${value}${value > 20 ? ' km' : value > 10 ? ' min' : value > 1.5 ? ' gal' : ' kg'}`}
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
        </div>
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