import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Vehicle } from "@shared/schema";
import { VehicleFormBasic } from "./VehicleFormBasic";
import { VehicleFormDetails } from "./VehicleFormDetails";
import { VehicleFormDocuments } from "./VehicleFormDocuments";
import { VehicleFormAssignments } from "./VehicleFormAssignments";

interface VehicleFormProps {
  vehicle?: Vehicle;
  onSubmit: (vehicle: any) => void;
  onCancel: () => void;
  loading?: boolean;
}

export interface VehicleFormData {
  name: string;
  type: string;
  status: string;
  lastMaintenance: string;
  nextMaintenance: string;
  currentLocation: { lat: number; lng: number };
  make: string;
  model: string;
  year: string;
  vinNumber: string;
  licensePlate: string;
  mileage: string;
  fuelLevel: string;
  insuranceExpiry: string;
  registrationExpiry: string;
  departmentName: string;
  assignedDriver: string;
  inspectionDate?: string;
  insuranceProvider?: string;
  insurancePolicy?: string;
  purchaseDate?: string;
  purchasePrice?: string;
  warrantyExpiry?: string;
  routeAssignment?: string;
  dailyRate?: string;
  fuelCardNumber?: string;
  tollTagId?: string;
  routingPreference?: string;
  utilizationTarget?: string;
}

export function VehicleForm({ vehicle, onSubmit, onCancel, loading = false }: VehicleFormProps) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState<VehicleFormData>({
    name: "",
    type: "",
    status: "active",
    lastMaintenance: "",
    nextMaintenance: "",
    currentLocation: { lat: 0, lng: 0 },
    make: "",
    model: "",
    year: "",
    vinNumber: "",
    licensePlate: "",
    mileage: "0",
    fuelLevel: "100",
    insuranceExpiry: "",
    registrationExpiry: "",
    departmentName: "",
    assignedDriver: "",
    routingPreference: "standard",
    utilizationTarget: "85"
  });

  useEffect(() => {
    if (vehicle) {
      // Create a safe extended vehicle with type safety
      const extendedVehicle = vehicle as Vehicle & {
        make?: string;
        model?: string;
        year?: number;
        vinNumber?: string;
        licensePlate?: string;
        mileage?: number;
        fuelLevel?: number;
        insuranceExpiry?: Date;
        registrationExpiry?: Date;
        departmentName?: string;
        assignedDriver?: string;
        inspectionDate?: Date;
        insuranceProvider?: string;
        insurancePolicy?: string;
        purchaseDate?: Date;
        purchasePrice?: number;
        warrantyExpiry?: Date;
        routeAssignment?: string;
        dailyRate?: number;
        fuelCardNumber?: string;
        tollTagId?: string;
        routingPreference?: string;
        utilizationTarget?: number;
      };
      
      setFormData({
        name: vehicle.name || "",
        type: vehicle.type || "",
        status: vehicle.status || "active",
        lastMaintenance: vehicle.lastMaintenance ? new Date(vehicle.lastMaintenance).toISOString().split('T')[0] : "",
        nextMaintenance: vehicle.nextMaintenance ? new Date(vehicle.nextMaintenance).toISOString().split('T')[0] : "",
        currentLocation: vehicle.currentLocation as { lat: number; lng: number } || { lat: 0, lng: 0 },
        make: extendedVehicle.make || "",
        model: extendedVehicle.model || "",
        year: extendedVehicle.year ? extendedVehicle.year.toString() : "",
        vinNumber: extendedVehicle.vinNumber || "",
        licensePlate: extendedVehicle.licensePlate || "",
        mileage: extendedVehicle.mileage ? extendedVehicle.mileage.toString() : "0",
        fuelLevel: extendedVehicle.fuelLevel ? extendedVehicle.fuelLevel.toString() : "100",
        insuranceExpiry: extendedVehicle.insuranceExpiry ? new Date(extendedVehicle.insuranceExpiry).toISOString().split('T')[0] : "",
        registrationExpiry: extendedVehicle.registrationExpiry ? new Date(extendedVehicle.registrationExpiry).toISOString().split('T')[0] : "",
        departmentName: extendedVehicle.departmentName || "",
        assignedDriver: extendedVehicle.assignedDriver || "",
        // Initialize new fields
        inspectionDate: extendedVehicle.inspectionDate ? new Date(extendedVehicle.inspectionDate).toISOString().split('T')[0] : "",
        insuranceProvider: extendedVehicle.insuranceProvider || "",
        insurancePolicy: extendedVehicle.insurancePolicy || "",
        purchaseDate: extendedVehicle.purchaseDate ? new Date(extendedVehicle.purchaseDate).toISOString().split('T')[0] : "",
        purchasePrice: extendedVehicle.purchasePrice ? extendedVehicle.purchasePrice.toString() : "",
        warrantyExpiry: extendedVehicle.warrantyExpiry ? new Date(extendedVehicle.warrantyExpiry).toISOString().split('T')[0] : "",
        routeAssignment: extendedVehicle.routeAssignment || "",
        dailyRate: extendedVehicle.dailyRate ? extendedVehicle.dailyRate.toString() : "",
        fuelCardNumber: extendedVehicle.fuelCardNumber || "",
        tollTagId: extendedVehicle.tollTagId || "",
        routingPreference: extendedVehicle.routingPreference || "standard",
        utilizationTarget: extendedVehicle.utilizationTarget ? extendedVehicle.utilizationTarget.toString() : "85"
      });
    }
  }, [vehicle]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const vehicleData = {
      id: vehicle?.id, // Preserve ID if editing existing vehicle
      name: formData.name,
      type: formData.type,
      status: formData.status,
      lastMaintenance: formData.lastMaintenance ? new Date(formData.lastMaintenance) : null,
      nextMaintenance: formData.nextMaintenance ? new Date(formData.nextMaintenance) : null,
      currentLocation: formData.currentLocation,
      // Vehicle details
      make: formData.make,
      model: formData.model,
      year: formData.year ? parseInt(formData.year) : undefined,
      vinNumber: formData.vinNumber,
      licensePlate: formData.licensePlate,
      mileage: formData.mileage ? parseInt(formData.mileage) : 0,
      fuelLevel: formData.fuelLevel ? parseInt(formData.fuelLevel) : 100,
      // Documents
      insuranceExpiry: formData.insuranceExpiry ? new Date(formData.insuranceExpiry) : null,
      registrationExpiry: formData.registrationExpiry ? new Date(formData.registrationExpiry) : null,
      inspectionDate: formData.inspectionDate ? new Date(formData.inspectionDate) : null,
      insuranceProvider: formData.insuranceProvider,
      insurancePolicy: formData.insurancePolicy,
      purchaseDate: formData.purchaseDate ? new Date(formData.purchaseDate) : null,
      purchasePrice: formData.purchasePrice ? parseFloat(formData.purchasePrice) : undefined,
      warrantyExpiry: formData.warrantyExpiry ? new Date(formData.warrantyExpiry) : null,
      // Assignments & usage
      departmentName: formData.departmentName,
      assignedDriver: formData.assignedDriver,
      routeAssignment: formData.routeAssignment,
      dailyRate: formData.dailyRate ? parseFloat(formData.dailyRate) : undefined,
      fuelCardNumber: formData.fuelCardNumber,
      tollTagId: formData.tollTagId,
      routingPreference: formData.routingPreference,
      utilizationTarget: formData.utilizationTarget ? parseInt(formData.utilizationTarget) : 85
    };

    onSubmit(vehicleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="details">Vehicle Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="assignments">Assignments & Usage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="basic" className="space-y-4">
          <VehicleFormBasic formData={formData} setFormData={setFormData} />
        </TabsContent>
        
        <TabsContent value="details" className="space-y-4">
          <VehicleFormDetails formData={formData} setFormData={setFormData} />
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <VehicleFormDocuments formData={formData} setFormData={setFormData} />
        </TabsContent>
        
        <TabsContent value="assignments" className="space-y-4">
          <VehicleFormAssignments formData={formData} setFormData={setFormData} />
        </TabsContent>
      </Tabs>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="outline" type="button" onClick={onCancel} disabled={loading}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : (vehicle ? "Update Vehicle" : "Create Vehicle")}
        </Button>
      </div>
    </form>
  );
} 