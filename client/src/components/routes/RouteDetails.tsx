import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RouteData } from "./RouteTable";
import { 
  MapPin, 
  Clock, 
  Calendar, 
  Truck, 
  User, 
  Route as RouteIcon, 
  Fuel, 
  Wind, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  BarChart4 
} from "lucide-react";

interface RouteDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  route?: RouteData;
}

export function RouteDetails({ isOpen, onClose, route }: RouteDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (!route) return null;
  
  const formatDistance = (distance: number) => {
    return `${distance.toFixed(1)} miles`;
  };

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;
    return `${hours}h ${minutes}m`;
  };

  const formatFuelConsumption = (fuelAmount?: number) => {
    return fuelAmount ? `${fuelAmount.toFixed(1)} gal` : "N/A";
  };

  const formatEmissions = (emissions?: number) => {
    return emissions ? `${emissions.toFixed(1)} kg CO₂` : "N/A";
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Active</Badge>;
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">Scheduled</Badge>;
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">Completed</Badge>;
      case "in_progress":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">In Progress</Badge>;
      case "delayed":
        return <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">Delayed</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">Cancelled</Badge>;
      case "optimized":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">Optimized</Badge>;
      case "planned":
        return <Badge className="bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-300">Planned</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Mock data for the stops
  const stopsList = [
    { id: 1, name: "Los Angeles Distribution Center", status: "completed", arrivalTime: "08:00", departureTime: "08:15" },
    { id: 2, name: "San Diego, CA", status: "completed", arrivalTime: "10:45", departureTime: "11:30" },
    { id: 3, name: "Irvine, CA", status: "active", arrivalTime: "12:30", departureTime: "13:15" },
    { id: 4, name: "Bakersfield, CA", status: "pending", arrivalTime: "15:30", departureTime: "16:15" },
    { id: 5, name: "Los Angeles Distribution Center", status: "pending", arrivalTime: "18:00", departureTime: "-" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{route.name}</DialogTitle>
              <DialogDescription className="text-sm flex items-center mt-1">
                <RouteIcon className="h-4 w-4 mr-1" />
                {route.id} • {getStatusBadge(route.status)}
              </DialogDescription>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">{formatDistance(route.distance)}</div>
              <div className="text-sm text-muted-foreground">{formatDuration(route.duration)}</div>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="stops">Stops & Schedule</TabsTrigger>
            <TabsTrigger value="metrics">Metrics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Route Information</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>Start Location</span>
                      </div>
                      <div className="font-medium">{route.startLocation}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>End Location</span>
                      </div>
                      <div className="font-medium">{route.endLocation}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <RouteIcon className="h-4 w-4 mr-2" />
                        <span>Total Stops</span>
                      </div>
                      <div className="font-medium">{route.stops}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>Departure Date</span>
                      </div>
                      <div className="font-medium">{route.departureDate || "N/A"}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Departure Time</span>
                      </div>
                      <div className="font-medium">{route.departureTime || "N/A"}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Vehicle & Driver</h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Truck className="h-4 w-4 mr-2" />
                        <span>Vehicle</span>
                      </div>
                      <div className="font-medium">{route.vehicle}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <User className="h-4 w-4 mr-2" />
                        <span>Driver</span>
                      </div>
                      <div className="font-medium">{route.driver}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Fuel className="h-4 w-4 mr-2" />
                        <span>Fuel Consumption</span>
                      </div>
                      <div className="font-medium">{formatFuelConsumption(route.fuelConsumption)}</div>
                    </div>
                    
                    <div className="flex justify-between">
                      <div className="flex items-center text-muted-foreground">
                        <Wind className="h-4 w-4 mr-2" />
                        <span>CO₂ Emissions</span>
                      </div>
                      <div className="font-medium">{formatEmissions(route.co2Emissions)}</div>
                    </div>
                  </div>
                  
                  {route.startTime && (
                    <>
                      <Separator className="my-4" />
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <div className="flex items-center text-muted-foreground">
                            <Clock className="h-4 w-4 mr-2" />
                            <span>Started At</span>
                          </div>
                          <div className="font-medium">{route.startTime}</div>
                        </div>
                        
                        {route.endTime && (
                          <div className="flex justify-between">
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-2" />
                              <span>Completed At</span>
                            </div>
                            <div className="font-medium">{route.endTime}</div>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </div>
            
            {(route.status === "active" || route.status === "completed") && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4">Route Progress</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium">Route Completion</span>
                        <span className="text-sm font-medium">{route.completionRate || 0}%</span>
                      </div>
                      <Progress value={route.completionRate || 0} className="h-2" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Distance</div>
                        <div className="text-2xl font-bold">{formatDistance(route.distance)}</div>
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Duration</div>
                        <div className="text-2xl font-bold">{formatDuration(route.duration)}</div>
                        {route.actualDuration && route.actualDuration !== route.duration && (
                          <div className={`text-xs ${route.actualDuration > route.duration ? 'text-red-500' : 'text-green-500'}`}>
                            {route.actualDuration > route.duration ? '+' : '-'}
                            {formatDuration(Math.abs(route.actualDuration - route.duration))} difference
                          </div>
                        )}
                      </div>
                      
                      <div>
                        <div className="text-xs text-muted-foreground mb-1">Stops</div>
                        <div className="text-2xl font-bold">
                          {route.status === "completed" ? route.stops : Math.ceil(route.stops * (route.completionRate || 0) / 100)} / {route.stops}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="stops" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Stops & Schedule</h3>
                
                <div className="space-y-6">
                  {stopsList.map((stop, index) => (
                    <div key={stop.id} className="flex items-start">
                      <div className="flex-shrink-0 mr-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          stop.status === "completed" ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300" :
                          stop.status === "active" ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300" :
                          "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                        }`}>
                          {stop.status === "completed" ? (
                            <CheckCircle2 className="h-5 w-5" />
                          ) : stop.status === "active" ? (
                            <Clock className="h-5 w-5" />
                          ) : (
                            <AlertCircle className="h-5 w-5" />
                          )}
                        </div>
                        {index < stopsList.length - 1 && (
                          <div className="h-16 w-0.5 bg-border ml-5 my-1"></div>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium">{stop.name}</div>
                            <div className="text-sm text-muted-foreground">
                              Stop {index + 1} of {stopsList.length}
                            </div>
                          </div>
                          <div className="text-sm font-medium">
                            {stop.status === "completed" ? (
                              <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>
                            ) : stop.status === "active" ? (
                              <Badge variant="outline" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">In Progress</Badge>
                            ) : (
                              <Badge variant="outline">Pending</Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex mt-2 text-sm text-muted-foreground">
                          <div className="flex items-center mr-4">
                            <MapPin className="h-3.5 w-3.5 mr-1" />
                            <span>{stop.name.split(" ")[0]}</span>
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1" />
                            <span>{stop.arrivalTime} - {stop.departureTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="metrics" className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Fuel className="h-5 w-5 mr-2" />
                    Fuel Metrics
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Estimated Consumption</span>
                      <span className="font-medium">{formatFuelConsumption(route.fuelConsumption)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel Efficiency</span>
                      <span className="font-medium">
                        {route.fuelConsumption ? (route.distance / route.fuelConsumption).toFixed(1) : "N/A"} mpg
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Fuel Cost (est.)</span>
                      <span className="font-medium">
                        ${route.fuelConsumption ? (route.fuelConsumption * 3.85).toFixed(2) : "N/A"}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium mb-4 flex items-center">
                    <Wind className="h-5 w-5 mr-2" />
                    Emissions
                  </h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Total CO₂ Emissions</span>
                      <span className="font-medium">{formatEmissions(route.co2Emissions)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CO₂ per Mile</span>
                      <span className="font-medium">
                        {route.co2Emissions ? (route.co2Emissions / route.distance).toFixed(2) : "N/A"} kg/mi
                      </span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Equivalent Trees</span>
                      <span className="font-medium">
                        {route.co2Emissions ? Math.ceil(route.co2Emissions / 21) : "N/A"} trees
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4 flex items-center">
                  <BarChart4 className="h-5 w-5 mr-2" />
                  Optimization Impact
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center">
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">-12%</div>
                    <div className="text-xs text-muted-foreground">Distance Savings</div>
                    <div className="text-sm font-medium mt-1">14.7 miles</div>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">-15%</div>
                    <div className="text-xs text-muted-foreground">Time Savings</div>
                    <div className="text-sm font-medium mt-1">32 minutes</div>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">-9%</div>
                    <div className="text-xs text-muted-foreground">Fuel Savings</div>
                    <div className="text-sm font-medium mt-1">1.2 gallons</div>
                  </div>
                  
                  <div className="bg-secondary/20 p-4 rounded-lg">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">-11%</div>
                    <div className="text-xs text-muted-foreground">CO₂ Reduction</div>
                    <div className="text-sm font-medium mt-1">12.3 kg</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end mt-6">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 