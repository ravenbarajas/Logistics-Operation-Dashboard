import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Inventory } from "@shared/schema";
import { inventoryService } from "@/services/inventoryService";
import { warehouseService } from "@/services/warehouseService";

interface InventoryItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item?: Inventory;
  onSuccess: () => void;
}

interface InventoryFormData {
  warehouseId: number;
  itemName: string;
  quantity: number;
  unit: string;
  lastUpdated?: Date;
}

export function InventoryItemModal({ isOpen, onClose, item, onSuccess }: InventoryItemModalProps) {
  const [formData, setFormData] = useState<InventoryFormData>({
    warehouseId: 0,
    itemName: "",
    quantity: 0,
    unit: "units"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [warehouses, setWarehouses] = useState<any[]>([]);
  const [loadingWarehouses, setLoadingWarehouses] = useState(false);

  useEffect(() => {
    // Fetch warehouses for dropdown
    const fetchWarehouses = async () => {
      setLoadingWarehouses(true);
      try {
        const warehousesData = await warehouseService.getWarehouses();
        setWarehouses(warehousesData);
      } catch (err) {
        console.error("Failed to load warehouses:", err);
      } finally {
        setLoadingWarehouses(false);
      }
    };

    fetchWarehouses();
  }, []);

  useEffect(() => {
    if (item) {
      setFormData({
        warehouseId: item.warehouseId,
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit || "units",
        lastUpdated: item.lastUpdated
      });
    } else {
      setFormData({
        warehouseId: warehouses.length > 0 ? warehouses[0].id : 0,
        itemName: "",
        quantity: 0,
        unit: "units",
        lastUpdated: new Date()
      });
    }
  }, [item, warehouses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate
    if (formData.quantity < 0) {
      setError("Quantity cannot be negative");
      setLoading(false);
      return;
    }

    try {
      const inventoryData = {
        ...formData,
        lastUpdated: new Date()
      };
      
      if (item) {
        await inventoryService.updateInventoryItem(item.id, inventoryData);
      } else {
        await inventoryService.createInventoryItem(inventoryData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save inventory item");
    } finally {
      setLoading(false);
    }
  };

  const unitOptions = ["units", "kg", "liters", "boxes", "pallets", "containers"];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{item ? "Edit Inventory Item" : "Add New Inventory Item"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="warehouse">Warehouse</Label>
            <Select
              value={formData.warehouseId.toString()}
              onValueChange={(value) => setFormData({ ...formData, warehouseId: parseInt(value) })}
              disabled={loadingWarehouses || warehouses.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingWarehouses ? "Loading warehouses..." : "Select warehouse"} />
              </SelectTrigger>
              <SelectContent>
                {warehouses.filter(w => w.status === 'active').map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id.toString()}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {warehouses.length === 0 && !loadingWarehouses && (
              <p className="text-sm text-amber-500">No active warehouses available. Please create a warehouse first.</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="itemName">Item Name</Label>
            <Input
              id="itemName"
              value={formData.itemName}
              onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="0"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select
                value={formData.unit}
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {unitOptions.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading || warehouses.length === 0}>
              {loading ? "Saving..." : item ? "Update" : "Create"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 