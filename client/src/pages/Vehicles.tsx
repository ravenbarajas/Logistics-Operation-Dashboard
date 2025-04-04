import { useState, useEffect } from "react";
import { Plus, RefreshCw, Search, Filter, Pencil, Trash2, FileText, Truck, CalendarClock, Fuel, Settings, AlertCircle, Map, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fleetService, FleetSummary } from "@/services/fleetService";
import { Vehicle } from "@shared/schema";
import { VehicleModal } from "@/components/vehicles/VehicleModal";
import { EnhancedTable } from "@/components/table/EnhancedTable";
import { FleetAnalytics } from "@/components/fleet/FleetAnalytics";
import { MaintenanceTracker } from "@/components/fleet/MaintenanceTracker";
import { FuelTracker } from "@/components/fleet/FuelTracker";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FleetMap } from "@/components/fleet/FleetMap";
import { ExtendedVehicle } from "@/types/vehicle";

// Sample maintenance records data
const maintenanceRecords = [
  {
    id: 1,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    type: "routine",
    status: "completed" as const,
    date: new Date('2023-12-15'),
    cost: 450,
    description: "Regular maintenance and oil change",
    technician: "Mike Johnson"
  },
  {
    id: 2,
    vehicleId: 2,
    vehicleName: "Delivery Van 1",
    type: "repair",
    status: "completed" as const,
    date: new Date('2023-11-28'),
    cost: 825,
    description: "Brake replacement and suspension check",
    technician: "Sarah Rodriguez"
  },
  {
    id: 3,
    vehicleId: 3,
    vehicleName: "Cargo Truck 1",
    type: "inspection",
    status: "scheduled" as const,
    date: new Date('2024-02-12'),
    description: "Annual safety inspection",
    technician: "Quality Fleet Services"
  },
  {
    id: 4,
    vehicleId: 4,
    vehicleName: "Refrigerated Truck",
    type: "emergency",
    status: "completed" as const,
    date: new Date('2024-01-05'),
    cost: 1250,
    description: "Cooling system repair",
    technician: "TechCool Repairs"
  },
  {
    id: 5,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    type: "routine",
    status: "scheduled" as const,
    date: new Date('2024-03-10'),
    description: "Regular maintenance and filter replacement"
  },
  {
    id: 6,
    vehicleId: 5,
    vehicleName: "Electric Van",
    type: "inspection",
    status: "overdue" as const,
    date: new Date('2024-01-20'),
    description: "Battery system check"
  },
  {
    id: 7,
    vehicleId: 7,
    vehicleName: "City Delivery Van",
    type: "repair",
    status: "scheduled" as const,
    date: new Date('2024-02-28'),
    cost: 350,
    description: "Door latch replacement and alignment"
  }
];

// Sample fuel records data
const fuelRecords = [
  {
    id: 1,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    date: new Date('2024-01-05'),
    gallons: 45.6,
    cost: 147.2,
    mileage: 46500
  },
  {
    id: 2,
    vehicleId: 1,
    vehicleName: "Delivery Truck 1",
    date: new Date('2024-01-15'),
    gallons: 50.2,
    cost: 161.6,
    mileage: 47250,
    mpg: 14.9
  },
  {
    id: 3,
    vehicleId: 2,
    vehicleName: "Delivery Van 1",
    date: new Date('2024-01-08'),
    gallons: 28.4,
    cost: 91.5,
    mileage: 39200
  },
  {
    id: 4,
    vehicleId: 2,
    vehicleName: "Delivery Van 1",
    date: new Date('2024-01-20'),
    gallons: 25.7,
    cost: 82.8,
    mileage: 39850,
    mpg: 25.3
  },
  {
    id: 5,
    vehicleId: 4,
    vehicleName: "Refrigerated Truck",
    date: new Date('2024-01-12'),
    gallons: 42.3,
    cost: 136.2,
    mileage: 35800
  },
  {
    id: 6,
    vehicleId: 4,
    vehicleName: "Refrigerated Truck",
    date: new Date('2024-01-25'),
    gallons: 38.9,
    cost: 125.3,
    mileage: 36420,
    mpg: 15.9
  }
];

// Sample fuel analytics data
const vehicleFuelData = [
  {
    id: 1,
    name: "Heavy Trucks",
    type: "Heavy Duty",
    currentFuelLevel: 72,
    averageMPG: 12.5,
    monthlyFuelCost: [1250, 1350, 1480, 1320, 1460, 1520],
    fuelConsumption: [310, 325, 350, 320, 340, 365]
  },
  {
    id: 2,
    name: "Medium Trucks",
    type: "Medium Duty",
    currentFuelLevel: 45,
    averageMPG: 16.8,
    monthlyFuelCost: [980, 1050, 1120, 980, 1040, 1150],
    fuelConsumption: [240, 255, 275, 240, 255, 280]
  },
  {
    id: 3,
    name: "Light Vans",
    type: "Light Duty",
    currentFuelLevel: 88,
    averageMPG: 23.5,
    monthlyFuelCost: [620, 580, 650, 690, 720, 750],
    fuelConsumption: [160, 150, 170, 180, 190, 195]
  }
];

// Analytics data
const analyticsData = {
  vehicleTypes: [
    { name: 'Heavy Truck', value: 3 },
    { name: 'Medium Truck', value: 3 },
    { name: 'Light Van', value: 3 },
    { name: 'Specialty', value: 1 }
  ],
  vehicleStatus: [
    { name: 'Active', value: 7 },
    { name: 'Maintenance', value: 2 },
    { name: 'Inactive', value: 1 }
  ],
  fuelConsumption: [
    { name: 'Heavy Trucks', value: 365 },
    { name: 'Medium Trucks', value: 280 },
    { name: 'Light Vans', value: 195 },
    { name: 'Specialty', value: 120 }
  ],
  monthlyMileage: [
    { name: 'Sep', value: 28500 },
    { name: 'Oct', value: 32400 },
    { name: 'Nov', value: 30200 },
    { name: 'Dec', value: 27800 },
    { name: 'Jan', value: 34200 },
    { name: 'Feb', value: 36500 }
  ],
  metrics: {
    fuelEfficiency: [12.2, 16.4, 22.8, 11.9, 15.8, 22.5, 12.5, 16.9, 23.1, 12.8, 17.2, 23.5],
    maintenanceCosts: [4500, 3200, 1800, 3800, 2900, 1400, 5200, 3600, 2100, 4800, 3100, 1700],
    utilizationRate: [85, 75, 65, 82, 78, 68, 88, 80, 72, 90, 82, 76],
    idleTime: [8.5, 7.2, 6.1, 9.2, 5.4]
  }
};

// Add some sample data for the new tables
const vehicleAssignmentStats = [
  { departmentName: "Distribution", totalVehicles: 4, activeVehicles: 3, utilization: 85 },
  { departmentName: "Sales", totalVehicles: 3, activeVehicles: 2, utilization: 62 },
  { departmentName: "Support", totalVehicles: 2, activeVehicles: 2, utilization: 90 },
  { departmentName: "Administration", totalVehicles: 1, activeVehicles: 1, utilization: 45 }
];

const upcomingMaintenance = [
  { id: 101, vehicleName: "Delivery Truck 2", type: "Oil Change", date: new Date('2024-03-15'), estimatedCost: 150, status: "scheduled" },
  { id: 102, vehicleName: "Van 3", type: "Tire Rotation", date: new Date('2024-03-18'), estimatedCost: 80, status: "scheduled" },
  { id: 103, vehicleName: "Cargo Truck", type: "Inspection", date: new Date('2024-03-21'), estimatedCost: 120, status: "scheduled" },
  { id: 104, vehicleName: "Delivery Truck 3", type: "Brake Service", date: new Date('2024-03-25'), estimatedCost: 350, status: "pending" }
];

const vehicleActivityData = [
  { date: "2024-02-01", active: 6, maintenance: 3, inactive: 1 },
  { date: "2024-02-08", active: 7, maintenance: 2, inactive: 1 },
  { date: "2024-02-15", active: 8, maintenance: 1, inactive: 1 },
  { date: "2024-02-22", active: 7, maintenance: 2, inactive: 1 },
  { date: "2024-03-01", active: 6, maintenance: 3, inactive: 1 },
  { date: "2024-03-08", active: 7, maintenance: 2, inactive: 1 }
];

// Sample expanded fleet with location data for a medium-sized logistics company
const expandedFleetData: ExtendedVehicle[] = [
  {
    id: 1,
    name: "Heavy Truck #101",
    type: "Heavy Duty",
    status: "active",
    make: "Peterbilt",
    model: "579",
    year: 2022,
    licensePlate: "LGX-1457",
    vinNumber: "1XPWD40X1VD792003",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-15'),
    nextMaintenance: new Date('2024-03-15'),
    createdAt: new Date('2022-01-15'),
    updatedAt: new Date('2023-12-15'),
    fuelLevel: 72,
    mileage: 56500,
    location: { lat: 40.7128, lng: -74.0060, lastUpdated: new Date() }, // NYC
    assignedDriver: "Miguel Rodriguez",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 2,
    name: "Heavy Truck #102",
    type: "Heavy Duty",
    status: "active",
    make: "Kenworth",
    model: "T680",
    year: 2021,
    licensePlate: "LGX-8224",
    vinNumber: "1XKYD49X5VJ793412",
    currentLocation: null,
    lastMaintenance: new Date('2023-11-28'),
    nextMaintenance: new Date('2024-02-28'),
    createdAt: new Date('2021-10-10'),
    updatedAt: new Date('2023-11-28'),
    fuelLevel: 45,
    mileage: 76800,
    location: { lat: 34.0522, lng: -118.2437, lastUpdated: new Date() }, // LA
    assignedDriver: "David Chen",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 3,
    name: "Medium Truck #201",
    type: "Medium Duty",
    status: "active",
    make: "Freightliner",
    model: "M2 106",
    year: 2020,
    licensePlate: "LGX-5562",
    vinNumber: "1FVACXDT6FHHA2547",
    currentLocation: null,
    lastMaintenance: new Date('2023-10-15'),
    nextMaintenance: new Date('2024-01-15'),
    createdAt: new Date('2020-08-05'),
    updatedAt: new Date('2023-10-15'),
    fuelLevel: 80,
    mileage: 45000,
    location: { lat: 29.7604, lng: -95.3698, lastUpdated: new Date() }, // Houston
    assignedDriver: "Marcus Johnson",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 4,
    name: "Medium Truck #202",
    type: "Medium Duty",
    status: "maintenance",
    make: "Hino",
    model: "338",
    year: 2019,
    licensePlate: "LGX-2456",
    vinNumber: "5PVNJ8JH0G4S87712",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-01'),
    nextMaintenance: new Date('2024-03-01'),
    createdAt: new Date('2019-05-20'),
    updatedAt: new Date('2023-12-01'),
    fuelLevel: 30,
    mileage: 85200,
    location: { lat: 41.8781, lng: -87.6298, lastUpdated: new Date() }, // Chicago
    assignedDriver: "Sarah Miller",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 5,
    name: "Medium Truck #203",
    type: "Medium Duty",
    status: "active",
    make: "Isuzu",
    model: "NPR-HD",
    year: 2021,
    licensePlate: "LGX-1078",
    vinNumber: "JALC4B16XP7000104",
    currentLocation: null,
    lastMaintenance: new Date('2023-09-15'),
    nextMaintenance: new Date('2024-01-15'),
    createdAt: new Date('2021-04-10'),
    updatedAt: new Date('2023-09-15'),
    fuelLevel: 65,
    mileage: 38500,
    location: { lat: 32.7767, lng: -96.7970, lastUpdated: new Date() }, // Dallas
    assignedDriver: "Jackson Lee",
    departmentId: 1,
    departmentName: "Distribution"
  },
  {
    id: 6,
    name: "Delivery Van #301",
    type: "Light Duty",
    status: "active",
    make: "Mercedes-Benz",
    model: "Sprinter",
    year: 2022,
    licensePlate: "LGX-7733",
    vinNumber: "WDZPE7CD0GP211339",
    currentLocation: null,
    lastMaintenance: new Date('2023-10-28'),
    nextMaintenance: new Date('2024-01-28'),
    createdAt: new Date('2022-03-15'),
    updatedAt: new Date('2023-10-28'),
    fuelLevel: 82,
    mileage: 25600,
    location: { lat: 33.7490, lng: -84.3880, lastUpdated: new Date() }, // Atlanta
    assignedDriver: "Emily Wang",
    departmentId: 2,
    departmentName: "Sales"
  },
  {
    id: 7,
    name: "Delivery Van #302",
    type: "Light Duty",
    status: "active",
    make: "Ford",
    model: "Transit",
    year: 2021,
    licensePlate: "LGX-4219",
    vinNumber: "1FTYE2CM3GKA78544",
    currentLocation: null,
    lastMaintenance: new Date('2023-11-15'),
    nextMaintenance: new Date('2024-02-15'),
    createdAt: new Date('2021-05-20'),
    updatedAt: new Date('2023-11-15'),
    fuelLevel: 55,
    mileage: 32400,
    location: { lat: 39.9526, lng: -75.1652, lastUpdated: new Date() }, // Philadelphia
    assignedDriver: "Rachel Green",
    departmentId: 2,
    departmentName: "Sales"
  },
  {
    id: 8,
    name: "Delivery Van #303",
    type: "Light Duty",
    status: "maintenance",
    make: "RAM",
    model: "ProMaster",
    year: 2020,
    licensePlate: "LGX-9902",
    vinNumber: "3C6TRVDG7JE102484",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-05'),
    nextMaintenance: new Date('2024-03-05'),
    createdAt: new Date('2020-07-12'),
    updatedAt: new Date('2023-12-05'),
    fuelLevel: 25,
    mileage: 48900,
    location: { lat: 38.9072, lng: -77.0369, lastUpdated: new Date() }, // DC
    assignedDriver: "Tyler Jackson",
    departmentId: 2,
    departmentName: "Sales"
  },
  {
    id: 9,
    name: "Cargo Van #401",
    type: "Light Duty",
    status: "active",
    make: "Chevrolet",
    model: "Express",
    year: 2020,
    licensePlate: "LGX-5511",
    vinNumber: "1GCWGBFG4K1123456",
    currentLocation: null,
    lastMaintenance: new Date('2023-11-20'),
    nextMaintenance: new Date('2024-02-20'),
    createdAt: new Date('2020-03-25'),
    updatedAt: new Date('2023-11-20'),
    fuelLevel: 70,
    mileage: 39700,
    location: { lat: 42.3601, lng: -71.0589, lastUpdated: new Date() }, // Boston
    assignedDriver: "Jessica Thomas",
    departmentId: 3,
    departmentName: "Support"
  },
  {
    id: 10,
    name: "Maintenance Truck",
    type: "Specialty",
    status: "active",
    make: "GMC",
    model: "Sierra 2500HD",
    year: 2021,
    licensePlate: "LGX-7890",
    vinNumber: "1GT49REY1MF204391",
    currentLocation: null,
    lastMaintenance: new Date('2023-10-10'),
    nextMaintenance: new Date('2024-01-10'),
    createdAt: new Date('2021-01-15'),
    updatedAt: new Date('2023-10-10'),
    fuelLevel: 60,
    mileage: 28500,
    location: { lat: 37.7749, lng: -122.4194, lastUpdated: new Date() }, // SF
    assignedDriver: "Chris Martinez",
    departmentId: 3,
    departmentName: "Support"
  },
  {
    id: 11,
    name: "Executive Car",
    type: "Light Duty",
    status: "active",
    make: "Tesla",
    model: "Model Y",
    year: 2022,
    licensePlate: "LGX-1234",
    vinNumber: "5YJ3E1EA9NF567890",
    currentLocation: null,
    lastMaintenance: new Date('2023-12-05'),
    nextMaintenance: new Date('2024-03-05'),
    createdAt: new Date('2022-02-10'),
    updatedAt: new Date('2023-12-05'),
    fuelLevel: 90,
    mileage: 15200,
    location: { lat: 47.6062, lng: -122.3321, lastUpdated: new Date() }, // Seattle
    assignedDriver: "Amanda Wilson",
    departmentId: 4,
    departmentName: "Administration"
  },
  {
    id: 12,
    name: "Refrigerated Truck",
    type: "Heavy Duty",
    status: "inactive",
    make: "Volvo",
    model: "VNL 760",
    year: 2019,
    licensePlate: "LGX-6543",
    vinNumber: "4V4NC9EH5KN123456",
    currentLocation: null,
    lastMaintenance: new Date('2023-08-20'),
    nextMaintenance: null,
    createdAt: new Date('2019-06-10'),
    updatedAt: new Date('2023-08-20'),
    fuelLevel: 15,
    mileage: 112500,
    location: { lat: 36.1699, lng: -115.1398, lastUpdated: new Date() }, // Las Vegas
    assignedDriver: undefined,
    departmentId: 1,
    departmentName: "Distribution"
  }
];

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [groupByOption, setGroupByOption] = useState("");
  const [fleetSummary, setFleetSummary] = useState<FleetSummary | null>(null);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [selectedTab, setSelectedTab] = useState("vehicles");
  const [detailPanelOpen, setDetailPanelOpen] = useState(false);
  const [vehicleForDetails, setVehicleForDetails] = useState<ExtendedVehicle | null>(null);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [quickStatusOpen, setQuickStatusOpen] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulating API call with expanded data
      // In a real app, this would be an actual API call
      const vehiclesData = expandedFleetData;
      const activeTrucks = vehiclesData.filter(v => v.status === 'active').length;
      const inMaintenance = vehiclesData.filter(v => v.status === 'maintenance').length;
      const outOfService = vehiclesData.filter(v => v.status === 'inactive').length;
      
      const summary: FleetSummary = {
        totalVehicles: vehiclesData.length,
        activeVehicles: activeTrucks,
        inMaintenance: inMaintenance,
        outOfService: outOfService,
        activePercentage: Math.round((activeTrucks / vehiclesData.length) * 100),
        maintenancePercentage: Math.round((inMaintenance / vehiclesData.length) * 100),
        outOfServicePercentage: Math.round((outOfService / vehiclesData.length) * 100),
      };
      
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

  const handleViewDetails = (vehicle: ExtendedVehicle) => {
    setVehicleForDetails(vehicle);
    setDetailPanelOpen(true);
  };

  const handleBatchStatusChange = (status: string) => {
    console.log(`Change status to ${status} for vehicles:`, selectedVehicles);
    setQuickStatusOpen(false);
  };

  const handleToggleMap = () => {
    setShowMap(!showMap);
  };

  const handleToggleVehicleSelection = (vehicleId: string) => {
    setSelectedVehicles(prev => {
      if (prev.includes(vehicleId)) {
        return prev.filter(id => id !== vehicleId);
      } else {
        return [...prev, vehicleId];
      }
    });
  };

  const handleSelectAll = (selected: boolean) => {
    if (selected) {
      setSelectedVehicles(filteredVehicles.map(v => v.id.toString()));
    } else {
      setSelectedVehicles([]);
    }
  };

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesStatus = statusFilter === "all" || vehicle.status === statusFilter;
    const matchesDepartment = departmentFilter === "all" || 
      (vehicle as ExtendedVehicle).departmentId?.toString() === departmentFilter;
    const matchesSearch = searchQuery === "" || 
      vehicle.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicle.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle as ExtendedVehicle).licensePlate?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle as ExtendedVehicle).assignedDriver?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch && matchesDepartment;
  });

  // Group vehicles if grouping is enabled
  const groupedVehicles = () => {
    if (!groupByOption || groupByOption === "none") return { "All Vehicles": filteredVehicles };
    
    return filteredVehicles.reduce((acc: Record<string, ExtendedVehicle[]>, vehicle) => {
      let groupKey = "Other";
      
      if (groupByOption === "type") {
        groupKey = vehicle.type || "Unspecified";
      } else if (groupByOption === "status") {
        groupKey = vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1);
      } else if (groupByOption === "department") {
        groupKey = (vehicle as ExtendedVehicle).departmentName || "Unassigned";
      }
      
      if (!acc[groupKey]) {
        acc[groupKey] = [];
      }
      
      acc[groupKey].push(vehicle as ExtendedVehicle);
      return acc;
    }, {});
  };

  // Define columns for the vehicle table
  const vehicleColumns = [
    {
      id: "selection",
      header: ({ table }: any) => (
        <input
          type="checkbox"
          checked={table?.getIsAllRowsSelected?.() || false}
          onChange={(e) => handleSelectAll(e.target.checked)}
          className="h-4 w-4 rounded border-gray-300"
        />
      ),
      cell: ({ row }: any) => {
        if (!row?.original) return null;
        return (
          <input
            type="checkbox"
            checked={selectedVehicles.includes(row.original.id.toString())}
            onChange={() => handleToggleVehicleSelection(row.original.id.toString())}
            className="h-4 w-4 rounded border-gray-300"
          />
        );
      },
      meta: {
        className: "w-[40px]"
      }
    },
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
      enableSorting: true,
      cell: (vehicle: Vehicle) => {
        const statusMap: Record<string, { color: string, label: string }> = {
          active: { color: "green", label: "Active" },
          maintenance: { color: "amber", label: "Maintenance" },
          inactive: { color: "red", label: "Inactive" }
        };
        
        const status = statusMap[vehicle.status] || { color: "gray", label: vehicle.status };
        
        return (
          <Badge className={`bg-${status.color}-500/10 text-${status.color}-500 border-${status.color}-500/20`}>
            {status.label}
          </Badge>
        );
      }
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
    },
    {
      id: "licensePlate",
      header: "License Plate",
      accessorKey: "licensePlate",
      enableSorting: true,
      cell: (vehicle: ExtendedVehicle) => (
        <div className="font-mono">{vehicle.licensePlate || "N/A"}</div>
      )
    },
    {
      id: "assignedDriver",
      header: "Driver",
      accessorKey: "assignedDriver",
      enableSorting: true,
      cell: (vehicle: ExtendedVehicle) => (
        <div>{vehicle.assignedDriver || "Unassigned"}</div>
      )
    },
    {
      id: "departmentName",
      header: "Department",
      accessorKey: "departmentName",
      enableSorting: true,
      cell: (vehicle: ExtendedVehicle) => (
        <div>{vehicle.departmentName || "Unassigned"}</div>
      )
    }
  ];

  // Define actions for the vehicle table
  const vehicleActions = [
    {
      label: "View Details",
      icon: <FileText className="h-4 w-4" />,
      onClick: handleViewDetails
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
      
      {fleetSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                  <Truck className="h-6 w-6 text-primary" />
                </div>
                <span className="text-muted-foreground text-sm">Total</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">{fleetSummary.totalVehicles}</h3>
                <p className="text-muted-foreground text-sm">Total Vehicles</p>
              </div>
          </CardContent>
        </Card>
          
        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 bg-green-500/10 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
                <span className="text-muted-foreground text-sm">Active</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">{fleetSummary.activeVehicles}</h3>
                <p className="text-muted-foreground text-sm">{fleetSummary.activePercentage}% of fleet</p>
              </div>
          </CardContent>
        </Card>
          
        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 bg-amber-500/10 rounded-full flex items-center justify-center">
                  <Settings className="h-6 w-6 text-amber-500" />
                </div>
                <span className="text-muted-foreground text-sm">Maintenance</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">{fleetSummary.inMaintenance}</h3>
                <p className="text-muted-foreground text-sm">{fleetSummary.maintenancePercentage}% of fleet</p>
              </div>
          </CardContent>
        </Card>
          
        <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-2">
                <div className="h-12 w-12 bg-red-500/10 rounded-full flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 text-red-500" />
                </div>
                <span className="text-muted-foreground text-sm">Inactive</span>
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold">{fleetSummary.outOfService}</h3>
                <p className="text-muted-foreground text-sm">{fleetSummary.outOfServicePercentage}% of fleet</p>
              </div>
          </CardContent>
        </Card>
      </div>
      )}

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="vehicles">
            <Truck className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Vehicles</span>
          </TabsTrigger>
          <TabsTrigger value="maintenance">
            <Settings className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Maintenance</span>
          </TabsTrigger>
          <TabsTrigger value="fuel">
            <Fuel className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Fuel</span>
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="vehicles" className="space-y-6">
          {/* Batch Operations Button */}
          {selectedVehicles.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <span className="text-sm font-medium">{selectedVehicles.length} vehicles selected</span>
              <div className="ml-auto flex gap-2">
                <Select open={quickStatusOpen} onOpenChange={setQuickStatusOpen}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Change Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active" onClick={() => handleBatchStatusChange("active")}>Set Active</SelectItem>
                    <SelectItem value="maintenance" onClick={() => handleBatchStatusChange("maintenance")}>Set Maintenance</SelectItem>
                    <SelectItem value="inactive" onClick={() => handleBatchStatusChange("inactive")}>Set Inactive</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" onClick={() => setSelectedVehicles([])}>
                  Clear Selection
                </Button>
              </div>
            </div>
          )}

          {/* Interactive Fleet Map */}
          <Card className="mb-6">
        <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="h-5 w-5 mr-2 text-primary" />
                Fleet Location Overview
              </CardTitle>
              <CardDescription>Real-time locations and status of all fleet vehicles</CardDescription>
            </CardHeader>
            <CardContent>
              <FleetMap 
                vehicles={filteredVehicles as ExtendedVehicle[]} 
                height="400px"
                onVehicleSelect={handleViewDetails}
              />
            </CardContent>
          </Card>

          {/* Main Vehicle Inventory Table */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/50 p-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-2 md:space-y-0">
          <CardTitle>Vehicle Inventory</CardTitle>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                      type="text"
                      placeholder="Search vehicles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 w-full md:w-[250px]"
              />
            </div>
                  <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="maintenance">In Maintenance</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select defaultValue={groupByOption} onValueChange={setGroupByOption}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Group by..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Grouping</SelectItem>
                      <SelectItem value="type">Group by Type</SelectItem>
                      <SelectItem value="status">Group by Status</SelectItem>
                      <SelectItem value="department">Group by Department</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
            <CardContent className="p-0">
              {groupByOption ? (
                <div className="space-y-4 p-4">
                  {Object.entries(groupedVehicles()).map(([groupName, groupVehicles]) => (
                    <Card key={groupName} className="overflow-hidden">
                      <CardHeader className="py-2 px-4 bg-muted/30">
                        <CardTitle className="text-base">{groupName} ({groupVehicles.length})</CardTitle>
                      </CardHeader>
                      <CardContent className="p-0">
                        <EnhancedTable
                          data={groupVehicles}
                          columns={vehicleColumns}
                          actions={vehicleActions}
                        />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <EnhancedTable
                  data={filteredVehicles as ExtendedVehicle[]}
                  columns={vehicleColumns}
                  actions={[
                    ...vehicleActions,
                    {
                      label: "View Details",
                      icon: <FileText className="h-4 w-4" />,
                      onClick: handleViewDetails
                    }
                  ]}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="maintenance">
          <MaintenanceTracker 
            records={maintenanceRecords}
            vehicles={vehicles.map(v => ({ id: v.id, name: v.name }))}
            onAddRecord={(record) => console.log("Add maintenance record", record)}
          />
        </TabsContent>

        <TabsContent value="fuel">
          <FuelTracker 
            records={fuelRecords}
            vehicles={vehicles.map(v => ({ id: v.id, name: v.name, type: v.type }))}
            vehiclesFuelData={vehicleFuelData}
            onAddFuelRecord={(record) => console.log("Add fuel record", record)}
          />
        </TabsContent>

        <TabsContent value="analytics">
          <FleetAnalytics 
            vehicleTypes={analyticsData.vehicleTypes}
            vehicleStatus={analyticsData.vehicleStatus}
            fuelConsumption={analyticsData.fuelConsumption}
            monthlyMileage={analyticsData.monthlyMileage}
            metrics={analyticsData.metrics}
          />
        </TabsContent>
      </Tabs>

      <VehicleModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        vehicle={selectedVehicle}
        onSuccess={fetchData}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the vehicle{" "}
              <span className="font-medium">{vehicleToDelete?.name}</span> and all its associated records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Vehicle Detail Panel */}
      <Dialog open={detailPanelOpen} onOpenChange={setDetailPanelOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Vehicle Details</DialogTitle>
          </DialogHeader>
          
          {vehicleForDetails && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Truck className="h-8 w-8 text-primary" />
                    <div>
                      <h3 className="text-lg font-medium">{vehicleForDetails.name}</h3>
                      <Badge className={
                        vehicleForDetails.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                        vehicleForDetails.status === 'maintenance' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                        'bg-red-500/10 text-red-500 border-red-500/20'
                      }>
                        {vehicleForDetails.status.charAt(0).toUpperCase() + vehicleForDetails.status.slice(1)}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">Make & Model:</span>
                      <span className="font-medium">{vehicleForDetails.make || 'N/A'} {vehicleForDetails.model || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">Year:</span>
                      <span className="font-medium">{vehicleForDetails.year || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">License Plate:</span>
                      <span className="font-mono font-medium">{vehicleForDetails.licensePlate || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">VIN:</span>
                      <span className="font-mono font-medium">{vehicleForDetails.vinNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">Mileage:</span>
                      <span className="font-medium">{vehicleForDetails.mileage?.toLocaleString() || '0'} mi</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">Fuel Level:</span>
                      <span className="font-medium">{vehicleForDetails.fuelLevel || '0'}%</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">Department:</span>
                      <span className="font-medium">{vehicleForDetails.departmentName || 'Unassigned'}</span>
                    </div>
                    <div className="flex justify-between text-sm border-b pb-1">
                      <span className="text-muted-foreground">Assigned Driver:</span>
                      <span className="font-medium">{vehicleForDetails.assignedDriver || 'Unassigned'}</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <h4 className="text-sm font-medium mb-2">Important Dates</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="text-muted-foreground">Last Maintenance:</span>
                        <span className="font-medium">
                          {vehicleForDetails.lastMaintenance 
                            ? (typeof vehicleForDetails.lastMaintenance === 'string' 
                              ? vehicleForDetails.lastMaintenance 
                              : new Date(vehicleForDetails.lastMaintenance).toLocaleDateString()) 
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="text-muted-foreground">Registration Expires:</span>
                        <span className="font-medium">
                          {vehicleForDetails.registrationExpiry ? new Date(vehicleForDetails.registrationExpiry).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm border-b pb-1">
                        <span className="text-muted-foreground">Insurance Expires:</span>
                        <span className="font-medium">
                          {vehicleForDetails.insuranceExpiry ? new Date(vehicleForDetails.insuranceExpiry).toLocaleDateString() : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                {/* Location Map Placeholder */}
                <div className="h-48 bg-muted rounded-md flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <Map className="h-8 w-8 mx-auto mb-1" />
                    <p className="text-sm">Vehicle Location</p>
                    <p className="text-xs">
                      {vehicleForDetails.location ? 
                        `Last updated: ${new Date(vehicleForDetails.location.lastUpdated).toLocaleString()}` :
                        'Location data not available'}
                    </p>
                  </div>
                </div>
                
                {/* Maintenance History Summary */}
                <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Recent Maintenance</CardTitle>
                  </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2 text-sm">
                      {maintenanceRecords
                        .filter(r => r.vehicleId === vehicleForDetails.id)
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .slice(0, 3)
                        .map(record => (
                          <div key={record.id} className="border-b pb-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{record.type}</span>
                              <span>{record.date.toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-muted-foreground">{record.description}</p>
                          </div>
                        ))}
                      {maintenanceRecords.filter(r => r.vehicleId === vehicleForDetails.id).length === 0 && (
                        <p className="text-muted-foreground">No maintenance records found</p>
                      )}
                    </div>
        </CardContent>
      </Card>
      
                {/* Fuel History Summary */}
      <Card>
                  <CardHeader className="p-3">
                    <CardTitle className="text-sm font-medium">Recent Fuel Records</CardTitle>
        </CardHeader>
                  <CardContent className="p-3">
                    <div className="space-y-2 text-sm">
                      {fuelRecords
                        .filter(r => r.vehicleId === vehicleForDetails.id)
                        .sort((a, b) => b.date.getTime() - a.date.getTime())
                        .slice(0, 3)
                        .map(record => (
                          <div key={record.id} className="border-b pb-2">
                            <div className="flex justify-between">
                              <span className="font-medium">{record.gallons.toFixed(2)} gallons</span>
                              <span>${record.cost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>{record.date.toLocaleDateString()}</span>
                              <span>{record.mileage.toLocaleString()} miles</span>
                            </div>
                          </div>
                        ))}
                      {fuelRecords.filter(r => r.vehicleId === vehicleForDetails.id).length === 0 && (
                        <p className="text-muted-foreground">No fuel records found</p>
                      )}
                    </div>
        </CardContent>
      </Card>
                
                {/* Quick Actions */}
                <div className="flex gap-2 mt-4">
                  <Button className="flex-1" onClick={() => {
                    setDetailPanelOpen(false);
                    handleEditVehicle(vehicleForDetails);
                  }}>
                    <Pencil className="h-4 w-4 mr-2" />
                    Edit Vehicle
                  </Button>
                  <Button variant="outline" className="flex-1" onClick={() => console.log("View full maintenance history", vehicleForDetails.id)}>
                    <Settings className="h-4 w-4 mr-2" />
                    Maintenance Log
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}