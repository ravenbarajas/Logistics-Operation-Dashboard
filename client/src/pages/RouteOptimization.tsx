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
  Zap, DollarSign, Compass, MapIcon, Calculator, Separator as SeparatorIcon, ChevronLeft, ChevronRight, Search, ChevronsLeft, ChevronsRight
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
        <h1 className="text-3xl font-bold">Route Optimization</h1>
        <div className="flex gap-2">
          <Button onClick={() => setIsRouteModalOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Plan New Route
          </Button>
          <Button variant="outline" onClick={fetchSummaryData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      {/* Route Summary Cards */}
      {summary && (
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

      {/* Route Management */}
      <div className="mb-8">
        <Card className="shadow-sm overflow-hidden border dark:bg-black">
          <CardHeader className="pb-0 bg-white dark:bg-black p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <Route className="h-5 w-5" /> Route Management
                </h2>
                <p className="text-sm text-muted-foreground">Manage and optimize your delivery routes</p>
              </div>
              <Button variant="outline" onClick={() => setIsRouteModalOpen(true)} className="border-black dark:border-white hover:bg-black/10 dark:hover:bg-white/10">
                <PlusCircle className="h-4 w-4 mr-2" />
                New Route
              </Button>
            </div>
          </CardHeader>
          
          <div className="p-4 bg-white dark:bg-black">
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
            
          <div className="bg-white dark:bg-black transition-colors">
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
                          className="h-8 w-8 bg-background"
                          aria-label="First page"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                                className="h-8 w-8 bg-background"
                                aria-label={`Page ${currentPage - 1}`}
                              >
                                {currentPage - 1}
                              </Button>
                            )}
                            
                            {currentPage !== 1 && currentPage !== totalPages && (
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
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
                                className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                          className="h-8 w-8 bg-background"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8 bg-background"
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
                          className="h-8 w-8 bg-background"
                          aria-label="First page"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                                className="h-8 w-8 bg-background"
                                aria-label={`Page ${currentPage - 1}`}
                              >
                                {currentPage - 1}
                              </Button>
                            )}
                            
                            {currentPage !== 1 && currentPage !== totalPages && (
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
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
                                className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                          className="h-8 w-8 bg-background"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8 bg-background"
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
                          className="h-8 w-8 bg-background"
                          aria-label="First page"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                                className="h-8 w-8 bg-background"
                                aria-label={`Page ${currentPage - 1}`}
                              >
                                {currentPage - 1}
                              </Button>
                            )}
                            
                            {currentPage !== 1 && currentPage !== totalPages && (
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
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
                                className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                          className="h-8 w-8 bg-background"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8 bg-background"
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
                          className="h-8 w-8 bg-background"
                          aria-label="First page"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                          className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                                className="h-8 w-8 bg-background"
                                aria-label={`Page ${currentPage - 1}`}
                              >
                                {currentPage - 1}
                              </Button>
                            )}
                            
                            {currentPage !== 1 && currentPage !== totalPages && (
                              <Button
                                variant="default"
                                size="icon"
                                className="h-8 w-8 bg-black text-white hover:bg-black/90 dark:bg-white dark:text-black dark:hover:bg-white/90"
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
                                className="h-8 w-8 bg-background"
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
                              className="h-8 w-8 bg-background"
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
                          className="h-8 w-8 bg-background"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handlePageChange(totalPages)}
                          disabled={currentPage === totalPages}
                          className="h-8 w-8 bg-background"
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
        </Card>
      </div>
      
      {/* Route Optimization Tools & Analytics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Route Optimization Engine
            </CardTitle>
            <CardDescription>
              Configure parameters and generate optimized routes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="optimization-strategy">Optimization Strategy</Label>
                  <Select defaultValue="balanced">
                    <SelectTrigger id="optimization-strategy">
                      <SelectValue placeholder="Select strategy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="distance">Minimize Distance</SelectItem>
                      <SelectItem value="time">Minimize Time</SelectItem>
                      <SelectItem value="fuel">Minimize Fuel Consumption</SelectItem>
                      <SelectItem value="balanced">Balanced Approach</SelectItem>
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
                      <SelectItem value="delivery-van">Delivery Van</SelectItem>
                      <SelectItem value="box-truck">26ft Box Truck</SelectItem>
                      <SelectItem value="semi-truck">53ft Semi-Truck</SelectItem>
                      <SelectItem value="electric-van">Electric Delivery Van</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="max-stops">Maximum Stops</Label>
                  <Input id="max-stops" type="number" defaultValue="10" min="1" max="50" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="max-distance">Maximum Distance (mi)</Label>
                  <Input id="max-distance" type="number" defaultValue="500" min="1" max="2000" />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departure-time">Departure Time</Label>
                  <Input id="departure-time" type="time" defaultValue="08:00" />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="avoid-tolls" />
                  <label
                    htmlFor="avoid-tolls"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Avoid Tolls
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="avoid-highways" />
                  <label
                    htmlFor="avoid-highways"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Avoid Highways
                  </label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox id="prioritize-deliveries" defaultChecked />
                  <label
                    htmlFor="prioritize-deliveries"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Prioritize Time-Sensitive Deliveries
                  </label>
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
            <CardDescription>Summary of optimization benefits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Distance Reduction</span>
                <span className="text-sm text-green-500 font-medium">12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Fuel Savings</span>
                <span className="text-sm text-green-500 font-medium">19.2%</span>
              </div>
              <Progress value={19.2} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">Time Efficiency</span>
                <span className="text-sm text-green-500 font-medium">16.4%</span>
              </div>
              <Progress value={16.4} className="h-2" />
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">CO₂ Emissions</span>
                <span className="text-sm text-green-500 font-medium">19.3%</span>
              </div>
              <Progress value={19.3} className="h-2" />
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium">Average Improvement</span>
              <span className="text-green-500 font-bold">16.7%</span>
            </div>
            
            <div className="mt-4 py-3 px-4 bg-muted rounded-md">
              <div className="text-sm font-medium mb-2 flex items-center">
                <DollarSign className="h-4 w-4 mr-1 text-green-500" />
                Estimated Monthly Savings
              </div>
              <div className="text-2xl font-bold">$14,325</div>
              <div className="text-xs text-muted-foreground mt-1">
                Based on 186 optimized routes
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Optimization Visualizations */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Optimization Comparison
            </CardTitle>
            <CardDescription>Before vs. After Optimization</CardDescription>
          </CardHeader>
          <CardContent>
            <BarChart
              data={optimizationSummaryData} 
              index="name" 
              categories={["before", "after"]} 
              colors={["#94a3b8", "#3b82f6"]} 
              valueFormatter={(value: number) => `${value}${value > 1000 ? ' km' : value > 100 ? ' hr' : value > 30 ? ' gal' : ' kg'}`}
              yAxisWidth={48}
            />
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
            <div className="mt-2 grid grid-cols-3 gap-2 text-xs">
              <div className="flex items-center">
                <Badge className="w-2 h-2 rounded-full bg-red-500 mr-1 p-0" />
                <span>Urban Routes</span>
              </div>
              <div className="flex items-center">
                <Badge className="w-2 h-2 rounded-full bg-orange-500 mr-1 p-0" />
                <span>Suburban Routes</span>
              </div>
              <div className="flex items-center">
                <Badge className="w-2 h-2 rounded-full bg-blue-500 mr-1 p-0" />
                <span>Highway Routes</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Route Details - Only shown when a route is selected */}
      {selectedRoute && (
        <div className="mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" />
                Route Details: {selectedRoute.name}
              </CardTitle>
              <CardDescription>
                ID: {selectedRoute.id} • Vehicle: {selectedRoute.vehicle} • Driver: {selectedRoute.driver}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RouteDetails route={selectedRoute} onClose={() => setSelectedRoute(null)} />
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Advanced Analytics Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-4 flex items-center">
          <Calculator className="h-6 w-6 mr-2 text-primary" />
          Advanced Route Analytics
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5 text-primary" />
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
            <CardContent className="min-h-[300px] flex items-center justify-center p-6 bg-muted/50 rounded-md">
              <div className="text-center space-y-3">
                <MapIcon className="h-16 w-16 text-muted-foreground/50 mx-auto" />
                <h3 className="text-lg font-medium">Interactive Map Visualization</h3>
                <p className="text-sm text-muted-foreground max-w-md">
                  This component would include an interactive map showing route density, 
                  congestion patterns, and optimized paths across different regions.
                </p>
              </div>
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
                  <Progress value={65} className="h-2 bg-muted" indicatorColor="bg-amber-500" />
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
                  <Progress value={85} className="h-2 bg-muted" indicatorColor="bg-green-500" />
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
                  <Progress value={92} className="h-2 bg-muted" indicatorColor="bg-red-500" />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>92% Utilized</span>
                    <span>74 Deliveries</span>
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
      
      <RoutePlanModal 
        isOpen={isRouteModalOpen}
        onClose={() => setIsRouteModalOpen(false)}
        onSave={handleAddRoute}
      />
      
      {isDetailsModalOpen && selectedRoute && (
        <RouteDetails 
          route={selectedRoute} 
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedRoute(null);
          }} 
        />
      )}
    </div>
  );
}