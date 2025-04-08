import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { X, Plus, MapPin, Calendar, Clock, User, Truck, List, Sliders, LayoutGrid, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface RoutePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: (routeData: any) => void;
}

export function RoutePlanModal({ isOpen, onClose, onSave }: RoutePlanModalProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [stops, setStops] = useState([
    { id: 1, address: "San Diego, CA", priority: "high" },
    { id: 2, address: "Irvine, CA", priority: "medium" },
    { id: 3, address: "Bakersfield, CA", priority: "low" },
  ]);
  const [routeData, setRouteData] = useState({
    name: "Los Angeles to San Francisco Route",
    startLocation: "Los Angeles Distribution Center",
    endLocation: "Los Angeles Distribution Center",
    vehicleType: "truck_medium",
    departureTime: "08:00",
    departureDate: "2023-09-15",
    driver: "michael",
    routeType: "delivery",
    priorities: {
      distance: 80,
      time: 90,
      fuelEfficiency: 60,
      emissions: 50
    }
  });

  const addStop = () => {
    const newId = stops.length > 0 ? Math.max(...stops.map(s => s.id)) + 1 : 1;
    setStops([...stops, { id: newId, address: "", priority: "medium" }]);
  };

  const removeStop = (id: number) => {
    setStops(stops.filter(stop => stop.id !== id));
  };

  const updateStop = (id: number, address: string) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, address } : stop
    ));
  };

  const updateStopPriority = (id: number, priority: string) => {
    setStops(stops.map(stop => 
      stop.id === id ? { ...stop, priority } : stop
    ));
  };

  const handleSubmit = () => {
    const newRouteData = {
      ...routeData,
      stops,
      id: `RT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: "scheduled",
      createdAt: new Date().toISOString(),
      vehicle: getVehicleLabel(routeData.vehicleType),
      driver: getDriverName(routeData.driver),
      distance: calculateEstimatedDistance(),
      duration: calculateEstimatedDuration()
    };
    
    if (onSave) {
      onSave(newRouteData);
    }
    onClose();
  };

  const getVehicleLabel = (vehicleType: string) => {
    switch (vehicleType) {
      case "truck_large": return "Large Truck (53ft)";
      case "truck_medium": return "Medium Truck (26ft)";
      case "van": return "Delivery Van";
      case "ev_van": return "Electric Van";
      default: return vehicleType;
    }
  };

  const getDriverName = (driverId: string) => {
    switch (driverId) {
      case "michael": return "Michael Brown";
      case "sarah": return "Sarah Johnson";
      case "james": return "James Wilson";
      case "lisa": return "Lisa Chen";
      case "david": return "David Martinez";
      default: return driverId;
    }
  };

  const calculateEstimatedDistance = () => {
    // In a real app, this would calculate based on the stops
    return 120 + (stops.length * 15) + Math.floor(Math.random() * 50);
  };

  const calculateEstimatedDuration = () => {
    // In a real app, this would calculate based on the stops and distance
    return 90 + (stops.length * 25) + Math.floor(Math.random() * 30);
  };

  const getPriorityLabel = (value: number) => {
    if (value <= 20) return "Very Low";
    if (value <= 40) return "Low";
    if (value <= 60) return "Medium";
    if (value <= 80) return "High";
    return "Very High";
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "medium": return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "low": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default: return "";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-background">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-xl flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" /> Create New Route Plan
          </DialogTitle>
          <DialogDescription>
            Define your route parameters to optimize delivery efficiency
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-6 w-full">
            <TabsTrigger value="basic" className="flex items-center gap-2">
              <Truck className="h-4 w-4" /> Basic Info
            </TabsTrigger>
            <TabsTrigger value="stops" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> Delivery Stops
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Sliders className="h-4 w-4" /> Preferences
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-5">
            <div className="grid grid-cols-1 gap-5">
              <Card>
                <CardContent className="pt-5">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="route-name" className="text-sm font-medium">Route Name</Label>
                      <Input 
                        id="route-name" 
                        value={routeData.name} 
                        onChange={(e) => setRouteData({...routeData, name: e.target.value})}
                        placeholder="Enter a name for this route"
                        className="mt-1.5"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="start-location" className="text-sm font-medium">Start Location</Label>
                        <Input 
                          id="start-location" 
                          value={routeData.startLocation} 
                          onChange={(e) => setRouteData({...routeData, startLocation: e.target.value})}
                          placeholder="Enter start location"
                          className="mt-1.5"
                        />
                      </div>

                      <div>
                        <Label htmlFor="end-location" className="text-sm font-medium">End Location</Label>
                        <Input 
                          id="end-location" 
                          value={routeData.endLocation} 
                          onChange={(e) => setRouteData({...routeData, endLocation: e.target.value})}
                          placeholder="Enter end location (optional)"
                          className="mt-1.5"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicle-type" className="text-sm font-medium">Vehicle Type</Label>
                        <Select 
                          value={routeData.vehicleType} 
                          onValueChange={(value) => setRouteData({...routeData, vehicleType: value})}
                        >
                          <SelectTrigger id="vehicle-type" className="mt-1.5">
                            <SelectValue placeholder="Select vehicle type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="truck_large">Large Truck (53ft)</SelectItem>
                            <SelectItem value="truck_medium">Medium Truck (26ft)</SelectItem>
                            <SelectItem value="van">Delivery Van</SelectItem>
                            <SelectItem value="ev_van">Electric Van</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="driver" className="text-sm font-medium">Driver</Label>
                        <Select 
                          value={routeData.driver} 
                          onValueChange={(value) => setRouteData({...routeData, driver: value})}
                        >
                          <SelectTrigger id="driver" className="mt-1.5">
                            <SelectValue placeholder="Select driver" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="michael">Michael Brown</SelectItem>
                            <SelectItem value="sarah">Sarah Johnson</SelectItem>
                            <SelectItem value="james">James Wilson</SelectItem>
                            <SelectItem value="lisa">Lisa Chen</SelectItem>
                            <SelectItem value="david">David Martinez</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="departure-time" className="text-sm font-medium">Departure Time</Label>
                        <div className="flex items-center mt-1.5">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input 
                            id="departure-time" 
                            type="time" 
                            value={routeData.departureTime} 
                            onChange={(e) => setRouteData({...routeData, departureTime: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="departure-date" className="text-sm font-medium">Departure Date</Label>
                        <div className="flex items-center mt-1.5">
                          <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                          <Input 
                            id="departure-date" 
                            type="date" 
                            value={routeData.departureDate} 
                            onChange={(e) => setRouteData({...routeData, departureDate: e.target.value})}
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="route-type" className="text-sm font-medium">Route Type</Label>
                        <Select 
                          value={routeData.routeType} 
                          onValueChange={(value) => setRouteData({...routeData, routeType: value})}
                        >
                          <SelectTrigger id="route-type" className="mt-1.5">
                            <SelectValue placeholder="Select route type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="delivery">Delivery</SelectItem>
                            <SelectItem value="pickup">Pickup</SelectItem>
                            <SelectItem value="transfer">Transfer</SelectItem>
                            <SelectItem value="return">Return</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setActiveTab("stops")} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="stops" className="space-y-5">
            <Card>
              <CardContent className="pt-5">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-medium">Delivery Stops ({stops.length})</Label>
                    <Badge variant="outline" className="font-normal">
                      {stops.length} total stops
                    </Badge>
                  </div>
                  
                  <div className="space-y-3 max-h-[350px] overflow-y-auto pr-1">
                    {stops.map((stop, index) => (
                      <div key={stop.id} className="flex items-center gap-2 bg-accent/20 p-3 rounded-md shadow-sm">
                        <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <Badge variant="outline" className="h-5 w-5 flex items-center justify-center p-0 rounded-full">
                            {index + 1}
                          </Badge>
                        </div>
                        <Input 
                          value={stop.address}
                          onChange={(e) => updateStop(stop.id, e.target.value)}
                          placeholder="Enter stop address"
                          className="flex-grow"
                        />
                        <Select 
                          value={stop.priority} 
                          onValueChange={(value) => updateStopPriority(stop.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue placeholder="Priority" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high">
                              <div className="flex items-center">
                                <Badge variant="secondary" className={cn(getPriorityBadgeColor("high"), "mr-2")}>High</Badge>
                                Priority
                              </div>
                            </SelectItem>
                            <SelectItem value="medium">
                              <div className="flex items-center">
                                <Badge variant="secondary" className={cn(getPriorityBadgeColor("medium"), "mr-2")}>Med</Badge>
                                Priority
                              </div>
                            </SelectItem>
                            <SelectItem value="low">
                              <div className="flex items-center">
                                <Badge variant="secondary" className={cn(getPriorityBadgeColor("low"), "mr-2")}>Low</Badge>
                                Priority
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeStop(stop.id)}
                          disabled={stops.length <= 1}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full" onClick={addStop}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Another Stop
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between space-x-2 pt-4">
              <Button variant="outline" onClick={() => setActiveTab("basic")} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <Button onClick={() => setActiveTab("preferences")} className="gap-1">
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-5">
            <Card>
              <CardContent className="pt-5">
                <div className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Optimization Priorities</Label>
                    <p className="text-sm text-muted-foreground mb-4">Adjust these sliders to prioritize different aspects of your route</p>
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Distance</span>
                          <Badge variant="outline" className="font-normal">
                            {getPriorityLabel(routeData.priorities.distance)}
                          </Badge>
                        </div>
                        <Slider 
                          value={[routeData.priorities.distance]} 
                          max={100} 
                          step={1}
                          className="py-1"
                          onValueChange={(value) => setRouteData({
                            ...routeData, 
                            priorities: {...routeData.priorities, distance: value[0]} 
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Time</span>
                          <Badge variant="outline" className="font-normal">
                            {getPriorityLabel(routeData.priorities.time)}
                          </Badge>
                        </div>
                        <Slider 
                          value={[routeData.priorities.time]} 
                          max={100} 
                          step={1}
                          className="py-1"
                          onValueChange={(value) => setRouteData({
                            ...routeData, 
                            priorities: {...routeData.priorities, time: value[0]} 
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Fuel Efficiency</span>
                          <Badge variant="outline" className="font-normal">
                            {getPriorityLabel(routeData.priorities.fuelEfficiency)}
                          </Badge>
                        </div>
                        <Slider 
                          value={[routeData.priorities.fuelEfficiency]} 
                          max={100} 
                          step={1}
                          className="py-1"
                          onValueChange={(value) => setRouteData({
                            ...routeData, 
                            priorities: {...routeData.priorities, fuelEfficiency: value[0]} 
                          })}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Emissions Reduction</span>
                          <Badge variant="outline" className="font-normal">
                            {getPriorityLabel(routeData.priorities.emissions)}
                          </Badge>
                        </div>
                        <Slider 
                          value={[routeData.priorities.emissions]} 
                          max={100} 
                          step={1}
                          className="py-1"
                          onValueChange={(value) => setRouteData({
                            ...routeData, 
                            priorities: {...routeData.priorities, emissions: value[0]} 
                          })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-5">
                <div className="space-y-2">
                  <h3 className="text-base font-medium">Route Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Distance</p>
                      <p className="text-lg font-medium">{calculateEstimatedDistance()} miles</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Estimated Duration</p>
                      <p className="text-lg font-medium">{calculateEstimatedDuration()} minutes</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total Stops</p>
                      <p className="text-lg font-medium">{stops.length} locations</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Vehicle</p>
                      <p className="text-lg font-medium">{getVehicleLabel(routeData.vehicleType)}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <DialogFooter className="flex justify-between space-x-2 pt-4">
              <Button variant="outline" onClick={() => setActiveTab("stops")} className="gap-1">
                <ChevronLeft className="h-4 w-4" /> Previous
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button onClick={handleSubmit} className="gap-1 bg-primary">
                  Create Route
                </Button>
              </div>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 