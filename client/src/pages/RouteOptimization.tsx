import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RouteTable, RouteData } from "@/components/routes/RouteTable";
import { RouteDetails } from "@/components/routes/RouteDetails";
import { RoutePlanModal } from "@/components/routes/RoutePlanModal";
import { activeRoutes, scheduledRoutes, completedRoutes, routeTemplates } from "@/components/routes/routeData";
import { AlertCircle, BarChart3, Clock, Fuel, LineChart, PlusCircle, Route, TrendingDown, Wind, Truck, Calendar, CheckCircle, Copy } from "lucide-react";
import { BarChart } from "@/components/ui/bar-chart";
import { LineChart as LineChartComponent } from "@/components/ui/line-chart";

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

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Route Optimization</h1>
        <Button 
          onClick={() => setIsRouteModalOpen(true)}
          className="flex items-center gap-2"
        >
          <PlusCircle className="h-4 w-4" />
            New Route Plan
          </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6 flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <TrendingDown className="h-5 w-5 mr-2 text-green-500" />
                <span className="text-lg font-medium">Fuel Efficiency Gain</span>
              </div>
              <div className="text-3xl font-bold mt-2">12%</div>
              <div className="text-muted-foreground text-sm mt-1">Last 30 days</div>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              +3.2% from August
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <Fuel className="h-5 w-5 mr-2 text-primary" />
                <span className="text-lg font-medium">Fuel Saved</span>
              </div>
              <div className="text-3xl font-bold mt-2">247 gal</div>
              <div className="text-muted-foreground text-sm mt-1">$951 cost reduction</div>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              186 routes optimized
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                <span className="text-lg font-medium">Time Saved</span>
              </div>
              <div className="text-3xl font-bold mt-2">158 hrs</div>
              <div className="text-muted-foreground text-sm mt-1">Improved driver efficiency</div>
            </div>
            <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
              9.3 min/route avg
            </Badge>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6 flex items-start justify-between">
            <div>
              <div className="flex items-center">
                <Wind className="h-5 w-5 mr-2 text-primary" />
                <span className="text-lg font-medium">CO₂ Reduction</span>
              </div>
              <div className="text-3xl font-bold mt-2">2,514 kg</div>
              <div className="text-muted-foreground text-sm mt-1">Environmental impact</div>
            </div>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
              119 trees saved
            </Badge>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Optimization Summary</CardTitle>
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
            <CardTitle>Route Efficiency Improvements</CardTitle>
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
          </CardContent>
        </Card>
      </div>

      <div className="mb-6">
        <Card>
          <CardHeader className="bg-primary/5 border-b border-primary/10">
            <CardTitle className="text-xl flex items-center gap-2">
              <Route className="h-5 w-5" />
              Route Management
            </CardTitle>
            <CardDescription>
              View and manage all your routes in one place
            </CardDescription>
        </CardHeader>
          <CardContent className="p-0">
            <Tabs defaultValue="active" className="w-full">
              <div className="px-6 pt-6">
                <TabsList className="w-full grid grid-cols-4 mb-6">
                  <TabsTrigger value="active" className="flex items-center gap-1">
                    <AlertCircle className="h-4 w-4" />
                    Active Routes
                    <Badge className="ml-1 bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      {routes.active.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="scheduled" className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Scheduled
                    <Badge className="ml-1 bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      {routes.scheduled.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="flex items-center gap-1">
                    <BarChart3 className="h-4 w-4" />
                    Completed
                    <Badge className="ml-1 bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                      {routes.completed.length}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="templates" className="flex items-center gap-1">
                    <LineChart className="h-4 w-4" />
                    Templates
                    <Badge className="ml-1 bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      {routes.templates.length}
                    </Badge>
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <TabsContent value="active" className="max-h-[calc(100vh-22rem)] overflow-y-auto mt-0">
                <div className="px-6 pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Truck className="h-4 w-4 mr-2" />
                    <span className="font-medium">Active routes in progress</span>
                  </div>
                </div>
                <RouteTable 
                  routes={routes.active}
                  status="active"
                  onViewDetails={handleViewDetails}
                  onComplete={handleCompleteRoute}
                  onDuplicate={handleDuplicateRoute}
                  onDelete={handleDeleteRoute}
                />
              </TabsContent>
              
              <TabsContent value="scheduled" className="max-h-[calc(100vh-22rem)] overflow-y-auto mt-0">
                <div className="px-6 pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span className="font-medium">Scheduled future routes</span>
              </div>
            </div>
                <RouteTable 
                  routes={routes.scheduled}
                  status="scheduled"
                  onViewDetails={handleViewDetails}
                  onStart={handleStartRoute}
                  onEdit={() => {}}
                  onOptimize={() => {}}
                  onDuplicate={handleDuplicateRoute}
                  onDelete={handleDeleteRoute}
                />
              </TabsContent>
              
              <TabsContent value="completed" className="max-h-[calc(100vh-22rem)] overflow-y-auto mt-0">
                <div className="px-6 pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    <span className="font-medium">Completed route history</span>
                  </div>
                </div>
                <RouteTable 
                  routes={routes.completed}
                  status="completed"
                  onViewDetails={handleViewDetails}
                  onDuplicate={handleDuplicateRoute}
                  onDelete={handleDeleteRoute}
                />
              </TabsContent>
              
              <TabsContent value="templates" className="max-h-[calc(100vh-22rem)] overflow-y-auto mt-0">
                <div className="px-6 pb-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Copy className="h-4 w-4 mr-2" />
                    <span className="font-medium">Reusable route templates</span>
              </div>
            </div>
                <RouteTable 
                  routes={routes.templates}
                  status="template"
                  onViewDetails={handleViewDetails}
                  onEdit={() => {}}
                  onOptimize={() => {}}
                  onDuplicate={handleDuplicateRoute}
                  onDelete={handleDeleteRoute}
                />
              </TabsContent>
            </Tabs>
        </CardContent>
      </Card>
                        </div>
      
      {/* Route Details Modal */}
      <RouteDetails 
        isOpen={isDetailsModalOpen} 
        onClose={() => setIsDetailsModalOpen(false)} 
        route={selectedRoute} 
      />
      
      {/* Route Plan Modal */}
      <RoutePlanModal 
        isOpen={isRouteModalOpen} 
        onClose={() => setIsRouteModalOpen(false)} 
        onSuccess={handleAddRoute}
      />
    </div>
  );
}