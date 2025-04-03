import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Warehouse } from "@shared/schema";
import { warehouseService } from "@/services/warehouseService";

interface WarehouseModalProps {
  isOpen: boolean;
  onClose: () => void;
  warehouse?: Warehouse;
  onSuccess: () => void;
}

interface WarehouseFormData {
  name: string;
  location: { lat: number; lng: number };
  capacity: number;
  currentUsage: number;
  status: string;
}

export function WarehouseModal({ isOpen, onClose, warehouse, onSuccess }: WarehouseModalProps) {
  const [formData, setFormData] = useState<WarehouseFormData>({
    name: "",
    location: { lat: 0, lng: 0 },
    capacity: 0,
    currentUsage: 0,
    status: "active"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (warehouse) {
      setFormData({
        name: warehouse.name,
        location: warehouse.location as { lat: number; lng: number } || { lat: 0, lng: 0 },
        capacity: warehouse.capacity,
        currentUsage: warehouse.currentUsage,
        status: warehouse.status
      });
    } else {
      setFormData({
        name: "",
        location: { lat: 0, lng: 0 },
        capacity: 10000,
        currentUsage: 0,
        status: "active"
      });
    }
  }, [warehouse]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate form
    if (formData.capacity <= 0) {
      setError("Capacity must be greater than 0");
      setLoading(false);
      return;
    }

    if (formData.currentUsage < 0 || formData.currentUsage > formData.capacity) {
      setError("Current usage must be between 0 and capacity");
      setLoading(false);
      return;
    }

    try {
      if (warehouse) {
        await warehouseService.updateWarehouse(warehouse.id, formData);
      } else {
        await warehouseService.createWarehouse(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save warehouse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{warehouse ? "Edit Warehouse" : "Add New Warehouse"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Warehouse Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label>Location</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="latitude" className="text-xs">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.0001"
                  value={formData.location.lat}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      lat: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
              <div>
                <Label htmlFor="longitude" className="text-xs">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.0001"
                  value={formData.location.lng}
                  onChange={(e) => setFormData({
                    ...formData,
                    location: {
                      ...formData.location,
                      lng: parseFloat(e.target.value) || 0
                    }
                  })}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                min="0"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentUsage">Current Usage</Label>
              <Input
                id="currentUsage"
                type="number"
                min="0"
                max={formData.capacity}
                value={formData.currentUsage}
                onChange={(e) => setFormData({ ...formData, currentUsage: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
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
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : warehouse ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 