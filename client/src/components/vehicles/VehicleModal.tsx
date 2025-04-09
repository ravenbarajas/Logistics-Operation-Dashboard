import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Vehicle } from "@shared/schema";
import { fleetService } from "@/services/fleetService";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface VehicleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  vehicle?: Vehicle;
  onSubmit: (vehicle: any) => void;
}

interface VehicleFormData {
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

export function VehicleModal({ open, onOpenChange, vehicle, onSubmit }: VehicleModalProps) {
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
    assignedDriver: ""
  });
  const [activeTab, setActiveTab] = useState("basic");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    } else {
      setFormData({
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
        // Initialize new fields with defaults
        inspectionDate: "",
        insuranceProvider: "",
        insurancePolicy: "",
        purchaseDate: "",
        purchasePrice: "",
        warrantyExpiry: "",
        routeAssignment: "",
        dailyRate: "",
        fuelCardNumber: "",
        tollTagId: "",
        routingPreference: "standard",
        utilizationTarget: "85"
      });
    }
  }, [vehicle]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save vehicle");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[50vh] min-w-[30vw] overflow-y-auto z-[10000]">
        <DialogHeader>
          <DialogTitle className="text-xl">{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="pt-2">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="details">Vehicle Details</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="assignments">Assignments & Usage</TabsTrigger>
          </TabsList>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Vehicle Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) => setFormData({ ...formData, type: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[20000]" side="bottom">
                      <SelectItem value="Heavy Truck">Heavy Truck (Class 8)</SelectItem>
                      <SelectItem value="Medium Truck">Medium Truck (Class 6-7)</SelectItem>
                      <SelectItem value="Light Truck">Light Truck (Class 3-5)</SelectItem>
                      <SelectItem value="Box Truck">Box Truck</SelectItem>
                      <SelectItem value="Delivery Van">Delivery Van</SelectItem>
                      <SelectItem value="Cargo Van">Cargo Van</SelectItem>
                      <SelectItem value="Refrigerated">Refrigerated Truck</SelectItem>
                      <SelectItem value="Flatbed">Flatbed Truck</SelectItem>
                      <SelectItem value="Electric Van">Electric Van</SelectItem>
                      <SelectItem value="Pickup">Pickup Truck</SelectItem>
                      <SelectItem value="Passenger Car">Passenger Car</SelectItem>
                      <SelectItem value="SUV">SUV</SelectItem>
                    </SelectContent>
                  </Select>
                  {!formData.type && <p className="text-sm text-red-500">Please select a type</p>}
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
                    <SelectContent position="popper" sideOffset={5} className="z-[20000]" side="bottom">
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="on_route">On Route</SelectItem>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="maintenance">In Maintenance</SelectItem>
                      <SelectItem value="repair">In Repair</SelectItem>
                      <SelectItem value="inspection">Under Inspection</SelectItem>
                      <SelectItem value="cleaning">In Cleaning</SelectItem>
                      <SelectItem value="fueling">Fueling</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                      <SelectItem value="out_of_service">Out of Service</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="departmentName">Department</Label>
                  <Select
                    value={formData.departmentName}
                    onValueChange={(value) => setFormData({ ...formData, departmentName: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[20000]" side="bottom">
                      <SelectItem value="Distribution">Distribution</SelectItem>
                      <SelectItem value="Local Delivery">Local Delivery</SelectItem>
                      <SelectItem value="Long Haul">Long Haul Transport</SelectItem>
                      <SelectItem value="Sales">Sales</SelectItem>
                      <SelectItem value="Support">Technical Support</SelectItem>
                      <SelectItem value="Administration">Administration</SelectItem>
                      <SelectItem value="Executive">Executive</SelectItem>
                      <SelectItem value="Maintenance">Maintenance</SelectItem>
                      <SelectItem value="Warehouse">Warehouse</SelectItem>
                      <SelectItem value="Customer Service">Customer Service</SelectItem>
                      <SelectItem value="Specialized Delivery">Specialized Delivery</SelectItem>
                      <SelectItem value="Express Delivery">Express Delivery</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="lastMaintenance">Last Maintenance Date</Label>
                  <Input
                    id="lastMaintenance"
                    type="date"
                    value={formData.lastMaintenance}
                    onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nextMaintenance">Next Maintenance Date</Label>
                  <Input
                    id="nextMaintenance"
                    type="date"
                    value={formData.nextMaintenance}
                    onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="details" className="space-y-4">
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
                    min="1980"
                    max="2030"
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
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fuelLevel">Fuel Level (%)</Label>
                  <Input
                    id="fuelLevel"
                    type="number"
                    value={formData.fuelLevel}
                    onChange={(e) => setFormData({ ...formData, fuelLevel: e.target.value })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                
                <div className="space-y-2">
                  <Label htmlFor="inspectionDate">Last Inspection Date</Label>
                  <Input
                    id="inspectionDate"
                    type="date"
                    value={formData.inspectionDate || ""}
                    onChange={(e) => setFormData({ ...formData, inspectionDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="insuranceProvider">Insurance Provider</Label>
                  <Input
                    id="insuranceProvider"
                    value={formData.insuranceProvider || ""}
                    onChange={(e) => setFormData({ ...formData, insuranceProvider: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="insurancePolicy">Insurance Policy Number</Label>
                  <Input
                    id="insurancePolicy"
                    value={formData.insurancePolicy || ""}
                    onChange={(e) => setFormData({ ...formData, insurancePolicy: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="purchaseDate">Purchase Date</Label>
                  <Input
                    id="purchaseDate"
                    type="date"
                    value={formData.purchaseDate || ""}
                    onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Purchase Price ($)</Label>
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={formData.purchasePrice || ""}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="warrantyExpiry">Warranty Expiry Date</Label>
                  <Input
                    id="warrantyExpiry"
                    type="date"
                    value={formData.warrantyExpiry || ""}
                    onChange={(e) => setFormData({ ...formData, warrantyExpiry: e.target.value })}
                  />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="assignments" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="assignedDriver">Assigned Driver</Label>
                  <Select
                    value={formData.assignedDriver}
                    onValueChange={(value) => setFormData({ ...formData, assignedDriver: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[20000]" side="bottom">
                      <SelectItem value="unassigned">None (Unassigned)</SelectItem>
                      <SelectItem value="John Doe">John Doe (ID: D-1001)</SelectItem>
                      <SelectItem value="Jane Smith">Jane Smith (ID: D-1002)</SelectItem>
                      <SelectItem value="Mike Johnson">Mike Johnson (ID: D-1003)</SelectItem>
                      <SelectItem value="Sarah Williams">Sarah Williams (ID: D-1004)</SelectItem>
                      <SelectItem value="Robert Davis">Robert Davis (ID: D-1005)</SelectItem>
                      <SelectItem value="Emily Brown">Emily Brown (ID: D-1006)</SelectItem>
                      <SelectItem value="David Wilson">David Wilson (ID: D-1007)</SelectItem>
                      <SelectItem value="Lisa Thompson">Lisa Thompson (ID: D-1008)</SelectItem>
                      <SelectItem value="Michael Garcia">Michael Garcia (ID: D-1009)</SelectItem>
                      <SelectItem value="Jessica Martinez">Jessica Martinez (ID: D-1010)</SelectItem>
                      <SelectItem value="James Rodriguez">James Rodriguez (ID: D-1011)</SelectItem>
                      <SelectItem value="Patricia Lewis">Patricia Lewis (ID: D-1012)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="routeAssignment">Current Route Assignment</Label>
                  <Select
                    value={formData.routeAssignment || "unassigned"}
                    onValueChange={(value) => setFormData({ ...formData, routeAssignment: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select route" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[20000]" side="bottom">
                      <SelectItem value="unassigned">Unassigned</SelectItem>
                      <SelectItem value="route-1001">Downtown Delivery (RT-1001)</SelectItem>
                      <SelectItem value="route-1002">North District (RT-1002)</SelectItem>
                      <SelectItem value="route-1003">South Loop (RT-1003)</SelectItem>
                      <SelectItem value="route-1004">East Commercial Zone (RT-1004)</SelectItem>
                      <SelectItem value="route-1005">West Residential Area (RT-1005)</SelectItem>
                      <SelectItem value="route-1006">Central Business District (RT-1006)</SelectItem>
                      <SelectItem value="route-1007">Industrial Park (RT-1007)</SelectItem>
                      <SelectItem value="route-1008">Airport Express (RT-1008)</SelectItem>
                      <SelectItem value="route-1009">Port Logistics (RT-1009)</SelectItem>
                      <SelectItem value="route-1010">Interstate Line (RT-1010)</SelectItem>
                      <SelectItem value="route-1011">Regional Distribution (RT-1011)</SelectItem>
                      <SelectItem value="route-1012">Suburban Loop (RT-1012)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">Daily Usage Rate</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    value={formData.dailyRate || ""}
                    onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
                    min="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fuelCardNumber">Fuel Card Number</Label>
                  <Input
                    id="fuelCardNumber"
                    value={formData.fuelCardNumber || ""}
                    onChange={(e) => setFormData({ ...formData, fuelCardNumber: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tollTagId">Toll Tag ID</Label>
                  <Input
                    id="tollTagId"
                    value={formData.tollTagId || ""}
                    onChange={(e) => setFormData({ ...formData, tollTagId: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="avoidHighways">Routing Preferences</Label>
                  <Select
                    value={formData.routingPreference || "standard"}
                    onValueChange={(value) => setFormData({ ...formData, routingPreference: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select preference" />
                    </SelectTrigger>
                    <SelectContent position="popper" sideOffset={5} className="z-[20000]" side="bottom">
                      <SelectItem value="standard">Standard Routing</SelectItem>
                      <SelectItem value="fastest">Fastest Route</SelectItem>
                      <SelectItem value="shortest">Shortest Distance</SelectItem>
                      <SelectItem value="eco">Eco-Friendly (Fuel Efficient)</SelectItem>
                      <SelectItem value="avoid-highways">Avoid Highways</SelectItem>
                      <SelectItem value="avoid-tolls">Avoid Tolls</SelectItem>
                      <SelectItem value="avoid-traffic">Avoid Traffic</SelectItem>
                      <SelectItem value="avoid-urban">Avoid Urban Centers</SelectItem>
                      <SelectItem value="commercial-vehicle">Commercial Vehicle Routes</SelectItem>
                      <SelectItem value="hazmat">Hazardous Materials Route</SelectItem>
                      <SelectItem value="low-clearance">Low Clearance Route</SelectItem>
                      <SelectItem value="no-uturn">No U-Turns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="utilizationTarget">Utilization Target (%)</Label>
                  <Input
                    id="utilizationTarget"
                    type="number"
                    value={formData.utilizationTarget || "85"}
                    onChange={(e) => setFormData({ ...formData, utilizationTarget: e.target.value })}
                    min="0"
                    max="100"
                  />
                </div>
              </div>
            </TabsContent>
            
            {error && <p className="text-sm text-red-500">{error}</p>}

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : vehicle ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
} 