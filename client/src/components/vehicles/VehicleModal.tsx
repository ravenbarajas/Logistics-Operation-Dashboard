import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Vehicle } from "@shared/schema";
import { VehicleForm } from "./VehicleForm";

interface VehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle;
  onSubmit: (vehicle: any) => void;
}

export function VehicleModal({ open, onOpenChange, vehicle, onSubmit }: VehicleModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (vehicleData: any) => {
    setLoading(true);
    setError(null);

    try {
      await onSubmit(vehicleData);
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[80vh] min-w-[30vw] overflow-y-auto z-[10000]">
        <DialogHeader>
          <DialogTitle className="text-xl">{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </DialogHeader>
        
        <VehicleForm
          vehicle={vehicle}
          onSubmit={handleSubmit}
          onCancel={() => onOpenChange(false)}
          loading={loading}
        />
      </DialogContent>
    </Dialog>
  );
} 