import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { fleetService } from "@/services/fleetService";
import { routeService } from "@/services/routeService";
import { Vehicle, Route } from "@shared/schema";
import { Loader2 } from "lucide-react";
import { RouteOptimizationParams } from "@/services/routeService";

interface RouteOptimizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (routes: Route[]) => void;
}

// Optimization strategies
const optimizationStrategies = [
  { value: "distance", label: "Shortest Distance" },
  { value: "time", label: "Fastest Route" },
  { value: "fuel", label: "Fuel Efficiency" },
  { value: "balanced", label: "Balanced (Distance/Time)" }
];

export function RouteOptimizationModal({ isOpen, onClose, onSuccess }: RouteOptimizationModalProps) {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedVehicles, setSelectedVehicles] = useState<number[]>([]);
  const [optimizationStrategy, setOptimizationStrategy] = useState<string>("distance");
  const [optimizationParams, setOptimizationParams] = useState({
    maxStops: 10,
    maxDistance: 500,
    avoidTolls: false,
    avoidHighways: false,
    prioritizeDeliveries: false
  });
  
  const [loading, setLoading] = useState(false);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch available vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const data = await fleetService.getVehicles();
        // Filter only available vehicles
        const availableVehicles = data.filter(v => v.status === 'available' || v.status === 'active');
        setVehicles(availableVehicles);
      } catch (err) {
        setError("Failed to load vehicles");
        console.error(err);
      } finally {
        setLoadingVehicles(false);
      }
    };

    if (isOpen) {
      fetchVehicles();
    }
  }, [isOpen]);

  const handleToggleVehicle = (vehicleId: number) => {
    setSelectedVehicles(prev => 
      prev.includes(vehicleId)
        ? prev.filter(id => id !== vehicleId)
        : [...prev, vehicleId]
    );
  };

  const handleOptimize = async () => {
    if (selectedVehicles.length === 0) {
      setError("Please select at least one vehicle");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Call the route optimization service
      const optimizedRoutes = await routeService.optimizeRoutes({
        vehicleIds: selectedVehicles,
        strategy: optimizationStrategy,
        maxStops: optimizationParams.maxStops,
        maxDistance: optimizationParams.maxDistance,
        avoidTolls: optimizationParams.avoidTolls,
        avoidHighways: optimizationParams.avoidHighways,
        prioritizeDeliveries: optimizationParams.prioritizeDeliveries
      });

      onSuccess(optimizedRoutes);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to optimize routes");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Optimize Routes</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="strategy">Optimization Strategy</Label>
            <Select
              value={optimizationStrategy}
              onValueChange={setOptimizationStrategy}
            >
              <SelectTrigger id="strategy">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                {optimizationStrategies.map(strategy => (
                  <SelectItem key={strategy.value} value={strategy.value}>
                    {strategy.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Optimization Parameters</Label>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxStops">Max Stops Per Route</Label>
                  <Input
                    id="maxStops"
                    type="number"
                    min="1"
                    max="50"
                    value={optimizationParams.maxStops}
                    onChange={(e) => setOptimizationParams({
                      ...optimizationParams,
                      maxStops: parseInt(e.target.value) || 10
                    })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxDistance">Max Distance (km)</Label>
                  <Input
                    id="maxDistance"
                    type="number"
                    min="1"
                    value={optimizationParams.maxDistance}
                    onChange={(e) => setOptimizationParams({
                      ...optimizationParams,
                      maxDistance: parseInt(e.target.value) || 500
                    })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avoidTolls"
                    checked={optimizationParams.avoidTolls}
                    onCheckedChange={(checked) => setOptimizationParams({
                      ...optimizationParams,
                      avoidTolls: checked === true
                    })}
                  />
                  <Label htmlFor="avoidTolls">Avoid Toll Roads</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="avoidHighways"
                    checked={optimizationParams.avoidHighways}
                    onCheckedChange={(checked) => setOptimizationParams({
                      ...optimizationParams,
                      avoidHighways: checked === true
                    })}
                  />
                  <Label htmlFor="avoidHighways">Avoid Highways</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="prioritizeDeliveries"
                    checked={optimizationParams.prioritizeDeliveries}
                    onCheckedChange={(checked) => setOptimizationParams({
                      ...optimizationParams,
                      prioritizeDeliveries: checked === true
                    })}
                  />
                  <Label htmlFor="prioritizeDeliveries">Prioritize Time-Sensitive Deliveries</Label>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Select Vehicles to Optimize</Label>
            {loadingVehicles ? (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
            ) : vehicles.length > 0 ? (
              <div className="border rounded-md p-2 max-h-[200px] overflow-y-auto">
                {vehicles.map(vehicle => (
                  <div key={vehicle.id} className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id={`vehicle-${vehicle.id}`}
                      checked={selectedVehicles.includes(vehicle.id)}
                      onCheckedChange={() => handleToggleVehicle(vehicle.id)}
                    />
                    <Label htmlFor={`vehicle-${vehicle.id}`} className="flex-1">
                      {vehicle.name} ({vehicle.type})
                    </Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No available vehicles found</p>
            )}
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleOptimize}
              disabled={loading || selectedVehicles.length === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Optimizing...
                </>
              ) : (
                "Optimize Routes"
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 