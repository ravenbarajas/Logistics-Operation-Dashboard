import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { X, Plus, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoutePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (routeData: any) => void;
}

export function RoutePlanModal({ isOpen, onClose, onSuccess }: RoutePlanModalProps) {
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
      createdAt: new Date().toISOString()
    };
    
    if (onSuccess) {
      onSuccess(newRouteData);
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Route Plan</DialogTitle>
          <DialogDescription>
            Define your route parameters and see the optimized results
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-3 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="stops">Delivery Stops</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div>
              <Label htmlFor="route-name">Route Name</Label>
              <Input 
                id="route-name" 
                value={routeData.name} 
                onChange={(e) => setRouteData({...routeData, name: e.target.value})}
                placeholder="Enter a name for this route"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="start-location">Start Location</Label>
              <Input 
                id="start-location" 
                value={routeData.startLocation} 
                onChange={(e) => setRouteData({...routeData, startLocation: e.target.value})}
                placeholder="Enter start location"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="end-location">End Location (Optional)</Label>
              <Input 
                id="end-location" 
                value={routeData.endLocation} 
                onChange={(e) => setRouteData({...routeData, endLocation: e.target.value})}
                placeholder="Enter end location"
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="vehicle-type">Vehicle Type</Label>
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
                <Label htmlFor="driver">Driver</Label>
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="departure-time">Departure Time</Label>
                <Input 
                  id="departure-time" 
                  type="time" 
                  value={routeData.departureTime} 
                  onChange={(e) => setRouteData({...routeData, departureTime: e.target.value})}
                  className="mt-1.5"
                />
              </div>

              <div>
                <Label htmlFor="departure-date">Departure Date</Label>
                <Input 
                  id="departure-date" 
                  type="date" 
                  value={routeData.departureDate} 
                  onChange={(e) => setRouteData({...routeData, departureDate: e.target.value})}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => setActiveTab("stops")}>Next</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="stops" className="space-y-4">
            <div className="space-y-3">
              <Label>Delivery Stops</Label>
              {stops.map((stop) => (
                <div key={stop.id} className="flex items-center gap-2 bg-secondary/20 p-2 rounded-md">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-primary" />
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
                    <SelectTrigger className="w-28">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="high">
                        <div className="flex items-center">
                          <Badge variant="secondary" className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 mr-2">High</Badge>
                          Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center">
                          <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 mr-2">Med</Badge>
                          Priority
                        </div>
                      </SelectItem>
                      <SelectItem value="low">
                        <div className="flex items-center">
                          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 mr-2">Low</Badge>
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
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <Button variant="outline" className="w-full mt-2" onClick={addStop}>
                <Plus className="h-4 w-4 mr-2" />
                Add Another Stop
              </Button>
            </div>

            <div className="flex justify-between space-x-2 pt-4">
              <Button variant="outline" onClick={() => setActiveTab("basic")}>Previous</Button>
              <Button onClick={() => setActiveTab("preferences")}>Next</Button>
            </div>
          </TabsContent>
          
          <TabsContent value="preferences" className="space-y-4">
            <div>
              <Label>Optimization Priority</Label>
              <div className="space-y-6 mt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Distance</span>
                    <span className="text-sm font-medium">
                      {routeData.priorities.distance <= 20 ? "Very Low" :
                       routeData.priorities.distance <= 40 ? "Low" :
                       routeData.priorities.distance <= 60 ? "Medium" :
                       routeData.priorities.distance <= 80 ? "High" : "Very High"}
                    </span>
                  </div>
                  <Slider 
                    value={[routeData.priorities.distance]} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => setRouteData({
                      ...routeData, 
                      priorities: {...routeData.priorities, distance: value[0]} 
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Time</span>
                    <span className="text-sm font-medium">
                      {routeData.priorities.time <= 20 ? "Very Low" :
                       routeData.priorities.time <= 40 ? "Low" :
                       routeData.priorities.time <= 60 ? "Medium" :
                       routeData.priorities.time <= 80 ? "High" : "Very High"}
                    </span>
                  </div>
                  <Slider 
                    value={[routeData.priorities.time]} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => setRouteData({
                      ...routeData, 
                      priorities: {...routeData.priorities, time: value[0]} 
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Fuel Efficiency</span>
                    <span className="text-sm font-medium">
                      {routeData.priorities.fuelEfficiency <= 20 ? "Very Low" :
                       routeData.priorities.fuelEfficiency <= 40 ? "Low" :
                       routeData.priorities.fuelEfficiency <= 60 ? "Medium" :
                       routeData.priorities.fuelEfficiency <= 80 ? "High" : "Very High"}
                    </span>
                  </div>
                  <Slider 
                    value={[routeData.priorities.fuelEfficiency]} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => setRouteData({
                      ...routeData, 
                      priorities: {...routeData.priorities, fuelEfficiency: value[0]} 
                    })}
                  />
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">CO2 Emissions</span>
                    <span className="text-sm font-medium">
                      {routeData.priorities.emissions <= 20 ? "Very Low" :
                       routeData.priorities.emissions <= 40 ? "Low" :
                       routeData.priorities.emissions <= 60 ? "Medium" :
                       routeData.priorities.emissions <= 80 ? "High" : "Very High"}
                    </span>
                  </div>
                  <Slider 
                    value={[routeData.priorities.emissions]} 
                    max={100} 
                    step={1} 
                    onValueChange={(value) => setRouteData({
                      ...routeData, 
                      priorities: {...routeData.priorities, emissions: value[0]} 
                    })}
                  />
                </div>
              </div>
            </div>

            <DialogFooter className="flex justify-between space-x-2 pt-4">
              <Button variant="outline" onClick={() => setActiveTab("stops")}>Previous</Button>
              <Button onClick={handleSubmit}>Create Route Plan</Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 