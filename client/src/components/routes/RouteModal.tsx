import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Route } from "@shared/schema";
import { routeService } from "@/services/routeService";
import { fleetService } from "@/services/fleetService";

interface RouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  route?: Route;
  onSuccess: () => void;
}

interface RouteFormData {
  vehicleId: number | null;
  startLocation: { lat: number; lng: number };
  endLocation: { lat: number; lng: number };
  status: string;
  distance: string;
  estimatedDuration: number;
  actualDuration: number | null;
}

export function RouteModal({ isOpen, onClose, route, onSuccess }: RouteModalProps) {
  const [formData, setFormData] = useState<RouteFormData>({
    vehicleId: null,
    startLocation: { lat: 0, lng: 0 },
    endLocation: { lat: 0, lng: 0 },
    status: "planned",
    distance: "0",
    estimatedDuration: 0,
    actualDuration: null
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);

  useEffect(() => {
    // Fetch vehicles for dropdown
    const fetchVehicles = async () => {
      setLoadingVehicles(true);
      try {
        const vehiclesData = await fleetService.getVehicles();
        setVehicles(vehiclesData);
      } catch (err) {
        console.error("Failed to load vehicles:", err);
      } finally {
        setLoadingVehicles(false);
      }
    };

    fetchVehicles();
  }, []);

  useEffect(() => {
    if (route) {
      setFormData({
        vehicleId: route.vehicleId,
        startLocation: route.startLocation as { lat: number; lng: number } || { lat: 0, lng: 0 },
        endLocation: route.endLocation as { lat: number; lng: number } || { lat: 0, lng: 0 },
        status: route.status || "planned",
        distance: route.distance || "0",
        estimatedDuration: route.estimatedDuration || 0,
        actualDuration: route.actualDuration
      });
    } else {
      setFormData({
        vehicleId: null,
        startLocation: { lat: 0, lng: 0 },
        endLocation: { lat: 0, lng: 0 },
        status: "planned",
        distance: "0",
        estimatedDuration: 0,
        actualDuration: null
      });
    }
  }, [route]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate
    if (parseFloat(formData.distance) < 0) {
      setError("Distance cannot be negative");
      setLoading(false);
      return;
    }

    if (formData.estimatedDuration < 0) {
      setError("Estimated duration cannot be negative");
      setLoading(false);
      return;
    }

    if (formData.actualDuration !== null && formData.actualDuration < 0) {
      setError("Actual duration cannot be negative");
      setLoading(false);
      return;
    }

    try {
      if (route) {
        await routeService.updateRoute(route.id, formData);
      } else {
        await routeService.createRoute(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save route");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{route ? "Edit Route" : "Create New Route"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleId">Assigned Vehicle</Label>
            <Select
              value={formData.vehicleId?.toString() || "unassigned"}
              onValueChange={(value) => setFormData({ 
                ...formData, 
                vehicleId: value === "unassigned" ? null : parseInt(value) 
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingVehicles ? "Loading vehicles..." : "Select vehicle"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="unassigned">None</SelectItem>
                {vehicles.filter(v => v.status === 'active').map((vehicle) => (
                  <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                    {vehicle.name} ({vehicle.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label>Start Location</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="startLat" className="text-xs">Latitude</Label>
                <Input
                  id="startLat"
                  type="number"
                  step="0.0001"
                  value={formData.startLocation.lat}
                  onChange={(e) => setFormData({
                    ...formData,
                    startLocation: {
                      ...formData.startLocation,
                      lat: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="startLng" className="text-xs">Longitude</Label>
                <Input
                  id="startLng"
                  type="number"
                  step="0.0001"
                  value={formData.startLocation.lng}
                  onChange={(e) => setFormData({
                    ...formData,
                    startLocation: {
                      ...formData.startLocation,
                      lng: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>End Location</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="endLat" className="text-xs">Latitude</Label>
                <Input
                  id="endLat"
                  type="number"
                  step="0.0001"
                  value={formData.endLocation.lat}
                  onChange={(e) => setFormData({
                    ...formData,
                    endLocation: {
                      ...formData.endLocation,
                      lat: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="endLng" className="text-xs">Longitude</Label>
                <Input
                  id="endLng"
                  type="number"
                  step="0.0001"
                  value={formData.endLocation.lng}
                  onChange={(e) => setFormData({
                    ...formData,
                    endLocation: {
                      ...formData.endLocation,
                      lng: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="planned">Planned</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="distance">Distance (miles)</Label>
              <Input
                id="distance"
                type="text"
                pattern="^[0-9]*\.?[0-9]+$"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="estimatedDuration">Estimated Duration (minutes)</Label>
              <Input
                id="estimatedDuration"
                type="number"
                min="0"
                value={formData.estimatedDuration}
                onChange={(e) => setFormData({ ...formData, estimatedDuration: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
          </div>
          
          {formData.status === 'completed' && (
            <div className="space-y-2">
              <Label htmlFor="actualDuration">Actual Duration (minutes)</Label>
              <Input
                id="actualDuration"
                type="number"
                min="0"
                value={formData.actualDuration || ''}
                onChange={(e) => setFormData({ ...formData, actualDuration: parseInt(e.target.value) || null })}
                required={formData.status === 'completed'}
              />
            </div>
          )}

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : route ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 