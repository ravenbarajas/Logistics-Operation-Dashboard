import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shipment } from "@shared/schema";
import { shipmentService } from "@/services/shipmentService";
import { fleetService } from "@/services/fleetService";

interface ShipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  shipment?: Shipment;
  onSuccess: () => void;
}

interface ShipmentFormData {
  trackingNumber: string;
  status: string;
  originLocation: { lat: number; lng: number };
  destinationLocation: { lat: number; lng: number };
  estimatedDelivery: string;
  actualDelivery: string;
  vehicleId: number | null;
}

export function ShipmentModal({ isOpen, onClose, shipment, onSuccess }: ShipmentModalProps) {
  const [formData, setFormData] = useState<ShipmentFormData>({
    trackingNumber: "",
    status: "pending",
    originLocation: { lat: 0, lng: 0 },
    destinationLocation: { lat: 0, lng: 0 },
    estimatedDelivery: "",
    actualDelivery: "",
    vehicleId: null
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
    if (shipment) {
      setFormData({
        trackingNumber: shipment.trackingNumber,
        status: shipment.status,
        originLocation: shipment.originLocation as { lat: number; lng: number } || { lat: 0, lng: 0 },
        destinationLocation: shipment.destinationLocation as { lat: number; lng: number } || { lat: 0, lng: 0 },
        estimatedDelivery: shipment.estimatedDelivery ? new Date(shipment.estimatedDelivery).toISOString().split('T')[0] : "",
        actualDelivery: shipment.actualDelivery ? new Date(shipment.actualDelivery).toISOString().split('T')[0] : "",
        vehicleId: shipment.vehicleId
      });
    } else {
      // Generate a random tracking number for new shipments
      const randomString = Math.random().toString(36).substring(2, 10).toUpperCase();
      setFormData({
        trackingNumber: `SHP${randomString}`,
        status: "pending",
        originLocation: { lat: 0, lng: 0 },
        destinationLocation: { lat: 0, lng: 0 },
        estimatedDelivery: "",
        actualDelivery: "",
        vehicleId: null
      });
    }
  }, [shipment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const shipmentData = {
        ...formData,
        estimatedDelivery: formData.estimatedDelivery ? new Date(formData.estimatedDelivery) : null,
        actualDelivery: formData.actualDelivery ? new Date(formData.actualDelivery) : null,
      };

      if (shipment) {
        await shipmentService.updateShipment(shipment.id, shipmentData);
      } else {
        await shipmentService.createShipment(shipmentData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save shipment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{shipment ? "Edit Shipment" : "Create New Shipment"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trackingNumber">Tracking Number</Label>
              <Input
                id="trackingNumber"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                required
                disabled={!!shipment} // Disable editing for existing shipments
              />
            </div>
            
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
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-transit">In Transit</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="delayed">Delayed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Origin Location</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="originLat" className="text-xs">Latitude</Label>
                <Input
                  id="originLat"
                  type="number"
                  step="0.0001"
                  value={formData.originLocation.lat}
                  onChange={(e) => setFormData({
                    ...formData,
                    originLocation: {
                      ...formData.originLocation,
                      lat: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="originLng" className="text-xs">Longitude</Label>
                <Input
                  id="originLng"
                  type="number"
                  step="0.0001"
                  value={formData.originLocation.lng}
                  onChange={(e) => setFormData({
                    ...formData,
                    originLocation: {
                      ...formData.originLocation,
                      lng: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Destination Location</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="destLat" className="text-xs">Latitude</Label>
                <Input
                  id="destLat"
                  type="number"
                  step="0.0001"
                  value={formData.destinationLocation.lat}
                  onChange={(e) => setFormData({
                    ...formData,
                    destinationLocation: {
                      ...formData.destinationLocation,
                      lat: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="destLng" className="text-xs">Longitude</Label>
                <Input
                  id="destLng"
                  type="number"
                  step="0.0001"
                  value={formData.destinationLocation.lng}
                  onChange={(e) => setFormData({
                    ...formData,
                    destinationLocation: {
                      ...formData.destinationLocation,
                      lng: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="estimatedDelivery">Estimated Delivery</Label>
              <Input
                id="estimatedDelivery"
                type="date"
                value={formData.estimatedDelivery}
                onChange={(e) => setFormData({ ...formData, estimatedDelivery: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="actualDelivery">Actual Delivery</Label>
              <Input
                id="actualDelivery"
                type="date"
                value={formData.actualDelivery}
                onChange={(e) => setFormData({ ...formData, actualDelivery: e.target.value })}
                disabled={formData.status !== 'delivered'} // Only enable if status is delivered
              />
            </div>
          </div>
          
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

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : shipment ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 