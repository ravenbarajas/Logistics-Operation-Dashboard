import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, Filter, Pencil, Trash2, FileText, Truck, CalendarClock, Fuel, Settings, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { fleetService, FleetSummary } from "@/services/fleetService";
import { Vehicle } from "@shared/schema";
import { VehicleModal } from "@/components/vehicles/VehicleModal";
import { EnhancedTable } from "@/components/table/EnhancedTable";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Extended Vehicle interface with additional properties that might be needed
interface ExtendedVehicle extends Vehicle {
  make?: string;
  model?: string;
  year?: number;
  fuelLevel?: number;
  mileage?: number;
}

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [fleetSummary, setFleetSummary] = useState<FleetSummary | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [summary, vehiclesData] = await Promise.all([
        fleetService.getFleetSummary(),
        fleetService.getVehicles()
      ]);
      setFleetSummary(summary);
      setVehicles(vehiclesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddVehicle = () => {
    setSelectedVehicle(undefined);
    setModalOpen(true);
  };

  const handleEditVehicle = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setModalOpen(true);
  };

  const handleDeleteVehicle = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    
    try {
      await fleetService.deleteVehicle(vehicleToDelete.id);
      await fetchData();
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete vehicle');
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    return matchesStatus;
  });

  // Define columns for the vehicle table
  const vehicleColumns = [
    {
      id: "id",
      header: "ID",
      accessorKey: "id",
      enableSorting: true,
      meta: {
        className: "w-[80px]"
      }
    },
    {
      id: "name",
      header: "Vehicle",
      accessorKey: "name",
      enableSorting: true,
      cell: (vehicle: ExtendedVehicle) => (
        <div>
          <div className="font-medium flex items-center">
            <Truck className="h-4 w-4 mr-2 text-primary" />
            {vehicle.name}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {vehicle.make || 'N/A'} {vehicle.model || ''} {vehicle.year ? `(${vehicle.year})` : ''}
          </div>
        </div>
      )
    },
    {
      id: "type",
      header: "Type",
      accessorKey: "type",
      enableSorting: true
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      enableSorting: true
    },
    {
      id: "lastMaintenance",
      header: "Last Maintenance",
      accessorKey: "lastMaintenance",
      enableSorting: true,
      cell: (vehicle: ExtendedVehicle) => (
        <div className="flex items-center">
          <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
          <span>
            {vehicle.lastMaintenance 
              ? (typeof vehicle.lastMaintenance === 'string' 
                ? vehicle.lastMaintenance 
                : new Date(vehicle.lastMaintenance).toLocaleDateString()) 
              : "N/A"}
          </span>
        </div>
      )
    },
    {
      id: "fuelLevel",
      header: "Fuel Level",
      accessorKey: "fuelLevel",
      enableSorting: true,
      meta: {
        align: "center" as const
      },
      cell: (vehicle: ExtendedVehicle) => (
        <div className="flex flex-col items-center">
          <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
            <div 
              className="bg-primary h-2 rounded-full" 
              style={{ width: `${vehicle.fuelLevel || 0}%` }}
            />
          </div>
          <div className="text-xs mt-1 text-muted-foreground">{vehicle.fuelLevel || 0}%</div>
        </div>
      )
    },
    {
      id: "mileage",
      header: "Mileage",
      accessorKey: "mileage",
      enableSorting: true,
      cell: (vehicle: ExtendedVehicle) => (
        <div>
          {vehicle.mileage ? vehicle.mileage.toLocaleString() : 0} mi
        </div>
      )
    }
  ];

  // Define actions for the vehicle table
  const vehicleActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: (vehicle: Vehicle) => console.log("View details", vehicle.id)
    },
    {
      label: "Maintenance Log",
      icon: <Settings className="h-4 w-4" />,
      onClick: (vehicle: Vehicle) => console.log("Maintenance log", vehicle.id)
    },
    {
      label: "Edit Vehicle",
      icon: <Pencil className="h-4 w-4" />,
      onClick: handleEditVehicle
    },
    {
      label: "Delete Vehicle",
      icon: <Trash2 className="h-4 w-4" />,
      onClick: handleDeleteVehicle,
      variant: "destructive" as const
    }
  ];

  // Status color map
  const statusColorMap = {
    active: { color: "green", label: "Active" },
    maintenance: { color: "amber", label: "Maintenance" },
    inactive: { color: "red", label: "Inactive" }
  };

  if (loading) {
    return <div className="container px-4 py-8">Loading...</div>;
  }

  if (error) {
    return (
      <div className="container px-4 py-8">
        <div className="text-red-500">Error: {error}</div>
        <Button onClick={fetchData} className="mt-4">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Fleet Management</h1>
        <div className="flex gap-2">
          <Button onClick={handleAddVehicle}>
            <Plus className="h-4 w-4 mr-2" />
            Add Vehicle
          </Button>
          <Button variant="outline" onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{fleetSummary?.totalVehicles}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{fleetSummary?.activeVehicles}</div>
            <p className="text-xs text-muted-foreground">{fleetSummary?.activePercentage}% of fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Maintenance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{fleetSummary?.inMaintenance}</div>
            <p className="text-xs text-muted-foreground">{fleetSummary?.maintenancePercentage}% of fleet</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{fleetSummary?.outOfService}</div>
            <p className="text-xs text-muted-foreground">{fleetSummary?.outOfServicePercentage}% of fleet</p>
          </CardContent>
        </Card>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Truck className="h-5 w-5 mr-2 text-primary" />
            Vehicle Inventory
          </CardTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex gap-2 ml-auto">
              <div className="flex items-center">
                <Filter className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm mr-2">Status:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="maintenance">Maintenance</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <EnhancedTable
            data={filteredVehicles}
            columns={vehicleColumns}
            actions={vehicleActions}
            searchKey="name"
            searchPlaceholder="Search vehicles..."
            statusKey="status"
            statusMap={statusColorMap}
            emptyMessage="No vehicles found"
          />
        </CardContent>
      </Card>
      
      <VehicleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={fetchData}
        vehicle={selectedVehicle}
      />
      
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vehicle {vehicleToDelete?.name}. 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}