import { useState, useEffect } from "react";
import { 
  Plus, RefreshCw, Search, Filter, Pencil, Trash2, FileText, Truck, 
  CalendarClock, Fuel, Settings, AlertCircle, Map, TrendingUp, Activity, 
  User, Download, ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight, 
  Award, Shield, ThumbsUp, BarChart, Clock, X, Calendar, Wrench, AlertTriangle, 
  CheckCircle, Navigation, Check, CircleOff, DollarSign, Gauge, UserRound, 
  Route, MapPin, History, Cpu, CircleDot
} from "lucide-react";
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
  DialogClose,
  DialogFooter,
} from "@/components/ui/dialog";
import { FleetMap } from "@/components/fleet/FleetMap";
import { ExtendedVehicle } from "@/types/vehicle";
import { VehicleHealthMonitor } from "@/components/fleet/VehicleHealthMonitor";
import { DriversPerformanceAnalyzer } from "@/components/fleet/DriversPerformanceAnalyzer";
import { Pagination } from "@/components/ui/pagination";
import { MapComponent } from "@/components/MapComponent";
import { formatDate, getMaintenanceStatus, addMockVehicleDetails } from "@/components/VehicleDetailsHelper";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { BarChart3 } from "lucide-react";

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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [driversSearch, setDriversSearch] = useState("");
  const [driversPerformanceFilter, setDriversPerformanceFilter] = useState("all");
  const [driversSortMetric, setDriversSortMetric] = useState("safety");
  const [selectedDrivers, setSelectedDrivers] = useState<string[]>([]);
  const [driversCurrentPage, setDriversCurrentPage] = useState(1);
  const [driversPageSize, setDriversPageSize] = useState(5);
  const [selectedDriverForDetails, setSelectedDriverForDetails] = useState<any>(null);
  const [driverDetailsPanelOpen, setDriverDetailsPanelOpen] = useState(false);
  const [driverForEdit, setDriverForEdit] = useState<any>(null);
  const [driverEditModalOpen, setDriverEditModalOpen] = useState(false);
  const [driverToDelete, setDriverToDelete] = useState<any>(null);
  const [driverDeleteDialogOpen, setDriverDeleteDialogOpen] = useState(false);

  // Update the fetchData function to use the mock data enhancements
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulating API call with expanded data
      // In a real app, this would be an actual API call
      const vehiclesData = expandedFleetData;
      
      // Add mock details data for the demo
      const enhancedVehicles = addMockVehicleDetails(vehiclesData);
      
      const activeTrucks = enhancedVehicles.filter(v => v.status === 'active').length;
      const inMaintenance = enhancedVehicles.filter(v => v.status === 'maintenance').length;
      const outOfService = enhancedVehicles.filter(v => v.status === 'inactive').length;
      
      const summary: FleetSummary = {
        totalVehicles: enhancedVehicles.length,
        activeVehicles: activeTrucks,
        inMaintenance: inMaintenance,
        outOfService: outOfService,
        activePercentage: Math.round((activeTrucks / enhancedVehicles.length) * 100),
        maintenancePercentage: Math.round((inMaintenance / enhancedVehicles.length) * 100),
        outOfServicePercentage: Math.round((outOfService / enhancedVehicles.length) * 100),
      };
      
      setFleetSummary(summary);
      setVehicles(enhancedVehicles);
      setLoading(false);
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

  const paginatedVehicles = filteredVehicles.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const totalPages = Math.ceil(filteredVehicles.length / pageSize);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  // Driver data
  const driversData = [
    {
      id: "1",
      name: "Michael Johnson",
      avatar: null,
      safetyScore: 94,
      fuelEfficiency: 87,
      timeManagement: 92,
      vehicleHandling: 88,
      customerSatisfaction: 95,
      idleTime: 8,
      mileage: 24568,
      trips: 342,
      incidents: 0
    },
    {
      id: "2",
      name: "Sarah Williams",
      avatar: null,
      safetyScore: 92,
      fuelEfficiency: 90,
      timeManagement: 85,
      vehicleHandling: 91,
      customerSatisfaction: 96,
      idleTime: 12,
      mileage: 18975,
      trips: 278,
      incidents: 1
    },
    {
      id: "3",
      name: "David Rodriguez",
      avatar: null,
      safetyScore: 88,
      fuelEfficiency: 82,
      timeManagement: 90,
      vehicleHandling: 85,
      customerSatisfaction: 89,
      idleTime: 14,
      mileage: 31250,
      trips: 405,
      incidents: 2
    },
    {
      id: "4",
      name: "Emily Chen",
      avatar: null,
      safetyScore: 96,
      fuelEfficiency: 94,
      timeManagement: 93,
      vehicleHandling: 92,
      customerSatisfaction: 97,
      idleTime: 6,
      mileage: 15820,
      trips: 215,
      incidents: 0
    },
    {
      id: "5",
      name: "James Wilson",
      avatar: null,
      safetyScore: 85,
      fuelEfficiency: 79,
      timeManagement: 82,
      vehicleHandling: 86,
      customerSatisfaction: 88,
      idleTime: 18,
      mileage: 28430,
      trips: 356,
      incidents: 3
    }
  ];

  // Filter drivers based on search and performance filter
  const filteredDrivers = driversData.filter((driver) => {
    // Calculate overall score
    const overallScore = Math.round(
      (driver.safetyScore + 
      driver.fuelEfficiency + 
      driver.timeManagement + 
      driver.vehicleHandling + 
      driver.customerSatisfaction) / 5
    );
    
    // Filter by performance category
    const matchesPerformance = 
      driversPerformanceFilter === "all" || 
      (driversPerformanceFilter === "high" && overallScore >= 90) ||
      (driversPerformanceFilter === "average" && overallScore >= 85 && overallScore < 90) ||
      (driversPerformanceFilter === "low" && overallScore < 85);
    
    // Filter by search query
    const matchesSearch = driversSearch.trim() === "" || 
      driver.name.toLowerCase().includes(driversSearch.toLowerCase());
    
    return matchesPerformance && matchesSearch;
  });

  // Sort drivers based on selected metric
  const sortedDrivers = [...filteredDrivers].sort((a, b) => {
    if (driversSortMetric === "safety") {
      return b.safetyScore - a.safetyScore;
    } else if (driversSortMetric === "fuel") {
      return b.fuelEfficiency - a.fuelEfficiency;
    } else if (driversSortMetric === "time") {
      return b.timeManagement - a.timeManagement;
    } else if (driversSortMetric === "handling") {
      return b.vehicleHandling - a.vehicleHandling;
    } else if (driversSortMetric === "satisfaction") {
      return b.customerSatisfaction - a.customerSatisfaction;
    }
    return 0;
  });

  // Paginate drivers
  const driversTotalPages = Math.ceil(filteredDrivers.length / driversPageSize);
  const paginatedDrivers = sortedDrivers.slice(
    (driversCurrentPage - 1) * driversPageSize, 
    driversCurrentPage * driversPageSize
  );

  // Get a consistent color for driver avatar based on name
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500',
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-cyan-500'
    ];
    
    // Generate a consistent index based on the name
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Ensure positive index
    hash = Math.abs(hash);
    return colors[hash % colors.length];
  };

  // Get driver initials
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('');
  };

  // Handler for viewing driver details
  const handleViewDriverDetails = (driver: any) => {
    setSelectedDriverForDetails(driver);
    setDriverDetailsPanelOpen(true);
  };

  // Handler for editing driver
  const handleEditDriver = (driver: any) => {
    setDriverForEdit(driver);
    setDriverEditModalOpen(true);
  };

  // Handler for deleting driver
  const handleDeleteDriver = (driver: any) => {
    setDriverToDelete(driver);
    setDriverDeleteDialogOpen(true);
  };

  // Handler for confirming driver deletion
  const confirmDeleteDriver = () => {
    // In a real app, this would call an API to delete the driver
    console.log(`Deleting driver:`, driverToDelete);
    // Simulate successful deletion
    setDriverDeleteDialogOpen(false);
    setDriverToDelete(null);
    // In a real app, you would refresh the data here
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
      
      {/* Fleet Summary Cards Section */}
      {fleetSummary && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{fleetSummary.totalVehicles}</div>
              <div className="flex items-center">
                <Truck className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">Fleet inventory count</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Active Vehicles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">{fleetSummary.activeVehicles}</div>
              <div className="flex items-center">
                <TrendingUp className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{fleetSummary.activePercentage}% of total fleet</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">In Maintenance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-500">{fleetSummary.inMaintenance}</div>
              <div className="flex items-center">
                <Settings className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{fleetSummary.maintenancePercentage}% of total fleet</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Out of Service</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">{fleetSummary.outOfService}</div>
              <div className="flex items-center">
                <AlertCircle className="h-4 w-4 mr-1 text-muted-foreground" />
                <p className="text-xs text-muted-foreground">{fleetSummary.outOfServicePercentage}% of total fleet</p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Interactive Fleet Map */}
      <div className="mb-6">
        <Card className="overflow-hidden">
          <CardHeader className="bg-background border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Map className="h-5 w-5 mr-2 text-primary" />
                  Fleet Location Overview
                </CardTitle>
                <CardDescription>Real-time locations and status of all fleet vehicles</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter Map
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <FleetMap 
              vehicles={filteredVehicles as ExtendedVehicle[]} 
              height="400px"
              onVehicleSelect={handleViewDetails}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tab Content Section */}
      <div className="mb-6">
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid grid-cols-2 w-full md:w-auto">
            <TabsTrigger value="vehicles">
              <Truck className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Vehicles</span>
            </TabsTrigger>
            <TabsTrigger value="drivers">
              <User className="h-4 w-4 mr-2" />
              <span className="hidden md:inline">Drivers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="vehicles" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-background border-b">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl">
                        <Truck className="h-5 w-5 mr-2 text-primary" />
                        Vehicle Inventory
                      </CardTitle>
                      <CardDescription>Manage your fleet vehicles and their details</CardDescription>
                    </div>
                    <Button onClick={handleAddVehicle}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Vehicle
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <div className="relative w-full md:w-auto flex-1 max-w-sm">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search vehicles..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-8 w-full h-9"
                      />
                    </div>
                    
                    <Select defaultValue={statusFilter} onValueChange={setStatusFilter}>
                      <SelectTrigger className="w-[150px] h-9">
                        <SelectValue placeholder="Filter by status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Statuses</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="maintenance">In Maintenance</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                        <Select
                          value={pageSize.toString()}
                          onValueChange={(size) => handlePageSizeChange(Number(size))}
                        >
                        <SelectTrigger className="h-9 w-[70px]">
                          <SelectValue placeholder={pageSize.toString()} />
                        </SelectTrigger>
                        <SelectContent>
                          {[5, 10, 25, 50].map((size) => (
                            <SelectItem key={size} value={size.toString()}>
                              {size}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                
                    <Button variant="outline" className="h-9 ml-auto" onClick={fetchData}>
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Refresh
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Batch Operations */}
              {selectedVehicles.length > 0 && (
                <div className="p-3 bg-muted/30 border-b">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center">
                      <Badge variant="secondary" className="mr-2">{selectedVehicles.length}</Badge>
                      <span className="text-sm font-medium">vehicles selected</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Select defaultValue="" onValueChange={(value) => value && handleBatchStatusChange(value)}>
                        <SelectTrigger className="h-8 w-[180px]">
                          <SelectValue placeholder="Change Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Set Active</SelectItem>
                          <SelectItem value="maintenance">Set Maintenance</SelectItem>
                          <SelectItem value="inactive">Set Inactive</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button variant="outline" size="sm" className="h-8" onClick={() => setSelectedVehicles([])}>
                        Clear Selection
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <CardContent className="p-0">
                {filteredVehicles.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 p-6">
                    <Truck className="h-12 w-12 text-muted-foreground/30 mb-4" />
                    <h3 className="text-lg font-medium text-center mb-2">No vehicles found</h3>
                    <p className="text-sm text-muted-foreground text-center mb-4">
                      {searchQuery || statusFilter !== "all" 
                        ? "Try adjusting your search filters to find what you're looking for." 
                        : "Get started by adding your first vehicle to the fleet."}
                    </p>
                    {!searchQuery && statusFilter === "all" && (
                      <Button onClick={handleAddVehicle}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Vehicle
                      </Button>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="overflow-auto">
                      <table className="w-full">
                        <thead className="bg-muted/50 text-sm">
                          <tr>
                            <th className="py-3 px-4 text-left font-medium w-[40px]">
                              <input
                                type="checkbox"
                                checked={selectedVehicles.length === paginatedVehicles.length && paginatedVehicles.length > 0}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedVehicles(paginatedVehicles.map(v => v.id.toString()));
                                  } else {
                                    setSelectedVehicles([]);
                                  }
                                }}
                                className="h-4 w-4 rounded border-gray-300"
                              />
                            </th>
                            <th className="py-3 px-4 text-left font-medium w-[60px]">ID</th>
                            <th className="py-3 px-4 text-left font-medium">Vehicle</th>
                            <th className="py-3 px-4 text-left font-medium">Type</th>
                            <th className="py-3 px-4 text-left font-medium">Status</th>
                            <th className="py-3 px-4 text-left font-medium">Last Maintenance</th>
                            <th className="py-3 px-4 text-center font-medium">Fuel</th>
                            <th className="py-3 px-4 text-right font-medium">Mileage</th>
                            <th className="py-3 px-4 text-left font-medium">Driver</th>
                            <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {paginatedVehicles.map((vehicle) => {
                            const statusColor = vehicle.status === 'active' ? 'green' : 
                              vehicle.status === 'maintenance' ? 'amber' : 'red';
                            const statusLabel = vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1);
                            
                            return (
                              <tr 
                                key={vehicle.id} 
                                className="hover:bg-muted/50 transition-colors"
                              >
                                <td className="py-3 px-4">
                                  <input
                                    type="checkbox"
                                    checked={selectedVehicles.includes(vehicle.id.toString())}
                                    onChange={() => handleToggleVehicleSelection(vehicle.id.toString())}
                                    className="h-4 w-4 rounded border-gray-300"
                                  />
                                </td>
                                <td className="py-3 px-4 text-sm">{vehicle.id}</td>
                                <td className="py-3 px-4">
                                  <div className="font-medium flex items-center">
                                    <Truck className="h-4 w-4 mr-2 text-primary" />
                                    {vehicle.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-1">
                                    {(vehicle as ExtendedVehicle).make || 'N/A'} {(vehicle as ExtendedVehicle).model || ''} 
                                    {(vehicle as ExtendedVehicle).year ? ` (${(vehicle as ExtendedVehicle).year})` : ''}
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm">{vehicle.type}</td>
                                <td className="py-3 px-4">
                                  <Badge className={`bg-${statusColor}-500/10 text-${statusColor}-500 border-${statusColor}-500/20`}>
                                    {statusLabel}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  <div className="flex items-center">
                                    <CalendarClock className="h-4 w-4 mr-2 text-muted-foreground" />
                                    <span>
                                      {(vehicle as ExtendedVehicle).lastMaintenance 
                                        ? (typeof (vehicle as ExtendedVehicle).lastMaintenance === 'string' 
                                          ? (vehicle as ExtendedVehicle).lastMaintenance 
                                          : ((vehicle as ExtendedVehicle).lastMaintenance instanceof Date)
                                              ? (vehicle as ExtendedVehicle).lastMaintenance.toLocaleDateString()
                                              : String((vehicle as ExtendedVehicle).lastMaintenance))
                                        : "N/A"}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <div className="flex flex-col items-center">
                                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700 max-w-[80px]">
                                      <div 
                                        className="bg-primary h-2 rounded-full" 
                                        style={{ width: `${(vehicle as ExtendedVehicle).fuelLevel ?? 0}%` }}
                                      />
                                    </div>
                                    <div className="text-xs mt-1 text-muted-foreground">
                                      {(vehicle as ExtendedVehicle).fuelLevel ?? 0}%
                                    </div>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-sm text-right">
                                  {(vehicle as ExtendedVehicle).mileage ? (vehicle as ExtendedVehicle).mileage.toLocaleString() : 0} mi
                                </td>
                                <td className="py-3 px-4 text-sm">
                                  {(vehicle as ExtendedVehicle).assignedDriver || "Unassigned"}
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end space-x-2">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleViewDetails(vehicle as ExtendedVehicle)} 
                                      className="h-8 w-8"
                                      title="View Details"
                                    >
                                      <FileText className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleEditVehicle(vehicle)} 
                                      className="h-8 w-8"
                                      title="Edit Vehicle"
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      onClick={() => handleDeleteVehicle(vehicle)} 
                                      className="h-8 w-8 text-destructive hover:text-destructive"
                                      title="Delete Vehicle"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                    
                    <div className="border-t">
                      <div className="flex items-center justify-between py-4 px-6">
                        <div className="flex-1 text-sm text-muted-foreground">
                          Showing {Math.min((currentPage - 1) * pageSize + 1, filteredVehicles.length)} to {Math.min(currentPage * pageSize, filteredVehicles.length)} of {filteredVehicles.length} {filteredVehicles.length === 1 ? 'vehicle' : 'vehicles'}
                        </div>
                        
                        <div className="flex-1 flex justify-center">
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(1)}
                              disabled={currentPage === 1}
                              className="h-8 w-8"
                              aria-label="First page"
                            >
                              <ChevronsLeft className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="h-8 w-8"
                              aria-label="Previous page"
                            >
                              <ChevronLeft className="h-4 w-4" />
                            </Button>
                            
                            {totalPages <= 5 ? (
                              // Show all pages if 5 or fewer
                              [...Array(totalPages)].map((_, i) => (
                                <Button
                                  key={`page-${i+1}`}
                                  variant={currentPage === i+1 ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => handlePageChange(i+1)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${i+1}`}
                                  aria-current={currentPage === i+1 ? "page" : undefined}
                                >
                                  {i+1}
                                </Button>
                              ))
                            ) : (
                              // Show limited pages with ellipsis
                              <>
                                <Button
                                  variant={currentPage === 1 ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => handlePageChange(1)}
                                  className="h-8 w-8"
                                  aria-label="Page 1"
                                >
                                  1
                                </Button>
                                
                                {currentPage > 3 && <span className="mx-1">...</span>}
                                
                                {currentPage > 2 && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${currentPage - 1}`}
                                  >
                                    {currentPage - 1}
                                  </Button>
                                )}
                                
                                {currentPage !== 1 && currentPage !== totalPages && (
                                  <Button
                                    variant="default"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${currentPage}`}
                                    aria-current="page"
                                  >
                                    {currentPage}
                                  </Button>
                                )}
                                
                                {currentPage < totalPages - 1 && (
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    className="h-8 w-8"
                                    aria-label={`Page ${currentPage + 1}`}
                                  >
                                    {currentPage + 1}
                                  </Button>
                                )}
                                
                                {currentPage < totalPages - 2 && <span className="mx-1">...</span>}
                                
                                <Button
                                  variant={currentPage === totalPages ? "default" : "outline"}
                                  size="icon"
                                  onClick={() => handlePageChange(totalPages)}
                                  className="h-8 w-8"
                                  aria-label={`Page ${totalPages}`}
                                >
                                  {totalPages}
                                </Button>
                              </>
                            )}
                            
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="h-8 w-8"
                              aria-label="Next page"
                            >
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handlePageChange(totalPages)}
                              disabled={currentPage === totalPages}
                              className="h-8 w-8"
                              aria-label="Last page"
                            >
                              <ChevronsRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex-1 flex justify-end">
                          
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="drivers" className="space-y-6">
            <Card className="overflow-hidden">
              <CardHeader className="bg-background border-b">
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center text-xl">
                        <User className="h-5 w-5 mr-2 text-primary" />
                        Driver Performance Analysis
                      </CardTitle>
                      <CardDescription>Comprehensive metrics and analytics for your fleet drivers</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Driver
                    </Button>
                  </div>
                  
                  {/* Move the tabs here, above the search/filter controls */}
                  <Tabs defaultValue="drivers-table" className="w-full">
                    <TabsList>
                      <TabsTrigger value="drivers-table">
                        <User className="h-4 w-4 mr-2" />
                        Drivers Table
                      </TabsTrigger>
                      <TabsTrigger value="leaderboards">
                        <Award className="h-4 w-4 mr-2" />
                        Leaderboards
                      </TabsTrigger>
                      <TabsTrigger value="performance-kpis">
                        <Activity className="h-4 w-4 mr-2" />
                        Performance KPIs
                      </TabsTrigger>
                    </TabsList>
                    
                    {/* Move the search/filter controls inside the TabsContent for drivers-table */}
                    <TabsContent value="drivers-table" className="mt-4 p-0">
                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <div className="relative w-full md:w-auto flex-1 max-w-sm">
                          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Search drivers..."
                            className="pl-8 w-full h-9"
                            value={driversSearch}
                            onChange={(e) => setDriversSearch(e.target.value)}
                          />
                        </div>
                        
                        <Select 
                          defaultValue={driversPerformanceFilter}
                          onValueChange={setDriversPerformanceFilter}
                        >
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="Filter by performance" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Drivers</SelectItem>
                            <SelectItem value="high">High Performers</SelectItem>
                            <SelectItem value="average">Average Performers</SelectItem>
                            <SelectItem value="low">Needs Improvement</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <Select 
                          defaultValue={driversSortMetric}
                          onValueChange={setDriversSortMetric}
                        >
                          <SelectTrigger className="w-[180px] h-9">
                            <SelectValue placeholder="Sort by metric" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="safety">Safety Score</SelectItem>
                            <SelectItem value="fuel">Fuel Efficiency</SelectItem>
                            <SelectItem value="time">Time Management</SelectItem>
                            <SelectItem value="handling">Vehicle Handling</SelectItem>
                            <SelectItem value="satisfaction">Customer Satisfaction</SelectItem>
                          </SelectContent>
                        </Select>
                        
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium whitespace-nowrap">Rows per page</span>
                          <Select
                            value={driversPageSize.toString()}
                            onValueChange={(size) => {
                              setDriversPageSize(Number(size));
                              setDriversCurrentPage(1);
                            }}
                          >
                            <SelectTrigger className="h-9 w-[70px]">
                              <SelectValue placeholder={driversPageSize.toString()} />
                            </SelectTrigger>
                            <SelectContent>
                              {[5, 10, 25, 50].map((size) => (
                                <SelectItem key={size} value={size.toString()}>
                                  {size}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <Button variant="outline" className="h-9 ml-auto" onClick={fetchData}>
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Refresh
                        </Button>
                      </div>
                      
                      {/* Continue with the drivers table content */}
                      <div className="overflow-auto">
                        <table className="w-full">
                          <thead className="bg-muted/50 text-sm">
                            <tr>
                              <th className="py-3 px-4 text-left font-medium w-[40px]">
                                <input
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300"
                                  checked={selectedDrivers.length === paginatedDrivers.length && paginatedDrivers.length > 0}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setSelectedDrivers(paginatedDrivers.map(d => d.id));
                                    } else {
                                      setSelectedDrivers([]);
                                    }
                                  }}
                                />
                              </th>
                              <th className="py-3 px-4 text-left font-medium w-[240px]">Driver</th>
                              <th className="py-3 px-4 text-center font-medium">Safety Score</th>
                              <th className="py-3 px-4 text-center font-medium">Fuel Efficiency</th>
                              <th className="py-3 px-4 text-center font-medium">Time Management</th>
                              <th className="py-3 px-4 text-center font-medium">Vehicle Handling</th>
                              <th className="py-3 px-4 text-center font-medium">Customer Satisfaction</th>
                              <th className="py-3 px-4 text-center font-medium">Overall Rating</th>
                              <th className="py-3 px-4 text-right font-medium w-[140px]">Actions</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {paginatedDrivers.map(driver => {
                              const overallScore = Math.round(
                                (driver.safetyScore + 
                                driver.fuelEfficiency + 
                                driver.timeManagement + 
                                driver.vehicleHandling + 
                                driver.customerSatisfaction) / 5
                              );
                              
                              let performanceCategory = "average";
                              if (overallScore >= 90) performanceCategory = "high";
                              else if (overallScore < 85) performanceCategory = "low";
                              
                              const categoryColors = {
                                high: "green",
                                average: "blue",
                                low: "amber"
                              };
                              
                              const performanceColor = categoryColors[performanceCategory as keyof typeof categoryColors];
                              
                              return (
                                <tr key={driver.id} className="hover:bg-muted/50 transition-colors">
                                  <td className="py-3 px-4">
                                    <input
                                      type="checkbox"
                                      className="h-4 w-4 rounded border-gray-300"
                                      checked={selectedDrivers.includes(driver.id)}
                                      onChange={() => {
                                        if (selectedDrivers.includes(driver.id)) {
                                          setSelectedDrivers(selectedDrivers.filter(id => id !== driver.id));
                                        } else {
                                          setSelectedDrivers([...selectedDrivers, driver.id]);
                                        }
                                      }}
                                    />
                                  </td>
                                  <td className="py-3 px-4">
                                    <div className="flex items-center">
                                      <div className="h-10 w-10 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white font-semibold`}>
                                          <User className="h-5 w-5" />
                                        </div>
                                      </div>
                                      <div>
                                        <div className="font-medium">{driver.name}</div>
                                        <div className="text-xs text-muted-foreground">
                                          ID: {driver.id} • {driver.trips} trips
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                      {driver.safetyScore}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                      {driver.fuelEfficiency}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                      {driver.timeManagement}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                                      {driver.vehicleHandling}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                      {driver.customerSatisfaction}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-center">
                                    <div className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-${performanceColor}-100 text-${performanceColor}-800`}>
                                      {overallScore}%
                                    </div>
                                  </td>
                                  <td className="py-3 px-4 text-right">
                                    <div className="flex items-center justify-end space-x-2">
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleViewDriverDetails(driver)} 
                                        className="h-8 w-8"
                                        title="View Details"
                                      >
                                        <FileText className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleEditDriver(driver)} 
                                        className="h-8 w-8"
                                        title="Edit Driver"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </Button>
                                      <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => handleDeleteDriver(driver)} 
                                        className="h-8 w-8 text-destructive hover:text-destructive"
                                        title="Delete Driver"
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </TabsContent>
                    
                    {/* The other tabs content remains the same */}
                    <TabsContent value="leaderboards" className="mt-0 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Award className="h-5 w-5 mr-2 text-yellow-500" />
                              Top Performers Overall
                            </CardTitle>
                            <CardDescription>Drivers with the highest combined scores</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => {
                                  const aScore = (a.safetyScore + a.fuelEfficiency + a.timeManagement + a.vehicleHandling + a.customerSatisfaction) / 5;
                                  const bScore = (b.safetyScore + b.fuelEfficiency + b.timeManagement + b.vehicleHandling + b.customerSatisfaction) / 5;
                                  return bScore - aScore;
                                })
                                .slice(0, 5)
                                .map((driver, index) => {
                                  const overallScore = Math.round((driver.safetyScore + driver.fuelEfficiency + driver.timeManagement + driver.vehicleHandling + driver.customerSatisfaction) / 5);
                                  return (
                                    <div key={driver.id} className="flex items-center">
                                      <div className="w-8 text-center font-bold">
                                        {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                      </div>
                                      <div className="flex items-center flex-1 ml-2">
                                        <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                          <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                            <User className="h-4 w-4" />
                                          </div>
                                        </div>
                                        <div className="font-medium">{driver.name}</div>
                                      </div>
                                      <div className="flex justify-end mr-2">
                                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${overallScore >= 90 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                                          {overallScore}%
                                        </div>
                                      </div>
                                    </div>
                                  );
                                })}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Shield className="h-5 w-5 mr-2 text-green-500" />
                              Safety Champions
                            </CardTitle>
                            <CardDescription>Drivers with the best safety records</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => b.safetyScore - a.safetyScore)
                                .slice(0, 5)
                                .map((driver, index) => (
                                  <div key={driver.id} className="flex items-center">
                                    <div className="w-8 text-center font-bold">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex items-center flex-1 ml-2">
                                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                          <User className="h-4 w-4" />
                                        </div>
                                      </div>
                                      <div className="font-medium">{driver.name}</div>
                                    </div>
                                    <div className="flex justify-end mr-2">
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        {driver.safetyScore}%
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Fuel className="h-5 w-5 mr-2 text-blue-500" />
                              Fuel Efficiency Leaders
                            </CardTitle>
                            <CardDescription>Drivers with the best fuel economy</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => b.fuelEfficiency - a.fuelEfficiency)
                                .slice(0, 5)
                                .map((driver, index) => (
                                  <div key={driver.id} className="flex items-center">
                                    <div className="w-8 text-center font-bold">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex items-center flex-1 ml-2">
                                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                          <User className="h-4 w-4" />
                                        </div>
                                      </div>
                                      <div className="font-medium">{driver.name}</div>
                                    </div>
                                    <div className="flex justify-end mr-2">
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {driver.fuelEfficiency}%
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <ThumbsUp className="h-5 w-5 mr-2 text-indigo-500" />
                              Customer Satisfaction Leaders
                            </CardTitle>
                            <CardDescription>Drivers with the best customer ratings</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {[...driversData]
                                .sort((a, b) => b.customerSatisfaction - a.customerSatisfaction)
                                .slice(0, 5)
                                .map((driver, index) => (
                                  <div key={driver.id} className="flex items-center">
                                    <div className="w-8 text-center font-bold">
                                      {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                                    </div>
                                    <div className="flex items-center flex-1 ml-2">
                                      <div className="h-8 w-8 rounded-full flex items-center justify-center overflow-hidden mr-3">
                                        <div className={`${getAvatarColor(driver.name)} h-full w-full flex items-center justify-center text-white text-xs font-semibold`}>
                                          <User className="h-4 w-4" />
                                        </div>
                                      </div>
                                      <div className="font-medium">{driver.name}</div>
                                    </div>
                                    <div className="flex justify-end mr-2">
                                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        {driver.customerSatisfaction}%
                                      </div>
                                    </div>
                                  </div>
                                ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="performance-kpis" className="mt-0 p-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Fleet Safety Score</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-green-500">
                              {Math.round(driversData.reduce((acc, driver) => acc + driver.safetyScore, 0) / driversData.length)}%
                            </div>
                            <div className="flex items-center">
                              <Shield className="h-4 w-4 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Average driver safety rating</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Fuel Efficiency</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-blue-500">
                              {Math.round(driversData.reduce((acc, driver) => acc + driver.fuelEfficiency, 0) / driversData.length)}%
                            </div>
                            <div className="flex items-center">
                              <Fuel className="h-4 w-4 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Average fuel optimization</p>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Customer Satisfaction</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold text-indigo-500">
                              {Math.round(driversData.reduce((acc, driver) => acc + driver.customerSatisfaction, 0) / driversData.length)}%
                            </div>
                            <div className="flex items-center">
                              <ThumbsUp className="h-4 w-4 mr-1 text-muted-foreground" />
                              <p className="text-xs text-muted-foreground">Average customer rating</p>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                              Key Performance Indicators
                            </CardTitle>
                            <CardDescription>Critical metrics across all drivers</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Shield className="h-5 w-5 mr-2 text-green-500" />
                                  <span>Average Safety Score</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.safetyScore, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Fuel className="h-5 w-5 mr-2 text-blue-500" />
                                  <span>Average Fuel Efficiency</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.fuelEfficiency, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Clock className="h-5 w-5 mr-2 text-purple-500" />
                                  <span>Average Time Management</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.timeManagement, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Truck className="h-5 w-5 mr-2 text-orange-500" />
                                  <span>Average Vehicle Handling</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.vehicleHandling, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <ThumbsUp className="h-5 w-5 mr-2 text-indigo-500" />
                                  <span>Average Customer Satisfaction</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.customerSatisfaction, 0) / driversData.length)}%
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <AlertCircle className="h-5 w-5 mr-2 text-red-500" />
                                  <span>Incidents per Driver</span>
                                </div>
                                <div className="font-semibold">
                                  {(driversData.reduce((acc, driver) => acc + driver.incidents, 0) / driversData.length).toFixed(2)}
                                </div>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                  <Map className="h-5 w-5 mr-2 text-cyan-500" />
                                  <span>Average Mileage per Driver</span>
                                </div>
                                <div className="font-semibold">
                                  {Math.round(driversData.reduce((acc, driver) => acc + driver.mileage, 0) / driversData.length).toLocaleString()} mi
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Card>
                          <CardHeader>
                            <CardTitle className="text-lg flex items-center">
                              <Activity className="h-5 w-5 mr-2 text-primary" />
                              Performance Distribution
                            </CardTitle>
                            <CardDescription>Driver performance by category</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-5">
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">High Performers (90%+)</span>
                                  <span className="text-sm font-medium">
                                    {driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 >= 90
                                    ).length} drivers
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-green-500 h-2.5 rounded-full" style={{ 
                                    width: `${(driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 >= 90
                                    ).length / driversData.length) * 100}%` 
                                  }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Average Performers (85-89%)</span>
                                  <span className="text-sm font-medium">
                                    {driversData.filter(d => {
                                      const avg = (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5;
                                      return avg >= 85 && avg < 90;
                                    }).length} drivers
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-blue-500 h-2.5 rounded-full" style={{ 
                                    width: `${(driversData.filter(d => {
                                      const avg = (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5;
                                      return avg >= 85 && avg < 90;
                                    }).length / driversData.length) * 100}%` 
                                  }}></div>
                                </div>
                              </div>
                              
                              <div>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-sm font-medium">Needs Improvement (Below 85%)</span>
                                  <span className="text-sm font-medium">
                                    {driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 < 85
                                    ).length} drivers
                                  </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                  <div className="bg-amber-500 h-2.5 rounded-full" style={{ 
                                    width: `${(driversData.filter(d => 
                                      (d.safetyScore + d.fuelEfficiency + d.timeManagement + d.vehicleHandling + d.customerSatisfaction) / 5 < 85
                                    ).length / driversData.length) * 100}%` 
                                  }}></div>
                                </div>
                              </div>
                              
                              <div className="pt-4 border-t">
                                <h4 className="font-medium mb-3 text-sm">Incidents by Driver</h4>
                                <div className="grid grid-cols-5 gap-2">
                                  {driversData.map(driver => (
                                    <div key={driver.id} className="text-center">
                                      <div className={`h-8 w-8 rounded-full mx-auto flex items-center justify-center ${
                                        driver.incidents === 0 
                                          ? 'bg-green-100 text-green-800' 
                                          : driver.incidents === 1 
                                            ? 'bg-amber-100 text-amber-800' 
                                            : 'bg-red-100 text-red-800'
                                      }`}>
                                        {driver.incidents}
                                      </div>
                                      <div className="text-xs mt-1 overflow-hidden text-ellipsis whitespace-nowrap" title={driver.name}>
                                        {driver.name.split(' ')[0]}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                      
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg flex items-center">
                            <BarChart className="h-5 w-5 mr-2 text-primary" />
                            Comparative Analytics
                          </CardTitle>
                          <CardDescription>Overall fleet performance analytics</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="h-80">
                            <div className="flex items-center justify-center h-full">
                              <div className="text-center text-muted-foreground">
                                <BarChart className="h-16 w-16 mx-auto mb-2 text-muted-foreground/50" />
                                <p>Performance comparison chart would be displayed here</p>
                                <p className="text-sm mt-2">Using the fleet performance data from all drivers</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {/* Keep the pagination section outside the tabs */}
                
                {/* Pagination for Drivers */}
                <div className="border-t">
                  <div className="flex items-center justify-between py-4 px-6">
                    <div className="flex-1 text-sm text-muted-foreground">
                      Showing {Math.min((driversCurrentPage - 1) * driversPageSize + 1, filteredDrivers.length)} to {Math.min(driversCurrentPage * driversPageSize, filteredDrivers.length)} of {filteredDrivers.length} {filteredDrivers.length === 1 ? 'driver' : 'drivers'}
                    </div>
                    
                    <div className="flex-1 flex justify-center">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(1)}
                          disabled={driversCurrentPage === 1}
                          className="h-8 w-8"
                          aria-label="First page"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(driversCurrentPage - 1)}
                          disabled={driversCurrentPage === 1}
                          className="h-8 w-8"
                          aria-label="Previous page"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        
                        {driversTotalPages <= 5 ? (
                          // Show all pages if 5 or fewer
                          [...Array(driversTotalPages)].map((_, i) => (
                            <Button
                              key={`page-${i+1}`}
                              variant={driversCurrentPage === i+1 ? "default" : "outline"}
                              size="icon"
                              onClick={() => setDriversCurrentPage(i+1)}
                              className="h-8 w-8"
                              aria-label={`Page ${i+1}`}
                              aria-current={driversCurrentPage === i+1 ? "page" : undefined}
                            >
                              {i+1}
                            </Button>
                          ))
                        ) : (
                          // Show limited pages with ellipsis
                          <>
                            <Button
                              variant={driversCurrentPage === 1 ? "default" : "outline"}
                              size="icon"
                              onClick={() => setDriversCurrentPage(1)}
                              className="h-8 w-8"
                              aria-label="Page 1"
                            >
                              1
                            </Button>
                            
                            {driversCurrentPage > 3 && <span className="mx-1">...</span>}
                            
                            {driversCurrentPage > 2 && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setDriversCurrentPage(driversCurrentPage - 1)}
                                className="h-8 w-8"
                                aria-label={`Page ${driversCurrentPage - 1}`}
                              >
                                {driversCurrentPage - 1}
                              </Button>
                            )}
                            
                            {driversCurrentPage !== 1 && driversCurrentPage !== driversTotalPages && (
                              <Button
                                variant="default"
                                size="icon"
                                onClick={() => setDriversCurrentPage(driversCurrentPage)}
                                className="h-8 w-8"
                                aria-label={`Page ${driversCurrentPage}`}
                                aria-current="page"
                              >
                                {driversCurrentPage}
                              </Button>
                            )}
                            
                            {driversCurrentPage < driversTotalPages - 1 && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => setDriversCurrentPage(driversCurrentPage + 1)}
                                className="h-8 w-8"
                                aria-label={`Page ${driversCurrentPage + 1}`}
                              >
                                {driversCurrentPage + 1}
                              </Button>
                            )}
                            
                            {driversCurrentPage < driversTotalPages - 2 && <span className="mx-1">...</span>}
                            
                            <Button
                              variant={driversCurrentPage === driversTotalPages ? "default" : "outline"}
                              size="icon"
                              onClick={() => setDriversCurrentPage(driversTotalPages)}
                              className="h-8 w-8"
                              aria-label={`Page ${driversTotalPages}`}
                            >
                              {driversTotalPages}
                            </Button>
                          </>
                        )}
                        
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(driversCurrentPage + 1)}
                          disabled={driversCurrentPage === driversTotalPages}
                          className="h-8 w-8"
                          aria-label="Next page"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => setDriversCurrentPage(driversTotalPages)}
                          disabled={driversCurrentPage === driversTotalPages}
                          className="h-8 w-8"
                          aria-label="Last page"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {/* Empty div to maintain balance in the layout */}
                    <div className="flex-1"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Fleet Management Analytics Dashboard - Moved outside the tab group */}
      <div className="space-y-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <TrendingUp className="h-6 w-6 mr-2 text-primary" />
              Fleet Analytics Dashboard
            </h2>
            <p className="text-muted-foreground">Comprehensive analytics and technical metrics for your fleet</p>
          </div>
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
        
        {/* Enhanced Fleet Health Monitoring System */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-background border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Activity className="h-5 w-5 mr-2 text-primary" />
                  Vehicle Health Monitoring System
                </CardTitle>
                <CardDescription>Real-time diagnostic metrics and predictive maintenance analysis</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Cpu className="h-4 w-4 mr-2" />
                  Run Diagnostics
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Refresh Data
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-primary" />
                        Component Health Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground w-full p-4">
                        <BarChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                        <p>Health distribution visualization</p>
                        <p className="text-xs mt-1">Showing health metrics across critical components</p>
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        Fleet Health Trend Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="h-[250px] flex items-center justify-center">
                      <div className="text-center text-muted-foreground w-full p-4">
                        <Activity className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                        <p>Health trend visualization</p>
                        <p className="text-xs mt-1">Showing health score trends over last 6 months</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-2 text-primary" />
                      Predictive Maintenance Alerts
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                        <div className="flex items-start">
                          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Battery Replacement Required</div>
                            <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">Truck #103 - Battery voltage dropping below acceptable levels. Replacement recommended within 2 weeks.</div>
                            <div className="flex items-center mt-2 gap-2">
                              <Badge variant="outline" className="text-xs bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">High Priority</Badge>
                              <span className="text-xs text-amber-600 dark:text-amber-500">92% Confidence</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
                        <div className="flex items-start">
                          <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-500 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <div className="text-sm font-medium text-blue-800 dark:text-blue-400">Tire Rotation Due</div>
                            <div className="text-xs text-blue-800 dark:text-blue-400 mt-1">Van #205 - Front tires showing uneven wear pattern. Rotation recommended during next service.</div>
                            <div className="flex items-center mt-2 gap-2">
                              <Badge variant="outline" className="text-xs bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400">Medium Priority</Badge>
                              <span className="text-xs text-blue-600 dark:text-blue-500">85% Confidence</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <CircleDot className="h-4 w-4 mr-2 text-primary" />
                      Component Health Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Engine</span>
                          <span className="text-sm font-medium text-green-600">92%</span>
                        </div>
                        <Progress value={92} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Transmission</span>
                          <span className="text-sm font-medium text-green-600">88%</span>
                        </div>
                        <Progress value={88} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Brakes</span>
                          <span className="text-sm font-medium text-amber-600">75%</span>
                        </div>
                        <Progress value={75} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Suspension</span>
                          <span className="text-sm font-medium text-green-600">95%</span>
                        </div>
                        <Progress value={95} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Electrical</span>
                          <span className="text-sm font-medium text-green-600">82%</span>
                        </div>
                        <Progress value={82} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Fluid Levels</span>
                          <span className="text-sm font-medium text-green-600">90%</span>
                        </div>
                        <Progress value={90} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Tires</span>
                          <span className="text-sm font-medium text-amber-600">62%</span>
                        </div>
                        <Progress value={62} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Battery</span>
                          <span className="text-sm font-medium text-red-600">45%</span>
                        </div>
                        <Progress value={45} className="h-1.5" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Enhanced Fleet Maintenance System */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-background border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Wrench className="h-5 w-5 mr-2 text-primary" />
                  Advanced Maintenance Management System
                </CardTitle>
                <CardDescription>Proactive maintenance scheduling and service history analytics</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Schedule Service
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  View Calendar
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-primary" />
                      Maintenance Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Vehicle</TableHead>
                          <TableHead>Service Type</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="font-medium">Truck #103</TableCell>
                          <TableCell>Oil Change & Filter</TableCell>
                          <TableCell>Apr 18, 2024</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-amber-100 dark:bg-amber-900 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-400">
                              Due Soon
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Van #201</TableCell>
                          <TableCell>Brake Inspection</TableCell>
                          <TableCell>Apr 22, 2024</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400">
                              Scheduled
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Truck #105</TableCell>
                          <TableCell>Tire Rotation</TableCell>
                          <TableCell>Apr 10, 2024</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400">
                              Overdue
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="font-medium">Van #205</TableCell>
                          <TableCell>Full Inspection</TableCell>
                          <TableCell>Apr 30, 2024</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 dark:bg-blue-900 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400">
                              Scheduled
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart className="h-4 w-4 mr-2 text-primary" />
                      Maintenance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Total Services</div>
                          <div className="text-2xl font-bold">87</div>
                        </div>
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-full">
                          <Check className="h-4 w-4 text-green-600 dark:text-green-500" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Upcoming</div>
                          <div className="text-2xl font-bold">12</div>
                        </div>
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-500" />
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Overdue</div>
                          <div className="text-2xl font-bold">3</div>
                        </div>
                        <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                          <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-500" />
                        </div>
                      </div>
                      <div className="pt-2 border-t mt-2">
                        <div className="text-sm font-medium mb-2">Maintenance Type Distribution</div>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">Routine Service</span>
                              <span className="text-xs font-medium">62%</span>
                            </div>
                            <Progress value={62} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">Repairs</span>
                              <span className="text-xs font-medium">28%</span>
                            </div>
                            <Progress value={28} className="h-1" />
                          </div>
                          <div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs text-muted-foreground">Inspections</span>
                              <span className="text-xs font-medium">10%</span>
                            </div>
                            <Progress value={10} className="h-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Enhanced Fuel Management System */}
        <Card className="overflow-hidden border-0 shadow-md">
          <CardHeader className="bg-background border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center text-xl">
                  <Fuel className="h-5 w-5 mr-2 text-primary" />
                  Fuel Analytics & Optimization System
                </CardTitle>
                <CardDescription>Fuel consumption metrics, efficiency analysis and cost optimization</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Analysis
                </Button>
                <Button variant="outline" size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Record
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 flex flex-col justify-between">
                    <div className="text-sm text-muted-foreground">Total Fuel Consumption</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-2xl font-bold">1,248 gal</div>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                        -3.5%
                      </Badge>
                    </div>
                  </Card>
                  <Card className="p-4 flex flex-col justify-between">
                    <div className="text-sm text-muted-foreground">Average MPG</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-2xl font-bold">14.8 mpg</div>
                      <Badge variant="outline" className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">
                        +1.2%
                      </Badge>
                    </div>
                  </Card>
                  <Card className="p-4 flex flex-col justify-between">
                    <div className="text-sm text-muted-foreground">Total Fuel Cost</div>
                    <div className="mt-2 flex items-end justify-between">
                      <div className="text-2xl font-bold">$4,867</div>
                      <Badge variant="outline" className="bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400">
                        +2.8%
                      </Badge>
                    </div>
                  </Card>
                </div>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <BarChart3 className="h-4 w-4 mr-2 text-primary" />
                      Fuel Consumption Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="h-[250px] flex items-center justify-center">
                    <div className="text-center text-muted-foreground w-full p-4">
                      <BarChart className="h-12 w-12 mx-auto mb-2 text-muted-foreground/50" />
                      <p>Fuel consumption visualization</p>
                      <p className="text-xs mt-1">Monthly consumption by vehicle type</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <div>
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center">
                      <DollarSign className="h-4 w-4 mr-2 text-primary" />
                      Fuel Efficiency Ranking
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Van #205</span>
                          <span className="text-sm font-medium">18.4 mpg</span>
                        </div>
                        <Progress value={92} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Van #201</span>
                          <span className="text-sm font-medium">17.8 mpg</span>
                        </div>
                        <Progress value={89} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Truck #107</span>
                          <span className="text-sm font-medium">15.2 mpg</span>
                        </div>
                        <Progress value={76} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Truck #103</span>
                          <span className="text-sm font-medium">14.6 mpg</span>
                        </div>
                        <Progress value={73} className="h-1.5" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm">Truck #105</span>
                          <span className="text-sm font-medium">12.8 mpg</span>
                        </div>
                        <Progress value={64} className="h-1.5" />
                      </div>
                      <div className="pt-4 border-t mt-2">
                        <div className="text-sm font-medium mb-2">Fuel Cost Analysis</div>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Month</TableHead>
                              <TableHead className="text-right">Cost</TableHead>
                              <TableHead className="text-right">Trend</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody className="text-sm">
                            <TableRow>
                              <TableCell>April</TableCell>
                              <TableCell className="text-right">$1,245</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline" className="text-xs bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400">+2.3%</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>March</TableCell>
                              <TableCell className="text-right">$1,218</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline" className="text-xs bg-red-100 dark:bg-red-900 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400">+1.8%</Badge>
                              </TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell>February</TableCell>
                              <TableCell className="text-right">$1,196</TableCell>
                              <TableCell className="text-right">
                                <Badge variant="outline" className="text-xs bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800 text-green-800 dark:text-green-400">-1.2%</Badge>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

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
        <DialogContent className="min-w-[50vw] h-[90vh] p-0">
          {vehicleForDetails && (
            <div className="h-full flex flex-col">
              <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">Vehicle Details</DialogTitle>
                  <DialogDescription className="sr-only">Detailed information about the selected vehicle</DialogDescription>
                  <Button variant="ghost" size="icon" onClick={() => setDetailPanelOpen(false)} className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto">
                {/* Top Row - Vehicle Details */}
                <div className="p-6 pb-3">
                  <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                    <Truck className="h-12 w-12 text-primary p-2 bg-primary/10 rounded-full" />
                    <div className="flex-1">
                      <h3 className="text-xl font-medium">{vehicleForDetails.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={
                          vehicleForDetails.status === 'active' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                          vehicleForDetails.status === 'maintenance' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-red-500/10 text-red-500 border-red-500/20'
                        }>
                          {vehicleForDetails.status.charAt(0).toUpperCase() + vehicleForDetails.status.slice(1)}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {vehicleForDetails.make || 'N/A'} {vehicleForDetails.model || 'N/A'} • {vehicleForDetails.year || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setDetailPanelOpen(false);
                          handleEditVehicle(vehicleForDetails);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Vehicle
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="px-6 grid grid-cols-4 gap-6">
                  {/* Left Column (spans 3 cols) */}
                  <div className="col-span-3 space-y-6">
                    {/* Second Row - Location Map */}
                    <Card className="shadow-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <Map className="h-4 w-4 mr-2 text-primary" />
                          Vehicle Location
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-0 h-[250px] overflow-hidden rounded-b-lg">
                        {vehicleForDetails.location ? (
                          <MapComponent 
                            location={vehicleForDetails.location}
                            locationName={vehicleForDetails.location.address}
                          />
                        ) : (
                          <div className="h-full bg-muted/20 flex items-center justify-center">
                            <div className="text-center text-muted-foreground">
                              <Map className="h-8 w-8 mx-auto mb-1 text-muted-foreground/50" />
                              <p className="text-sm">No location data available</p>
                              <p className="text-xs mt-1">Vehicle location tracking disabled or offline</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                    
                    {/* Third Row - Vehicle Information */}
                    <Card className="shadow-sm">
                      <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                          <FileText className="h-4 w-4 mr-2 text-primary" />
                          Vehicle Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">License Plate:</span>
                              <span className="font-mono font-medium">{vehicleForDetails.licensePlate || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">VIN:</span>
                              <span className="font-mono font-medium">{vehicleForDetails.vinNumber || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Mileage:</span>
                              <span className="font-medium">{vehicleForDetails.mileage?.toLocaleString() || '0'} mi</span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Department:</span>
                              <span className="font-medium">{vehicleForDetails.departmentName || 'Unassigned'}</span>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Last Maintenance:</span>
                              <span className="font-medium">
                                {vehicleForDetails.lastMaintenance 
                                  ? (typeof vehicleForDetails.lastMaintenance === 'string' 
                                    ? vehicleForDetails.lastMaintenance 
                                    : vehicleForDetails.lastMaintenance instanceof Date
                                      ? vehicleForDetails.lastMaintenance.toLocaleDateString()
                                      : String(vehicleForDetails.lastMaintenance)) 
                                  : "N/A"}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Registration Expires:</span>
                              <span className="font-medium">
                                {vehicleForDetails.registrationExpiry ? new Date(vehicleForDetails.registrationExpiry).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm border-b pb-2">
                              <span className="text-muted-foreground">Insurance Expires:</span>
                              <span className="font-medium">
                                {vehicleForDetails.insuranceExpiry ? new Date(vehicleForDetails.insuranceExpiry).toLocaleDateString() : 'N/A'}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-muted-foreground">Assigned Driver:</span>
                              <span className="font-medium">{vehicleForDetails.assignedDriver || 'Unassigned'}</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-4">
                          <span className="text-sm text-muted-foreground">Fuel Level:</span>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                              <div 
                                className={`h-2 rounded-full ${vehicleForDetails.fuelLevel! > 60 ? 'bg-green-500' : vehicleForDetails.fuelLevel! > 25 ? 'bg-amber-500' : 'bg-red-500'}`}
                                style={{ width: `${vehicleForDetails.fuelLevel || 0}%` }}
                              />
                            </div>
                            <span className="font-medium">{vehicleForDetails.fuelLevel || '0'}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Fourth Row - Grid with Performance Metrics and Fuel Records */}
                    <div className="grid grid-cols-2 gap-6">
                      {/* Performance Summary */}
                      <Card className="shadow-sm">
                        <CardHeader className="p-4">
                          <CardTitle className="text-base flex items-center">
                            <Activity className="h-4 w-4 mr-2 text-primary" />
                            Performance Metrics
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 max-h-[250px] overflow-y-auto">
                          <div className="space-y-4">
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Efficiency Rating</span>
                                <span className="font-medium">
                                  {vehicleForDetails.fuelEfficiency ? `${vehicleForDetails.fuelEfficiency}%` : 'N/A'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div 
                                  className="bg-blue-500 h-1.5 rounded-full"
                                  style={{ width: `${vehicleForDetails.fuelEfficiency || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Utilization Rate</span>
                                <span className="font-medium">
                                  {vehicleForDetails.utilizationRate ? `${vehicleForDetails.utilizationRate}%` : 'N/A'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div 
                                  className="bg-purple-500 h-1.5 rounded-full"
                                  style={{ width: `${vehicleForDetails.utilizationRate || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Maintenance Score</span>
                                <span className="font-medium">
                                  {vehicleForDetails.maintenanceScore ? `${vehicleForDetails.maintenanceScore}%` : 'N/A'}
                                </span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                <div 
                                  className="bg-green-500 h-1.5 rounded-full"
                                  style={{ width: `${vehicleForDetails.maintenanceScore || 0}%` }}
                                />
                              </div>
                            </div>
                            
                            <div className="pt-2 border-t">
                              <div className="flex justify-between mb-2">
                                <span className="text-sm font-medium">Monthly Cost Average</span>
                                <span className="text-sm font-medium text-primary">
                                  ${vehicleForDetails.monthlyCost?.toFixed(2) || '0.00'}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Based on maintenance and fuel records from the last 3 months
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      
                      {/* Fuel History Summary */}
                      <Card className="shadow-sm">
                        <CardHeader className="p-4 flex flex-row items-center justify-between">
                          <CardTitle className="text-base flex items-center">
                            <Fuel className="h-4 w-4 mr-2 text-primary" />
                            Recent Fuel Records
                          </CardTitle>
                          <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">View All</Button>
                        </CardHeader>
                        <CardContent className="px-4 pb-4 pt-0 max-h-[250px] overflow-y-auto">
                          <div className="space-y-3 text-sm">
                            {fuelRecords
                              .filter(r => r.vehicleId === vehicleForDetails.id)
                              .sort((a, b) => b.date.getTime() - a.date.getTime())
                              .slice(0, 3)
                              .map(record => (
                                <div key={record.id} className="p-2 border rounded-md">
                                  <div className="flex justify-between mb-1">
                                    <span className="font-medium">{record.gallons.toFixed(2)} gallons</span>
                                    <span className="text-primary font-medium">${record.cost.toFixed(2)}</span>
                                  </div>
                                  <div className="flex justify-between text-xs text-muted-foreground">
                                    <span>{record.date.toLocaleDateString()}</span>
                                    <span>{record.mileage.toLocaleString()} miles</span>
                                  </div>
                                  {record.mpg && (
                                    <div className="flex items-center mt-1">
                                      <div className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded-full">
                                        {record.mpg.toFixed(1)} MPG
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))}
                            {fuelRecords.filter(r => r.vehicleId === vehicleForDetails.id).length === 0 && (
                              <div className="py-3 text-center text-muted-foreground">
                                <p>No fuel records found</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  {/* Right Column (Maintenance History) - spans vertically */}
                  <div className="col-span-1">
                    {/* Maintenance History Summary (spans vertically from row 2-5) */}
                    <Card className="shadow-sm h-full flex flex-col">
                      <CardHeader className="p-4 flex flex-row items-center justify-between">
                        <div>
                          <CardTitle className="text-base flex items-center">
                            <Settings className="h-4 w-4 mr-2 text-primary" />
                            Maintenance History
                          </CardTitle>
                          <CardDescription className="text-xs mt-1">
                            Service records, repairs and maintenance schedule
                          </CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">View All</Button>
                      </CardHeader>
                      <CardContent className="px-4 pb-4 pt-0 flex-1 overflow-y-auto">
                        {vehicleForDetails.notes && (
                          <div className="mb-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-md p-3">
                            <div className="flex items-start">
                              <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-500 mt-0.5 mr-2 flex-shrink-0" />
                              <div>
                                <div className="text-sm font-medium text-amber-800 dark:text-amber-400">Maintenance Note</div>
                                <div className="text-xs text-amber-800 dark:text-amber-400 mt-1">{vehicleForDetails.notes}</div>
                              </div>
                            </div>
                          </div>
                        )}

                        <div className="flex items-center justify-between mb-4 border-b pb-3">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <div className="flex flex-col">
                              <span className="text-xs text-muted-foreground">Next Service</span>
                              <span className="text-sm font-medium">
                                {formatDate(vehicleForDetails.nextServiceDue)}
                              </span>
                            </div>
                          </div>
                          <Badge variant={
                            getMaintenanceStatus(vehicleForDetails.nextServiceDue) === 'overdue' ? 'destructive' :
                            getMaintenanceStatus(vehicleForDetails.nextServiceDue) === 'due-soon' ? 'outline' :
                            'success'
                          }>
                            {getMaintenanceStatus(vehicleForDetails.nextServiceDue) === 'overdue' ? 'Overdue' :
                             getMaintenanceStatus(vehicleForDetails.nextServiceDue) === 'due-soon' ? 'Due Soon' :
                             'On Schedule'}
                          </Badge>
                        </div>

                        <div className="space-y-3 text-sm">
                          {maintenanceRecords
                            .filter(r => r.vehicleId === vehicleForDetails.id)
                            .sort((a, b) => b.date.getTime() - a.date.getTime())
                            .map(record => (
                              <div key={record.id} className="p-3 border rounded-md hover:bg-muted/30 transition-colors">
                                <div className="flex justify-between mb-1.5">
                                  <div className="flex items-center">
                                    {record.type === 'oil change' && <Fuel className="h-3.5 w-3.5 mr-1.5 text-blue-500" />}
                                    {record.type === 'tire replacement' && <CircleOff className="h-3.5 w-3.5 mr-1.5 text-gray-500" />}
                                    {record.type === 'brake service' && <Gauge className="h-3.5 w-3.5 mr-1.5 text-red-500" />}
                                    {record.type === 'inspection' && <CheckCircle className="h-3.5 w-3.5 mr-1.5 text-green-500" />}
                                    {record.type === 'repair' && <Wrench className="h-3.5 w-3.5 mr-1.5 text-amber-500" />}
                                    {!['oil change', 'tire replacement', 'brake service', 'inspection', 'repair'].includes(record.type) && 
                                      <Settings className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                                    }
                                    <span className="font-medium capitalize">{record.type}</span>
                                  </div>
                                  <Badge variant={
                                    record.status === 'completed' ? 'success' : 
                                    record.status === 'scheduled' ? 'outline' : 'destructive'
                                  } className="text-[10px] py-0 h-5">
                                    {record.status === 'completed' && <Check className="h-3 w-3 mr-1" />}
                                    {record.status === 'scheduled' && <Calendar className="h-3 w-3 mr-1" />}
                                    {record.status === 'canceled' && <X className="h-3 w-3 mr-1" />}
                                    {record.status}
                                  </Badge>
                                </div>
                                
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground mt-1.5 mb-1.5">
                                  <div className="flex items-center">
                                    <Calendar className="h-3 w-3 mr-1" />
                                    {record.date.toLocaleDateString()}
                                  </div>
                                  {record.cost && (
                                    <div className="flex items-center">
                                      <DollarSign className="h-3 w-3 mr-1" />
                                      ${record.cost.toFixed(2)}
                                    </div>
                                  )}
                                  {record.mileage && (
                                    <div className="flex items-center">
                                      <Gauge className="h-3 w-3 mr-1" />
                                      {record.mileage.toLocaleString()} mi
                                    </div>
                                  )}
                                  {record.technician && (
                                    <div className="flex items-center">
                                      <UserRound className="h-3 w-3 mr-1" />
                                      {record.technician}
                                    </div>
                                  )}
                                </div>
                                
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{record.description}</p>
                              </div>
                            ))}
                          {maintenanceRecords.filter(r => r.vehicleId === vehicleForDetails.id).length === 0 && (
                            <div className="py-6 text-center text-muted-foreground">
                              <Settings className="h-10 w-10 mx-auto mb-2 text-muted-foreground/30" />
                              <p className="text-sm">No maintenance records found</p>
                              <p className="text-xs mt-1">Regular maintenance records will appear here</p>
                            </div>
                          )}
                        </div>

                        <div className="mt-4 pt-4 border-t">
                          <Button variant="outline" size="sm" className="w-full">
                            <Plus className="h-3.5 w-3.5 mr-1.5" />
                            Schedule Service
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add the Driver Details Modal */}
      <Dialog open={driverDetailsPanelOpen} onOpenChange={setDriverDetailsPanelOpen} modal={true}>
        <DialogContent className="min-w-[50vw] h-[90vh] p-0">
          {selectedDriverForDetails && (
            <div className="h-full flex flex-col">
              <DialogHeader className="px-6 py-4 border-b sticky top-0 bg-background z-10">
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-xl">Driver Details</DialogTitle>
                  <DialogDescription className="sr-only">Detailed information about the selected driver</DialogDescription>
                  <Button variant="ghost" size="icon" onClick={() => setDriverDetailsPanelOpen(false)} className="rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </DialogHeader>
              
              <div className="flex-1 overflow-y-auto">
                {/* Driver Header Section */}
                <div className="p-6 pb-3">
                  <div className="flex items-center gap-4 p-4 bg-muted/20 rounded-lg">
                    <div className={`h-16 w-16 rounded-full flex items-center justify-center overflow-hidden ${getAvatarColor(selectedDriverForDetails.name)}`}>
                      <User className="h-8 w-8 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-medium">{selectedDriverForDetails.name}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Driver ID: {selectedDriverForDetails.id}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => {
                          setDriverDetailsPanelOpen(false);
                          handleEditDriver(selectedDriverForDetails);
                        }}
                      >
                        <Pencil className="h-4 w-4 mr-2" />
                        Edit Driver
                      </Button>
                    </div>
                  </div>
                </div>
                
                {/* Driver Details Content */}
                <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Performance Overview Card */}
                  <Card className="md:col-span-3">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <Activity className="h-4 w-4 mr-2 text-primary" />
                        Performance Overview
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-5 gap-6">
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Safety Score</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.safetyScore}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.safetyScore}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Fuel Efficiency</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.fuelEfficiency}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.fuelEfficiency}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Time Management</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.timeManagement}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.timeManagement}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Vehicle Handling</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.vehicleHandling}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.vehicleHandling}%` }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <p className="text-sm text-muted-foreground">Customer Satisfaction</p>
                          <div className="flex items-end gap-1">
                            <span className="text-2xl font-bold">{selectedDriverForDetails.customerSatisfaction}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                            <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${selectedDriverForDetails.customerSatisfaction}%` }} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Stats and Activity Cards */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <BarChart className="h-4 w-4 mr-2 text-primary" />
                        Driver Stats
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Route className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Total Mileage</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.mileage.toLocaleString()} mi</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Total Trips</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.trips}</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Idle Time</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.idleTime}%</span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span className="text-sm">Incidents</span>
                        </div>
                        <span className="font-medium">{selectedDriverForDetails.incidents}</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="md:col-span-2">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center">
                        <History className="h-4 w-4 mr-2 text-primary" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Placeholder for recent activity */}
                        <div className="text-sm text-muted-foreground text-center py-6">
                          <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                          <p>Driver activity data will be displayed here</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add the Edit Driver Modal */}
      <Dialog open={driverEditModalOpen} onOpenChange={setDriverEditModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{driverForEdit ? 'Edit Driver' : 'Add New Driver'}</DialogTitle>
            <DialogDescription>
              {driverForEdit ? 'Update driver information' : 'Add a new driver to your fleet'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="name">Driver Name</Label>
              <Input id="name" placeholder="Full Name" defaultValue={driverForEdit?.name || ''} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" placeholder="Phone Number" defaultValue="(555) 123-4567" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" placeholder="Email Address" defaultValue="driver@example.com" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="license">License Number</Label>
              <Input id="license" placeholder="License Number" defaultValue="DL12345678" />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="active">
                <SelectTrigger>
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="on-leave">On Leave</SelectItem>
                  <SelectItem value="unavailable">Unavailable</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDriverEditModalOpen(false)}>Cancel</Button>
            <Button>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add the Delete Driver Confirmation Dialog */}
      <AlertDialog open={driverDeleteDialogOpen} onOpenChange={setDriverDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove {driverToDelete?.name} from your driver records.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteDriver} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}