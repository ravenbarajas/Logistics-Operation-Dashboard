import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleFormDetailsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function VehicleFormDetails({ formData, setFormData }: VehicleFormDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="make">Make</Label>
          <Input
            id="make"
            value={formData.make}
            onChange={(e) => setFormData({ ...formData, make: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            type="number"
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="vinNumber">VIN Number</Label>
          <Input
            id="vinNumber"
            value={formData.vinNumber}
            onChange={(e) => setFormData({ ...formData, vinNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="licensePlate">License Plate</Label>
          <Input
            id="licensePlate"
            value={formData.licensePlate}
            onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="mileage">Mileage</Label>
          <Input
            id="mileage"
            type="number"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fuelLevel">Fuel Level (%)</Label>
          <Input
            id="fuelLevel"
            type="number"
            min="0"
            max="100"
            value={formData.fuelLevel}
            onChange={(e) => setFormData({ ...formData, fuelLevel: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
} 