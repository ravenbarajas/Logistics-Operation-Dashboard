import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface VehicleFormDocumentsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function VehicleFormDocuments({ formData, setFormData }: VehicleFormDocumentsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="insuranceExpiry">Insurance Expiry Date</Label>
          <Input
            id="insuranceExpiry"
            type="date"
            value={formData.insuranceExpiry}
            onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="registrationExpiry">Registration Expiry Date</Label>
          <Input
            id="registrationExpiry"
            type="date"
            value={formData.registrationExpiry}
            onChange={(e) => setFormData({ ...formData, registrationExpiry: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="inspectionDate">Last Inspection Date</Label>
          <Input
            id="inspectionDate"
            type="date"
            value={formData.inspectionDate}
            onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
          <Input
            id="warrantyExpiry"
            type="date"
            value={formData.warrantyExpiry}
            onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="insuranceProvider">Insurance Provider</Label>
          <Input
            id="insuranceProvider"
            value={formData.insuranceProvider}
            onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="insurancePolicy">Insurance Policy Number</Label>
          <Input
            id="insurancePolicy"
            value={formData.insurancePolicy}
            onChange={(e) => setFormData({ ...formData, insurancePolicy: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="purchaseDate">Purchase Date</Label>
          <Input
            id="purchaseDate"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="purchasePrice">Purchase Price</Label>
          <Input
            id="purchasePrice"
            type="number"
            min="0"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
} 